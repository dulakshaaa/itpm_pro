import { useEffect, useState } from "react";
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignInPage = () => {

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        contactNumber: "",
        password: "",
        nationalIdentityCardNumber: ""
    });
    const [pwdValid, setPwdValid] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (formData.password.length >= 8) {
            setPwdValid(true);
        } else {
            setPwdValid(false);
        }
    }, [formData.password]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Perform validation based on the field name
        let isValid = true;
        switch (name) {
            case "fullName":
                isValid = value.trim() !== "";
                break;
            case "email":
                isValid = /\S+@\S+\.\S+/.test(value);
                break;
            case "contactNumber":
                isValid = /^\d{10}$/.test(value); // Restrict to 10 digits
                break;
            case "nationalIdentityCardNumber":
                isValid = value.trim() !== "";
                break;
            case "password":
                isValid = value.length >= 8;
                break;
            default:
                break;
        }

        // Update form data and validity
        setFormData({
            ...formData,
            [name]: value
        });
        setFormValid(isValid);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate form fields before submission
        if (formValid) {
            // Submit form data using Axios
            axios.post("http://localhost:3001/user_api/user_register", formData)
                .then(response => {
                    console.log(response.data)
                    console.log('Register success !'); // Handle response
                    setSuccessAlert(true);
                    setErrorAlert(false);
                    window.location.href = '/Client/Login'
                })
                .catch(error => {
                    console.error("Error:", error); // Handle error
                    setSuccessAlert(false);
                    setErrorAlert(true);
                });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div className="logInPage">
                <div className="logInPageForm">
                    <form onSubmit={handleSubmit}>
                        <p>Sign Up</p>
                        <div className="logInPageFormInputGroup">
                            <label htmlFor="userName">Name : </label>
                            <input type="text" name="fullName" id="userName" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className="logInPageFormInputGroup">
                            <label htmlFor="userContact">Contact No : </label>
                            <input type="text" name="contactNumber" id="userContact" value={formData.contactNumber} onChange={handleChange} required />
                        </div>
                        <div className="logInPageFormInputGroup">
                            <label htmlFor="userEmail">Email : </label>
                            <input type="email" name="email" id="userEmail" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="logInPageFormInputGroup">
                            <label htmlFor="userIdentity">Identity Card Number: </label>
                            <input type="text" name="nationalIdentityCardNumber" id="userIdentity" value={formData.nationalIdentityCardNumber} onChange={handleChange} required />
                        </div>
                        <div className="logInPageFormInputGroup">
                            <label htmlFor="userPassword">Password : </label>
                            <div className="password-input">
                                <input type={showPassword ? "text" : "password"} name="password" id="userPassword" value={formData.password} onChange={handleChange} required />
                                {showPassword ? <FaEyeSlash className="eye-icon" onClick={togglePasswordVisibility} /> : <FaEye className="eye-icon" onClick={togglePasswordVisibility} />}
                            </div>
                        </div>
                        {successAlert && <div className="success-alert">Registration Successful!</div>}
                        {errorAlert && <div className="error-alert">Registration Failed. Please try again.</div>}
                        {formValid ? (<button type="submit">Sign Up</button>) : (<button disabled="disabled" className="disabled">Disabled</button>)}
                    </form>
                </div>
            </div>
            <style jsx>{`
                .eye-icon {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: pointer;
                }
                .password-input {
                    position: relative;
                }
            `}</style>
        </>
    );
}

export default SignInPage;
