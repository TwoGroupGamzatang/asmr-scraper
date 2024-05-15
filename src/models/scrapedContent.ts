import mongoose, { Types } from 'mongoose';

interface Memo {
    _id?: Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}

const memoSchema = new mongoose.Schema<Memo>(
    {
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true, // createdAt과 updatedAt 필드를 자동으로 관리
    }
);

interface ScrapedContent {
    _id?: Types.ObjectId;
    userId: string;

    url: string;
    origin: string;

    title: string;
    tags?: string[];
    writer?: string;
    writedAt?: Date;

    content: string;

    summary?: string;
    readTime?: number;

    memos: Memo[];

    scrapedAt: Date;
    isDeleted: boolean;
}

const scrapedContentSchema = new mongoose.Schema<ScrapedContent>({
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

    // Memo
    memos: { type: [memoSchema], default: [], required: false },

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
