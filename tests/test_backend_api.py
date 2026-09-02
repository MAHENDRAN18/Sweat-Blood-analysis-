"""
Unit and Integration Tests for AI Multimodal Health Risk Prediction FastAPI Backend
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Blood Biomarkers" in data["multimodalChannels"]
    assert "Sweat Biofluids" in data["multimodalChannels"]

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["modelsLoaded"] == 10

def test_multimodal_prediction_healthy_control():
    payload = {
        "name": "Healthy Control Test",
        "age": 28,
        "sex": "male",
        "height_cm": 178,
        "weight_kg": 72,
        "bmi": 22.7,
        "waist_circumference_cm": 78,
        "systolic_bp": 114,
        "diastolic_bp": 74,
        "resting_heart_rate": 62,
        "spo2": 99,
        "respiratory_rate": 14,
        "fasting_glucose": 84,
        "hba1c": 4.9,
        "total_cholesterol": 165,
        "hdl_cholesterol": 62,
        "ldl_cholesterol": 88,
        "triglycerides": 85,
        "serum_creatinine": 0.85,
        "bun": 12,
        "egfr": 112,
        "urine_albumin": 6,
        "alt": 18,
        "ast": 20,
        "total_bilirubin": 0.6,
        "direct_bilirubin": 0.15,
        "albumin": 4.6,
        "alp": 62,
        "hemoglobin": 15.6,
        "hematocrit": 45,
        "wbc_count": 5.8,
        "platelet_count": 245,
        "tsh": 1.6,
        "free_t4": 1.25,
        "sweat_glucose": 0.8,
        "sweat_lactate": 8.5,
        "sweat_sodium": 28.0,
        "sweat_potassium": 4.2,
        "sweat_chloride": 18.0,
        "sweat_cortisol": 0.08,
        "sweat_ph": 5.8,
        "sweat_rate": 0.75,
        "physical_activity_hours": 5.5,
        "smoking_status": "never",
        "alcohol_intake": "none",
        "sleep_hours_per_night": 8.0,
        "stress_index": 2.0,
        "hydration_liters_per_day": 3.2,
        "daily_fatigue_score": 2.0
    }
    response = client.post("/api/predict/multimodal", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "conditions" in res
    assert "overallRisk" in res
    assert res["overallRisk"]["tier"] == "Low Risk"
    assert res["overallRisk"]["score"] < 35
    assert len(res["conditions"]) == 10

def test_multimodal_prediction_diabetic_patient():
    payload = {
        "name": "Diabetic Patient Test",
        "age": 55,
        "sex": "male",
        "height_cm": 172,
        "weight_kg": 96,
        "bmi": 32.4,
        "waist_circumference_cm": 106,
        "systolic_bp": 142,
        "diastolic_bp": 88,
        "resting_heart_rate": 78,
        "spo2": 97,
        "respiratory_rate": 16,
        "fasting_glucose": 155,
        "hba1c": 7.6,
        "total_cholesterol": 230,
        "hdl_cholesterol": 36,
        "ldl_cholesterol": 145,
        "triglycerides": 260,
        "serum_creatinine": 1.1,
        "bun": 18,
        "egfr": 76,
        "urine_albumin": 45,
        "alt": 42,
        "ast": 38,
        "total_bilirubin": 0.9,
        "direct_bilirubin": 0.2,
        "albumin": 4.1,
        "alp": 85,
        "hemoglobin": 14.2,
        "hematocrit": 42,
        "wbc_count": 7.4,
        "platelet_count": 260,
        "tsh": 2.0,
        "free_t4": 1.15,
        "sweat_glucose": 4.2,
        "sweat_lactate": 24.0,
        "sweat_sodium": 48.0,
        "sweat_potassium": 5.4,
        "sweat_chloride": 34.0,
        "sweat_cortisol": 0.28,
        "sweat_ph": 6.2,
        "sweat_rate": 0.55,
        "physical_activity_hours": 1.0,
        "smoking_status": "former",
        "alcohol_intake": "moderate",
        "sleep_hours_per_night": 5.5,
        "stress_index": 7.5,
        "hydration_liters_per_day": 1.5,
        "daily_fatigue_score": 7.0,
        "family_history_diabetes": True
    }
    response = client.post("/api/predict/multimodal", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["conditions"]["diabetes"]["riskLevel"] == "High"
    assert res["conditions"]["diabetes"]["probability"] >= 70.0
    assert len(res["recommendations"]) > 0
