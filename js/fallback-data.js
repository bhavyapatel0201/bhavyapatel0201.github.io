/**
 * Fallback Content Object for Bhavya Patel
 * Synchronized with /data/content.json to support offline / file:// protocol previews
 */
window.DEFAULT_CONTENT_FALLBACK = {
  "profile": {
    "name": "Bhavya Patel",
    "firstName": "Bhavya",
    "title": "Master of Applied Computing Student",
    "university": "University of Windsor",
    "avatar": "assets/images/bhavya-patel.jpg",
    "specializationBadge": "AI/ML • Data Engineering • Systems & Automation",
    "tagline": "Master of Applied Computing student at the University of Windsor with hands-on industry experience building NLP pipelines, time-series forecasting models, star-schema data warehouses, and automated backend workflows.",
    "bio": "I am a graduate student in Applied Computing at the University of Windsor, holding a B.Tech in Computer Engineering (3.45/4.0 GPA). With 4 industry internships spanning AI/ML engineering, software development, and automation, I specialize in bridging machine learning with robust data architectures and systems-level programming.",
    "location": "Windsor, ON, Canada",
    "phone": "+1 (289) 968-3185",
    "availabilityStatus": "Open to 4–8 Month Co-Op Starting Jan 2027",
    "resumeUrl": "assets/Bhavya_Patel_Master_Resume.pdf",
    "socials": {
      "github": "https://github.com/bhavyapatel0201",
      "linkedin": "https://www.linkedin.com/in/bhavya-patel-data",
      "email": "patel61d@uwindsor.ca"
    }
  },
  "stats": [
    { "label": "Model Accuracy (Plant CNN)", "value": "96.58%" },
    { "label": "Query Latency Reduction", "value": "30–60%" },
    { "label": "Engineering Internships", "value": "4" },
    { "label": "Real-Time NLP Docs Parsed", "value": "200+" }
  ],
  "specializations": [
    {
      "id": "aiml",
      "title": "AI/ML & Data Science",
      "subtitle": "PyTorch • TensorFlow • NLP • Computer Vision",
      "description": "Training and evaluating deep learning architectures (CNNs, VGG19, DenseNet), NLP document parsing, classical stereo vision (OpenCV, SIFT), and SARIMAX time-series forecasting.",
      "icon": "brain",
      "accentColor": "#6366f1"
    },
    {
      "id": "data",
      "title": "Databases & Data Engineering",
      "subtitle": "PostgreSQL • MySQL • Docker • ETL • Star-Schema",
      "description": "Architecting workload-aware star-schema relational data models, benchmarking query performance cuts (30–60%), data-quality checks, and automated ETL pipelines.",
      "icon": "database",
      "accentColor": "#06b6d4"
    },
    {
      "id": "systems",
      "title": "Systems & Automation",
      "subtitle": "Linux Systems • Shell Scripting • Socket • n8n",
      "description": "Unix/Linux systems programming, process management, socket programming, full-lifecycle REST API development, and automated workflow orchestrations using n8n.",
      "icon": "cpu",
      "accentColor": "#10b981"
    }
  ],
  "experience": [
    {
      "id": "digikentro",
      "role": "AI/ML & Software Development Intern",
      "company": "Digikentro",
      "location": "Vadodara, India",
      "period": "Aug 2025 – Nov 2025",
      "skills": ["NLP", "n8n Automation", "Python", "Root-Cause Analysis", "REST APIs"],
      "highlights": [
        "Built and validated an NLP-based resume/document parsing and extraction system, processing nearly 200 files/resumes in real time against expected results.",
        "Built n8n automation workflows to streamline repetitive parts of a data-processing pipeline, improving reliability of routine system operations.",
        "Diagnosed software issues through systematic debugging and root-cause analysis, working mostly independently and documenting findings clearly for the team.",
        "Documented technical findings and requirements with cross-functional stakeholders, clarifying scope and expectations before implementation began."
      ]
    },
    {
      "id": "kintu",
      "role": "AI/ML Intern",
      "company": "Kintu Designs Pvt. Ltd.",
      "location": "Surat, India",
      "period": "Dec 2024 – Apr 2025",
      "skills": ["Statistical Testing", "Cross-Validation", "Data Quality", "Stakeholder Communication"],
      "highlights": [
        "Analyzed and interpreted multi-source datasets, applying cross-validation and statistical testing to confirm data quality before reporting.",
        "Investigated data-integrity issues to isolate root causes, documenting assumptions, limitations, and recommended next steps for the wider team.",
        "Communicated technical findings, assumptions, and results clearly and consistently to non-technical stakeholders and business partners.",
        "Worked independently through the full project cycle, from framing open questions through validating and presenting final findings to stakeholders."
      ]
    },
    {
      "id": "agevole",
      "role": "AI/ML Intern",
      "company": "Agevole Innovation Pvt. Ltd.",
      "location": "Surat, India",
      "period": "May 2024 – June 2024",
      "skills": ["SARIMAX", "Streamlit", "Python", "Time-Series", "pandas"],
      "highlights": [
        "Built a SARIMAX-based stock forecasting model covering 10 major companies, incorporating real-time company news and developments as predictive signals.",
        "Built a Streamlit dashboard surfacing forecast outputs and trend data, cutting insight-extraction time by roughly 40% for stakeholders.",
        "Documented modeling methodology, assumptions, and trade-offs in detail before presenting results and recommendations to stakeholders."
      ]
    },
    {
      "id": "uniteit",
      "role": "Software Development Intern",
      "company": "UniteIT",
      "location": "Ahmedabad, India",
      "period": "May 2023 – June 2023",
      "skills": ["Node.js", "JavaScript", "REST APIs", "Unit/Integration Testing", "Git"],
      "highlights": [
        "Delivered Node.js/JavaScript REST API changes through the full development lifecycle, from requirements through implementation, testing, and release.",
        "Created and executed unit and integration test cases to validate functionality before deployment, documenting results clearly for the wider engineering team.",
        "Collaborated within an engineering team through Git version control and structured peer code review, incorporating feedback before merging changes.",
        "Investigated integration defects using root-cause analysis, debugging across application layers and retesting systematically after fixes were applied."
      ]
    }
  ],
  "projects": [
    {
      "id": "sales-data-warehouse",
      "title": "Adaptive Sales Data Warehouse",
      "category": "data",
      "tags": ["PostgreSQL", "SQL", "Docker", "ETL", "Star-Schema"],
      "summary": "High-performance star-schema data warehouse in PostgreSQL with workload-aware indexing cutting query latency by 30–60%.",
      "metrics": "30–60% Query Latency Cut • 12-Config Matrix Tested",
      "details": {
        "problem": "Unoptimized relational schemas caused high query latency and resource bottlenecks on complex analytical reports across large sales datasets.",
        "solution": "Designed a star-schema dimensional data model with workload-aware B-tree/composite indexing in PostgreSQL, backed by a reproducible Dockerized environment.",
        "architecture": "Raw Sales Transactions ➔ ETL Ingestion Script ➔ Staging Schema ➔ PostgreSQL Star-Schema (Fact & Dimension Tables) ➔ Indexed Analytical Queries",
        "highlights": [
          "Benchmarked query performance across a 12-configuration matrix, systematically validating 30–60% latency reductions",
          "Containerized database environment with Docker for reproducible development and automated benchmarking",
          "Documented schema and configuration methodology in detail for seamless developer handoff"
        ]
      },
      "links": {
        "github": "https://github.com/bhavyapatel0201/adaptive-warehouse",
        "demo": ""
      }
    },
    {
      "id": "ai-resume-extractor",
      "title": "AI Resume Extractor & Pipeline",
      "category": "aiml",
      "tags": ["Python", "n8n", "REST/JSON", "Generative AI", "python-docx"],
      "summary": "End-to-end automated intake pipeline extracting candidate data via GenAI REST APIs and generating structured DOCX reports.",
      "metrics": "Automated Candidate Reporting • Zero Manual Entry",
      "details": {
        "problem": "Manual resume evaluation created severe throughput bottlenecks and inconsistent candidate assessments across high-volume hiring funnels.",
        "solution": "Engineered an automated intake-to-report workflow connecting front-end submission hooks to back-end GenAI models via REST APIs with dynamic python-docx report generation.",
        "architecture": "Front-End Intake Hook ➔ n8n Orchestrator ➔ REST/JSON GenAI Prompt Engine ➔ Extraction Parser ➔ python-docx Report Generator",
        "highlights": [
          "Developed and iterated prompt designs across multiple LLM configurations, rigorously testing for extraction consistency",
          "Automated formatted candidate analysis reports using python-docx for one-click stakeholder review",
          "Documented end-to-end workflow enabling straightforward operational maintenance and team handoff"
        ]
      },
      "links": {
        "github": "https://github.com/bhavyapatel0201/ResumeExtractor",
        "demo": ""
      }
    },
    {
      "id": "plant-disease-detection",
      "title": "Plant Leaf Disease Detection CNN",
      "category": "aiml",
      "tags": ["Python", "TensorFlow", "CNN", "Computer Vision", "Data Augmentation"],
      "summary": "Deep convolutional neural network trained on plant leaf imagery, reaching 96.58% classification accuracy across multiple disease types.",
      "metrics": "96.58% Classification Accuracy • Precision & Recall Verified",
      "details": {
        "problem": "Accurate early-stage plant disease detection requires robust visual feature classification invariant to lighting shifts and leaf angles.",
        "solution": "Built and trained a multi-class CNN in TensorFlow with rigorous image augmentation, confusion matrix diagnostics, and iterative layer refinement.",
        "architecture": "Leaf Images ➔ Preprocessing & Augmentation ➔ Multi-Layer CNN (Conv2D + MaxPool + Dropout) ➔ Dense Classification Head ➔ Disease Diagnosis",
        "highlights": [
          "Attained 96.58% test classification accuracy across diverse plant pathology categories",
          "Implemented data augmentation (flips, rotations, lighting adjustments) to prevent overfitting",
          "Evaluated performance using per-class precision, recall, and confusion-matrix analysis"
        ]
      },
      "links": {
        "github": "",
        "demo": ""
      }
    },
    {
      "id": "stock-market-forecasting",
      "title": "Stock Market Analysis & Prediction",
      "category": "aiml",
      "tags": ["Python", "SARIMAX", "pandas", "Streamlit", "Time-Series"],
      "summary": "Predictive time-series forecasting pipeline covering 10 major companies with news signals and an interactive Streamlit dashboard.",
      "metrics": "40% Faster Insight Extraction • 10 Major Equities",
      "details": {
        "problem": "Traditional financial models fail to combine exogenous real-time news developments with underlying stock price momentum.",
        "solution": "Developed a SARIMAX forecasting engine integrating news events as exogenous predictive signals, accompanied by an interactive Streamlit dashboard.",
        "architecture": "Market Price History + News Signals ➔ pandas Cleaning & Stationarity Checks ➔ SARIMAX Engine ➔ Streamlit Interactive Dashboard",
        "highlights": [
          "Streamlit dashboard surfaced forecast outputs and trend curves, cutting insight-extraction time by ~40% for stakeholders",
          "Iterated on model hyper-parameters (p, d, q) and seasonal components across 10 major enterprises",
          "Detailed methodology, trade-offs, and forecasting assumptions documented for management"
        ]
      },
      "links": {
        "github": "",
        "demo": ""
      }
    },
    {
      "id": "stereo-image-matching",
      "title": "Stereo Image Matching & Epipolar Geometry",
      "category": "aiml",
      "tags": ["OpenCV", "SIFT", "RANSAC", "MAGSAC++", "Computer Vision"],
      "summary": "Classical computer vision implementation for stereo image matching, epipolar geometry estimation, and outlier rejection.",
      "metrics": "Robust Fundamental Matrix Estimation • Sub-pixel Accuracy",
      "details": {
        "problem": "Stereo depth estimation requires accurate feature correspondence and robust fundamental matrix computation despite heavy visual outliers.",
        "solution": "Employed SIFT feature extraction, epipolar line constraints, and compared RANSAC vs. MAGSAC++ estimators across challenging image pairs.",
        "architecture": "Stereo Image Pair ➔ SIFT Keypoint & Descriptor Extraction ➔ FLANN Matcher ➔ RANSAC/MAGSAC++ Matrix Estimation ➔ Epipolar Geometry Verification",
        "highlights": [
          "Estimated and refined fundamental and essential matrices across outlier-heavy image pairs",
          "Visualized matched keypoints and epipolar lines directly in OpenCV to mathematically verify geometric correctness"
        ]
      },
      "links": {
        "github": "https://github.com/bhavyapatel0201/Stereo-Image-Matching-and-Epipolar-Geometry",
        "demo": ""
      }
    },
    {
      "id": "transfer-learning-classification",
      "title": "Transfer Learning for Object Classification",
      "category": "aiml",
      "tags": ["PyTorch", "VGG19", "DenseNet121", "Hyperparameter Search"],
      "summary": "PyTorch computer vision pipeline comparing fine-tuned VGG19 and DenseNet121 architectures via systematic hyperparameter optimization.",
      "metrics": "Systematic Multi-Model Benchmarking",
      "details": {
        "problem": "Selecting the optimal deep feature extractor and learning rate schedules for domain-specific visual classification.",
        "solution": "Constructed a comparative PyTorch training pipeline testing VGG19 against DenseNet121 with automated augmentation and validation tracking.",
        "architecture": "Augmented Training Batches ➔ Pre-trained Backbone (VGG19 / DenseNet121) ➔ Custom Classification Head ➔ Validation Benchmark",
        "highlights": [
          "Preprocessed and augmented image datasets to maximize generalization performance",
          "Conducted systematic hyperparameter search across learning rates, optimizers, and batch sizes"
        ]
      },
      "links": {
        "github": "https://github.com/bhavyapatel0201/Transfer-Learning-Object-Classification",
        "demo": ""
      }
    },
    {
      "id": "credit-card-analysis",
      "title": "Credit Card Comparison & Web Automation",
      "category": "data",
      "tags": ["Python", "Selenium", "BeautifulSoup", "pandas", "ETL"],
      "summary": "Automated data harvesting and cross-validation pipeline extracting and analyzing reward metrics across 20 credit cards.",
      "metrics": "20 Cards Researched • Automated Data Validation",
      "details": {
        "problem": "Financial products frequently update fees, interest rates, and rewards across disparate live web sources without structured APIs.",
        "solution": "Built automated web scrapers with Selenium and BeautifulSoup, backed by pandas data quality checks to flag anomalies before reporting.",
        "architecture": "Live Card Sources ➔ Selenium/BeautifulSoup Scraper ➔ Data-Quality Validation Checks ➔ pandas DataFrame ➔ Consolidated Report",
        "highlights": [
          "Designed data-quality filters to automatically catch inconsistencies and anomalies",
          "Consolidated findings into a cleanly structured comparison matrix for non-technical readers"
        ]
      },
      "links": {
        "github": "https://github.com/bhavyapatel0201/Credit-Card-Comparison-Analysis-",
        "demo": ""
      }
    },
    {
      "id": "expense-tracker-android",
      "title": "Expense Tracker Android App",
      "category": "systems",
      "tags": ["Java", "Android Studio", "Gradle", "Unit Testing", "Mobile"],
      "summary": "Native Android expense management application built in Java with unit-tested calculation flows and Gradle dependency configuration.",
      "metrics": "Comprehensive Unit Test Coverage",
      "details": {
        "problem": "Users need an intuitive, offline-capable mobile application to record and categorize daily expenditures accurately.",
        "solution": "Developed a native Java Android application following clean UI data-entry patterns, verified with unit tests for calculation accuracy.",
        "architecture": "Android XML Layouts ➔ Activity / Fragment Controllers ➔ Expense Data Model ➔ Unit Test Validation Suite",
        "highlights": [
          "Wrote unit tests to validate calculation logic and transaction data handling, catching regressions early",
          "Managed build configuration and dependencies cleanly with Gradle"
        ]
      },
      "links": {
        "github": "",
        "demo": ""
      }
    },
    {
      "id": "solar-unit-calculator",
      "title": "Solar Unit Calculator",
      "category": "web",
      "tags": ["HTML", "CSS", "JavaScript", "Front-End", "Validation"],
      "summary": "Interactive web calculator estimating solar panel power output, environmental savings, and financial returns with robust input sanitization.",
      "metrics": "Responsive Layout • Real-Time Calculation",
      "details": {
        "problem": "Homeowners require immediate, transparent estimates of solar power output based on variable energy consumption inputs.",
        "solution": "Engineered a client-side calculation tool in vanilla HTML/CSS/JavaScript with defensive input validation to guard against out-of-range entries.",
        "architecture": "Energy Usage Inputs ➔ Real-time Validation Engine ➔ Solar Output & Savings Formula ➔ Dynamic Results View",
        "highlights": [
          "Implemented computation logic and responsive interface entirely in vanilla web technologies",
          "Enforced strict validation to handle edge-case inputs gracefully"
        ]
      },
      "links": {
        "github": "",
        "demo": ""
      }
    }
  ],
  "skills": {
    "Programming Languages": [
      { "name": "Python", "level": "Advanced" },
      { "name": "Java", "level": "Proficient" },
      { "name": "JavaScript", "level": "Proficient" },
      { "name": "C", "level": "Intermediate" },
      { "name": "SQL", "level": "Advanced" }
    ],
    "Databases & Data Engineering": [
      { "name": "PostgreSQL", "level": "Advanced" },
      { "name": "MySQL", "level": "Proficient" },
      { "name": "SQLite", "level": "Proficient" },
      { "name": "Docker", "level": "Proficient" },
      { "name": "ETL Pipeline Design", "level": "Advanced" },
      { "name": "Star-Schema Modeling", "level": "Advanced" }
    ],
    "AI/ML & Data Science": [
      { "name": "PyTorch", "level": "Advanced" },
      { "name": "TensorFlow", "level": "Advanced" },
      { "name": "SARIMAX Forecasting", "level": "Advanced" },
      { "name": "Natural Language Processing (NLP)", "level": "Advanced" },
      { "name": "Computer Vision (OpenCV)", "level": "Proficient" },
      { "name": "Streamlit", "level": "Advanced" },
      { "name": "Power BI", "level": "Proficient" }
    ],
    "Systems, Automation & Tools": [
      { "name": "Unix/Linux Systems Programming", "level": "Proficient" },
      { "name": "Shell Scripting", "level": "Proficient" },
      { "name": "Process Management", "level": "Proficient" },
      { "name": "Socket Programming", "level": "Intermediate" },
      { "name": "n8n Automation", "level": "Advanced" },
      { "name": "Git / GitHub", "level": "Advanced" },
      { "name": "REST APIs", "level": "Advanced" },
      { "name": "Unit & Integration Testing", "level": "Proficient" },
      { "name": "AI Coding Assistants (Copilot, Claude)", "level": "Advanced" }
    ]
  },
  "certifications": [
    {
      "id": "aws-cloud",
      "name": "AWS Academy Graduate – Cloud Foundations",
      "issuer": "Amazon Web Services (AWS)",
      "badge": "AWS",
      "badgeClass": "badge-aws",
      "date": "Mar 31, 2026",
      "hours": "20 Hours",
      "credentialId": "LPwNXqTq",
      "credentialUrl": "https://www.credly.com/go/LPwNXqTq",
      "status": "Verified Credential",
      "topics": [
        "Cloud Architecture",
        "EC2 & S3",
        "IAM Security",
        "VPC & Networking"
      ],
      "certificateFile": "assets/certificates/aws-cloud-foundations.pdf"
    },
    {
      "id": "aws-genai",
      "name": "AWS Academy Graduate – Generative AI Foundations",
      "issuer": "Amazon Web Services (AWS)",
      "badge": "GenAI",
      "badgeClass": "badge-genai",
      "date": "Jul 05, 2026",
      "hours": "12 Hours",
      "credentialId": "c5a241b0-e329-456f-a9ab-365575f3ccc0",
      "credentialUrl": "https://www.credly.com/badges/c5a241b0-e329-456f-a9ab-365575f3ccc0",
      "status": "Verified Credential",
      "topics": [
        "Foundation Models",
        "Prompt Engineering",
        "Fine-Tuning",
        "Responsible AI"
      ],
      "certificateFile": "assets/certificates/aws-generative-ai-foundations.pdf"
    },
    {
      "id": "dc-sql-perf",
      "name": "Improving Query Performance in SQL Server",
      "issuer": "DataCamp",
      "badge": "DataCamp",
      "badgeClass": "badge-datacamp",
      "date": "Jun 28, 2026",
      "hours": "4 Hours",
      "credentialId": "#48,571,620",
      "credentialUrl": "",
      "status": "Statement of Accomplishment",
      "topics": [
        "Execution Plans",
        "Index Optimization",
        "Query Tuning",
        "Latency Reduction"
      ],
      "certificateFile": "assets/certificates/datacamp-improving-query-performance-sql-server.pdf"
    },
    {
      "id": "dc-sql-trans",
      "name": "Transactions and Error Handling in SQL Server",
      "issuer": "DataCamp",
      "badge": "DataCamp",
      "badgeClass": "badge-datacamp",
      "date": "Jul 01, 2026",
      "hours": "4 Hours",
      "credentialId": "#48,615,551",
      "credentialUrl": "",
      "status": "Statement of Accomplishment",
      "topics": [
        "ACID Transactions",
        "Concurrency & Locks",
        "TRY...CATCH",
        "Savepoints"
      ],
      "certificateFile": "assets/certificates/datacamp-transactions-error-handling-sql-server.pdf"
    },
    {
      "id": "dc-db-design",
      "name": "Database Design",
      "issuer": "DataCamp",
      "badge": "DataCamp",
      "badgeClass": "badge-datacamp",
      "date": "May 10, 2026",
      "hours": "4 Hours",
      "credentialId": "#47,592,809",
      "credentialUrl": "",
      "status": "Statement of Accomplishment",
      "topics": [
        "Dimensional Modeling",
        "Star Schema",
        "Normalization",
        "OLAP vs OLTP"
      ],
      "certificateFile": "assets/certificates/datacamp-database-design.pdf"
    },
    {
      "id": "dc-snowflake",
      "name": "Introduction to Snowflake",
      "issuer": "DataCamp",
      "badge": "DataCamp",
      "badgeClass": "badge-datacamp",
      "date": "May 25, 2026",
      "hours": "2 Hours",
      "credentialId": "#47,908,471",
      "credentialUrl": "",
      "status": "Statement of Accomplishment",
      "topics": [
        "Cloud Data Warehouse",
        "Virtual Warehouses",
        "Data Sharing",
        "Scaling Compute"
      ],
      "certificateFile": "assets/certificates/datacamp-introduction-to-snowflake.pdf"
    },
    {
      "id": "dc-data-mgmt",
      "name": "Data Management Concepts",
      "issuer": "DataCamp",
      "badge": "DataCamp",
      "badgeClass": "badge-datacamp",
      "date": "Jul 21, 2026",
      "hours": "2 Hours",
      "credentialId": "#48,894,668",
      "credentialUrl": "",
      "status": "Statement of Accomplishment",
      "topics": [
        "Data Governance",
        "Master Data Management",
        "Data Architecture",
        "Storage Types"
      ],
      "certificateFile": "assets/certificates/datacamp-data-management-concepts.pdf"
    },
    {
      "id": "dc-data-sec",
      "name": "Introduction to Data Security",
      "issuer": "DataCamp",
      "badge": "DataCamp",
      "badgeClass": "badge-datacamp",
      "date": "Jul 21, 2026",
      "hours": "2 Hours",
      "credentialId": "#48,912,994",
      "credentialUrl": "",
      "status": "Statement of Accomplishment",
      "topics": [
        "Access Control",
        "Data Encryption",
        "Compliance & Privacy",
        "Threat Vectors"
      ],
      "certificateFile": "assets/certificates/datacamp-introduction-to-data-security.pdf"
    },
    {
      "id": "sterling-cyber",
      "name": "Sterling Cybersecurity Workshop",
      "issuer": "Sterling Information Technologies Inc.",
      "badge": "Cyber",
      "badgeClass": "badge-sec",
      "date": "Apr 01, 2026",
      "hours": "Workshop",
      "credentialUrl": "",
      "status": "Certificate of Completion",
      "topics": [
        "Ethical Hacking",
        "Network Defense",
        "Digital Forensics",
        "Threat Mitigation"
      ],
      "certificateFile": "assets/certificates/sterling-cybersecurity-workshop.pdf",
      "partners": "In partnership with University of Windsor & EC-Council"
    }
  ],
  "education": [
    {
      "degree": "Master of Applied Computing",
      "institution": "University of Windsor",
      "location": "Windsor, ON, Canada",
      "period": "Jan 2026 – Present",
      "coopStatus": "Open to a 4–8 month Co-Op commencing in Jan 2027",
      "highlights": [
        "Advanced graduate studies in computing systems, AI/ML, and software architecture",
        "Actively seeking 4–8 month Co-Op placement beginning January 2027"
      ]
    },
    {
      "degree": "Bachelor of Technology, Computer Engineering",
      "institution": "Charotar University of Science and Technology (CHARUSAT)",
      "location": "Anand, Gujarat, India",
      "period": "Sept 2021 – May 2025",
      "gpa": "3.45 / 4.0",
      "highlights": [
        "Rigorous coursework in Operating Systems, Database Systems, Computer Architecture, Data Structures, and Software Engineering",
        "Graduated with 3.45 / 4.0 GPA"
      ]
    }
  ],
  "contact": {
    "heading": "Let's Connect & Collaborate",
    "subheading": "I am open to 4–8 month Co-Op positions commencing in January 2027, as well as AI/ML, Data Engineering, and Software Development collaborations.",
    "email": "patel61d@uwindsor.ca",
    "phone": "+1 (289) 968-3185",
    "location": "Windsor, ON, Canada",
    "socialLinks": [
      { "platform": "Email", "url": "mailto:patel61d@uwindsor.ca", "handle": "patel61d@uwindsor.ca" },
      { "platform": "LinkedIn", "url": "https://www.linkedin.com/in/bhavya-patel-data", "handle": "linkedin.com/in/bhavya-patel-data" },
      { "platform": "GitHub", "url": "https://github.com/bhavyapatel0201", "handle": "github.com/bhavyapatel0201" }
    ]
  }
};
