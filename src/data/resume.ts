import { skills } from './skills';

export const resumeSkills = [
  {
    category: 'Programming & Data Handling',
    items: ['Python', 'Pandas', 'Scikit-learn', 'Flask', 'BS4', 'Docling', 'FastMCP', 'Selenium', 'PySpark', 'SQL', 'Java', 'Kotlin', 'JSON', 'MSAL', 'python-docx', 'pypdf']
  },
  ...skills.map((group) => ({
    category: group.category,
    items: group.items.map((item) => typeof item === 'string' ? item : item.name)
  }))
];

export const resumeExperience = [
  {
    company: 'Inceptez Technologies',
    role: 'Engineering Intern',
    dates: 'Mar 2026 — Present',
    projects: [
      {
        name: 'Adaptive AI Email Orchestration & Response System',
        technologies: 'Ollama, Microsoft Graph API, MySQL, Regex',
        contributions: [
          'Built a multi-stage LLM pipeline for automated email extraction, contextual responses, and structured processing.',
          'Reduced processing overhead with complexity-based routing and achieved 100% keyword extraction accuracy.',
          'Connected Microsoft Graph API for automated retrieval and processing of incoming email.'
        ]
      },
      {
        name: 'Invoice Image Processing',
        technologies: 'EasyOCR, PaddleOCR-VL, Ollama, Flask, OpenCV, PyMuPDF',
        contributions: [
          'Built an OCR pipeline that converts multi-page invoices into structured JSON and CSV.',
          'Designed metadata-driven template learning to normalize vendor data into a unified, SQL-ready schema.',
          'Achieved 98.56% extraction accuracy through validation and vendor-specific field normalization.'
        ]
      },
      {
        name: 'ClaimEazy Insurance Management App',
        technologies: 'Flask, Kotlin, Firebase, MySQL, RBAC',
        contributions: [
          'Built a role-based insurance platform for client policy and claim workflows.',
          'Developed an Android application integrated with Flask APIs for CRUD operations and role-based access.',
          'Supported controlled access for Client, Admin, Approver, and ETL roles.'
        ]
      }
    ]
  },
  {
    company: 'SmartInternz',
    role: 'Engineering Intern',
    dates: 'Sep 2024 — Oct 2024',
    projects: [
      {
        name: 'ECG Data Processing for Arrhythmia Detection',
        technologies: 'TensorFlow, Keras, CNN, BiLSTM, SMOTE',
        contributions: [
          'Developed a hybrid CNN-BiLSTM model with gated convolutions for ECG arrhythmia classification.',
          'Achieved 98.88% validation accuracy using data preprocessing and SMOTE for imbalanced classes.',
          'Applied bandpass filtering, discrete wavelet transform, and Pan-Tompkins R-peak detection.'
        ]
      }
    ]
  }
];

export const personalProjects = [
  {
    name: 'Jarvis PA',
    technologies: 'LLMs, MCP, Agentic AI, OpenClaw, Oracle Cloud',
    contributions: [
      'Developed a multi-agent personal assistant with planner, router, and worker layers.',
      'Designed JarvisMCP with 100+ tools and a reusable tool registry.',
      'Integrated OpenClaw and JarvisMCP and deployed to Oracle Cloud for WhatsApp access.'
    ]
  },
  {
    name: 'LinkedIn Job-Scraper',
    technologies: 'Selenium, Ollama, Threading, JSON, MVC',
    contributions: [
      'Built an AI-powered job scraper with resilient extraction and automated information processing.',
      'Produced structured job datasets with skills, experience, timestamps, and insights using LLM extraction.'
    ]
  },
  {
    name: 'Smart Cane for Visually Impaired',
    technologies: 'ESP32, Python, Firebase, Kotlin, Google Maps, TTS, PySpark',
    contributions: [
      'Built a smart cane with navigation, obstacle and fall detection, and audio/haptic feedback.',
      'Generated 500,000+ data points and enabled real-time alerts and movement tracking.',
      'Integrated motion sensors for fall detection with an accessible Android app.'
    ]
  },
  {
    name: 'Crop Health Diagnosis and Remediation',
    technologies: 'Python, TensorFlow, Keras, OpenCV, MongoDB',
    contributions: [
      'Developed a CNN application that diagnoses 38 crop diseases from images at 96% accuracy.',
      'Trained on 70,000 images for disease detection and crop health reporting.'
    ]
  },
  {
    name: 'Swim-Lap Counter',
    technologies: 'Python, Flask, Kotlin, Firebase, PIC Microcontroller',
    contributions: [
      'Built an automated IR-sensor lap counter with real-time swimmer performance tracking.',
      'Created synchronized live metrics for responsive performance monitoring.'
    ]
  }
];

export const resumeCertifications = [
  'AZ-900 — Microsoft Certified Azure Fundamentals',
  'PCAP — Python Level 2 (OpenEDG / Python Institute)',
  'PCEP — Python Level 1 (OpenEDG / Python Institute)',
  'Python for Data Science — NPTEL',
  'Android Application Development — SmartInternz',
  'Complete AI Guide (ChatGPT & GenAI) — Udemy',
  'The Complete SQL Bootcamp — Udemy'
];

export const resumeLanguages = [
  'English — Proficient',
  'Tamil — Native',
  'Hindi — Basic',
  'Japanese — Beginner'
];

export const resumeActivities = [
  'Organized gaming events at Techno-VIT.',
  'Competed in FIDE chess tournaments.',
  'Video editing for a YouTube channel.',
  'Japanese language learning streak of 450+ days.'
];
