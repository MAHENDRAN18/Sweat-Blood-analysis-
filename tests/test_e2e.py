"""
End-to-End Validation & Precaution History Evolution Test
"""

import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
from main import evaluate_multimodal_predictions, generate_evolving_precautions, PatientHealthDataSchema

def test_e2e_multimodal_pipeline():
    # 1. Patient first assessment: Elevated Glycemic & Blood Pressure
    patient_initial = PatientHealthDataSchema(
        name="Eleanor Vance",
        age=52,
        sex="female",
        fasting_glucose=140,
        hba1c=6.9,
        systolic_bp=144,
        diastolic_bp=92,
        sweat_glucose=3.5,
        sweat_lactate=21.0,
        sweat_sodium=48.0,
        sweat_cortisol=0.25
    )
    
    result_1 = evaluate_multimodal_predictions(patient_initial)
    precautions_1 = generate_evolving_precautions(patient_initial, result_1["conditions"])
    
    assert result_1["conditions"]["diabetes"]["riskLevel"] == "High"
    assert result_1["conditions"]["hypertension"]["riskLevel"] == "High"
    assert len(precautions_1) >= 2
    
    # 2. Patient follows precautions for 3 months: Lifestyle and dietary interventions
    patient_followup = PatientHealthDataSchema(
        name="Eleanor Vance",
        age=52,
        sex="female",
        fasting_glucose=102,
        hba1c=5.7,
        systolic_bp=122,
        diastolic_bp=78,
        sweat_glucose=1.4,
        sweat_lactate=12.0,
        sweat_sodium=32.0,
        sweat_cortisol=0.12,
        hydration_liters_per_day=2.8,
        physical_activity_hours=4.0
    )
    
    result_2 = evaluate_multimodal_predictions(patient_followup)
    precautions_2 = generate_evolving_precautions(patient_followup, result_2["conditions"])
    
    # Risk should improve significantly
    assert result_2["conditions"]["diabetes"]["probability"] < result_1["conditions"]["diabetes"]["probability"]
    assert result_2["conditions"]["hypertension"]["riskLevel"] == "Low"
    assert result_2["overallRisk"]["score"] < result_1["overallRisk"]["score"]
    print("✓ E2E Pipeline and Precaution Evolution Verified Successfully!")

if __name__ == "__main__":
    test_e2e_multimodal_pipeline()
