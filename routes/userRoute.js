import express from 'express';
import {
    deleteMyProfile,
    follow_unfollow_User,
    loginUser,
    logoutUser,
    myProfile,
    registerUser,
    updatePassword,
    updateProfile
} from '../controllers/userController.js';
import { isAuthenticate } from '../middlewares/auth.js';


const router = express.Router();

// login
router.post("/login", loginUser);
// logout
router.post("/logout", logoutUser);
// register
router.post("/register", registerUser);
// password update
router.put("/update/password", isAuthenticate, updatePassword);
// profile update
router.put("/update/profile", isAuthenticate, updateProfile);
// follow unfollow 
router.get("/follow/:id", isAuthenticate, follow_unfollow_User);
// delete my Profile
router.delete("/delete/me", isAuthenticate, deleteMyProfile);
// view my profile
router.get("/myprofile", isAuthenticate, myProfile);

export default router;