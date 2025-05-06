from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# Import modules
from app.routes import dictionary_router, learn_router, translate_router
# Import the Socket.IO ASGI application wrapper
from .socket_handlers import socket_app

# Create FastAPI application instance
app = FastAPI(
    title="Sign Language Platform API",
    description="API for the sign language learning and translation platform",
    version="1.0.0"
)

# Middleware to measure request processing time
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development (restrict in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"], # Expose all headers (can be restricted)
)

# Add API routers
app.include_router(dictionary_router)
app.include_router(learn_router)
app.include_router(translate_router)

# Mount the Socket.IO ASGI app at the designated path
# This is the standard way for FastAPI/ASGI integration
app.mount("/socket.io", socket_app)

# Attach Socket.IO server directly to the FastAPI app - REMOVED (Caused KeyError)
# sio.attach(app)

# Root endpoint
@app.get("/")
async def root():
    return {
        "app": "Sign Language Platform API",
        "version": "1.0.0",
        "documentation": "/docs",
        "endpoints": {
            "dictionary": "/dictionary",
            "learn": "/learn",
            "translate": "/translate",
            "websocket": "/socket.io" # Correct path for Socket.IO
        }
    }

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": time.time()}

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # In a real app, log the exception details here
    print(f"Global exception handler caught: {exc}") # Basic logging
    return JSONResponse(
        status_code=500,
        content={"message": f"Internal Server Error: An unexpected error occurred."}
    )

# Script execution entry point
if __name__ == "__main__":
    # Get port from environment variable or use default
    port = int(os.getenv("PORT", 8000))
    
    # Start the Uvicorn server
    uvicorn.run(
        "app.main:app", # Path to the FastAPI app instance
        host="0.0.0.0", # Listen on all available network interfaces
        port=port,
        reload=True,    # Enable auto-reload for development
        log_level="info" # Set logging level
    ) 