const express = require('express');
const router = express.Router();
const {signup, login, getUserInfo, updateProfile, addProfileImage, deleteProfileImage} = require('../controllers/AuthController');
const { verifyToken } = require('../middlewares/AuthMiddleware');
const upload = require('../config/multer');

router.post('/signup', signup)

router.post('/login', login)

router.get('/user-info', verifyToken, getUserInfo)

router.post('/update-profile', verifyToken, updateProfile) 

router.post('/add-profile-image', verifyToken, upload.single("image"), addProfileImage)

router.delete('/delete-profile-image', verifyToken, deleteProfileImage)



module.exports = router