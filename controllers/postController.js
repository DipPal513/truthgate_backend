import Post from "../models/post.model.js"
import User from "../models/user.model.js";
import {v2 as cloudinary} from 'cloudinary';

// create
export const createPost = async (req, res) => {
    console.log(req.body);
    try {
        // Check if both image and caption are not provided
        if (!req.body.image && !req.body.caption) {
            return res.status(400).json({ success: false, message: "Photo or text must be provided." });
        }

        let imageUrl = null;
        let publicId = null;

        // If image is provided, upload it to cloudinary
        if (req.body.image) {
            const myCloud = await cloudinary.uploader.upload(req.body.image, {
                folder: "posts"
            });
            imageUrl = myCloud.secure_url;
            publicId = myCloud.public_id;
        }

        // Create post data
        const newPostData = {
            caption: req.body.caption || "", // Caption might not be provided
            image: imageUrl ? { url: imageUrl, public_id: publicId } : null,
            owner: req.user._id
        };

        // Create new post
        const newPost = await Post.create(newPostData);

        // Find user by id for storing post of own
        const user = await User.findById(req?.user?._id);

        // Push post to user
        user.posts.push(newPost?._id);

        // Finally, save user
        await user.save();

        // Send response
        return res.status(200).json({ success: true, message: "Successfully posted!", post: newPost });
    } catch (error) {
        console.log(error);
        // Error
        res.status(500).json({ success: false, message: "Error in post creating" });
    }
};


// delete 
export const deletePost = async (req, res) => {
    try {
        // finding post by id
        const post = await Post.findById(req.params.id);


        // if not found
        if (!post) {
            return res.status(404).send({ success: false, message: "post not found!" })
        }
        // if user not matched
        if (post.owner.toString() !== req.user._id.toString()) {
            //    
            return res.status(401).json({
                success: false,
                message: "unauthorized"
            })
        }
        // finally post removing
        Post.findByIdAndDelete(req.params.id);

        const user = await User.findById(req?.user._id);
        const index = user.posts.indexOf(req.params.id);

        //    
        user.posts.splice(index, 1);
        await user.save()
        // 
        return res.status(200).json({
            success: true,
            message: "Post deleted..."
        })

    } catch (error) {
        console.log(error);

        return res.status(200).json({
            success: false,
            message: "Post deletation failed..."
        })
    }
}

// update 
export const updatePost = async (req, res) => {
    console.log('update post');
}

// like and dislike
export const likedAndDisLikedPost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send({ success: false, message: "Post not found.." })
        }
        if (post.likes.includes(req.user._id)) {
            const index = await post.likes;
            post.likes.splice(index, 1);
            await post.save();
            return res.status(200).send({ success: true, message: "post unliked", liked: false })
        }
        else {
            await post?.likes?.push(req.user._id);
            await post.save()
            res.status(200).send({ success: true, message: "Post Liked", liked: true });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Opps something went wrong.." })
    }
}

// getting post of whom i follow
export const getPostOfFollowing = async (req, res) => {
    try {
        // 
        const id = req.user._id;
        const user = await User.findById(id);
     
        if (!user) {
            return res.status(500).send({ success: false, message: "Unauthorized" })
        }
        // 
        const posts = await Post.find({
            owner: { $in: user.following }
        }).populate("owner likes comments.user");

        return res.status(200).json({ success: true, message: "success", posts:posts.reverse() });
    } catch (error) {
        console.log(error);
    }
}

// add comment
export const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comment = req.body.comment;

        // Check if the post exists
        if (!post) {
            return res.status(404).send({ success: false, message: "post not found" });
        }

        // Check if the comment exists
        let commentExists = -1;

        if (post.comments) {
            post.comments.forEach((item, index) => {
                if (item.user && item.user.toString() === req.user._id.toString()) {
                    commentExists = index;
                }
            });
        }

        if (commentExists !== -1) {
            // Comment exists, update it
            post.comments[commentExists].comment = comment;
            await post.save();
            return res.status(200).send({ success: true, message: "comment updated", comment });
        } else {
            // Comment does not exist, add a new one
            post.comments.push({ user: req.user._id , comment });
            await post.save();
            return res.status(201).send({ success: true, message: "commented!", comment });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "there was an error while commenting..!" });
    }
};

// update caption
export const updateCaption = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // if post not found
        if (!post) {
            return res.status(404).send({ success: false, message: "Post not found" });
        }
        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(500).send({ success: false, message: "Unauthorized access!" });
        }
        post.caption = req.body.caption;
        await post.save();
        return res.status(200).send({ success: true, message: "post updated" });


    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "error in updating post" });


    }
}

