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
            'http://localhost:5002/openai/summary',
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
            return JSON.stringify(response.data);
        } else {
            return response.data;
        }
    } catch (error: any) {
        logger.error(error);
        throw new SummarizeFailedException();
    }
}
