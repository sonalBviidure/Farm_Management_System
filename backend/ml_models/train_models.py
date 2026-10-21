"""
FMS Machine Learning Pipeline & Training Script
Phase 8: AI Crop Recommendation, Yield Prediction, and Profit Prediction
Trained using Scikit-Learn, Pandas, and NumPy.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor, RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'saved_models')
os.makedirs(MODELS_DIR, exist_ok=True)


# ==============================================================================
# 1. CROP RECOMMENDATION MODEL (Random Forest Classifier)
# ==============================================================================
def train_crop_recommendation_model():
    print("[1/3] Training Crop Recommendation Model...")
    
    # Domain dataset covering Indian agriculture zones (Maharashtra / Deccan plateau)
    data = [
        # Black Soil
        ('Black', 'Kharif', 'Moderate to Heavy Rainfall (800mm+), Warm', 'Drip', 'Cotton'),
        ('Black', 'Kharif', 'High Rainfall (900mm+), Humid', 'Rainfed', 'Soybean'),
        ('Black', 'Rabi', 'Cool, Moderate Temperature, Dry', 'Canal', 'Wheat'),
        ('Black', 'Annual', 'Warm, Sunny, Well Irrigated', 'Drip', 'Sugarcane'),
        ('Black', 'Zaid', 'Hot and Dry, Sunny', 'Sprinkler', 'Groundnut'),
        ('Black', 'Kharif', 'Heavy Monsoon, Humid', 'Canal', 'Rice'),
        ('Black', 'Rabi', 'Mild Winter, Moderate', 'Borewell', 'Gram (Chana)'),
        ('Black', 'Zaid', 'Hot, High Evaporation', 'Drip', 'Watermelon'),

        # Red Soil
        ('Red', 'Kharif', 'Moderate Rainfall, Well Drained', 'Rainfed', 'Groundnut'),
        ('Red', 'Kharif', 'Low to Moderate Rainfall, Warm', 'Rainfed', 'Maize'),
        ('Red', 'Rabi', 'Mild Winter, Sunny', 'Borewell', 'Wheat'),
        ('Red', 'Zaid', 'Warm, Sunny', 'Sprinkler', 'Sunflower'),
        ('Red', 'Kharif', 'Moderate Rainfall, Warm', 'Drip', 'Cotton'),
        ('Red', 'Annual', 'Warm and Sunny', 'Canal', 'Sugarcane'),

        # Loamy Soil
        ('Loamy', 'Kharif', 'Good Monsoon, Warm', 'Rainfed', 'Soybean'),
        ('Loamy', 'Rabi', 'Cool and Sunny', 'Canal', 'Wheat'),
        ('Loamy', 'Kharif', 'Moderate to High Rainfall', 'Drip', 'Cotton'),
        ('Loamy', 'Annual', 'Rich Soil, High Water', 'Drip', 'Sugarcane'),
        ('Loamy', 'Zaid', 'Hot Summer', 'Sprinkler', 'Vegetables'),
        ('Loamy', 'Rabi', 'Cool Winter', 'Borewell', 'Mustard'),
        ('Loamy', 'Kharif', 'Moderate Monsoon', 'Rainfed', 'Maize'),

        # Alluvial Soil
        ('Alluvial', 'Kharif', 'Heavy Monsoon (1000mm+)', 'Canal', 'Rice'),
        ('Alluvial', 'Rabi', 'Cool Winter, Fertile Plain', 'Canal', 'Wheat'),
        ('Alluvial', 'Annual', 'Abundant Irrigation', 'Canal', 'Sugarcane'),
        ('Alluvial', 'Kharif', 'Warm, Humid', 'Rainfed', 'Maize'),
        ('Alluvial', 'Zaid', 'Warm Spring/Summer', 'Sprinkler', 'Moong Dal'),

        # Clayey Soil
        ('Clayey', 'Kharif', 'Water Retentive, High Rain', 'Canal', 'Rice'),
        ('Clayey', 'Kharif', 'Moderate Rainfall, Water Retentive', 'Rainfed', 'Soybean'),
        ('Clayey', 'Rabi', 'Moist Soil, Cool', 'Borewell', 'Gram (Chana)'),
        ('Clayey', 'Annual', 'High Water Availability', 'Canal', 'Sugarcane'),

        # Sandy Soil
        ('Sandy', 'Zaid', 'Hot, Porous Soil', 'Drip', 'Watermelon'),
        ('Sandy', 'Kharif', 'Low Rainfall, Drought Tolerant', 'Rainfed', 'Bajra'),
        ('Sandy', 'Kharif', 'Low to Moderate Rain', 'Sprinkler', 'Groundnut'),
        ('Sandy', 'Zaid', 'Dry and Sunny', 'Drip', 'Muskmelon'),

        # Other / General
        ('Other', 'Kharif', 'Moderate Monsoon', 'Rainfed', 'Soybean'),
        ('Other', 'Rabi', 'Moderate Winter', 'Canal', 'Wheat'),
        ('Other', 'Zaid', 'Hot Season', 'Drip', 'Vegetables'),
    ]

    df = pd.DataFrame(data, columns=['soil_type', 'season', 'weather_conditions', 'irrigation_type', 'recommended_crop'])
    
    X = df[['soil_type', 'season', 'irrigation_type']]
    y = df['recommended_crop']

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['soil_type', 'season', 'irrigation_type'])
        ]
    )

    clf = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])

    clf.fit(X, y)
    
    model_path = os.path.join(MODELS_DIR, 'crop_recommendation_model.pkl')
    joblib.dump(clf, model_path)
    print(f" -> Saved to {model_path}")
    return clf


# ==============================================================================
# 2. YIELD PREDICTION MODEL (Gradient Boosting Regressor)
# ==============================================================================
def train_yield_prediction_model():
    print("[2/3] Training Yield Prediction Model...")

    np.random.seed(42)
    crops = ['Sugarcane', 'Soybean', 'Wheat', 'Cotton', 'Rice', 'Maize', 'Groundnut', 'Gram (Chana)']
    soils = ['Black', 'Alluvial', 'Loamy', 'Red', 'Clayey', 'Sandy', 'Other']
    seasons = ['Kharif', 'Rabi', 'Zaid', 'Annual']
    fertilizers = ['High Urea/DAP', 'Medium NPK', 'Low/Organic', 'Standard Balanced']

    base_yields = {
        'Sugarcane': 45.0, # Tonnes/acre
        'Soybean': 12.0,   # Quintals/acre
        'Wheat': 18.0,     # Quintals/acre
        'Cotton': 10.0,    # Quintals/acre
        'Rice': 22.0,      # Quintals/acre
        'Maize': 25.0,     # Quintals/acre
        'Groundnut': 14.0, # Quintals/acre
        'Gram (Chana)': 9.0
    }

    soil_mult = {'Black': 1.10, 'Alluvial': 1.15, 'Loamy': 1.08, 'Red': 0.95, 'Clayey': 1.0, 'Sandy': 0.85, 'Other': 1.0}
    fert_mult = {'High Urea/DAP': 1.18, 'Medium NPK': 1.08, 'Low/Organic': 0.92, 'Standard Balanced': 1.05}

    records = []
    for _ in range(800):
        c = np.random.choice(crops)
        s = np.random.choice(soils)
        sea = np.random.choice(seasons)
        f = np.random.choice(fertilizers)
        area = np.random.uniform(1.0, 15.0)
        rainfall = np.random.uniform(200.0, 1200.0)

        rain_factor = 1.0
        if rainfall > 800:
            rain_factor = 1.10
        elif rainfall < 400:
            rain_factor = 0.85

        noise = np.random.normal(1.0, 0.05)
        expected = base_yields[c] * area * soil_mult[s] * fert_mult[f] * rain_factor * noise
        records.append((c, s, sea, f, area, rainfall, round(expected, 2)))

    df = pd.DataFrame(records, columns=['crop_name', 'soil_type', 'season', 'fertilizer_use', 'land_area', 'rainfall', 'yield'])

    X = df[['crop_name', 'soil_type', 'season', 'fertilizer_use', 'land_area', 'rainfall']]
    y = df['yield']

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['crop_name', 'soil_type', 'season', 'fertilizer_use']),
            ('num', StandardScaler(), ['land_area', 'rainfall'])
        ]
    )

    reg = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, random_state=42))
    ])

    reg.fit(X, y)

    model_path = os.path.join(MODELS_DIR, 'yield_prediction_model.pkl')
    joblib.dump(reg, model_path)
    print(f" -> Saved to {model_path}")
    return reg


# ==============================================================================
# 3. PROFIT PREDICTION MODEL (Random Forest Regressor)
# ==============================================================================
def train_profit_prediction_model():
    print("[3/3] Training Profit Prediction Model...")

    np.random.seed(42)
    crops = ['Sugarcane', 'Soybean', 'Wheat', 'Cotton', 'Rice', 'Maize', 'Groundnut', 'Gram (Chana)']
    
    records = []
    for _ in range(600):
        c = np.random.choice(crops)
        cost = np.random.uniform(10000.0, 80000.0)
        yield_val = np.random.uniform(5.0, 100.0)
        price = np.random.uniform(1500.0, 7000.0)

        # Revenue = yield * price
        revenue = yield_val * price
        # Net Profit with real-world market variance (-5% to +5% fluctuation)
        market_fluctuation = np.random.uniform(0.95, 1.05)
        actual_profit = (revenue * market_fluctuation) - cost
        records.append((c, cost, yield_val, price, round(actual_profit, 2)))

    df = pd.DataFrame(records, columns=['crop_name', 'estimated_cost', 'predicted_yield', 'estimated_selling_price', 'profit'])

    X = df[['crop_name', 'estimated_cost', 'predicted_yield', 'estimated_selling_price']]
    y = df['profit']

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['crop_name']),
            ('num', StandardScaler(), ['estimated_cost', 'predicted_yield', 'estimated_selling_price'])
        ]
    )

    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=80, random_state=42))
    ])

    model.fit(X, y)

    model_path = os.path.join(MODELS_DIR, 'profit_prediction_model.pkl')
    joblib.dump(model, model_path)
    print(f" -> Saved to {model_path}")
    return model


if __name__ == '__main__':
    print("=== Training FMS Scikit-Learn Models ===")
    train_crop_recommendation_model()
    train_yield_prediction_model()
    train_profit_prediction_model()
    print("=== All Models Successfully Trained and Saved in backend/ml_models/saved_models/ ===")
