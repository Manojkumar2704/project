import mongoose from "mongoose"

const productModel=new mongoose.Schema({
    name:String,
    description:String,
    price:Number,
    quantity:Number,
    image:[String],
    created: {type:Date, default:Date.now},
})
const Products=mongoose.model("Products",productModel)
module.exports=Products
