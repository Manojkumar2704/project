import { UploadManyController } from "../controllers/productController";
import { sendMail } from "../mail/mail";
import { Request, Response } from "express";

jest.mock("../mail/mail", () => ({
  sendMail: jest.fn(),
}));

describe("UploadManyController", () => {
  const mockUploadMany = jest.fn();
  const mockService = { uploadMany: mockUploadMany };

  const controller = new UploadManyController(mockService as never);

  const mockReq = {
    body: {
      name: "Product A",
      description: "Good product",
      price: 100,
      quantity: 10,
    },
    files: [
      { filename: "img1.jpg" },
      { filename: "img2.jpg" },
    ],
  } as unknown as Request;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and success message on successful upload", async () => {
    mockUploadMany.mockResolvedValue({});
    (sendMail as jest.Mock).mockImplementation(() => {});

    await controller.uploadMany(mockReq, mockRes);

    expect(mockUploadMany).toHaveBeenCalledWith(mockReq.body, [
      "http://localhost:7000/images/img1.jpg",
      "http://localhost:7000/images/img2.jpg",
    ]);

    expect(sendMail).toHaveBeenCalledWith({
      name: "Product A",
      image: [
        "http://localhost:7000/images/img1.jpg",
        "http://localhost:7000/images/img2.jpg",
      ],
      price: 100,
    });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: "product added successfully",
    });
  });

  it("should return 404 and error message on failure", async () => {
    const mockError = new Error("Upload failed");
    mockUploadMany.mockRejectedValue(mockError);

    await controller.uploadMany(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Error when Uploading",
      error: mockError,
    });
  });
});
