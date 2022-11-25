import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../common/config/secrets.js";
import { buildResponse, buildExceptionMessage, buildErrorMessage } from "../common/APIBuilderResponse.js";
import { ExceptionMessage } from "../common/enum/ExceptionMessages.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import { hashSalt, jwtTimeExpires } from '../common/config/constant.js';
import jsonwebtoken from 'jsonwebtoken';
import { ResultMessage } from "../common/enum/ResultMessages.js";
import passport from "passport";
import "./authen/PassportHandle.js";
export class AuthenController {
    public authenticateJWT(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", function (err, user, info) {
            if (err) {
                console.log(err);
                return res.status(ExceptionMessage.UNAUTHORIZED.status)
                    .send(buildExceptionMessage(ExceptionMessage.UNAUTHORIZED.status, ExceptionMessage.UNAUTHORIZED.message));
            }

            if (!user) {
                return res.status(ExceptionMessage.UNAUTHORIZED.status)
                    .send(buildExceptionMessage(ExceptionMessage.UNAUTHORIZED.status, ExceptionMessage.UNAUTHORIZED.message));
            } else {
                res.locals.user = user;
                next();
            }
        })(req, res, next);
    }

    public authenticateUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("local", function (err, user, info) {
            if (err) {
                console.log(err);
                return res.status(ExceptionMessage.UNAUTHORIZED.status)
                    .send(buildExceptionMessage(ExceptionMessage.UNAUTHORIZED.status, ExceptionMessage.UNAUTHORIZED.message));
            }

            if (!user) {
                return res.status(ExceptionMessage.UNAUTHORIZED.status)
                    .send(buildExceptionMessage(ExceptionMessage.UNAUTHORIZED.status, ExceptionMessage.UNAUTHORIZED.message));
            } else {
                next();
            }
        })(req, res, next);
    }

    public async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            if (!username
                || !password
                || typeof username !== "string"
                || typeof password !== "string") {
                const apiResponse = buildExceptionMessage(ExceptionMessage.INVALID_DATA.status, ExceptionMessage.INVALID_DATA.message);
                res.send(apiResponse);
                return;
            }

            if (username.length > 20) {
                res.send(buildExceptionMessage(ExceptionMessage.INVALID_LENGTH_USERNAME.status, ExceptionMessage.INVALID_LENGTH_USERNAME.message));
                return;
            }

            if (password.length > 20) {
                res.send(buildExceptionMessage(ExceptionMessage.INVALID_LENGTH_PASSWORD.status, ExceptionMessage.INVALID_LENGTH_PASSWORD.message));
                return;
            }

            const user = await User.findOne({ username: username });
            if (user != null) {
                const apiResponse = buildExceptionMessage(ExceptionMessage.USERNAME_EXITED.status, ExceptionMessage.USERNAME_EXITED.message);
                res.send(apiResponse);
                return;
            } else {
                const hashPassword = await bcrypt.hash(password, hashSalt);
                const newUser = new User({
                    username: username,
                    password: hashPassword
                });
                await newUser.save();
                const jwtToken = jsonwebtoken.sign(
                    {
                        username: username,
                        scope: req.body.scope
                    },
                    JWT_SECRET,
                    {
                        expiresIn: jwtTimeExpires
                    }
                );

                const apiResponse = buildResponse(ResultMessage.APISUCCESS.status, { token: jwtToken }, ResultMessage.APISUCCESS.message);
                res.send(apiResponse);
                return;
            }


        } catch (err: any) {
            res.send(buildErrorMessage(ExceptionMessage.UNKNOWN.status, err, ExceptionMessage.UNKNOWN.message));
            return;
        }

    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            if (!username
                || !password
                || typeof username !== "string"
                || typeof password !== "string") {
                const apiResponse = buildExceptionMessage(ExceptionMessage.INVALID_DATA.status, ExceptionMessage.INVALID_DATA.message);
                res.send(apiResponse);
                return;
            }

            const jwtToken = jsonwebtoken.sign({
                username: username,
                scope: req.body.scope
            },
                JWT_SECRET, {
                expiresIn: jwtTimeExpires
            }
            );

            const apiResponse = buildResponse(ResultMessage.APISUCCESS.status, { token: jwtToken }, ResultMessage.APISUCCESS.message);
            res.send(apiResponse);
            return;
        } catch (err: any) {
            res.send(buildErrorMessage(ExceptionMessage.UNKNOWN.status, err, ExceptionMessage.UNKNOWN.message));
            return;
        }
    }

    public loginsucess(req: Request, res: Response): void {
        try {
            res.send({
                message: "login sucess"
            });
            return;
        } catch (err: any) {
            res.send(buildErrorMessage(ExceptionMessage.UNKNOWN.status, err, ExceptionMessage.UNKNOWN.message));
            return;
        }
    }
}