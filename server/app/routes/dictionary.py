from fastapi import APIRouter, Query, Path, HTTPException
from typing import List, Optional

from ..models import DictionaryItem, DictionaryDetailResponse, DictionarySearchResponse
from ..data import DICTIONARY_ITEMS, DICTIONARY_CATEGORIES

router = APIRouter(prefix="/dictionary", tags=["dictionary"])

@router.get("/categories", response_model=List[str])
async def get_categories():
    """
    Get the list of dictionary categories
    """
    return DICTIONARY_CATEGORIES

@router.get("/items", response_model=DictionarySearchResponse)
async def get_dictionary_items(
    query: Optional[str] = Query(None, description="Search keyword"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(20, description="Maximum number of results"),
    offset: int = Query(0, description="Starting position")
):
    """
    Get the list of dictionary items with search and filter capabilities
    """
    items = DICTIONARY_ITEMS
    total_items = len(items)
    
    # Filter by category if provided
    if category and category.lower() != "all":
        items = [item for item in items if item["category"] == category]
    
    # Search by keyword if provided
    if query:
        query = query.lower()
        filtered_items = []
        for item in items:
            if (query in item["word"].lower() or 
                query in item["description"].lower() or 
                any(query in variation.lower() for variation in item["variations"])):
                filtered_items.append(item)
        items = filtered_items
    
    # Get the total number of results after filtering
    total_filtered = len(items)
    
    # Pagination
    items = items[offset:offset + limit]
    
    return {
        "items": items,
        "total": total_filtered
    }

@router.get("/items/{item_id}", response_model=DictionaryDetailResponse)
async def get_dictionary_item(item_id: int = Path(..., description="ID of the word in the dictionary")):
    """
    Get the details of a dictionary item by its ID
    """
    for item in DICTIONARY_ITEMS:
        if item["id"] == item_id:
            return {"item": item}
    
    raise HTTPException(status_code=404, detail="Dictionary item not found with this ID")

@router.get("/search/{keyword}", response_model=DictionarySearchResponse)
async def search_dictionary(
    keyword: str = Path(..., description="Search keyword"),
    limit: int = Query(10, description="Maximum number of results")
):
    """
    Quickly search the dictionary by keyword
    """
    keyword = keyword.lower()
    matching_items = []
    
    for item in DICTIONARY_ITEMS:
        if (keyword in item["word"].lower() or 
            any(keyword in variation.lower() for variation in item["variations"])):
            matching_items.append(item)
            
            if len(matching_items) >= limit:
                break
    
    return {
        "items": matching_items,
        "total": len(matching_items)
    }

@router.get("/random", response_model=DictionaryItem)
async def get_random_dictionary_item():
    """
    Get a random dictionary item
    """
    import random
    return random.choice(DICTIONARY_ITEMS)
