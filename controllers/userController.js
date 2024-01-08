import User from '../models/user.model.js';
import bcrypt from "bcrypt";

// register
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(500).send({ success: false, message: "user already exists please login.." })
        }
        const encryptedPass = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            username, email, password: encryptedPass, avatar: { public_id: "sample id", url: "sample url" }
        });
        // token generation
        const token = await newUser.generateToken();
        res.status(201).cookie("token", token, { expires:"7d", httpOnly: true }).json({
            success: true,
            message: "User logged in!",
            user: newUser,
            token
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, messae: "user register failed..", error })
    }
}
// login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // if user not found
        if (!user) {
            return res.send({
                success: false,
                message: "User does not exist. Please register."
            });
        }

        // password validation
        const isValidPass = await bcrypt.compare(password, user.password);
        console.log("Password validation", isValidPass);

        if (!isValidPass) {
            console.log('Invalid password');
            return res.status(401).send({ success: false, message: "Password does not match." });
        }

        // token generation
        const token = await user.generateToken();
        res.status(200).cookie("token", token, { expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), httpOnly: true }).json({
            success: true,
            message: "User logged in!",
            user,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

// follow user
export const follow_unfollow_User = async (req, res) => {
    try {
        // finding id
        const userTofollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);
        // if not found
        if (!userTofollow) {
            return res.status(404).send({ success: false, message: "User not found.!" })
        }
        // checking if already followed
        if (loggedInUser.following.includes(userTofollow._id)) {
            const indexOfFollowing = loggedInUser.following.indexOf(userTofollow._id);
            const indexOfFollowers = userTofollow.followers.indexOf(loggedInUser._id);


            loggedInUser.following.splice(indexOfFollowing, 1);
            userTofollow.followers.splice(indexOfFollowers, 1);

            loggedInUser.save()
            userTofollow.save()
            return res.status(200).send({ success: true, messae: "user UnFollowed" });
        } else {
            // changing follow status
            loggedInUser.following.push(userTofollow._id);
            userTofollow.followers.push(loggedInUser._id);
            // save
            await loggedInUser.save()
            await userTofollow.save();
            // finally
            return res.status(200).send({ success: true, messae: "user followed" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, messae: "Error in following..." });
    }
}

// logout 
export const logoutUser = async (req, res) => {
    try {
        return res.status(200).cookie("token", null, { httpOnly: true, expires: 0 }).send({ success: true, message: "Logged out.." })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Error in logout.." })
    }
}

// update password
export const updatePassword = async (req, res) => {
    try {
        // 
        const user = await User.findById(req.user._id);
        const { oldPassword, newPassword } = req.body;
        // comparing with stored password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        console.log(oldPassword);
        if (!user) {
            res.status(500).send({ success: false, message: "Please login first" });

        }
        if (!isMatch) {
            return res.status(400).send({ success: false, message: "Wrong old password.." });
        }
        if (!oldPassword || !newPassword) {
            return res.status(400).send({ success: false, message: "Please enter old and new password" });
        }
        // hasing new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).send({ success: true, message: "successfully changed the password" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "error in updating password" });
    }
}

// update profile
export const updateProfile = async (req, res) => {
    try {
        // 
        const user = await User.findById(req.user._id);
        // 
        const { username, email } = req.body;
        //    if username and email are found
        if (username) {
            user.username = username;
        }
        if (email) {
            user.email = email;
        }
        await user.save();
        return res.status(200).send({ success: true, message: "Profile Updated successfully.." });

    } catch (error) {

        console.log(error);

        res.status(500).send({ success: false, message: "Profile update failed.." });

    }
}

// delete profile

export const deleteMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        console.log(user)
        const posts = user.posts;

        await User.findByIdAndDelete(req.user._id);
        // logout user after deleting profile

        res.cookie("token", null, { expires: 0, httpOnly: true });
        // deleting all post of user
        for (let i = 0; i < posts.length; i++) {
            const post = await Post.findById(posts[i]);
            await post.remove();
        }
        return res.status(200).json({ success: true, message: "profile deleted!" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "error in deleting profile" })
    }
}

// my profile

export const myProfile = async (req,res) =>{
    try {
        const user = await User.findById(req.user._id).populate("posts")  
        res.status(200).send({
            success:true,
            message:"View profile!",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in viewing profile!"
        })
    }
}