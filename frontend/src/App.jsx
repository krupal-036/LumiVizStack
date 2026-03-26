import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PublicView from "./pages/PublicView";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import About from "./pages/About";
import Login from "./pages/Login";
import SignUp from "./pages/Register";
import Visualizer from "./pages/Visualizer";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import Guide from "./pages/Guide";
import ApiDocs from "./pages/ApiDocs.jsx";
import UserProfile from "./pages/UserProfile";
import BackToTop from "./components/common/BackToTop";
import { AlertProvider } from './context/AlertContext';

function App() {
  return (
    <ThemeProvider>
      <AlertProvider>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-100 transition-colors duration-200">
              <Navbar />
              <main className="grow w-full">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<SignUp />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/guide" element={<Guide />} />
                  <Route path="/docs/api" element={<ApiDocs />} />

                  <Route
                    path="/visualize"
                    element={
                      <ProtectedRoute>
                        <Visualizer />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <History />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/view/:historyId" element={<PublicView />} />

                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    }
                  />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <BackToTop />
            </div>
          </Router>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
