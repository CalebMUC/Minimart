import React, { useContext, useState } from 'react';
import { useNavigate,useLocation} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import packageInfo from "../../package.json";
import '../../src/Login.css';
import { cartContext } from "./CartContext";
import { UserContext } from "./UserMainContext";
import { buildQueries } from '@testing-library/react';



function Login() {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Regex for validation
  const emailOrPhoneRegex = /^(\d{10}|[^\s@]+@[^\s@]+\.[^\s@]+)$/;
  const {updateUser} = useContext(UserContext);
  const { cartCount, GetCartItems } = useContext(cartContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate inputs as the user types
    if (name === 'username') {
      if (!emailOrPhoneRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          username: 'Enter a valid email address or phone number',
        }));
      } else {
        setErrors((prev) => ({ ...prev, username: '' }));
      }
    }

    if (name === 'password') {
      if (value.length < 8) {
        setErrors((prev) => ({
          ...prev,
          password: 'Password must be at least 8 characters long',
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: '' }));
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
   
    // Assume a login API call
    try {
      console.log(formData);
      // Example of an API call to authenticate
      const response = await fetch(packageInfo.urls.Login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        updateUser(data.userName);
        

        console.log(data);

        // Store the JWT token and user info
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('userID', data.userID);
        localStorage.setItem('username', data.userName);
        localStorage.setItem('userRole', data.userRole);

         // Verify the JWT token by calling a protected endpoint
        const isAuthenticated = await verifyAuthentication(data.accessToken)

         if (isAuthenticated) {
          // Redirect to the main page if authenticated
          const redirectPath = location.state?.from?.pathname || '/';
          await GetCartItems(); // Directly update cart count after login

          navigate(redirectPath);
        } else {
          setErrors('Authentication failed. Please try again.');
        }

     
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

const verifyAuthentication = async (token) => {
  console.log('Token:', token);
  console.log('API URL:', packageInfo.urls.WeatherForecast);

  try {
    const response = await fetch(packageInfo.urls.WeatherForecast, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Response status:', response.status);

    if (response.ok) {
      const weatherData = await response.json();
      console.log('Protected data:', weatherData);
      return true;
    } else {
      console.log('Failed to authenticate token. Status:', response.status);
      return false;
    }
  } catch (err) {
    console.error('Error verifying token:', err);
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
              name="username"
              placeholder="Enter Email or Phone Number"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              required
            />
            {errors.emailOrPhone && <div className="error">{errors.emailOrPhone}</div>}
          </div>
          <div className="form-input-field password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              id="password"
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="toggle-password"
              onClick={togglePasswordVisibility}
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          {/* Handle backend errors */}
          {errorMessage && <div className="response-div">{errorMessage}</div>}

          <div className="form-button">
            <button type="submit" disabled={Object.values(errors).some((error) => error)}>
              Login
            </button>
          </div>
        </form>
        <div className="form-links">
          <a href="#">Forgot my password</a>
          <p>Don't have an account? <a href="/register">Sign Up</a></p>
        </div>
      </div>
    </section>
  );
}

export default Login;
