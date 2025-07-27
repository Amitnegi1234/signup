import express from "express";
import { addUser ,loginUser} from "../controller/user.js";
import { addExpense,showExpense,deleteExpense,getPremiumExpense } from "../controller/expense.js";
import { authentication } from "../middleware/auth.js";
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("home page")
})
router.post("/user/add",addUser)
router.post("/user/login",loginUser)
router.post("/expense/addExpense",authentication,addExpense)
router.get("/expense/show",authentication,showExpense)
router.delete("/expense/delete/:id",deleteExpense)
router.get("/expense/premium/showLeaderBoard",getPremiumExpense)
export default router;