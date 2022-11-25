import { Request, Response } from "express";
import { buildErrorMessage, buildResponse } from "../common/APIBuilderResponse.js";
import { ExceptionMessage } from "../common/enum/ExceptionMessages.js";
import { ResultMessage } from "../common/enum/ResultMessages.js";

import { getAllClaimByQuery, updateData } from "../services/DataEncypt.js";

export class DataEncryptController {
    public async updateData(req: Request, res: Response) {
        try {
            const {holderId, issuerId, claimId, data, nonce} = req.body;
            if (!holderId || !issuerId || !claimId|| !data || !nonce) {
                throw("Invalid data!");
            }
            const apiResponse = await updateData(holderId, issuerId, claimId, data, nonce);
            res.send(buildResponse(ResultMessage.APISUCCESS.status, apiResponse, ResultMessage.APISUCCESS.message));
        
        } catch (err: any) {
            res.send(buildErrorMessage(ExceptionMessage.UNKNOWN.status, err, ExceptionMessage.UNKNOWN.message));
        }
    }

    public async getAllClaimBy(req: Request, res: Response) {
        try {
            let {holderId, issuerId, claimId} = req.query;
            if (holderId == undefined)
                holderId = "";
            if (typeof holderId != "string") {
                throw("holderId must be string");
            }

            if (issuerId == undefined)
                issuerId = "";
            if (typeof issuerId != "string") {
                throw("holderId must be string");
            }

            if (claimId == undefined)
                claimId = "";
            if (typeof claimId != "string") {
                throw("holderId must be string");
            }

            const dataEncrypt = await getAllClaimByQuery(holderId, issuerId, claimId);
            console.log(dataEncrypt);
            res.send(buildResponse(ResultMessage.APISUCCESS.status, {dataEncrypt: dataEncrypt}, ResultMessage.APISUCCESS.message));
        } catch (err: any) {
            res.send(buildErrorMessage(ExceptionMessage.UNKNOWN.status, err, ExceptionMessage.UNKNOWN.message));
        }
    }
}