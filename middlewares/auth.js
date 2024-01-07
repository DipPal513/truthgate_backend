import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
export const isAuthenticate = async (req, res, next) => {
    try {
        const { token } = req?.cookies;
        if (!token) {
            res.satus(401).send({ success: false, message: "please login first" });
        }
        const decoded = jwt.verify(token, "thisisjwtsecret");
        req.user = await User.findById(decoded._id);
        next();
    } catch (error) {
        console.log(error)
    }
}