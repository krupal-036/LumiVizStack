// frontend/src/App.tsx
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AlertProvider } from "./context/AlertContext";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import BackToTop from "./components/common/BackToTop";
import ScrollToTop from "./components/common/ScrollToTop";
import Loader from "./components/common/Loader";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/Register"));
const About = lazy(() => import("./pages/About"));
const Guide = lazy(() => import("./pages/Guide"));
const ApiDocs = lazy(() => import("./pages/ApiDocs"));
const Visualizer = lazy(() => import("./pages/Visualizer"));
const History = lazy(() => import("./pages/History"));
const PublicView = lazy(() => import("./pages/PublicView"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
    </div>
);

const App = () => {
    return (
        <ThemeProvider>
            <AlertProvider>
                <AuthProvider>
                    <Router>
                        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-100 transition-colors">
                            <ScrollToTop />
                            <Navbar />
                            <main className="grow w-full">
                                <Suspense fallback={<PageLoader />}>
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
                                        <Route
                                            path="/profile"
                                            element={
                                                <ProtectedRoute>
                                                    <UserProfile />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route path="*" element={<NotFound />} />
                                    </Routes>
                                </Suspense>
                            </main>
                            <Footer />
                            <BackToTop />
                        </div>
                    </Router>
                </AuthProvider>
            </AlertProvider>
        </ThemeProvider>
    );
};

export default App;
