import { UserController } from "../controllers/userControllers";
import { Request, Response } from "express";

describe("UserController - register", () => {
  const mockRegisterUser = jest.fn();
  const mockCronMail = jest.fn();
  const mockAddEmailJob = jest.fn();

  const mockReq = {
    body: {
      userName: "testuser",
      email: "test@example.com",
      password: "pass123",
    },
  } as Request;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const controller = new UserController(
    { registerUser: mockRegisterUser } as never,
    mockCronMail,
    mockAddEmailJob
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register user successfully and return 201", async () => {
    mockRegisterUser.mockResolvedValue({});

    await controller.register(mockReq, mockRes);

    expect(mockRegisterUser).toHaveBeenCalledWith("testuser", "test@example.com", "pass123");
    expect(mockCronMail).toHaveBeenCalledWith("test@example.com");
    expect(mockAddEmailJob).toHaveBeenCalledWith("test@example.com");
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      user: { userName: "testuser", email: "test@example.com" },
      message: "User registered successfully",
    });
  });

  it("should return 409 if email already in use", async () => {
    mockRegisterUser.mockRejectedValue(new Error("Email already in use"));

    await controller.register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Email already in use" });
  });

  it("should return 500 for other errors", async () => {
    mockRegisterUser.mockRejectedValue(new Error("Some server error"));

    await controller.register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Server error, please try again later",
    });
  });
});
