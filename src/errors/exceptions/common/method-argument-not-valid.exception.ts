import { ErrorCode } from '../../error.code';
import { InvalidValueException } from '../invalid-value.exception';

export class MethodArgumentNotValidException extends InvalidValueException {
    constructor() {
        super(ErrorCode.methodArgumentNotValid);
        Object.setPrototypeOf(this, InvalidValueException.prototype);
    }
}
