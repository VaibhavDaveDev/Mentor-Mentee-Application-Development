import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AuthLayout from "./AuthLayout";
import api from "~/config/api";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default () => {
  const [userType, setUserType] = useState<string>("mentee");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }
    if (/\s/.test(password)) {
      return "Password cannot contain spaces";
    }
    return "";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    // Validate password before submission
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Attempting login with:", { email, userType });
      const response = await toast.promise(
        api.post("/auth/login/api", {
          email,
          password,
          userType,
        }),
        {
          loading: "Logging in...",
          success: (response) => {
            console.log("Login successful. Response:", response.data);
            const successMessage =
              response?.data?.message || "Logged in successfully.";
            return <b>{successMessage}</b>;
          },
          error: (error) => {
            console.error("Login error. Full error:", error);
            console.error("Error response:", error.response?.data);
            
            // Check for role mismatch error (403 status)
            if (error?.response?.status === 403) {
              return <b>{error.response.data.detail}</b>;
            }
            
            // Check for user not found error
            if (error?.response?.status === 404) {
              return <b>User not found. Please check your email and try again.</b>;
            }
            
            const errorMessage =
              error?.response?.data?.detail || 
              error?.response?.data?.error || 
              "Invalid credentials. Please try again.";
            return <b>{errorMessage}</b>;
          },
        }
      );

      if (response.status === 200 && response.data.access_token) {
        console.log("Login successful, saving token and user info");
        // Save the token
        localStorage.setItem("accessToken", response.data.access_token);
        
        // Save user info if available
        if (response.data.user) {
          localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        }
        
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        console.error("Login failed: Invalid response from server", response);
        toast.error("Login failed: Invalid response from server");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Log in
        </h2>
        <select
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUserType(e.target.value)}
          value={userType}
          disabled={isLoading}
        >
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`w-full p-3 mb-4 border ${
              passwordError ? 'border-red-500' : 'border-gray-300'
            } rounded-lg bg-white focus:ring-2 focus:ring-blue-500`}
            value={password}
            onChange={handlePasswordChange}
            disabled={isLoading}
            required
            minLength={8}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {passwordError && (
          <p className="text-red-500 text-sm mb-2">{passwordError}</p>
        )}
        <a
          href="/auth/forgot-password"
          className="text-blue-500 hover:underline text-sm"
        >
          Forgot your password?
        </a>
        <button
          type="submit"
          className={`w-full p-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : `Login as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
        </button>
        {userType !== "admin" && (
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/auth/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        )}
      </form>
    </AuthLayout>
  );
};
