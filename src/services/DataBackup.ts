import { BACKUP_SERVER_URI } from "../common/config/secrets.js";
import DataBackup from "../models/DataBackup.js";

export async function backupData(holderId: string, issuerId: string, claimId: string, data: string) {
    try {
        const id = holderId + "-" + issuerId + "-" + claimId;

        const dataBackup = await DataBackup.findOne({
            _id: id
        });
        if (dataBackup) {
            dataBackup.data = data;
            await dataBackup.save();
            return BACKUP_SERVER_URI + "/api/data/" + dataBackup.id;
        } else {
            const newData = new DataBackup({
                _id: id,
                holderId: holderId,
                issuerId: issuerId,
                claimId: claimId,
                data: data            
            });
            await newData.save();
            return BACKUP_SERVER_URI + "/api/data/" + newData.id;
        }
    } catch (err: any) {
        throw (err);
    }
}

export async function getDataById(id: String) {
    const data = await DataBackup.findOne({_id: id});
    if (!data) {
        throw("Id is not existed!");
    } else {
        return {
            holderId: data.holderId,
            issuerId: data.issuerId,
            claimId: data.claimId,
            data: data.data
        }
    }
}