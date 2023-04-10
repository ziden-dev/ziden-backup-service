import { Request, Response } from "express";
import { buildErrorMessage, buildResponse } from "../common/APIBuilderResponse.js";
import { ExceptionMessage } from "../common/enum/ExceptionMessages.js";
import { ResultMessage } from "../common/enum/ResultMessages.js";
import { createNewHolder, getHolderPublicKey, updateHolderPublicKey } from "../services/Holder.js";

export class HolderController {
    public async createNewHolder(req: Request, res: Response) {
        try {
            const {holderId, publicKey} = req.body;
            if (!holderId || !publicKey) {
                throw("Invalid data");
            }

            const holder = await createNewHolder(holderId, publicKey);
            res.send(buildResponse(ResultMessage.APISUCCESS.status, holder, ResultMessage.APISUCCESS.message));

        } catch (err: any) {
            res.send(buildErrorMessage(ExceptionMessage.UNKNOWN.status, err, ExceptionMessage.UNKNOWN.message));
        }
    }

    public async uploadHolder(req: Request, res: Response) {
        try {
            const {holderId, publicKey} = req.body;
            if (!holderId || !publicKey) {
                throw("Invalid data");
            }

            const holder = await updateHolderPublicKey(holderId, publicKey);
            res.send(buildResponse(ResultMessage.APISUCCESS.status, holder, ResultMessage.APISUCCESS.message));

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

            const holder = await getHolderPublicKey(holderId);
            res.send(buildResponse(ResultMessage.APISUCCESS.status, holder, ResultMessage.APISUCCESS.message));
            
            } catch (err: any) {

            res.send(buildErrorMessage(ExceptionMessage.UNKNOWN.status, err, ExceptionMessage.UNKNOWN.message));
        }
    }
}