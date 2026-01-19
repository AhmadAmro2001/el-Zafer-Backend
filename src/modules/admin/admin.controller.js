import { Router } from "express";
import * as adminService from "./services/admin.service.js";
import { authenticationMiddleware, errorHandler, MulterHost } from "../../middleware/index.js";

const adminController = Router();

adminController.post('/add-admin',errorHandler(adminService.addAdmin));
adminController.post('/login-admin',errorHandler(adminService.loginAdmin));
adminController.post('/logout-admin',errorHandler(adminService.logOutService));
adminController.post('/add-email-contact', errorHandler(adminService.addEmail));
adminController.post('/remove-email-contact', errorHandler(adminService.deleteEmails));
adminController.get('/get-emails',errorHandler(adminService.getEmails))
adminController.post(
    '/add-news',
    MulterHost(['image/jpg', 'image/png', 'image/jpeg']).array('images', 10),
    errorHandler(adminService.addNewsPost)
);
adminController.get('/get-news',errorHandler(adminService.listPosts))
adminController.post('/delete-news',errorHandler(adminService.deletePost));




export default adminController