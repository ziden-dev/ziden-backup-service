import EuenoPrivateKeyEncrypt from "../models/EuenoPrivateKeyEncrypt.js";
import { getDataFromUrl, uploadPrivateKeyEncryptToEueno } from "./EuenoIntegrate.js";

export async function euenoUpdatePrivateKey(holderId: string, keyEncrypt: string) {
    try {
        const privateKey = await EuenoPrivateKeyEncrypt.findOne({_id: holderId});
        if (!privateKey) {
            const timeUpdate = Date.now();
            const privateKeyInfor = {
                _id: holderId,
                holderId: holderId,
                keyEncrypt: keyEncrypt,
                lastUpdate: timeUpdate
            };
            const url = await uploadPrivateKeyEncryptToEueno(privateKeyInfor, holderId);

            const newPrivate = new EuenoPrivateKeyEncrypt({
                _id: holderId,
                holderId: holderId,
                url: url,
                lastUpdate: timeUpdate
            });

            await newPrivate.save();
            return newPrivate;
        } else {
            const timeUpdate = Date.now();
            const privateKeyInfor = {
                _id: holderId,
                holderId: holderId,
                keyEncrypt: keyEncrypt,
                lastUpdate: timeUpdate
            };
            const url = await uploadPrivateKeyEncryptToEueno(privateKeyInfor, holderId);

            privateKey.url = url;
            privateKey.lastUpdate = timeUpdate;

            await privateKey.save();
            return privateKey;
        }
    } catch (err) {
        
        throw(err);
    }
}

export async function euenoGetPrivateKey(holderId: string) {
    try {
        const privateKey = await EuenoPrivateKeyEncrypt.findOne({_id: holderId});
        if (!privateKey) {
            throw("HolderId not exist!");
        }

        const data = await getDataFromUrl(privateKey.url!);
        return data;
    } catch (err) {
        
        throw(err);
    }
}