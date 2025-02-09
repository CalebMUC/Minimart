import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import packageInfo from "../../package.json";
import "../../src/Login.css";
import { cartContext } from "./CartContext";
import { UserContext } from "./UserMainContext";

function Login() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { updateUser } = useContext(UserContext);
  const { GetCartItems } = useContext(cartContext);

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

    try {
      const response = await fetch(packageInfo.urls.Login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        if(data.responseCode == 200){
            
            // Update user and local storage
            updateUser(data.userName);
            localStorage.setItem("token", data.token);
            localStorage.setItem("userID", data.userID);
            localStorage.setItem("username", data.username);
            localStorage.setItem("userRole", data.UserRole);
        }


        const isAuthenticated = await verifyAuthentication(data.token);

        if (isAuthenticated) {
          const redirectPath = location.state?.from?.pathname || "/";
          await GetCartItems(); // Update cart count after login
          navigate(redirectPath);
        } else {
          setErrorMessage("Authentication failed. Please try again.");
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
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

  return (
    <section className="login-container">
      <div className="login-form">
        <div className="login-header">
          <div className="logo">
            <img src="../images/shopping-bag.png" alt="Logo" />
          </div>
          <div className="details">
            <h2>Welcome to Minimart</h2>
            <p>Enter your credentials to login or sign up to create an account.</p>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-input-field">
            <input
              type="text"
              name="emailOrPhone"
              placeholder="Enter Email or Phone Number"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              required
            />
            {errors.emailOrPhone && <div className="error">{errors.emailOrPhone}</div>}
          </div>

          <div className="form-input-field password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <span className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <div className="error">{errors.password}</div>}
          </div>

          {errorMessage && <div className="response-div">{errorMessage}</div>}

          <div className="form-button">
            <button type="submit" disabled={Object.values(errors).some((error) => error)}>
              Login
            </button>
          </div>
        </form>

        <div className="form-links">
          <a href="#">Forgot my password</a>
          <p>
            Don't have an account? <a href="/register">Sign Up</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
