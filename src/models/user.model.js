import mongoose, {Schema} from "mongoose";
// jwt is a bearer token jo hum authentication(chabi ki trh use krte h) k liye use krte h 
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String, // cloudinary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String, // will see later on this why String type
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String
    }

}, {timestamps: true});


// Hash password before saving the user
// we use async function here because arrow function m this keyword ka access nhi hota and we need this keyword here to access userSchema
userSchema.pre("save", async function (next) {

    if(!this.isModified("password")) { return next(); }

    // we need one if condition here because jab bhi user kuch bhi update krega tab bhi ye pre save middleware call hoga and password firse hash ho jayega jo ki sahi nhi hoga isliye hum check kr rhe h ki kya password modify hua h ya nhi

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// 
userSchema.methods.isPasswordCorrect = async function (password) {
    // bcrypt.compare jo ek promise return krta h jisme true ya false hota h, true mtlb password match kr gya and false mtlb nhi kr gya
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}


userSchema.methods.generateRefreshToken = function (){
    return jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const User = mongoose.model("User", userSchema);