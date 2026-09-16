---
title: "LinkedIn Job Scraper"
shortDescription: "A resilient web scraper for extracting and structuring LinkedIn job postings with LLM-assisted field extraction."
status: "Experimental"
dates: "2026"
featured: false
order: 4
technologies: ["Python", "Selenium", "LLMs", "Threading", "JSON"]
archFlow:
  - "Selenium Browser Automation"
  - "Job Listing Extraction"
  - "LLM-Assisted Field Parsing"
  - "Threading (parallel extraction)"
  - "JSON Output"
overview: >
  A scraper built to extract structured data from LinkedIn job postings, handling the inconsistency and dynamic rendering of LinkedIn's web interface. LLM-assisted parsing handles variability in job description formatting.
problem: >
  LinkedIn job data is not available via a stable public API. The web interface uses dynamic rendering and varies structurally across job categories and regions. Extracting structured fields (role, company, requirements, responsibilities) from inconsistently formatted postings at scale required combining browser automation with intelligent parsing.
whatWasBuilt: >
  A Python scraper using Selenium for browser automation, with threaded extraction for parallel processing across multiple job listings. An LLM-assisted parsing layer handles inconsistent job description structure, extracting key fields into a normalised JSON schema.
implementationDetails: >
  Threading was implemented to allow concurrent extraction across multiple job listing pages, reducing total scrape time. Selenium handles JavaScript-rendered content that static HTML scrapers cannot access. The MVC separation keeps scraping logic, parsing logic, and data output as independent layers. LLM field extraction is constrained by a strict JSON output schema to ensure consistent records regardless of source variation.
decisions: >
  LLM-assisted field extraction was chosen over purely regex-based parsing because job description formatting is too variable for reliable pattern matching. Constraining the LLM to a structured JSON schema mitigates hallucination risk on well-defined fields.
---