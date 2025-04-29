import Products from "../model/productModel";
import { UpdateProductService } from "../services/productService";

jest.mock("../model/productModel")

describe("UpdateProductService-update",()=>{
    const service=new UpdateProductService();

    it("should update the product and return the new product",async()=>{
        const mockid="123";
        const mockdata={
            id:mockid,
            name:"test1",
            price:100
        };

        (Products.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockdata)

        const result=await service.update(mockdata,mockid)
        expect(Products.findByIdAndUpdate).toHaveBeenCalledWith(mockid,mockdata)
        expect(result).toEqual(mockdata)
    })
})