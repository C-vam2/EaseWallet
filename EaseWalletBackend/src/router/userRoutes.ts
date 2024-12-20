import express from "express";
import {z} from 'zod';
import UserModel from "../db";
import bcrypt from "bcrypt";

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config";

const userRouter = express.Router();

userRouter.post('/signup',async(req,res)=>{
    try {
        console.log(req.body)
        const email = req.body.email;
        const password = req.body.password;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        const User = z.object({
            email:z.string().email(),
            password:z.string().min(6).max(25).refine((val)=>{
                let n = val.length;
                let isSmallPresent = false;
                let isCapPresent = false;
                for(let i=0;i<n;i++){
                    if(val[i]>='A' && val[i]<'Z')
                        isCapPresent=true;
                    if(val[i]>='a' && val[i]<'z')
                        isSmallPresent=true;
                }
                return isSmallPresent && isCapPresent;
            },{message:"Password must contain atleast on capital and one small character."}),
            firstName:z.string().min(5).max(20),
            lastName:z.string().min(5).max(20)
        });
        User.parse({
            email,
            password,
            firstName,
            lastName
        });
        const hash =await bcrypt.hash(password,5);
        if(!hash)throw new Error();

        const user = await UserModel.create({
            email,password:hash,firstName,lastName
        });

        if(!user)throw new Error();
        
        const userId = user._id;
        const token = jwt.sign({
            userId
        },JWT_SECRET);
        
        res.status(200).json({
            messsage:"User created successfully",
            token
        })

    } catch (err) {
        console.log(err);
        res.status(411).json({message:"Email already taken / Incorrect inputs"});
    }
});

userRouter.post('/signin',async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await UserModel.findOne({email});
        if(!user){
            res.status(411).json({message:"User do not exist"});
            return;
        }

        const comparedPass = await bcrypt.compare(password,user.password);

        if(!comparedPass){
            res.status(411).json({message:"Incorrect credentials"});
            return;
        }
        const userId = user._id;
        const token = jwt.sign({id:userId},JWT_SECRET);

        

        res.status(200).json({
            token
        })

    } catch (error) {
        res.status(411).json({message:"Error while logging in"});
    }
})

export default userRouter;