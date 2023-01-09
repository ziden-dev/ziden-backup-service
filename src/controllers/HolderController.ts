import { Request, Response } from "express";
import { buildErrorMessage, buildResponse } from "../common/APIBuilderResponse.js";
import { ExceptionMessage } from "../common/enum/ExceptionMessages.js";
import { ResultMessage } from "../common/enum/ResultMessages.js";
import { getHolderDek, updateHolderDek } from "../services/Holder.js";

export class HolderController {
    public async uploadHolder(req: Request, res: Response) {
        try {
            const {holderId, dek} = req.body;
            if (!holderId || !dek) {
                throw("Invalid dât");
            }

            const privateKeyEncrypt = await updateHolderDek(holderId, dek);
            res.send(buildResponse(ResultMessage.APISUCCESS.status, privateKeyEncrypt, ResultMessage.APISUCCESS.message));

        } catch (err: any) {
            res.send(buildErrorMessage(ExceptionMessage.UNKNOWN.status, err, ExceptionMessage.UNKNOWN.message));
        }
    }

    public async getHolder(req: Request, res: Response) {
        try {
            const {holderId} = req.query;
            if (!holderId || typeof holderId != "string") {
                throw("Invalid holderId");
            }

            const privateKeyEncrypt = await getHolderDek(holderId);
            res.send(buildResponse(ResultMessage.APISUCCESS.status, {privateKeyEncrypt: privateKeyEncrypt}, ResultMessage.APISUCCESS.message));
            
            } catch (err: any) {

            res.send(buildErrorMessage(ExceptionMessage.UNKNOWN.status, err, ExceptionMessage.UNKNOWN.message));
        }
    }
}