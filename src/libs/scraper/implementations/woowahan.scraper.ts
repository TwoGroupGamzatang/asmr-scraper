import { ScrapedResult, Scraper } from '../types';
import { chromium } from 'playwright';
import { Logger } from '../../logger';
import { ScrapeFailedException } from '../../../errors/exceptions/scraper/scrape-failed.exception';
import { Maybe, nullToUndefined, Optional } from '../../../utils/optional';

const log = new Logger(__filename);

export class WoowahanScraper implements Scraper {
    async scrape(url: string): Promise<ScrapedResult> {
        const browser = await chromium.launch();
        try {
            const page = await browser.newPage();
            await page.goto(url);

            const title = await page.$eval(
                '.post-header > h1',
                (element) => element.textContent
            );
            if (!title) {
                throw new ScrapeFailedException();
            }

            const writedDateAndWriter = await page.$$eval(
                '.post-header-author > span',
                (elements) => elements.map((element) => element.textContent)
            );

            const writedAt = convertToDate(writedDateAndWriter[0]);
            const writer = nullToUndefined(writedDateAndWriter[1]);

            const content = await page.$$eval(
                '.post-content-inner *:not(.toc, .toc *)',
                (elements) =>
                    elements.map((element) => element.textContent).join(' ')
            );

            return {
                title: title,
                writer: nullToUndefined(writer),
                writedAt: writedAt,
                content: content,
            };
        } catch (error: any) {
            log.error(error);

            throw new ScrapeFailedException();
        }
    }
}

const convertToDate = (dateString: Optional<string>): Maybe<Date> => {
    if (!dateString) {
        return undefined;
    }

    // 문자열에서 점을 공백으로 대체합니다.
    const formattedDateString = dateString.replace(/\./g, ' ');

    // Date 객체를 생성합니다.
    return new Date(formattedDateString);
};
