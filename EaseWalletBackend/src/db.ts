import mongoose from "mongoose";
import { DB_URL } from "./config";

mongoose.connect(DB_URL);

const userSchema =new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    }
});

 const UserModel = mongoose.model("Users",userSchema);

 export default UserModel;