# Sign Language Platform API

Backend API cho ứng dụng Sign Language Platform, xây dựng với FastAPI và Socket.IO.

## Tính năng

- API Dictionary: Cung cấp từ điển ngôn ngữ ký hiệu
- API Learn: Hỗ trợ học ngôn ngữ ký hiệu với các bài học
- API Translate: Dịch ngôn ngữ ký hiệu sang văn bản
- Socket.IO: Hỗ trợ dịch ngôn ngữ ký hiệu theo thời gian thực

## Cài đặt

1. Cài đặt các gói phụ thuộc:

```bash
pip install -r requirements.txt
```

2. Khởi động server:

```bash
uvicorn app.main:app --reload
```

Hoặc sử dụng script Python:

```bash
python -m app.main
```

## API Endpoints

### Dictionary API

- `GET /dictionary/categories`: Lấy danh sách các danh mục từ điển
- `GET /dictionary/items`: Lấy danh sách từ điển với khả năng tìm kiếm và lọc
- `GET /dictionary/items/{item_id}`: Lấy chi tiết của một từ trong từ điển theo ID
- `GET /dictionary/search/{keyword}`: Tìm kiếm nhanh từ điển theo từ khóa
- `GET /dictionary/random`: Lấy một từ ngẫu nhiên từ từ điển

### Learn API

- `GET /learn/lessons`: Lấy danh sách tất cả các bài học theo cấp độ
- `GET /learn/lessons/{level}`: Lấy danh sách bài học theo cấp độ cụ thể
- `GET /learn/lesson/{lesson_id}`: Lấy chi tiết của một bài học theo ID
- `GET /learn/recommendations`: Lấy các đề xuất bài học dựa trên tiến độ của người dùng
- `GET /learn/progress/{lesson_id}/{progress}`: Cập nhật tiến độ cho một bài học

### Translate API

- `POST /translate/video`: Dịch video ngôn ngữ ký hiệu thành văn bản
- `POST /translate/upload`: Tải lên và dịch file video
- `GET /translate/modes`: Lấy danh sách các chế độ phân tích ngôn ngữ ký hiệu

### Socket.IO Events

- `connect`: Xử lý khi client kết nối
- `disconnect`: Xử lý khi client ngắt kết nối
- `video_frame`: Nhận và xử lý khung hình video từ client
- `set_analysis_mode`: Đặt chế độ phân tích cho phiên
- `start_session`: Bắt đầu phiên mới
- `end_session`: Kết thúc phiên

## Tài liệu API

Truy cập `/docs` hoặc `/redoc` sau khi khởi động server để xem tài liệu API tương tác.

## Môi trường

Backend có thể được cấu hình thông qua các biến môi trường:

- `PORT`: Cổng để chạy server (mặc định: 8000)
- `DEBUG`: Bật/tắt chế độ gỡ lỗi (mặc định: False)
- `LOG_LEVEL`: Cấp độ ghi log (mặc định: info)

Các biến này có thể được đặt trong file `.env` ở thư mục gốc.
