from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import recommendations, price_prediction, sentiment
from .schemas import HealthResponse
import os

app = FastAPI(
    title="Smart Lodging ML Service",
    description="Machine Learning APIs for recommendation, pricing, and sentiment analysis",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["recommendations"])
app.include_router(price_prediction.router, prefix="/api/price-prediction", tags=["pricing"])
app.include_router(sentiment.router, prefix="/api/sentiment", tags=["sentiment"])


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(status="ok", service="smart-lodging-ml-service")


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=True)
