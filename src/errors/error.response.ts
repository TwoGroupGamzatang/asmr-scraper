import { ErrorCode } from './error.code';

export class ErrorResponse {
    public message: string;
    public status: number;
    public code: string;

    constructor(errorCode: ErrorCode) {
        this.message = errorCode.message;
        this.status = errorCode.status;
        this.code = errorCode.code;
    }
}
