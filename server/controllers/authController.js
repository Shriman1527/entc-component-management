import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register= async(req,res)=>{

    try{
        const{name,email,password,role,rollNo}= req.body;

        const existing = await User.findOne({email});
        if(existing) return res.status(400).json({message:"User Exists"});

        const hashed= await bcrypt.hash(password,10);
        const user= await User.create({name,email,password:hashed,role,rollNo});
        res.status(201).json(user);


    }
    catch(err){
        res.status(500).json({message:err.message});

    }
}

export const login= async (req,res)=>{

    try{

        const {email,password}= req.body;
        const user= await  User.findOne({email});
        if(!user)
            return res.status(404).json({message:"User not found"});


        const match= await bcrypt.compare(password,user.password);

        if(!match)
            return res.status(404).json({message:"Wrong Password"});


        const token= jwt.sign({id:user._id,role:user.role}, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({token,role:user.role,name:user.name});

        }catch(err){
            res.status(500).json({message:err.message});
            
        }
}
