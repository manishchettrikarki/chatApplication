import { Request, Response, NextFunction } from "express";
import { faker } from "@faker-js/faker";
import { AuthController } from "../auth.controller";
import { IAuthService } from "../auth.service";

// Helper to create mock Request, Response, and NextFunction
const createMock = () => {
  const req = {
    body: {},
  } as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  return { req, res, next };
};

describe("AuthController", () => {
  let mockService: jest.Mocked<IAuthService>;
  let controller: AuthController;

  beforeEach(() => {
    mockService = {
      register: jest.fn(),
      login: jest.fn(),
      refresh: jest.fn(),
      logout: jest.fn(),
    };
    controller = new AuthController(mockService);
    jest.clearAllMocks();
  });

  it("should register a user successfully", async () => {
    const { req, res, next } = createMock();

    const mockUser = {
      email: faker.internet.email(),
      username: faker.internet.username(),
      fullName: faker.person.fullName(),
      password: faker.internet.password(),
    };
    req.body = mockUser;

    mockService.register.mockResolvedValue(mockUser);

    await controller.register(req, res, next);

    expect(mockService.register).toHaveBeenCalledWith(mockUser);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "User registered successfully",
        data: expect.objectContaining({
          // id: mockUser.id,
          email: mockUser.email,
        }),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should login user successfully", async () => {
    const { req, res, next } = createMock();
    const email = faker.internet.email();
    const password = faker.internet.password();

    req.body = { email, password };

    const mockTokens = { accessToken: "access123", refreshToken: "refresh123" };
    mockService.login.mockResolvedValue(mockTokens);

    await controller.login(req, res, next);

    expect(mockService.login).toHaveBeenCalledWith(email, password);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Login successful",
        ...mockTokens,
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should refresh token successfully", async () => {
    const { req, res, next } = createMock();
    const refreshToken = "refresh123";

    req.body = { refreshToken };

    const newToken = { accessToken: "newAccess123" };
    mockService.refresh.mockResolvedValue(newToken);

    await controller.refresh(req, res, next);

    expect(mockService.refresh).toHaveBeenCalledWith(refreshToken);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Access token refreshed",
        ...newToken,
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should logout user successfully", async () => {
    const { req, res, next } = createMock();
    const refreshToken = "refresh123";

    req.body = { refreshToken };

    const logoutResult = { success: true, message: "Logged out" };
    mockService.logout.mockResolvedValue(logoutResult);

    await controller.logout(req, res, next);

    expect(mockService.logout).toHaveBeenCalledWith(refreshToken);
    expect(res.json).toHaveBeenCalledWith(logoutResult);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if refresh token missing during logout", async () => {
    const { req, res, next } = createMock();
    req.body = {};

    await controller.logout(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Refresh token is required",
    });
    expect(mockService.logout).not.toHaveBeenCalled();
  });

  it("should call next(error) when an error occurs in register", async () => {
    const { req, res, next } = createMock();
    const error = new Error("Register failed");
    req.body = { email: faker.internet.email() };

    mockService.register.mockRejectedValue(error);

    await controller.register(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
