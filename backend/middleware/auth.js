import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authentication=(req,res,next)=>{
    try {
        const token=req.header('Authorization');
        console.log(token);
        const user=jwt.verify(token,process.env.JWT_SECRET);
        console.log('user id:----- ',user.userId);
        User.findByPk(user.userId).then(user=>{
            req.user=user;
            next();
        })
    } catch (error) {
        console.log(error);
        return res.status(401).json({success:false})
    }
}