import { Router } from "express";
import { PrivateKeyEncryptController } from "../controllers/PrivateKeyEncryptController.js";

export class PrivateKeyEncryptRoutes {
    public router: Router;
    public privateKeyEncryptController = new PrivateKeyEncryptController();
    constructor () {
        this.router = Router();
        this.routers();
    }

    routers(): void {
        this.router.post("", this.privateKeyEncryptController.updatePrivateKey);
        this.router.get("", this.privateKeyEncryptController.getPrivateKey);
    }
}