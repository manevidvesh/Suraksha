import os
import pickle
from typing import List, Dict, Any
from backend.ml.preprocessing.features import extract_hazard_features

_hazard_model = None

def load_model():
    global _hazard_model
    if _hazard_model is None:
        model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
        if not os.path.exists(model_path):
            from backend.ml.hazard_model.train import train_hazard_model
            _hazard_model = train_hazard_model(model_path)
        else:
            with open(model_path, "rb") as f:
                _hazard_model = pickle.load(f)
    return _hazard_model

def predict_hazard_susceptibility(sample: Dict[str, Any]) -> Dict[str, Any]:
    """Predicts hazard susceptibility class and probability."""
    model = load_model()
    features = extract_hazard_features(sample)
    pred_class = int(model.predict([features])[0])
    probs = model.predict_proba([features])[0]
    prob_high = float(probs[1]) if len(probs) > 1 else float(pred_class)

    return {
        "is_high_hazard": bool(pred_class == 1),
        "hazard_probability": round(prob_high, 3),
        "hazard_score_equivalent": int(round(prob_high * 100)),
    }
