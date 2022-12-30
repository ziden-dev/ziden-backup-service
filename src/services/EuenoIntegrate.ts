import { WALLET_ADDRESS, PRIVATE_KEY, BUCKET_ID } from "../common/config/secrets.js";
import sigUtil, { SignTypedDataVersion, TypedMessage } from "@metamask/eth-sig-util";
import axios from "axios";
import fs from "fs-extra";
import request from "request-promise";

export async function getAuthenToken() {
    const privateKey = PRIVATE_KEY;

    let timeNow = parseInt((Date.now() / 1000).toString());

    const DOMAIN = [
        {name: "url", type: "string"},
        {name: "time", type: "uint256"},
    ];

    const DATA = [
        {name: "action", type: "string"},
        {name: "account", type: "address"},
    ];

    const msgParams = {
        types: {
            EIP712Domain: DOMAIN,
            Data: DATA,
        },
        primaryType: "Data",
        domain: {
            url: "eueno.io",
            time: timeNow,
        },
        message: {
            action: "Eueno login",
            account: WALLET_ADDRESS,
        }
    } as TypedMessage<{
        EIP712Domain: typeof DOMAIN,
        Data: typeof DATA,
    }>;

    let sign = sigUtil.signTypedData(
        {   
            privateKey: Buffer.from(privateKey, "hex"), 
            data: msgParams, 
            version: SignTypedDataVersion.V4
        });

    const res = await axios.post(`https://developers.eueno.io/api/v1/users/login`, {
        timestamp: timeNow,
        address: WALLET_ADDRESS,
        signature: sign,
    });
    
    const token = res.data.data.token ?? "";
    
    return token;
}

export async function createNewFolder(name: string, parentId: string) {

    const token = await getAuthenToken();
    const url = 'https://developers.eueno.io/api/v3/project-folder/create-folder';
    const data = {
        "folder_name": name,
        "folder_parent_id": parentId,
        "project_id": BUCKET_ID
    };

    await axios({
        method: "post",
        url: url,
        data: data,
        headers: {
            "Authorization": "Bearer " + token
        }
    });
}

export async function deleteFile(projectId: string, fileId: string, token: string) {
    const url = 'https://developers.eueno.io/api/v3/project-file/delete';
    const data = {
        "project_id": projectId,
        "file_id": fileId
    };

    const response = await axios({
        method: "post",
        url: url,
        data: data,
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    
}

export async function deleteFolder(projectId: string, folderId: string, token: string) {
    const url = 'https://developers.eueno.io/api/v3/project-folder/delete';
    const data = {
        "project_id": projectId,
        "folder_id": folderId
    };

    const response = await axios({
        method: "post",
        url: url,
        data: data,
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    
}

export async function getProjectId(projectName: string, token: string) {
    try {
        
        const url = 'https://developers.eueno.io/api/v1/project/lists';
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        let projectId = "";
        
        response.data.items.forEach((item: any) => {
            if (item.project_name == projectName) {
                projectId = item._id;
            }
        });

        return projectId;
    } catch (err: any) {
        
        return "";
    }
}

export async function getFolderId(projectId: string, parentId: string, folderName: string, token: string) {
    const url = 'https://developers.eueno.io/api/v2/project-file/file/lists';
    const data: any = {};
    data["project_id"] = projectId;
    if (parentId != "") {
        data["folder_parent_id"] = parentId;
    }
    const response = await axios({
        method: "post",
        url: url,
        data: data,
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (folderName == "") {
        return response.data.data.root_folder._id?? "";
    }
    else {
        let id = "";
        response.data.data.items.forEach((item: any) => {
            if (item.file_name == folderName && item.kind == "FOLDER") {
                id = item._id;
            }
        });
        
        return id;
    }
}

export async function getUrlFile(projectId: string, parentId: string, fileName: string, token: string) {
    const url = 'https://developers.eueno.io/api/v2/project-file/file/lists';
    const data: any = {};
    data["project_id"] = projectId;
    if (parentId != "") {
        data["folder_parent_id"] = parentId;
    }
    const response = await axios({
        method: "post",
        url: url,
        // getProjectId("ZIDEN_BACKUP");
        data: data,
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    let fileUrl = "";
    response.data.data.items.forEach((item: any) => {
        if (item.file_name == fileName && item.kind == "FILE") {
            fileUrl = item.url;
        }
    });
    
    return fileUrl;
}


export async function getFileId(projectId: string, parentId: string, fileName: string, token: string) {
    const url = 'https://developers.eueno.io/api/v2/project-file/file/lists';
    const data: any = {};
    data["project_id"] = projectId;
    if (parentId != "") {
        data["folder_parent_id"] = parentId;
    }
    const response = await axios({
        method: "post",
        url: url,
        // getProjectId("ZIDEN_BACKUP");
        data: data,
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    let fileId = "";
    response.data.data.items.forEach((item: any) => {
        if (item.file_name == fileName && item.kind == "FILE") {
            fileId = item._id;
        }
    });
    
    return fileId;
}

export async function getFileFromUrl(url: string) {
    const response = await axios({
        method: "get",
        url: url
    });
    
}

export async function uploadClaimDataToEueno(data: any, id: string) {
    const token = await getAuthenToken();

    const projectId = await getProjectId("ZIDEN_BACKUP", token);
    
    const rootFolder = await getFolderId(projectId, "", "", token);

    const claimFolder = await getFolderId(projectId, rootFolder, "CLAIM", token);

    // delete old file
    const fileId = await getFileId(projectId, claimFolder, id + ".json", token);

    if (fileId != "") {
        await deleteFile(projectId, fileId, token);
    }
    // auth-upload

    let url = "https://developers.eueno.io/api/v3/project-file/auth-upload";
    let body = {
        "action": "write",
        "content_length": 0,
        "content_type": "application/json",
        "file_name": id + ".json",
        "method": "UN_ENCRYPT",
        "project_id": projectId,
        "path": "/CLAIM/"
    }

    let response = await axios({
        method: "post",
        url: url,
        data: body,
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const urlUploadFile = response.data.data.url_upload_file;
    const urlUploadTorrent = response.data.data.url_upload_torrent;

    await uploadData(urlUploadFile, data);
    await uploadData(urlUploadTorrent, data);

    const storeDataUrl = response.data.data.webseed[0];

    return storeDataUrl;
}


export async function uploadPrivateKeyEncryptToEueno(data: any, id: string) {
    const token = await getAuthenToken();

    const projectId = await getProjectId("ZIDEN_BACKUP", token);
    
    const rootFolder = await getFolderId(projectId, "", "", token);

    const claimFolder = await getFolderId(projectId, rootFolder, "KEY", token);

    // delete old file
    const fileId = await getFileId(projectId, claimFolder, id + ".json", token);
    if (fileId != "") {
        await deleteFile(projectId, fileId, token);
    }

    // auth-upload
    let url = "https://developers.eueno.io/api/v3/project-file/auth-upload";
    let body = {
        "action": "write",
        "content_length": 0,
        "content_type": "application/json",
        "file_name": id + ".json",
        "method": "UN_ENCRYPT",
        "project_id": projectId,
        "path": "/KEY/"
    }

    let response = await axios({
        method: "post",
        url: url,
        data: body,
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const urlUploadFile = response.data.data.url_upload_file;
    const urlUploadTorrent = response.data.data.url_upload_torrent;

    await uploadData(urlUploadFile, data);
    await uploadData(urlUploadTorrent, data);

    const storeDataUrl = response.data.data.webseed[0];

    return storeDataUrl;
}


export async function uploadData(url: string, data: any) {
    const x = await axios({
        method: "PUT",
        url: url,
        data: data
    });   
}

export function serializaData(data: Object): string {
    return JSON.stringify(data, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value
    );
}

export async function getDataFromUrl(url: string) {
    const response = await axios({
        method: "get",
        url: url
    });
    return response.data;
}