import  {Request,Response}  from "express";
import {sendMail} from "../mail/mail";
import { UploadService ,UploadManyService,AllProductsService,DeleteProductService,UpdateProductService,FilterProductService,SortByPrice} from "../services/productService";


const uploadService=new UploadService()
// const uploadManyService=new UploadManyService()
const allProductsService=new AllProductsService()
const deleteProduct=new DeleteProductService()
const updateProduct=new UpdateProductService()
// const filterProduct=new FilterProductService()
const sortByPrice=new SortByPrice()

class UploadController {
  async upload(req: Request, res: Response) {
    const data = req.body;
    const image = req.file?.filename;
    const imageArray = image ? [image] : [];
    try {
      await uploadService.uploadProduct(data, imageArray);
      res.status(200).json({ success: true, message: "Product uploaded successfully" });
    } catch (error) {
      res.status(401).json({ success: false, message: "Server error when Uploading", error });
    }
  }
}



 class UploadManyController {
  constructor(private service = new UploadManyService()) {}

  async uploadMany(req: Request, res: Response) {
    const data = req.body;
    const images = req.files && Array.isArray(req.files)
      ? req.files.map((item) => `http://localhost:7000/images/${item.filename}`)
      : [];

    const product = {
      name: data.name,
      image: images,
      price: data.price,
    };

    try {
      await this.service.uploadMany(data, images);
      sendMail(product);
      res.status(200).json({ success: true, message: "product added successfully" });
    } catch (error) {
      res.status(404).json({ success: false, message: "Error when Uploading", error });
    }
  }
}


  
class AllProductsController{
  async getAll(req:Request,res:Response){
    try {
      const result=await allProductsService.getAll()
    res.status(201).json({result})
    } catch (error) {
      res.json({success:false,message:"Error when getting",error})
    }
  }
}

class DeleteProductController{
  async deleteProduct(req:Request,res:Response){
    const id =req.params.id;
    try {
      await deleteProduct.delete(id)
      res.status(200).json({success:true,message:"Data deleted successfully"})
    } catch (error) {
        res.status(400).json({success:false,message:"Server Error",error})
    }
  }
}



class UpdateProductController{
  async update(req:Request,res:Response){
    const id=req.params.id;
    const data=req.body.data
    try {
      await updateProduct.update(data,id)
      res.status(200).json({success:true,message:"Data Updated successfully"})
    } catch (error) {
      res.status(404).json({success:false,message:"Server error",error})
    }
  }
}


class FilterProductController {
  constructor(private filterProductService: FilterProductService) {}

  async filter(req: Request, res: Response): Promise<void> {
    const data = req.body.filter;

    try {
      const result = await this.filterProductService.filter(data);
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'Server Error',
        error,
      });
    }
  }
}


class SortByPriceController{
  async sort(req:Request,res:Response){
    try {
     const result= await sortByPrice.filterByPrice()
      res.status(200).json({success:true,result})
    } catch (error) {
      res.status(404).json({success:false,message:"Server Error",error})    }
  }
}



export {UploadController,UploadManyController,AllProductsController,DeleteProductController,UpdateProductController,FilterProductController,SortByPriceController}