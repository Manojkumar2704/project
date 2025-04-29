import Products from "../model/productModel";
import { FilterProductService } from "../services/productService";

jest.mock("../model/productModel");

describe("FilterProductService - filter", () => {
    const service = new FilterProductService();

    it("should return products matching the keyword in name, description, price, or created", async () => {
        const keyword = "test";
        const mockResults = [
            { name: "Test Product", description: "Great", price: 100, created: "2023-01-01" }
        ];

        (Products.find as jest.Mock).mockResolvedValue(mockResults);

        const result = await service.filter(keyword);

        expect(Products.find).toHaveBeenCalledWith({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { created: { $regex: keyword, $options: "i" } },
            ]
        });

        expect(result).toEqual(mockResults);
    });

    it("should include price in $or if keyword is a number", async () => {
        const keyword = "100";
        const mockResults = [
            { name: "Test Product", description: "Great", price: 100, created: "2023-01-01" }
        ];

        (Products.find as jest.Mock).mockResolvedValue(mockResults);

        const result = await service.filter(keyword);

        expect(Products.find).toHaveBeenCalledWith({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { price: 100 },
                { created: { $regex: keyword, $options: "i" } },
            ]
        });

        expect(result).toEqual(mockResults);
    });
});
