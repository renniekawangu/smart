from fastapi import APIRouter
from ..schemas import SentimentRequest, SentimentResponse
from ..services import analyze_sentiment

router = APIRouter()


@router.post("/", response_model=SentimentResponse)
async def sentiment(request: SentimentRequest):
    """Analyze sentiment of customer reviews"""
    return await analyze_sentiment(request)
