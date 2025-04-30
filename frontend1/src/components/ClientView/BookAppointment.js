import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2'; // Import SweetAlert2

const BookAppointment = () => {
    const [fullName, setFullName] = useState(""); // Changed from petName to fullName
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [time, setTime] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch doctors from the backend
        const fetchDoctors = async () => {
            try {
                const response = await axios.get("http://localhost:3001/doctor_api/doctors_get");
                setDoctors(response.data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch doctors. Please try again later.'
                });
            }
        };

        fetchDoctors();
    }, []);

    useEffect(() => {
        // Fetch available time slots based on selected doctor
        const fetchAvailableTimeSlots = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/doctor_api/doctor_available_times/${doctorName}`);
                setAvailableTimeSlots(response.data);
            } catch (error) {
                console.error("Error fetching available time slots:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch available time slots. Please try again.'
                });
            }
        };
    
        if (doctorName) {
            fetchAvailableTimeSlots();
        } else {
            setAvailableTimeSlots([]);
        }
    }, [doctorName]);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateContactNumber = (contactNumber) => {
        return /^\d{10}$/.test(contactNumber);
    };

    const validateForm = () => {
        const errors = {};
        if (!fullName.trim()) {
            errors.fullName = "Full name is Required";//CHANGE view messages
        }
        if (!validateEmail(email)) {
            errors.email = "Please enter a valid email address";
        }
        if (!validateContactNumber(contactNumber)) {
            errors.contactNumber = "Please enter a valid 10-digit contact number";
        }
        if (!doctorName) {
            errors.doctorName = "Please select a doctor";
        }
        if (!time) {
            errors.time = "Please select a booking time";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch(name) {
            case "fullName":
                setFullName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "contactNumber":
                setContactNumber(value);
                break;
            case "doctorName":
                setDoctorName(value);
                break;
            case "time":
                setTime(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Payload matches the mongoose schema
                const appointmentData = {
                    fullName,
                    email,
                    contactNumber,
                    doctorName,
                    time,
                    status: 'not accepted' // Default status as per schema
                };

                const response = await axios.post("http://localhost:3001/appointment_api/appointments_add", appointmentData);
                
                // Success SweetAlert
                await Swal.fire({
                    icon: 'success',
                    title: 'Appointment Booked',
                    text: 'Your appointment has been successfully booked!',
                    timer: 2000,
                    showConfirmButton: false
                });

                // Reset form
                setFullName("");
                setEmail("");
                setContactNumber("");
                setDoctorName("");
                setTime("");
                setErrors({});
            } catch (error) {
                console.error("Error booking appointment:", error);
                
                // Error SweetAlert
                Swal.fire({
                    icon: 'error',
                    title: 'Booking Failed',
                    text: error.response?.data?.message || 'Failed to book appointment. Please try again.',
                    confirmButtonText: 'Try Again'
                });
            }
        }
    };

    return (
        <div className="AppointmentsPage">
            <div className="appointmentBooking">
                <div className="appointmentBookingHeader">Book an Appointment</div>
                <div className="appointmentBookingForm">
                    <form onSubmit={handleSubmit}>
                        <div className="appointmentBookingFormInput">
                            <label htmlFor="fullName">Full Name :</label>
                            <input
                                type="text"
                                name="fullName"
                                id="fullName"
                                value={fullName}
                                onChange={handleInputChange}
                            />
                            {errors.fullName && <div className="error">{errors.fullName}</div>}
                        </div>
                        <div className="appointmentBookingFormInput">
                            <label htmlFor="email">Email :</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={handleInputChange}
                            />
                            {errors.email && <div className="error" style={{ color: "red" }}>{errors.email}</div>}
                        </div>
                        <div className="appointmentBookingFormInput">
                            <label htmlFor="contactNumber">Contact No :</label>
                            <input
                                type="text"
                                name="contactNumber"
                                id="contactNumber"
                                value={contactNumber}
                                onChange={handleInputChange}
                            />
                            {errors.contactNumber && <div className="error" style={{ color: "red" }}>{errors.contactNumber}</div>}
                        </div>
                        <div className="appointmentBookingFormInput">
                            <label htmlFor="doctorName">DOCTOR :</label> 
                                    //CHANGE FONTs
                            <select
                                name="doctorName"
                                id="doctorName"
                                value={doctorName}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map((doctor, index) => (
                                    <option key={index} value={doctor.name}>
                                        {doctor.doctorName}
                                    </option>
                                ))}
                            </select>
                            {errors.doctorName && <div className="error" style={{ color: "red" }}>{errors.doctorName}</div>}
                        </div>
                        <div className="appointmentBookingFormInput">
                            <label htmlFor="time">Booking Time :</label>
                            <select
                                name="time"
                                id="time"
                                value={time}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Time</option>
                                {availableTimeSlots.map((timeSlot, index) => (
                                    <option key={index} value={timeSlot.times}>
                                        {timeSlot.times}
                                    </option>
                                ))}
                            </select>
                            {errors.time && <div className="error" style={{ color: "red" }}>{errors.time}</div>}
                        </div>
                        <div className="appointmentBookingFormSubmit">
                            <button type="submit">Book Appointment</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
