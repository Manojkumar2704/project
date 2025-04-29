import Products from "../model/productModel";
import { AllProductsService } from "../services/productService";

jest.mock("../model/productModel")


describe("AllProductService -allProducts",()=>{
    const service=new AllProductsService()
    
it("should return all the products",async()=>{
    const mockProducts=[
        {
            name:"test1",price:100
        },
        {
            name:"test2",price:100
        },
    ];

    (Products.find as jest.Mock).mockResolvedValue(mockProducts)

    const result=await service.getAll()

    expect(Products.find).toHaveBeenCalled()
    expect(result).toEqual(mockProducts)
})
})