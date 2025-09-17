import { Response, NextFunction } from "express";
import { faker } from "@faker-js/faker";
import { UserController } from "../user.controller";
import { IUserService } from "../user.service";
import { AuthenticatedRequest } from "../../../types/authenticated.type";
import { IUserProfileSchema } from "../model/user.profile.schema";

// Extend AuthenticatedRequest so user is required in tests
type TestAuthRequest = AuthenticatedRequest & { user: { id: string } };

// helper to create mock req, res, next
const createMock = () => {
  const req = {
    body: {},
    user: { id: faker.string.uuid() },
    file: undefined,
  } as TestAuthRequest;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  return { req, res, next };
};

describe("UserController", () => {
  let mockService: jest.Mocked<IUserService>;
  let controller: UserController;

  beforeEach(() => {
    mockService = {
      updateProfile: jest.fn(),
      getProfile: jest.fn(),
    } as unknown as jest.Mocked<IUserService>;

    controller = new UserController(mockService);
    jest.clearAllMocks();
  });

  it("should update profile successfully without file", async () => {
    const { req, res, next } = createMock();

    const updatedProfile = {
      _id: faker.string.uuid(),
      user: req.user.id,
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: undefined,
      $assertPopulated: jest.fn(),
    } as unknown as IUserProfileSchema;

    // req.body = { fullName: updatedProfile.fullName };

    mockService.updateProfile.mockResolvedValue(updatedProfile);

    await controller.updateProfile(req, res, next);

    expect(mockService.updateProfile).toHaveBeenCalledWith(
      req.user.id,
      req.body
    );
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should update profile successfully with avatar file", async () => {
    const { req, res, next } = createMock();

    req.file = { filename: "avatar123.png" } as Express.Multer.File;

    const updatedProfile = {
      _id: faker.string.uuid(),
      user: req.user.id,
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: "/uploads/avatar123.png",
      $assertPopulated: jest.fn(),
    } as unknown as IUserProfileSchema;

    // req.body = { fullName: updatedProfile.fullName };

    mockService.updateProfile.mockResolvedValue(updatedProfile);

    await controller.updateProfile(req, res, next);

    expect(mockService.updateProfile).toHaveBeenCalledWith(
      req.user.id,
      expect.objectContaining({
        // fullName: updatedProfile.fullName,
        avatar: "/uploads/avatar123.png",
      })
    );

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next(error) on updateProfile failure", async () => {
    const { req, res, next } = createMock();
    const error = new Error("Update failed");

    mockService.updateProfile.mockRejectedValue(error);

    await controller.updateProfile(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should get profile successfully", async () => {
    const { req, res, next } = createMock();

    const profile = {
      _id: faker.string.uuid(),
      user: req.user.id,
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: undefined,
      $assertPopulated: jest.fn(),
    } as unknown as IUserProfileSchema;

    mockService.getProfile.mockResolvedValue(profile);

    await controller.getProfile(req, res, next);

    expect(mockService.getProfile).toHaveBeenCalledWith(req.user.id);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: profile,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if profile not found", async () => {
    const { req, res, next } = createMock();
    mockService.getProfile.mockResolvedValue(null);

    await controller.getProfile(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Profile not found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next(error) on getProfile failure", async () => {
    const { req, res, next } = createMock();
    const error = new Error("Get profile failed");
    mockService.getProfile.mockRejectedValue(error);

    await controller.getProfile(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
