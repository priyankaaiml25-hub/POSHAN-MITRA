# POSHAN-MITRA: Smart Diet, Nutrition Awareness & Child Welfare Platform

A multilingual, offline-friendly digital health platform for Anganwadi Centres aligned with POSHAN Abhiyaan 2.0. Empowers Anganwadi Workers, caregivers, and preschool children with WHO 2006-compliant growth monitoring, budget-aware meal planning, multilingual education, and gamified nutrition learning.

## Table of Contents

1. [What is POSHAN-MITRA?](#1-what-is-poshan-mitra)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Key Features](#4-key-features)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture & Working Flow](#6-system-architecture--working-flow)
7. [WHO 2006 Growth Standards](#7-who-2006-growth-standards)
8. [Database Schema](#8-database-schema)
9. [Project Structure](#9-project-structure)
10. [Installation & Setup](#10-installation--setup)
11. [Demo Accounts & Quick Start](#11-demo-accounts--quick-start)
12. [How It Works (Step-by-Step)](#12-how-it-works-step-by-step)
13. [API Endpoints Overview](#13-api-endpoints-overview)
14. [Testing](#14-testing)
15. [Security & Data Privacy](#15-security--data-privacy)
16. [Deployment](#16-deployment)
17. [Future Enhancements](#17-future-enhancements)
18. [References](#18-references)
# POSHAN-MITRA: Smart Diet, Nutrition Awareness & Child Welfare Platform

**A multilingual, offline-friendly digital health platform for Anganwadi Centres, aligned with POSHAN Abhiyaan 2.0.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Node.js 24](https://img.shields.io/badge/Node.js-24-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![WHO 2006 Compliant](https://img.shields.io/badge/WHO%202006-Compliant-brightgreen.svg)](https://www.who.int/tools/child-growth-standards)

---

## 1. What is POSHAN-MITRA?

POSHAN-MITRA ("Nutrition Friend/Helper") bridges the gap between nutrition science and grassroots implementation in India's Anganwadi ecosystem. It empowers **Anganwadi Workers (AWWs)**, **Caregivers (Parents)**, and **Children (3-6 years)** with practical, affordable, and scientifically validated tools for child nutrition monitoring and education.

**Key Principles:** Local-first affordability, evidence-based care (WHO 2006), privacy-first design, multilingual accessibility with TTS, and playful learning. Built without paid external AI APIs.

---

## 2. Problem Statement

Critical challenges at the grassroots:
- **Manual Registers:** Paper-based records prone to errors
- **Generic Advice:** Lacks budget-awareness and local food context
- **Language Barriers:** Limited vernacular + voice support
- **Delayed Intervention:** Manual calculations delay referrals
- **Low Engagement:** Traditional methods fail for preschoolers
- **Cost Barriers:** API-dependent tools unsustainable

---

## 3. Objectives

1. Digitize growth monitoring with WHO 2006 Z-score automation
2. Enable budget-conscious meal planning using local Indian foods
3. Provide multilingual UI (EN/HI/KN) with Text-to-Speech
4. Gamify nutrition education for ages 3-6 (privacy-safe)
5. Streamline follow-up actions from growth alerts
6. Ensure privacy via pseudonymization, RBAC, audit logging
7. Support offline-first via Service Worker
8. Generate aggregate, non-identifiable impact reports

---

## 4. Key Features

### 4.1 Smart Local-Budget Meal Planner (Core Innovation)
- **Budget-aware:** ?20–?500, family size 1–8
- **Deterministic rule-based engine:** 100% local, no external APIs
- **Balanced nutrition:** Energy, Protein, Iron, Calcium, Vitamin A, Probiotics
- **25+ Indian foods:** Ragi, Jowar, Bajra, Toor/Moong Dal, Palak, Drumstick, Curd, Groundnut etc.
- **Pragmatic outputs:** Cooking steps, quantities, per-serving costs, local shopping list
- **Dietary prefs:** Vegetarian/Eggetarian/Non-Vegetarian
- **Print-ready**

### 4.2 WHO 2006 Child Growth Monitoring
- **Scientific:** Official WHO 2006 medians/SDs with interpolation
- **Metrics:** WAZ, HAZ, WHZ Z-scores
- **Smart flagging:** Moderate/Severe Underweight/Wasting/Stunting
- **Longitudinal:** Recharts growth trend visualization
- **Pseudonymous IDs:** CH-XXX-XXX, no PII
- **Ethical:** Screening/referral decision-support (not diagnosis)

### 4.3 Multilingual Accessibility (EN/HI/KN)
- Full UI translation with instant switching + localStorage
- Web Speech API TTS for tips, quizzes, feedback
- Localized lessons/food names

### 4.4 Poshan Play (Preschool Gamification)
- Privacy-safe: No registration/PII; fully anonymous client-side
- Modes: Picture Quiz, Build Rainbow Plate (Thali Builder), Sort & Match
- Touch-friendly, audio feedback, star rewards

### 4.5 Worker Dashboard & Task Management
- RBAC: ADMIN, WORKER, PARENT
- KPIs: Enrolled, flagged, pending/completed tasks
- Follow-up tracker with priority, due dates, resolution notes
- Demo mode badge for ethical evaluation

### 4.6 Impact Reports & Analytics
- Aggregate-only KPIs/charts, CSV export (no PII)
- Monthly workload + WHO screening distribution

### 4.7 Offline-First & PWA
- Service Worker caching, responsive, installable PWA

### 4.8 Security, Privacy & Audit
- bcrypt password hashing, JWT auth, Zod validation
- Helmet security headers, CORS, RBAC middleware
- AuditLog for sensitive ops (child:create, measurement:create, task:complete)

## 5. Technology Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19, TypeScript, Vite | UI, type-safety, build |
| React Router DOM v7, Tailwind CSS v3 | Routing, styling |
| Lucide React, Recharts | Icons, charts |
| Axios, Web Speech API | HTTP, TTS |
| Vite PWA (SW) | Offline/PWA |

### Backend
| Tech | Purpose |
|---|---|
| Node.js 24, Express.js 5, TypeScript | Runtime/API |
| Prisma ORM, SQLite/PostgreSQL | Data layer |
| JWT, bcryptjs | Auth/security |
| Helmet, CORS, Zod, dotenv | Security/validation/config |

### Testing & Quality
| Tool | Purpose |
|---|---|
| Vitest, Supertest | Unit/Integration tests |
| TSX, Oxlint | TS execution, linting |

### DevOps & Deployment
| Tool | Purpose |
|---|---|
| Docker, Docker Compose, Nginx | Containerization/proxy |
| Render/Railway/Fly.io (BE), Vercel/Netlify (FE) | Hosting |

## 6. System Architecture & Working Flow

### 6.1 Architecture Diagram (Textual)
```
Client (React+TS+Tailwind, i18n+TTS+SW) --(REST/JSON, /api/*)--> Express Backend
Express: Auth/RBAC, Controllers, Middleware, Zod Validation
Business: WHO 2006 Engine | Rule-Based Meal Planner | Reports/Audit
--> Prisma ORM --> SQLite/PostgreSQL (Users/Centres/Children/Growth/Tasks/Food/Lessons/Audit)
```

### 6.2 Working Flow

**A) Authentication & RBAC**
1. Login (or 1-Click Demo) ? JWT issued ? role-based route protection ? Bearer token on requests.

**B) WHO 2006 Growth Monitoring**
1. Worker: Growth Monitoring ? select/register pseudonymous child (DOB, gender)
2. Enter Weight(kg), Height(cm), Date
3. Backend computes ageMonths, looks up WHO 2006 medians/SDs, interpolates, Z = (x-M)/SD
4. Returns WAZ/HAZ/WHZ + needsReview (|Z|>=2.0 triggers review)
5. Persisted with timestamps; audit log created. Review ? create Follow-Up Task

**C) Smart Meal Planner (Rule-Based, Local)**
1. Inputs: Budget(?), Family Size, Diet Type, preferences
2. Load FoodItem DB; apply constraints (budget, dietary, food groups)
3. Deterministic optimization ? balanced plan + shopping list + costs + steps
4. No external APIs; reproducible outputs

**D) Poshan Play (Anonymous Gamified Learning)**
1. Open /poshan-play (no auth). Modes: Picture Quiz, Build Rainbow Plate, Sort & Match
2. Large touch UI, TTS feedback, stars/rewards. Fully client-side, no PII stored.

**E) Follow-Up Task Management**
1. Growth flag ? create task (type/priority/due/date/notes)
2. Dashboard + /follow-ups: track PENDING/IN_PROGRESS/COMPLETED with resolution notes + timestamp

**F) Reports & CSV Export**
1. /impact-reports aggregates non-PII KPIs ? charts (Bar/Pie) ? CSV export (aggregate-only)

## 7. WHO 2006 Growth Standards

Implements official WHO Child Growth Standards (2006): Z = (Observed - Reference Median)/SD, with interpolation for fractional ages/heights.

**Classification (key thresholds):**
| Indicator | Range | Classification |
|---|---|---|
| WAZ | < -3 | Severe Underweight (Priority) |
| WAZ | -3 = WAZ < -2 | Moderate Underweight (Review) |
| WAZ | -2 = WAZ = +2 | Normal |
| HAZ | < -2 | Stunting indicators as above |
| WHZ | < -3 | Severe Wasting (High Priority) |
| WHZ | < -2 | Moderate Wasting (Review) |

**Validation:** 5 unit tests in `backend/tests/whoGrowthStandards.test.ts` (age interpolation, normal trajectory, moderate underweight, severe wasting, invalid inputs).  
**Ethical:** Decision-support/screening only—not a clinical diagnosis. Supports AWWs/ASHAs/ANMs.

---

## 8. Database Schema

| Model | Key Fields | Purpose |
|---|---|---|
| Centre | id,name,code(AWC-XXX-XXX),district,state,pincode | Anganwadi registry |
| User | id,name,email,password(bcrypt),role(ADMIN/WORKER/PARENT),centreId | Auth+RBAC |
| Child | id,childId(CH-XXX-XXX),dob,gender,guardian*,centreId | Pseudonymous registry |
| GrowthMeasurement | childId,weightKg,heightCm,ageMonths,waz,haz,whz,needsReview,measuredAt,notes | Longitudinal WHO data |
| FollowUpTask | childId,centreId,assignedToId,type,title,priority,status,dueDate,completedAt,resolutionNotes | Interventions |
| NutritionLesson | multilingual titles/content,category,ageGroup,duration,order | 10 lessons |
| FoodItem | multilingual names,category,macros/micros,costPer100g,veg/local,season | 25+ Indian foods |
| AuditLog | userId,action,entity,entityId,ip,userAgent,metadata,createdAt | Audit trail |

## 9. Project Structure

See detailed structure in repo: backend (controllers/routes/middleware/utils/tests/prisma), frontend (pages/components/i18n/context/services/utils/__tests__), docs, docker-compose. Key files: `backend/src/utils/whoGrowthStandards.ts`, `backend/src/controllers/mealPlanController.ts`, `frontend/src/i18n/translations.ts`, `frontend/src/config/api.ts`, `backend/src/index.ts`.

---

## 10. Installation & Setup

### Prerequisites
- Node.js 24.x+, npm/yarn/pnpm
- Git
- (Optional) Docker + Docker Compose
- (Optional) PostgreSQL for production

### 10.1 Local Development (Recommended)

**Step 1: Clone Repository**
```bash
git clone https://github.com/priyankaaiml25-hub/POSHAN-MITRA.git
cd POSHAN-MITRA
```

**Step 2: Backend Setup**
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed  # seeds demo data, foods, lessons, demo users/children
npm run dev   # http://localhost:5000
```

**Step 3: Frontend Setup** (new terminal)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev   # http://localhost:5173
```

### 10.2 Docker Compose (One-Command)
```bash
# From repo root
cp .env.example .env  # configure as needed
docker-compose up --build
# Frontend: http://localhost:5173, Backend: http://localhost:5000
```

### 10.3 Environment Variables

**Backend (.env):** PORT, NODE_ENV, DATABASE_URL (file:./dev.db or postgres), JWT_SECRET, JWT_EXPIRE, CORS_ORIGIN (http://localhost:5173), BCRYPT_ROUNDS.  
**Frontend (.env):** VITE_API_BASE_URL (http://localhost:5000/api or /api in prod).

---

## 11. Demo Accounts & Quick Start

Use 1-Click Fast Login on Login page for evaluation, or credentials:

**Worker Demo**
- Email: worker@poshanmitra.org | Password: worker123

**Admin Demo**
- Email: admin@poshanmitra.org | Password: admin123

**Parent Demo**
- Email: parent@poshanmitra.org | Password: parent123

After seeding, demo data includes centres, pseudonymous children (CH-BLR-001/004), measurements, follow-up tasks, food catalog (25+), nutrition lessons (10).

---

## 12. How It Works (Step-by-Step)

1. **Landing** (/): Intro, daily nutrition tip, TTS
2. **Language Toggle:** EN/HI/KN (persists)
3. **Worker Login** (1-Click) ? Dashboard (/dashboard): KPIs + "Demo Mode: Fictional Data" badge
4. **Meal Planner** (/meal-planner): Set ? budget + family size + diet ? Generate ? balanced meal, shopping list, costs, steps, Print
5. **Poshan Play** (/poshan-play): Picture Quiz, Build Rainbow Plate, Sort & Match (anonymous, TTS, stars)
6. **Growth Monitoring** (/growth-monitoring): Select child ? enter weight/height/date ? WHO 2006 Z-scores + flags + Recharts + Create Follow-Up
7. **Follow-Ups** (/follow-ups): Track PENDING/IN_PROGRESS/COMPLETED, resolve with notes
8. **Impact Reports** (/impact-reports): Aggregate KPIs + charts + CSV export
9. **Education/Resources**: Nutrition Education, Food Guide, Govt Schemes, Parent Resources

## 13. API Endpoints Overview

Core REST API under `/api`. Protected routes require `Authorization: Bearer <token>` + RBAC.

| Module | Auth | Key Endpoints | Notes |
|---|---|---|---|
| Auth | Public | POST `/auth/login`, POST `/auth/register`, GET `/auth/me` | bcrypt + JWT |
| Children | Protected | GET/POST/PUT/DELETE `/children` | Pseudonymous IDs |
| Growth | Protected | POST `/growth/measurements`, GET `/growth/children/:id/measurements`, GET `/growth/children/:id/trends` | WHO 2006 engine |
| Meal Plans | Protected/Public (read) | POST `/meal-plans/generate`, GET `/meal-plans/foods` | Rule-based, local |
| Tasks/Follow-ups | Protected | GET/POST/PATCH `/tasks`, PATCH `/tasks/:id/complete` | RBAC by role/centre |
| Lessons | Protected/Public | GET `/lessons` (multilingual) | 10 lessons |
| Food Guide | Protected/Public | GET `/food` | 25+ foods |
| Reports | Protected | GET `/reports/summary`, GET `/reports/aggregate` | Aggregate-only |
| Health | Public | GET `/health` | Service health |

Full details: see backend route/controller files.

---

## 14. Testing

**Total: 15/15 tests passing (100%)**

| Suite | Count | What |
|---|---|---|
| WHO Growth Standards (`backend/tests/whoGrowthStandards.test.ts`) | 5 | Age interpolation, normal, moderate underweight, severe wasting, invalid inputs |
| API Integration (`backend/tests/api.test.ts`) | 7 | Health, demo accounts, JWT login, RBAC protection, meal plan generation |
| Translations (`frontend/src/__tests__/translations.test.ts`) | 3 | EN/HI/KN dictionary key parity (100%) |

**Run Tests:**
```bash
# Root or backend
cd backend && npm test        # Vitest
cd frontend && npm test       # Vitest
```

---

## 15. Security & Data Privacy

- **Authentication:** JWT, bcrypt (configurable rounds)
- **Authorization:** RBAC (ADMIN/WORKER/PARENT), route-level middleware
- **Validation:** Zod on all inputs
- **Hardening:** Helmet (security headers), CORS restrictions
- **Privacy:** Child pseudonymization (CH-XXX-XXX), no Aadhaar/biometrics, no PII in Poshan Play
- **Audit:** AuditLog for sensitive operations (create/modify measurements/tasks, child ops)
- **Data Minimization:** Aggregate-only exports, no identifiable data in reports/CSV
- **Ethics:** Screening decision-support; clear disclaimers; demo mode labeling
- **Secrets:** Never committed; use .env, rotate JWT_SECRET in prod

---

## 16. Deployment

**Frontend (Static):** Vercel/Netlify (build `npm run build`, dist). Use `VITE_API_BASE_URL` to point to backend.  
**Backend (API):** Render/Railway/Fly.io/EC2 (build+start). Set `DATABASE_URL` (Postgres), `JWT_SECRET`, `CORS_ORIGIN` to frontend URL.  
**Docker:** `docker-compose up --build` (full stack). `frontend/nginx.conf` serves static + proxies `/api` in containerized setups.

---

## 17. Future Enhancements

- Predictive growth faltering (time-series forecasting) with explainability
- Offline-first data sync (queue measurements/tasks when offline)
- Regional food DB expansion + seasonality
- ANM/ASHA referral workflow + SMS/WhatsApp notifications
- Role-based dashboards (block/PHC level)
- OCR for paper growth cards
- Accessibility: screen reader, larger fonts, high-contrast

---

## 18. References

- [WHO Child Growth Standards (2006)](https://www.who.int/tools/child-growth-standards)
- [POSHAN Abhiyaan 2.0 (MoHFW, Govt. of India)](https://poshanabhiyaan.gov.in/)
- [ICDS Scheme](https://icds.gov.in/)
- [Nutrient Requirements (ICMR-NIN)](https://www.nin.res.in/)

---

*POSHAN-MITRA: Empowering frontline heroes to nurture healthier children—practical, affordable, multilingual, and privacy-first.*
