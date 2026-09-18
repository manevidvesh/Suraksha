import os
import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier

def train_hazard_model(save_path: str = None):
    if save_path is None:
        save_path = os.path.join(os.path.dirname(__file__), "model.pkl")

    # Generate synthetic training set reflecting slope, rainfall, elevation, distance to fault, soil permeability
    np.random.seed(42)
    n_samples = 300

    slopes = np.random.uniform(2.0, 50.0, n_samples)
    rainfalls = np.random.uniform(50.0, 450.0, n_samples)
    elevations = np.random.uniform(50.0, 2500.0, n_samples)
    fault_dists = np.random.uniform(0.5, 40.0, n_samples)
    permeability = np.random.uniform(0.1, 0.9, n_samples)

    X = np.column_stack([slopes, rainfalls, elevations, fault_dists, permeability])

    # Rule: high slope (>30) and high rainfall (>250) or close to fault -> High hazard (1)
    risk_score = (slopes / 50.0) * 0.4 + (rainfalls / 450.0) * 0.4 + (1.0 - fault_dists / 40.0) * 0.2
    y = (risk_score > 0.55).astype(int)

    clf = RandomForestClassifier(n_estimators=30, max_depth=5, random_state=42)
    clf.fit(X, y)

    with open(save_path, "wb") as f:
        pickle.dump(clf, f)

    print(f"SURAKSHA Hazard Model trained successfully. Saved to: {save_path}")
    return clf

if __name__ == "__main__":
    train_hazard_model()
