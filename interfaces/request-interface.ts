import { Request } from "express";

export interface IRequest extends Request{
    user: {
        user_id: string
    }
}