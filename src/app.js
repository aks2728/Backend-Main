import express from "express"; // express se usually ek app bnti h 
import cookieParser from "cookie-parser";
// use of this cookieparser is that ki m apne server se browser ki cookie access aur set kr pau
import cors from "cors";

const app = express()

// To config cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

app.use(cookieParser())


// Route Import
import userRouter from "./routes/user.routes.js"

// Router Declaration
app.use("api/v1/users", userRouter)



export { app }