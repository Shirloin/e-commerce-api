import { NextFunction } from "express";
import { validationResult } from "express-validator";

export function getProduct(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
}