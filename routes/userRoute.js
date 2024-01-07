import express from 'express';
import { follow_unfollow_User, loginUser, logoutUser, registerUser } from '../controllers/userController.js';
import { isAuthenticate } from '../middlewares/auth.js';


const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/register", registerUser);
router.get("/follow/:id", isAuthenticate, follow_unfollow_User);


export default router;