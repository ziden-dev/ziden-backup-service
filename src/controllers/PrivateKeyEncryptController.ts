import { Request, Response } from "express";
import { buildErrorMessage, buildResponse } from "../common/APIBuilderResponse.js";
import { ExceptionMessage } from "../common/enum/ExceptionMessages.js";
import { ResultMessage } from "../common/enum/ResultMessages.js";
import { updatePrivateKey, getPrivateKey } from "../services/PrivateKeyEncypt.js";

export class PrivateKeyEncryptController {
    public async updatePrivateKey(req: Request, res: Response) {
        try {
            const {holderId, keyEncrypt} = req.body;
            if (!holderId || !keyEncrypt) {
                throw("Invalid data");
            }
            const privateKeyEncrypt = await updatePrivateKey(holderId, keyEncrypt);
            res.send(buildResponse(ResultMessage.APISUCCESS.status, privateKeyEncrypt, ResultMessage.APISUCCESS.message));
        } catch (err: any) {
            res.send(buildErrorMessage(ExceptionMessage.UNKNOWN.status, err, ExceptionMessage.UNKNOWN.message));
        }
    }

    public async getPrivateKey(req: Request, res: Response) {
        try {
            const {holderId} = req.query;
            if (!holderId || typeof holderId != "string") {
                throw("Invalid data");
            }
            
            const privateKeyEncrypt = await getPrivateKey(holderId);
            res.send(buildResponse(ResultMessage.APISUCCESS.status, {privateKeyEncrypt: privateKeyEncrypt}, ResultMessage.APISUCCESS.message));
        } catch (err: any) {
            res.send(buildErrorMessage(ExceptionMessage.UNKNOWN.status, err, ExceptionMessage.UNKNOWN.message));
        }
    }
}