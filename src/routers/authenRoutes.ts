import { Router } from "express";
import { AuthenController } from "../controllers/AuthenController.js";

export class AthenRoutes {
    public router: Router;
    public authenController = new AuthenController();
    constructor () {
        this.router = Router();
        this.routers();
    }

    routers(): void {
        this.router.post("/register", this.authenController.registerUser);
        this.router.post("/login", this.authenController.authenticateUser, this.authenController.login);
        this.router.get("/login", this.authenController.authenticateJWT, this.authenController.loginsucess);
    }
}