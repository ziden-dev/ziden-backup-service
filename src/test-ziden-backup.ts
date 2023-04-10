import axios from "axios";
import libsodium, { crypto_box_NONCEBYTES, crypto_secretbox_NONCEBYTES } from "libsodium-wrappers";
import fetch from "node-fetch";

async function main() {

    await libsodium.ready;
    // console.log(libsodium.crypto_hash("ok", "hex").length);

    let privateKey = "123";

    while(privateKey.length < 64) {
        privateKey = "0" + privateKey;
    }

    const publicKey = libsodium.crypto_scalarmult_base(libsodium.from_hex(privateKey), "hex");
    console.log(publicKey);

    const data = {
        a: 1,
        b: 2,
        c: 3
    };

    const dataEncode = libsodium.crypto_box_seal(JSON.stringify(data), libsodium.from_hex(publicKey), "hex");

    console.log(dataEncode);

    const dataDecode = JSON.parse(libsodium.crypto_box_seal_open(libsodium.from_hex(dataEncode), libsodium.from_hex(publicKey), libsodium.from_hex(privateKey), "text"));
    
    console.log(dataDecode);
}

main();