import { Request, Response } from 'express';
import { NewsService } from '../services/news.service';
import { sendSuccessResponse, sendErrorResponse } from '../utils/apiResponse.util';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger.util';
import { CreateNewsInput, UpdateNewsInput } from '../models/news.model';

export class NewsController {
  private newsService: NewsService;

  constructor() {
    this.newsService = new NewsService();
  }

  createNews = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendErrorResponse(
          res,
          'Authentication required',
          StatusCodes.UNAUTHORIZED
        );
      }

      const newsData: CreateNewsInput = {
        ...req.body,
        authorId: req.user.id,
      };

      const news = await this.newsService.createNews(newsData);

      sendSuccessResponse(res, news, 'News created successfully', StatusCodes.CREATED);
    } catch (error) {
      logger.error('Failed to create news', { error });
      sendErrorResponse(
        res,
        'Failed to create news',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  getAllNews = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, publishedOnly } = req.query;
      const news = await this.newsService.getAllNews(
        Number(page),
        Number(limit),
        publishedOnly === 'true'
      );

      sendSuccessResponse(res, news, 'News retrieved successfully');
    } catch (error) {
      logger.error('Failed to get news', { error });
      sendErrorResponse(
        res,
        'Failed to get news',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  getNewsById = async (req: Request, res: Response) => {
    try {
      const newsId = parseInt(req.params.id);
      const news = await this.newsService.getNewsById(newsId);

      if (!news) {
        return sendErrorResponse(res, 'News not found', StatusCodes.NOT_FOUND);
      }

      sendSuccessResponse(res, news, 'News retrieved successfully');
    } catch (error) {
      logger.error('Failed to get news', { error });
      sendErrorResponse(
        res,
        'Failed to get news',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  updateNews = async (req: Request, res: Response) => {
    try {
      const newsId = parseInt(req.params.id);
      const newsData: UpdateNewsInput = req.body;

      const updatedNews = await this.newsService.updateNews(newsId, newsData);

      sendSuccessResponse(res, updatedNews, 'News updated successfully');
    } catch (error) {
      logger.error('Failed to update news', { error });
      sendErrorResponse(
        res,
        'Failed to update news',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  publishNews = async (req: Request, res: Response) => {
    try {
      const newsId = parseInt(req.params.id);
      const publishedNews = await this.newsService.publishNews(newsId);

      sendSuccessResponse(res, publishedNews, 'News published successfully');
    } catch (error) {
      logger.error('Failed to publish news', { error });
      sendErrorResponse(
        res,
        'Failed to publish news',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  deleteNews = async (req: Request, res: Response) => {
    try {
      const newsId = parseInt(req.params.id);
      await this.newsService.deleteNews(newsId);

      sendSuccessResponse(res, null, 'News deleted successfully');
    } catch (error) {
      logger.error('Failed to delete news', { error });
      sendErrorResponse(
        res,
        'Failed to delete news',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };
}