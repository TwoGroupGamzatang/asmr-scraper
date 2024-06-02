import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { env } from '../env';
import {
    InvalidTokenException,
    TokenNotFoundException,
} from '../errors/exceptions/auth';

// JWT 토큰을 파싱하는 미들웨어
const parseJwtMiddleware = (
    req: any,
    res: Response,
    next: NextFunction
): void => {
    let authHeader = undefined;
    if (req && req.headers) {
        authHeader = req.headers.authorization;
    }

    if (authHeader) {
        const token = authHeader?.substring(7); // Bearer 토큰을 추출합니다.

        try {
            // 토큰을 검증하고 페이로드를 추출합니다.
            const payload = jwt.verify(token, env.jwt.secret) as jwt.JwtPayload;

            req.user = { id: payload.sub };
            next();
        } catch (err) {
            console.error(err);
            // 토큰 검증에 실패하면 오류를 반환합니다.
            throw new InvalidTokenException();
        }
    } else {
        throw new TokenNotFoundException();
    }
};

export default parseJwtMiddleware;
