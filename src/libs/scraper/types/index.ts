export interface Scraper {
    scrape(url: string): Promise<ScrapedResult>;
}

export interface ScrapedResult extends Metadata, Content {}

export interface Metadata {
    title: string;
    writer?: string;
    writedAt?: Date;
    tags?: string[];
}

export interface Content {
    content: string;
}
