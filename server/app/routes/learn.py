from fastapi import APIRouter, Path, HTTPException
from typing import List, Optional

from ..models import Lesson, LessonsResponse, LessonDetailResponse
from ..data import LEARNING_LESSONS

router = APIRouter(prefix="/learn", tags=["learn"])

@router.get("/lessons", response_model=LessonsResponse)
async def get_lessons():
    """
    Get the list of all lessons by level
    """
    return LEARNING_LESSONS

@router.get("/lessons/{level}", response_model=List[Lesson])
async def get_lessons_by_level(level: str = Path(..., description="Lesson level: beginner, intermediate, advanced")):
    """
    Get the list of lessons for a specific level
    """
    if level.lower() not in LEARNING_LESSONS:
        raise HTTPException(status_code=404, detail=f"Level '{level}' not found")
    
    return LEARNING_LESSONS[level.lower()]

@router.get("/lesson/{lesson_id}", response_model=LessonDetailResponse)
async def get_lesson_detail(lesson_id: int = Path(..., description="ID of the lesson")):
    """
    Get the details of a lesson by its ID
    """
    for level in LEARNING_LESSONS:
        for lesson in LEARNING_LESSONS[level]:
            if lesson["id"] == lesson_id:
                return {"lesson": lesson}
    
    raise HTTPException(status_code=404, detail=f"Lesson not found with ID {lesson_id}")

@router.get("/recommendations", response_model=List[Lesson])
async def get_lesson_recommendations():
    """
    Get lesson recommendations based on the user's progress
    """
    # In reality, this would be based on the user's progress and behavior
    # Here, we are just recommending a few basic lessons
    
    recommendations = []
    for level in LEARNING_LESSONS:
        for lesson in LEARNING_LESSONS[level][:1]:  # Only taking the first lesson from each level
            recommendations.append(lesson)
    
    return recommendations

@router.get("/progress/{lesson_id}/{progress}", response_model=Lesson)
async def update_lesson_progress(
    lesson_id: int = Path(..., description="ID of the lesson"),
    progress: int = Path(..., description="New progress (0-100)")
):
    """
    Update the progress for a lesson (simulated)
    """
    if not 0 <= progress <= 100:
        raise HTTPException(status_code=400, detail="Progress must be between 0 and 100")
    
    found_lesson = None
    for level in LEARNING_LESSONS:
        for lesson in LEARNING_LESSONS[level]:
            if lesson["id"] == lesson_id:
                found_lesson = lesson
                # In reality, we would update the progress in the database
                # This is just a simulation
                lesson_copy = dict(lesson)
                lesson_copy["progress"] = progress
                return lesson_copy
    
    if not found_lesson:
        raise HTTPException(status_code=404, detail=f"Lesson not found with ID {lesson_id}")
