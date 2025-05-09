import { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import { SendResetCode, VerifyResetCode, ResetPassword as ResetPasswordAPI } from "../../Data";
import ResetCodeVerification from "./ResetCodeVerification";
import ResetPassword from "./ResetPassword";
import { useNavigate } from "react-router-dom";

const PasswordResetFlow = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    
    const handleEmailSubmit = async (email) => {
        try {
            setEmail(email)
            const requestData = { email };
            const response = await SendResetCode(requestData);
            
            if (response.responseCode === 200) {
                setStep(2)
                return { success: true, message: "Reset code sent successfully!" };
            } else {
                return { success: false, message: response.responseMessage };
            }
        } catch (error) {
            console.error("Error sending reset code:", error);
            return { success: false, message: "An error occurred. Please try again." };
        }
    };



    const handleCodeVerification = async (code) => {
        setResetCode(code);
        setErrorMessage("");
        
        try {
            const requestData = { code, email };
            const response = await VerifyResetCode(requestData);
            
            if (response.responseCode === 200) {
                setStep(3);
            } else {
                throw new Error(response.responseMessage || "Invalid verification code");
            }
        } catch (error) {
            throw new Error(error.message || "Verification failed. Please try again.");
        }
    };

    const handlePasswordReset = async (newPassword) => {
        setErrorMessage("");
        
        try {
            const requestData = { 
                email, 
                code: resetCode, 
                newPassword 
            };
            
            const response = await ResetPasswordAPI(requestData);
            
            if (response.responseCode === 200) {
                // Return success status to ResetPassword component
                return { success: true, message: response.responseMessage };
            } else {
                return { 
                    success: false, 
                    message: response.responseMessage || "Password reset failed" 
                };
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            return { 
                success: false, 
                message: "An error occurred. Please try again." 
            };
        }
    };

    const handleSuccess = () => {
        // Redirect to login page after successful password reset
        navigate("/login", { 
            state: { 
                successMessage: "Password reset successfully! Please login with your new password." 
            } 
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            {step === 1 && (
                <ForgotPassword 
                    onEmailSubmit={handleEmailSubmit}
                    errorMessage={errorMessage}
                />
            )}
            {step === 2 && (
                <ResetCodeVerification
                    onCodeVerified={handleCodeVerification}
                    email={email}
                    errorMessage={errorMessage

                    }
                />
            )}
            {step === 3 && (
                <ResetPassword 
                    onPasswordReset={handlePasswordReset}
                    onSuccess={handleSuccess}
                    errorMessage={errorMessage}
                />
            )}
        </div>
    );
};

export default PasswordResetFlow;