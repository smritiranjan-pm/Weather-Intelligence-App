# Assignment Evidence Checklist

This document tracks all required validation artifacts, live screenshots, and deployment verification steps for the Weather Intelligence App assignment.

> **Important**: Cloudflare and GitHub submission evidence must be captured during the actual deployment process. Do not mark evidence complete before capturing the actual screenshots.

---

## 1. Development & Google AI Studio Evidence

- [ ] **1. AI Studio Working App**
  - *Description*: Full-screen screenshot of the Weather Intelligence application running and fully responsive inside Google AI Studio.
  - *Artifact / Placeholder*: `[Insert Screenshot: AI Studio Preview with live Vancouver weather & charts]`

- [ ] **2. AI Studio GitHub Connection**
  - *Description*: Screenshot of the direct Google AI Studio to GitHub connection / export dialog showing authorized repository linkage.
  - *Artifact / Placeholder*: `[Insert Screenshot: AI Studio GitHub connection popup / confirmation]`

---

## 2. GitHub Repository Evidence

- [ ] **3. GitHub Repository Home**
  - *Description*: Front page of the created/exported GitHub repository showing repository name, description, and commit history.
  - *Artifact / Placeholder*: `[Insert Screenshot: GitHub Repository Landing Page]`

- [ ] **4. Source Files & Project Structure**
  - *Description*: GitHub file browser displaying `/src` components, `/src/services`, `/src/types`, `/src/utils`, and static assets.
  - *Artifact / Placeholder*: `[Insert Screenshot: GitHub File Tree]`

- [ ] **5. package.json Verification**
  - *Description*: Rendered view of `package.json` on GitHub showing `"build": "vite build"`, dependencies, and Vite 6 scripts.
  - *Artifact / Placeholder*: `[Insert Screenshot: GitHub package.json view]`

- [ ] **6. README View**
  - *Description*: Rendered `README.md` on GitHub displaying the Cloudflare Pages Build Configuration and assignment workflow.
  - *Artifact / Placeholder*: `[Insert Screenshot: GitHub README.md rendered view]`

---

## 3. Cloudflare Pages Deployment Evidence

- [ ] **7. Cloudflare GitHub Connection**
  - *Description*: Cloudflare Pages setup screen showing connection to the designated GitHub repository.
  - *Artifact / Placeholder*: `[Insert Screenshot: Cloudflare Pages Git Connect screen]`

- [ ] **8. Cloudflare Build Command Configuration**
  - *Description*: Cloudflare build settings showing framework preset (`Vite`), build command (`npm run build`), and root directory (`/`).
  - *Artifact / Placeholder*: `[Insert Screenshot: Cloudflare Pages Build Settings - Command]`

- [ ] **9. Cloudflare Output Directory Configuration**
  - *Description*: Cloudflare build settings showing build output directory explicitly set to `dist`.
  - *Artifact / Placeholder*: `[Insert Screenshot: Cloudflare Pages Build Settings - Output Directory]`

- [ ] **10. Deployment Log Showing Success**
  - *Description*: Completed Cloudflare Pages deployment log showing successful asset compilation and green deployment status.
  - *Artifact / Placeholder*: `[Insert Screenshot: Cloudflare Pages successful build log]`

- [ ] **11. Live Production pages.dev URL**
  - *Description*: Browser window displaying the active production URL `https://<project-name>.pages.dev` in the address bar.
  - *Artifact / Placeholder*: `[Insert Screenshot: Live deployed site on pages.dev domain]`

---

## 4. Live Mandatory Test Execution Evidence

- [ ] **12. Vancouver Live Test (TEST 01)**
  - *Description*: Live site displaying resolved Vancouver weather, 7-day cards, temperature trend chart, precipitation bar chart, UV Index, solar ephemeris, and recommendations.
  - *Artifact / Placeholder*: `[Insert Screenshot: Live site searching 'Vancouver']`

- [ ] **13. London Live Test (TEST 02)**
  - *Description*: Live site displaying refreshed London weather with updated coordinates (51.51°, -0.13°) and replaced forecast data.
  - *Artifact / Placeholder*: `[Insert Screenshot: Live site searching 'London']`

- [ ] **14. Invalid City Live Test (TEST 03)**
  - *Description*: Live site searching `zzzzinvalidcity123456`, showing the friendly error banner, cleared stale cards, and reusable search bar with zero crashes.
  - *Artifact / Placeholder*: `[Insert Screenshot: Live site searching 'zzzzinvalidcity123456']`

---

## 5. Troubleshooting & Reviewer Notes

- **Network / API Key Audit**: The application uses only public Open-Meteo endpoints (`api.open-meteo.com` and `geocoding-api.open-meteo.com`). Zero API keys or tokens are stored or transmitted.
- **Race Condition Prevention**: Active request sequence counters ensure that in-flight network requests cancelled by new searches are discarded cleanly without UI interruption.
- **Static Hosting**: The application compiles to static HTML/JS/CSS in `dist/` with no Node server requirements at runtime.
- **Escalation**: For any Cloudflare organization permission or GitHub OAuth linkage issues, consult the IT Helpdesk as outlined in the assignment brief.
