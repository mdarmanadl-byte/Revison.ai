const express = require('express')
const router = express.Router()
const prisma= require('../config/prisma.js')

router.post('/register', async(req, res) => { 
        const {email, name, password} = req.body;
        
        console.log(email, name, password)
        try{
            if(!email || !name || !password) {
              return  res.status(400).json({error:"Missing required fields"})
            }
            const existingUser = await prisma.user.findUnique({
                    where:{
                        email:email
                    }
             })
             if (existingUser) {
                return res.status(400).json({error:"User already exists"})
             }
         
            const result= await prisma.user.create({
            data:{
                email:email,
                name:name,
                password:password
            }
        })
            return res.status(200).json({message:result})
        }
        catch(err){
            res.status(500).json({error:err.message})
        }

}
)
router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    if (!email || !password) {
        return res.status(400).json({error:"Missing required fields"})
    }
    try{
        const emailexist= await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!emailexist) return res.status(400).json({error:"email doesnot exist"})
        if(emailexist.password!==password.trim("")) return res.status(400).json({error:"password is incorrect"})
        return res.status(200).json({message:"Login successful" , user:emailexist})
    }
    catch(err){
        return res.status(500).json({error:err.message})
    }
})
router.get('/',async(req,res)=>{
    const result=await prisma.user.findMany()
    res.json(result)
})
module.exports= router