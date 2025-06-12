import { Request, Response } from 'express';
import { ServiceService } from '../services/service.service';
import { sendSuccessResponse, sendErrorResponse } from '../utils/apiResponse.util';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger.util';
import {
  CreateServiceInput,
  UpdateServiceInput,
} from '../models/service.model';

export class ServiceController {
  private serviceService: ServiceService;

  constructor() {
    this.serviceService = new ServiceService();
  }

  createService = async (req: Request, res: Response) => {
    try {
      const serviceData: CreateServiceInput = req.body;
      const service = await this.serviceService.createService(serviceData);

      sendSuccessResponse(res, service, 'Service created successfully', StatusCodes.CREATED);
    } catch (error) {
      logger.error('Failed to create service', { error });
      sendErrorResponse(
        res,
        'Failed to create service',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  getAllServices = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, category } = req.query;
      const services = await this.serviceService.getAllServices(
        Number(page),
        Number(limit),
        category as string | undefined
      );

      sendSuccessResponse(res, services, 'Services retrieved successfully');
    } catch (error) {
      logger.error('Failed to get services', { error });
      sendErrorResponse(
        res,
        'Failed to get services',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  getServiceById = async (req: Request, res: Response) => {
    try {
      const serviceId = parseInt(req.params.id);
      const service = await this.serviceService.getServiceById(serviceId);

      if (!service) {
        return sendErrorResponse(res, 'Service not found', StatusCodes.NOT_FOUND);
      }

      sendSuccessResponse(res, service, 'Service retrieved successfully');
    } catch (error) {
      logger.error('Failed to get service', { error });
      sendErrorResponse(
        res,
        'Failed to get service',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  updateService = async (req: Request, res: Response) => {
    try {
      const serviceId = parseInt(req.params.id);
      const serviceData: UpdateServiceInput = req.body;

      const updatedService = await this.serviceService.updateService(
        serviceId,
        serviceData
      );

      sendSuccessResponse(res, updatedService, 'Service updated successfully');
    } catch (error) {
      logger.error('Failed to update service', { error });
      sendErrorResponse(
        res,
        'Failed to update service',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  deleteService = async (req: Request, res: Response) => {
    try {
      const serviceId = parseInt(req.params.id);
      await this.serviceService.deleteService(serviceId);

      sendSuccessResponse(res, null, 'Service deleted successfully');
    } catch (error) {
      logger.error('Failed to delete service', { error });
      sendErrorResponse(
        res,
        'Failed to delete service',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };
}