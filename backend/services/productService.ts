/* eslint-disable @typescript-eslint/no-explicit-any */

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
class getOneProductService{
    async getOne(id:string){
        const result=await Products.findById(id)
        return result
    }
}


class DeleteProductService{
    async delete(id:string){
        const result=await Products.findByIdAndDelete(id)
        return result;
    }
}

class UpdateProductService{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async update(data:any,images:any,id:string){
        const updateFields: any = {
            $set: {
              name:data.name,
              description:data.description,
              price: parseFloat(data.price),
              quantity: parseInt(data.quantity),
            },
          };
          if (images && images.length > 0) {
            updateFields["$push"] = { image: { $each: images } };
          }
        
          return await Products.updateOne({ _id:id}, updateFields);
    }
}

function escapeRegex(input: string) {
    if (typeof input !== "string") return "";
    return input.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
  }
class FilterProductService {
    async filter(filter: string) {
        try {
            const safeFilter = escapeRegex(filter);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const conditions: any[] = [
              { name: { $regex: safeFilter, $options: "i" } },
              { description: { $regex: safeFilter, $options: "i" } },
              {created:{$regex:safeFilter}}
            ];
          
            const isNumber = !isNaN(Number(filter));
            if (isNumber) {
              conditions.push({ price: Number(filter) });
              conditions.push({ quantity: Number(filter) });
            }

          
            return await Products.find({ $or: conditions });
          } catch (err) {
            console.error("Invalid filter input:", filter, err);
            throw new Error("Invalid filter input.");
          }
    }
  }
  


class SortByPrice{
    async filterByPrice(){
        const result=await Products.find().sort({price:+1})
        return result;
    }
    
}

export {UploadService,UploadManyService,AllProductsService,getOneProductService,DeleteProductService,UpdateProductService,FilterProductService,SortByPrice}