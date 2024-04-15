import Joi from 'joi';

export interface ScrapeRequest {
    url: string;
}

export const scrapeRequestSchema = Joi.object({
    body: Joi.object({
        url: Joi.string().required(),
    }),
});
