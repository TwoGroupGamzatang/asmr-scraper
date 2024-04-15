import { ErrorRequestHandler } from 'express';

import {
    AccessDeniedException,
    BusinessException,
    EntityNotFoundException,
    ExternalApiFailedException,
    InternalServerException,
    InvalidValueException,
} from '../errors/exceptions';
import { ErrorCode } from '../errors/error.code';
import { ErrorResponse } from '../errors/error.response';
import { Logger } from '../libs/logger';

/**
 * Check if the error is checked exception (defined in error.code.ts)
 */
const isCheckedException = (error: Error): boolean => {
    return (
        error instanceof AccessDeniedException ||
        error instanceof BusinessException ||
        error instanceof EntityNotFoundException ||
        error instanceof ExternalApiFailedException ||
        error instanceof InternalServerException ||
        error instanceof InvalidValueException
    );
};

const logger = new Logger(__filename);

/**
 * Global error handler
 *
 * If the error is not checked exception, it will be logged and return 500 error code
 * else it will return the error code and message
 */
export const globalErrorHandler: ErrorRequestHandler = (
    err,
    _req,
    res,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next
) => {
    const error = err;
    logger.error(err);

    const errorCode = !isCheckedException(error)
        ? ErrorCode.internalServerError
        : error.errorCode;
    res.locals.errorMessage = errorCode.message;
    res.status(errorCode.status).json(new ErrorResponse(errorCode));
};
