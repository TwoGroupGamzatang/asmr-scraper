import mongoose from 'mongoose';

const scrapedContentSchema = new mongoose.Schema({
    userId: { type: String, require: true },

    // Article URL
    url: { type: String, required: true },
    origin: { type: String, required: true },

    // Article Metadata
    title: { type: String, required: true },
    tags: { type: [String], required: false },
    writer: { type: String, required: false },
    writedAt: { type: Date, required: false },

    // Article Content
    content: { type: String, required: true },

    // Summary
    summary: { type: String, required: false },
    readTime: { type: Number, required: false },

    // Scraped Metadata
    scrapedAt: { type: Date, default: Date.now },

    isDeleted: { type: Boolean, default: false },
});

scrapedContentSchema.index({ userId: 1, deleted: 1 });
scrapedContentSchema.index({ url: 1, userId: 1, isDeleted: 1 });

export const ScrapedContent = mongoose.model(
    'ScrapedContent',
    scrapedContentSchema
);
