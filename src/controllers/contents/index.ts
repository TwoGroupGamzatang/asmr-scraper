import { Router } from 'express';
import catchAsync from '../../utils/catchAsync';
import { FilterQuery } from 'mongoose';
import { ScrapedContent } from '../../models/scrapedContent';
import { StatusCodes } from 'http-status-codes';
import { ContentNotFoundException } from '../../errors/exceptions/content/content-not-found.exception';
import { OnlyDeleteMyContentException } from '../../errors/exceptions/content/only-delete-my-content.exception';

const contentRouter = Router();

contentRouter
    .get(
        '/:id',
        catchAsync(async (req, res) => {
            const { id } = req.params;
            const scrapedContent = await ScrapedContent.findOne(
                { _id: id, isDeleted: false },
                {
                    userId: 0,
                    __v: 0,
                }
            );

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

            const query: FilterQuery<{
                userId: string;
                title?: string;
                isDeleted: boolean;
            }> = {
                userId,
                isDeleted: false,
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
    )
    .delete(
        '/:id',
        catchAsync(async (req, res) => {
            const { id } = req.params;
            const userId = req.header('X-ASMR-User-Id');

            const scrapedContent = await ScrapedContent.findById(id);
            if (!scrapedContent) {
                throw new ContentNotFoundException();
            }

            if (scrapedContent.userId !== userId) {
                // 요청자의 userId와 문서의 userId가 일치하지 않는 경우
                throw new OnlyDeleteMyContentException();
            }

            scrapedContent.isDeleted = true;
            await scrapedContent.save();

            res.status(StatusCodes.NO_CONTENT).send();
        })
    );

export default contentRouter;
