import { ScrapedResult, Scraper } from '../types';
import { chromium } from 'playwright';
import { Logger } from '../../logger';
import { ScrapeFailedException } from '../../../errors/exceptions/scraper/scrape-failed.exception';

const logger = new Logger(__filename);

export class GeneralScraper implements Scraper {
    async scrape(url: string): Promise<ScrapedResult> {
        const browser = await chromium.launch();
        try {
            const page = await browser.newPage();
            await page.goto(url);

            const title = await page.$eval(
                'head > title',
                (element) => element.textContent
            );
            logger.info(`title: ${title}`);
            if (!title) {
                throw new ScrapeFailedException();
            }

            const content = await page.$$eval(
                'body *:not(script)',
                (elements) =>
                    elements
                        .map((element) => element.textContent)
                        .join(' ')
                        .replace(/\s+/g, ' ')
            );
            logger.info(`content: ${content}`);

            return {
                title: title,
                content: content,
            };
        } catch (error: any) {
            logger.error(error);

            throw new ScrapeFailedException();
        }
    }
}
