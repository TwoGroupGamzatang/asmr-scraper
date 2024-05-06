import { ErrorCode } from '../../error.code';
import { BusinessException } from '../business.exception';

export class AlreadyScrapedException extends BusinessException {
    constructor() {
        super(ErrorCode.alreadyScraped);
        Object.setPrototypeOf(this, BusinessException.prototype);
    }
}
