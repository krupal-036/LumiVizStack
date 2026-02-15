```
lumivizstack/
├── client/ # Frontend (React + Vite + Tailwind)
│ ├── public/ # Static assets
│ ├── src/
│ │ ├── assets/ # Images, fonts, icons
│ │ │ └── logo.svg
│ │ │
│ │ ├── components/ # Reusable UI Components
│ │ │ ├── layout/ # Structural components
│ │ │ │ ├── Navbar.jsx # (See code below)
│ │ │ │ ├── Footer.jsx
│ │ │ │ └── Sidebar.jsx
│ │ │ ├── common/ # Generic UI elements
│ │ │ │ ├── Button.jsx
│ │ │ │ ├── Modal.jsx
│ │ │ │ ├── Loader.jsx # Loading indicators
│ │ │ │ └── Toast.jsx # Error/Success messages
│ │ │ └── visualizations/ # Specific Chart Components
│ │ │ ├── BarChart.jsx
│ │ │ ├── LineChart.jsx
│ │ │ ├── TableView.jsx
│ │ │ └── CardView.jsx
│ │ │
│ │ ├── pages/ # Route Pages
│ │ │ ├── Dashboard.jsx # Home/Landing
│ │ │ ├── Visualizer.jsx # Main creation interface
│ │ │ ├── History.jsx # Saved visualizations list
│ │ │ ├── Login.jsx
│ │ │ └── Register.jsx
│ │ │
│ │ ├── context/ # Global State Management (Context API)
│ │ │ ├── AuthContext.jsx # User state & token management
│ │ │ ├── ThemeContext.jsx # Light/Dark mode toggle
│ │ │ └── VizContext.jsx # Visualization settings state
│ │ │
│ │ ├── hooks/ # Custom React Hooks
│ │ │ ├── useFetch.js # API calling wrapper
│ │ │ └── useTheme.js # Hook for dark mode
│ │ │
│ │ ├── services/ # Frontend API calls
│ │ │ └── api.js # Axios setup with interceptors
│ │ │
│ │ ├── utils/ # Frontend Helpers
│ │ │ ├── dataParser.js # Logic to parse pasted JSON
│ │ │ └── chartUtils.js # Configs for chart libraries
│ │ │
│ │ ├── App.jsx # Main App component with Routes
│ │ ├── index.css # Tailwind directives
│ │ └── main.jsx # React DOM entry point
│ │
│ ├── tailwind.config.js # Tailwind configuration
│ ├── package.json
│ └── vite.config.js # Vite configuration
├── server/  
│ ├── src/
│ │ ├── config/ # Environment variables and database connection
│ │ │ ├── db.js # MongoDB/PostgreSQL connection logic
│ │ │ └── keys.js # JWT Secret and API keys
│ │ │
│ │ ├── controllers/ # Logic for handling requests
│ │ │ ├── authController.js # Login, Register, Logout
│ │ │ ├── vizController.js # Save, Load, Delete Visualizations
│ │ │ └── dataController.js # Handle JSON input, API fetching, Validation
│ │ │
│ │ ├── middleware/ # Express middleware
│ │ │ ├── authMiddleware.js # Verify JWT tokens
│ │ │ ├── errorMiddleware.js # Centralized error handling
│ │ │ ├── rbacMiddleware.js # Role-based access control
│ │ │ └── validateRequest.js # Request body validation (Joi/Zod)
│ │ │
│ │ ├── models/ # Database Schemas (Mongoose/Sequelize)
│ │ │ ├── User.js # User schema (credentials, roles)
│ │ │ └── Visualization.js # Viz config schema (data, type, filters)
│ │ │
│ │ ├── routes/ # API Endpoints
│ │ │ ├── authRoutes.js # /api/auth
│ │ │ ├── vizRoutes.js # /api/visualizations
│ │ │ └── dataRoutes.js # /api/data (validation endpoint)
│ │ │
│ │ ├── services/ # Business Logic (Reusable functions)
│ │ │ ├── jsonParserService.js # Validates JSON structure
│ │ │ ├── chartEngine.js # Auto-detects chart type logic
│ │ │ └── exportService.js # Image/JSON export logic
│ │ │
│ │ ├── utils/ # Helper functions
│ │ │ ├── ApiError.js # Custom error class
│ │ │ └── responseFormatter.js # Standard API response structure
│ │ │
│ │ └── app.js # App entry point & Express configuration
│ │
│ ├── .env # Environment variables
│ ├── package.json
│ └── server.js # Server startup script # Backend (Node.js + Express)
├── .gitignore # Git ignore file
├── README.md # Project documentation
└── package.json # Workspace config (optional, for mono-repo)
```