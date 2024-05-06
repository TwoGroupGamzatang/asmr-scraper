import { Router } from 'express';
import { Logger } from '../../libs/logger';
import { StatusCodes } from 'http-status-codes';
import validate from '../../middlewares/validate';
import { ScrapeRequest, scrapeRequestSchema } from './request/scrape.request';
import catchAsync from '../../utils/catchAsync';
import { ScrapedContent } from '../../models/scrapedContent';
import { ScraperFactory } from '../../libs/scraper/scraper.factory';
import { getAISummarize } from '../../libs/summarize';
import { FilterQuery } from 'mongoose';

const scrapeRouter = Router();
const logger = new Logger(__filename);

scrapeRouter
    .post(
        '/',
        validate(scrapeRequestSchema),
        catchAsync(async (req, res) => {
            const userId = req.header('X-ASMR-User-Id');
            const { url } = req.body as ScrapeRequest;
            logger.info(`${userId} request summarize for ${url}`);

            const existScrapedContent = await ScrapedContent.findOne({
                url: url,
            });

            if (existScrapedContent) {
                // TODO: 공통 조회를 분모로 추천 이벤트 발송

                // 이미 스크랩 및 요약본이 존재 시 해당 문서를 요청자에게 복사함
                if (
                    existScrapedContent.userId &&
                    existScrapedContent.userId !== userId
                ) {
                    const scrapedContent = new ScrapedContent({
                        ...existScrapedContent,
                        userId,
                    });

                    await scrapedContent.save();
                }

                res.status(StatusCodes.OK).json({
                    content: existScrapedContent.content,
                    summary: existScrapedContent.summary,
                    readTime: existScrapedContent.readTime,
                });

                return;
            }

            const { origin } = new URL(url);

            const scraper = ScraperFactory.create(origin);
            const scrapedResult = await scraper.scrape(url);
            logger.info(`scraped content: ${scrapedResult.content}`);
            // TODO: 현재는 기본값을 5로 지정하지만 추후에는 사용자 인증 시에 사용자의 preference 값 반영
            const summary = await getAISummarize(url, scrapedResult.content, 5);
            logger.info(`summarized content: ${summary}`);

            const scrapedContent = new ScrapedContent({
                userId,
                url,
                content: scrapedResult.content,
                summary: summary,
                readTime: 5,
            });
            await scrapedContent.save();

            res.status(StatusCodes.OK).json({
                content: scrapedResult.content,
                summary,
                readTime: 5,
            });
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
                { _id: 0, userId: 0, __v: 0 },
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

export default scrapeRouter;
