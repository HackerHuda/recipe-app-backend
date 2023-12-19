import User from "../models/model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const register=async(req,res)=>{
    const{Name,email,password}=req.body;
    console.log(req.body);


const userExists=await User.findOne({email});

if(userExists){
    return res.status(400).json({
        success:false,
        message:"User already exists for tis email"
    
    })
}
const hashedPassword = await bcrypt.hash(password, 10);

const user= await User.create({
    Name,
    email,
    password:hashedPassword

});

await user.save();
res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
  });
}

const login=async(req,res)=>{
    const {email,password}=req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if(!user){
        return res.status(400).json({
            success:false,
            message:"USER DOES NOT EXIST OR PASSWORD DOEST NOT MATCH"
                })
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            success:false,
            message:"wrong password"
        });
    }
    
    else{
        const token =jwt.sign({id:user._id},"secret");
        res.status(200).json({token, userId:user._id});
        }
    }

export {
    register,
    login
}