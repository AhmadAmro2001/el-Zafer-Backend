import { Router } from "express";
import * as userAppService from "./service/userApp.service.js"



const userAppController = Router();


userAppController.post('/api/sign-in',userAppService.signInUser)
userAppController.post('/api/sign-up',userAppService.signUpUser)
userAppController.post('/api/log-out',userAppService.logOutUser)
userAppController.get('/api/notify',userAppService.notifyUser)


export {userAppController}
