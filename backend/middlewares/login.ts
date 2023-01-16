import { NextFunction, Request, Response } from "express";
import { getUserIfPasswordMatches } from "../services/userService";

export const validateLoginCredentials = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.sendStatus(401);

    const user = await getUserIfPasswordMatches(req.body);

    if (user) {
        req.user = user;
        next();
    } else {
        return res.status(401).json("Credentials invalid");
    }
};
