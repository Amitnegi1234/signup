import express from "express";
import { addUser ,loginUser} from "../controller/user.js";
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("home page")
})
router.post("/user/add",addUser)
router.post("/user/login",loginUser)
export default router;