---
title: "Smart Cane"
shortDescription: "An IoT-enabled assistive device for visually impaired users with obstacle detection, fall detection, and real-time location alerts."
status: "Completed"
dates: "2025"
featured: true
order: 6
technologies: ["ESP32", "Ultrasonic Sensors", "MPU6050", "Android", "Kotlin", "Firebase", "Google Maps API"]
archFlow:
  - "ESP32 Microcontroller"
  - "Ultrasonic Sensing + MPU6050 (fall detection)"
  - "Audio / Haptic Feedback (on-device)"
  - "Firebase Realtime Database"
  - "Android Application (Kotlin)"
  - "Caregiver Alerts + Google Maps Location"
overview: >
  A hardware/software accessibility system designed to assist visually impaired users. Combines embedded sensor processing on an ESP32 microcontroller with a paired Android application that provides caregiver alerts and real-time location tracking.
problem: >
  Standard white canes provide physical obstacle feedback but no fall detection, no caregiver alerts, and no location tracking. An integrated system could extend the safety and independence of visually impaired users without requiring expensive medical hardware.
whatWasBuilt: >
  An ESP32-based device with ultrasonic obstacle detection, MPU6050-based fall detection, and audio/haptic feedback. A paired Android application (Kotlin) receives sensor events via Firebase Realtime Database, displays real-time location on Google Maps, and sends caregiver alerts on fall detection. Data from device operation was logged for analysis.
architecture: >
  The ESP32 reads ultrasonic distance sensors and MPU6050 accelerometer data continuously. Obstacle events trigger on-device audio/haptic feedback immediately (no cloud round-trip required for feedback latency). Fall events and location data are pushed to Firebase Realtime Database. The Android app subscribes to Firebase and renders the location feed and alert state.
implementationDetails: >
  On-device feedback (audio/haptic) was prioritised over cloud-mediated feedback to eliminate latency between obstacle detection and user response. Firebase Realtime Database was chosen for its low-latency pub/sub characteristics over a traditional REST API, which would have introduced polling latency for caregiver alerts. The MPU6050 provides 3-axis acceleration for fall signature detection.
decisions: >
  We chose ESP32 over Raspberry Pi because the cane needs lightweight, low-power real-time sensor processing rather than a full operating system, making ESP32 more suitable for a battery-powered wearable device. We also used multiple ultrasonic sensors instead of one because a single sensor provides limited directional coverage, while multiple sensors allow the cane to detect obstacles across a wider area. This combination keeps the hardware compact, power-efficient, and practical while still providing reliable obstacle detection and sensor processing.
results: >
  Device operation generated 500,000+ data points during development and testing. Obstacle detection and fall detection operated within acceptable latency bounds for real-time feedback.
metrics: >
  Generated data points:   500,000+
---