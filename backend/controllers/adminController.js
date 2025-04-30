const Doctor = require('../models/doctor_model');

const login = async (req, res) => {
    const { Email, password, role } = req.body;

    try {
        let user;

        if (role === 'admin') {
            // Check if email and password match the admin credentials
            if (email === 'admin@gmail.com' && password === 'admin12345') {
                
                return res.status(200).json({ message: 'Login successful' });
            } else {
                // Return error message for invalid email or password
                return res.status(401).json({ message: 'Invalid email or password' });
            }
        } else if (role === 'employee') {
            // Check if the user exists in the Doctor schema
            user = await Doctor.findOne({ doctorEmail: email });
            if (!user) {
                // Return error message if user not found
                return res.status(401).json({ message: 'User not found' });
            }
            // Compare the password with the doctorPassword directly
            if (user.doctorPassword !== password) {
                // Return error message for invalid password
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            // Return success message for employee (doctor) login
            return res.status(200).json({ message: 'Login successful as employee' });
        } else {
            // Return error message for invalid role
            return res.status(400).json({ message: 'Invalid role' });
        }
    } catch (error) {
        // Return error message for internal server error
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    login,
};
