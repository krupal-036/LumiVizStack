import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user
    const user = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (!user) {
      setErrors({ general: "Invalid email or password" });
      return;
    }

    // Set current user session
    localStorage.setItem("user", JSON.stringify({ name: user.name, email: user.email }));

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black pt-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-300
                   max-w-[340px] w-full mx-4 md:p-6 p-4 py-8 text-left text-sm
                   rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-9 text-center text-gray-800 dark:text-white">
          Welcome Back
        </h2>

        {/* General Error Message */}
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {errors.general}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <div className={`flex items-center border rounded gap-2 pl-2 bg-indigo-500/5 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
            <FiMail className="text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full outline-none bg-transparent py-2.5 text-gray-800 dark:text-gray-100"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <div className={`flex items-center border rounded gap-2 pl-2 bg-indigo-500/5 ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
            <FiLock className="text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full outline-none bg-transparent py-2.5 text-gray-800 dark:text-gray-100"
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="accent-indigo-500"
            />
            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="text-blue-500 hover:underline"
          >
            Forgot Password
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90
                     transition py-2.5 rounded text-white font-medium
                     active:scale-95"
        >
          Log In
        </button>

        <p className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}