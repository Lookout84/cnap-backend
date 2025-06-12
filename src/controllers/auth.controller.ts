import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccessResponse, sendErrorResponse } from '../utils/apiResponse.util';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger.util';
import jwt from 'jsonwebtoken';
import { Environment } from '../config/environment.config';
import {
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from '../models/user.model';

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const userData: RegisterInput = req.body;
      const user = await this.userService.createUser(userData);

      // Генерація JWT токена
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        Environment.JWT_SECRET,
        { expiresIn: '7d' }
      );

      sendSuccessResponse(res, { user, token }, 'User registered successfully');
    } catch (error) {
      logger.error('Registration failed', { error });
      sendErrorResponse(
        res,
        'Registration failed',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const credentials: LoginInput = req.body;
      const user = await this.userService.authenticateUser(
        credentials.email,
        credentials.password
      );

      if (!user) {
        return sendErrorResponse(
          res,
          'Invalid credentials',
          StatusCodes.UNAUTHORIZED
        );
      }

      // Генерація JWT токена
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        Environment.JWT_SECRET,
        { expiresIn: '7d' }
      );

      sendSuccessResponse(res, { user, token }, 'Login successful');
    } catch (error) {
      logger.error('Login failed', { error });
      sendErrorResponse(res, 'Login failed', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  requestPasswordReset = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      await this.userService.initiatePasswordReset(email);

      sendSuccessResponse(
        res,
        null,
        'Password reset instructions sent to email'
      );
    } catch (error) {
      logger.error('Password reset request failed', { error });
      sendErrorResponse(
        res,
        'Password reset request failed',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const data: ResetPasswordInput = req.body;
      await this.userService.completePasswordReset(data.token, data.newPassword);

      sendSuccessResponse(res, null, 'Password reset successfully');
    } catch (error) {
      logger.error('Password reset failed', { error });
      sendErrorResponse(
        res,
        'Password reset failed',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  getCurrentUser = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendErrorResponse(
          res,
          'User not authenticated',
          StatusCodes.UNAUTHORIZED
        );
      }

      const user = await this.userService.getUserById(req.user.id);
      sendSuccessResponse(res, user, 'Current user retrieved');
    } catch (error) {
      logger.error('Failed to get current user', { error });
      sendErrorResponse(
        res,
        'Failed to get current user',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };
}