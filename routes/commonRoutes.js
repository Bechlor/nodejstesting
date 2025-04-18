import express from "express"
import uploadRouter from "../routes/userSide/upload.js"
export const intializeRoute =(app)=>{
const apiRoute = express.Router();

apiRoute.use("/uploads",uploadRouter)

app.use("/api",apiRoute)
}