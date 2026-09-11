# Commercial HOS Route Planner & FMCSA ELD Daily Log Generator

An FMCSA-compliant commercial vehicle Hours of Service (HOS) route planner and Electronic Logging Device (ELD) Record of Duty Status (RODS) generator. 

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Express**, **Motion**, and **Leaflet**.

---

## Key Features

- **FMCSA 49 CFR Part 395 Compliance**:
  - **11-Hour Driving Limit**: Prevents driving beyond 11 hours without a mandatory 10-hour consecutive off-duty reset.
  - **14-Hour Driving Window**: Flags and prevents driving beyond the 14th consecutive hour after coming on duty.
  - **30-Minute Rest Break**: Automatically schedules a mandatory 30-minute off-duty / sleeper break after 8 cumulative hours of driving.
  - **10-Hour Off-Duty Reset**: Enforces full 10.0-hour consecutive rest periods between driving shifts.
  - **70-Hour / 8-Day Cycle Rule**: Monitors multi-day cumulative driving and on-duty hours against the 70.0h statutory ceiling.
  - **Fuel Stops Under 1,000 Miles**: Automatically schedules 30-minute refueling stops every 850–950 miles.
  - **Pickup & Drop-off Buffers**: 1-hour on-duty (not driving) buffer allocated for loading/origin and unloading/destination.
- **Pixel-Perfect 24.00-Hour ELD Daily Log Sheets**:
  - Visual 24-hour graphical grid matching standard FMCSA paper logs / electronic display formats.
  - Duty status tracking across **Off Duty**, **Sleeper Berth**, **Driving**, and **On Duty (Not Driving)**.
  - Automatic midnight splits for multi-day cross-country hauls with exact 24.00-hour daily reconciliations.
  - Multi-page vector PDF generation and printing.
- **Driver Authentication & Gating**:
  - Secure session-based authentication with token verification.
  - Protected trip planning and ELD features reserved for authorized drivers.
  - Displays active carrier name, CDL number, truck/tractor unit, and current cycle usage.
- **Interactive Routing & Highway Map**:
  - Interactive Leaflet route visualization with custom stop markers (Origin, Fuel, Rest, Destination).
  - Turn-by-turn stop table with scheduled arrival, departure, activity duration, and status updates.
  - Comprehensive 16-test automated HOS audit engine with real-time rule inspection.

---

## How to Run This Project in VS Code (Local Development)

Follow these straightforward steps to set up, run, and develop this application locally on your computer using **Visual Studio Code**.

### 1. Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: Version 18.x or 20.x+ ([Download Node.js](https://nodejs.org/))
- **npm** (bundled with Node.js) or **yarn** / **pnpm**
- **Git** ([Download Git](https://git-scm.com/))
- **Visual Studio Code** ([Download VS Code](https://code.visualstudio.com/))

### 2. Clone or Open the Project in VS Code

1. Open your terminal (or Command Prompt / PowerShell).
2. Clone the repository or navigate to your downloaded folder:
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd <PROJECT_FOLDER>
   ```
3. Launch Visual Studio Code in this folder:
   ```bash
   code .
   ```

### 3. Recommended VS Code Extensions (Optional but Recommended)

For the best developer experience, install these extensions in VS Code:
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Pretty TypeScript Errors** (`yoavbls.pretty-ts-errors`)

### 4. Install Dependencies

Open the integrated terminal in VS Code (`Ctrl + \`` or `Cmd + \`` on macOS, or menu **Terminal > New Terminal**), then run:

```bash
npm install
```

### 5. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

*(No external API keys are required for core functionality. Routing and geocoding run via built-in logistics heuristics, OpenStreetMap Nominatim, and internal HOS scheduling engines.)*

### 6. Start the Development Server

Run the development command:

```bash
npm run dev
```

You should see output similar to:
```
HOS Route Planner Server running on http://0.0.0.0:3000
```

### 7. Open the App in Your Browser

Open your browser and navigate to:
```
http://localhost:3000
```

### 8. Sign In to Plan Trips & Access ELD Logs

1. On the home page, you will be presented with the **Authorized Driver Sign-In** card.
2. Click **"Sign In with Demo Driver"** for immediate instant access, or enter your own name, CDL number, and carrier details.
3. Once authenticated, enter your pickup location (e.g. `Chicago, IL`), delivery location (e.g. `Dallas, TX`), current cycle hours used, and click **"Generate FMCSA Compliant Route & ELD Logs"**.

---

## Deploying to Vercel

This repository is pre-configured and 100% **Vercel-ready** with zero extra setup needed.

### Method 1: Deploy via Vercel Web Dashboard (Recommended)

1. Push your code to your GitHub / GitLab / Bitbucket account:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```
2. Navigate to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." > "Project"**.
3. Import your Git repository.
4. Vercel automatically detects the Vite framework and uses the included `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `vite build` (or `npm run build`)
   - **Output Directory**: `dist`
5. Click **Deploy**.
6. In approximately 30-45 seconds, your app will be live with a production HTTPS URL!

### Method 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```
2. In the project root, login and deploy:
   ```bash
   vercel login
   vercel
   ```
3. To deploy directly to production:
   ```bash
   vercel --prod
   ```

### Why Vercel Works Seamlessly:
- `vercel.json` routes `/api/(.*)` to the serverless function `/api/index.ts`.
- All client-side SPA routing (`/`, `/about`, etc.) fall back gracefully to `dist/index.html`.
- API endpoints (`/api/trips/plan`, `/api/auth/*`, `/api/geocode`, `/api/rules/test`) execute serverlessly on Node.js.

---

## Available Project Scripts

Inside the project root, you can run the following scripts:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the full-stack Vite development server with Express backend on port 3000 |
| `npm run build` | Compiles the production React bundle into `dist/` and bundles `server.ts` |
| `npm run start` | Launches the standalone production Node.js server (`dist/server.cjs`) |
| `npm run lint` | Runs TypeScript type checking across the entire codebase (`tsc --noEmit`) |
| `npm run test` | Runs the automated 16-test suite verifying FMCSA HOS math and split-log algorithms |
| `npm run clean` | Cleans up previous build artifacts |

---

## Project Structure

```
├── api/
│   └── index.ts                 # Vercel Serverless Function entrypoint
├── public/                      # Static assets and icons
├── src/
│   ├── components/
│   │   ├── Auth/                # Driver login, register, and AuthGateCard components
│   │   ├── Compliance/          # 8-rule FMCSA audit checklist and violation cards
│   │   ├── ELD/                 # 24.00h SVG daily log sheet and duty status grid
│   │   ├── Map/                 # Interactive Leaflet routing map with custom markers
│   │   ├── Timeline/            # Chronological trip event timeline
│   │   ├── TripPlanner/         # Origin/destination input, cycle hours, autocomplete
│   │   ├── TripSummary/         # HOS summary cards and mileage metrics
│   │   └── UI/                  # Dark/light mode theme toggle, toast alerts, cards
│   ├── context/
│   │   ├── AuthContext.tsx      # Driver session and authentication state
│   │   ├── ThemeContext.tsx     # Light/Dark mode state
│   │   └── ToastContext.tsx     # Toast notifications
│   ├── pages/
│   │   ├── DashboardPage.tsx    # Main planning dashboard and results viewer
│   │   └── AboutRulesPage.tsx   # FMCSA regulatory handbook and 16-test suite
│   ├── server/
│   │   ├── auth.ts              # Driver session store and token verification
│   │   ├── api.ts               # Express API router (/api/trips/plan, /api/auth, etc.)
│   │   ├── hos/                 # Core HOS scheduling, limits, and validator engines
│   │   ├── routing/             # Road router and geocoder implementations
│   │   └── tests/               # 16 FMCSA unit tests
│   ├── types/
│   │   └── hos.ts               # TypeScript interfaces for trips, stops, and logs
│   ├── App.tsx                  # Top-level React routing and layout
│   ├── main.tsx                 # Client entrypoint
│   └── index.css                # Tailwind CSS v4 entrypoint
├── server.ts                    # Local Express development & container server
├── vercel.json                  # Vercel deployment configuration & API rewrites
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
├── tsconfig.json                # TypeScript compiler configuration
└── package.json                 # Project dependencies and npm scripts
```

---

## FMCSA Compliance Checklist Verified

1. **49 CFR § 395.3(a)(1)**: 11-Hour Driving Rule verified across every shift.
2. **49 CFR § 395.3(a)(2)**: 14-Hour Consecutive Duty Window strictly enforced.
3. **49 CFR § 395.3(a)(3)(ii)**: Mandatory 30-minute rest break after 8 hours of driving.
4. **49 CFR § 395.3(a)(1)**: 10-Hour Consecutive Off-Duty / Sleeper Berth reset.
5. **49 CFR § 395.3(b)**: 70-Hour / 8-Day Cumulative Duty limit protection.
6. **Commercial Refueling**: Fuel stops inserted whenever distance exceeds 850–950 miles.
7. **Dock Operations**: 1 hour allocated for pickup loading and delivery drop-off.
8. **24.00h Daily Reconciliation**: All logs reconcile to exactly 24 hours (1,440 minutes).

---

## License

MIT License. Designed for commercial motor carriers, dispatchers, safety directors, and professional commercial drivers.
