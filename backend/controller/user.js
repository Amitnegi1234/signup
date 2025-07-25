import User from "../models/user.js";
import bcrypt from "bcrypt"
import Expense from "../models/expense.js";
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
        res.status(200).send("User logged in");
    } catch (error) {
        res.status(500).send("Server error");
    }
}

export const addExpense=async(req,res)=>{
    try {
        const {amount,description,category}=req.body;
        console.log("Received expense data:", req.body);
        const expense=await Expense.create({
            amount:amount,
            description:description,
            category:category
        })
        res.status(201).send("expense added");
    } catch (error) {
        console.error("Error in addExpense:", error);
        res.status(500).send(error);
    }
}

export const showExpense=async(req,res)=>{
     try {
        const expenses = await Expense.findAll();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).send("Error fetching expenses");
    }
}

export const deleteExpense=async(req,res)=>{
    try {
        const { id } = req.params;
        await Expense.destroy({ where: { id:id } });
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting expense" });
    }
}