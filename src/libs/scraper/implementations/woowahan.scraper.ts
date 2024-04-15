import { ScrapedResult, Scraper } from '../types';

export class WoowahanScraper implements Scraper {
    async scrape(url: string): Promise<ScrapedResult> {
        // TODO: Implement this

        return {
            title: '',
            writer: '',
            writedAt: new Date(),
            content: '',
        };
    }
}
