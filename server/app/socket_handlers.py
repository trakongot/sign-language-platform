import socketio
import asyncio
import base64
import time
import random
import cv2
import numpy as np
from io import BytesIO
import logging
from datetime import datetime

from .data import TRANSLATION_RESPONSES

# Khởi tạo server Socket.IO
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=['http://localhost:3000', '*?'], 
    logger=True,  # Enable detailed logging
    engineio_logger=True,  # Log engineio events
    ping_timeout=60,  # Longer ping timeout
    ping_interval=25,  # More frequent pings
    max_http_buffer_size=1e8,  # Larger buffer for video frames
    always_connect=True,  # Accept connections even if there might be issues
)
socket_app = socketio.ASGIApp(
    sio,
    socketio_path='socket.io',  # Explicit socket.io path
    static_files={} # No static files served
)

# Lưu trữ kết nối theo phiên
connected_clients = {}

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Background Task for Sending Fake Results ---
async def send_periodic_results(sid):
    """ Sends fake translation results periodically to a client. """
    logger.info(f"Starting periodic result task for {sid}")
    while sid in connected_clients: # Loop as long as client is connected
        try:
            await asyncio.sleep(2) # Wait for 2 seconds

            # Double-check connection status after sleep
            if sid not in connected_clients:
                break

            client_data = connected_clients[sid]
            mode = client_data.get('last_analysis_mode', 'word').lower()
            if mode not in ["character", "word", "sentence"]:
                mode = "word"

            # results = TRANSLATION_RESPONSES.get(mode, TRANSLATION_RESPONSES["word"])
            # selected_result = random.choice(results)

            # Send simpler fake data
            response = {
                'text': f"Fake update at {datetime.now().strftime('%H:%M:%S')}",
                'confidence': random.uniform(0.7, 0.95), # Fake confidence
                'timestamp': time.time(),
            }

            await sio.emit('translation_result', response, room=sid)
            # logger.debug(f"Sent periodic result to {sid}: {response['text']}")

        except asyncio.CancelledError:
            logger.info(f"Periodic result task for {sid} cancelled.")
            break # Exit loop if task is cancelled
        except Exception as e:
            logger.error(f"Error in periodic result task for {sid}: {str(e)}")
            # Avoid breaking the loop for transient errors, maybe add a delay
            await asyncio.sleep(5) # Wait longer after an error
    logger.info(f"Stopped periodic result task for {sid}")

@sio.event
async def connect(sid, environ):
    """
    Xử lý khi client kết nối
    """
    logger.info(f"Client kết nối: {sid}")
    logger.info(f"Connection environ: {environ.get('HTTP_ORIGIN', 'Unknown origin')}")
    
    # Start background task and store its handle
    task = sio.start_background_task(send_periodic_results, sid)

    connected_clients[sid] = {
        'connected_at': datetime.now(),
        'frames_processed': 0,
        'last_analysis_mode': 'word',  # Mặc định
        'client_info': {
            'origin': environ.get('HTTP_ORIGIN', 'Unknown'),
            'user_agent': environ.get('HTTP_USER_AGENT', 'Unknown'),
        },
        'task': task # Store the task handle
    }
    
    try:
        await sio.emit('connection_success', {'message': 'Kết nối thành công, cập nhật định kỳ đã bắt đầu'}, room=sid)
        logger.info(f"Sent connection_success to {sid}")
    except Exception as e:
        logger.error(f"Error sending connection success: {e}")

@sio.event
async def connect_error(data):
    """
    Log connection errors
    """
    logger.error(f"Connection error: {data}")

@sio.event
async def disconnect(sid):
    """
    Xử lý khi client ngắt kết nối
    """
    logger.info(f"Client ngắt kết nối: {sid}")
    if sid in connected_clients:
        # Cancel the background task associated with this client
        task = connected_clients[sid].get('task')
        if task:
            try:
                task.cancel()
                await task # Wait for cancellation to complete (optional but good practice)
            except asyncio.CancelledError:
                logger.info(f"Task for {sid} was already cancelled.")
            except Exception as e:
                 logger.error(f"Error cancelling task for {sid}: {e}")
        # Remove client data
        del connected_clients[sid]
    else:
        logger.warning(f"Disconnect event for unknown sid: {sid}")

@sio.event
async def video_frame(sid, data):
    """
    Nhận và xử lý khung hình video từ client
    """
    if sid not in connected_clients:
        logger.warning(f"Received frame from unknown sid: {sid}")
        return
    
    client = connected_clients[sid]
    client['frames_processed'] += 1
    logger.debug(f"Received frame {client['frames_processed']} from {sid}")
    
    # Đảm bảo dữ liệu đúng định dạng
    frame_data = data.get('frame')
    timestamp = data.get('timestamp', time.time())
    analysis_mode = data.get('mode', client['last_analysis_mode'])
    client['last_analysis_mode'] = analysis_mode
    
    if not frame_data:
        logger.warning(f"Received empty frame data from {sid}")
        return
    
    # Trong thực tế, bạn sẽ xử lý khung hình để phát hiện ngôn ngữ ký hiệu
    # Ở đây chúng ta sẽ mô phỏng
    await process_frame(sid, frame_data, timestamp, analysis_mode)

async def process_frame(sid, frame_data, timestamp, analysis_mode):
    """
    Xử lý khung hình (mô phỏng)
    """
    try:
        # Mô phỏng xử lý (thực tế sẽ sử dụng ML model)
        # Làm chậm để mô phỏng thời gian xử lý
        frame_process_delay = 0.1
        await asyncio.sleep(frame_process_delay)
        
        # Lấy kết quả phù hợp với chế độ phân tích
        mode = analysis_mode.lower()
        if mode not in ["character", "word", "sentence"]:
            mode = "word"  # Mặc định
        
        # results = TRANSLATION_RESPONSES.get(mode, TRANSLATION_RESPONSES["word"])
        # selected_result = random.choice(results)

        # Send simpler fake data
        response = {
            'text': f"Fake update at {datetime.now().strftime('%H:%M:%S')}",
            'confidence': random.uniform(0.7, 0.95), # Fake confidence
            'timestamp': time.time(),
        }

        await sio.emit('translation_result', response, room=sid)
    
    except Exception as e:
        logger.error(f"Lỗi xử lý khung hình: {str(e)}")
        await sio.emit('error', {'message': f'Lỗi xử lý: {str(e)}'}, room=sid)

@sio.event
async def set_analysis_mode(sid, data):
    """
    Đặt chế độ phân tích cho phiên
    """
    mode = data.get('mode', 'word')
    if sid in connected_clients:
        logger.info(f"Setting analysis mode for {sid} to: {mode}")
        connected_clients[sid]['last_analysis_mode'] = mode
        await sio.emit('mode_updated', {'mode': mode}, room=sid)
    else:
        logger.warning(f"Attempt to set mode for unknown sid: {sid}")

@sio.event
async def start_session(sid, data):
    """
    Bắt đầu phiên mới
    """
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
    """
    Kết thúc phiên
    """
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