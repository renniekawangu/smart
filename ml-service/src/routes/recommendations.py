from fastapi import APIRouter
from ..schemas import RecommendationRequest, RecommendationResponse
from ..services import get_recommendations

router = APIRouter()


@router.post("/", response_model=RecommendationResponse)
async def recommend(request: RecommendationRequest):
    """Get personalized lodging recommendations"""
    return await get_recommendations(request)
