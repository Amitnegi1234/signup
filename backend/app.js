import express from "express";
import cors from "cors";
import router from "./routes/user.js";
import { db } from "./utils/db.js";
import './models/expense.js'
import './models/user.js'
const app =express();
app.use(cors());
app.use(express.json());
app.use(router);
const port=3000;

db.sync().then(()=>{
    try {
        app.listen(port,()=>{
            console.log(`server is running on port ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
})