# 🚛 HOS ROUTE PLANNER & ELD LOG GENERATOR

<p align="center">

### **Plan Smarter. Drive Compliant. Log Automatically.**

**A full-stack HOS route planning and ELD RODS generation platform built for modern fleet operations.**

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=1000&color=38BDF8&center=true&vCenter=true&width=850&lines=Plan+Commercial+Routes+%F0%9F%9A%9B;Calculate+Driver+Hours+%E2%8F%B1%EF%B8%8F;Validate+HOS+Rules+%F0%9F%9B%A1%EF%B8%8F;Generate+ELD+Daily+Logs+%F0%9F%93%8B;Stay+Compliance-Ready+%E2%9C%85" alt="Project feature animation"/>

</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet"/>
  <img src="https://img.shields.io/badge/FMCSA-HOS-1D4ED8?style=for-the-badge" alt="FMCSA HOS"/>
  <img src="https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel" alt="Vercel"/>
  <img src="https://img.shields.io/badge/Tests-16-success?style=for-the-badge" alt="16 tests"/>
</p>

<p align="center">
  <a href="https://hos-route-planner-ruddy.vercel.app/"><strong>🚀 Live Demo</strong></a> ·
  <a href="https://github.com/dhanushgopi2456/hos-route-planner"><strong>💻 GitHub Repository</strong></a>
</p>

---

## 🚛 What Is This?

**HOS Route Planner & ELD Daily Log Generator** is a full-stack logistics application designed to help commercial drivers and fleet operations plan trips around Hours-of-Service (HOS) constraints and generate structured daily Record of Duty Status (RODS) logs.

Instead of simply calculating a route, the system considers:

**🛣️ Route Distance + ⏱️ Driving Time + 🛌 Rest + ⛽ Fuel + 📦 Pickup/Drop-off + 📜 HOS Rules**

It transforms trip details into an operational timeline and 24-hour ELD log records.

---

## ⚡ From Route to ELD Log

```text
                         🚛 TRIP INPUT
                              │
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
              📍 Origin   📍 Destination  ⏱️ Cycle
                              │
                              ▼
                        🗺️ ROUTE ENGINE
                              │
                              ▼
                        ⏱️ HOS SCHEDULER
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
           🚛 Driving       🛌 Rest          ⛽ Fuel
              └───────────────┼───────────────┘
                              ▼
                       🛡️ HOS AUDIT ENGINE
                              │
                       ┌──────┴──────┐
                       ▼             ▼
                    ✅ Valid     ⚠️ Violation
                       │
                       ▼
                    📋 ELD RODS
                       │
                       ▼
                  📄 DAILY LOG SHEETS
```

---

## ✨ Core Capabilities

| Module | Capability |
|---|---|
| 🛣️ Route Planning | Plan commercial trips between an origin and destination |
| ⏱️ HOS Scheduling | Schedule driving, rest, and duty periods |
| 🛡️ Compliance Engine | Inspect configured HOS constraints |
| ⛽ Fuel Planning | Insert commercial refueling stops |
| 📦 Pickup / Delivery | Account for loading and unloading time |
| 🗺️ Interactive Map | Visualize routes and stop locations |
| 📋 ELD RODS Generator | Generate 24-hour duty-status logs |
| 🌙 Midnight Splitting | Split multi-day trips into daily records |
| 🔐 Driver Authentication | Protect driver access |
| 📊 Trip Summary | Show mileage, duty, and compliance metrics |
| 🧪 Automated Auditing | Run HOS validation tests |
| 📄 PDF Generation | Generate printable daily log sheets |

---

## 🛡️ HOS Compliance Engine

The application includes scheduling and validation logic for the configured HOS constraints.

### ⏱️ 11-Hour Driving Limit
Tracks the configured driving allowance before a required reset.

### 🕐 14-Hour Duty Window
Tracks the consecutive on-duty window and checks scheduled driving against the configured limit.

### 🛌 30-Minute Rest Break
Schedules a qualifying break after the configured cumulative driving threshold.

### 🌙 10-Hour Reset
Accounts for a consecutive rest period between driving shifts.

### 📊 70/8 Cycle
Tracks cumulative duty against the configured 70-hour / 8-day cycle.

### ⛽ Fuel Stops
Adds refueling stops according to the project's configured long-distance interval.

### 📦 Dock Operations
Allocates dedicated time for pickup and delivery operations.

> **Compliance note:** This project is an engineering demonstration, not a certified ELD or a guarantee of regulatory compliance. Validate the implementation against current FMCSA requirements, applicable exceptions, and jurisdiction-specific rules before operational use.

---

## 🧠 Automated Compliance Pipeline

```text
                    🚛 ROUTE
                       │
                       ▼
                📏 DISTANCE + ETA
                       │
                       ▼
                ⏱️ DUTY CALCULATION
                       │
                       ▼
              ┌─────────────────────┐
              │      HOS ENGINE     │
              │                     │
              │  11h Driving        │
              │  14h Window         │
              │  30m Break          │
              │  10h Reset          │
              │  70/8 Cycle         │
              │  Fuel Stops         │
              │  Dock Time          │
              └──────────┬──────────┘
                         │
                         ▼
                  📋 EVENT TIMELINE
                         │
                         ▼
                   🛡️ AUDIT ENGINE
                         │
                  ┌──────┴──────┐
                  ▼             ▼
               ✅ PASS       ⚠️ FAIL
                  │             │
                  ▼             ▼
              📄 ELD LOG    🚨 VIOLATION
```

---

## 📋 ELD Daily Log Generator

One of the project's key features is generating **24-hour daily duty-status records**.

Each daily log represents duty periods across a 24-hour timeline.

```text
24-HOUR DUTY STATUS
────────────────────────────────────────────────────────────

OFF DUTY
████████        ████████

SLEEPER
        ███████████

DRIVING
                    ███████████████████

ON DUTY
    ████                         ████
```

### Supported duty statuses

- 💤 **Off Duty**
- 🛏️ **Sleeper Berth**
- 🚛 **Driving**
- 🔧 **On Duty — Not Driving**

---

## 🌙 Multi-Day Trip Handling

Long-haul trips can cross midnight. The application splits the trip timeline into separate daily records.

```text
DAY 1                         DAY 2
00:00 ─────────── 24:00      00:00 ─────────── 24:00
│                              │
├── Driving                    ├── Driving
├── Fuel                       ├── Rest
├── Driving                    ├── Fuel
├── Rest                       ├── Driving
└── Midnight Split ──────────►└── Delivery
```

Each generated day is reconciled against a complete **24-hour / 1,440-minute timeline**.

---

## 🗺️ Interactive Highway Map

The application uses Leaflet to visualize the planned route and its stops.

### Example route sequence

```text
📍 ORIGIN
   │
   ▼
🚛 Driving
   │
   ▼
⛽ Fuel Stop
   │
   ▼
🚛 Driving
   │
   ▼
🛌 Rest Stop
   │
   ▼
🚛 Driving
   │
   ▼
📦 DESTINATION
```

The map works with the chronological stop table to show both the geographical route and the operational timeline.

---

## 📸 Application Screenshots

Explore the user interface and key features of the HOS Route Planner & ELD Log Generator.

> **Setup:** The image paths below are examples. Replace them with the actual screenshot paths or direct image URLs from your screenshots repository.

### 🚛 Trip Planning Dashboard

![Trip Planning Dashboard](screenshots/dashboard.png)

### 🗺️ Interactive Route Map

![Interactive Route Map](screenshots/route-map.png)

### 📋 ELD Daily Logs

![ELD Daily Logs](screenshots/eld-logs.png)

### 🛡️ HOS Compliance & Trip Summary

![HOS Compliance Dashboard](screenshots/compliance-dashboard.png)

---

## 📍 Trip Timeline

Every planned trip produces a chronological sequence of events.

| Event | Arrival | Departure | Duration | Status |
|---|---:|---:|---:|---|
| 📍 Pickup | 08:00 | 09:00 | 1h | On Duty |
| 🚛 Driving | 09:00 | 13:30 | 4.5h | Driving |
| ⛽ Fuel | 13:30 | 14:00 | 30m | On Duty |
| 🛌 Rest | 14:00 | 14:30 | 30m | Off Duty |
| 🚛 Driving | 14:30 | ... | ... | Driving |
| 📦 Delivery | ... | ... | 1h | On Duty |

*Illustrative example; actual events depend on trip inputs and scheduling logic.*

---

## 🔐 Driver Authentication

Trip planning and ELD functionality are protected behind driver authentication.

```text
                  👤 DRIVER
                     │
                     ▼
                  🔐 SIGN IN
                     │
                     ▼
                🎫 SESSION TOKEN
                     │
                     ▼
                  🛡️ AUTH GATE
                     │
              ┌──────┴────────┐
              ▼               ▼
          Authorized      Unauthorized
              │               │
              ▼               ▼
        🚛 Trip Planner   🔒 Blocked
        📋 ELD Logs
```

The authenticated experience can display driver and carrier information such as:

- Driver name
- CDL number
- Carrier
- Tractor/unit
- Current cycle usage

---

## 🧪 Automated Compliance Tests

The project includes a test suite for the HOS scheduling and log-generation rules implemented by the application.

```text
                🧪 HOS AUDIT ENGINE

       ┌──────────┬──────────┬──────────┐
       │ TEST 01  │ TEST 02  │ TEST 03  │
       ├──────────┼──────────┼──────────┤
       │ TEST 04  │ TEST 05  │ TEST 06  │
       ├──────────┼──────────┼──────────┤
       │ TEST 07  │ TEST 08  │ TEST 09  │
       ├──────────┼──────────┼──────────┤
       │ TEST 10  │ TEST 11  │ TEST 12  │
       ├──────────┼──────────┼──────────┤
       │ TEST 13  │ TEST 14  │ TEST 15  │
       ├──────────┴──────────┴──────────┤
       │             TEST 16             │
       └─────────────────────────────────┘
                       │
                       ▼
                 🟢 AUDIT RESULT
```

Run the test suite with:

```bash
npm run test
```

---

## 📊 Compliance Dashboard

The application brings route information and compliance indicators together.

```text
┌─────────────────────────────────────────────────────┐
│                  🚛 TRIP SUMMARY                    │
├─────────────────────────────────────────────────────┤
│  📏 Distance       ⏱️ Drive Time       🛌 Rest       │
│  1,320 mi           20h 30m             10h          │
├─────────────────────────────────────────────────────┤
│              🛡️ COMPLIANCE STATUS                   │
│       ✅ 11h Driving Limit                          │
│       ✅ 14h Duty Window                            │
│       ✅ 30m Break                                  │
│       ✅ 10h Reset                                  │
│       ✅ 70/8 Cycle                                 │
└─────────────────────────────────────────────────────┘
```

*Illustrative values only; displayed figures depend on the trip and application calculations.*

---

## 🏗️ System Architecture

```text
                         👤 DRIVER
                            │
                            ▼
                 ┌─────────────────────┐
                 │   React 19 Client   │
                 │                     │
                 │ Trip Planner        │
                 │ ELD Viewer          │
                 │ Map                 │
                 │ Timeline            │
                 │ Compliance UI       │
                 └──────────┬──────────┘
                            │
                         REST API
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Express Server    │
                 │                     │
                 │ Authentication      │
                 │ Trip Planning       │
                 │ HOS Engine          │
                 │ Routing             │
                 │ Geocoding           │
                 │ Rule Tests          │
                 └──────────┬──────────┘
                            │
                   ┌────────┴────────┐
                   ▼                 ▼
             🧠 HOS ENGINE      🗺️ ROUTING
                   │                 │
                   ▼                 ▼
              📋 ELD EVENTS      📍 GEO DATA
                   │
                   ▼
              📄 DAILY LOGS
```

---

## 🛠️ Technology Stack

### 🎨 Frontend

| Technology | Purpose |
|---|---|
| ⚛️ React 19 | User interface |
| 🟦 TypeScript | Type safety |
| ⚡ Vite | Development and build tooling |
| 🎨 Tailwind CSS v4 | Styling |
| 🎬 Motion | UI animations |
| 🗺️ Leaflet | Interactive maps |
| 📋 SVG | ELD daily log rendering |

### ⚙️ Backend

| Technology | Purpose |
|---|---|
| 🟢 Node.js | Runtime |
| 🚂 Express | API server |
| 🟦 TypeScript | Type-safe backend |
| 🧠 HOS Engine | Scheduling and compliance logic |
| 🗺️ Routing Engine | Route planning |
| 📍 Nominatim | Geocoding |
| 🧪 Test Suite | HOS validation |

### ☁️ Deployment

| Technology | Purpose |
|---|---|
| ▲ Vercel | Hosting and deployment |
| ⚡ Vite | Frontend build |
| 📡 Serverless API | API deployment |

---

## 📂 Project Structure

```text
hos-route-planner/
│
├── 📡 api/
│   └── index.ts
│
├── 🌐 public/
│
├── 🎨 src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Compliance/
│   │   ├── ELD/
│   │   ├── Map/
│   │   ├── Timeline/
│   │   ├── TripPlanner/
│   │   ├── TripSummary/
│   │   └── UI/
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   └── AboutRulesPage.tsx
│   │
│   ├── server/
│   │   ├── auth.ts
│   │   ├── api.ts
│   │   ├── hos/
│   │   ├── routing/
│   │   └── tests/
│   │
│   └── types/
│       └── hos.ts
│
├── ⚙️ server.ts
├── ▲ vercel.json
├── ⚡ vite.config.ts
├── 📝 tsconfig.json
└── 📦 package.json
```

*This structure summarizes the main project areas; your actual repository may differ.*

---

## 🚀 Quick Start

### Prerequisites

- Node.js and npm
- Git
- Required environment variables for any external services used by the application

### 1. Clone the repository

```bash
git clone https://github.com/dhanushgopi2456/hos-route-planner.git
```

### 2. Enter the project directory

```bash
cd hos-route-planner
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

If the repository includes an `.env.example` file, copy it to `.env` and fill in the required values:

```bash
cp .env.example .env
```

On Windows Command Prompt, you can use:

```bat
copy .env.example .env
```

**Important:** Never commit secrets, access tokens, or private API keys to GitHub.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite or the development server in your terminal. The configured local URL may differ from `http://localhost:3000`.

---

## 👨‍💻 Development Workflow

```text
       💻 CODE
          │
          ▼
       🧪 TEST
          │
          ▼
     🛡️ HOS AUDIT
          │
          ▼
       🏗️ BUILD
          │
          ▼
      ▲ VERCEL
          │
          ▼
      🚛 DEPLOY
```

---

## ☁️ Vercel Deployment

The project includes Vercel configuration.

### Deploy using the Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

Review the project's Vercel configuration and environment variables before deployment. Confirm that the API routes and any required external services work in the deployed environment.

### API route examples

The configured deployment may expose routes such as:

- `/api/trips/plan`
- `/api/auth/*`
- `/api/geocode`
- `/api/rules/test`

Confirm the actual route handlers in the repository before relying on these paths.

---

## 📜 FMCSA Rules Implemented

The project's compliance checklist covers the following configured requirements:

| Rule | Implementation |
|---|---|
| ⏱️ 11-Hour Driving | Driving-limit validation |
| 🕐 14-Hour Window | Consecutive duty-window validation |
| 🛌 30-Minute Break | Break scheduling and validation |
| 🌙 10-Hour Reset | Consecutive rest scheduling |
| 📊 70/8 Cycle | Multi-day cumulative tracking |
| ⛽ Fuel Stops | Long-haul refueling scheduling |
| 📦 Dock Operations | Pickup and drop-off buffers |
| 📋 24-Hour Reconciliation | Daily ELD timeline validation |

The project documents these rules with references to applicable sections of 49 CFR Part 395. For production use, verify all calculations and requirements against current FMCSA regulations and any applicable exceptions.

---

## 💡 Engineering Highlights

### 🧠 Domain Logic
Translates operational constraints into deterministic scheduling logic.

### 🛡️ Compliance Automation
Runs generated schedules through automated rule checks.

### 📋 Structured Event Generation
Converts trip events into duty-status records for daily logs.

### 🌙 Time Boundary Handling
Handles multi-day trips, midnight splitting, and daily timeline reconciliation.

### 🗺️ Geospatial UX
Represents routes, stops, and logistics events on an interactive map.

### 🧪 Automated Verification
Uses tests to validate HOS calculations and log-splitting behavior.

### ☁️ Serverless Deployment
Supports deployment of the frontend and API through the configured Vercel setup.

---

## 🗺️ Future Roadmap

### ✅ Current Features

- [x] Commercial route planning
- [x] HOS scheduling
- [x] 11-hour driving validation
- [x] 14-hour window validation
- [x] 30-minute break scheduling
- [x] 10-hour reset handling
- [x] 70/8 cycle tracking
- [x] Fuel stop scheduling
- [x] Pickup/drop-off buffers
- [x] Interactive Leaflet map
- [x] ELD daily logs
- [x] Multi-day split handling
- [x] Automated compliance tests
- [x] Driver authentication
- [x] Vercel deployment

### 🔮 Future Enhancements

- [ ] 🛰️ Real-time traffic integration
- [ ] ⛽ Live fuel-price integration
- [ ] 🌦️ Weather-aware route planning
- [ ] 🚛 Multi-driver dispatch planning
- [ ] 📡 Fleet tracking
- [ ] 📊 Fleet-wide compliance dashboard
- [ ] 📱 Driver mobile application
- [ ] 🔔 Automated compliance alerts
- [ ] 📄 Expanded export and report formats
- [ ] 🔗 Telematics and ELD device integrations

---

## 🎯 What This Project Demonstrates

```text
                 FULL-STACK ENGINEERING
                           │
           ┌───────────────┼────────────────┐
           ▼               ▼                ▼
      🎨 FRONTEND      ⚙️ BACKEND       🧠 DOMAIN LOGIC
           │               │                │
        React 19        Express          HOS Rules
        TypeScript      APIs             Scheduling
        Tailwind        Auth             Validation
        Leaflet         Serverless       ELD Logic
           │               │                │
           └───────────────┼────────────────┘
                           ▼
                  🚛 LOGISTICS PLATFORM
```

---

## ⭐ Project Goal

> **Turn complex commercial HOS constraints into a simple, visual, and actionable trip-planning experience.**

The application connects **route planning, driver schedules, regulatory rule checks, stop planning, and ELD log generation** in one workflow.

---

<p align="center">

### 🚛 Plan Smarter. Drive Compliant. Log Automatically.

**Built with ❤️ using React • TypeScript • Express • Tailwind • Leaflet**

⭐ If you found this project useful, consider giving the repository a star.

</p>

---

## 📄 License

This project is distributed under the **MIT License**. See the `LICENSE` file in the repository for details.
