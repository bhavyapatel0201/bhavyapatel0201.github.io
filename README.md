# Bhavya Patel - Master of Applied Computing Portfolio

A modern, responsive portfolio website custom-tailored for **Bhavya Patel**, Master of Applied Computing student at the **University of Windsor**, specializing in AI/ML, Data Engineering, and Systems & Automation.

---

## 🚀 Live Site

👉 **[https://bhavyapatel0201.github.io](https://bhavyapatel0201.github.io)** (GitHub Pages, deployed from the `main` branch)

To preview locally: run `python -m http.server 3000` in this folder and open http://localhost:3000.
Publishing a change: commit and `git push`; GitHub Pages updates within a minute or two.

---

## 👤 Profile & Background
- **Name**: Bhavya Patel
- **Education**:
  - **University of Windsor** — Master of Applied Computing (*Jan 2026 – Present*, Open to 4–8 month Co-Op commencing in Jan 2027)
  - **Charotar University of Science & Technology (CHARUSAT)** — B.Tech in Computer Engineering (*GPA: 3.45 / 4.0, Sept 2021 – May 2025*)
- **Contact**: `patel61d@uwindsor.ca` • `+1 (289) 968-3185` • Windsor, ON, Canada

---

## 💼 Industry Experience Featured
1. **Digikentro** (Vadodara, India) — *AI/ML & Software Development Intern* (Aug 2025 – Nov 2025)
2. **Kintu Designs Pvt. Ltd.** (Surat, India) — *AI/ML Intern* (Dec 2024 – Apr 2025)
3. **Agevole Innovation Pvt. Ltd.** (Surat, India) — *AI/ML Intern* (May 2024 – June 2024)
4. **UniteIT** (Ahmedabad, India) — *Software Development Intern* (May 2023 – June 2023)

---

## 🛠️ Featured Projects
1. **Adaptive Sales Data Warehouse** (PostgreSQL, Docker, ETL, Star-Schema) — 30–60% latency reduction.
2. **AI Resume Extractor & Pipeline** (Python, n8n, Generative AI, REST/JSON, python-docx).
3. **Plant Leaf Disease Detection CNN** (TensorFlow, CNN) — 96.58% classification accuracy.
4. **Stock Market Analysis & Prediction** (SARIMAX, Streamlit, pandas) — 40% faster insight extraction across 10 equities.
5. **Stereo Image Matching & Epipolar Geometry** (OpenCV, SIFT, RANSAC, MAGSAC++).
6. **Transfer Learning for Object Classification** (PyTorch, VGG19, DenseNet121).
7. **Credit Card Comparison & Web Automation** (Python, Selenium, BeautifulSoup, pandas).
8. **Expense Tracker Android App** (Java, Android Studio, Gradle).
9. **Solar Unit Calculator** (HTML, CSS, JavaScript).

---

## 📜 Certifications (9 Verified)
1. **AWS Academy Graduate – Cloud Foundations** (20 Hours • Credly Verified)
2. **AWS Academy Graduate – Generative AI Foundations** (12 Hours • Credly Verified)
3. **DataCamp – Improving Query Performance in SQL Server** (4 Hours • #48,571,620)
4. **DataCamp – Transactions and Error Handling in SQL Server** (4 Hours • #48,615,551)
5. **DataCamp – Database Design** (4 Hours • #47,592,809)
6. **DataCamp – Introduction to Snowflake** (2 Hours • #47,908,471)
7. **DataCamp – Data Management Concepts** (2 Hours • #48,894,668)
8. **DataCamp – Introduction to Data Security** (2 Hours • #48,912,994)
9. **Sterling Cybersecurity Workshop** (Ethical Hacking, Network Defense, Digital Forensics)

---

## ✏️ How to Edit Content
All portfolio text, projects, experiences, and links are managed in:
📁 `data/content.json`

### Project filter categories
Each project's `"category"` in `data/content.json` must be one of `aiml`, `data`, `systems` or `web`.
These drive the filter buttons (AI/ML, Data, Systems, Web). To add a new category, add it to
`CATEGORIES` at the top of `js/projects.js`.

> Note: `js/fallback-data.js` is a copy of the content used only when the page is opened
> straight from disk (`file://`). Keep it in sync if you rely on that.

### Accessibility & motion
- Visitors with **reduced motion** turned on get no reveal, typing or hover-lift animations, and instant scrolling.
- The theme follows the OS setting until the visitor uses the toggle; that choice is then saved.
- The contact form emails messages to you through [FormSubmit](https://formsubmit.co) (no account needed). **The first real submission sends an activation email to patel61d@uwindsor.ca. Click the link in it once**, or messages won't be delivered. To use another service, change `contact.formEndpoint` in `data/content.json` (and `data-endpoint` on the form in `index.html`). If sending fails, visitors get a pre-filled email link instead.

### 3D background, swipes & section order
- **Background** (`js/scene.js`): one fixed canvas behind the page. Scrolling flies through it (down = forward, up = back) and morphs the centre shape per section. Change a section's shape in `SHAPE_FOR` at the top of the file.
- **Swipes** (`js/gestures.js`, `js/selector.js`, `js/projects.js`): swipe left/right on a section to flip to the next one; swipe in the project popup to change project, drag its top handle down to close; swipe the hero to spin the background. Trackpad swipes, mouse drags and arrow keys do the same.
- **Section order** is the order of the `<section>` blocks inside `#selectableSectionsWrapper` in `index.html`, plus the matching selector tabs and rail links.
- **Resume**: the download buttons use `assets/Bhavya_Patel_Master_Resume.pdf` (set via `profile.resumeUrl` in `data/content.json`).

### Command palette, "Now" panel & analytics
- **Command palette** (`js/palette.js`): press `/` or `Ctrl`+`K` (or the `>_` button; on phones it's in the menu). Jump to sections, open projects/certificates, download the resume, copy your email, switch theme, or try `whoami`. Commands are built from `content.json`, so new projects appear automatically.
- **Now panel**: edit `now` and `nowUpdated` in `data/content.json`. Keep it current, since a stale "now" looks worse than none.
- **Analytics** (off by default): create a free account at [goatcounter.com](https://www.goatcounter.com) (no cookies, privacy-friendly), then set `"analytics": { "goatcounter": "yourcode" }` in `data/content.json`. It never loads on localhost.
