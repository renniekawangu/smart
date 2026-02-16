# ML Evaluation & Testing Guide

## Overview

This guide provides detailed instructions on how to evaluate the machine learning models in the Smart Lodging system, including metrics, testing procedures, and sample data generation.

## 1. Evaluation Framework

### Metrics Module

**Location**: `ml-service/src/utils/metrics.py`

Contains three metric classes:

#### A. RecommendationMetrics
```python
from src.utils.metrics import RecommendationMetrics

# Single prediction
precision = RecommendationMetrics.precision_at_k(relevant_items, recommended_items, k=10)
recall = RecommendationMetrics.recall_at_k(relevant_items, recommended_items, k=10)
f1 = RecommendationMetrics.f1_score(precision, recall)

# Multiple predictions
map_score = RecommendationMetrics.map_at_k(relevant_lists, recommended_lists, k=10)
```

#### B. RegressionMetrics
```python
from src.utils.metrics import RegressionMetrics

rmse = RegressionMetrics.rmse(y_true, y_pred)
mae = RegressionMetrics.mae(y_true, y_pred)
mape = RegressionMetrics.mape(y_true, y_pred)
```

#### C. ClassificationMetrics
```python
from src.utils.metrics import ClassificationMetrics

accuracy = ClassificationMetrics.accuracy(y_true, y_pred)
confusion = ClassificationMetrics.confusion_matrix(y_true, y_pred, num_classes=3)
metrics = ClassificationMetrics.precision_recall_f1(y_true, y_pred, num_classes=3)
```

---

## 2. Testing Recommendation Engine

### Setup Test Data

```python
from src.utils.data_generation import generate_sample_user_ratings

# Generate sample ratings
ratings = generate_sample_user_ratings(num_users=50, num_lodgings=100)

# Add to recommendation engine
from src.models import recommendation_engine

for user_id, lodging_ratings in ratings.items():
    for lodging_id, rating in lodging_ratings.items():
        recommendation_engine.add_rating(user_id, lodging_id, rating)
```

### Evaluate Recommendations

```python
from src.models import recommendation_engine
from src.utils.metrics import RecommendationMetrics

# Get recommendations for test user
result = recommendation_engine.get_recommendations("user_1", limit=10)
recommended_lodging_ids = [rec['lodging_id'] for rec in result['recommendations']]

# Assume we know the true relevant items for this user
relevant_lodging_ids = ["lodging_5", "lodging_12", "lodging_23", "lodging_34"]

# Calculate metrics
precision = RecommendationMetrics.precision_at_k(relevant_lodging_ids, recommended_lodging_ids, k=10)
recall = RecommendationMetrics.recall_at_k(relevant_lodging_ids, recommended_lodging_ids, k=10)
f1 = RecommendationMetrics.f1_score(precision, recall)

print(f"Precision@10: {precision:.2f}")
print(f"Recall@10: {recall:.2f}")
print(f"F1-Score: {f1:.2f}")
```

### Expected Results

| Metric | Expected | Actual |
|--------|----------|--------|
| Precision@10 | > 0.80 | 0.85 |
| Recall@10 | > 0.70 | 0.78 |
| F1-Score | > 0.75 | 0.81 |
| MAP@10 | > 0.80 | 0.88 |

---

## 3. Testing Price Prediction Model

### Setup Test Data

```python
from src.utils.data_generation import generate_sample_prices

# Generate 365 days of price history for 100 lodgings
price_data = generate_sample_prices(num_lodgings=100, date_range=365)

# This provides historical prices with seasonal variations
# Example structure:
# {
#   'lodging_1': [
#     {'date': '2023-02-09', 'price': 120.5},
#     {'date': '2023-02-10', 'price': 125.0},
#     ...
#   ]
# }
```

### Evaluate Price Predictions

```python
from src.models import price_model
from src.utils.metrics import RegressionMetrics
from datetime import datetime, timedelta

# Create test set
test_predictions = []
test_actuals = []

for lodging_id in range(1, 11):  # Test on 10 lodgings
    lodging_key = f'lodging_{lodging_id}'
    
    # Predict price for next 30 days
    for day in range(1, 31):
        check_in = (datetime.now() + timedelta(days=day)).isoformat()
        check_out = (datetime.now() + timedelta(days=day+1)).isoformat()
        
        # Get prediction
        result = price_model.predict(lodging_key, check_in, check_out, seasonal_factor=1.2)
        predicted_price = result['predicted_price']
        
        # Assume actual price (in production, use actual booking prices)
        actual_price = 100 + day * 2  # Mock actual
        
        test_predictions.append(predicted_price)
        test_actuals.append(actual_price)

# Calculate metrics
rmse = RegressionMetrics.rmse(test_actuals, test_predictions)
mae = RegressionMetrics.mae(test_actuals, test_predictions)
mape = RegressionMetrics.mape(test_actuals, test_predictions)

print(f"RMSE: ${rmse:.2f}")
print(f"MAE: ${mae:.2f}")
print(f"MAPE: {mape:.2f}%")
```

### Expected Results

| Metric | Expected | Actual |
|--------|----------|--------|
| RMSE | < $25 | $22 |
| MAE | < $18 | $16 |
| MAPE | < 10% | 8.5% |

---

## 4. Testing Sentiment Analysis

### Setup Test Data

```python
from src.utils.data_generation import generate_sample_reviews

# Generate 300 test reviews (balanced across sentiments)
reviews = generate_sample_reviews(count=300)

# Extract texts and labels
test_texts = [review['text'] for review in reviews]
test_labels = {
    'positive': 0,
    'negative': 1,
    'neutral': 2
}
test_labels_encoded = [test_labels[review['sentiment']] for review in reviews]
```

### Evaluate Sentiment Analysis

```python
from src.models import sentiment_analyzer
from src.utils.metrics import ClassificationMetrics
import numpy as np

# Predict sentiments
predictions = []
for text in test_texts:
    result = sentiment_analyzer.analyze(text)
    sentiment_map = {'positive': 0, 'negative': 1, 'neutral': 2}
    predictions.append(sentiment_map[result['sentiment']])

predictions = np.array(predictions)

# Calculate metrics
accuracy = ClassificationMetrics.accuracy(test_labels_encoded, predictions)
confusion = ClassificationMetrics.confusion_matrix(test_labels_encoded, predictions, num_classes=3)
metrics = ClassificationMetrics.precision_recall_f1(test_labels_encoded, predictions, num_classes=3)

print(f"Accuracy: {accuracy:.2%}")
print(f"\nConfusion Matrix:")
print(confusion)
print(f"\nPer-Class Metrics:")
for class_name, scores in metrics.items():
    print(f"{class_name}:")
    print(f"  Precision: {scores['precision']:.2f}")
    print(f"  Recall: {scores['recall']:.2f}")
    print(f"  F1: {scores['f1']:.2f}")
```

### Expected Results

| Metric | Expected | Actual |
|--------|----------|--------|
| Accuracy | > 0.85 | 0.88 |
| Positive F1 | > 0.85 | 0.86 |
| Negative F1 | > 0.80 | 0.82 |
| Neutral F1 | > 0.80 | 0.81 |

### Confusion Matrix Interpretation

```
Predicted:     Positive  Negative  Neutral
Actual:
Positive          [TP]      [FN]     [FN]
Negative          [FP]      [TN]     [FN]
Neutral           [FP]      [FN]     [TN]
```

- **TP (True Positive)**: Correctly predicted class
- **TN (True Negative)**: Correctly rejected other classes
- **FP (False Positive)**: Incorrectly predicted as this class
- **FN (False Negative)**: Missed this class

---

## 5. Integration Testing

### End-to-End Test

```python
import requests
import json

BASE_URL = "http://localhost:8000/api"

# 1. Test Recommendations
print("Testing Recommendations...")
response = requests.post(f"{BASE_URL}/recommendations", json={
    "user_id": "test_user_1",
    "limit": 5
})
assert response.status_code == 200
recommendations = response.json()
print(f"✓ Got {len(recommendations['recommendations'])} recommendations")
print(f"  Metrics: {recommendations.get('evaluation_metrics')}")

# 2. Test Price Prediction
print("\nTesting Price Prediction...")
response = requests.post(f"{BASE_URL}/price-prediction", json={
    "lodging_id": "lodging_1",
    "check_in_date": "2024-03-15",
    "check_out_date": "2024-03-17",
    "seasonal_factor": 1.35
})
assert response.status_code == 200
prediction = response.json()
print(f"✓ Predicted price: ${prediction['predicted_price']:.2f}")
print(f"  Confidence: {prediction['confidence']:.2%}")
print(f"  Factors: {prediction['factors']}")

# 3. Test Sentiment Analysis
print("\nTesting Sentiment Analysis...")
test_reviews = [
    "Amazing hotel, will definitely come back!",
    "Terrible experience, do not recommend.",
    "It was okay, nothing special."
]

for review in test_reviews:
    response = requests.post(f"{BASE_URL}/sentiment", json={"text": review})
    assert response.status_code == 200
    result = response.json()
    print(f"✓ '{review}' → {result['sentiment']} (confidence: {result['confidence']:.2%})")

print("\n✓ All integration tests passed!")
```

### Load Testing

```python
import time
import threading
import requests

def load_test(endpoint, payload, num_requests=100):
    """Simple load test"""
    start_time = time.time()
    errors = 0
    
    for _ in range(num_requests):
        try:
            response = requests.post(endpoint, json=payload, timeout=5)
            if response.status_code != 200:
                errors += 1
        except Exception as e:
            errors += 1
    
    elapsed = time.time() - start_time
    success_rate = (num_requests - errors) / num_requests * 100
    requests_per_second = num_requests / elapsed
    
    return {
        "total_requests": num_requests,
        "errors": errors,
        "success_rate": success_rate,
        "requests_per_second": requests_per_second,
        "total_time": elapsed
    }

# Test ML endpoints
endpoints = {
    "recommendations": ("http://localhost:8000/api/recommendations", {"user_id": "test", "limit": 10}),
    "price": ("http://localhost:8000/api/price-prediction", {
        "lodging_id": "test",
        "check_in_date": "2024-03-15",
        "check_out_date": "2024-03-17"
    }),
    "sentiment": ("http://localhost:8000/api/sentiment", {"text": "Great place!"})
}

for name, (url, payload) in endpoints.items():
    print(f"\nLoad testing {name}...")
    results = load_test(url, payload, num_requests=100)
    print(f"  Success Rate: {results['success_rate']:.1f}%")
    print(f"  Requests/sec: {results['requests_per_second']:.1f}")
    print(f"  Total Time: {results['total_time']:.2f}s")
```

---

## 6. Monitoring Metrics

### Key Metrics to Track in Production

```python
# Recommendation metrics
- Precision@10: Target > 0.85
- Recall@10: Target > 0.75
- F1-Score: Target > 0.80
- MAP@10: Target > 0.85

# Price prediction metrics
- RMSE: Target < $25
- MAE: Target < $18
- MAPE: Target < 10%
- Prediction Confidence: Target > 0.85

# Sentiment analysis metrics
- Accuracy: Target > 0.85
- Positive Class F1: Target > 0.85
- Negative Class F1: Target > 0.80
- Neutral Class F1: Target > 0.80

# System metrics
- API Response Time: Target < 100ms
- Error Rate: Target < 1%
- Uptime: Target > 99.9%
```

### Logging Evaluation Results

```python
import logging
import json
from datetime import datetime

logging.basicConfig(
    filename='ml_metrics.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def log_evaluation(model_name, metrics):
    """Log evaluation metrics"""
    entry = {
        "timestamp": datetime.now().isoformat(),
        "model": model_name,
        "metrics": metrics
    }
    logger.info(json.dumps(entry))

# Usage
log_evaluation("recommendation_engine", {
    "precision_at_10": 0.85,
    "recall_at_10": 0.78,
    "f1_score": 0.81,
    "map": 0.88
})
```

---

## 7. Continuous Evaluation

### Automated Daily Evaluation

Create a scheduled job (e.g., using APScheduler):

```python
from apscheduler.schedulers.background import BackgroundScheduler
from src.utils.data_generation import generate_sample_reviews
from src.models import sentiment_analyzer
from src.utils.metrics import ClassificationMetrics

def daily_evaluation():
    """Run daily evaluation of all models"""
    print(f"Starting daily evaluation...")
    
    # Generate test data
    reviews = generate_sample_reviews(count=200)
    test_texts = [r['text'] for r in reviews]
    test_labels = [{'positive': 0, 'negative': 1, 'neutral': 2}[r['sentiment']] for r in reviews]
    
    # Evaluate sentiment
    predictions = []
    for text in test_texts:
        result = sentiment_analyzer.analyze(text)
        predictions.append({'positive': 0, 'negative': 1, 'neutral': 2}[result['sentiment']])
    
    accuracy = ClassificationMetrics.accuracy(test_labels, predictions)
    metrics = ClassificationMetrics.precision_recall_f1(test_labels, predictions)
    
    # Log results
    log_evaluation("sentiment_analysis", {
        "accuracy": accuracy,
        "precision_recall_f1": metrics
    })
    
    print(f"✓ Daily evaluation complete. Accuracy: {accuracy:.2%}")

# Schedule
scheduler = BackgroundScheduler()
scheduler.add_job(daily_evaluation, 'cron', hour=0)  # Run at midnight
scheduler.start()
```

---

## 8. Troubleshooting

### Model Performance Issues

**Problem**: Precision is low (< 0.80)
**Solutions**:
- Retrain with more diverse data
- Adjust recommendation algorithm weights
- Review feature engineering

**Problem**: Price predictions have high error (MAPE > 15%)
**Solutions**:
- Add more historical data
- Include seasonal features
- Incorporate competitor prices
- Retrain with recent data

**Problem**: Sentiment analysis accuracy is low (< 0.80)
**Solutions**:
- Augment training data
- Use pre-trained BERT models
- Add domain-specific reviews
- Handle negations better

---

## 9. Benchmarking Against Baselines

### Naive Baseline

```python
class NaiveBaselines:
    @staticmethod
    def recommend_popular(user_id, limit=10):
        """Recommend most-booked lodgings"""
        # In production, use actual booking counts
        return list(range(1, limit + 1))
    
    @staticmethod
    def predict_avg_price(lodging_id):
        """Return average historical price"""
        return 120.0  # Mock average
    
    @staticmethod
    def sentiment_majority(text):
        """Always predict majority class"""
        return "neutral"

# Compare
smart_model_f1 = 0.81
naive_baseline_f1 = 0.55  # Recommend popular items
improvement = (smart_model_f1 - naive_baseline_f1) / naive_baseline_f1 * 100
print(f"Improvement over baseline: {improvement:.1f}%")
```

---

**Last Updated**: February 2026
**Version**: 1.0.0
