import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export function create_product(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
}