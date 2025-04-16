from fastapi import APIRouter, Body, File, UploadFile, Form, HTTPException
from typing import Optional
import base64
import time
import random
import json

from ..models import TranslationRequest, TranslationResponse, TranslationResult
from ..data import TRANSLATION_RESPONSES

router = APIRouter(prefix="/translate", tags=["translate"])

@router.post("/video", response_model=TranslationResponse)
async def translate_video(request: TranslationRequest = Body(...)):
    """
    Translate sign language video to text
    """
    # Check the input data
    if not request.video_data and not request.video_url:
        raise HTTPException(status_code=400, detail="You must provide video_data or video_url")
    
    # Simulate processing time
    processing_time = random.uniform(0.5, 2.0)
    time.sleep(0.5)  # Simulate processing delay
    
    # Get the result according to the analysis mode
    mode = request.mode.lower()
    if mode not in ["character", "word", "sentence"]:
        mode = "word"  # Default mode
    
    results = TRANSLATION_RESPONSES.get(mode, TRANSLATION_RESPONSES["word"])
    
    # Randomly select a result from the sample data
    selected_result = random.choice(results)
    
    return {
        "results": [selected_result],
        "analysis_mode": mode,
        "processing_time": processing_time,
        "video_duration": random.uniform(1.0, 10.0)  # Simulate video duration
    }

@router.post("/upload", response_model=TranslationResponse)
async def upload_and_translate(
    file: UploadFile = File(...),
    mode: str = Form("word")
):
    """
    Upload and translate video file
    """
    # Check file
    if not file.filename.lower().endswith(('.mp4', '.webm', '.mov')):
        raise HTTPException(status_code=400, detail="Only MP4, WebM, or MOV video formats are supported")
    
    # In reality, we would save the file and process it
    # This is just a simulation
    
    # Simulate processing time
    processing_time = random.uniform(1.0, 3.0)
    time.sleep(0.5)  # Simulate processing delay
    
    # Get the result according to the analysis mode
    mode = mode.lower()
    if mode not in ["character", "word", "sentence"]:
        mode = "word"  # Default mode
    
    results = TRANSLATION_RESPONSES.get(mode, TRANSLATION_RESPONSES["word"])
    
    # Randomly select 1-3 results from the sample data
    num_results = random.randint(1, 3)
    selected_results = random.sample(results, min(num_results, len(results)))
    return {
        "results": selected_results,
        "analysis_mode": mode,
        "processing_time": processing_time,
        "video_duration": random.uniform(2.0, 15.0) 
    }

@router.get("/modes", response_model=list)
async def get_translation_modes():
    """
    Get the list of sign language analysis modes
    """
    return [
        {"id": "character", "name": "Character Analysis", "description": "Detect individual characters"},
        {"id": "word", "name": "Word Analysis", "description": "Detect complete words"},
        {"id": "sentence", "name": "Sentence Analysis", "description": "Detect and combine into complete sentences"}
    ]
