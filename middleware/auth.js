import jwt from 'jsonwebtoken'


export const auth=async(req,res ,next)=>{
    try{
        const authHeader=req.headers["authorization"]
        if(!authHeader){
            return res.status(400).json({success:false,message:"authheader not found"})
        }
        const token = authHeader.split(" ")[1];
        console.log(token)
        if(!token){
            return res.status(400).json({success:false,message:"token not found"})
        }
        const response = jwt.verify(token,process.env.SECRET_KEY )
        req.user=response;
        console.log(response)
        return res.status(200).json({success:true,message:"token verified"})
        next();

    }
    catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}