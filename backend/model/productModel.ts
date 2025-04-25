import mongoose from "mongoose"

const productModel=new mongoose.Schema({
    name:String,
    description:String,
    price:Number,
    quantity:Number,
    image:[String],
    created: {type:String, default:()=>{
    return `${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`;
    }},
})
const Products=mongoose.model("Products",productModel)
module.exports=Products


