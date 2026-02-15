import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing again
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user already exists
    const userExists = existingUsers.find((u) => u.email === formData.email);
    if (userExists) {
      setErrors({ email: "User with this email already exists" });
      return;
    }

    // Create new user object
    const newUser = {
      id: Date.now(),
      name: formData.username,
      email: formData.email,
      password: formData.password, // Note: In a real app, never store plain text passwords
    };

    // Save to users list
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    // Auto-login: Set current user session
    localStorage.setItem("user", JSON.stringify({ name: newUser.name, email: newUser.email }));

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black pt-0">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-300
                   max-w-[340px] w-full mx-4 md:p-6 p-4 py-8 text-left text-sm
                   rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-9 text-center text-gray-800 dark:text-white">
          Sign Up
        </h2>

        {/* Username */}
        <div className="mb-4">
          <div className={`flex items-center border rounded gap-2 pl-2 bg-indigo-500/5 ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
            <FiUser className="text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full outline-none bg-transparent py-2.5 text-gray-800 dark:text-gray-100"
            />
          </div>
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

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
        <div className="mb-6">
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600
                     transition-all active:scale-95 py-2.5 rounded
                     text-white font-medium"
        >
          Create Account
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}