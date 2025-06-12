import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccessResponse, sendErrorResponse } from '../utils/apiResponse.util';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger.util';
import { UpdateUserInput } from '../models/user.model';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const users = await this.userService.getAllUsers(
        Number(page),
        Number(limit)
      );
      sendSuccessResponse(res, users, 'Users retrieved successfully');
    } catch (error) {
      logger.error('Failed to get users', { error });
      sendErrorResponse(
        res,
        'Failed to get users',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userService.getUserById(userId);

      if (!user) {
        return sendErrorResponse(res, 'User not found', StatusCodes.NOT_FOUND);
      }

      sendSuccessResponse(res, user, 'User retrieved successfully');
    } catch (error) {
      logger.error('Failed to get user', { error });
      sendErrorResponse(
        res,
        'Failed to get user',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const userData: UpdateUserInput = req.body;

      const updatedUser = await this.userService.updateUser(userId, userData);
      sendSuccessResponse(res, updatedUser, 'User updated successfully');
    } catch (error) {
      logger.error('Failed to update user', { error });
      sendErrorResponse(
        res,
        'Failed to update user',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      await this.userService.deleteUser(userId);

      sendSuccessResponse(res, null, 'User deleted successfully');
    } catch (error) {
      logger.error('Failed to delete user', { error });
      sendErrorResponse(
        res,
        'Failed to delete user',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };
}