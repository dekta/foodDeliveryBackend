const express = require("express")
const bcrypt  = require("bcrypt")
const jwt =  require("jsonwebtoken")
require('dotenv').config()
const cookieParser =  require("cookie-parser")
const cors = require('cors')

const {UserModel}=  require("../models/User.model")

const userRouter = express.Router()
userRouter.use(express.json())
userRouter.use(cookieParser())
userRouter.use(cors())


//register 
userRouter.post('/register',async(req,res)=>{
    const {name,email,password,address} = req.body;
    const user =  await UserModel.findOne({email})
    try{
        if(!user){
            bcrypt.hash(password,6, async function(err,hash){
                if(err){
                    res.send({"msg":"server side error"})
                }
                const user = new UserModel({name,email,password:hash,address})
                await user.save()
                res.status(201).send({"msg":"signup done"})
            })
        }
        else{
            res.status(201).send({"msg":"user already exits"})
        }
        
    }
    catch(err){
        res.send(err)
    }
    
})


//login end-point
userRouter.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    const user =  await UserModel.findOne({email})
    const hash = user?.password
    try{
        if(user.email){
            bcrypt.compare(password, hash, function(err, result) {
                if(result){
                    const token = jwt.sign({ email,id:user._id }, process.env.SIGNUP ,{ expiresIn: 60000 });
                    res.cookie("token",token,{httpOnly:true})
                    res.status(201).send({"msg":"login successfully","token":token})
                }
                else{
                    res.status(401).send("invalid email and password")
                }
            });
        }
    }
    catch(err){
        res.send(err)
    }
    
})



//reset Pasword
userRouter.patch('/user/:id/reset',async(req,res)=>{
    const id = req.params.id
    const {currentPassword,resetPassword} = req.body;
    const user =  await UserModel.findOne({_id:id})
    const hash = user?.password
    try{
        bcrypt.compare(currentPassword, hash, function(err, result) {
            if(result){
                //console.log(result)
                bcrypt.hash(resetPassword,6, async function(err,hashreset){
                    if(err){
                        res.send({"msg":"server side error"})
                    }
                    let filter = {_id:id}
                    let update = {password:hashreset}
                    const user = await UserModel.findOneAndUpdate(filter,update)
                    await user.save()
                }) 
                res.send("password reset")
            }
            else{
                res.status(401).send("Invalid password")
            }
        });
        
    }
    catch(err){
        res.send(err)
    }
    
})





module.exports = {userRouter}
