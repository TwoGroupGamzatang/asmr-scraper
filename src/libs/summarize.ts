import axios from 'axios';
import { Logger } from './logger';
import { SummarizeFailedException } from '../errors/exceptions/external/summarize-failed.exception';

const logger = new Logger(__filename);

export async function getAISummarize(
    url: string,
    originalText: string,
    readTime: number,
    userId?: string
) {
    try {
        const response = await axios.post(
            // TODO: 추후에는 환경변수로 변경
            'http://localhost:5002/api/openai/summary',
            {
                url,
                originalText,
                readTime,
            },
            {
                headers: {
                    'X-ASMR-User-Id': userId,
                },
            }
        );

        if (typeof response.data === 'object') {
            return {
                summary: JSON.stringify(response.data),
                tags: extractTagsFromSummary(response.data.summary),
            };
        } else {
            return {
                summary: response.data,
            };
        }
    } catch (error: any) {
        logger.error(error);
        throw new SummarizeFailedException();
    }
}

function extractTagsFromSummary(summary: string): string[] {
    const tagExtractionStart =
        summary.indexOf('Tag extraction\n') + 'Tag extraction\n'.length;
    const tagExtractionEnd = summary.indexOf('\n\n', tagExtractionStart);
    const tagExtraction = summary.slice(tagExtractionStart, tagExtractionEnd);
    return tagExtraction.split(', ').map((tag) => tag.trim());
}
