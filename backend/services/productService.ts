// const Products =require("../model/productModel")
import Products from "../model/productModel"

class UploadService {
  async uploadProduct(data: { name: string; description: string; price: number; quantity: number; }, image?: string[]) {
    const newProduct = new Products({
      name: data.name,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
      image: image,
    });
    const savedProduct = await newProduct.save();
    return savedProduct;
  }
}

class UploadManyService{
    async uploadMany(data: { name: string; description: string; price: number; quantity: number; },images?:string[]){
        const newProduct=await new Products({
            name:data.name,
            description:data.description,
            price:data.price,
            quantity:data.quantity,
            image:images
        })
        const savedProduct=await newProduct.save();
        return savedProduct;
    }
}


class AllProductsService{
    async getAll(){
        const result=await Products.find();
        return result;
    }
}


class DeleteProductService{
    async delete(id:string){
        const result=await Products.findByIdAndDelete(id)
        return result;
    }
}

class UpdateProductService{
    async update(data:object,id:string){
        const result=await Products.findByIdAndUpdate(id,data)
        return result;
    }
}


class FilterProductService{
    async filter(filter:object){
        const isnumber = !isNaN(Number(filter));
        const result=await Products.find({
          $or: [
            { name: { $regex: filter.toString(), $options: "i" } },
            { description: { $regex: filter.toString(), $options: "i" } },
            ...(isnumber ? [{ price: Number(filter) }] : []),
            { created: { $regex: filter.toString(), $options: "i" } },
          ]
        })
        return result
    }
}


class SortByPrice{
    async filterByPrice(){
        const result=await Products.find().sort({price:+1})
        return result;
    }
    
}

export {UploadService,UploadManyService,AllProductsService,DeleteProductService,UpdateProductService,FilterProductService,SortByPrice}