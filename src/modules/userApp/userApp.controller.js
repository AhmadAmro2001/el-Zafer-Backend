import { Router } from "express";
import * as userAppService from "./service/userApp.service.js"
import { authenticationMiddleware } from "../../middleware/authentication.middlerware.js";
import { errorHandler } from "../../middleware/error-handling.middleware.js";



const userAppController = Router();


userAppController.post('/api/sign-in',errorHandler(userAppService.signInUser))
userAppController.post('/api/sign-up',errorHandler(userAppService.signUpUser))
userAppController.post('/api/log-out',errorHandler(userAppService.logOutUser))
userAppController.get('/api/notify',errorHandler(userAppService.notifyUser))
userAppController.delete('/api/delete-account',errorHandler(userAppService.deleteUser))
userAppController.patch('/api/forgot-pass',errorHandler(userAppService.changePassword))
userAppController.patch('/api/reset-pass',errorHandler(userAppService.resetPassword))
userAppController.patch('/api/change-number',authenticationMiddleware(),errorHandler(userAppService.changePhone));
userAppController.put('/api/hit',errorHandler(userAppService.hitMobile));
userAppController.get('/api/get',errorHandler(userAppService.getMobile));

export {userAppController}
