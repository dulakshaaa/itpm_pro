import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    let navigate = useNavigate(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3001/appointment_api/appointments_get");
                setAppointments(response.data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Fetch Error',
                    text: 'Failed to fetch appointments. Please try again later.'
                });
            }
        };

        fetchData();
    }, []);

    const handleDeleteAppointment = async (appointmentId) => {
        // SweetAlert confirmation
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this appointment? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3001/appointment_api/appointments_delete/${appointmentId}`);
                
                // Update appointments state
                setAppointments(appointments.filter(appointment => appointment._id !== appointmentId));
                
                // Success notification
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Appointment has been deleted successfully.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error("Error deleting appointment:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Delete Failed',
                    text: 'Failed to delete appointment. Please try again.',
                    confirmButtonText: 'Ok'
                });
            }
        }
    };

    const handleAcceptAppointment = async (appointmentId) => {
        try {
            await axios.put(`http://localhost:3001/doctor_api/appointments/accept/${appointmentId}`);
            
            // Success notification
            await Swal.fire({
                icon: 'success',
                title: 'Appointment Accepted',
                text: 'Appointment has been successfully accepted!',
                timer: 2000,
                showConfirmButton: false
            });

            // Refresh appointments after accepting
            const response = await axios.get("http://localhost:3001/appointment_api/appointments_get");
            setAppointments(response.data);
        } catch (error) {
            console.error("Error accepting appointment:", error);
            Swal.fire({
                icon: 'error',
                title: 'Accept Failed',
                text: 'Failed to accept appointment. Please try again.',
                confirmButtonText: 'Ok'
            });
        }
    };

    const handleGenerateReport = () => {
        html2canvas(document.getElementById('toPrint'), {backgroundColor: '#fff'}).then(canvas => {
            let image = canvas.toDataURL('image/png')
            let doc = new jsPDF('p', 'px', [1920,1200])
            doc.addImage(image, 'PNG', 50, 50, 1125, 380)
            doc.save('appointments_report.pdf')
        })
    };

    const filteredAppointments = appointments.filter(appointment => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            appointment.fullName.toLowerCase().includes(searchTermLower) ||
            appointment.email.toLowerCase().includes(searchTermLower) ||
            appointment.contactNumber.includes(searchTermLower) ||
            appointment.doctorName.toLowerCase().includes(searchTermLower) ||
            appointment.time.toLowerCase().includes(searchTermLower) ||
            appointment.status.toLowerCase().includes(searchTermLower)
        );
    });

    return (
        <div className="appointments-container">
            <div className="buttonCollection">
                <input
                    type="text"
                    placeholder="Search Appointments"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        borderRadius: '45px', 
                        marginLeft: '700px',
                        padding: '10px',
                        width: '250px'
                    }}
                />
                <button 
                    onClick={handleGenerateReport}
                    style={{
                        marginLeft: '10px',
                        padding: '10px 15px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Print Report
                </button>
            </div>
            <table className="userDetailsTable" id="toPrint" style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                    <tr style={{backgroundColor: 'black'}}>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Full Name</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Email</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Contact Number</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Doctor Name</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Time</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Status</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}} data-html2canvas-ignore="true">Actions</th>
                    </tr>
                </thead>
                <tbody className="tbodyPrint">
                    {filteredAppointments.map((appointment, index) => (
                        <tr key={index} style={{borderBottom: '1px solid #ddd'}}>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{appointment.fullName}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{appointment.email}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{appointment.contactNumber}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{appointment.doctorName}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{appointment.time}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{appointment.status}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}} data-html2canvas-ignore="true">
                                <button 
                                    onClick={() => handleAcceptAppointment(appointment._id)}
                                    style={{
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        padding: '5px 10px',
                                        margin: '0 5px',
                                        borderRadius: '3px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Accept
                                </button>
                                <button 
                                    onClick={() => handleDeleteAppointment(appointment._id)}
                                    style={{
                                        backgroundColor: '#f44336',
                                        color: 'white',
                                        border: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '3px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Appointments;