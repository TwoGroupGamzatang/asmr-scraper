import { ErrorCode } from '../../error.code';
import { ExternalApiFailedException } from '../external-api-failed.exception';

export class SummarizeFailedException extends ExternalApiFailedException {
    constructor() {
        super(ErrorCode.summarizeFailed);
        Object.setPrototypeOf(this, ExternalApiFailedException.prototype);
    }
}
