import { Router } from 'express';
import { Logger } from '../../libs/logger';
import { StatusCodes } from 'http-status-codes';
import validate from '../../middlewares/validate';
import { ScrapeRequest, scrapeRequestSchema } from './request/scrape.request';
import catchAsync from '../../utils/catchAsync';
import { ScrapedContent } from '../../models/scrapedContent';
import { ScraperFactory } from '../../libs/scraper/scraper.factory';

const scrapeRouter = Router();
const logger = new Logger(__filename);

scrapeRouter.post(
    '/',
    validate(scrapeRequestSchema),
    catchAsync(async (req, res) => {
        const userId = req.header('ASMR-User-Id');
        const { url } = req.body as ScrapeRequest;
        logger.info(`${userId} request summarize for ${url}`);

        const existScrapedContent = await ScrapedContent.findOne({
            url: url,
        });

        if (existScrapedContent) {
            // TODO: 공통 조회를 분모로 추천 이벤트 발송

            res.status(StatusCodes.OK).json({
                content: existScrapedContent.content,
            });
        }

        const { origin } = new URL(url);

        const scraper = ScraperFactory.create(origin);
        const scrapedResult = await scraper.scrape(url);

        const scrapedContent = new ScrapedContent({
            userId,
            url,
            origin,
            ...scrapedResult,
        });

        await scrapedContent.save();

        res.status(StatusCodes.OK).json({ content: scrapedResult.content });
    })
);

export default scrapeRouter;
