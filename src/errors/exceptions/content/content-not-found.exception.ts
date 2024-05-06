import { ErrorCode } from '../../error.code';
import { EntityNotFoundException } from '../entity-not-found.exception';

export class ContentNotFoundException extends EntityNotFoundException {
    constructor() {
        super(ErrorCode.contentNotFound);
        Object.setPrototypeOf(this, EntityNotFoundException.prototype);
    }
}
