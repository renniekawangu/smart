from fastapi import APIRouter
from ..schemas import PricePredictionRequest, PricePredictionResponse
from ..services import predict_price

router = APIRouter()


@router.post("/", response_model=PricePredictionResponse)
async def predict(request: PricePredictionRequest):
    """Predict lodging price based on dates and seasonal factors"""
    return await predict_price(request)
