import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert2
import authService from '../../services/authservice'; // Import authService

const LoginPage = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pwdValid, setPwdValid] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        // Password validation
        setPwdValid(password.length >= 8);
        
        // Enable or disable submit button based on email and password validity
        setSubmitDisabled(!(pwdValid && email));
    }, [password, pwdValid, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate email and password again before submitting
        if (!pwdValid || !email) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Input',
                text: 'Please ensure your email is valid and password is at least 8 characters long.',
                confirmButtonText: 'Ok'
            });
            return;
        }

        try {
            // Make POST request to your server endpoint
            const token = await authService.login(email, password); // Use authService for login
            
            if (token) {
                // Success notification
                await Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: 'You have been logged in successfully.',
                    timer: 5000,
                    showConfirmButton: false
                });

                setIsLoggedIn(true); // Update login state 
                navigate('/dashboard'); // Navigate to dashboard or home page
            } else {
                // Handle no token received
                throw new Error("No token received");
            }
        } catch (error) {
            // Error notification
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.response?.data?.message || 'Unable to log in. Please check your credentials.',
                confirmButtonText: 'Try Again'
            });

            console.error("Login failed", error);
        }
    };

    return (
        <div className="logInPage">
            <div className="logInPageForm">
                <form onSubmit={handleSubmit}>
                    <p>Log In</p>
                    <div className="logInPageFormInputGroup">
                        <label htmlFor="userEmail">Email : </label>
                        <input
                            type="email"
                            name="userEmail"
                            id="userEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="logInPageFormInputGroup">
                        <label htmlFor="userPassword">Password : </label>
                        <input
                            type="password"
                            name="userPassword"
                            id="userPassword"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={submitDisabled}>
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;