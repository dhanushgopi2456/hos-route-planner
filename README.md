# 🚛 HOS Route Planner & ELD Log Generator

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:020617,25:1D4ED8,60:0891B2,100:22D3EE&height=230&section=header&text=HOS%20Route%20Planner&fontSize=38&fontColor=FFFFFF&animation=fadeIn&fontAlignY=35&desc=Smart%20Routing%20%7C%20HOS%20Scheduling%20%7C%20ELD%20Logs&descSize=15&descAlignY=58" width="100%" alt="HOS Route Planner animated banner"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=18&duration=2500&pause=800&color=22D3EE&center=true&vCenter=true&width=850&lines=Plan+Smarter.+Drive+Compliant.;Visualize+Commercial+Routes+%F0%9F%9A%9B;Automate+Hours+of+Service+Scheduling+%E2%8F%B1%EF%B8%8F;Generate+ELD+Daily+Logs+%F0%9F%93%8B;Build+Smarter+Logistics+Workflows" alt="Animated project tagline"/>
</p>

<p align="center">
  <a href="https://hos-route-planner-ruddy.vercel.app/">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_Project-2563EB?style=for-the-badge" alt="Live demo"/>
  </a>
  <a href="https://github.com/dhanushgopi2456/hos-route-planner">
    <img src="https://img.shields.io/badge/GitHub-Source_Code-181717?style=for-the-badge&logo=github" alt="GitHub repository"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Route_Planning-2563EB?style=flat-square" alt="Route planning"/>
  <img src="https://img.shields.io/badge/HOS_Scheduling-7C3AED?style=flat-square" alt="HOS scheduling"/>
  <img src="https://img.shields.io/badge/ELD_Log_Generation-0891B2?style=flat-square" alt="ELD log generation"/>
  <img src="https://img.shields.io/badge/Geospatial_Visualization-16A34A?style=flat-square" alt="Geospatial visualization"/>
</p>

> A logistics-focused web application for planning commercial routes, organizing driving schedules, and generating electronic logging device (ELD) log information.

---

## 📑 Table of Contents

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-technology-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#-route-to-eld-workflow">Workflow</a> •
  <a href="#hos">HOS</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#roadmap">Roadmap</a>
</p>

---

## 🌟 Overview

The **HOS Route Planner & ELD Log Generator** combines route planning, geospatial visualization, Hours of Service (HOS) scheduling, and ELD log generation in one web application.

The project aims to make commercial trip planning easier by organizing route information, estimated travel, duty schedules, rest periods, and daily log information in a structured workflow.

### 🎯 Project Objectives

- 🗺️ Visualize commercial routes geographically.
- 🚛 Organize trip and stop information.
- ⏱️ Plan driving and rest schedules.
- 🛡️ Support HOS-related checks and schedule review.
- 📋 Generate structured ELD daily log information.
- 📄 Make trip information easier to review and export where supported.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🗺️ Route Planning

- Origin and destination inputs
- Route visualization
- Trip-distance and travel-time information
- Map-based route exploration

</td>
<td width="50%">

### ⏱️ HOS Scheduling

- Driving and duty-time planning
- Rest-period scheduling
- Schedule timeline organization
- HOS-related validation workflows

</td>
</tr>
<tr>
<td width="50%">

### 📋 ELD Log Generation

- Daily log information
- Driving and rest event organization
- Trip timeline representation
- Reviewable log output

</td>
<td width="50%">

### 📊 Trip Management

- Route and stop information
- Timeline-based trip review
- Compliance-oriented schedule inspection
- Clear visual presentation of trip details

</td>
</tr>
</table>

---

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend user interface |
| TypeScript | Type-safe application development |
| Tailwind CSS v4 | Responsive styling |
| Leaflet | Interactive maps and route visualization |
| Node.js | JavaScript runtime |
| Express.js | Backend API framework |
| OSRM | Route-service integration |
| Vercel | Live application deployment |

The exact availability of each feature depends on the current implementation and configuration in the repository.

---
<a id="architecture"></a>
## 🏗️ System Architecture

The following architecture diagram is written in Mermaid and renders directly on GitHub. It does not require an external image host.

```mermaid
flowchart TB
    DRIVER(["👤 Driver / Dispatcher"])

    subgraph FRONTEND["🎨 Frontend Layer"]
        UI["⚛️ React + TypeScript"]
        MAP["🗺️ Leaflet Map"]
        TRIP["🚛 Trip Planner"]
        TIMELINE["⏱️ Schedule Timeline"]
        LOGVIEW["📋 ELD Log View"]
    end

    subgraph BACKEND["⚙️ Backend Layer"]
        API["🔌 Express API"]
        ROUTE["🛣️ Route Integration"]
        HOS["🛡️ HOS Scheduling"]
        ELD["📄 ELD Log Generation"]
    end

    ROUTESERVICE["🌐 OSRM Route Service"]

    subgraph RESULTS["📦 Trip Results"]
        ROUTEOUT["📍 Route Details"]
        SCHEDULE["🕒 Duty Schedule"]
        LOGS["📋 Daily Log Information"]
    end

    DRIVER --> UI
    UI --> MAP
    UI --> TRIP
    UI --> TIMELINE
    UI --> LOGVIEW

    UI <--> API
    API --> ROUTE
    API --> HOS
    API --> ELD

    ROUTE <--> ROUTESERVICE
    ROUTE --> ROUTEOUT
    HOS --> SCHEDULE
    ELD --> LOGS

    ROUTEOUT --> UI
    SCHEDULE --> UI
    LOGS --> UI

    classDef user fill:#DBEAFE,stroke:#2563EB,color:#1E3A8A,stroke-width:2px
    classDef frontend fill:#CFFAFE,stroke:#0891B2,color:#164E63,stroke-width:2px
    classDef backend fill:#F3E8FF,stroke:#9333EA,color:#581C87,stroke-width:2px
    classDef service fill:#FFEDD5,stroke:#EA580C,color:#9A3412,stroke-width:2px
    classDef results fill:#DCFCE7,stroke:#16A34A,color:#14532D,stroke-width:2px

    class DRIVER user
    class UI,MAP,TRIP,TIMELINE,LOGVIEW frontend
    class API,ROUTE,HOS,ELD backend
    class ROUTESERVICE service
    class ROUTEOUT,SCHEDULE,LOGS results

    style FRONTEND fill:#EFF6FF,stroke:#60A5FA,stroke-width:2px
    style BACKEND fill:#FAF5FF,stroke:#C084FC,stroke-width:2px
    style RESULTS fill:#F0FDF4,stroke:#4ADE80,stroke-width:2px
```

---

## 🔄 Route-to-ELD Workflow

This flowchart illustrates the intended high-level trip workflow.

```mermaid
flowchart TD
    A(["🚛 Start Trip Planning"]) --> B["📍 Enter Origin and Destination"]
    B --> C["🗺️ Calculate Route"]
    C --> D["📏 Review Distance and ETA"]
    D --> E["⏱️ Organize Driving Schedule"]

    E --> F["🛌 Schedule Rest Periods"]
    F --> G["🛡️ Review HOS Constraints"]
    G --> H{"Schedule Acceptable?"}

    H -->|Yes| I["📋 Prepare ELD Log Information"]
    H -->|No| J["🔄 Adjust Stops or Schedule"]

    J --> E
    I --> K["📊 Review Daily Timeline"]
    K --> L(["✅ Finish Trip Review"])

    classDef start fill:#DBEAFE,stroke:#2563EB,color:#1E3A8A,stroke-width:2px
    classDef planning fill:#CFFAFE,stroke:#0891B2,color:#164E63,stroke-width:2px
    classDef validation fill:#F3E8FF,stroke:#9333EA,color:#581C87,stroke-width:2px
    classDef success fill:#DCFCE7,stroke:#16A34A,color:#14532D,stroke-width:2px
    classDef revise fill:#FFEDD5,stroke:#EA580C,color:#9A3412,stroke-width:2px

    class A,L start
    class B,C,D,E,F planning
    class G,H validation
    class I,K success
    class J revise
```

---
<a id="hos"></a>
## 🛡️ Hours of Service (HOS)

Hours of Service rules help organize driving and rest schedules for commercial drivers.

The following diagram illustrates common U.S. property-carrying driver rule categories. It is an explanatory workflow, not proof that every regulatory exception or condition is implemented in this project.

```mermaid
flowchart LR
    A["🚛 Trip Schedule"] --> B["⏱️ Driving Time"]
    B --> C["🕒 Duty Window"]
    C --> D["🛌 Break and Rest Periods"]
    D --> E["🔄 Cycle Limits"]
    E --> F["🛡️ Schedule Review"]

    F --> G{"Review Result"}
    G -->|Acceptable| H["📋 Prepare Daily Log"]
    G -->|Needs Changes| I["⚠️ Revise Schedule"]
    I --> B

    classDef trip fill:#DBEAFE,stroke:#2563EB,color:#1E3A8A,stroke-width:2px
    classDef time fill:#CFFAFE,stroke:#0891B2,color:#164E63,stroke-width:2px
    classDef review fill:#F3E8FF,stroke:#9333EA,color:#581C87,stroke-width:2px
    classDef ok fill:#DCFCE7,stroke:#16A34A,color:#14532D,stroke-width:2px
    classDef change fill:#FEE2E2,stroke:#DC2626,color:#991B1B,stroke-width:2px

    class A trip
    class B,C,D,E time
    class F,G review
    class H ok
    class I change
```

### HOS concepts

- Driving-time limits
- Duty-window constraints
- Required breaks
- Off-duty and sleeper-berth rest periods
- Cycle limits and resets
- Daily duty-status event organization

Regulatory requirements depend on the driver's operation, applicable exceptions, and other conditions. Validate generated schedules against the current official rules before relying on them operationally.

---

## 🎨 Visual Design

<p align="center">
  <img src="https://img.shields.io/badge/01-Route_Visualization-2563EB?style=for-the-badge" alt="Route visualization"/>
  <img src="https://img.shields.io/badge/02-Schedule_Planning-7C3AED?style=for-the-badge" alt="Schedule planning"/>
  <img src="https://img.shields.io/badge/03-HOS_Review-0891B2?style=for-the-badge" alt="HOS review"/>
  <img src="https://img.shields.io/badge/04-ELD_Logs-16A34A?style=for-the-badge" alt="ELD logs"/>
</p>

The README uses blue, cyan, purple, and green accents to distinguish the main application layers and workflow stages.

The hero banner and typing animation are external animated images. The Mermaid diagrams are static, interactive only to the extent supported by GitHub's diagram viewer, and do not need to be uploaded as separate screenshots.

---

## ⚙️ Prerequisites

Before running the project locally, ensure you have the tools and services required by the repository:

- Node.js and npm
- Git
- A compatible browser
- Any required backend environment variables
- Any database or external service configured by the project

The backend setup depends on the actual repository configuration.

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/dhanushgopi2456/hos-route-planner.git
cd hos-route-planner
```

### 2. Inspect the project files

```bash
git status
```

Check the repository's `package.json`, backend configuration, and environment example files before installing dependencies.

### 3. Install dependencies

Run the install command from the directory containing the relevant `package.json`.

```bash
npm install
```

If the repository separates the frontend and backend into different packages, install dependencies in each relevant directory.

### 4. Configure environment variables

If the application uses environment variables, create the required local environment file based on the project's example configuration.

Never commit API keys, credentials, tokens, or production secrets.

### 5. Start the application

Use the scripts defined in the project's `package.json`.

```bash
npm run dev
```

If the frontend and backend have separate startup scripts, start them according to the repository's documentation. The commands above are general guidance; use the scripts actually present in your checkout.

---
## 📸 Screenshots

Explore the key features of the HOS Route Planner & ELD Log Generator through the screenshots below.

### Trip Planner Dashboard

<p align="center">
  <img src="https://github.com/dhanushgopi2456/My-All-Project-Screenshots/blob/main/Screenshot%202026-10-16%20074645.png"/>
</p>

### Trip Details & Location Selection

<p align="center">
  <img src="https://github.com/dhanushgopi2456/My-All-Project-Screenshots/blob/main/Screenshot%202026-10-16%20074716.png"/>
</p>

### Interactive Route Map

<p align="center">
  <img src="https://github.com/dhanushgopi2456/My-All-Project-Screenshots/blob/main/Screenshot%202026-10-16%20074903.png"/>
</p>

### Trip Schedule & HOS Timeline

<p align="center">
  <img src="https://github.com/dhanushgopi2456/My-All-Project-Screenshots/blob/main/Screenshot%202026-10-16%20080103.png"/>
</p>

### Daily ELD Log Sheets

<p align="center">
  <img src="https://github.com/dhanushgopi2456/My-All-Project-Screenshots/blob/main/Screenshot%202026-10-16%20074933.png"/>
</p>

### HOS Compliance Validation & Trip Summary

<p align="center">
  <img src="https://github.com/dhanushgopi2456/My-All-Project-Screenshots/blob/main/Screenshot%202026-10-12%20160542.png" width="90%" alt="Team Task Manager analytics"/>
</p>


---

## 🌐 Deployment

<p align="center">
  <a href="https://hos-route-planner-ruddy.vercel.app/">
    <img src="https://img.shields.io/badge/OPEN_LIVE_APPLICATION-2563EB?style=for-the-badge&logo=vercel&logoColor=white" alt="Open live application"/>
  </a>
</p>

The project has a Vercel deployment:

**Live demo:** https://hos-route-planner-ruddy.vercel.app

Deployment requirements may include build configuration, environment variables, and backend hosting or external-service configuration. Verify these settings against the current deployment.

---

## 🧪 Testing and Validation

Test the application before deploying changes.

Suggested validation checklist:

- [ ] Route input validation
- [ ] Route results display correctly
- [ ] Schedule calculations behave as expected
- [ ] Rest periods are represented correctly
- [ ] HOS review handles invalid schedules
- [ ] ELD log information matches the trip timeline
- [ ] External service failures are handled gracefully
- [ ] Production environment variables are configured securely

These are suggested validation tasks, not a claim that every test already exists in the repository.

---
<a id="#roadmap"></a>
## 🗺️ Roadmap

The following are possible future improvements; they should not be interpreted as already implemented.

```mermaid
flowchart TD
    A(["🌱 Foundation"]) --> B["🗺️ Route Experience"]
    B --> C["⏱️ Scheduling Improvements"]
    C --> D["📋 ELD Log Enhancements"]
    D --> E["📊 Analytics and Reporting"]
    E --> F(["🚀 Future Expansion"])

    A1["Route input and basic planning"] -.-> A
    B1["Improved map and stop visualization"] -.-> B
    C1["Schedule validation and edge cases"] -.-> C
    D1["More complete log review and export"] -.-> D
    E1["Trip summaries and reporting"] -.-> E
    F1["Additional integrations and usability"] -.-> F

    classDef foundation fill:#DBEAFE,stroke:#2563EB,color:#1E3A8A,stroke-width:2px
    classDef routing fill:#CFFAFE,stroke:#0891B2,color:#164E63,stroke-width:2px
    classDef scheduling fill:#F3E8FF,stroke:#9333EA,color:#581C87,stroke-width:2px
    classDef logs fill:#FFEDD5,stroke:#EA580C,color:#9A3412,stroke-width:2px
    classDef analytics fill:#DCFCE7,stroke:#16A34A,color:#14532D,stroke-width:2px

    class A,A1 foundation
    class B,B1 routing
    class C,C1 scheduling
    class D,D1 logs
    class E,E1,F,F1 analytics
```

Potential enhancements:

- [ ] Improve route and stop visualization
- [ ] Expand schedule validation and edge-case handling
- [ ] Enhance ELD log review and export workflows
- [ ] Add trip summaries and reporting
- [ ] Improve automated tests
- [ ] Strengthen error handling and observability
- [ ] Improve accessibility and responsive layouts

---

## 🔐 Security and Reliability

Recommended practices for continued development:

- Keep secrets in environment variables.
- Validate all incoming API data.
- Handle route-service failures.
- Test scheduling boundary conditions.
- Avoid treating generated logs as automatically certified compliance records.
- Verify production configuration before deployment.

---

## 👨‍💻 Developer

<p align="center">
  <b>Dhanush Gopi Kavala</b>
</p>

<p align="center">
  <a href="https://github.com/dhanushgopi2456">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub profile"/>
  </a>
  <a href="https://www.linkedin.com/in/dhanush-gopi-kavala-a460a528b/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn profile"/>
  </a>
</p>

---

## 📄 License

Refer to the repository's license file for licensing terms. If the repository does not contain a license, usage and redistribution permissions may be limited.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:020617,45:1D4ED8,100:0891B2&height=150&section=footer&text=Plan%20Smarter.%20Drive%20Better.&fontSize=24&fontColor=FFFFFF&animation=fadeIn" width="100%" alt="HOS Route Planner animated footer"/>
</p>

<p align="center">
  <b>🚛 Route Planning · 🛡️ HOS Scheduling · 📋 ELD Log Generation</b>
</p>
