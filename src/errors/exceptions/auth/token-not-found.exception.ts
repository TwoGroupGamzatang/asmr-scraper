import { ErrorCode } from '../../error.code';
import { AccessDeniedException } from '../access-denied.exception';

export class TokenNotFoundException extends AccessDeniedException {
    constructor() {
        super(ErrorCode.tokenNotFound);
        Object.setPrototypeOf(this, AccessDeniedException.prototype);
    }
}
