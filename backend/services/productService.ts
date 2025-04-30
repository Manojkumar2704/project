
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
    async update(data:object,id:string){
        const result=await Products.findByIdAndUpdate(id,data)
        return result;
    }
}


class FilterProductService {
    async filter(filter: string) {
      const isNumber = !isNaN(Number(filter));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const conditions: any[] = [
        { name: { $regex: filter, $options: "i" } },
        { description: { $regex: filter, $options: "i" } },
      ];
      if (isNumber) {
        conditions.push({ price: Number(filter) });
        conditions.push({ quantity: Number(filter) });
      }
      // Only include created filter if you store it as a string or formatted date
      conditions.push({ createdAt: { $regex: filter, $options: "i" } });
  
      const result = await Products.find({ $or: conditions });
      return result;
    }
  }
  


class SortByPrice{
    async filterByPrice(){
        const result=await Products.find().sort({price:+1})
        return result;
    }
    
}

export {UploadService,UploadManyService,AllProductsService,getOneProductService,DeleteProductService,UpdateProductService,FilterProductService,SortByPrice}