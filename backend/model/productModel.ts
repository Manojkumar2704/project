import mongoose from "mongoose"

const productModel=new mongoose.Schema({
    name:String,
    description:String,
    price:Number,
    quantity:Number,
    image:String
})
const Products=mongoose.model("Products",productModel)
export default Products;
