export interface IDataEncrypt {
    holderId: string,
    issuerId: string,
    claimid: string,
    data: Array<number>,
    nonce: Array<number>
}

export interface IPrivateKeyEncrypt {
    holderId: string,
    keyEncrypt: string,
    nonce: Array<number>,
    lastUpdate: number
}