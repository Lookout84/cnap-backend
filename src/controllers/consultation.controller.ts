import { Request, Response } from 'express';
import { ConsultationService } from '../services/consultation.service';
import { sendSuccessResponse, sendErrorResponse } from '../utils/apiResponse.util';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger.util';
import {
  CreateConsultationInput,
  UpdateConsultationInput,
  AnswerConsultationInput,
} from '../models/consultation.model';

export class ConsultationController {
  private consultationService: ConsultationService;

  constructor() {
    this.consultationService = new ConsultationService();
  }

  createConsultation = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendErrorResponse(
          res,
          'Authentication required',
          StatusCodes.UNAUTHORIZED
        );
      }

      const consultationData: CreateConsultationInput = {
        ...req.body,
        userId: req.user.id,
      };

      const consultation = await this.consultationService.createConsultation(
        consultationData
      );

      sendSuccessResponse(
        res,
        consultation,
        'Consultation created successfully',
        StatusCodes.CREATED
      );
    } catch (error) {
      logger.error('Failed to create consultation', { error });
      sendErrorResponse(
        res,
        'Failed to create consultation',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  getUserConsultations = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendErrorResponse(
          res,
          'Authentication required',
          StatusCodes.UNAUTHORIZED
        );
      }

      const { page = 1, limit = 10, status } = req.query;
      const consultations = await this.consultationService.getUserConsultations(
        req.user.id,
        Number(page),
        Number(limit),
        status as string | undefined
      );

      sendSuccessResponse(
        res,
        consultations,
        'Consultations retrieved successfully'
      );
    } catch (error) {
      logger.error('Failed to get consultations', { error });
      sendErrorResponse(
        res,
        'Failed to get consultations',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  getConsultationById = async (req: Request, res: Response) => {
    try {
      const consultationId = parseInt(req.params.id);
      const consultation = await this.consultationService.getConsultationById(
        consultationId
      );

      if (!consultation) {
        return sendErrorResponse(
          res,
          'Consultation not found',
          StatusCodes.NOT_FOUND
        );
      }

      // Перевірка прав доступу
      if (
        req.user &&
        req.user.id !== consultation.userId &&
        req.user.role !== 'ADMINISTRATOR' &&
        req.user.role !== 'OPERATOR'
      ) {
        return sendErrorResponse(
          res,
          'You do not have permission to view this consultation',
          StatusCodes.FORBIDDEN
        );
      }

      sendSuccessResponse(res, consultation, 'Consultation retrieved successfully');
    } catch (error) {
      logger.error('Failed to get consultation', { error });
      sendErrorResponse(
        res,
        'Failed to get consultation',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  updateConsultation = async (req: Request, res: Response) => {
    try {
      const consultationId = parseInt(req.params.id);
      const consultationData: UpdateConsultationInput = req.body;

      const updatedConsultation = await this.consultationService.updateConsultation(
        consultationId,
        consultationData
      );

      sendSuccessResponse(
        res,
        updatedConsultation,
        'Consultation updated successfully'
      );
    } catch (error) {
      logger.error('Failed to update consultation', { error });
      sendErrorResponse(
        res,
        'Failed to update consultation',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  answerConsultation = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendErrorResponse(
          res,
          'Authentication required',
          StatusCodes.UNAUTHORIZED
        );
      }

      const consultationId = parseInt(req.params.id);
      const answerData: AnswerConsultationInput = req.body;

      const answeredConsultation = await this.consultationService.answerConsultation(
        consultationId,
        answerData.answer,
        req.user.id
      );

      sendSuccessResponse(
        res,
        answeredConsultation,
        'Consultation answered successfully'
      );
    } catch (error) {
      logger.error('Failed to answer consultation', { error });
      sendErrorResponse(
        res,
        'Failed to answer consultation',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };
}