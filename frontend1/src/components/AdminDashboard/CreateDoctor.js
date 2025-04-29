import React, { useState } from "react";
import axios from "axios";

const CreateDoctor = () => {
    const [doctorData, setDoctorData] = useState({
        doctorName: "",
        doctorEmail: "",
        doctorContact: "",
        doctorSpecialty: "",
        doctorAddress: "",
        doctorPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctorData({
            ...doctorData,
            [name]: value
        });
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = {};

        if (!doctorData.doctorName.trim()) {
            newErrors.doctorName = "Doctor name is required!";
            valid = false;
        }

        if (!doctorData.doctorEmail.trim()) {
            newErrors.doctorEmail = "Doctor email is required!";
            valid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(doctorData.doctorEmail)) {
            newErrors.doctorEmail = "Invalid email format!";
            valid = false;
        }

        if (!doctorData.doctorContact.trim()) {
            newErrors.doctorContact = "Doctor contact number is required!";
            valid = false;
        } else if (!/^\d{10}$/.test(doctorData.doctorContact)) {
            newErrors.doctorContact = "Invalid contact number format!";
            valid = false;
        }

        if (!doctorData.doctorSpecialty.trim()) {
            newErrors.doctorSpecialty = "Doctor specialty is required!";
            valid = false;
        }

        if (!doctorData.doctorAddress.trim()) {
            newErrors.doctorAddress = "Doctor address is required!";
            valid = false;
        }

        if (!doctorData.doctorPassword.trim()) {
            newErrors.doctorPassword = "Doctor password is required!";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post("http://localhost:3001/doctor_api/doctors_add", doctorData);
                if (response.status === 201) {
                    setSuccessMessage("Doctor created successfully!");
                    setDoctorData({
                        doctorName: "",
                        doctorEmail: "",
                        doctorContact: "",
                        doctorSpecialty: "",
                        doctorAddress: "",
                        doctorPassword: ""
                    });
                    setErrors({});
                }
            } catch (error) {
                console.error("Error creating doctor:", error);
            }
        }
    };

    return (
        <div className="createForm">
            <h1>Doctor Details</h1>
            {successMessage && <div className="successMessage" style={{ color: "yellow" }}>{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="createFormInput">
                    <label htmlFor="doctorName">Doctor Name :</label>
                    <input
                        type="text"
                        name="doctorName"
                        id="doctorName"
                        value={doctorData.doctorName}
                        onChange={handleChange}
                    />
                    {errors.doctorName && <div className="error" style={{ color: "yellow" }}>{errors.doctorName}</div>}
                </div>
                <div className="createFormInput">
                    <label htmlFor="doctorEmail">Doctor Email :</label>
                    <input
                        type="email"
                        name="doctorEmail"
                        id="doctorEmail"
                        value={doctorData.doctorEmail}
                        onChange={handleChange}
                    />
                    {errors.doctorEmail && <div className="error" style={{ color: "yellow" }}>{errors.doctorEmail}</div>}
                </div>
                <div className="createFormInput">
                    <label htmlFor="doctorContact">Doctor Contact No :</label>
                    <input
                        type="text"
                        name="doctorContact"
                        id="doctorContact"
                        value={doctorData.doctorContact}
                        onChange={handleChange}
                    />
                    {errors.doctorContact && <div className="error" style={{ color: "yellow" }}>{errors.doctorContact}</div>}
                </div>
                <div className="createFormInput">
                    <label htmlFor="doctorSpecialty">Doctor Specialty :</label>
                    <input
                        type="text"
                        name="doctorSpecialty"
                        id="doctorSpecialty"
                        value={doctorData.doctorSpecialty}
                        onChange={handleChange}
                    />
                    {errors.doctorSpecialty && <div className="error" style={{ color: "yellow" }}>{errors.doctorSpecialty}</div>}
                </div>
                <div className="createFormInput">
                    <label htmlFor="doctorAddress">Doctor Address :</label>
                    <input
                        type="text"
                        name="doctorAddress"
                        id="doctorAddress"
                        value={doctorData.doctorAddress}
                        onChange={handleChange}
                    />
                    {errors.doctorAddress && <div className="error" style={{ color: "yellow" }}>{errors.doctorAddress}</div>}
                </div>
                <div className="createFormInput">
                    <label htmlFor="doctorPassword">Doctor Password :</label>
                    <input
                        type="password"
                        name="doctorPassword"
                        id="doctorPassword"
                        value={doctorData.doctorPassword}
                        onChange={handleChange}
                    />
                    {errors.doctorPassword && <div className="error" style={{ color: "yellow" }}>{errors.doctorPassword}</div>}
                </div>
                <div className="createFormSubmit">
                    <button type="submit">Create Doctor</button>
                </div>
            </form>
        </div>
    );
};

export default CreateDoctor;
