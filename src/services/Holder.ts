import Holder from "../models/Holder.js";

export async function createNewHolder(holderId: string, publicKey: string) {
    const holder = await Holder.findOne({holderId: holderId});
    if (holder) {
        const response = await updateHolderPublicKey(holderId, publicKey);
        return response;
    } else {
        while (publicKey.length < 64) {
            publicKey = "0" + publicKey;
        }
        
        const newHolder = new Holder({
            holderId: holderId,
            publicKey: publicKey,
            lastUpdate: Number(Date.now())
        });
        await newHolder.save();
        return {
            holderId: newHolder.holderId,
            publicKey: newHolder.publicKey,
            lastUpdate: newHolder.lastUpdate
        };
    }
}

export async function updateHolderPublicKey(holderId: string, publicKey: string) {
    const holder = await Holder.findOne({holderId: holderId});
    if (!holder) {
        throw("HolderId not exist!");
    }

    while (publicKey.length < 64) {
        publicKey = "0" + publicKey;
    }

    holder.publicKey = publicKey;
    holder.lastUpdate = Number(Date.now());
    await holder.save();
    return {
        holderId: holder.holderId,
        publicKey: holder.publicKey,
        lastUpdate: holder.lastUpdate
    }
}

export async function getHolderPublicKey(holderId: string) {
    const holder = await Holder.findOne({holderId: holderId});
    if (!holder) {
        throw("HolderId not exist!");
    }
    
    return {
        holderId: holder.holderId,
        publicKey: holder.publicKey,
        lastUpdate: holder.lastUpdate
    }
}