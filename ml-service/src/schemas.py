from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class RecommendationRequest(BaseModel):
    user_id: str
    limit: int = 10
    filters: Optional[Dict[str, Any]] = None

class RecommendationResponse(BaseModel):
    recommendations: List[Dict[str, Any]]
    evaluation_metrics: Optional[Dict[str, float]] = None

class PricePredictionRequest(BaseModel):
    lodging_id: str
    check_in_date: str
    check_out_date: str
    seasonal_factor: Optional[float] = 1.0

class PricePredictionResponse(BaseModel):
    predicted_price: float
    confidence: float
    factors: Dict[str, float]

class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: str
    confidence: float
    score: float

class HealthResponse(BaseModel):
    status: str
    service: str
