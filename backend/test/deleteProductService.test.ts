
import Products from "../model/productModel";
import { DeleteProductService } from "../services/productService";


jest.mock("../model/productModel.ts")

describe("DeleteProduct Service-delete",()=>{
    const service=new DeleteProductService();
    it("should delete the product with its id and return the product",async()=>{
        const mockid="123";
        const mockProducts=
            {
                id:mockid,
                name:"test1",price:100
            };


       ( Products.findByIdAndDelete as jest.Mock).mockResolvedValue(mockProducts)

       const result=await service.delete(mockid)
       expect(result).toEqual(mockProducts)
    })
})