import React, { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import packageInfo from "../../package.json";
import { cartContext } from "./CartContext";
import { UserContext } from "./UserMainContext";
import { UserLogin } from "../Data";


function Login() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState('');
  

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { updateUser } = useContext(UserContext);
  const { GetCartItemsAsync } = useContext(cartContext);

  const redirectMessage = location.state?.successMessage;

  // Regex for email or phone validation
  const emailOrPhoneRegex = /^(\d{10}|[^\s@]+@[^\s@]+\.[^\s@]+)$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "emailOrPhone") {
      setErrors((prev) => ({
        ...prev,
        emailOrPhone: emailOrPhoneRegex.test(value)
          ? ""
          : "Enter a valid email address or phone number",
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: value.length >= 8 ? "" : "Password must be at least 8 characters long",
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // const response = await fetch(packageInfo.urls.Login, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });

      const response = await UserLogin(formData);

      
        

        if (response.responseCode == 200) {
          // Update user and local storage
          updateUser(response.userName);

          localStorage.setItem("token", response.token);
          localStorage.setItem("userID", response.userID);
          localStorage.setItem("username", response.username);
          localStorage.setItem("userRole", response.userRole);

          setSuccessMessage(response.responseMessage);
          setShowSuccessDialog(true);
        }

        const isAuthenticated = await verifyAuthentication(response.token);

        if (isAuthenticated) {
          const redirectPath = location.state?.from?.pathname || "/";
          await GetCartItemsAsync(); // Update cart count after login
          navigate(redirectPath);
        } else {
          setErrorMessage("Authentication failed. Please try again.");
        }
     
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyAuthentication = async (token) => {
    try {
      const response = await fetch(packageInfo.urls.WeatherForecast, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (err) {
      console.error("Error verifying token:", err);
      return false;
    }
  };

  const handleCloseDialog = () =>{
    setErrorMessage(false);
    setSuccessMessage(false);
    setShowSuccessDialog(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* {showSuccessDialog && (
        <Dialogs 
          message={successMessage} 
          type="success"
          onClose={handleCloseDialog}
        />
      )} */}

          {redirectMessage && (
                <div className="p-3 bg-green-50 text-green-600 rounded-lg mb-4">
                    {redirectMessage}
                </div>
            )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
            <img 
              src="../images/shopping-bag.png" 
              alt="Logo" 
              className="w-10 h-10"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Minimart
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your credentials to login or sign up to create an account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="flex flex-col space-y-6" onSubmit={handleLogin}>
            {/* Email/Phone Field */}
            <div>
              <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700">
                Email or Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="emailOrPhone"
                  name="emailOrPhone"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  placeholder="Enter Email or Phone Number"
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                />
              </div>
              {errors.emailOrPhone && (
                <p className="mt-2 text-sm text-red-600">{errors.emailOrPhone}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm pr-10"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/Authorization/PasswordResetFlow"
                  className="font-medium text-yellow-600 hover:text-yellow-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || Object.values(errors).some(error => error)}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                } ${
                  Object.values(errors).some(error => error) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/Authorization/RegistrationFlow"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;