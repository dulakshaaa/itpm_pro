const express = require('express');
const router = express.Router();
const authController = require('../controllers/userManagement_controller');
const authMiddleware = require('../middlewares/user_middleware');

// Registration route
router.post('/user_register', authController.register);

// Login route
router.post('/user_login', authController.login);

//get user profile
router.get('/user_profile', authMiddleware, authController.getUserProfile);

//update profile
router.put('/update_profile', authMiddleware, authController.updateProfile);

//delete user profile
router.delete('/delete_profile', authMiddleware, authController.deleteUser);

router.delete('/delete_profile_byID/:userID', authController.deleteUserByID);

router.get('/allusers', authController.getAllUsers);



//verify token
router.post('/verify_token',authMiddleware,authController.verifyToken);
module.exports = router;

