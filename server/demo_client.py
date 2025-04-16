#!/usr/bin/env python
"""
Demo client Socket.IO để mô phỏng luồng video trực tiếp đến server
Chạy server trước, rồi chạy script này để gửi các frame mô phỏng
"""

import socketio
import time
import base64
import asyncio
import cv2
import numpy as np
import argparse
import sys

# Parse arguments
parser = argparse.ArgumentParser(description="Demo client for Sign Language Platform")
parser.add_argument("--server", default="http://localhost:8000", help="Server URL")
parser.add_argument("--mode", default="word", choices=["character", "word", "sentence"], help="Analysis mode")
args = parser.parse_args()

# Khởi tạo client Socket.IO
sio = socketio.AsyncClient()

# Đường dẫn đến video mẫu (thay thế bằng video thực tế nếu có)
# Nếu không có video, sẽ tạo khung hình giả
VIDEO_PATH = None  # "path/to/your/video.mp4"

@sio.event
async def connect():
    print(f"Đã kết nối đến server: {args.server}")
    await sio.emit('start_session', {})

@sio.event
async def disconnect():
    print("Đã ngắt kết nối từ server")

@sio.event
async def connection_success(data):
    print(f"Kết nối thành công: {data}")
    
@sio.event
async def session_started(data):
    print(f"Phiên đã bắt đầu: {data}")
    # Đặt chế độ phân tích
    await sio.emit('set_analysis_mode', {'mode': args.mode})

@sio.event
async def mode_updated(data):
    print(f"Chế độ phân tích đã được cập nhật: {data}")

@sio.event
async def translation_result(data):
    print(f"Kết quả dịch: {data}")

@sio.event
async def session_ended(data):
    print(f"Phiên đã kết thúc: {data}")

@sio.event
async def error(data):
    print(f"Lỗi: {data}")

async def send_frames():
    """
    Gửi khung hình video lên server, hoặc khung hình giả nếu không có video
    """
    print(f"Bắt đầu gửi khung hình với chế độ {args.mode}...")
    
    cap = None
    if VIDEO_PATH:
        try:
            cap = cv2.VideoCapture(VIDEO_PATH)
            if not cap.isOpened():
                print(f"Không thể mở video: {VIDEO_PATH}")
                cap = None
        except Exception as e:
            print(f"Lỗi khi mở video: {e}")
            cap = None
    
    try:
        frame_count = 0
        
        while True:
            if cap:
                # Đọc từ video thực tế
                ret, frame = cap.read()
                if not ret:
                    # Nếu đã đọc hết video, quay lại từ đầu
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    continue
            else:
                # Tạo khung hình giả
                frame = np.zeros((480, 640, 3), dtype=np.uint8)
                # Vẽ một số hình dạng ngẫu nhiên để mô phỏng chuyển động
                cv2.rectangle(frame, (100 + frame_count % 100, 100), (300, 300), (0, 255, 0), 2)
                cv2.circle(frame, (320, 240), 50 + frame_count % 50, (0, 0, 255), 2)
                # Thêm text mô phỏng
                cv2.putText(frame, f"Frame {frame_count}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            
            # Chuyển đổi frame thành base64
            _, buffer = cv2.imencode('.jpg', frame)
            frame_base64 = base64.b64encode(buffer).decode('utf-8')
            
            # Gửi frame đến server
            await sio.emit('video_frame', {
                'frame': frame_base64,
                'timestamp': time.time(),
                'mode': args.mode
            })
            
            frame_count += 1
            
            # Giữ tốc độ khoảng 10 FPS
            await asyncio.sleep(0.1)
            
            # Chỉ gửi 100 khung hình trong demo
            if frame_count >= 100:
                break
    
    finally:
        if cap:
            cap.release()
        
        # Kết thúc phiên
        await sio.emit('end_session', {})
        await asyncio.sleep(1)  # Chờ server xử lý
        await sio.disconnect()

async def main():
    try:
        await sio.connect(args.server, wait_timeout=10)
        await send_frames()
    except Exception as e:
        print(f"Lỗi: {e}")
    finally:
        if sio.connected:
            await sio.disconnect()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Đã dừng bởi người dùng")
    except Exception as e:
        print(f"Lỗi không xử lý được: {e}")
    sys.exit(0) 