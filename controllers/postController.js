import Post from "../models/post.model.js"
import User from "../models/user.model.js";


// create

export const createPost = async (req, res) => {
    try {
        // storing post data
        const newPostData = {
            caption: req.body.caption,
            image: {
                url: "req.body.url",
                public_id: "req.body.public_id"
            },
            owner: req.user._id
        }
        // creating new post
        const newPost = await Post.create(newPostData);
        // finding user by id for storing post of own
        const user = await User.findById(req?.user?._id);
        // pushing post to user
        user.posts.push(newPost?._id);
        //finally saving user
        await user.save();
        // sending data
        res.status(200).send({ success: true, post: newPost })

    }
    catch (error) {
        // error
        res.status(500).send({
            success: false,
            message: "error in post creating",
        })
    }
}

// delete 
export const deletePost = async (req, res) => {
    try {
        // finding post by id
        const post = await Post.findById(req.params.id);

        console.log("req user", req.user._id);
        console.log("req id", req.params.id);
        console.log(post.caption)
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
        console.log("index", index);
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
        console.log(req.params.id);
        const post = await Post.findById(req.params.id);
        console.log(req.user);
        if (!post) {
            res.status(404).send({ success: false, message: "Post not found.." })
        }
        if (post?.likes?.includes(req.user._id)) {
            const index = await post.likes;
            post.likes.splice(index, 1);
            await post.save();
            return res.status(200).send({ success: true, message: "post unliked" })
        }
        else {

            await post?.likes?.push(req.user._id);
            await post.save()
            res.status(200).send({ success: true, message: "Post Liked" })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Opps something went wrong.." })
    }
}

// 
export const getPostOfFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const posts = await Post.find({
            owner: { $in: user.following }
        })
        res.status(200).json({ success: true, message: "success", posts })
    } catch (error) {
        console.log(error);
    }
}


