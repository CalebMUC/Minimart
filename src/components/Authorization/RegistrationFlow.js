// import { useState } from "react";
// import EmailValidation from "./EmailValidation";
// import EmailCodeVerification from "./EmailCodeVerification";
// import Register from "../Register";
// import { SendEmailValidationCode, VerifyEmailValidationCode } from "../../Data";

// const RegistrationFlow = () =>{

//     const [step,setStep] = useState(1);
//     const [email, setEmail] = useState("");
//     const [code , setEmailValidationCode] = useState("");
//     const [errorMessage, setErrorMessage] = useState("");

    
//         const handleEmailValidation = async (email) => {
//             try {
//                 setEmail(email)
//                 const requestData = { email };
//                 const response = await SendEmailValidationCode (requestData);
                
//                 if (response.responseCode === 200) {
//                     setStep(2)
//                     return { success: true, message: "Email Validation code sent successfully!" };
//                 } else {
//                     return { success: false, message: response.responseMessage };
//                 }
//             } catch (error) {
//                 console.error("Error sending reset code:", error);
//                 return { success: false, message: "An error occurred. Please try again." };
//             }
//         };

        
//             const handleCodeVerification = async (code) => {
//                 setEmailValidationCode(code);
//                 setErrorMessage("");
                
//                 try {
//                     const requestData = { code, email };
//                     const response = await VerifyEmailValidationCode (requestData);
                    
//                     if (response.responseCode === 200) {
//                         setStep(3);
//                     } else {
//                         throw new Error(response.responseMessage || "Invalid verification code");
//                     }
//                 } catch (error) {
//                     throw new Error(error.message || "Verification failed. Please try again.");
//                 }
//             };


//     return(
//         <div className="flex justify-center items-center min-h-screen bg-gray-100">
//              {step === 1 &&(
//                 <EmailValidation 
//                 onEmailValidation={handleEmailValidation}
//                  errorMessage = {errorMessage} />
//              )}
//               {step === 2 &&(
//                 <EmailCodeVerification
//                     onCodeVerified={handleCodeVerification}
//                     email={email}
//                     errorMessage={errorMessage}
//                 />
//              )}
//             {step === 3 && (
//             <div className="fixed inset-0 bg-gray-100 flex justify-center items-center">
//                 <Register/>
//             </div>
//             )}
//         </div>
//     )

// }

// export default RegistrationFlow;

import { useState, useEffect, useCallback } from "react";
import EmailValidation from "./EmailValidation";
import EmailCodeVerification from "./EmailCodeVerification";
import Register from "../Register";
import { SendEmailValidationCode, VerifyEmailValidationCode } from "../../Data";

const RegistrationFlow = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setEmailValidationCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isVerified, setIsVerified] = useState(false);

    // Debugging step changes
    useEffect(() => {
        console.log(`Registration step changed to: ${step}`);
    }, [step]);

    const handleEmailValidation = useCallback(async (email) => {
        try {
            setEmail(email);
            setErrorMessage("");
            
            const requestData = { email };
            const response = await SendEmailValidationCode(requestData);
            
            console.log("Email validation response:", response); // Debug
            
            if (response.responseCode === 200) {
                setStep(2);
                return { success: true, message: "Verification code sent!" };
            } else {
                throw new Error(response.responseMessage || "Failed to send code");
            }
        } catch (error) {
            console.error("Email validation error:", error);
            setErrorMessage(error.message);
            return { success: false, message: error.message };
        }
    }, []);

    const handleCodeVerification = useCallback(async (code) => {
        try {
            setEmailValidationCode(code);
            setErrorMessage("");
            
            const requestData = { code, email };
            const response = await VerifyEmailValidationCode(requestData);
            
            console.log("Code verification response:", response); // Debug
            
            if (response.responseCode === 200) {
                setIsVerified(true);
                setStep(3);
            } else {
                throw new Error(response.responseMessage || "Invalid code");
            }
        } catch (error) {
            console.error("Code verification error:", error);
            setErrorMessage(error.message);
            throw error;
        }
    }, [email]);

    const handleBack = useCallback(() => {
        if (step > 1) {
            setStep(prev => prev - 1);
            setErrorMessage("");
        }
    }, [step]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            {step === 1 && (
                <EmailValidation 
                    onEmailValidation={handleEmailValidation}
                    errorMessage={errorMessage}
                />
            )}
            
            {step === 2 && (
                <EmailCodeVerification
                    onCodeVerified={handleCodeVerification}
                    onBack={handleBack}
                    email={email}
                    errorMessage={errorMessage}
                />
            )}
            
            {step === 3 && isVerified && (
                <div className="fixed inset-0 bg-gray-100 z-50">
                    <Register 
                        verifiedEmail={email}
                        onBack={handleBack}
                    />
                </div>
            )}
        </div>
    );
};

export default RegistrationFlow;