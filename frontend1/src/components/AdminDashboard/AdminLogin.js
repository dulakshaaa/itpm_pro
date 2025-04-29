import React, { useState } from 'react';
import axios from 'axios';
import './AdminStyles/AdminLogin.css'; 

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin'); // Default role is admin
    const [errorMessage, setErrorMessage] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/AdminAuth/admin/login', {
                email,
                password,
                role,
            });

            if (response.status === 200) {
                // Redirect based on the role
                if (role === 'employee') {
                    // Redirect to employee dashboard
                    window.location.href = 'http://localhost:3000/DoctorDashboard/Appointments';
                } else if (role === 'admin') {
                    // Redirect to admin dashboard
                    window.location.href = 'http://localhost:3000/AdminDashboard/Doctors';
                }
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('Invalid email or password');
        }
    };

    return (
        <div className='Main'>
        <div className="login-container">
            <center><h2> Staff Login</h2></center>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>
                        
                        <input
                            type="radio"
                            value="admin"
                            checked={role === 'admin'}
                            onChange={handleRoleChange}
                        />
                        Admin
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="employee"
                            checked={role === 'employee'}
                            onChange={handleRoleChange}
                        />
                        Employee
                    </label>
                </div>
                <div className="form-group">
                    <button type="submit">Login</button>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
        </div>
        </div>
    );
};

export default AdminLogin;
