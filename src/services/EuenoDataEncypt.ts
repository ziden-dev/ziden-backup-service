import EuenoDataEncrypt from "../models/EuenoDataEncrypt.js";
import { getDataFromUrl, uploadClaimDataToEueno } from "./EuenoIntegrate.js";

export async function euenoUpdateData(holderId: string, issuerId: string, claimId: string, data: string, nonce: string) {
    try {
        const id = holderId + "-" + issuerId + "-" + claimId;

        const dataEncrypt = await EuenoDataEncrypt.findOne({
            _id: id
        });
        if (dataEncrypt) {
            const claimInfor = {
                holderId: holderId,
                issuerId: issuerId,
                claimId: claimId,
                data: data,
                nonce: nonce
            }
            const url = await uploadClaimDataToEueno(claimInfor, id);
            dataEncrypt.url = url;
            await dataEncrypt.save();
            return dataEncrypt;
        } else {
            const claimInfor = {
                holderId: holderId,
                issuerId: issuerId,
                claimId: claimId,
                data: data,
                nonce: nonce
            }
            const url = await uploadClaimDataToEueno(claimInfor, id);
            const newData = new EuenoDataEncrypt({
                _id: id,
                holderId: holderId,
                issuerId: issuerId,
                claimId: claimId,
                url: url
            });
            await newData.save();
            return newData;
        }
    } catch (err: any) {
        console.log(err);
        throw (err);
    }
}

export async function euenoGetAllClaimByQuery(holderId: string | undefined, issuerId: string | undefined, claimId: string | undefined) {
    try {
        const query: any = {};
        if (holderId != "") {
            query.holderId = holderId;
        }
        if (issuerId != "") {
            query.issuerId = issuerId;
        }
        if (claimId != "") {
            query.claimId = claimId;
        }
        
        const dataEncrypts = await EuenoDataEncrypt.find(query);
        const res: Array<any> = [];
        
        for (let i = 0; i < dataEncrypts.length; i++) {
            const data = await getDataFromUrl( dataEncrypts[i].url! );
            res.push(data);
        }
        
        return res;
    } catch (err: any) {
        throw (err);
    }
}