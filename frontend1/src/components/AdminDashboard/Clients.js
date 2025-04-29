import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

const Clients = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3001/user_api/allusers");
                setUsers(response.data);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to fetch users. Please try again.',
                });
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const onDeleteButtonClick = async (userID) => {
        // Show confirmation dialog before deleting
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this user profile?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`http://localhost:3001/user_api/delete_profile_byID/${userID}`);
                    
                    // Remove the user from the local state
                    setUsers(users.filter(user => user._id !== userID));

                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'User profile has been deleted.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Failed',
                        text: 'Unable to delete user profile. Please try again.',
                        confirmButtonText: 'OK'
                    });
                    console.error("Error deleting user:", error);
                }
            }
        });
    }

    const filteredUsers = users.filter(user => {
        return (
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.contactNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.nationalIdentityCardNumber.toLowerCase().includes(searchTerm.toLowerCase()) 
        )
    });

    const handleGenerateReport = () => {
        // Add confirmation and success notification for report generation
        Swal.fire({
            title: 'Generating Report',
            text: 'Please wait while the report is being prepared...',
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                
                html2canvas(document.getElementById('toPrint'), {backgroundColor: '#fff'}).then(canvas => {
                    let image = canvas.toDataURL('image/png')
                    let doc = new jsPDF('p', 'px', [1920, 1080])
                    doc.addImage(image, 'PNG', 50, 50, 1000, 400)
                    doc.save('user_report.pdf')
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Report Generated',
                        text: 'Your user report has been downloaded.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }).catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Report Generation Failed',
                        text: 'Unable to generate report. Please try again.',
                        confirmButtonText: 'OK'
                    });
                    console.error("Error generating report:", error);
                });
            }
        });
    }

    return ( 
        <>
            <div className="buttonCollection">
                <input 
                    type="text" 
                    name="userSearch" 
                    id="userSearch" 
                    placeholder="Search" 
                    onChange={(e)=> setSearchTerm(e.target.value)} 
                    value={searchTerm} 
                    className="search-input"
                />
                <button onClick={handleGenerateReport} className="report-button">Print Report</button>
            </div>
            <table className="userDetailsTable" id="toPrint">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact No</th>
                        <th>NIC</th>
                        <th data-html2canvas-ignore="true">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user._id}>
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                            <td>{user.contactNumber}</td>
                            <td>{user.nationalIdentityCardNumber}</td>
                            <td data-html2canvas-ignore="true">
                                <button 
                                    onClick={() => {onDeleteButtonClick(user._id)}}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
     );
}
 
export default Clients;