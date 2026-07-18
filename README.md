<div align="center">

<img src="https://img.shields.io/badge/LumiVizStack-JSON%20Visualizer-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6TTIgMTdsOSA1IDktNXYtNmwtOSA1LTktNXoiLz48L3N2Zz4=" alt="LumiVizStack"/>

# LumiVizStack

### Transform Data into Actionable Insights

**The fastest way to visualize complex JSON structures.**  
No configuration needed - just paste, connect, or upload your data.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-lumivizstack.vercel.app-6366f1?style=rounded-square&logo=vercel)](https://lumivizstack.vercel.app/)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-brightgreen?style=rounded-square&logo=mongodb)
![Last Commit](https://img.shields.io/github/last-commit/krupal-036/LumiVizStack?style=rounded-square)
![Repo Size](https://img.shields.io/github/repo-size/krupal-036/LumiVizStack?style=rounded-square)

![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=rounded-square&logo=react)
![Backend](https://img.shields.io/badge/Backend-Node.js-339933?style=rounded-square&logo=node.js)
![Framework](https://img.shields.io/badge/Framework-Express-000000?style=rounded-square&logo=express)
![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=rounded-square&logo=mongodb)

</div>

---

## 📌 Overview

**LumiVizStack** is a full-stack web application that converts raw JSON data into beautiful, interactive charts and visualizations. Built with the MERN stack, it supports multiple input methods, secure JWT authentication, visualization history, and public shareable links — all in one unified platform.

> Developed as part of the B.E. Computer Engineering final internship project at **Sal Engineering and Technical Institute, Ahmedabad** (Gujarat Technological University, 2025–26).

---

## ✨ Features

- **Multi-Source JSON Input** — Paste raw JSON, upload a `.json` file, or fetch from an external API URL
- **Interactive Visualizations** — Bar, Line, Area, and Pie charts with real-time rendering
- **Secure Authentication** — JWT-based login/register with bcrypt password hashing and 30-day token sessions
- **Role-Based Access Control (RBAC)** — Separate User and Admin roles with distinct permissions
- **Visualization History** — Save up to 10 visualizations per user; soft-delete support
- **Public Shareable Links** — Generate unique public URLs to share specific visualizations without login
- **Admin Panel** — Manage users, view system stats, configure login/signup access, and handle deletions
- **Credits System** — Usage tracked via a credit mechanism per visualization save
- **Responsive UI** — Clean, responsive design built with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer              | Technology                                         |
| ------------------ | -------------------------------------------------- |
| **Frontend**       | React, Tailwind CSS, React Router DOM, Recharts |
| **Backend**        | Node.js, Express.js                                |
| **Database**       | MongoDB, Mongoose ODM                              |
| **Authentication** | JSON Web Token (JWT), bcrypt                       |
| **Build Tool**     | Vite                                               |
| **Deployment**     | Vercel                                             |
| **Dev Tools**      | Postman, ESLint, VS Code, Git & GitHub             |

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/krupal-036/LumiVizStack.git
cd LumiVizStack
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGO_URI=mongodb_url
DB_NAME=your_database_name
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose_a_strong_password_here
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev:backend
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
mode=development
VITE_ENABLE_PROXY=true
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```text
LumiVizStack/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── components/
│   │   │   ├── Features.tsx
│   │   │   ├── common/
│   │   │   │   ├── AdminRoute.tsx
│   │   │   │   ├── BackToTop.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   └── SmartCell.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   └── visualizations/
│   │   │       ├── CardView.tsx
│   │   │       ├── ChartView.tsx
│   │   │       ├── FlowChart.tsx
│   │   │       ├── GraphView.tsx
│   │   │       ├── TableView.tsx
│   │   │       └── TreeView.tsx
│   │   ├── context/
│   │   │   ├── AlertContext.tsx
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/
│   │   │   ├── customHooks.tsx
│   │   │   ├── useFetch.ts
│   │   │   └── useTheme.ts
│   │   ├── pages/
│   │   │   ├── About.tsx
│   │   │   ├── AdminPanel.tsx
│   │   │   ├── ApiDocs.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Guide.tsx
│   │   │   ├── History.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── NotFound.tsx
│   │   │   ├── PublicView.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   └── Visualizer.tsx
│   │   └── utils/
│   │       ├── dataParser.ts
│   │       └── mockData.ts
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── public/
├── src/                    # Backend source
│   ├── index.ts
│   ├── config/
│   │   ├── config.ts
│   │   └── db.config.ts
│   ├── controllers/
│   │   ├── admin.controller.ts
│   │   ├── history.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/
│   │   ├── apiLimiter.ts
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   ├── healthCheck.middleware.ts
│   │   ├── requestLogger.middleware.ts
│   │   ├── serveFrontend.middleware.ts
│   │   ├── siteGuard.middleware.ts
│   │   └── validations/
│   │       ├── validateHistory.ts
│   │       ├── validateLogin.ts
│   │       ├── validateProfile.ts
│   │       └── validateRegister.ts
│   ├── models/
│   │   ├── History.model.ts
│   │   ├── SystemSettings.model.ts
│   │   └── User.model.ts
│   ├── repositories/
│   │   ├── history.repo.ts
│   │   ├── systemSettings.repo.ts
│   │   └── user.repo.ts
│   ├── routes/
│   │   ├── admin.routes.ts
│   │   ├── history.routes.ts
│   │   ├── profile.routes.ts
│   │   └── user.routes.ts
│   ├── services/
│   │   ├── admin.service.ts
│   │   ├── history.service.ts
│   │   └── user.service.ts
│   └── utils/
│       ├── passwordHandler.ts
│       ├── regex.ts
│       ├── responseHandler.ts
│       ├── seedAdmin.ts
│       ├── startDevServer.ts
│       └── tokenHandler.ts
├── .env_EXAMPLE
├── data.json
├── package.json
├── tsconfig.json
├── vercel.json
├── README.md
```

---

## 🔌 API Endpoints (Summary)

| Method | Endpoint                      | Description                     | Auth Required |
| ------ | ----------------------------- | ------------------------------- | ------------- |
| POST   | `/api/auth/register`          | Register new user               | ❌            |
| POST   | `/api/auth/login`             | Login & receive JWT             | ❌            |
| GET    | `/api/history`                | Get user's saved visualizations | ✅            |
| POST   | `/api/history`                | Save a new visualization        | ✅            |
| DELETE | `/api/history/:id`            | Soft-delete a visualization     | ✅            |
| GET    | `/api/history/share/:shareId` | Access public visualization     | ❌            |
| GET    | `/api/admin/users`            | List all users                  | ✅ Admin      |
| PATCH  | `/api/admin/settings`         | Toggle login/signup access      | ✅ Admin      |

> Rate limits: **5 requests/window** on auth routes, **100 requests/window** on all other routes.

---

## 🗃️ Database Schema

### `User`
```
username, email, password (hashed), credits, role (user/admin), isDeleted, createdAt
```

### `History`
```
userId (ref: User), title, type, data, rawInput, urlInput, inputType,
isPublic, shareId, isDeleted, createdAt
```

### `SystemSettings`
```
configName, isLoginEnabled, isSignupEnabled, createdAt
```

---

## ✅ Test Coverage

20 test cases verified covering registration, login, JSON validation, visualization save/share/delete, admin controls, rate limiting, credit enforcement, and access control. All tests passed.

---

## ⚠️ Limitations

- Supports structured JSON only (no CSV, XML, etc.)
- Maximum 10 saved visualizations per user (credit-based)
- Performance may degrade for very large JSON inputs
- Limited to 4 chart types (Bar, Line, Area, Pie)
- Requires internet connection for API URL input mode

---

## 🔮 Future Enhancements

- [ ] More chart types: flowcharts, treemaps, dashboards
- [ ] Real-time data streaming and live updates
- [ ] Collaborative visualization editing
- [ ] CSV / XML support in addition to JSON
- [ ] Pagination and data limiting for large datasets

---

## 👨‍💻 Author

**Krupal Fataniya**  
B.E. Computer Engineering — Enrollment No. `231263107010`  
Sal Engineering and Technical Institute, Ahmedabad  
Gujarat Technological University | Academic Year 2025–26

[![GitHub](https://img.shields.io/badge/GitHub-krupal--036-181717?style=for-the-badge&logo=github)](https://github.com/krupal-036)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/krupal-fataniya)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-000000?style=for-the-badge&logo=vercel)](https://krupal.vercel.app)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail)](mailto:krupalfataniya007@gmail.com)

---

<div align="center">

© 2026 LumiVizStack · Built with precision for developers.

⭐ If you found this useful, please consider starring the repository!

</div>
