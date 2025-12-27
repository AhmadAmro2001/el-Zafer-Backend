import { Router } from "express";
import * as userAppService from "./service/userApp.service.js"



const userAppController = Router();


userAppController.post('/api/sign-in',userAppService.signInUser)
userAppController.post('/api/sign-up',userAppService.signUpUser)
userAppController.post('/api/log-out',userAppService.logOutUser)
userAppController.get('/api/notify',userAppService.notifyUser)
userAppController.delete('/api/delete-account',userAppService.deleteUser)
userAppController.patch('/api/forgot-pass',userAppService.changePassword)
userAppController.patch('/api/reset-pass',userAppService.resetPassword)

export {userAppController}
