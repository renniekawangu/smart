"""Data generation utilities for testing and evaluation"""

import random
from datetime import datetime, timedelta


def generate_sample_reviews(count: int = 100) -> list:
    """Generate sample reviews for testing sentiment analysis"""
    positive_reviews = [
        "Amazing hotel! Clean rooms and excellent service.",
        "Love this place! Will definitely come back.",
        "Fantastic experience, highly recommend!",
        "Best stay ever, staff was wonderful!",
        "Perfect location and beautiful rooms.",
    ]

    negative_reviews = [
        "Terrible hotel, very dirty and noisy.",
        "Worst experience ever, do not recommend.",
        "Poor service, rude staff.",
        "Not worth the money, very disappointed.",
        "Broken facilities, bad management.",
    ]

    neutral_reviews = [
        "It was okay, nothing special.",
        "Average hotel for the price.",
        "Decent place to stay.",
        "Standard rooms and service.",
        "Met expectations, nothing more.",
    ]

    reviews = []
    for i in range(count):
        sentiment = random.choice(['positive', 'negative', 'neutral'])
        if sentiment == 'positive':
            text = random.choice(positive_reviews)
        elif sentiment == 'negative':
            text = random.choice(negative_reviews)
        else:
            text = random.choice(neutral_reviews)

        reviews.append({
            'id': f'review_{i}',
            'text': text,
            'sentiment': sentiment,
            'lodging_id': f'lodging_{random.randint(1, 10)}',
            'rating': random.randint(1, 5),
        })

    return reviews


def generate_sample_user_ratings(num_users: int = 50, num_lodgings: int = 100) -> dict:
    """Generate sample user ratings for collaborative filtering"""
    ratings = {}
    for user_id in range(num_users):
        user_key = f'user_{user_id}'
        ratings[user_key] = {}
        
        # Each user rates 10-20 random lodgings
        num_ratings = random.randint(10, 20)
        for _ in range(num_ratings):
            lodging_id = f'lodging_{random.randint(1, num_lodgings)}'
            rating = random.randint(1, 5)
            ratings[user_key][lodging_id] = rating

    return ratings


def generate_sample_prices(num_lodgings: int = 100, date_range: int = 365) -> dict:
    """Generate sample price data for testing price prediction"""
    prices = {}
    start_date = datetime.now() - timedelta(days=date_range)

    for lodging_id in range(1, num_lodgings + 1):
        lodging_key = f'lodging_{lodging_id}'
        base_price = random.randint(50, 500)
        prices[lodging_key] = []

        for day in range(date_range):
            current_date = start_date + timedelta(days=day)
            
            # Apply seasonal factor
            month = current_date.month
            if month in [6, 7, 8, 12]:  # Summer and December
                seasonal_factor = 1.5
            elif month in [3, 4, 5, 9, 10, 11]:  # Shoulder seasons
                seasonal_factor = 1.2
            else:  # Off-peak
                seasonal_factor = 0.8

            price = base_price * seasonal_factor
            # Add some random noise
            price += random.randint(-20, 20)

            prices[lodging_key].append({
                'date': current_date.isoformat(),
                'price': max(20, price),  # Minimum price of 20
            })

    return prices
