import express, { Request, Response } from 'express';
import { connectToDatabase } from './db/connect';
const Products=require("./model/productModel")
const app = express();
import dotenv from "dotenv"
dotenv.config()
const port =process.env.PORT || 7000;
import userRouter from './Routes/userRoutes';
import productRouter from './Routes/productRouts';
const cors=require("cors")
app.use(express.json());
app.use(cors())
const path = require('path');



connectToDatabase();


app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the backend!');
});
console.log(path.join(__dirname, "uploads/"));
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use("/user",userRouter)
app.use("/product",productRouter)


app.post("/filter",async(req:Request,res:Response)=>{
  const filter=req.body;
  const result=await Products.find().sort({name:1})
  res.send(result)
})



app.listen(port,()=>console.log("connected to port http://localhost:"+port)
)