import bcrypt from "bcrypt";
import prisma from "../prisma.js";
async function handleRegister(req, res) {
    const passwordHash = await bcrypt.hash(req.body.password, 12);
    try{
        const existingEmail = await prisma.user.findUnique({
            where:{email:req.body.email}
        })
        if(existingEmail){
            res.status(409).send({message:"Email already exists"});
            return false;
        }
    }catch(err){
        console.error("Error checking existing email:", err);
        res.status(500).send({message:"Internal server error"});
        return false;
    }
    
    try{
       await prisma.user.create ({
        data:{
            name:req.body.username,
            email:req.body.email,
            password:passwordHash
        }
       });
       res.status(200).send({message:"Registration successful"});
    }catch(err){
        console.error("Error during user registration:", err);
        res.status(500).send({message:"Internal server error"});  
        return false;
    } 
    return true;
}

export { handleRegister };