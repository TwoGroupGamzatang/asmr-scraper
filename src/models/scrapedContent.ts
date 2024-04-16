import mongoose from 'mongoose';

const scrapedContentSchema = new mongoose.Schema({
    userId: { type: String, require: true },

    // Article URL
    url: { type: String, required: true },
    origin: { type: String, required: true },

    // Article Metadata
    title: { type: String, required: true },
    writer: { type: String, required: false },
    writedAt: { type: Date, required: false },

    // Article Content
    content: { type: String, required: true },

    // Scraped Metadata
    scrapedAt: { type: Date, default: Date.now },
});

scrapedContentSchema.index({ userId: 1 });
scrapedContentSchema.index({ url: 1 }, { unique: true });

export const ScrapedContent = mongoose.model(
    'ScrapedContent',
    scrapedContentSchema
);
