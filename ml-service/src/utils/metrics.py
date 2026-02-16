"""ML Evaluation metrics and utilities"""

from typing import List, Dict, Any
import numpy as np


class RecommendationMetrics:
    """Metrics for evaluating recommendation systems"""

    @staticmethod
    def precision_at_k(relevant: List[int], recommended: List[int], k: int = 10) -> float:
        """Calculate Precision@K"""
        if k == 0:
            return 0.0
        rec_at_k = set(recommended[:k])
        rel_set = set(relevant)
        if len(rec_at_k) == 0:
            return 0.0
        return len(rec_at_k & rel_set) / len(rec_at_k)

    @staticmethod
    def recall_at_k(relevant: List[int], recommended: List[int], k: int = 10) -> float:
        """Calculate Recall@K"""
        if len(relevant) == 0:
            return 0.0
        rec_at_k = set(recommended[:k])
        rel_set = set(relevant)
        return len(rec_at_k & rel_set) / len(rel_set)

    @staticmethod
    def f1_score(precision: float, recall: float) -> float:
        """Calculate F1 Score"""
        if precision + recall == 0:
            return 0.0
        return 2 * (precision * recall) / (precision + recall)

    @staticmethod
    def map_at_k(relevant_lists: List[List[int]], recommended_lists: List[List[int]], k: int = 10) -> float:
        """Calculate Mean Average Precision@K"""
        aps = []
        for relevant, recommended in zip(relevant_lists, recommended_lists):
            ap = RecommendationMetrics._average_precision_at_k(relevant, recommended, k)
            aps.append(ap)
        return np.mean(aps) if aps else 0.0

    @staticmethod
    def _average_precision_at_k(relevant: List[int], recommended: List[int], k: int) -> float:
        """Calculate Average Precision@K"""
        rec_at_k = recommended[:k]
        rel_set = set(relevant)
        
        precisions = []
        for i, rec in enumerate(rec_at_k):
            if rec in rel_set:
                precisions.append(RecommendationMetrics.precision_at_k(relevant, rec_at_k, i + 1))
        
        return np.mean(precisions) if precisions else 0.0


class RegressionMetrics:
    """Metrics for evaluating regression models (price prediction)"""

    @staticmethod
    def rmse(y_true: List[float], y_pred: List[float]) -> float:
        """Root Mean Squared Error"""
        return float(np.sqrt(np.mean((np.array(y_true) - np.array(y_pred)) ** 2)))

    @staticmethod
    def mae(y_true: List[float], y_pred: List[float]) -> float:
        """Mean Absolute Error"""
        return float(np.mean(np.abs(np.array(y_true) - np.array(y_pred))))

    @staticmethod
    def mape(y_true: List[float], y_pred: List[float]) -> float:
        """Mean Absolute Percentage Error"""
        y_true = np.array(y_true)
        y_pred = np.array(y_pred)
        return float(np.mean(np.abs((y_true - y_pred) / y_true)) * 100)


class ClassificationMetrics:
    """Metrics for evaluating classification models (sentiment analysis)"""

    @staticmethod
    def accuracy(y_true: List[int], y_pred: List[int]) -> float:
        """Classification accuracy"""
        return float(np.mean(np.array(y_true) == np.array(y_pred)))

    @staticmethod
    def confusion_matrix(y_true: List[int], y_pred: List[int], num_classes: int = 3) -> np.ndarray:
        """Compute confusion matrix"""
        matrix = np.zeros((num_classes, num_classes))
        for true, pred in zip(y_true, y_pred):
            matrix[int(true), int(pred)] += 1
        return matrix

    @staticmethod
    def precision_recall_f1(y_true: List[int], y_pred: List[int], num_classes: int = 3) -> Dict[str, float]:
        """Compute precision, recall, and F1 for each class"""
        matrix = ClassificationMetrics.confusion_matrix(y_true, y_pred, num_classes)
        
        metrics = {}
        for i in range(num_classes):
            tp = matrix[i, i]
            fp = matrix[:, i].sum() - tp
            fn = matrix[i, :].sum() - tp
            
            precision = tp / (tp + fp) if (tp + fp) > 0 else 0
            recall = tp / (tp + fn) if (tp + fn) > 0 else 0
            f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
            
            metrics[f'class_{i}'] = {
                'precision': float(precision),
                'recall': float(recall),
                'f1': float(f1),
            }
        
        return metrics
