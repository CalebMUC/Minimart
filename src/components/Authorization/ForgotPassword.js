import { useState } from "react";

const ForgotPassword = ({ onEmailSubmit }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleInputChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        setErrorMessage(""); // Clear error when user types
        setError(false);

        const emailRegex = /^([^\s@]+@[^\s@]+\.[^\s@]+)$/;
        const valid = emailRegex.test(value);

        if (!valid && value) { // Only show error if there's input
            setError(true);
            setErrorMessage("Enter a valid Email Address");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous messages
        setErrorMessage("");
        setSuccessMessage("");
        
        // Validate email
        if (!email) {
            setError(true);
            setErrorMessage("Email Address is required");
            return;
        }
        
        if (error) {
            return; // Prevent submitting if there are validation errors
        }

        setIsSubmitting(true);
        
        try {
            // Call parent handler which should return a promise
            const response = await onEmailSubmit(email);
            
            if (response?.success) {
                setSuccessMessage("Reset code sent successfully! Check your email.");
            } else {
                setErrorMessage(response?.message || "Failed to send reset code. Please try again.");
            }
        } catch (err) {
            console.error("Forgot password error:", err);
            setErrorMessage("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
                <h2 className="text-lg font-semibold text-center text-gray-700 mb-6">
                    Get Password Reset Code
                </h2>
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Enter the Email Address associated with your MinimartKe account.
                    </p>
                </div>
                
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                    <div className="w-full mb-4">
                        <label className="block text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={handleInputChange}
                            placeholder="Enter Email Address"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {errorMessage}
                        </div>
                    )}
                    
                    {/* Success Message */}
                    {successMessage && (
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                            {successMessage}
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={isSubmitting || error}
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
                                Sending...
                            </>
                        ) : (
                            "Send Reset Code"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;