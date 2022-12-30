import DataEncrypt from "../models/DataEncrypt.js";

export async function updateData(holderId: string, issuerId: string, claimId: string, data: string, nonce: string) {
    try {
        const id = holderId + "-" + issuerId + "-" + claimId;

        const dataEncrypt = await DataEncrypt.findOne({
            _id: id
        });
        if (dataEncrypt) {
            dataEncrypt.data = data;
            dataEncrypt.nonce = nonce;
            await dataEncrypt.save();
            return dataEncrypt;
        } else {
            const newData = new DataEncrypt({
                _id: id,
                holderId: holderId,
                issuerId: issuerId,
                claimId: claimId,
                data: data,
                nonce: nonce
            });
            await newData.save();
            return newData;
        }
    } catch (err: any) {
        throw (err);
    }
}

export async function getAllClaimByQuery(holderId: string | undefined, issuerId: string | undefined, claimId: string | undefined) {
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
        console.log(query);
        const dataEncrypts = await DataEncrypt.find(query);
        const res: Array<any> = [];
        dataEncrypts.forEach((element) => {
            const tmp = {
                holderId: element.holderId?.toString(),
                issuerId: element.issuerId?.toString(),
                claimId: element.claimId?.toString(),
                data: element.data?.toString(),
                nonce: element.nonce?.toString()
            };
            res.push(tmp);
        });
        return res;
    } catch (err: any) {
        throw (err);
    }
}