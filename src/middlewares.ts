import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as config from './config';

const allowCrossDomain = (req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "*");

    if ("OPTIONS" === req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};

const checkAuthentication = (req: Request, res: Response, next: NextFunction)=> {
    const bearerPrefix: string = "Bearer ";
    var token = req.headers.authorization as string;

    if (!token) {
        res.status(401).send({
            error: "Unauthorized",
            message: "No token was provided",
        });
        return;
    }

    if (token.startsWith(bearerPrefix)) {
        token = token.slice(bearerPrefix.length, token.length);
    }

    try {
        const decoded = jwt.verify(token, config.JWT_KEY) as jwt.JwtPayload;

        if (!decoded || typeof decoded !== "object" || !decoded.id) {
            console.error("Failed to decode token");
            res.status(401).json({
                error: "Unauthorized",
                message: "Invalid token",
            });
            return;
        }

        next();
    } catch (error) {
        console.error("Failed to verify token:", error);
        res.status(401).send({
            error: "Unauthorized",
            message: "Invalid token",
        });
    }
};

export { allowCrossDomain, checkAuthentication };
