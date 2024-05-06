import { Scraper } from './types';
import { WoowahanScraper } from './implementations/woowahan.scraper';
import { GeneralScraper } from './implementations/general.scraper';

export class ScraperFactory {
    static create(origin: string): Scraper {
        switch (origin) {
            case 'https://techblog.woowahan.com':
                return new WoowahanScraper();
            default:
                return new GeneralScraper();
        }
    }
}
