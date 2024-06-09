import { ErrorCode } from '../../error.code';
import { InternalServerException } from '../internal-server.exception';

export class ClassificationFailedException extends InternalServerException {
    constructor() {
        super(ErrorCode.classificationFailed);
        Object.setPrototypeOf(this, InternalServerException.prototype);
    }
}
