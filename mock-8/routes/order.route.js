const express = require("express")
const bcrypt  = require("bcrypt")
const jwt =  require("jsonwebtoken")
require('dotenv').config()
const cookieParser =  require("cookie-parser")
const cors = require('cors')

const {OrderModel}=  require("../models/Order.model")

const orderRoute = express.Router()
orderRoute.use(express.json())
orderRoute.use(cookieParser())
orderRoute.use(cors())


//order 
orderRoute.post("/orders", async(req,res)=>{
    const {user,restaurant,items,totalPrice,deliveryAddress,status} = req.body
    try{
        let order = new OrderModel({user,restaurant,items,totalPrice,deliveryAddress,status})
        await order.save()
        res.status(201).send({"msg":"order placed"})
    }
    catch(err){
        res.status(401).send(err)
    }
})


//get specific order
orderRoute.get("/orders/:id", async(req,res)=>{
    const id = req.params.id
    console.log(id)
     try{
         let order = await OrderModel.findOne({_id:id})
        
         res.status(201).send({"order":order})
     }
     catch(err){
         res.status(401).send(err)
     }
 })


 //update status
 orderRoute.patch("/orders/:id", async(req,res)=>{
    const id = req.params.id
    const {status} = req.body
     try{
         let order = await OrderModel.findOne({_id:id})
        if(order){
            const filter = {_id:order._id}
            const update = {status:status}
            await OrderModel.findOneAndUpdate(filter,update)
        }
        res.status(202).send("status updated")
     }
     catch(err){
         res.status(401).send(err)
     }
 })



module.exports ={orderRoute}