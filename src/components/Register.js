import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../../src/Register.css';
import packageInfo from "../../package.json";
import Dialogs from "./Dialogs.js";

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState("+254"); // Default to Kenya
  const [countryCodes, setCountryCodes] = useState([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleCountryCodeChange = (event) => {
    setSelectedCountryCode(event.target.value);
  };

  // Fetch country codes
  const fetchCountryCodes = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      const codes = data
        .map((country) => ({
          name: country.name.common,
          code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ""),
        }))
        .filter((country) => country.code); // Filter out countries without a valid code
      return codes;
    } catch (error) {
      console.error("Error fetching country codes:", error);
    }
  };

  // Regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{9}$/;

  const validatePasswordStrength = (password) => {
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (strongPasswordPattern.test(password)) {
      setPasswordStrength('Strong');
    } else {
      setPasswordStrength('Weak: Must be 8 characters long, include uppercase, lowercase, number, and special character.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate inputs as the user types
    if (name === 'email') {
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
      } else {
        setErrors((prev) => ({ ...prev, email: '' }));
      }
    }

    if (name === 'phoneNumber') {
      if (!phoneRegex.test(value)) {
        setErrors((prev) => ({ ...prev, phoneNumber: 'Phone number must be 9 digits' }));
      } else {
        setErrors((prev) => ({ ...prev, phoneNumber: '' }));
      }
    }

    if (name === 'password') {
      validatePasswordStrength(value);
      if (formData.confirmPassword && formData.confirmPassword !== value) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }

    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  useEffect(() => {
    // Load country codes
    const loadCountryCodes = async () => {
      const codes = await fetchCountryCodes();
      setCountryCodes(codes);
    };

    loadCountryCodes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error message

    try {
      const response = await fetch(packageInfo.urls.Register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('userID', data.userID);
        localStorage.setItem('username', data.username);

        // Show success dialog
        setSuccessMessage('Registration Successful!');
        setShowSuccessDialog(true);

        // Redirect after 6 seconds
        setTimeout(() => {
          window.location.href = "http://localhost:3000"; // Redirect to localhost:3000
        }, 6000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Registration failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setPasswordVisible(!passwordVisible);
    } else if (field === 'confirmPassword') {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  return (
    <section className="register-container">
      {showSuccessDialog && <Dialogs message={successMessage} />}

      <div className="register-form">
        <div className="register-header">
          <div className="register-logo">
            <img src="../images/shopping-bag.png" alt="Logo" />
          </div>
          <div className="register-details">
            <h2>Welcome to Minimart</h2>
            <p>Create an Account</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="register-input-field">
            <input
              type="text"
              name="userName"
              placeholder="UserName"
              value={formData.userName}
              onChange={handleInputChange}
              required
            />
            {errors.name && <div className="register-error">{errors.name}</div>}
          </div>
          <div className="register-input-field">
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && <div className="register-error">{errors.email}</div>}
          </div>
          <div className="register-input-field">
            <div className="phone-input">
              {/* Country code dropdown */}
              <select value={selectedCountryCode} onChange={handleCountryCodeChange}>
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>

              {/* Mobile number input */}
              <input
                type="text"
                placeholder="794129556" // Placeholder to guide the user on format
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            {errors.phoneNumber && <div className="register-error">{errors.phoneNumber}</div>}
          </div>
          <div className="register-input-field password-field">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              onClick={() => togglePasswordVisibility('password')}
            />
            <div className="register-password-strength">
              {passwordStrength && (
                <span className={passwordStrength.includes('Strong') ? 'strong' : 'weak'}>
                  {passwordStrength}
                </span>
              )}
            </div>
          </div>
          <div className="register-input-field password-field">
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <FontAwesomeIcon
              icon={confirmPasswordVisible ? faEyeSlash : faEye}
              onClick={() => togglePasswordVisibility('confirmPassword')}
            />
            {errors.confirmPassword && <div className="register-error">{errors.confirmPassword}</div>}
          </div>
          {/* Handle backend errors */}
          {errorMessage && <div className="response-div">{errorMessage}</div>}
          <div className="register-button">
            <button
              type="submit"
              disabled={passwordStrength.includes('Weak')}
            >
              Sign Up
            </button>
          </div>
          <div className="register-link">
            <span>
              Already have an account? <a href="/login">Login</a>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Register;
