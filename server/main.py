import os
import time
import random
import asyncio
import logging
import base64
from datetime import datetime
from typing import List, Optional, Dict, Any, Union
from io import BytesIO
import numpy as np
import cv2
import torch
import mediapipe as mp

# FastAPI và các thư viện liên quan
from fastapi import FastAPI, APIRouter, Request, Body, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# Socket.IO
import socketio

# Pydantic models
from pydantic import BaseModel, Field

# Tải biến môi trường
from dotenv import load_dotenv
load_dotenv()

# Import model
from model.bi_lstm_att_14 import BiLSTMAttention14
from model.preprocess import extract_frames, get_hand_landmarks

# Import data
from data import TRANSLATION_RESPONSES, DICTIONARY_ITEMS

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Model constants
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
CHARACTERS = ['a', 'ă', 'â', 'b', 'c', 'd', 'đ', 'e', 'ê', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'ô', 'ơ', 'p', 'q', 'r', 's', 't', 'u', 'ư', 'v', 'x', 'y', '/', '\\', '?', '~', '.']
WORDS = ['xin chào', 'tạm biệt', 'cảm ơn', 'xin lỗi', 'ở đâu', 'ai', 'khi nào', 'tại sao', 'làm ơn', 'giúp đỡ', 'ghét', 'hạnh phúc', 'biết ơn', 'buồn', 'mệt', 'khát']
GLOBS = CHARACTERS + WORDS
INDEX_TO_GLOB = {index: glob for index, glob in enumerate(GLOBS)}

# Initialize model
word_model = BiLSTMAttention14(n_classes=len(GLOBS)).to(DEVICE)
checkpoint = torch.load('model/word_model.pth', map_location=DEVICE)
word_model.load_state_dict(checkpoint['model_state'])
word_model.eval()

char_model = BiLSTMAttention14(n_classes=len(CHARACTERS)).to(DEVICE)
checkpoint = torch.load('model/char_model.pth', map_location=DEVICE)
char_model.load_state_dict(checkpoint['model_state'])
char_model.eval()


# Initialize MediaPipe hands
hands = mp.solutions.hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
)

# Frame buffer for batch processing
FRAME_BUFFER_SIZE = 150
frame_buffer = {}
landmark_buffer = {}

# =========================================================
# Pydantic Models
# =========================================================

# Dictionary models
# noinspection PyDataclass
class DictionaryItem(BaseModel):
    id: int
    word: str
    category: str
    description: str
    videoUrl: str
    thumbnail: str
    variations: List[str] = ()
    examples: List[str] = []

class DictionaryCategory(BaseModel):
    name: str

class DictionarySearchResponse(BaseModel):
    items: List[DictionaryItem]
    total: int
    
class DictionaryDetailResponse(BaseModel):
    item: DictionaryItem

# Learn models
class LessonContent(BaseModel):
    type: str
    title: str
    url: Optional[str] = None
    duration: Optional[str] = None
    content: Optional[str] = None
    instructions: Optional[str] = None
    items: Optional[List[str]] = None

class Lesson(BaseModel):
    id: int
    title: str
    description: str
    duration: str
    progress: int = 0
    image: str
    content: Optional[List[LessonContent]] = None

class LessonsResponse(BaseModel):
    beginner: List[Lesson] = ()
    intermediate: List[Lesson] = ()
    advanced: List[Lesson] = ()

class LessonDetailResponse(BaseModel):
    lesson: Lesson

# Translation models
class TranslationResult(BaseModel):
    text: str
    confidence: float

class TranslationRequest(BaseModel):
    video_data: Optional[str] = None  # Dữ liệu video mã hóa Base64
    video_url: Optional[str] = None   # URL cho video đã tải lên
    mode: str = "word"  # "character", "word", hoặc "sentence"

class TranslationResponse(BaseModel):
    results: List[TranslationResult]
    analysis_mode: str
    processing_time: float
    video_duration: Optional[float] = None
    
# Socket.io models
class StreamingMessage(BaseModel):
    frame: str  # Khung hình mã hóa Base64
    timestamp: float

class StreamingResponse(BaseModel):
    text: str
    confidence: float
    timestamp: float

# =========================================================
# Dữ liệu mẫu cho các API responses
# =========================================================

# Ví dụ kết quả dịch
# TRANSLATION_RESPONSES = {
#     "character": [
#         {"text": "X-I-N C-H-À-O", "confidence": 0.95},
#         {"text": "C-Ả-M Ơ-N", "confidence": 0.92},
#         {"text": "T-Ạ-M B-I-Ệ-T", "confidence": 0.88},
#         {"text": "K-H-Ỏ-E K-H-Ô-N-G", "confidence": 0.85},
#         {"text": "T-Ô-I T-Ê-N L-À", "confidence": 0.91},
#     ],
#     "word": [
#         {"text": "Xin chào", "confidence": 0.95},
#         {"text": "Cảm ơn bạn", "confidence": 0.92},
#         {"text": "Tạm biệt nhé", "confidence": 0.88},
#         {"text": "Bạn khỏe không", "confidence": 0.85},
#         {"text": "Tôi tên là John", "confidence": 0.91},
#     ],
#     "sentence": [
#         {"text": "Xin chào, tôi rất vui được gặp bạn.", "confidence": 0.95},
#         {"text": "Cảm ơn bạn rất nhiều vì đã giúp đỡ tôi.", "confidence": 0.92},
#         {"text": "Tạm biệt và hẹn gặp lại bạn sau.", "confidence": 0.88},
#         {"text": "Hôm nay bạn khỏe không? Tôi hy vọng bạn có một ngày tốt lành.", "confidence": 0.85},
#         {"text": "Tôi tên là John và tôi đang học ngôn ngữ ký hiệu.", "confidence": 0.91},
#     ]
# }

# Dữ liệu từ điển - rút gọn để dễ đọc
# DICTIONARY_ITEMS = [
#     {
#         "id": 1,
#         "word": "Xin chào",
#         "category": "Chào hỏi",
#         "description": "Cử chỉ chào hỏi cơ bản, thường dùng khi gặp ai đó",
#         "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
#         "thumbnail": "/placeholder.svg?height=150&width=200",
#         "variations": ["Chào", "Hi"],
#         "examples": [
#             "Xin chào, tôi tên là Lan",
#             "Xin chào, rất vui được gặp bạn"
#         ]
#     },
#     {
#         "id": 2,
#         "word": "Cảm ơn",
#         "category": "Chào hỏi",
#         "description": "Cử chỉ thể hiện lòng biết ơn",
#         "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
#         "thumbnail": "/placeholder.svg?height=150&width=200",
#         "variations": ["Cám ơn", "Biết ơn"],
#         "examples": [
#             "Cảm ơn bạn rất nhiều",
#             "Cảm ơn vì đã giúp đỡ"
#         ]
#     },
#      {
#         "id": 3,
#         "word": "A",
#         "category": "Chữ cái",
#         "description": "Chữ A",
#         "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
#         "thumbnail": "/placeholder.svg?height=150&width=200",
#         "variations": ["Cám ơn", "Biết ơn"],
#         "examples": [
#             "An ăn cơm chưa",
#             "Cảm ơn vì đã giúp đỡ"
#         ]
#     },
# ]

# =========================================================
# Thiết lập Socket.IO
# =========================================================

# Khởi tạo Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=['http://localhost:3000', '*'], 
    logger=True,
    engineio_logger=True,
    ping_timeout=60,
    ping_interval=25,
    max_http_buffer_size=1e8,
    always_connect=True,
)
socket_app = socketio.ASGIApp(sio, socketio_path='socket.io')

# Lưu trữ kết nối client
connected_clients = {}

# Nhiệm vụ nền gửi kết quả định kỳ
async def send_periodic_results(sid):
    """Gửi kết quả dịch giả lập định kỳ cho client."""
    logger.info(f"Bắt đầu nhiệm vụ gửi kết quả định kỳ cho {sid}")
    while sid in connected_clients:
        try:
            await asyncio.sleep(2)  # Đợi 2 giây

            # Kiểm tra lại trạng thái kết nối sau khi đợi
            if sid not in connected_clients:
                break

            client_data = connected_clients[sid]
            mode = client_data.get('last_analysis_mode', 'word').lower()
            if mode not in ["character", "word", "sentence"]:
                mode = "word"

            # Lấy kết quả dựa trên chế độ
            results = TRANSLATION_RESPONSES.get(mode, TRANSLATION_RESPONSES["word"])
            selected_result = random.choice(results)

            # Gửi kết quả cho client
            response = {
                'text': selected_result["text"],
                'confidence': selected_result["confidence"],
                'timestamp': time.time(),
            }

            await sio.emit('translation_result', response, room=sid)
            logger.info(f"Đã gửi kết quả cho {sid}: {response['text']}")

        except asyncio.CancelledError:
            logger.info(f"Nhiệm vụ gửi kết quả định kỳ cho {sid} đã bị hủy.")
            break
        except Exception as e:
            logger.error(f"Lỗi trong nhiệm vụ gửi kết quả định kỳ cho {sid}: {str(e)}")
            await asyncio.sleep(5)  # Đợi lâu hơn sau khi gặp lỗi
    
    logger.info(f"Đã dừng nhiệm vụ gửi kết quả định kỳ cho {sid}")

# Socket.IO event handlers
@sio.event
async def connect(sid, environ):
    """Xử lý khi client kết nối"""
    logger.info(f"Client kết nối: {sid}")
    logger.info(f"Nguồn gốc kết nối: {environ.get('HTTP_ORIGIN', 'Nguồn không xác định')}")
    
    # Bắt đầu nhiệm vụ nền cho client này
    task = sio.start_background_task(send_periodic_results, sid)

    # Lưu thông tin client
    connected_clients[sid] = {
        'connected_at': datetime.now(),
        'frames_processed': 0,
        'last_analysis_mode': 'word',  # Mặc định
        'client_info': {
            'origin': environ.get('HTTP_ORIGIN', 'Unknown'),
            'user_agent': environ.get('HTTP_USER_AGENT', 'Unknown'),
        },
        'task': task  # Lưu handle của task để dọn dẹp sau
    }
    
    try:
        await sio.emit('connection_success', {'message': 'Kết nối thành công, cập nhật định kỳ đã bắt đầu'}, room=sid)
        logger.info(f"Đã gửi kết nối thành công cho {sid}")
    except Exception as e:
        logger.error(f"Lỗi khi gửi thông báo kết nối thành công: {e}")

@sio.event
async def connect_error(data):
    """Ghi nhật ký lỗi kết nối"""
    logger.error(f"Lỗi kết nối: {data}")

@sio.event
async def disconnect(sid):
    """Xử lý khi client ngắt kết nối"""
    logger.info(f"Client ngắt kết nối: {sid}")
    if sid in connected_clients:
        # Hủy nhiệm vụ nền
        task = connected_clients[sid].get('task')
        if task:
            try:
                task.cancel()
                await task  # Đợi việc hủy hoàn tất
            except asyncio.CancelledError:
                logger.info(f"Nhiệm vụ cho {sid} đã được hủy.")
            except Exception as e:
                logger.error(f"Lỗi khi hủy nhiệm vụ cho {sid}: {e}")
        # Xóa dữ liệu client
        del connected_clients[sid]
    else:
        logger.warning(f"Sự kiện ngắt kết nối cho sid không xác định: {sid}")

@sio.event
async def video_frame(sid, data):
    """Xử lý khung hình video từ client"""
    if sid not in connected_clients:
        logger.warning(f"Nhận được khung hình từ sid không xác định: {sid}")
        return
    
    client = connected_clients[sid]
    client['frames_processed'] += 1
    logger.debug(f"Đã nhận khung hình {client['frames_processed']} từ {sid}")
    
    # Kiểm tra định dạng dữ liệu
    frame_data = data.get('frame')  
    timestamp = data.get('timestamp', time.time())
    analysis_mode = data.get('mode', client['last_analysis_mode'])
    client['last_analysis_mode'] = analysis_mode
    
    if not frame_data:
        logger.warning(f"Nhận được dữ liệu khung hình trống từ {sid}")
        return
    
    # Xử lý khung hình
    await process_frame(sid, frame_data, timestamp, analysis_mode)

async def process_frame(sid, frame_data, timestamp, analysis_mode):
    """Xử lý khung hình và gửi kết quả"""
    try:
        # Chuyển đổi base64 frame thành numpy array
        image_data = base64.b64decode(frame_data.split(',')[1] if ',' in frame_data else frame_data)
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Convert BGR to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Initialize buffers for this session if not exists
        if sid not in frame_buffer:
            frame_buffer[sid] = []
            landmark_buffer[sid] = []
        
        # Add frame to buffer
        frame_buffer[sid].append(frame_rgb)
        
        # Keep only last FRAME_BUFFER_SIZE frames
        if len(frame_buffer[sid]) > FRAME_BUFFER_SIZE:
            frame_buffer[sid] = frame_buffer[sid][-FRAME_BUFFER_SIZE:]
        
        # Process frames in batches
        if len(frame_buffer[sid]) >= FRAME_BUFFER_SIZE:
            # Get hand landmarks for all frames
            landmarks = []
            for f in frame_buffer[sid]:
                landmark = get_hand_landmarks(f, np.array(list(range(21))), verbose=False)
                landmarks.append(landmark)
            
            # Convert to tensor
            video_landmarks = np.array(landmarks)
            video_landmarks = torch.from_numpy(video_landmarks).to(torch.float32)
            
            # Get prediction
            with torch.no_grad():
                outputs = model(video_landmarks.unsqueeze(0))
                _, pred = torch.max(outputs, 1)
                confidence = torch.softmax(outputs, dim=1)[0][pred[0]].item()
            
            # Get predicted text
            predicted_text = INDEX_TO_GLOB[int(pred[0])]
            
            # # If confidence is below threshold, use unknown text
            # if confidence < MIN_CONFIDENCE_THRESHOLD:
            #     predicted_text = UNKNOWN_TEXT
            
            # Clear buffers after processing
            frame_buffer[sid] = []
            landmark_buffer[sid] = []
            
            # Send result
            response = {
                'text': predicted_text,
                'confidence': confidence,
                'timestamp': time.time(),
            }
            
            await sio.emit('translation_result', response, room=sid)
    
    except Exception as e:
        logger.error(f"Lỗi xử lý khung hình: {str(e)}")
        await sio.emit('error', {'message': f'Lỗi xử lý: {str(e)}'}, room=sid)

@sio.event
async def start_session(sid, data):
    """Bắt đầu một phiên mới"""
    if sid in connected_clients:
        client = connected_clients[sid]
        client['frames_processed'] = 0
        client['session_started'] = True
        client['session_id'] = f"session_{int(time.time())}"
        
        await sio.emit('session_started', {
            'session_id': client['session_id'],
            'started_at': datetime.now().isoformat()
        }, room=sid)

@sio.event
async def end_session(sid, data):
    """Kết thúc một phiên"""
    if sid in connected_clients:
        client = connected_clients[sid]
        
        if client.get('session_started', False):
            summary = {
                'session_id': client.get('session_id', 'unknown'),
                'frames_processed': client['frames_processed'],
                'duration': (datetime.now() - client['connected_at']).total_seconds(),
                'mode': client['last_analysis_mode']
            }
            
            client['session_started'] = False
            await sio.emit('session_ended', summary, room=sid)

# =========================================================
# FastAPI REST API Routes
# =========================================================

# Tạo API routers
dictionary_router = APIRouter(prefix="/dictionary", tags=["dictionary"])
learn_router = APIRouter(prefix="/learn", tags=["learn"])
translate_router = APIRouter(prefix="/translate", tags=["translate"])

# Dictionary routes
@dictionary_router.get("/search", response_model=DictionarySearchResponse)
async def search_dictionary(q: Optional[str] = None, category: Optional[str] = None):
    """
    Tìm kiếm trong từ điển ngôn ngữ ký hiệu
    """
    items = DICTIONARY_ITEMS
    
    # Áp dụng bộ lọc
    if q:
        q = q.lower()
        items = [item for item in items if q in item["word"].lower() or 
                any(q in variation.lower() for variation in item["variations"])]
    
    if category and category.lower() != "tất cả":
        items = [item for item in items if item["category"].lower() == category.lower()]
    
    return {
        "items": items,
        "total": len(items)
    }

@dictionary_router.get("/items", response_model=DictionarySearchResponse)
async def get_dictionary_items(limit: int = 100, offset: int = 0):
    """
    Lấy danh sách từ điển có phân trang
    """
    # Áp dụng phân trang
    paginated_items = DICTIONARY_ITEMS[offset:offset + limit]
    
    return {
        "items": paginated_items,
        "total": len(DICTIONARY_ITEMS)
    }

@dictionary_router.get("/item/{item_id}", response_model=DictionaryDetailResponse)
async def get_dictionary_item(item_id: int):
    """
    Lấy thông tin chi tiết cho một mục từ điển
    """
    for item in DICTIONARY_ITEMS:
        if item["id"] == item_id:
            return {"item": item}
    
    raise HTTPException(status_code=404, detail=f"Mục từ điển {item_id} không tìm thấy")

@dictionary_router.get("/categories", response_model=List[str])
async def get_dictionary_categories():
    """
    Lấy danh sách các danh mục từ điển
    """
    return ["Tất cả"]

# Translation routes
@translate_router.post("/video", response_model=TranslationResponse)
async def translate_video(request: TranslationRequest = Body(...)):
    if mode == 'word':
        FRAME_BUFFER_SIZE = 150
    else:
        FRAME_BUFFER_SIZE = 75
    print(FRAME_BUFFER_SIZE)
    start_time = time.time()
    
    # Kiểm tra dữ liệu đầu vào
    if not request.video_data and not request.video_url:
        raise HTTPException(status_code=400, detail="video_data or video_url is required")
    
    try:
        # Process video data
        if request.video_data:
            # Decode base64 video data
            video_data = base64.b64decode(request.video_data.split(',')[1] if ',' in request.video_data else request.video_data)
            
            # Save to temporary file
            temp_path = f"temp_{int(time.time())}.mp4"
            with open(temp_path, 'wb') as f:
                f.write(video_data)
            
            # Extract frames
            frames = extract_frames(temp_path)
            
            # Clean up temp file
            os.remove(temp_path)
        else:
            # Process video URL
            frames = extract_frames(request.video_url)
        
        # Limit frames
        if frames.shape[0] > FRAME_BUFFER_SIZE:
            frames = frames[:FRAME_BUFFER_SIZE]
        
        # Get hand landmarks
        landmarks = []
        for frame in frames:
            landmark = get_hand_landmarks(frame, np.array(list(range(21))), verbose=False)
            landmarks.append(landmark)
        
        # Pad if needed
        while len(landmarks) < FRAME_BUFFER_SIZE:
            landmarks.append(np.zeros((42, 3)))
        
        # Convert to tensor
        video_landmarks = np.array(landmarks)
        video_landmarks = torch.from_numpy(video_landmarks).to(torch.float32)
        
        # Get prediction
        with torch.no_grad():
            if request.mode == 'word':
                outputs = word_model(video_landmarks.unsqueeze(0))
            else:
                outputs = char_model(video_landmarks.unsqueeze(0))
            probs = torch.softmax(outputs, dim=1)
            confidence, pred = torch.max(probs, dim=1)
            confidence = confidence.item()
        
        predicted_text = INDEX_TO_GLOB[int(pred[0])]
        processing_time = time.time() - start_time
        return {
            "results": [{"text": predicted_text, "confidence": confidence}],
            "analysis_mode": request.mode,
            "processing_time": processing_time,
            "video_duration": len(frames) / 60.0
        }
        
    except Exception as e:
        logger.error(f"Lỗi xử lý video: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error while processing video: {str(e)}")

@translate_router.post("/upload", response_model=TranslationResponse)
async def upload_and_translate(file: UploadFile = File(...), mode: str = Form("word")):
    if mode == 'word':
        FRAME_BUFFER_SIZE = 150
    else:
        FRAME_BUFFER_SIZE = 75
    print(FRAME_BUFFER_SIZE)
    start_time = time.time()
    
    # Kiểm tra tệp
    if not file.filename.lower().endswith(('.mp4', '.webm', '.mov')):
        raise HTTPException(status_code=400, detail="Only MP4, WebM, or MOV")
    
    try:
        # Save uploaded file
        temp_path = f"temp_{int(time.time())}.mp4"
        with open(temp_path, 'wb') as f:
            content = await file.read()
            f.write(content)
        
        # Extract frames
        frames = extract_frames(temp_path)
        
        # Clean up temp file
        os.remove(temp_path)
        
        # Limit frames to 150
        if frames.shape[0] > FRAME_BUFFER_SIZE:
            frames = frames[:FRAME_BUFFER_SIZE]
        
        # Get hand landmarks
        landmarks = []
        for frame in frames:
            landmark = get_hand_landmarks(frame, np.array(list(range(21))), verbose=False)
            landmarks.append(landmark)
        
        # Pad if needed
        while len(landmarks) < FRAME_BUFFER_SIZE:
            landmarks.append(np.zeros((42, 3)))
        
        # Convert to tensor
        video_landmarks = np.array(landmarks)
        video_landmarks = torch.from_numpy(video_landmarks).to(torch.float32)
        
        # Get prediction
        with torch.no_grad():
            if mode == 'word':
                outputs = word_model(video_landmarks.unsqueeze(0))
            else:
                outputs = char_model(video_landmarks.unsqueeze(0))
            probs = torch.softmax(outputs, dim=1)
            confidence, pred = torch.max(probs, dim=1)
            confidence = confidence.item()
        predicted_text = INDEX_TO_GLOB[int(pred[0])]
        processing_time = time.time() - start_time
        return {
            "results": [{"text": predicted_text, "confidence": confidence}],
            "analysis_mode": mode,
            "processing_time": processing_time,
            "video_duration": len(frames) / 60.0
        }
    except Exception as e:
        logger.error(f"Lỗi xử lý video: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý video: {str(e)}")

@translate_router.get("/modes", response_model=list)
async def get_translation_modes():
    """
    Lấy danh sách các chế độ phân tích ngôn ngữ ký hiệu
    """
    return [
        {"id": "character", "name": "Character Analysis", "description": "Detect individual characters"},
        {"id": "word", "name": "Word Analysis", "description": "Detect complete words"},
    ]

# =========================================================
# Thiết lập ứng dụng FastAPI
# =========================================================

# Tạo ứng dụng FastAPI
app = FastAPI(
    title="API Nền tảng Ngôn ngữ Ký hiệu",
    description="API cho nền tảng học tập và dịch thuật ngôn ngữ ký hiệu",
    version="1.0.0"
)

# Thêm CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả nguồn trong môi trường phát triển (hạn chế trong sản xuất)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Middleware đo thời gian xử lý yêu cầu
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Bao gồm các routers
app.include_router(dictionary_router)
app.include_router(learn_router)
app.include_router(translate_router)

# Gắn Socket.IO tại đường dẫn được chỉ định
app.mount("/socket.io", socket_app)

# Endpoint gốc
@app.get("/")
async def root():
    return {
        "app": "API Nền tảng Ngôn ngữ Ký hiệu",
        "version": "1.0.0",
        "documentation": "/docs",
        "endpoints": {
            "dictionary": "/dictionary",
            "learn": "/learn",
            "translate": "/translate",
            "websocket": "/socket.io"
        }
    }

# Endpoint kiểm tra sức khỏe
@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": time.time()}

# Xử lý ngoại lệ toàn cục
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Xử lý ngoại lệ toàn cục bắt được: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": f"Lỗi máy chủ nội bộ: Đã xảy ra lỗi không mong muốn."}
    )

# =========================================================
# Điểm vào ứng dụng
# =========================================================

if __name__ == "__main__":
    # Lấy cổng từ biến môi trường hoặc sử dụng giá trị mặc định
    port = int(os.getenv("PORT", 8000))
    
    # Khởi động máy chủ Uvicorn
    uvicorn.run(
        "main:app",  # Đường dẫn đến phiên bản ứng dụng FastAPI
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    ) 