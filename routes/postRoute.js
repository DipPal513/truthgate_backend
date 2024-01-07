import express from 'express';
import { createPost, deletePost, getPostOfFollowing, likedAndDisLikedPost } from '../controllers/postController.js';
import { isAuthenticate } from '../middlewares/auth.js';

const router = express.Router();

// post upload
router.post("/post/upload", isAuthenticate, createPost);
// 
router.get("/post/:id", isAuthenticate, likedAndDisLikedPost);
router.delete("/deletepost/:id", isAuthenticate, deletePost);
router.get("/posts", isAuthenticate, getPostOfFollowing);



export default router;