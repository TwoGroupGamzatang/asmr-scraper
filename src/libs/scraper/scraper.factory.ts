import { Scraper } from './types';
import { NoScraperAvailableException } from '../../errors/exceptions/scraper/no-scraper-available.exception';
import { WoowahanScraper } from './implementations/woowahan.scraper';

export class ScraperFactory {
    static create(origin: string): Scraper {
        switch (origin) {
            case 'https://techblog.woowahan.com':
                return new WoowahanScraper();
            default:
                throw new NoScraperAvailableException();
        }
    }
}
