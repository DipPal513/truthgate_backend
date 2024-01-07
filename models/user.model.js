import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, "UserName is required"]
    },
    avatar: {
        public_id: String,
        url: String
    },
    email: {
        type: String,
        unique: [true, "email already exists"],
        require: [true, "email is required"]

    },
    password: {
        type: String,
        require: [true, "password is required"]
    },
    posts: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Post",
        }
    ],
    followers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        }
    ],
    following: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        }
    ],
});

// userSchema.pre("save", async function (next) {
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, 8);
//     }
//     next();
// });

// userSchema.methods.matchPassword = async function (password) {
//     return await bcrypt.compare(password, this.password);
// };

userSchema.methods.generateToken = async function () {
    return jwt.sign({ _id: this._id }, "thisisjwtsecret");
};


const User = mongoose.model("User", userSchema);

export default User;