import { ErrorCode } from '../../error.code';
import { BusinessException } from '../business.exception';

export class OnlyDeleteMyContentException extends BusinessException {
    constructor() {
        super(ErrorCode.onlyDeleteMyContent);
        Object.setPrototypeOf(this, BusinessException.prototype);
    }
}
