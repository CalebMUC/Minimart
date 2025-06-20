import { useState } from "react";
import EmailValidation from "./EmailValidation";
import EmailCodeVerification from "./EmailCodeVerification";
import Register from "../Register";
import { SendEmailValidationCode, VerifyEmailValidationCode } from "../../Data";

const RegistrationFlow = () =>{

    const [step,setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code , setEmailValidationCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    
        const handleEmailValidation = async (email) => {
            try {
                setEmail(email)
                const requestData = { email };
                const response = await SendEmailValidationCode (requestData);
                
                if (response.responseCode === 200) {
                    setStep(2)
                    return { success: true, message: "Email Validation code sent successfully!" };
                } else {
                    return { success: false, message: response.responseMessage };
                }
            } catch (error) {
                console.error("Error sending reset code:", error);
                return { success: false, message: "An error occurred. Please try again." };
            }
        };

        
            const handleCodeVerification = async (code) => {
                setEmailValidationCode(code);
                setErrorMessage("");
                
                try {
                    const requestData = { code, email };
                    const response = await VerifyEmailValidationCode (requestData);
                    
                    if (response.responseCode === 200) {
                        setStep(3);
                    } else {
                        throw new Error(response.responseMessage || "Invalid verification code");
                    }
                } catch (error) {
                    throw new Error(error.message || "Verification failed. Please try again.");
                }
            };


    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
             {step === 1 &&(
                <EmailValidation 
                onEmailValidation={handleEmailValidation}
                 errorMessage = {errorMessage} />
             )}
              {step === 2 &&(
                <EmailCodeVerification
                    onCodeVerified={handleCodeVerification}
                    email={email}
                    errorMessage={errorMessage}
                />
             )}
            {step === 3 && (
            <div className="fixed inset-0 bg-gray-100 flex justify-center items-center">
                <Register/>
            </div>
            )}
        </div>
    )

}

export default RegistrationFlow;