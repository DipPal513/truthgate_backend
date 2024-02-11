import express from 'express';
import { addComment, createPost, deletePost, getPostOfFollowing, likedAndDisLikedPost, updateCaption } from '../controllers/postController.js';
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
// comment
router.put("/post/comment/:id", isAuthenticate, addComment);
// delete post
router.delete("/deletepost/:id", isAuthenticate, deletePost);



export default router;