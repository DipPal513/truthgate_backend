import express from 'express';
import { createPost, deletePost, getPostOfFollowing, likedAndDisLikedPost, updateCaption } from '../controllers/postController.js';
import { isAuthenticate } from '../middlewares/auth.js';

const router = express.Router();

// post upload
router.post("/post/upload", isAuthenticate, createPost);
// get post of following
router.get("/posts", isAuthenticate, getPostOfFollowing);
// update caption
router.put("/post/:id", isAuthenticate, updateCaption);
// get post by id and like
router.get("/post/:id", isAuthenticate, likedAndDisLikedPost);
// delete post
router.delete("/deletepost/:id", isAuthenticate, deletePost);



export default router;