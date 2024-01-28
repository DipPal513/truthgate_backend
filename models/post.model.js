import mongoose from 'mongoose';


const postSchema = new mongoose.Schema({
    caption: String,
    image: {
        public_id: String,
        url: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        comment: {
            type: String,
            require: true
        }
    }],
    likes: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    }],
}, { timestamps:true });



const Post = mongoose.model("Post", postSchema);

export default Post;