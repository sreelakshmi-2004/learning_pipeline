# 🚀 DevOps Learning Journey - Static Website

A simple, modern, responsive static website documenting a **DevOps Learning Journey**. Built with pure **HTML5**, **CSS3**, **Vanilla JavaScript (ES6+)**, and **JSON**, styled in an elegant **lavender and white** color palette, and served via an official **Nginx Alpine** Docker container.

Zero external frameworks or libraries used—no React, Vue, Angular, Bootstrap, jQuery, or backend databases.

---

## 📁 Project Directory Structure

```text
devops-website/
├── css/
│   └── style.css           # Custom CSS styling (lavender & white theme, responsive grid/flexbox)
├── js/
│   └── script.js           # Vanilla JavaScript (fetch() JSON, filters, search, modal, validation)
├── data/
│   └── projects.json       # Project data loaded dynamically via JavaScript fetch()
├── images/
│   ├── favicon.svg         # Crisp vector DevOps infinity icon
│   └── hero-illustration.svg # Vector architecture illustration
├── index.html              # Main HTML5 semantic structure
├── Dockerfile              # Dockerfile using lightweight nginx:1.25-alpine
├── .dockerignore           # Excludes CI, Git, and doc files from Docker image
├── .gitignore              # Ignores OS, IDE, and build temp files
├── Jenkinsfile             # Declarative Jenkins CI/CD pipeline
└── README.md               # Documentation and execution instructions
```

---

## ✨ Features & Highlights

- **Pure Vanilla Stack:** 100% dependency-free HTML5, CSS3, and ES6+ JavaScript.
- **Dynamic Project Showcase:** Projects are stored in `data/projects.json` and loaded asynchronously using JavaScript's native `fetch()` API with error handling and loading indicators.
- **Search & Category Filtering:** Real-time filtering by category (`CI/CD & GitOps`, `Containers & K8s`, `IaC & Cloud`, `Observability`, `Automation`) and instant search input.
- **Interactive Project Modal:** Click "View Details" on any project card to inspect architecture highlights, tools, and quantifiable impact metrics.
- **Lavender & White Theme:** Soft, professional color palette designed for high contrast, clean typography, and accessibility.
- **Fully Responsive:** Fluid layouts designed for mobile, tablet, laptop, and 4K desktop screens.
- **Interactive Contact Form:** Client-side validation with feedback notifications and toast alerts.
- **Docker & Nginx Ready:** Standardized `Dockerfile` based on `nginx:alpine` to serve static assets with optimal performance.
- **CI/CD Integration:** Includes a production-ready `Jenkinsfile` for automated linting, container builds, and integration testing.

---

## 🎨 Color Palette (Lavender & White Theme)

| Token | Hex Code | Purpose |
|---|---|---|
| Background Primary | `#FAF8FF` | Main canvas (soft lavender mist white) |
| Surface / Cards | `#FFFFFF` | Crisp white cards and containers |
| Accent Lavender | `#EDE9FE` / `#DDD6FE` | Borders, subtle highlights, badge backgrounds |
| Primary Violet | `#7C3AED` | Primary brand color, CTA buttons, active states |
| Primary Dark | `#6D28D9` | Button hover states, bold headings |
| Heading Charcoal | `#1E1B4B` | High-contrast title and heading typography |
| Body Text | `#374151` | Readable dark gray body copy |

---

## 🖥️ Running Locally

Because modern web browsers restrict `fetch()` requests when opening files directly via `file:///` due to CORS/security policies, the website should be served over an HTTP server.

### Option 1: Python HTTP Server (Built into Python)

If you have Python installed:

```bash
# Navigate to project directory
cd devops-website

# Python 3
python -m http.server 8080

# Open in browser: http://localhost:8080
```

### Option 2: Node.js `npx serve` or `http-server`

```bash
cd devops-website
npx serve .
# or
npx http-server -p 8080
```

### Option 3: VS Code Live Server
Right-click `index.html` inside VS Code and select **"Open with Live Server"**.

---

## 🐳 Running with Docker & Nginx

The project includes an optimized `Dockerfile` based on `nginx:1.25-alpine`.

### 1. Build the Docker Image

```bash
cd devops-website
docker build -t devops-website:latest .
```

### 2. Run the Container

```bash
docker run -d --name devops-site -p 8080:80 devops-website:latest
```

### 3. Verify in Browser & Terminal

- **Browser URL:** Open [http://localhost:8080](http://localhost:8080)
- **Check Container Status:**
  ```bash
  docker ps -f name=devops-site
  ```
- **Check Nginx Access Logs:**
  ```bash
  docker logs -f devops-site
  ```
- **Test with curl:**
  ```bash
  curl -I http://localhost:8080/
  curl -s http://localhost:8080/data/projects.json | head -n 10
  ```

### 4. Stop and Remove Container

```bash
docker stop devops-site
docker rm devops-site
```

---

## ⚙️ CI/CD with Jenkins

The included `Jenkinsfile` defines a 6-stage declarative pipeline:

1. **Checkout & Code Validation:** Asserts that all required HTML, CSS, JS, and JSON files are present.
2. **JSON Linting:** Validates the syntax of `data/projects.json`.
3. **Docker Build:** Builds `devops-learning-journey:${BUILD_NUMBER}` using the `Dockerfile`.
4. **Container Health & Integration Test:** Launches an ephemeral container on test port `8088`, performs HTTP 200 checks on `index.html` and `data/projects.json`.
5. **Security Vulnerability Scan:** Runs Trivy (if available on the Jenkins agent) to check the base image for vulnerabilities.
6. **Cleanup:** Safely tears down test containers in the `post` block regardless of build result.

---

## 📋 Sections Overview

1. **Home:** Eye-catching hero section with DevOps tagline, key stats ticker, call-to-action buttons, and vector illustration.
2. **About:** Narrative on moving from manual setups to automation, featuring the 6 pillars of the DevOps lifecycle.
3. **Skills:** Categorized skills grid (CI/CD, Containers, IaC, Observability, Linux/Scripting, DevSecOps) with interactive pill badges.
4. **Projects:** Asynchronously fetched project cards with category filters, instant search, tech stack tags, and a detailed modal view.
5. **Contact:** Direct communication channels (Email, GitHub, LinkedIn) and an interactive contact form with client-side validation.
6. **Footer:** Quick links, copyright with dynamic year, and tech stack badge.

---

## 📄 License

This project is open-source and free to use for personal portfolios, learning demonstrations, and educational workshops.
