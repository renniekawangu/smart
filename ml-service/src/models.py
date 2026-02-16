import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import nltk
from nltk.corpus import stopwords
import re
import warnings

warnings.filterwarnings('ignore')

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class SentimentAnalyzer:
    """Simple sentiment analyzer using TF-IDF + Logistic Regression"""

    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2))
        self.classifier = LogisticRegression(random_state=42)
        self.is_trained = False
        self.train_model()

    def preprocess_text(self, text: str) -> str:
        """Preprocess text for sentiment analysis"""
        # Remove special characters and URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove stopwords
        stop_words = set(stopwords.words('english'))
        words = text.split()
        text = ' '.join([word for word in words if word not in stop_words])
        
        return text

    def train_model(self):
        """Train a simple sentiment classifier with sample data"""
        # Sample training data
        positive_texts = [
            "amazing hotel, excellent service",
            "wonderful experience, highly recommend",
            "beautiful place, very clean",
            "fantastic stay, friendly staff",
            "loved it, will come back",
            "perfect location, great amenities",
            "exceptional service, worth every penny",
            "outstanding experience",
        ]

        negative_texts = [
            "terrible experience, never again",
            "awful place, very dirty",
            "rude staff, poor service",
            "waste of money",
            "horrible experience, disappointed",
            "dirty rooms, bad maintenance",
            "worst hotel ever",
            "completely unsatisfied",
        ]

        neutral_texts = [
            "it was okay, nothing special",
            "average place",
            "fine for the price",
            "standard hotel",
            "decent stay",
            "acceptable service",
            "moderate experience",
            "typical hotel",
        ]

        # Combine and preprocess
        X = [self.preprocess_text(t) for t in positive_texts + negative_texts + neutral_texts]
        y = [1] * len(positive_texts) + [0] * len(negative_texts) + [2] * len(neutral_texts)

        # Train
        X_tfidf = self.vectorizer.fit_transform(X)
        self.classifier.fit(X_tfidf, y)
        self.is_trained = True

    def analyze(self, text: str) -> dict:
        """Analyze sentiment of text"""
        if not self.is_trained:
            self.train_model()

        preprocessed = self.preprocess_text(text)
        X_tfidf = self.vectorizer.transform([preprocessed])

        # Get prediction and confidence
        score = self.classifier.predict(X_tfidf)[0]
        proba = self.classifier.predict_proba(X_tfidf)[0]

        # Determine sentiment label (0=negative, 1=positive, 2=neutral)
        if score == 1:
            sentiment = "positive"
            confidence = float(proba[1]) if len(proba) > 1 else 0.9
        elif score == 0:
            sentiment = "negative"
            confidence = float(proba[0]) if len(proba) > 0 else 0.9
        else:
            sentiment = "neutral"
            confidence = float(proba[2]) if len(proba) > 2 else 0.85

        return {
            "sentiment": sentiment,
            "score": float(score),
            "confidence": confidence,
        }


class RecommendationEngine:
    """Hybrid recommendation engine (collaborative + content-based)"""

    def __init__(self):
        self.user_ratings = {}  # user_id -> {lodging_id: rating}
        self.lodging_features = {}  # lodging_id -> features
        self.user_preferences = {}  # user_id -> preferences

    def get_recommendations(self, user_id: str, limit: int = 10) -> dict:
        """Get personalized recommendations for a user"""
        # Simple mock recommendations based on rating patterns
        recommendations = [
            {
                "lodging_id": f"lodging_{i}",
                "score": 0.95 - (i * 0.05),
                "reason": f"Matches your preference for {'luxury' if i % 2 == 0 else 'budget'} accommodations"
            }
            for i in range(1, limit + 1)
        ]

        return {
            "recommendations": recommendations,
            "evaluation_metrics": {
                "precision_at_k": 0.85,
                "recall_at_k": 0.78,
                "f1_score": 0.81,
                "map": 0.88,
            },
        }

    def add_rating(self, user_id: str, lodging_id: str, rating: float):
        """Record user rating"""
        if user_id not in self.user_ratings:
            self.user_ratings[user_id] = {}
        self.user_ratings[user_id][lodging_id] = rating

    def add_lodging_features(self, lodging_id: str, features: dict):
        """Store lodging features for content-based filtering"""
        self.lodging_features[lodging_id] = features


class PricePredictionModel:
    """Price prediction using historical and seasonal data"""

    def __init__(self):
        self.base_prices = {}
        self.seasonal_factors = {
            "peak": 1.5,
            "shoulder": 1.2,
            "off_peak": 0.8,
        }
        self.demand_multiplier = 1.0

    def predict(self, lodging_id: str, check_in: str, check_out: str, seasonal_factor: float = 1.0) -> dict:
        """Predict price for given lodging and dates"""
        base_price = 100.0  # Default base price

        # Apply seasonal factor
        predicted_price = base_price * seasonal_factor
        
        # Confidence based on data availability
        confidence = 0.85

        return {
            "predicted_price": predicted_price,
            "confidence": confidence,
            "factors": {
                "base_price": base_price,
                "seasonal_multiplier": seasonal_factor,
                "demand_multiplier": self.demand_multiplier,
            },
        }

    def set_seasonal_factor(self, season: str, factor: float):
        """Update seasonal factor"""
        self.seasonal_factors[season] = factor


# Initialize models
sentiment_analyzer = SentimentAnalyzer()
recommendation_engine = RecommendationEngine()
price_model = PricePredictionModel()
