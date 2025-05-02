import  {Request,Response}  from "express";
import {sendMail} from "../mail/mail";
import { UploadService,getOneProductService ,UploadManyService,AllProductsService,DeleteProductService,UpdateProductService,FilterProductService,SortByPrice} from "../services/productService";
import dotenv from "dotenv"
dotenv.config()
import path from "path"
import fs from "fs"
import Products from "../model/productModel";

const uploadService=new UploadService()
// const uploadManyService=new UploadManyService()
const allProductsService=new AllProductsService()
const deleteProduct=new DeleteProductService()
const updateProduct=new UpdateProductService()
const filterProduct=new FilterProductService()
const getoneProduct=new getOneProductService()
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
      ? req.files.map((item) => `${process.env.URL}/images/${item.filename}`)
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
class getOneProductController{
  async getOne(req:Request,res:Response){
    const id=req.params.id
    try {
      const result=await getoneProduct.getOne(id)
      res.send(result)
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



class UpdateProductController {
  update = async (req: Request, res: Response): Promise<void> => {
    const data = req.body;
    const id=req.params.id;
    const files = req.files as Express.Multer.File[];
  
    const images = files?.map(file => `${process.env.URL}/images/${file.filename}`);
    try {
       await updateProduct.update(data,images, id);
      res.status(200).json({ success: true, message: "Data updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error });
    }
  };
}

export const updateProductController = new UpdateProductController();




class FilterProductController {
  // constructor(private filterProductService: FilterProductService) {}

  async filter(req: Request, res: Response): Promise<void> {
    const data = req.body.filter

    // try {
      const result = await filterProduct.filter(data);
      res.status(200).json({ success: true, result });
    // } catch (error) {

      // res.status(404).json({
      //   success: false,
      //   message: 'Server Error',
      //   error,
      // });
    // }
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

export const deleteProductImage = async (
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  req: Request<{}, {}, {}, { imageUrl?: string; productId?: string }>,
  res: Response
) => {
  const { imageUrl, productId } = req.query;

  try {
    const filename = (imageUrl as string).replace(`${process.env.URL}/images/`, '');
    const imagePath = path.join(__dirname, '../uploads', filename); // adjust path

    fs.unlink(imagePath, async (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Failed to delete image from the file system',
          error: err.message,
        });
      }

      try {
        const result = await Products.updateOne(
          { _id: productId },
          { $pull: { image: imageUrl } }
        );

        if (result.modifiedCount > 0) {
          return res.status(200).json({
            success: true,
            message: 'Image deleted successfully from both file system and database',
          });
        } else {
          res.status(404).json({
            success: false,
            message: 'Product not found or image not associated',
          });
        }
      } catch (dbError) {
        res.status(500).json({
          success: false,
          message: 'Failed to update database',
          dbError,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error,
    });
  }
};



export {UploadController,UploadManyController,AllProductsController,getOneProductController,DeleteProductController,FilterProductController,SortByPriceController}