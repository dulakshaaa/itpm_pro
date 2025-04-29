import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert
import authService from '../../services/authservice';
import { CgProfile, CgUser } from 'react-icons/cg';

function LoggedOutNavBar() {
  return (
    <div className="navBar">
      <div className="navBarLogo"><CgUser /></div>
      <div className="navBarLinks">
        <div className="navBarLink"><Link to="/Client/">Home</Link></div>
        <div className="navBarLink"><Link to="/Client/SignIn">Sign Up</Link></div>
        <div className="navBarLink"><Link to="/Client/LogIn">Log In</Link></div>
      </div>
    </div>
  );
}

function LoggedInNavBar() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});

  const handleLogout = () => {
    // SweetAlert confirmation dialog
    Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          authService.logout();
          Swal.fire({
            title: 'Logged Out!',
            text: 'You have been successfully logged out.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          navigate('/Client/LogIn');
        } catch (error) {
          Swal.fire({
            title: 'Logout Error',
            text: 'There was a problem logging out. Please try again.',
            icon: 'error'
          });
        }
      }
    });
  };

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
      } catch (error) {
        console.error("Error fetching profile data:", error);
        Swal.fire({
          title: 'Profile Error',
          text: 'Could not fetch profile data.',
          icon: 'error'
        });
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="navBar">
      <div className="navBarLogo"><CgUser/></div>
      <div className="navBarLinks">
        <div className="navBarLink"><Link to="/Client/">Home</Link></div>
        <div className="navBarLink"><Link to="/Client/store">Store</Link></div>
        <div className="navBarLink"><Link to="/Client/BookAppointment">Book Appointment</Link></div>
        <div className="navBarProfile">
          <Link to="/Client/Profile" className="navBarProfileName">
            <div className="navBarProfileIcon"><CgProfile /></div>
            {profileData.fullName}
          </Link>
        </div>
        <div className="navBarLink">
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

function HomeNavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(authService.isAuthenticated());
  }, []);

  return (
    <>
      {isLoggedIn ? <LoggedInNavBar /> : <LoggedOutNavBar />}
    </>
  );
}

export default HomeNavBar;