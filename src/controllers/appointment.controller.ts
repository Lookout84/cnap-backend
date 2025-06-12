import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointment.service';
import { sendSuccessResponse, sendErrorResponse } from '../utils/apiResponse.util';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger.util';
import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from '../models/appointment.model';

export class AppointmentController {
  private appointmentService: AppointmentService;

  constructor() {
    this.appointmentService = new AppointmentService();
  }

  createAppointment = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendErrorResponse(
          res,
          'Authentication required',
          StatusCodes.UNAUTHORIZED
        );
      }

      const appointmentData: CreateAppointmentInput = {
        ...req.body,
        userId: req.user.id,
      };

      const appointment = await this.appointmentService.createAppointment(
        appointmentData
      );

      sendSuccessResponse(
        res,
        appointment,
        'Appointment created successfully',
        StatusCodes.CREATED
      );
    } catch (error) {
      logger.error('Failed to create appointment', { error });
      sendErrorResponse(
        res,
        'Failed to create appointment',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  getUserAppointments = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendErrorResponse(
          res,
          'Authentication required',
          StatusCodes.UNAUTHORIZED
        );
      }

      const { page = 1, limit = 10, status } = req.query;
      const appointments = await this.appointmentService.getUserAppointments(
        req.user.id,
        Number(page),
        Number(limit),
        status as string | undefined
      );

      sendSuccessResponse(res, appointments, 'Appointments retrieved successfully');
    } catch (error) {
      logger.error('Failed to get appointments', { error });
      sendErrorResponse(
        res,
        'Failed to get appointments',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  getAppointmentById = async (req: Request, res: Response) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const appointment = await this.appointmentService.getAppointmentById(
        appointmentId
      );

      if (!appointment) {
        return sendErrorResponse(
          res,
          'Appointment not found',
          StatusCodes.NOT_FOUND
        );
      }

      // Перевірка, чи належить запис поточному користувачу (або адміну)
      if (
        req.user &&
        req.user.id !== appointment.userId &&
        req.user.role !== 'ADMINISTRATOR'
      ) {
        return sendErrorResponse(
          res,
          'You do not have permission to view this appointment',
          StatusCodes.FORBIDDEN
        );
      }

      sendSuccessResponse(res, appointment, 'Appointment retrieved successfully');
    } catch (error) {
      logger.error('Failed to get appointment', { error });
      sendErrorResponse(
        res,
        'Failed to get appointment',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  updateAppointment = async (req: Request, res: Response) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const appointmentData: UpdateAppointmentInput = req.body;

      const updatedAppointment = await this.appointmentService.updateAppointment(
        appointmentId,
        appointmentData
      );

      sendSuccessResponse(
        res,
        updatedAppointment,
        'Appointment updated successfully'
      );
    } catch (error) {
      logger.error('Failed to update appointment', { error });
      sendErrorResponse(
        res,
        'Failed to update appointment',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  cancelAppointment = async (req: Request, res: Response) => {
    try {
      const appointmentId = parseInt(req.params.id);
      await this.appointmentService.cancelAppointment(appointmentId);

      sendSuccessResponse(res, null, 'Appointment cancelled successfully');
    } catch (error) {
      logger.error('Failed to cancel appointment', { error });
      sendErrorResponse(
        res,
        'Failed to cancel appointment',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  getAvailableSlots = async (req: Request, res: Response) => {
    try {
      const { serviceId, date } = req.query;
      const slots = await this.appointmentService.getAvailableSlots(
        Number(serviceId),
        date as string
      );

      sendSuccessResponse(res, slots, 'Available slots retrieved successfully');
    } catch (error) {
      logger.error('Failed to get available slots', { error });
      sendErrorResponse(
        res,
        'Failed to get available slots',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };
}