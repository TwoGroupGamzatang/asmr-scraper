import { Router } from 'express';
import { Logger } from '../../libs/logger';
import catchAsync from '../../utils/catchAsync';
import { FilterQuery } from 'mongoose';
import { ScrapedContent } from '../../models/scrapedContent';
import { StatusCodes } from 'http-status-codes';
import { ContentNotFoundException } from '../../errors/exceptions/content/content-not-found.exception';

const contentRouter = Router();
const logger = new Logger(__filename);

contentRouter
    .get(
        '/:id',
        catchAsync(async (req, res) => {
            const { id } = req.params;
            const scrapedContent = await ScrapedContent.findById(id, {
                userId: 0,
                __v: 0,
            });

            if (!scrapedContent) {
                throw new ContentNotFoundException();
            }

            res.status(StatusCodes.OK).json(scrapedContent);
        })
    )
    .get(
        '/',
        catchAsync(async (req, res) => {
            const userId = req.header('X-ASMR-User-Id');
            const { page = 1, limit = 10, title } = req.query;

            const options = {
                skip:
                    (parseInt(page as string, 10) - 1) *
                    parseInt(limit as string, 10),
                limit: parseInt(limit as string, 10),
                sort: { scrapedAt: -1 },
            };

            const query: FilterQuery<{ userId: string; title?: string }> = {
                userId,
            };
            if (title) {
                query['title'] = { $regex: new RegExp(title as string, 'i') };
            }

            const scrapedContents = await ScrapedContent.find(
                query,
                { userId: 0, __v: 0 },
                options
            );
            const totalCount = await ScrapedContent.countDocuments(query);
            const maxPage = Math.ceil(
                totalCount / parseInt(limit as string, 10)
            );

            res.status(StatusCodes.OK).json({
                contents: scrapedContents,
                maxPage,
                totalCount,
            });
        })
    );

export default contentRouter;
