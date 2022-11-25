import { Router } from "express";
import { DataEncryptController } from "../controllers/DataEncyptController.js";

export class DataEncryptRoutes {
    public router: Router;
    public dataEncryptController = new DataEncryptController();
    constructor () {
        this.router = Router();
        this.routers();
    }

    routers(): void {
        this.router.post("", this.dataEncryptController.updateData);
        this.router.get("", this.dataEncryptController.getAllClaimBy);
    }
}