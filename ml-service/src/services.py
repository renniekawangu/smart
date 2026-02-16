from .models import sentiment_analyzer, recommendation_engine, price_model
from .schemas import (
    RecommendationRequest,
    RecommendationResponse,
    PricePredictionRequest,
    PricePredictionResponse,
    SentimentRequest,
    SentimentResponse,
)


async def get_recommendations(request: RecommendationRequest) -> RecommendationResponse:
    """Get personalized lodging recommendations"""
    result = recommendation_engine.get_recommendations(request.user_id, request.limit)
    return RecommendationResponse(**result)


async def predict_price(request: PricePredictionRequest) -> PricePredictionResponse:
    """Predict price for a lodging on given dates"""
    result = price_model.predict(
        request.lodging_id,
        request.check_in_date,
        request.check_out_date,
        request.seasonal_factor,
    )
    return PricePredictionResponse(**result)


async def analyze_sentiment(request: SentimentRequest) -> SentimentResponse:
    """Analyze sentiment of text"""
    result = sentiment_analyzer.analyze(request.text)
    return SentimentResponse(**result)
