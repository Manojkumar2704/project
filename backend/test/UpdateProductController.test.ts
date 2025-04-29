import { Request, Response } from "express";
import { UpdateProductController } from "../controllers/productController";
import { UpdateProductService } from "../services/productService";

jest.mock("../services/productService");

describe("UpdateProductController Tests", () => {
  const controller = new UpdateProductController();
  const mockReq = {
      params: { id: "123" },
      body: { data: { name: "Updated Product", price: 200 } }, 
  } as unknown as Request;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  it("should return 200 status with success message on successful update", async () => {
    (UpdateProductService.prototype.update as jest.Mock).mockResolvedValue(undefined);
    await controller.update(mockReq, mockRes);
    expect(UpdateProductService.prototype.update).toHaveBeenCalledWith(
      { name: "Updated Product", price: 200 },
      "123"
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: "Data Updated successfully",
    });
  });

  it("should return 404 status with error message on failure", async () => {
    const mockError = new Error("Error updating product");
    (UpdateProductService.prototype.update as jest.Mock).mockRejectedValue(mockError);

    await controller.update(mockReq, mockRes);
    expect(UpdateProductService.prototype.update).toHaveBeenCalledWith(
      { name: "Updated Product", price: 200 },
      "123"
    );
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Server error",
      error: mockError,
    });
  });
});
