import jwt from "jsonwebtoken"

export const verifyUser=(req,res,next)=>{
    try{
    const {access_token} = req.headers

    if(!access_token){
        return res.json({success:false,message:"Please login"})
    }

    const decode=jwt.verify(access_token,"mernUser")
    req.body.userId=decode.id
    next()}
    catch(e){
        res.json({success:false,message:e.message})
    }

}