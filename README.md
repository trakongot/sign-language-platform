# Sign Language Platform

This project provides a platform for translating sign language using video input.

## Demo

![Project Demo](demo.png)

## Features

- Live camera translation via WebSockets
- Video file upload translation
- Analysis mode selection (word, sentence, etc.)
- (Add more features as developed)

## Setup

(Instructions on how to set up and run the project will go here)

### Backend (FastAPI / Socket.IO)

```bash
cd server
pip install -r requirements.txt
python run.py # or uvicorn app.main:app --reload
```

### Frontend (Next.js)

```bash
cd client
npm install
npm run dev
```
