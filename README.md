# 🚛 HOS ROUTE PLANNER & ELD LOG GENERATOR

<p align="center">

### **Plan Smarter. Drive Compliant. Log Automatically.**

**A full-stack commercial HOS route planning and ELD RODS generation platform built for modern fleet operations.**

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=1000&color=38BDF8&center=true&vCenter=true&width=850&lines=Plan+Commercial+Routes+%F0%9F%9A%9B;Calculate+Driver+Hours+%E2%8F%B1%EF%B8%8F;Validate+HOS+Rules+%F0%9F%9B%A1%EF%B8%8F;Generate+ELD+Daily+Logs+%F0%9F%93%8B;Stay+Compliance-Ready+%E2%9C%85" />

</p>

<p align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>

</p>

<p align="center">

<img src="https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white"/>
<img src="https://img.shields.io/badge/FMCSA-HOS-1D4ED8?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Vercel-Ready-black?style=for-the-badge&logo=vercel"/>
<img src="https://img.shields.io/badge/Tests-16-success?style=for-the-badge"/>

</p>

---

# 🚛 What Is This?

**HOS Route Planner & ELD Daily Log Generator** is a full-stack logistics application designed to help commercial drivers and fleet operations plan trips around Hours-of-Service constraints and generate structured daily Record of Duty Status logs.

Instead of simply calculating a route, the system considers:

**🛣️ Route Distance + ⏱️ Driving Time + 🛌 Rest + ⛽ Fuel + 📦 Pickup/Drop-off + 📜 HOS Rules**

and transforms the result into a complete trip timeline and 24-hour ELD log.

---

# ⚡ From Route to ELD Log

```text
                         🚛 TRIP INPUT
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
             📍 Origin     📍 Destination   ⏱️ Cycle
                              │
                              ▼
                       🗺️ ROUTE ENGINE
                              │
                              ▼
                    ⏱️ HOS SCHEDULER
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
          🚛 Driving       🛌 Rest          ⛽ Fuel
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                     🛡️ HOS AUDIT ENGINE
                              │
                     ┌────────┴────────┐
                     ▼                 ▼
                  ✅ Valid          ⚠️ Violation
                     │
                     ▼
                  📋 ELD RODS
                     │
                     ▼
              📄 DAILY LOG SHEETS
```

---

# ✨ Core Capabilities

| 🚀 Module                    | Capability                                           |
| ---------------------------- | ---------------------------------------------------- |
| 🛣️ **Route Planning**       | Plan commercial trips between origin and destination |
| ⏱️ **HOS Scheduling**        | Schedule driving, rest and duty periods              |
| 🛡️ **Compliance Engine**    | Automatically inspect HOS constraints                |
| ⛽ **Fuel Planning**          | Insert commercial refueling stops                    |
| 📦 **Pickup / Delivery**     | Account for loading and unloading time               |
| 🗺️ **Interactive Map**      | Visualize route and stop locations                   |
| 📋 **ELD RODS Generator**    | Generate 24-hour duty-status logs                    |
| 🌙 **Midnight Splitting**    | Split multi-day trips into daily records             |
| 🔐 **Driver Authentication** | Protected driver access                              |
| 📊 **Trip Summary**          | Mileage, duty and compliance metrics                 |
| 🧪 **Automated Auditing**    | 16-test HOS validation suite                         |
| 📄 **PDF Generation**        | Printable/vector daily log sheets                    |

---

# 🛡️ HOS Compliance Engine

The core of the application is its automated HOS scheduling and validation logic.

### ⏱️ 11-Hour Driving Limit

The planner prevents a driver from exceeding the configured 11-hour driving allowance before a required reset.

### 🕐 14-Hour Duty Window

The system tracks the consecutive on-duty window and prevents scheduled driving beyond the allowed window.

### 🛌 30-Minute Rest Break

A mandatory 30-minute off-duty/sleeper period is automatically scheduled after the configured cumulative driving threshold.

### 🌙 10-Hour Reset

The scheduler inserts a full 10-hour consecutive rest period between driving shifts.

### 📊 70/8 Cycle

Multi-day cumulative duty is tracked against the configured 70-hour / 8-day limit.

### ⛽ Fuel Stops

Long-distance routes automatically receive refueling stops within the project's configured 850–950 mile interval.

### 📦 Dock Operations

Pickup and delivery receive dedicated one-hour on-duty buffers.

---

# 🧠 Automated Compliance Pipeline

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
        ┌───────────────────────────┐
        │       HOS ENGINE          │
        │                           │
        │  11h Driving              │
        │  14h Window               │
        │  30m Break                │
        │  10h Reset               │
        │  70/8 Cycle               │
        │  Fuel Stops               │
        │  Dock Time                │
        └─────────────┬─────────────┘
                      │
                      ▼
                📋 EVENT TIMELINE
                      │
                      ▼
                🛡️ AUDIT ENGINE
                      │
             ┌────────┴────────┐
             ▼                 ▼
          ✅ PASS           ⚠️ FAIL
             │                 │
             ▼                 ▼
        📄 ELD LOG          🚨 VIOLATION
```

---

# 📋 ELD Daily Log Generator

One of the project's key features is automatic generation of **24-hour daily duty-status records**.

Each daily log tracks:

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

* 💤 **Off Duty**
* 🛏️ **Sleeper Berth**
* 🚛 **Driving**
* 🔧 **On Duty — Not Driving**

---

# 🌙 Multi-Day Trip Handling

Long-haul trips can cross midnight.

The application automatically splits the timeline into separate daily records.

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

Every generated day is reconciled against a complete **24-hour / 1,440-minute timeline**.

---

# 🗺️ Interactive Highway Map

The application uses Leaflet to visualize the planned route.

### Custom stop markers

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

The map works together with the chronological stop table so users can understand both the **geographical route** and the **operational timeline**.

---

# 📍 Trip Timeline

Every planned trip produces a detailed sequence of events.

| Event       | Arrival | Departure | Duration | Status   |
| ----------- | ------: | --------: | -------: | -------- |
| 📍 Pickup   |   08:00 |     09:00 |       1h | On Duty  |
| 🚛 Driving  |   09:00 |     13:30 |     4.5h | Driving  |
| ⛽ Fuel      |   13:30 |     14:00 |      30m | On Duty  |
| 🛌 Rest     |   14:00 |     14:30 |      30m | Off Duty |
| 🚛 Driving  |   14:30 |       ... |      ... | Driving  |
| 📦 Delivery |     ... |       ... |       1h | On Duty  |

---

# 🔐 Driver Authentication

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
                     ▼
          ┌──────────┴──────────┐
          ▼                     ▼
       Authorized           Unauthorized
          │                     │
          ▼                     ▼
    🚛 Trip Planner          🔒 Blocked
    📋 ELD Logs
```

The authenticated experience can display driver and carrier information such as:

* Driver name
* CDL number
* Carrier
* Tractor/unit
* Current cycle usage

---

# 🧪 16-Test Compliance Audit

The project includes an automated HOS audit suite covering the major scheduling and log-generation rules implemented by the application.

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

# 📊 Compliance Dashboard

The application brings route information and compliance information together.

```text
┌─────────────────────────────────────────────────────┐
│                  🚛 TRIP SUMMARY                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📏 Distance        ⏱️ Drive Time       🛌 Rest    │
│  1,320 mi            20h 30m            10h        │
│                                                     │
├─────────────────────────────────────────────────────┤
│              🛡️ COMPLIANCE STATUS                   │
│                                                     │
│       ✅ 11h Driving Limit                          │
│       ✅ 14h Duty Window                            │
│       ✅ 30m Break                                  │
│       ✅ 10h Reset                                  │
│       ✅ 70/8 Cycle                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

# 🏗️ System Architecture

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
                │ Express Server      │
                │                     │
                │ Authentication      │
                │ Trip Planning       │
                │ HOS Engine          │
                │ Routing             │
                │ Geocoding           │
                │ Rule Tests          │
                └───────┬─────┬───────┘
                        │     │
              ┌─────────┘     └─────────┐
              ▼                         ▼
        🧠 HOS ENGINE              🗺️ ROUTING
              │                         │
              ▼                         ▼
        📋 ELD EVENTS             📍 GEO DATA
              │
              ▼
        📄 DAILY LOGS
```

---

# 🛠️ Technology Stack

### 🎨 Frontend

| Technology         | Purpose                   |
| ------------------ | ------------------------- |
| ⚛️ React 19        | User interface            |
| 🟦 TypeScript      | Type safety               |
| ⚡ Vite             | Development/build tooling |
| 🎨 Tailwind CSS v4 | Styling                   |
| 🎬 Motion          | UI animations             |
| 🗺️ Leaflet        | Interactive maps          |
| 📋 SVG             | ELD daily log rendering   |

### ⚙️ Backend

| Technology         | Purpose                     |
| ------------------ | --------------------------- |
| 🟢 Node.js         | Runtime                     |
| 🚂 Express         | API server                  |
| 🟦 TypeScript      | Type-safe backend           |
| 🧠 HOS Engine      | Scheduling/compliance logic |
| 🗺️ Routing Engine | Route planning              |
| 📍 Nominatim       | Geocoding                   |
| 🧪 Test Suite      | HOS validation              |

---

# 📂 Project Structure

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

---

# 🚀 Quick Start

```bash
# Clone
git clone <YOUR_REPOSITORY_URL>

# Enter project
cd <PROJECT_FOLDER>

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development
npm run dev
```

Then open:

### 🌐 `http://localhost:3000`

---

# 👨‍💻 Development Workflow

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
   🚛 PRODUCTION
```

---

# ☁️ Vercel Deployment

The project is configured for Vercel deployment.

```text
GitHub
   │
   ▼
Vercel
   │
   ├── ⚡ Vite Frontend
   │
   └── 📡 Serverless API
            │
            ├── /api/trips/plan
            ├── /api/auth/*
            ├── /api/geocode
            └── /api/rules/test
```

### Deploy

```bash
npm i -g vercel

vercel login

vercel

vercel --prod
```

---

# 📜 FMCSA Rules Implemented

The project's compliance checklist is organized around the following requirements:

| Rule                          | Implementation                     |
| ----------------------------- | ---------------------------------- |
| ⏱️ **11-Hour Driving**        | Driving limit validation           |
| 🕐 **14-Hour Window**         | Consecutive duty-window validation |
| 🛌 **30-Minute Break**        | Break scheduling/validation        |
| 🌙 **10-Hour Reset**          | Consecutive rest scheduling        |
| 📊 **70/8 Cycle**             | Multi-day cumulative tracking      |
| ⛽ **Fuel Stops**              | Long-haul refueling scheduling     |
| 📦 **Dock Operations**        | Pickup/drop-off buffers            |
| 📋 **24-Hour Reconciliation** | Daily ELD timeline validation      |

The project documents these rules with references to the applicable 49 CFR Part 395 sections. For production/commercial use, the implementation should still be validated against the current FMCSA regulations and any applicable exceptions or jurisdiction-specific requirements.

---

# 💡 Engineering Highlights

This project demonstrates several areas of practical full-stack engineering:

### 🧠 Domain Logic

The application translates complex operational constraints into deterministic scheduling logic.

### 🛡️ Compliance Automation

Instead of relying only on manual review, generated schedules are passed through automated rule checks.

### 📋 Structured Event Generation

Trip events become structured duty-status records that can then be rendered into daily logs.

### 🌙 Time Boundary Handling

Multi-day trips require careful midnight splitting and exact daily reconciliation.

### 🗺️ Geospatial UX

Routes, stops and logistics events are represented visually on an interactive map.

### 🧪 Automated Verification

A dedicated test suite validates HOS calculations and split-log algorithms.

### ☁️ Serverless Deployment

The API can run through Vercel serverless functions while the frontend is delivered as a Vite application.

---

# 🗺️ Future Roadmap

### ✅ Current

* [x] Commercial route planning
* [x] HOS scheduling
* [x] 11-hour driving validation
* [x] 14-hour window validation
* [x] 30-minute break scheduling
* [x] 10-hour reset handling
* [x] 70/8 cycle tracking
* [x] Fuel stop scheduling
* [x] Pickup/drop-off buffers
* [x] Interactive Leaflet map
* [x] ELD daily logs
* [x] Multi-day split handling
* [x] Automated compliance tests
* [x] Driver authentication
* [x] Vercel deployment

### 🔮 Future Enhancements

* [ ] 🛰️ Real-time traffic integration
* [ ] ⛽ Live fuel-price integration
* [ ] 🌦️ Weather-aware route planning
* [ ] 🚛 Multi-driver dispatch planning
* [ ] 📡 Fleet tracking
* [ ] 📊 Fleet-wide compliance dashboard
* [ ] 📱 Driver mobile application
* [ ] 🔔 Automated compliance alerts
* [ ] 📄 Expanded export/report formats
* [ ] 🔗 Telematics / ELD device integrations

---

# 🎯 What This Project Demonstrates

```text
                    FULL-STACK ENGINEERING
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
      🎨 FRONTEND          ⚙️ BACKEND         🧠 DOMAIN LOGIC
          │                   │                   │
       React 19             Express            HOS Rules
       TypeScript           APIs                Scheduling
       Tailwind             Auth                Validation
       Leaflet              Serverless          ELD Logic
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
                       🚛 LOGISTICS PLATFORM
```

---

# ⭐ Project Goal

> **Turn complex commercial HOS constraints into a simple, visual, and actionable trip-planning experience.**

The application connects **route planning, driver schedules, regulatory rule checks, stop planning, and ELD log generation** into a single workflow.

---

<p align="center">

## 🚛 Plan Smarter. Drive Compliant. Log Automatically.

**Built with ❤️ using React • TypeScript • Express • Tailwind • Leaflet**

⭐ **If you found this project useful, consider giving the repository a star**

</p>

---

## 📄 License

MIT License.
