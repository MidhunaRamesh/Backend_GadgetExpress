const User=require("./../Models/signupModels");
const signupUser=async(req,res)=>{
    try{
        const{firstname,lastname,email,phone,password}=req.body;
        const newUser=new User({
            firstname,
            lastname,
            email,
            phone,
            password,
        });
        const savedUser=await newUser.save();
        res.status(201).json({message:"User Registered successfully",data:savedUser});
    }
    catch(error)
    {
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }

};
module.exports={
    signupUser,
}