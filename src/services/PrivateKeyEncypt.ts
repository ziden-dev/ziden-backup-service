import PrivateKeyEncrypt from "../models/PrivateKeyEncrypt.js";

export async function updatePrivateKey(holderId: string, keyEncrypt: string) {
    try {
        const privateKey = await PrivateKeyEncrypt.findOne({_id: holderId});
        if (!privateKey) {
            const newPrivate = new PrivateKeyEncrypt({
                _id: holderId,
                holderId: holderId,
                keyEncrypt: keyEncrypt,
                lastUpdate: Date.now()
            });

            await newPrivate.save();
            return newPrivate;
        } else {
            privateKey.keyEncrypt = keyEncrypt;
            privateKey.lastUpdate = Date.now();

            await privateKey.save();
            return privateKey;
        }
    } catch (err) {
        console.log(err);
        throw(err);
    }
}

export async function getPrivateKey(holderId: string) {
    try {
        const privateKey = await PrivateKeyEncrypt.findOne({_id: holderId});
        return privateKey;
    } catch (err) {
        console.log(err);
        throw(err);
    }
}