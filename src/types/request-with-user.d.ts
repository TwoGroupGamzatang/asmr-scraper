import { Request } from 'express';

interface UserPayload {
    id: string;
}

interface RequestWithUser extends Request {
    user: UserPayload;
}
