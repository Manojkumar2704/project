import express, { Request, Response } from 'express';
import { connectToDatabase } from './db/connect';
const app = express();
import dotenv from "dotenv"
dotenv.config()
const port =process.env.PORT || 7000;
import userRouter from './Routes/userRoutes';
import productRouter from './Routes/productRouts';
import cors from "cors"
app.use(express.json());
app.use(cors())
import path from "path"
import fs from "fs"
import Products from './model/productModel';


connectToDatabase();

app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use("/user",userRouter)
app.use("/product",productRouter)


app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the backend!');
});

app.delete("/delete-image/:image",async(req:Request,res:Response)=>{
  const image=req.params.image
  const filename =image.replace("http://localhost:7000/images/","")
  const imagePath=path.join(__dirname,"./uploads",filename)
  fs.unlink(imagePath, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to delete image', error: err });
    }
    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  });
})

app.delete("/delete-image-db", async (req: Request, res: Response) => {
  const imageUrl = req.query.image as string;
  const productId = req.query.id as string; 
  try {

    await Products.updateOne(
      { _id: productId },
      { $pull: { image: imageUrl } }
    );

    res.status(200).json({ success: true, message: "Image deleted from database successfully" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (dbErr:any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete image from database",
      error: dbErr.message,
    });
  }
});



// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// app.put("/product/updateproductt/:id", upload.array("images"), async (req: Request, res: Response) => {
//   const { name, description, price, quantity } = req.body;
//   const files = req.files as Express.Multer.File[];

//   const images = files?.map(file => `http://localhost:7000/images/${file.filename}`);

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const updateFields: any = {
//     $set: {
//       name,
//       description,
//       price: parseFloat(price),
//       quantity: parseInt(quantity),
//     },
//   };
  
//   if (images && images.length > 0) {
//     updateFields["$push"] = { image: { $each: images } };
//   }

//   const result=await Products.updateOne({ _id: req.params.id }, updateFields);
//   res.send(result)
// });

app.listen(port,()=>console.log("connected to port http://localhost:"+port)
)