 import bcryptjs from "bcrypt"
import User from "../models/usermodel.js";
import Listing from "../models/listingmodel.js";

 const test = (req,res)=>{
    res.send("API is working");
}

const updateUser=async(req,res)=>{
    const {access_token}=req.headers
    if(req.body.userId!==req.params.id){
        res.json({success:false,message:"you can update only your account"})
    }
    try{
        if(req.body.password){
            req.body.password=bcryptjs.hashSync(req.body.password,10)
        }

        const updateUser = await User.findByIdAndUpdate(req.body.userId,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar
            }
        },{new:true})

        const {password, ...rest}= updateUser._doc
        res.json({success:true,message:access_token,userInfo:rest})


    }catch(e){
        res.json({sucess:false,message:e.message})
    }
}

const deleteUser = async(req,res)=>{
    if(req.body.userId !==req.params.id){
        res.json({success:false,message:"you can delete only your account"})
    }
    try{
        await User.findByIdAndDelete(req.body.userId)
        res.json({success:true,message:"User deleted successfully"})
    }catch(e){
        res.json({success:false,message:e.message})
    }
}

const userListings=async(req,res)=>{
    if(req.body.userId ===req.params.id){
        try{
            const listings = await Listing.find({userRef:req.body.userId})
            res.json({success:true,message:listings})
        }catch(e){
            res.json({success:false,message:e.message})
        }

    }else{
        res.json({success:false,message:"You can only view your own listings!"})
    }

}

const getUser=async(req,res)=>{
    try{
    const user = await User.findById(req.params.id)
    if(!user){
        res.json({success:false,message:"User not found"})
    }
    const {password:pass, ...rest}= user._doc
    res.json({success:true,message:rest})}
    catch(err){
        res.json({success:false,message:err.message})
    }

}
export {test,updateUser,deleteUser,userListings,getUser}