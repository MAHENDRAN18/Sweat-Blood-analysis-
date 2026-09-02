# Multimodal Clinical Datasets & Feature Harmonization Mapping

## 1. Project Concept & Biofluid Fusion
This system combines **Blood Biomarker Data** (steady-state systemic biochemical markers) with **Dynamic Sweat Biomarkers** (continuous non-invasive biofluid tracking of glucose, lactate, sodium, potassium, chloride, and cortisol) to achieve early pre-symptomatic disease detection.

---

## 2. Multimodal (Blood + Sweat) vs. Blood-Only Breakdown

To ensure scientific integrity, every disease cohort is explicitly classified based on physiological biofluid feasibility:

| Condition Cohort | Classification | Primary Blood Markers | Sweat Biofluid Markers | Clinical Justification |
|---|---|---|---|---|
| **Type 2 Diabetes & Prediabetes** | **True Multimodal** | Fasting Blood Glucose, HbA1c, Fasting Insulin | Sweat Glucose, Sweat Lactate | Sweat glucose tracks interstitial glucose with a 5-15 min lag. Sweat lactate flags early insulin resistance & anaerobic glycolytic shift. |
| **Hypertension & Endothelial Strain** | **True Multimodal** | Systolic BP, Diastolic BP, Resting Pulse | Sweat Sodium ($Na^+$), Sweat Cortisol | High sweat salt excretion correlates with systemic salt sensitivity. Sweat cortisol indicates sympathetic vasomotor tone. |
| **Coronary Artery Disease & Heart Strain** | **True Multimodal** | Total Cholesterol, HDL, LDL, Triglycerides | Sweat Cortisol, Sweat Lactate | Chronic hypercortisolemia accelerates arterial endothelial plaque deposition; sweat lactate reveals exertional ischemia. |
| **Chronic Kidney Disease (CKD)** | **True Multimodal** | Serum Creatinine, BUN, eGFR, Urine Albumin | Sweat Potassium ($K^+$), Sweat Sodium | Sweat glands act as auxiliary excretory organs; sweat $K^+$ and urea rise early as renal filtration declines. |
| **Metabolic Syndrome (ATP III)** | **True Multimodal** | Fasting Glucose, Triglycerides, HDL, Waist Circumference | Sweat Cortisol, Sweat Lactate | Dynamic diurnal cortisol fluctuations and high sweat lactate reflect systemic mitochondrial dysfunction. |
| **Dehydration & Fatigue Strain** | **True Multimodal** | BUN, Serum Creatinine, Blood Osmolality | Sweat $Na^+$, $K^+$, $Cl^-$, Lactate, Sweat Rate | Real-time sweat electrolyte loss and lactate buildup reflect cellular hydration deficit and anaerobic fatigue before systemic collapse. |
| **Ischemic Stroke Risk** | **Blood-Dominant + Sweat Stress** | Blood Pressure, Glucose, Lipid Fractions, Age | Sweat Cortisol | Mechanical vascular strain is primary; sweat cortisol acts as acute autonomic sympathetic driver. |
| **Hepatocellular Injury / Liver Disease (ILPD)** | **Blood-Only** | ALT (SGPT), AST (SGOT), Total & Direct Bilirubin, Albumin, ALP | *None (Blood-Only)* | Intracellular transaminases and bilirubin conjugates are processed strictly through hepatic circulation and not excreted in sweat. |
| **Thyroid Endocrine Dysregulation** | **Blood-Only** | TSH, Free T4 | *None (Blood-Only)* | High molecular weight glycoproteins like TSH require targeted blood serum immunoassay. |
| **Anemia & Erythrocyte Deficiency** | **Blood-Only** | Hemoglobin, Hematocrit, RBC, WBC, Platelets | *None (Blood-Only)* | Cellular erythrocyte corpuscles and hemoglobin mass are restricted strictly to whole blood. |

---

## 3. Uploaded Zip Datasets Mapping

1. `healthcare-dataset-stroke-data.zip` -> Maps Age, Hypertension, Heart Disease, Glucose, BMI, Smoking.
2. `diabetes_data_upload.zip` / `pima-indians-diabetes-database.zip` -> Fasting Glucose, HbA1c, Insulin.
3. `indian_liver_patient_dataset.zip` (ILPD) -> ALT, AST, Bilirubin, Total Protein, Albumin.
4. `chronic_kidney_disease.zip` -> Serum Creatinine, BUN, eGFR, Albuminuria, Blood Pressure.
5. `heart_disease_uci.zip` / `heart_failure_clinical_records_dataset.zip` -> Lipids, Resting BP, Heart Rate.
6. `stress_detection_wearable.zip` / `hydration_sweat_sensors.zip` -> Sweat Cortisol, Lactate, Sodium, Potassium.
7. `thyroid_garavan.zip` -> TSH, Free T4.
8. `anemia_types_classification.zip` -> Hemoglobin, Hematocrit, RBC indices.

---

## 4. Harmonization Pipeline
- **Missing Value Handling**: Median imputation stratified by biological sex.
- **Outlier Mitigation**: Robust scaling using interquartile ranges ($IQR$).
- **Engineered Ratios**: eGFR (CKD-EPI formula), De Ritis ratio ($AST/ALT$), Atherogenic Index of Plasma ($log(TG/HDL)$), Mean Arterial Pressure ($MAP = DBP + \frac{1}{3}(SBP - DBP)$).
