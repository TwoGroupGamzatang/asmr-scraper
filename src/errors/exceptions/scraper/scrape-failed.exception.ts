import { ErrorCode } from '../../error.code';
import { InternalServerException } from '../internal-server.exception';

export class ScrapeFailedException extends InternalServerException {
    constructor() {
        super(ErrorCode.scrapeFailed);
        Object.setPrototypeOf(this, InternalServerException.prototype);
    }
}
