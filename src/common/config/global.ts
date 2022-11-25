import Level from "level-ts";
import { IDataEncrypt, IPrivateKeyEncrypt } from "../../type/interface.js";
import { DATA_ENCRYPT_DB_PATH, PRIVATE_KEY_ENCRYPT_DB_PATH } from "./secrets.js";

// export const DataEncryptLevelDb = new Level<IDataEncrypt>(DATA_ENCRYPT_DB_PATH);
// export const PrivateKeyEncryptLevelDb = new Level<IPrivateKeyEncrypt>(PRIVATE_KEY_ENCRYPT_DB_PATH);