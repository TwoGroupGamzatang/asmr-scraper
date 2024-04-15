import { ErrorCode } from '../../error.code';
import { InvalidValueException } from '../invalid-value.exception';

export class NoScraperAvailableException extends InvalidValueException {
    constructor() {
        super(ErrorCode.noScraperAvailable);
        Object.setPrototypeOf(this, InvalidValueException.prototype);
    }
}
