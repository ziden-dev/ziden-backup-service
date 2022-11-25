import dotenv from 'dotenv';
import process from 'process';
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/ISSUER_SERVER";
export const JWT_SECRET = process.env.JWT_SECRET ?? "random@123";
export const isProduction = process.env.NODE_ENV == "production";
export const LOG_LEVEL = process.env.LOG_LEVEL ?? "debug";
export const LOG_OUTPUT = process.env.LOG_OUTPUT ?? "dev";

export const DATA_ENCRYPT_DB_PATH = process.env.DATA_ENCRYPT_DB_PATH ?? "db/data_encrypt";
export const PRIVATE_KEY_ENCRYPT_DB_PATH = process.env.PRIVATE_KEY_ENCRYPT_DB_PATH ?? "db/private_key_encrypt";
