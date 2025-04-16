from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

# Dictionary models
class DictionaryItem(BaseModel):
    id: int
    word: str
    category: str
    description: str
    videoUrl: str
    thumbnail: str
    variations: List[str] = []
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
    beginner: List[Lesson] = []
    intermediate: List[Lesson] = []
    advanced: List[Lesson] = []

class LessonDetailResponse(BaseModel):
    lesson: Lesson

# Translation models
class TranslationResult(BaseModel):
    text: str
    confidence: float

class TranslationRequest(BaseModel):
    video_data: Optional[str] = None  # Base64 encoded video data
    video_url: Optional[str] = None   # URL for an already uploaded video
    mode: str = "word"  # "character", "word", or "sentence"

class TranslationResponse(BaseModel):
    results: List[TranslationResult]
    analysis_mode: str
    processing_time: float
    video_duration: Optional[float] = None
    
# Socket.io models
class StreamingMessage(BaseModel):
    frame: str  # Base64 encoded image frame
    timestamp: float

class StreamingResponse(BaseModel):
    text: str  # Changed from 'result' to 'text'
    confidence: float
    timestamp: float 