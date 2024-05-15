import { ErrorCode } from '../../error.code';
import { EntityNotFoundException } from '../entity-not-found.exception';

export class MemoNotFoundException extends EntityNotFoundException {
    constructor() {
        super(ErrorCode.memoNotFound);
        Object.setPrototypeOf(this, EntityNotFoundException.prototype);
    }
}
