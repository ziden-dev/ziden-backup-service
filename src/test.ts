import axios from "axios";
import libsodium from "libsodium-wrappers";
import fetch from "node-fetch";

const key_gen = {
    publicKey: '15f84b01d69ce8ba54264f666a3266ff64a3b386c4da60771d92647185dde720',
    privateKey: '809b4a4ea1d8572fda6b6fecfffb4f25b4fa3d83306439423cc8ed42ad1f6cc9',
    keyType: 'x25519'
}
const dek = "eb2c2eb5af34b4b2c32fae36550b95645c67dcc7430170604e39ce2b8c83a383";

const baseUrl = "http://localhost:5005";
const urlPrivateEncrypt = "/api/private-key-encrypt";
const urlEncrypt = "/api/data-encrypt";

async function encodeClaim() {
    const claim = {
        rawData: {
            docId: 'id123451zyxtki',
            docType: 'National ID',
            name: 'Tuan',
            dob: 20000101,
            countryCode: 10,
            userId: '1234567'
        },
        claim: [
            'a0000000000000000000000000001e240',
            '1234567',
            'ee8524bf26710d75b8ef0bd9a1a94cc8b4986ebaca33d9027f637be414c3efd',
            '201c5bc91ad990d8e30b3eacc46582036c6daaa1588f42af8bd431876b7525be',
            '1843158eb650000000000000007',
            '0',
            '8818d2861edd17e1ec5cd9c0c58c283b125d5d13d1ba2983b70173a4eef6f5c',
            'a01312d65'
        ]
    };

    await libsodium.ready;

    console.log(key_gen);


    // genereate DEK
    const dek = libsodium.crypto_secretbox_keygen("hex");
    console.log("dek", dek);

    // encode claim by dek
    const nonceClaim = libsodium.randombytes_buf(libsodium.crypto_box_NONCEBYTES, "hex");
    console.log(nonceClaim);

    const encodeClaimDek = libsodium.crypto_secretbox_easy(JSON.stringify(claim), libsodium.from_hex(nonceClaim), libsodium.from_hex(dek), "hex");
    console.log("Claim", encodeClaimDek);
    console.log("Nonce", nonceClaim);


    // encode dek by publickey
    const dekEncodeByPub = libsodium.crypto_box_seal(dek, libsodium.from_hex(key_gen.publicKey), "hex");
    console.log("DEK encrypt", dekEncodeByPub);

    // decode dek
    const dekDecode = libsodium.crypto_box_seal_open(libsodium.from_hex(dekEncodeByPub), libsodium.from_hex(key_gen.publicKey), libsodium.from_hex(key_gen.privateKey), "text");

    // decode claim
    const decodeClaimDek = libsodium.crypto_secretbox_open_easy(libsodium.from_hex(encodeClaimDek), libsodium.from_hex(nonceClaim), libsodium.from_hex(dekDecode), "text");
    console.log(JSON.parse(decodeClaimDek));
}

async function testUploadDataEncrypt() {
    console.log("---------test upload data-----------");
    const claim = {
        rawData: {
            docId: 'id123451zyxtki',
            docType: 'National ID',
            name: 'Tuan',
            dob: 20000101,
            countryCode: 10,
            userId: '1234567'
        },
        claim: [
            'a0000000000000000000000000001e240',
            '1234567',
            'ee8524bf26710d75b8ef0bd9a1a94cc8b4986ebaca33d9027f637be414c3efd',
            '201c5bc91ad990d8e30b3eacc46582036c6daaa1588f42af8bd431876b7525be',
            '1843158eb650000000000000007',
            '0',
            '8818d2861edd17e1ec5cd9c0c58c283b125d5d13d1ba2983b70173a4eef6f5c',
            'a01312d65'
        ]
    };
    const holderId = "123";
    const issuerId = "123";
    const claimId = "123";

    await libsodium.ready;

    const nonce = libsodium.randombytes_buf(libsodium.crypto_box_NONCEBYTES, "hex");

    const encodeClaimDek = libsodium.crypto_secretbox_easy(JSON.stringify(claim), libsodium.from_hex(nonce), libsodium.from_hex(dek), "hex");


    const updateDataResponse = await axios({
        method: "post",
        baseURL: baseUrl,
        url: urlEncrypt,
        data: {
            "holderId": holderId,
            "issuerId": issuerId,
            "claimId": claimId,
            "data": encodeClaimDek,
            "nonce": nonce
        }
    });
    // console.log(updateDataResponse.data);

    const dekEncodeByPub = libsodium.crypto_box_seal(dek, libsodium.from_hex(key_gen.publicKey), "hex");
    const uploadPrivateResponse = await axios({
        method: "post",
        baseURL: baseUrl,
        url: urlPrivateEncrypt,
        data: {
            "holderId": holderId,
            "keyEncrypt": dekEncodeByPub
        }
    });
    console.log(uploadPrivateResponse.data);
}

async function testDecode() {

    console.log("---------test decode data-----------");
    const holderId = "123";
    const issuerId = "123";
    const claimId = "123";

    await libsodium.ready;

    const getReq = await axios({
        method: "get",
        baseURL: baseUrl,
        url: urlPrivateEncrypt,
        params: {
            holderId: holderId
        }
    });
    const dekEncrypt = await getReq.data.data.privateKeyEncrypt.keyEncrypt;

    // const claimReq = await axios({
    //     method: 'get',
    //     baseURL: baseUrl,
    //     url: urlEncrypt,
    //     params: {
    //         holderId: holderId,
    //         issuerId: issuerId,
    //         claimId: claimId
    //     }
    // });
    // console.log(claimReq);

    const x = await fetch(baseUrl + urlEncrypt + "?" + "holderId=" + holderId + "&issuerId=" + issuerId + "&claimId=" + claimId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        
    });
    const claimReq = JSON.parse(await x.text());

    const dataEncrypt = claimReq.data.dataEncrypt[0].data;
    const nonce = claimReq.data.dataEncrypt[0].nonce;

    // decode dek
    const dek = libsodium.crypto_box_seal_open(libsodium.from_hex(dekEncrypt), libsodium.from_hex(key_gen.publicKey), libsodium.from_hex(key_gen.privateKey), "text");
    console.log(dek);

    // decode claim
    const claim = libsodium.crypto_secretbox_open_easy(libsodium.from_hex(dataEncrypt), libsodium.from_hex(nonce), libsodium.from_hex(dek), "text");
    console.log(JSON.parse(claim));
}

async function main() {
    
    testUploadDataEncrypt();

    testDecode();
}

main();