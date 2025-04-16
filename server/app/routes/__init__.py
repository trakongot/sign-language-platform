"""API Routes for the Sign Language Platform"""

from .dictionary import router as dictionary_router
from .learn import router as learn_router
from .translate import router as translate_router

__all__ = ["dictionary_router", "learn_router", "translate_router"] 