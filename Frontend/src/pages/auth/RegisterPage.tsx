import { useState } from "react";
import AuthLayout from "./AuthLayout";
import api from "~/config/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import OtpVerification from "./OTPVerification";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default () => {
  const [userType, setUserType] = useState<string>("mentee");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showOtpVerification, setShowOtpVerification] = useState<boolean>(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Check for multiple spaces
    if (inputValue.includes("  ")) {
      setNameError("Please use only one space between name parts");
      return;
    }
    setNameError("");
    setName(inputValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    
    // Validate name before submission
    if (name.includes("  ")) {
      setNameError("Please use only one space between name parts");
      return;
    }
    
    // Validate password before submission
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    
    setIsSubmitting(true);
    try {
      // First validate the registration data
      const userData = {
        name: name.trim(), // Trim any leading/trailing spaces
        email,
        password,
        userType,
      };
      
      console.log("Validating registration data:", userData);
      
      // First register the user
      try {
        // Register the user first
        console.log("Attempting to register user with data:", userData);
        const registerResponse = await api.post("/auth/register/raw", userData, { timeout: 8000 });
        
        if (registerResponse && registerResponse.status === 200) {
          console.log("Registration successful. Response:", registerResponse.data);
          // Store registration data for reference
          setRegistrationData(userData);
          toast.success("Account created successfully!");
          
          // Navigate to login page
          setTimeout(() => {
            navigate("/auth/login");
          }, 1000);
        }
      } catch (error: any) {
        console.error("Registration failed. Full error:", error);
        console.error("Error response:", error.response?.data);
        
        let errorMessage = 
          error?.response?.data?.detail || 
          error?.message || 
          "Registration failed. Please try again.";
        
        // Remove technical error prefix if present
        if (errorMessage.includes("Database error: 400:")) {
          errorMessage = errorMessage.replace("Database error: 400:", "").trim();
        }
        
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Registration validation failed:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>
        <select
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUserType(e.target.value)}
          value={userType}
          disabled={isSubmitting}
        >
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
        </select>
        <input
          type="text"
          placeholder="Full Name (First Name Father's Name Last Name)"
          className={`w-full p-3 mb-4 border ${
            nameError ? 'border-red-500' : 'border-gray-300'
          } rounded-lg bg-white focus:ring-2 focus:ring-blue-500`}
          value={name}
          onChange={handleNameChange}
          disabled={isSubmitting}
          required
          minLength={2}
        />
        {nameError && (
          <p className="text-red-500 text-sm mb-2">{nameError}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
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
            disabled={isSubmitting}
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
        <div className="text-sm text-gray-600 mb-4">
          Password requirements:
          <ul className="list-disc pl-5 mt-1">
            <li>Minimum 8 characters</li>
            <li>At least one uppercase letter (A-Z)</li>
            <li>At least one lowercase letter (a-z)</li>
            <li>At least one number (0-9)</li>
            <li>At least one special character (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
            <li>No spaces allowed</li>
          </ul>
        </div>
        <button
          type="submit"
          className={`w-full p-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : `Register as ${userType}`}
        </button>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};