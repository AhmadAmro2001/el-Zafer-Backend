import { Router } from "express";
import * as adminService from "./services/admin.service.js";
import { authenticationMiddleware, errorHandler } from "../../middleware/index.js";

const adminController = Router();

adminController.post('/add-admin',errorHandler(adminService.addAdmin));
adminController.post('/login-admin',errorHandler(adminService.loginAdmin));
adminController.post('/logout-admin',errorHandler(adminService.logOutService));
adminController.post('/add-email-contact',authenticationMiddleware(), errorHandler(adminService.addEmail));
adminController.post('/remove-email-contact',authenticationMiddleware(), errorHandler(adminService.deleteEmails));
adminController.get('/get-emails',errorHandler(adminService.getEmails))



export default adminController