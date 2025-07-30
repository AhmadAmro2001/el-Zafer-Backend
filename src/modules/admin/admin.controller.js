import { Router } from "express";
import * as adminService from "./services/admin.service.js";
import { errorHandler } from "../../middleware/index.js";

const adminController = Router();

adminController.post('/add-admin',errorHandler(adminService.addAdmin));
adminController.post('/login-admin',errorHandler(adminService.loginAdmin));
adminController.post('/logout-admin',errorHandler(adminService.logOutService));



export default adminController