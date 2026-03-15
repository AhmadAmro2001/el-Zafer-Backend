import { Router } from "express";
import * as analyticsService from "./service/analytics.services.js";


const analyticsController = Router();



analyticsController.post('/get-analytics',analyticsService.logVisitService);


export default analyticsController