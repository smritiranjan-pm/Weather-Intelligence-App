# Weather Intelligence App

## Overview

The **Weather Intelligence App** is a high-performance, responsive, browser-based meteorological application built directly within **Google AI Studio App Build**. It delivers real-time weather analytics, 7-day atmospheric projections, interactive SVG trend charts, and deterministic planning recommendations powered exclusively by public, keyless **Open-Meteo APIs**.

Designed for zero-configuration, static deployment to **Cloudflare Pages** via direct **GitHub** integration from Google AI Studio, this project requires zero private secrets, zero backend runtime servers, and zero cloud database overhead.

---

## Cloudflare Pages Build Configuration

- **Framework**: Vite (React 19 + TypeScript)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node/runtime notes**: Standard Node.js 18+ or 20+; pure client-side static Single-Page Application (SPA).
- **Environment variables**: None required for standard assignment functionality

---

## Required Assignment Path

To satisfy all assignment submission criteria, follow this exact progression:

**Google AI Studio App Build**
→ **Direct GitHub connection** (via Settings / Connect to GitHub)
→ **Approved GitHub repository**
→ **Cloudflare Pages connected to that GitHub repository**
→ **Production build** (`npm run build` producing `dist/`)
→ **Live `pages.dev` URL**
→ **Live validation** (Vancouver, London, Invalid City)

> **Important**: Do not bypass the direct Google AI Studio → GitHub connection. The assignment requires direct repository export from the AI Studio environment.

---

## Features

- **City Search & Geocoding Disambiguation**: Resolve any global municipality or territory into exact latitude/longitude with URL-safe query encoding, sub-second in-memory caching, instant search feedback, and multi-location disambiguation selection.
- **Current Atmospheric Conditions**: Real-time display of current temperature, apparent (feels-like) temperature, WMO weather condition descriptions, relative humidity, wind speed & direction, precipitation volume, surface pressure, and sun cycle ephemeris.
- **7-Day Meteorological Forecast**: Chronologically ordered daily cards displaying weather icons, daily high/low temperatures, precipitation probability percentages, and peak wind speeds.
- **Interactive Atmospheric Charts**:
  - *7-Day Temperature Trend*: High-contrast SVG line & glowing gradient area visualization plotting daily maximum and minimum temperatures with interactive data points.
  - *Precipitation Outlook*: Daily precipitation probability percentage bars alongside estimated rainfall amounts in mm/inches.
  - *UV Index Trend*: 7-day daily peak UV Index visualization paired with World Health Organization (WHO) risk categories (Low, Moderate, Very High, Extreme).
  - *Sunrise, Sunset & Daylight Timetable*: Daily solar timeline with dawn/dusk timestamps and calculated total daylight duration.
- **Deterministic Planning Recommendations**: Rules-based daily planning guidance (e.g. umbrella alerts, heat hydration, cold layering, gusty wind warnings, and UV protection) derived purely from Open-Meteo data without external LLM inference costs or API keys.
- **Robust Edge-Case & Error Handling**: Graceful error handling for empty search submissions, nonexistent city queries, network dropouts, and service disruptions without application crashes, stale state contamination, or fabricated data.
- **Reviewer-Friendly QA Validation & Assignment Tests**: Built-in expandable panel toggled via *"Check QA / App Validation & Assignment Test Results"*, featuring a real-time 10-point telemetry monitor (search term, coordinates, HTTP status, timestamp) and runtime observation tracking for the mandatory assignment test cases.
- **Responsive & Accessible UI**: Clean light and dark glassmorphic themes with accessible color contrast, keyboard navigation (`Enter` key search submission), and mobile-friendly touch targets.

---

## Tech Stack

- **Framework**: React 19 (TypeScript)
- **Bundler & Dev Server**: Vite 6
- **Styling**: Tailwind CSS with custom glassmorphism design system
- **Icons**: Lucide React
- **Data Visualizations**: Custom responsive SVG charts (Temperature, Precipitation, UV Index, Solar Daylight)
- **Meteorological Data Provider**: Open-Meteo API (Public, CORS-enabled, keyless)
- **Deployment Platform**: Cloudflare Pages (Pure static single-page application)

---

## Open-Meteo APIs

This application exclusively queries the following public Open-Meteo endpoints:

1. **Open-Meteo Geocoding API**
   - **Endpoint**: `https://geocoding-api.open-meteo.com/v1/search`
   - **Parameters**: `name` (URL-encoded query), `count=5`, `language=en`, `format=json`
   - **Purpose**: Resolves user queries into geographic coordinates (latitude, longitude, elevation, administrative divisions, timezone).
2. **Open-Meteo Forecast API**
   - **Endpoint**: `https://api.open-meteo.com/v1/forecast`
   - **Parameters**: `latitude`, `longitude`, `current`, `daily`, `timezone=auto`, `temperature_unit`, `wind_speed_unit`, `precipitation_unit`
   - **Purpose**: Retrieves live atmospheric telemetry and 7-day daily forecast arrays.

> **Key Architecture Guarantee**: **No API key is required.** All requests are performed directly from the browser to public, rate-friendly endpoints with active request cancellation (`AbortController`) and in-memory TTL caching.

---

## Local Setup & Development

To run the application locally on your machine:

```bash
# 1. Clone the repository
git clone <repository-url>
cd weather-intelligence

# 2. Install project dependencies
npm install

# 3. Start the local Vite development server
npm run dev
```

Open your browser at `http://localhost:3000` to interact with the live application.

---

## Production Build

To compile the application for static hosting:

```bash
# Run production build
npm run build
```

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- The generated `dist/` directory contains standard static HTML, JavaScript, CSS, and asset bundles ready for any static CDN or edge platform.

---

## Google AI Studio to GitHub Connection

This project is configured to connect directly from **Google AI Studio App Build** to GitHub:

1. In the **Google AI Studio App Build** workspace, locate the top navigation / settings menu.
2. Select **Connect to GitHub** (or **Export / Push to GitHub**).
3. Authorize your GitHub account and select your designated repository or create a new one.
4. Push the branch containing the codebase.
5. All source files, assets, `package.json`, configuration files, and this `README.md` will be committed directly to your repository.

---

## Cloudflare Pages Deployment Steps

Deploying the GitHub repository to Cloudflare Pages:

1. Log in to the **Cloudflare Dashboard** ([dash.cloudflare.com](https://dash.cloudflare.com/)).
2. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select the GitHub repository exported from Google AI Studio.
4. Set the build configuration:
   - **Framework preset**: `Vite` (or `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (default)
   - **Environment variables**: *None required* (zero API keys needed)
5. Click **Save and Deploy**.
6. Cloudflare Pages will build the project and assign a live production URL: `https://<project-name>.pages.dev`.

---

## Mandatory Assignment Test Plan

The application includes an in-app verification suite that dynamically tests and observes these exact scenarios:

### TEST 01 — Valid City Search (Vancouver)
- **Input Query**: `Vancouver`
- **Expected Outcome**:
  - Location resolves to Vancouver, British Columbia, Canada (49.28°, -123.12°).
  - Current weather card displays temperature, humidity, wind, pressure, and solar cycle.
  - 7-day forecast cards render chronologically with high/low temperatures.
  - Interactive SVG weather charts populate with data.
  - Deterministic planning recommendations appear.
  - No error banners appear.

### TEST 02 — Second Valid City Search (London)
- **Input Query**: `London`
- **Expected Outcome**:
  - Location resolves to London, United Kingdom (51.51°, -0.13°).
  - All weather values, forecast cards, charts, and recommendations refresh with London's data.
  - Previous city data is replaced cleanly without retaining stale metrics.

### TEST 03 — Invalid City Query Handling
- **Input Query**: `zzzzinvalidcity123456`
- **Expected Outcome**:
  - Geocoding returns 0 matching results.
  - A friendly error banner appears: *"No matching city was found. Check the spelling and try again."*
  - The React application does not crash.
  - Stale weather metrics are cleared, preventing misleading displays.
  - The search input and submit button remain immediately reusable for subsequent searches.

---

## Assignment Evidence / Screenshot Checklist

For assignment submission, ensure you capture all artifacts listed in `ASSIGNMENT_EVIDENCE.md`:

1. **AI Studio Workspace**: Weather app running and functional inside Google AI Studio.
2. **AI Studio GitHub Connection**: The GitHub repository export/connection confirmation dialog.
3. **GitHub Repository Home**: Repository front page displaying the project structure and commit history.
4. **GitHub Code Browser**: `package.json` and `/src` components visible in the file tree.
5. **GitHub README View**: Rendered `README.md` visible on GitHub.
6. **Cloudflare Git Connect**: Cloudflare Pages setup page connected to the GitHub repository.
7. **Cloudflare Build Configuration**: Build settings showing `npm run build` and `dist`.
8. **Cloudflare Build Log**: Completed green build log showing static asset compilation.
9. **Live Deployed URL**: Browser showing the active `https://<project-name>.pages.dev` domain in the address bar.
10. **Test 01 Evidence**: Live site displaying results for valid city search #1 (`Vancouver`).
11. **Test 02 Evidence**: Live site displaying updated results for valid city search #2 (`London`).
12. **Test 03 Evidence**: Live site displaying friendly error handling for invalid city (`zzzzinvalidcity123456`).

---

## Troubleshooting

- **Build Output Directory Mismatch**: Ensure the build output directory in Cloudflare Pages is set to `dist` (Vite's default output), not `build` or `public`.
- **Node.js Version Compatibility**: If encountering build warnings on Cloudflare, ensure `NODE_VERSION` is set to `18` or `20` in Cloudflare Pages Environment variables if required.
- **CORS or Geocoding Failures**: Verify browser network access to `api.open-meteo.com` and `geocoding-api.open-meteo.com`.
- **Permission & Organization Access Issues**: If experiencing issues with GitHub repository permissions, OAuth authorization, or Cloudflare team access, escalate to the **IT Helpdesk** as instructed in the assignment guidelines.

---

## Responsible AI & Data Guardrails

- **Zero Personal Data Collection**: The application does not collect, store, track, or transmit any user-identifiable information, cookies, or location telemetry.
- **Zero Private Secret Exposure**: The application requires no private API keys, Gemini credentials, Firebase accounts, or cloud service authentication tokens. All weather data queries are client-side public requests to Open-Meteo.
- **Deterministic, Transparent Algorithms**: Weather condition mappings, alert thresholds, and outdoor planning recommendations are deterministic, rule-based algorithms with zero ungrounded generative hallucinations.
- **Human-in-the-Loop Validation**: The built-in QA / App Validation panel enables automated and human reviewers to inspect runtime telemetry, API payloads, coordinates, and contract compliance at any time.
