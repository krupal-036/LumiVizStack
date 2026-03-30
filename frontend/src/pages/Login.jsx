import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation, redirect } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiAlertCircle, FiLogIn, FiLoader } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { useAlert, useTitle } from "../hooks/customHooks";
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();
  const { login } = useContext(AuthContext);

  const redirectError = location.state?.error;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  useTitle("Login");
  useEffect(() => {
    if (redirectError) {
      showAlert(redirectError, "Authentication Required", 1);
    }
  }, [redirectError]);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getFieldError = (name, value) => {
    const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/;

    if (name === "email") {
      if (!value) return "Email is required";
      if (!emailRegex.test(value)) return "Email address is invalid";
    }

    if (name === "password") {
      if (!value) return "Password is required";
      if (value.length < 8) return "Must be at least 8 characters";
      if (!/[A-Z]/.test(value)) return "Include at least one uppercase letter";
      if (!/[a-z]/.test(value)) return "Include at least one lowercase letter";
      if (!/[0-9]/.test(value)) return "Include at least one number";
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Include at least one special symbol";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.length > 0) {
      const fieldError = getFieldError(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const clearError = (sec) => {
    setTimeout(() => {
      setErrors({});
    }, sec * 1000);
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = getFieldError(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        showAlert(data?.message || text || "Server not Available. Please try again later.", "Server Error", 1);
      }

      if (!response.ok) {
        if (data?.message?.toLowerCase().includes("email")) {
          setErrors({ email: data?.message });
          clearError(3);
        } else if (data?.message?.toLowerCase().includes("password")) {
          setErrors({ password: data.message });
          clearError(3);
        } else {
          showAlert(data?.error || data?.message || "Invalid credentials....", "Validation Error");
          clearError(3);
        }
        return;
      }
      login(data.token);
      const from = location.state?.from || "/";
      navigate(from, { replace: true });

    } catch (error) {
      showAlert(error?.message || "Unable to connect to server.", "Server Error");
      clearError(3);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full md:min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0f172a] pt-24 p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 py-6 px-4 md:p-8 rounded-3xl shadow-xl shadow-gray-200/60 dark:shadow-none"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-500/20">
              <FiLogIn className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="space-y-2">
            <div className={errors.email ? "animate-shake" : ""}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Email Address
              </label>
              <div className={`group flex items-center bg-gray-100 dark:bg-gray-900/50 border-2 transition-all rounded-xl px-4 py-3 
                ${errors.email
                  ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20'
                  : 'border-transparent focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-gray-900'
                }`}>
                <FiMail className={`shrink-0 transition-colors ${errors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-indigo-500'}`} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none px-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium"
                />
                {errors.email && <FiAlertCircle className="text-red-500 shrink-0" />}
              </div>
              <div className="min-h-[24px] mt-1 ml-1">
                {errors.email && (
                  <p className="text-red-600 dark:text-red-400 text-xs font-bold animate-in fade-in animate-slide-down">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className={errors.password ? "animate-shake" : ""}>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className={`group flex items-center bg-gray-100 dark:bg-gray-900/50 border-2 transition-all rounded-xl px-4 py-3 
                ${errors.password
                  ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20'
                  : 'border-transparent focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-gray-800'
                }`}>
                <FiLock className={`shrink-0 transition-colors ${errors.password ? 'text-red-500' : 'text-gray-400 group-focus-within:text-indigo-500'}`} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none px-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium"
                />
                {errors.password && <FiAlertCircle className="text-red-500 shrink-0" />}
              </div>
              <div className="min-h-[24px] mt-1 ml-1">
                {errors.password && (
                  <p className="text-red-600 dark:text-red-400 text-xs font-bold animate-in fade-in animate-slide-down">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 
                       text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none 
                       transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <FiLoader className="animate-spin h-5 w-5 text-white" />
                Logging in...
              </span>
            ) : (
              <>
                Log In <FiArrowRight className="text-lg" />
              </>
            )}
          </button>

          <p className="text-center mt-6 text-gray-500 dark:text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
