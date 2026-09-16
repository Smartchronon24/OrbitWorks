---
title: "Invoice Image Processing"
shortDescription: "An OCR and LLM pipeline for extracting structured data from invoice images and PDFs."
status: "Active"
dates: "2026"
featured: true
order: 2
technologies: ["EasyOCR", "PaddleOCR-VL", "Ollama", "Flask", "OpenCV", "PyMuPDF"]
archFlow:
  - "Invoice Image / PDF Input"
  - "Preprocessing (deskew, contrast, denoise)"
  - "OCR — EasyOCR"
  - "LLM-Assisted Field Extraction"
  - "Deterministic Parsing & Validation"
  - "Vendor Normalisation"
  - "JSON / CSV Output"
overview: >
  A pipeline for turning unstructured invoice images and PDFs into clean, validated, structured data. Built to handle the practical messiness of real invoice documents: variable layouts, multi-page invoices, handwritten annotations, low-quality scans, and inconsistent vendor formats.
problem: >
  Invoice processing at scale requires converting heterogeneous document images into structured records. Naive OCR alone produces raw text without layout understanding; pure LLM extraction without preprocessing is fragile to scan quality. The challenge was building a pipeline that is both accurate and resilient.
whatWasBuilt: >
  A multi-stage pipeline combining image preprocessing, EasyOCR text extraction, LLM-assisted field identification, deterministic parsing, and validation. Outputs validated JSON and CSV records. Handles multi-page invoices, table extraction, and vendor name normalisation.
architecture: >
  Documents enter as image or PDF. Preprocessing corrects orientation, contrast, and noise. EasyOCR extracts text with bounding-box metadata. An LLM identifies semantic fields from the raw extraction. A deterministic parser validates and structures the output. Vendor normalisation maps inconsistent vendor names to canonical forms.
implementationDetails: >
  EasyOCR was selected as the primary OCR engine after comparing accuracy and integration complexity. The LLM extraction layer uses a structured prompt that receives raw OCR text and bounding-box data, returning field assignments as JSON. Deterministic parsing then validates field types, formats, and required fields — the LLM is not trusted blindly. Table extraction handles line-item rows with variable column structure.
challenges: >
  The largest engineering challenge was layout variability: invoices have no standard structure. Bounding-box data from EasyOCR was essential for understanding spatial relationships between text elements. Low-quality scans required tuning the preprocessing stack to prevent OCR degradation from affecting downstream extraction accuracy.
decisions: >
  Three alternative approaches were evaluated: Docling, LayoutParser, and DocLayout-YOLO. Docling offered structured document parsing but required additional integration work and was less resilient to degraded scan quality in testing. LayoutParser's region-based approach was evaluated for table detection but introduced pipeline complexity that was not justified by accuracy gains. DocLayout-YOLO showed promise for layout segmentation but was ultimately not retained in the final pipeline. The current EasyOCR + LLM hybrid was selected because it demonstrated the best balance of accuracy, robustness, and implementation simplicity.
tradeoffs: >
  Using an LLM for field extraction introduces inference cost and latency compared to a purely deterministic approach. This was accepted because deterministic rule extraction alone fails on novel invoice layouts. The deterministic validation layer mitigates LLM hallucination risk by enforcing expected field types and formats.
results: >
  Evaluated against a 27-invoice test set. Results reflect the final pipeline, not experimental branches.
metrics: >
  Overall pipeline accuracy:   98.56%
  Field extraction accuracy:   97.12%
  Perfectly extracted rows:    23 / 27
  Items matched:               27 / 27
---

## Experimental Branches

During development, Docling, LayoutParser, and DocLayout-YOLO were each evaluated as alternative approaches. None were retained in the final production pipeline; their evaluation informed the decision to use EasyOCR as the primary extraction engine. These experiments are documented above under Technical Decisions.