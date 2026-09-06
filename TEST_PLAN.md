# Test Plan & Verification Specification

## Overview

This test plan defines the verification matrix and execution criteria for the **Weather Intelligence App**, ensuring compliance with all assignment objectives, zero-key public API integration with Open-Meteo, robust error handling, and deployment readiness on Cloudflare Pages via direct GitHub export from Google AI Studio.

---

## 1. Automated & Manual Test Cases

| Test ID | Test Scenario | Input / Action | Expected Result | Verification Method |
| :--- | :--- | :--- | :--- | :--- |
| **TEST-01** | **Initial App Load & Default City** | Mount application (`/`) | Resolves Vancouver, BC, Canada. Current temperature, humidity, wind, 7-day forecast cards, SVG charts, and recommendations load with zero errors. | Automated on mount & verified via QA panel |
| **TEST-02** | **Valid City Search (Vancouver)** | Search input: `Vancouver` + `Enter` or Submit | Resolves to 49.28°N, -123.12°W. Live weather metrics and forecast arrays populate. | QA panel & live UI |
| **TEST-03** | **Second Valid City Search (London)** | Search input: `London` + `Enter` or Submit | Resolves to 51.51°N, -0.13°W. All displayed weather, 7-day cards, UV Index, and solar charts update with London data. Stale Vancouver data is completely replaced. | QA panel & live UI |
| **TEST-04** | **Invalid City Error Handling** | Search input: `zzzzinvalidcity123456` | Geocoding returns 0 matches. A user-friendly message *"No matching city was found. Check the spelling and try again."* appears. App does not crash. Stale weather cards are cleared. Search input remains editable. | QA panel & live UI |
| **TEST-05** | **Empty Search Submission** | Submit with blank / whitespace input | Validation warning *"Enter a city to view the weather."* is displayed. No API requests are dispatched. | Live UI interaction |
| **TEST-06** | **Disambiguation Multi-City Resolution** | Search input: `Paris` | Multiple candidate cards appear (e.g., Paris France, Paris Texas US). Clicking a specific candidate loads the respective weather without reloading the page. | Live UI interaction |
| **TEST-07** | **Unit Toggle (°C / °F)** | Click `°C / °F` toggle button | Temperature units toggle between Celsius and Fahrenheit. Wind speed updates between km/h and mph. Precipitation updates between mm and inches. All charts and forecast cards recalculate and redraw. | Live UI interaction |
| **TEST-08** | **Theme Switcher (Dark / Light)** | Click Theme toggle | UI theme toggles between dark and light glassmorphism styles with accessible color contrast and persistent localStorage state. | Live UI interaction |
| **TEST-09** | **Rapid Query Superseding & Race Prevention** | Rapidly search multiple cities or click presets | Outdated in-flight queries are safely superseded. Monotonic sequence counters prevent stale responses from overwriting the latest search. Zero erroneous error banners appear. | Code audit & rapid test clicks |
| **TEST-10** | **Network Interruption & Retry** | Simulated offline / API timeout | Graceful banner *"Weather Service Disruption"* with a dedicated *"Retry Request"* button appears without unhandled promise rejections or white screen crashes. | Code audit & error boundary |

---

## 2. Reviewer 10-Point Telemetry Specification

The application features a built-in telemetry monitor accessible via the **"Check QA / App Validation & Assignment Test Results"** section in the footer:

1. **Search Term**: Tracks raw sanitized query string.
2. **Resolved City**: Name of the resolved municipality.
3. **Country / Region**: Administrative division and nation.
4. **Latitude**: Precise decimal latitude (e.g. `49.28°`).
5. **Longitude**: Precise decimal longitude (e.g. `-123.12°`).
6. **Geocoding Status**: Real-time status (`SUCCESS`, `NO_RESULTS`, `ERROR`, `IDLE`).
7. **Forecast Status**: Data retrieval state (`SUCCESS`, `ERROR`, `IDLE`).
8. **Forecast Days Count**: Array verification (verifies full 7-day projection).
9. **Chart Data Availability**: Validates SVG rendering pipeline.
10. **Recommendations Count**: Validates rule-based deterministic advice generation.

---

## 3. Deployment & Build Acceptance Criteria

- **Compilation**: `npm run build` succeeds with zero TypeScript errors (`tsc --noEmit`) and creates static files in `dist/`.
- **Zero API Keys**: No private tokens, Gemini API keys, or Firebase credentials in the client bundle.
- **Cloudflare Pages Compatibility**: Pure static Single-Page Application (SPA) compatible with standard Cloudflare edge CDN distribution.
