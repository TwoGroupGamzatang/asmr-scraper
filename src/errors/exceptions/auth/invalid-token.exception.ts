import { ErrorCode } from '../../error.code';
import { AccessDeniedException } from '../access-denied.exception';

export class InvalidTokenException extends AccessDeniedException {
    constructor() {
        super(ErrorCode.invalidToken);
        Object.setPrototypeOf(this, AccessDeniedException.prototype);
    }
}
