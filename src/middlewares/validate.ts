import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import pick from '../utils/pick';
import { Logger } from '../libs/logger';
import { MethodArgumentNotValidException } from '../errors/exceptions/common';

const logger = new Logger(__filename);

/**
 * Validate request against schema
 *
 * @param {object} schema - Joi schema object
 * @throws {MethodArgumentNotValidException} - If request is invalid
 */
const validate =
    (schema: object) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        const validSchema = pick(schema, ['params', 'query', 'body']);
        const obj = pick(req, Object.keys(validSchema));
        const { value, error } = Joi.compile(validSchema)
            .prefs({ errors: { label: 'key' }, abortEarly: false })
            .validate(obj);

        if (error) {
            const errorMessage = error.details
                .map((details: { message: any }) => details.message)
                .join(', ');
            logger.error(errorMessage);
            throw new MethodArgumentNotValidException();
        }
        Object.assign(req, value);
        next();
    };

export default validate;
