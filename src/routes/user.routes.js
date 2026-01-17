import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
    // register route pr koi bhi request kr rha h to registerUser function call hojata h but i want ki usse phle method toh execute ho jae pr jate hue mujhse mil kr jae isliye mai koi middleware use krunga 
    // upload is middleware jo ki multer se aaya h 
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)


export default router;