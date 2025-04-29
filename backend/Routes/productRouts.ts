import express from "express";
import { 
  UploadManyController, 
  UploadController, 
  DeleteProductController, 
  UpdateProductController, 
  FilterProductController, 
  SortByPriceController, 
  AllProductsController 
} from "../controllers/productController";
import upload from "../middleware/upload";
import authmiddleware from "../middleware/auth";
import { FilterProductService } from "../services/productService"; 

const productRouter = express.Router();
const filterProductService = new FilterProductService();
const uploadProducts = new UploadManyController();
const uploadProduct = new UploadController();
const allproducts = new AllProductsController();
const deleteProduct = new DeleteProductController();
const updateProduct = new UpdateProductController();
const filterproduct = new FilterProductController(filterProductService); 
const filterbyprice = new SortByPriceController();

productRouter.post("/upload", upload.single("image"), authmiddleware, uploadProduct.upload);
productRouter.post("/uploads", upload.array("images", 10), authmiddleware, (req, res) => uploadProducts.uploadMany(req, res));
productRouter.get("/allproducts", authmiddleware, allproducts.getAll);
productRouter.delete("/deleteproduct/:id", authmiddleware, deleteProduct.deleteProduct);
productRouter.put("/updateproduct/:id", authmiddleware, updateProduct.update);
productRouter.post("/filter", authmiddleware, filterproduct.filter);
productRouter.post("/sort", authmiddleware, filterbyprice.sort);

export default productRouter;
