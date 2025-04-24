import  express  from "express";
import { uploadProduct,uploadProducts,allproducts,deleteProduct,updateProduct } from "../controllers/productController";
import upload from "../middleware/upload";
const authmiddleware=require("../middleware/auth")
const productRouter=express.Router()

productRouter.post("/upload",upload.single("image"),authmiddleware,uploadProduct)
productRouter.post("/uploads",upload.array("images",10),authmiddleware,uploadProducts)
productRouter.get("/allproducts",authmiddleware,allproducts)
productRouter.delete("/deleteproduct/:id",authmiddleware,deleteProduct)
productRouter.put("/updateproduct/:id",authmiddleware,updateProduct)

export default productRouter
