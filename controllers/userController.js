import User from '../models/user.model.js'
import bcrypt from "bcrypt"

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
        res.status(201).cookie("token", token, { expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), httpOnly: true }).json({
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
        return res.status(200).send({ success: true, message: "Logged out.." })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Error in logout.." })

    }
}