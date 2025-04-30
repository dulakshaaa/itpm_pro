import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CgProfile, CgMathPlus } from "react-icons/cg";
import Swal from 'sweetalert2'; // Import SweetAlert2
import '../../styles/petAddCard.css';

const Profile = () => {
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true);
    const [editable, setEditable] = useState(false);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                };
    
                const response = await axios.get("http://localhost:3001/user_api/user_profile", config);
    
                setProfileData(response.data.user);
                setFormData(response.data.user);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setError("Failed to fetch profile data.");
                setLoading(false);
                
                // SweetAlert for fetch error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to fetch profile data. Please try again.',
                });
            }
        };
    
        fetchProfileData();
    }, []);

    const handleEdit = () => {
        setEditable(true);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };

            const response = await axios.put("http://localhost:3001/user_api/update_profile", formData, config);

            setProfileData(response.data.user);
            setFormData(response.data.user);
            setEditable(false);

            // SweetAlert for successful update
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your profile has been successfully updated!',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Error updating profile data:", error);
            
            // SweetAlert for update error
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update profile. Please try again.',
                confirmButtonText: 'Ok'
            });
        }
    };

    const handleDelete = async () => {
        // Confirmation dialog before deletion
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete your profile? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                };

                await axios.delete("http://localhost:3001/user_api/delete_profile", config);

                localStorage.removeItem('token');

                // SweetAlert for successful deletion
                await Swal.fire({
                    icon: 'success',
                    title: 'Profile Deleted',
                    text: 'Your profile has been successfully deleted.',
                    timer: 2000,
                    showConfirmButton: false
                });

                // Redirect to login page
                navigate('/Client/Login');

            } catch (error) {
                console.error("Error deleting profile:", error);
                
                // SweetAlert for deletion error
                Swal.fire({
                    icon: 'error',
                    title: 'Deletion Failed',
                    text: 'Failed to delete profile. Please try again.',
                    confirmButtonText: 'Ok'
                });
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="ProfilePage">
            <div className="profilePageSideBar">
                <div className="profilePageSideBarProfilePic"><CgProfile /></div>
                {editable ? (
                    <input
                        type="text"
                        className="profilePageSideBarUsernameEditable"
                        name="fullName"
                        value={formData.fullName || ""}
                        onChange={handleInputChange}
                    />
                ) : (
                    <div className="profilePageSideBarUsername">{profileData.fullName || "Username"}</div>
                )}
                <div className="profilePageSideBarButtons">
                    <button className="profilePageSideBarEditButton" style={{backgroundColor:'#A1A1A1',color: '#FFF'}} onClick={handleEdit}>Edit</button>
                    <button className="profilePageSideBarDeleteButton" onClick={handleDelete}>Delete</button>
                </div>
            </div>
            <div className="profilePageMainContent">
                <div className="profilePageMainContentHeader">
                    <p>Personal Information</p>
                    <hr />
                </div>
                <div className="profilePageMainContentDetails">
                    <div className="profilePageMainContentDetailsEmail">
                        <p>Email </p>
                        {editable ? (
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                readOnly
                            />
                        ) : (
                            <div>{profileData.email}</div>
                        )}
                    </div>
                    <div className="profilePageMainContentDetailsContact">
                        <p>Contact No. </p>
                        {editable ? (
                            <input
                                type="text"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <div>{profileData.contactNumber}</div>
                        )}
                    </div>
                    <div className="profilePageMainContentDetailsNIC">
                        <p>NIC </p>
                        {editable ? (
                            <input
                                type="text"
                                name="nationalIdentityCardNumber"
                                value={formData.nationalIdentityCardNumber}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <div>{profileData.nationalIdentityCardNumber}</div>
                        )}
                    </div>
                    {editable && (
                        <button onClick={handleUpdate} style={{
                            backgroundColor:'#CFCFCF',
                            gridColumnStart: 1,
                            width: '31%', //changed the width
                            padding: '10px 10px',
                            borderRadius: '8px'
                        }}>Update</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
