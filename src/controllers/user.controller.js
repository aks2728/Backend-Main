import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {

    // 1) Get user details from frontend
    const {fullName, email, username, password} = req.body // req.body m sara ka sara data aajata h jo ki by default express provide krata h
    console.log("email: ", email);

    // 2) Validation -- non empty fields
    /*
    if(fullName === ""){
        throw new ApiError(400, "Full Name is required")
    }
        similarly for other fields
    */

    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // 3) check if user already exists with same email or username
    // User.findOne({email}) -- this is also correct but we want ki agr dono m se koi bhi match kr jaye toh bhi hume pata chal jae isliye hum $or operator use kr rhe h
    const existedUser = User.findOne({
        $or: [{ email }, { username }]
    })

    if(existedUser) {
        throw new ApiError(409, "User already exists with same email or username")
    }

    // 4) Check for files (avatar and coverImage)
    // similarly jaise hum req.body se data le rhe h waise hi hum req.files se files le skte h jo multer middleware provide krata h

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) { // bcz we set required: true for avatar in user.model.js file
        throw new ApiError(400, "Avatar image is required")
    }

    // 5) Upload them to cloudinary
    // you see in our cloudinary.js file humne ek function banaya h uploadOnCloudinary jo ki localfilepath lega aur usse cloudinary pr upload kr dega aur fir uska url return kr dega
    // That's why hmne avatarLocalPath and coverImageLocalPath banaya h upar

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) { 
        throw new ApiError(400, "Could not upload avatar image. Please try again later.")
    }

    // 6) create user object -- entry in database

    const user = await User.create({
        fullName,
        email,
        username: username.toLowercase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "" // cover image is optional ( agr user ne coverImage nhi diya toh code crash ho skta tha ) that's why we use optional chaining ki agr user ne coverImage nhi diya toh empty stiring return krdo
    })
    
    // 7) return user object to frontend (without password and refreshToken)
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // 8) Check for user Creation
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user. Please try again later.")
    }

    // 9) Return Response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})


export { registerUser }