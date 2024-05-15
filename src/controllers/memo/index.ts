import { Router } from 'express';
import { ScrapedContent } from '../../models/scrapedContent';
import { ContentNotFoundException } from '../../errors/exceptions/content/content-not-found.exception';
import { MemoNotFoundException } from '../../errors/exceptions/memo/memo-not-found.exception';
import catchAsync from '../../utils/catchAsync';

const memoRouter = Router();

memoRouter
    .post(
        '/:contentId',
        catchAsync(async (req, res) => {
            const userId = req.header('X-ASMR-User-Id') as string;
            const { contentId } = req.params;
            const { content } = req.body as { content: string };

            const scrapedContent = await ScrapedContent.findOne({
                _id: contentId,
                userId,
                isDeleted: false,
            });
            if (!scrapedContent) {
                throw new ContentNotFoundException();
            }

            /**
             * memos 필드가 없을 경우(undefined) 빈 배열로 초기화 후 메모 추가
             */
            (scrapedContent.memos ??= []).push({
                content,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
            });
            await scrapedContent.save();

            res.status(201).json({
                count: scrapedContent.memos.length,
                memos: scrapedContent.memos,
            });
        })
    )
    .get(
        '/:contentId',
        catchAsync(async (req, res) => {
            const { contentId } = req.params;
            const userId = req.header('X-ASMR-User-Id') as string;

            const scrapedContent = await ScrapedContent.findOne({
                _id: contentId,
                userId,
                isDeleted: false,
            });
            if (!scrapedContent) {
                throw new ContentNotFoundException();
            }

            const memos = scrapedContent.memos
                ?.filter((memo) => !memo.isDeleted)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            res.status(200).json({
                count: memos.length,
                memos,
            });
        })
    )
    .put(
        '/:contentId/:memoId',
        catchAsync(async (req, res) => {
            const { contentId, memoId } = req.params;
            const { content } = req.body;

            const scrapedContent = await ScrapedContent.findById(contentId);
            if (!scrapedContent) {
                throw new ContentNotFoundException();
            }

            const memo = scrapedContent.memos.filter(
                (memo) => memo._id?.toString() === memoId && !memo.isDeleted
            )[0];
            if (!memo) {
                throw new MemoNotFoundException();
            }

            memo.content = content;
            await scrapedContent.save();

            res.status(200).json(memo);
        })
    )
    .delete(
        '/:contentId/:memoId',
        catchAsync(async (req, res) => {
            const { contentId, memoId } = req.params;

            const scrapedContent = await ScrapedContent.findById(contentId);
            if (!scrapedContent) {
                throw new ContentNotFoundException();
            }

            const memo = scrapedContent.memos.filter(
                (memo) => memo._id?.toString() === memoId && !memo.isDeleted
            )[0];
            if (!memo) {
                throw new MemoNotFoundException();
            }

            memo.isDeleted = true;
            await scrapedContent.save();

            res.status(204).send();
        })
    );

export default memoRouter;
