import { Request, Response } from "express";
import { LoginController } from "../controllers/userControllers";


describe("LoginController - login", () => {
  const mockLoginUser = jest.fn();
  const MockLoginService = jest.fn(() => ({
    loginUser: mockLoginUser,
  }));

  const mockReq = {
    body: {
      userName: "testuser",
      password: "testpass",
    },
  } as Request;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const controller = new LoginController(new MockLoginService());

  it("should return 200 and token on successful login", async () => {
    mockLoginUser.mockResolvedValue("fake-jwt-token");

    await controller.login(mockReq, mockRes);

    expect(mockLoginUser).toHaveBeenCalledWith("testuser", "testpass");
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ token: "fake-jwt-token" });
  });

  it("should return 409 if password is invalid", async () => {
    mockLoginUser.mockRejectedValue(new Error("Invalid password for the user"));

    await controller.login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid password for the user" });
  });

  it("should return 409 if user is not found", async () => {
    mockLoginUser.mockRejectedValue(new Error("User not found"));

    await controller.login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 500 for other errors", async () => {
    mockLoginUser.mockRejectedValue(new Error("Database connection error"));

    await controller.login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Server error, please try again later" });
  });
});
