import { Router } from "express";
import * as trackingServices from "./services/trackShipment.services.js";
import { errorHandler } from "../../middleware/index.js";


const trackShipmentController = Router();

trackShipmentController.get('/track-full-container',errorHandler(trackingServices.trackingFullContainerService));
trackShipmentController.get('/track-lcl-container',errorHandler(trackingServices.trackingLCLByContainerService));
trackShipmentController.get('/track-lcl-housebillno',errorHandler(trackingServices.trackingLCLByHouseBillNoService));
trackShipmentController.get('/track-personal-effect',errorHandler(trackingServices.trackingPersonalEffectService));
trackShipmentController.get('/track-clearance-billno',errorHandler(trackingServices.trackingClearanceByBillNoService));
trackShipmentController.get('/track-clearance-containerno',errorHandler(trackingServices.trackingClearanceByContainerNoService));
trackShipmentController.get('/track-air-flight',errorHandler(trackingServices.trackingAirFlightService));
trackShipmentController.get('/test',errorHandler(trackingServices.testService));


export default trackShipmentController

