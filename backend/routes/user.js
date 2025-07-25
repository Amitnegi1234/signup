import express from "express";
import { addUser ,loginUser,addExpense,showExpense,deleteExpense} from "../controller/user.js";
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("home page")
})
router.post("/user/add",addUser)
router.post("/user/login",loginUser)
router.post("/expense/addExpense",addExpense)
router.get("/expense/show",showExpense)
router.delete("/expense/delete/:id",deleteExpense)
export default router;