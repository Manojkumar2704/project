import { Request, Response } from "express";
import { DeleteProductController } from "../controllers/productController";
import { DeleteProductService } from "../services/productService";

jest.mock("../services/productService");

describe("DeleteProductController Tests", () => {
  const controller = new DeleteProductController();
  const mockReq = {
      params: { id: "123" },
  } as unknown as Request; 
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  it("should return 200 status with success message on successful deletion", async () => {
    (DeleteProductService.prototype.delete as jest.Mock).mockResolvedValue(undefined);

    await controller.deleteProduct(mockReq, mockRes);
    expect(DeleteProductService.prototype.delete).toHaveBeenCalledWith("123");
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: "Data deleted successfully",
    });
  });

  it("should return 400 status with error message on failure", async () => {
    const mockError = new Error("Error deleting product");
    (DeleteProductService.prototype.delete as jest.Mock).mockRejectedValue(mockError);
    await controller.deleteProduct(mockReq, mockRes);
    expect(DeleteProductService.prototype.delete).toHaveBeenCalledWith("123");
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Server Error",
      error: mockError,
    });
  });
});
