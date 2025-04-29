import React, { useState, useEffect } from "react";
import axios from "axios";

const AvailableTimeDoctor = () => {
    const [doctorData, setDoctorData] = useState({
        doctorName: "",
        doctorSpecialty: "",
        date: "",
        times: ""
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [doctorNames, setDoctorNames] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get("http://localhost:3001/doctor_api/doctors_get");
                // Extract doctor names from the array of objects
                const names = response.data.map(doctor => doctor.doctorName);
                setDoctorNames(names);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching doctors:", error);
                setLoading(false);
            }
        };
    
        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctorData({
            ...doctorData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/doctor_api/addAvailable_time", doctorData);
            if (response.status === 201) {
                setSuccessMessage("Time added successfully!");
                setDoctorData({
                    doctorName: "",
                    doctorSpecialty: "",
                    date: "",
                    times: ""
                });
            }
        } catch (error) {
            console.error("Error adding available time:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="createForm">
            <h1>Add Available Time for Doctor</h1>
            {successMessage && <div className="successMessage" style={{ color: 'yellow' }}>{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="createFormInput">
                    <label htmlFor="doctorName">Doctor Name:</label>
                    <select
                        name="doctorName"
                        id="doctorName"
                        value={doctorData.doctorName}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Doctor</option>
                        {doctorNames.map((doctorName, index) => (
                            <option key={index} value={doctorName}>{doctorName}</option>
                        ))}
                    </select>
                </div>
                <div className="createFormInput">
                    <label htmlFor="doctorSpecialty">Doctor Specialty:</label>
                    <input
                        type="text"
                        name="doctorSpecialty"
                        id="doctorSpecialty"
                        value={doctorData.doctorSpecialty}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="createFormInput">
                    <label htmlFor="times">Available Time and date</label>
                    <input
                        type="text"
                        name="times"
                        id="times"
                        value={doctorData.times}
                        onChange={handleChange}
                        placeholder="Ex 9.30am - 10.30am(3/14/2024)"
                        required
                    />
                </div>
                <div className="createFormSubmit">
                    <button type="submit">Add Available Time</button>
                </div>
            </form>
        </div>
    );
};

export default AvailableTimeDoctor;
