import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import dashboard from "../assets/illustration.png";

// Get base URL from environment variable
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

// Validation schema
const signupSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must not exceed 50 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)"
    ),
});

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear field-specific error when user types
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = async () => {
    try {
      await signupSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const isValid = await validateForm();
    if (!isValid) {
      // Show first error in toast
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }

    setIsLoading(true);

    try {
      // Process form data
      const processedData = {
        ...formData,
        email: formData.email.toLowerCase().trim(),
        name: formData.fullName.trim(),
      };

      // Make API call
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      // Show success message

      localStorage.setItem(
        "emailPreviewUrl",
        JSON.stringify(data.data.emailPreviewUrl)
      );
      localStorage.setItem("email", JSON.stringify(data.data.email));

      toast.success("Account created successfully!");

      // Redirect to login page
      navigate("/verify");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Sellora</span>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Enter your details to create your account.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Full Name Input */}
            <div className="relative min-h-[88px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User
                    className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === "fullName"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  onFocus={() => setFocusedField("fullName")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 outline-none ${
                    focusedField === "fullName"
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : errors.fullName
                      ? "border-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="John Doe"
                  required
                />
                {errors.fullName && (
                  <p className="absolute mt-1 text-sm text-red-500">
                    {errors.fullName}
                  </p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div className="relative min-h-[88px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === "email"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 outline-none ${
                    focusedField === "email"
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : errors.email
                      ? "border-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="john@company.com"
                  required
                />
                {errors.email && (
                  <p className="absolute mt-1 text-sm text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="relative min-h-[88px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === "password"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg transition-all duration-200 outline-none ${
                    focusedField === "password"
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : errors.password
                      ? "border-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="absolute mt-1 text-sm text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-600"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 cursor-pointer hover:text-blue-700 font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="p-6 lg:flex flex-1">
        <div className="hidden rounded-2xl lg:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-12">
          <div className="text-start text-white max-w-lg">
            <h2 className="text-4xl font-semibold italic mb-6">
              Effortlessly manage your team and operations.
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Sign up to access your CRM dashboard and manage your team.
            </p>

            {/* Dashboard Mockup */}
            <img src={dashboard} alt="" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-8 text-sm text-gray-500">
        Copyright © 2025 Sellora Enterprises LTD.
      </div>
      <div className="absolute bottom-4 right-8 text-sm text-gray-500">
        <a href="#" className="hover:text-gray-700">
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default SignupPage;
