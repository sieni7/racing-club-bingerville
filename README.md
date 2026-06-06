
# 🏟️ Racing Club de Bingerville
[](https://github.com/your-org/racing-club/actions)
[](https://chatgpt.com/c/6a229312-967c-83ea-a4fa-ef2d7ced3a2d)
[](https://chatgpt.com/c/6a229312-967c-83ea-a4fa-ef2d7ced3a2d)
[](https://chatgpt.com/c/6a229312-967c-83ea-a4fa-ef2d7ced3a2d)
[](https://chatgpt.com/c/6a229312-967c-83ea-a4fa-ef2d7ced3a2d)

---

## 📌 Overview
**Racing Club Bingerville** is a modular monorepo football management platform featuring:

- Player management system
- Match scheduling & event tracking
- Real-time statistics engine (event-driven)
- News & content module
- Authentication system (JWT + refresh rotation)
- Governance layer (architecture enforcement + debt control)

👉 Architecture: **Event-Driven Modular Monolith**

---

## 🧠 Architecture

```
Frontend (React + Vite + RTK Query)
        │
        ▼
Backend (Express / Node.js)
        │
        ├── Controllers (HTTP orchestration only)
        ├── Services (business logic)
        ├── EventBus (domain events)
        ├── Listeners (Stats, future notifications)
        └── MongoDB (Atlas)
```

### 🔥 Core Design Principles

- No business logic in controllers
- No direct StatsService calls (event-only)
- Domain events for cross-module communication
- Strict separation of concerns
- Governance enforced via CI rules

---

## 📁 Project Structure

```
/frontend        → React app (Vite)
/backend         → Node.js API (Express)
/shared          → Shared types & Zod schemas
/sprint_report   → Historical sprint validation reports
/docs            → Technical documentation
```

---

## ⚙️ Installation

```
# Clone repository
git clone https://github.com/your-org/racing-club.git
cd racing-club

# Install dependencies (monorepo)
npm install
```

---

## 🚀 Running the Project

### Development

```
npm run dev
```
Runs:

- Frontend (Vite)
- Backend (Express)
- Shared types sync

---

### Build

```
npm run build
```

---

### Test

```
npm run test
npm run test:coverage
```

---

### Lint

```
npm run lint
```

---

## 🔐 Environment Variables
Copy `.env.example` → `.env`

### Backend

```
NODE_ENV=production
PORT=3001

MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
REFRESH_SECRET=your_refresh_secret

CORS_ORIGIN=https://your-frontend.netlify.app
```

### Frontend

```
VITE_API_URL=https://your-api.onrender.com/api/v1
```

---

## 📡 API Documentation
Base URL:

```
/api/v1
```

### Health Check

```
GET /api/health
```

---

### Users

```
GET /users
GET /users/:id
```

---

### Players

```
GET /joueurs?status=ACTIF
POST /joueurs
PUT /joueurs/:id
DELETE /joueurs/:id
```

---

### Matches

```
GET /matchs
POST /matchs
```

---

### Stats (event-driven)

- Automatically computed via domain events
- No direct writes allowed

---

## 📊 Architecture Evolution (Sprints)
SprintModuleStatus0Foundations✅1Backend Core✅2Authentication✅3Frontend✅4Players Module✅5Matches Module✅5.5Governance Layer✅5.6Debt Remediation✅6Stats + News✅6.1Domain Event Layer✅
---

## 🧩 Event-Driven System

### Example Flow

```
Match Completed
      ↓
Domain Event Emitted
      ↓
EventBus Dispatch
      ↓
StatsListener Triggered
      ↓
Stats Updated (idempotent)
```

---

## 🛡️ Governance Layer
Enforced rules:

- ❌ No direct StatsService usage
- ❌ No `any` types
- ❌ No DB access in controllers
- ✅ Zod validation required
- ✅ Debt score MetricValueTest Coverage~86% backendDebt Score3CI StatusGreenArchitectureEvent-drivenProduction Ready✅
---

## 🌍 Deployment

### Stack

- Frontend: Netlify
- Backend: Render / Railway
- Database: MongoDB Atlas

### Deploy flow

```
GitHub → CI → Build → Deploy Backend → Deploy Frontend
```

---

## 📂 Reports
Sprint reports:

```
/sprint_report/
```
Includes:

- Architecture validation
- Security audit
- Governance checks
- Delivery decisions

---

## 🧪 Key Commands

```
npm run dev              # Dev mode
npm run build            # Build all
npm run test             # Run tests
npm run lint             # Lint check
npm run governance:full  # Architecture rules check
```

---

## 🚀 Roadmap

### Next releases

- Sprint 7 → Pre-deployment audit (DONE)
- Sprint 8 → Production deployment
- Sprint 9 → Monitoring (logs + metrics)
- Sprint 10 → Notifications (email/webhooks)
- Sprint 11 → Real-time (WebSockets)

---

## 📜 License
UNLICENSED

---

## 👤 Maintainer
Racing Club Bingerville Engineering Team

---

# ⚡ Résultat
Tu as maintenant un README :

- niveau **startup + enterprise**
- compatible **GitHub OSS propre**
- lisible CTO / Dev / DevOps
- aligné avec ton architecture event-driven
- prêt pour recrutement / audit / production

---
Si tu veux, prochaine étape logique :

👉 je peux te générer :

- `CONTRIBUTING.md`
- `ARCHITECTURE.md` ultra détaillé (niveau Google/Netflix)
- ou un **GitHub repo complet template prêt à cloner (monorepo clean)**


