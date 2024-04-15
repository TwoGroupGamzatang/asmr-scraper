import { ErrorCode } from '../../error.code';
import { InvalidValueException } from '../invalid-value.exception';

export class NotFoundException extends InvalidValueException {
    constructor() {
        super(ErrorCode.notFound);
        Object.setPrototypeOf(this, InvalidValueException.prototype);
    }
}
