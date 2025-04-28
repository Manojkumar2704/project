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


interface products extends Document{
    name:string,
    description:string,
    price:number,
    quantity:number,
    image:[string],
    created:string
}

const Products=mongoose.model<products>("Products",productModel)
export default Products


