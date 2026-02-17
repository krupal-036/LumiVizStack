// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import About from "./pages/About";
import Login from "./pages/Login";
import SignUp from "./pages/Register";
import Visualizer from "./pages/Visualizer";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-100 transition-colors duration-300">
            <Navbar />
            <main className="grow pt-16 w-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/about" element={<About />} />

                {/* PROTECTED ROUTES */}
                <Route
                  path="/visualize"
                  element={
                    <ProtectedRoute>
                      <Visualizer />
                    </ProtectedRoute>
                  }
                />
                {/* Fix: History now protected */}
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;