import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, Zap } from "lucide-react";

// Get base URL from environment variable
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const COOLDOWN_DURATION = 30; // 30 seconds cooldown

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);

  // Parse the emailPreviewUrl from localStorage, handling all edge cases
  const emailPreviewUrl = (() => {
    const storedUrl = localStorage.getItem("emailPreviewUrl");
    if (!storedUrl || storedUrl === "undefined" || storedUrl === "null") {
      return "";
    }
    try {
      return JSON.parse(storedUrl);
    } catch (error) {
      console.error("Error parsing emailPreviewUrl:", error);
      return "";
    }
  })();

  const [url, setUrl] = useState(emailPreviewUrl);

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("email")
      ? JSON.parse(localStorage.getItem("email"))
      : null;
    if (storedEmail) {
      try {
        setEmail(storedEmail);
      } catch (error) {
        console.error("Error getting email:", error);
        navigate("/signup");
      }
    } else {
      navigate("/signup");
    }
  }, [navigate]);

  // Cooldown timer effect
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      if (pastedData.length < 6) {
        inputRefs.current[pastedData.length].focus();
      }
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("Resend OTP Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      // Start cooldown
      setCooldown(COOLDOWN_DURATION);
      console.log(data);

      localStorage.setItem("emailPreviewUrl", JSON.stringify(data.previewUrl));
      setUrl(data.previewUrl);
      // Show success message
      toast.success("Verification code resent successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all OTP digits are filled
    if (otp.some((digit) => !digit)) {
      toast.error("Please enter all 6 digits of the OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otp.join(""),
        }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify email");
      }

      // Show success message
      toast.success("Email verified successfully!");
      localStorage.removeItem("email");
      localStorage.removeItem("emailPreviewUrl");

      // Redirect to login page
      navigate("/login");
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
              Verify Your Email
            </h1>

            <div className="mb-4">
              <p className="text-sm inline mr-2 text-gray-600">
                You can see your otp on this link only in development mode-
              </p>
              <a
                className="font-bold cursor-pointer text-green-600"
                target="_blank"
                href={url}
                rel="noopener noreferrer"
              >
                Click here
              </a>
            </div>

            <p className="text-gray-600">
              We've sent a verification code to{" "}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Enter Verification Code
              </label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl ${
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
                  Verifying...
                </span>
              ) : (
                "Verify Email"
              )}
            </button>

            {/* Resend Code Link */}
            <div className="text-center">
              <span className="text-gray-600">Didn't receive the code? </span>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={cooldown > 0 || isResending}
                className={`text-blue-600 cursor-pointer hover:text-blue-700 font-medium ${
                  cooldown > 0 || isResending
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isResending ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
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
                    Resending...
                  </span>
                ) : cooldown > 0 ? (
                  `Resend Code (${cooldown}s)`
                ) : (
                  "Resend Code"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="p-6 lg:flex flex-1">
        <div className="hidden rounded-2xl lg:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-12">
          <div className="text-start text-white max-w-lg">
            <h2 className="text-4xl font-semibold italic mb-6">
              Secure your account with email verification
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Enter the 6-digit code sent to your email to complete the
              verification process.
            </p>

            {/* Email Icon */}
            <div className="flex justify-center">
              <Mail className="w-32 h-32 text-blue-200" />
            </div>
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

export default VerifyEmail;
