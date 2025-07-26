import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const addUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                console.log(err);
                return;
            }
            const user=await User.create({
            name:name,
            email:email,
            password:hash
            })
            res.status(201).send(`user with name ${name} added`)
        })
        
    } catch (error) {
        console.log(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).send("Email already exists");
        }
        res.status(500).send(error.message)
    }
}
function generateAccessToken(id){
    return jwt.sign({userId:id},process.env.JWT_SECRET)
}
export const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({
            where:{
                email:email
            }
        })
        if(!user){
            return res.status(404).send("email not found");
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(500).send("password incorrect");
        }
        return res.status(200).json({success:true,message:"User logged in",token:generateAccessToken(user.id)});
    } catch (error) {
        res.status(500).send("Server error");
    }
}

