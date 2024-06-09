import { ErrorCode } from '../../error.code';
import { EntityNotFoundException } from '../entity-not-found.exception';

export class PersonalClassifierNotFoundException extends EntityNotFoundException {
    constructor() {
        super(ErrorCode.personalClassifierNotFound);
        Object.setPrototypeOf(this, EntityNotFoundException.prototype);
    }
}
