import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";

const ResetPassword = ({ onPasswordReset, onSuccess, errorMessage }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(false);
    const [localErrorMessage, setLocalErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        hasNumber: false,
        hasSpecialChar: false,
        hasUpperCase: false,
        hasLowerCase: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (errorMessage) {
            setLocalErrorMessage(errorMessage);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (newPassword) {
            const requirements = {
                minLength: newPassword.length >= 8,
                hasNumber: /\d/.test(newPassword),
                hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
                hasUpperCase: /[A-Z]/.test(newPassword),
                hasLowerCase: /[a-z]/.test(newPassword)
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
        } else {
            setPasswordStrength("");
        }
    }, [newPassword]);

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
        setLocalErrorMessage("");
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setLocalErrorMessage("");
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const validateForm = () => {
        if (!newPassword || !confirmPassword) {
            setError(true);
            setLocalErrorMessage("Both password fields are required");
            return false;
        }

        if (newPassword !== confirmPassword) {
            setError(true);
            setLocalErrorMessage("Passwords do not match");
            return false;
        }

        if (passwordStrength === "Weak") {
            setError(true);
            setLocalErrorMessage("Password is too weak");
            return false;
        }

        setError(false);
        setLocalErrorMessage("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setLocalErrorMessage("");
        
        try {
            const response = await onPasswordReset(newPassword);
            
            if (response.success) {
                setSuccessMessage(response.message);
                // Clear form
                setNewPassword("");
                setConfirmPassword("");
                // Redirect after a short delay
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            } else {
                setLocalErrorMessage(response.message);
            }
        } catch (error) {
            setLocalErrorMessage("An error occurred. Please try again.");
            console.error("Password reset error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                Reset Password 
            </h2>
            <div className="mb-6">
                <p className="text-sm text-gray-600 text-center">
                    Create a new password for your account
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                {/* New Password Field */}
                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                            placeholder="Enter new password"
                        />
                        <button 
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="text-xs text-gray-600 space-y-1 mt-2">
                        <p className="font-medium">Password must contain:</p>
                        <div className={`flex items-center ${passwordRequirements.minLength ? 'text-green-500' : 'text-gray-500'}`}>
                            {passwordRequirements.minLength ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                            <span>At least 8 characters</span>
                        </div>
                        <div className={`flex items-center ${passwordRequirements.hasNumber ? 'text-green-500' : 'text-gray-500'}`}>
                            {passwordRequirements.hasNumber ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                            <span>At least one number</span>
                        </div>
                        <div className={`flex items-center ${passwordRequirements.hasSpecialChar ? 'text-green-500' : 'text-gray-500'}`}>
                            {passwordRequirements.hasSpecialChar ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                            <span>At least one special character</span>
                        </div>
                        <div className={`flex items-center ${passwordRequirements.hasUpperCase ? 'text-green-500' : 'text-gray-500'}`}>
                            {passwordRequirements.hasUpperCase ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                            <span>At least one uppercase letter</span>
                        </div>
                        <div className={`flex items-center ${passwordRequirements.hasLowerCase ? 'text-green-500' : 'text-gray-500'}`}>
                            {passwordRequirements.hasLowerCase ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
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
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div 
                                    className={`h-1.5 rounded-full ${
                                        passwordStrength === "Strong" ? "bg-green-500 w-full" :
                                        passwordStrength === "Medium" ? "bg-yellow-500 w-2/3" : "bg-red-500 w-1/3"
                                    }`}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                            placeholder="Confirm new password"
                        />
                        <button 
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                
                {/* Error Message */}
                {(error || localErrorMessage) && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {localErrorMessage}
                    </div>
                )}
                
                {/* Success Message */}
                {successMessage && (
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                        {successMessage}
                    </div>
                )}
                
                {/* Submit Button */}
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full p-3 text-white rounded-lg shadow-lg ${
                        isSubmitting ? 'bg-yellow-400' : 'bg-yellow-500 hover:bg-yellow-600'
                    } transition-colors duration-200 flex justify-center items-center`}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        "Reset Password"
                    )}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;