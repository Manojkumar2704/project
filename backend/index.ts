/* eslint-disable @typescript-eslint/no-empty-object-type */
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



connectToDatabase();

app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use("/user",userRouter)
app.use("/product",productRouter)



app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the backend!');
});


// app.delete('/delete-image', async (req: Request<{}, {}, {}, { imageUrl?: string, productId?: string }>, res: Response) => {
//   const { imageUrl, productId } = req.query;
//   try {
//     const filename = (imageUrl as string).replace(`${process.env.URL}/images/`, '');
//     const imagePath = path.join(__dirname, './uploads', filename);

//     fs.unlink(imagePath, async (err) => {
//       if (err) {
//         return res.status(500).json({ success: false, message: 'Failed to delete image from the file system', error: err.message });
//       }
//       try {
//         const result = await Products.updateOne(
//           { _id: productId },
//           { $pull: { image: imageUrl } }
//         );
//         if (result.modifiedCount > 0) {
//           return res.status(200).json({ success: true, message: 'Image deleted successfully from both file system and database' });
//         } else {
//            res.status(404).json({ success: false, message: 'Product not found or image not associated' });
//         }
//       } catch (dbError) {
//         res.status(500).json({ success: false, message: 'Failed to update database', dbError});
//       }
//     });
//   } catch (error) {

//      res.status(500).json({ success: false, message: 'Error deleting image', error});
//   }
// });


app.listen(port,()=>console.log("connected to port http://localhost:"+port)
)