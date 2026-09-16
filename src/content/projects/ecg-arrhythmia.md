---
title: "ECG Arrhythmia Detection"
shortDescription: "A deep learning pipeline for cardiac arrhythmia classification from ECG signals, combining CNN and BiLSTM architectures."
status: "Completed"
dates: "Sep 2024 — Oct 2024"
featured: false
order: 7
technologies: ["Python", "TensorFlow", "CNN", "BiLSTM", "Pan-Tompkins", "SMOTE", "DWT"]
archFlow:
  - "ECG Signal Input"
  - "Bandpass Filtering"
  - "DWT (Discrete Wavelet Transform)"
  - "Pan-Tompkins R-Peak Detection"
  - "Segmentation + SMOTE (class balance)"
  - "CNN + BiLSTM Classification"
  - "Arrhythmia Class Output"
overview: >
  A signal processing and deep learning pipeline for classifying cardiac arrhythmias from raw ECG data. Built as part of an engineering internship at SmartInternz. Combines classical signal processing (DWT, Pan-Tompkins) with a deep learning classification model (CNN + BiLSTM).
problem: >
  Arrhythmia classification from ECG is a structured signal classification problem where class imbalance is a significant practical challenge — normal sinus rhythm dominates most clinical datasets, making rare arrhythmia classes difficult to learn without correction. Raw ECG signals also require preprocessing before features are meaningful to a classifier.
whatWasBuilt: >
  A preprocessing pipeline (bandpass filtering, DWT decomposition, Pan-Tompkins R-peak detection) feeding into a segmented beat classification model using a CNN + BiLSTM architecture. SMOTE was applied to the training set to address class imbalance before model training.
implementationDetails: >
  Bandpass filtering removes baseline wander and high-frequency noise. DWT decomposes the signal into frequency bands relevant to arrhythmia features. Pan-Tompkins is applied for reliable R-peak detection, enabling beat segmentation. The CNN extracts local morphological features from each beat segment; the BiLSTM captures sequential patterns across beats. Gated convolutions were explored as an architectural variant.
results: >
  Evaluated on a held-out validation set. Validation accuracy reflects model performance on unseen ECG data.
metrics: >
  Validation accuracy:   98.88%
---

## Context

This project was completed during a two-month engineering internship at SmartInternz (Sep–Oct 2024). The 98.88% figure is validation accuracy on the held-out evaluation set; no clinical deployment claims are made.
