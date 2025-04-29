import { Request, Response } from "express";
import { AllProductsController } from "../controllers/productController";
import { AllProductsService } from "../services/productService";

jest.mock("../services/productService");

describe("AllProductsController Tests", () => {
  const controller = new AllProductsController();
  const mockReq = {} as Request; 
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  it("should return all products with 200 status on successful fetch", async () => {
    const mockProducts = [
      { id: 1, name: "Product 1", price: 100 },
      { id: 2, name: "Product 2", price: 200 },
    ];
    (AllProductsService.prototype.getAll as jest.Mock).mockResolvedValue(mockProducts);
    await controller.getAll(mockReq, mockRes);
    expect(AllProductsService.prototype.getAll).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ result: mockProducts });
  });

  it("should return 400 status with error message on failure", async () => {
    const mockError = new Error("Error fetching products");
    (AllProductsService.prototype.getAll as jest.Mock).mockRejectedValue(mockError);
    await controller.getAll(mockReq, mockRes);
    expect(AllProductsService.prototype.getAll).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Error when getting",
      error: mockError,
    });
  });
});
