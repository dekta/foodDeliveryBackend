const express = require("express")
const bcrypt  = require("bcrypt")
const jwt =  require("jsonwebtoken")
require('dotenv').config()
const cookieParser =  require("cookie-parser")
const cors = require('cors')

const {RestaurantModel}=  require("../models/Restaurant.model")

const RestRoute = express.Router()
RestRoute.use(express.json())
RestRoute.use(cookieParser())
RestRoute.use(cors())


//add restaurant
RestRoute.post("/restaurants/add", async(req,res)=>{
    const {name,address,menu} = req.body
    try{
        let rest = new RestaurantModel({name,address,menu})
        await rest.save()
        res.status(201).send({"msg":"added"})
    }
    catch(err){
        res.status(401).send(err)
    }
})


//get all restaurant
RestRoute.get("/restaurants",async (req,res)=>{
    try{
        let restaurant = await RestaurantModel.find()
        res.status(200).send(restaurant)

    }
    catch(err){
        res.status(401).send("server error")
    }
})

//specific restaurant
RestRoute.get("/restaurants/:id",async (req,res)=>{
    const id =  req.params.id
    try{
        let restaurant = await RestaurantModel.findOne({_id:id})
        res.status(200).send(restaurant)

    }
    catch(err){
        res.status(401).send("server error")
    }
})


// sepecific restaurant menu
RestRoute.get("/restaurants/:id/menu",async (req,res)=>{
    const id =  req.params.id
    try{
        const restaurant = await RestaurantModel.findOne({_id:id})
        const menu = restaurant.menu
        res.status(200).send(menu)

    }
    catch(err){
        res.status(401).send("server error")
    }
})



//add item in menu
RestRoute.post("/restaurants/:id/menu",async (req,res)=>{
    const id =  req.params.id
    const {name,description,price,image} = req.body
    try{
        const restaurant = await RestaurantModel.findOne({_id:id})
        const item= {name,description,price,image}
        console.log(item)
        await restaurant.menu.push(item)
        await restaurant.save()
        console.log("rest",restaurant)
        res.status(200).send("item added in menu")

    }
    catch(err){
        res.status(401).send("server error")
    }
})



//delete item from menu
RestRoute.delete("/restaurants/:id/menu/:menuid",async (req,res)=>{
    const id =  req.params.id
    const menuid = req.params.menuid
    
    try{
        const restaurant = await RestaurantModel.findOne({_id:id})
        let menu = restaurant.menu

        menu.forEach(async(ele,i)=>{
            if(ele._id==menuid){
                menu.splice(i,1)
                await restaurant.save()
                res.status(202).send("item deleted from menu")
            }
        })   

    }
    catch(err){
        res.status(401).send("server error")
    }
})





module.exports = {RestRoute}