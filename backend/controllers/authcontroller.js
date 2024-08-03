import User from './../models/usermodel.js'
import bcryptjs from 'bcrypt'
import jwt from 'jsonwebtoken'

const signup=async(req,res)=>{
    const {username,email,password} = req.body
    try{
      const hashPass=bcryptjs.hashSync(password,10)
      const newUser = new User({username,email,password:hashPass})
      await newUser.save()
      res.json({success:true,message:"user created successfully!!"})
    }
    catch(err){
        res.json({success:false,message:err.message})
    }
    
}

const signin= async(req,res)=>{
  const {email,password} = req.body
  try{
    const validUser = await User.findOne({email})
    if(!validUser){
      return res.json({success:false,message:"Email does not exist"})
    }
    const validPass = bcryptjs.compareSync(password,validUser.password)
    if(!validPass){
      return res.json({success:false,message:"Password doesn't match"})
    }
    const token = jwt.sign({id:validUser._id},"mernUser")
    const {password:pass,...userInfo}=validUser._doc
    res.json({success:true,message:token,userInfo})
  }
  catch(err){
    res.json({success:false,message:err.message})
  }
}

const google = async(req,res)=>{
  try{
    const user = await User.findOne({email:req.body.email})
    if(user){
      const token = jwt.sign({id:user._id},"mernUser")
      const {password:pass,...userInfo}=user._doc
      res.json({success:true,message:token,userInfo})
    }
    else{
      const genPass = Math.random().toString(36).slice(-8)
      const hashPass = bcryptjs.hashSync(genPass,10)
      const name = req.body.name
      const username = name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4)
      const newUser = new User({username,email:req.body.email,password:hashPass,avatar:req.body.photo})
      await newUser.save()
      const token = jwt.sign({id:newUser._id},"mernUser")
      const {password:pass,...userInfo}=newUser._doc
      res.json({success:true,message:token,userInfo})
    }
  }
  catch(err){
    res.json({success:false,message:err.message})
  }
}

export {signup,signin,google}