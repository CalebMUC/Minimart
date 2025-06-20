import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCheck, faTimes,faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import packageInfo from "../../package.json";
import Dialogs from "./Dialogs.js";
import { UserRegister } from '../Data.js';

function Register({ verifiedEmail, onBack }) {
  const [formData, setFormData] = useState({
  userName: '', // ✅ Correct key name
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
});


  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasUpperCase: false,
    hasLowerCase: false
  });
  const [passwordStrength, setPasswordStrength] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState("+254");
  const [countryCodes, setCountryCodes] = useState([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

   // Lock the email field since it's already verified
    useEffect(() => {
        if (verifiedEmail) {
            setFormData(prev => ({ ...prev, email: verifiedEmail }));
        }
    }, [verifiedEmail]);

  const navigate = useNavigate();

  const handleCountryCodeChange = (event) => {
    setSelectedCountryCode(event.target.value);
  };

  const fetchCountryCodes = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!Array.isArray(data)) {
      throw new Error("Invalid API response format");
    }
    
    // Process country codes with proper error handling
    const codes = data
      .filter(country => 
        country?.name?.common && 
        country?.idd?.root && 
        country.idd.suffixes?.[0]
      )
      .map(country => ({
        name: country.name.common,
        code: `${country.idd.root}${country.idd.suffixes[0]}`,
      }))
      .filter(country => country.code)
      .sort((a, b) => a.name.localeCompare(b.name));
    
    // Add default Kenya (+254) if not present
    if (!codes.some(c => c.code === "+254")) {
      codes.unshift({ name: "Kenya", code: "+254" });
    }
    
    return codes;
  } catch (error) {
    console.error("Error fetching country codes:", error);
    
    // Return default codes if API fails
    return [
      { name: "Kenya", code: "+254" },
      { name: "United States", code: "+1" },
      { name: "United Kingdom", code: "+44" },
      // Add more fallback codes as needed
    ];
  }
};

// Update the useEffect hook
useEffect(() => {
  let isMounted = true;
  
  const loadCountryCodes = async () => {
    const codes = await fetchCountryCodes();
    if (isMounted) {
      setCountryCodes(codes);
    }
  };
  
  loadCountryCodes();
  
  return () => {
    isMounted = false;
  };
}, []);

  const validatePasswordStrength = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password)
    };
    
    setPasswordRequirements(requirements);
    
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    const totalRequirements = Object.keys(requirements).length;
    
    if (metRequirements === totalRequirements) {
      setPasswordStrength("Strong");
    } else if (metRequirements >= totalRequirements / 2) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Prevent changing verified email
        if (name === 'email' && verifiedEmail) return;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
      } else {
        setErrors((prev) => ({ ...prev, email: '' }));
      }
    }

    if (name === 'phoneNumber') {
      const sanitizedValue = value.replace(/\D/g,'');
      const phoneRegex = /^\d{9}$/;
      if (!phoneRegex.test(sanitizedValue)) {
        setErrors((prev) => ({ ...prev, phoneNumber: 'Phone number must be 9 digits' }));
      } else {
        setFormData((prev)=>({
          ...prev,
          phoneNumber: `${selectedCountryCode.replace('+','')}${sanitizedValue}`
        }));
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

  // useEffect(() => {
  //   const loadCountryCodes = async () => {
  //     const codes = await fetchCountryCodes();
  //     setCountryCodes(codes);
  //   };
  //   loadCountryCodes();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // const response = await fetch(packageInfo.urls.Register, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      var response = await UserRegister(formData);
      
        if(response.responseCode == 200){
          localStorage.setItem('userID', response.userID);
          localStorage.setItem('username', response.username);
          setSuccessMessage(response.responseMessage);
          setShowSuccessDialog(true);
          setTimeout(() => {
            window.location.href = "https://minimart-nine.vercel.app";
          }, 3000);
        } else if (response.responseCode == 400){
          setErrorMessage(response.responseMessage || 'Registration failed');
        }
     
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setPasswordVisible(!passwordVisible);
    } else if (field === 'confirmPassword') {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  const handleCloseModal = () => {
    setErrorMessage(false);
    setSuccessMessage(false);
    setShowSuccessDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

        {/* Back Button */}
            <button 
                onClick={onBack}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                Back
            </button>

      {showSuccessDialog && (
        <Dialogs 
          message={successMessage} 
          type="success"
          onClose={handleCloseModal}
        />
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
            <img 
              src="https://minimartke-products-upload.s3.us-east-1.amazonaws.com/minimartLogo.png" 
              alt="Logo" 
              className="w-10 h-10"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
          Welcome to Minimart
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create an Account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              {/* Username Field */}
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="userName"
                                name="userName"
                                type="text"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                                value={formData.userName}
                                onChange={handleInputChange}
                            />
                        </div>

            {/* Email Field */}
             {/* Email Field (Read-only if verified) */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                readOnly={!!verifiedEmail}
                                className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                                    verifiedEmail ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            {verifiedEmail && (
                                <p className="mt-1 text-xs text-green-600">Email verified</p>
                            )}
                        </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <select
                  value={selectedCountryCode}
                  onChange={handleCountryCodeChange}
                  className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  required
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  placeholder="712345678"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
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
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm pr-10"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    className="h-5 w-5 text-gray-400 hover:text-gray-500"
                  />
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                <p className="font-medium">Password must contain:</p>
                <div className={`flex items-center ${passwordRequirements.minLength ? 'text-green-500' : 'text-gray-500'}`}>
                  {passwordRequirements.minLength ? (
                    <FontAwesomeIcon icon={faCheck} className="mr-1 h-3 w-3" />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} className="mr-1 h-3 w-3" />
                  )}
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center ${passwordRequirements.hasNumber ? 'text-green-500' : 'text-gray-500'}`}>
                  {passwordRequirements.hasNumber ? (
                    <FontAwesomeIcon icon={faCheck} className="mr-1 h-3 w-3" />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} className="mr-1 h-3 w-3" />
                  )}
                  <span>At least one number</span>
                </div>
                <div className={`flex items-center ${passwordRequirements.hasSpecialChar ? 'text-green-500' : 'text-gray-500'}`}>
                  {passwordRequirements.hasSpecialChar ? (
                    <FontAwesomeIcon icon={faCheck} className="mr-1 h-3 w-3" />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} className="mr-1 h-3 w-3" />
                  )}
                  <span>At least one special character</span>
                </div>
                <div className={`flex items-center ${passwordRequirements.hasUpperCase ? 'text-green-500' : 'text-gray-500'}`}>
                  {passwordRequirements.hasUpperCase ? (
                    <FontAwesomeIcon icon={faCheck} className="mr-1 h-3 w-3" />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} className="mr-1 h-3 w-3" />
                  )}
                  <span>At least one uppercase letter</span>
                </div>
                <div className={`flex items-center ${passwordRequirements.hasLowerCase ? 'text-green-500' : 'text-gray-500'}`}>
                  {passwordRequirements.hasLowerCase ? (
                    <FontAwesomeIcon icon={faCheck} className="mr-1 h-3 w-3" />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} className="mr-1 h-3 w-3" />
                  )}
                  <span>At least one lowercase letter</span>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className="mt-2">
                  <span className="text-xs font-medium">
                    Strength: 
                    <span className={`ml-1 ${
                      passwordStrength === "Strong" ? "text-green-500" :
                      passwordStrength === "Medium" ? "text-yellow-500" : "text-red-500"
                    }`}>
                      {passwordStrength}
                    </span>
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className={`h-1 rounded-full ${
                        passwordStrength === "Strong" ? "bg-green-500 w-full" :
                        passwordStrength === "Medium" ? "bg-yellow-500 w-2/3" : "bg-red-500 w-1/3"
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={confirmPasswordVisible ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm pr-10"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  <FontAwesomeIcon
                    icon={confirmPasswordVisible ? faEyeSlash : faEye}
                    className="h-5 w-5 text-gray-400 hover:text-gray-500"
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
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

            {/* Submit Button */}
            <div>
              {/* <button
                type="submit"
                disabled={isSubmitting || passwordStrength === "Weak"}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                } ${
                  passwordStrength === "Weak" ? 'opacity-50 cursor-not-allowed' : ''
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
                  'Sign Up'
                )}
              </button> */}
               <button
                            type="submit"
                            disabled={isSubmitting || passwordStrength === "Weak"}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                            } ${
                                passwordStrength === "Weak" ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? 'Creating account...' : 'Create Account'}
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
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;