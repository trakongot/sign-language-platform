import os
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Get port from environment variable or use default
    port = int(os.getenv("PORT", 8000))
    
    # Get host from environment variable or use default
    host = os.getenv("HOST", "0.0.0.0")
    
    # Configure logging
    log_level = os.getenv("LOG_LEVEL", "info")
    
    # Start the server
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,  # Enable auto-reload during development
        log_level=log_level,
        workers=1  # Use single worker for development
    ) 