// require('dotenv').config({path: './env'})
// Above line is correct but this is not a good practice it will break the consistency of the code

import dotenv from "dotenv" // this is partial correct iske sath dotenv ko config bhi krna pdega

import mongoose from "mongoose";
import {DB_NAME} from "./constants.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDB()
// hmne connectDB db folder m index.js m likha h and we use async method, so when async method completes toh vo ek promise bhi return krta h, isliye hm .then() and .catch() use kr rhe h 
// .then m kuch successful rkh lete h 
// .catch m kuch error rkh lete h


.then(() => {
    // abhi tk database se connect hue the ab app listen krega 
    app.listen(process.env.PORT || 8000, () => {
        console.log(` Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
})










/* 1) One of the apporach to connect to DB using try catch, error handling and also database is in different continent we use async await


import express from "express";
const app = express();

;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        // After connecting to the database, we can see listener jo hote h app ke pass. this is the function of express 

        app.on("error", (error) => {
            console.log("Errr:", error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
} )()


2) Another approach is ki hm alag se file le vha saara code likhe vha se function export krae aur index file m sirf usse import krae aur usko execute kr de
*/