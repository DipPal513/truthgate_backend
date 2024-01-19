import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
export const isAuthenticate = async (req, res, next) => {
    try {
        // get token
        const { token } = req?.cookies;
        // verification
        if (!token) {
            return res.status(401).send({ success: false, message: "please login first" });
        }
        // decoding
        const decoded = jwt.verify(token, "thisisjwtsecret");
        // find user
        req.user = await User.findById(decoded._id);
        // next
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "there was error while authenticating..." });
    }
}