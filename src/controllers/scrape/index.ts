import { Router } from 'express';
import { Logger } from '../../libs/logger';
import { StatusCodes } from 'http-status-codes';
import validate from '../../middlewares/validate';
import { ScrapeRequest, scrapeRequestSchema } from './request/scrape.request';
import catchAsync from '../../utils/catchAsync';
import { ScrapedContent } from '../../models/scrapedContent';
import { ScraperFactory } from '../../libs/scraper/scraper.factory';
import { getAISummarize } from '../../libs/summarize';
import { AlreadyScrapedException } from '../../errors/exceptions/scraper/already-scraped.exception';
import { combineArrays } from '../../utils/array';
import {
    checkPersonalClassifier,
    classifyWithPersonalClassifier,
    classifyWithUniversalClassifier,
} from '../../libs/classify';

const scrapeRouter = Router();
const logger = new Logger(__filename);

scrapeRouter.post(
    '/',
    validate(scrapeRequestSchema),
    catchAsync(async (req, res) => {
        const userId = req.user.id;
        const { url } = req.body as ScrapeRequest;
        logger.info(`${userId} request summarize for ${url}`);

        const existScrapedContents = await ScrapedContent.find({
            url: url,
        });

        const myScrapedContent = existScrapedContents.find(
            (scrapedContent) => scrapedContent.userId === userId
        );
        if (myScrapedContent) {
            throw new AlreadyScrapedException();
        }

        const existScrapedContent = existScrapedContents?.[0];
        if (existScrapedContent) {
            // TODO: 공통 조회를 분모로 추천 이벤트 발송

            // 이미 스크랩 및 요약본이 존재 시 해당 문서를 요청자에게 복사함
            if (
                existScrapedContent.userId &&
                existScrapedContent.userId !== userId
            ) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { _id, ...rest } = existScrapedContent.toObject();
                if (!rest.summary || !rest.tags) {
                    const { summary, tags: aiTags } = await getAISummarize(
                        url,
                        rest.content,
                        5,
                        userId
                    );

                    rest.summary = summary;
                    rest.tags = combineArrays(rest.tags, aiTags);
                }

                const scrapedContent = new ScrapedContent({
                    ...rest,
                    userId,
                    scrapedAt: Date.now(),
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
        // TODO: 현재는 기본값을 5로 지정하지만 추후에는 사용자 인증 시에 사용자의 preference 값 반영
        const { summary, tags: aiTags } = await getAISummarize(
            url,
            scrapedResult.content,
            5,
            userId
        );
        logger.info(`summarized content: ${summary}`);

        const { isExist: isPersonalClassifierExist } =
            await checkPersonalClassifier(userId);
        const classifierFunction = isPersonalClassifierExist
            ? classifyWithPersonalClassifier
            : classifyWithUniversalClassifier;

        const { predicted_class } = await classifierFunction(userId, summary);
        const classifierTags: string[] = [predicted_class];

        const scrapedContent = new ScrapedContent({
            userId,
            url,
            origin,
            title: scrapedResult.title,
            content: scrapedResult.content,
            summary: summary,
            tags: combineArrays(scrapedResult.tags, aiTags, classifierTags),
            readTime: 5,
        });
        await scrapedContent.save();

        res.status(StatusCodes.OK).json({
            content: scrapedResult.content,
            summary,
            readTime: 5,
        });
    })
);

export default scrapeRouter;
