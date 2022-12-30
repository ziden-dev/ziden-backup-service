import { Request, Response } from "express";
import { buildErrorMessage, buildResponse } from "../common/APIBuilderResponse.js";
import { ExceptionMessage } from "../common/enum/ExceptionMessages.js";
import { ResultMessage } from "../common/enum/ResultMessages.js";
import { euenoUpdatePrivateKey, euenoGetPrivateKey } from "../services/EuenoPrivateKeyEncypt.js";
import { getPrivateKey, updatePrivateKey } from "../services/PrivateKeyEncypt.js";

export class PrivateKeyEncryptController {
    public async updatePrivateKey(req: Request, res: Response) {
        try {
            const {holderId, keyEncrypt} = req.body;
            if (!holderId || !keyEncrypt) {
                throw("Invalid data");
            }

            const {type} = req.query;
            if (type != "ZIDEN" && type != "EUENO") {
                throw("type must be equal ZIDEN or EUENO");
            }

            if (type == "EUENO") {
                const privateKeyEncrypt = await euenoUpdatePrivateKey(holderId, keyEncrypt);
                res.send(buildResponse(ResultMessage.APISUCCESS.status, privateKeyEncrypt, ResultMessage.APISUCCESS.message));
            }

            if (type == "ZIDEN") {
                const privateKeyEncrypt = await updatePrivateKey(holderId, keyEncrypt);
                res.send(buildResponse(ResultMessage.APISUCCESS.status, privateKeyEncrypt, ResultMessage.APISUCCESS.message));
            }

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
            
            const {type} = req.query;
            if (type != "ZIDEN" && type != "EUENO") {
                throw("type must be equal ZIDEN or EUENO");
            }

            if (type == "EUENO") {
                const privateKeyEncrypt = await euenoGetPrivateKey(holderId);
                res.send(buildResponse(ResultMessage.APISUCCESS.status, {privateKeyEncrypt: privateKeyEncrypt}, ResultMessage.APISUCCESS.message));    
            }

            if (type == "ZIDEN") {
                const privateKeyEncrypt = await getPrivateKey(holderId);
                res.send(buildResponse(ResultMessage.APISUCCESS.status, {privateKeyEncrypt: privateKeyEncrypt}, ResultMessage.APISUCCESS.message));
            }

            } catch (err: any) {

            res.send(buildErrorMessage(ExceptionMessage.UNKNOWN.status, err, ExceptionMessage.UNKNOWN.message));
        }
    }
}