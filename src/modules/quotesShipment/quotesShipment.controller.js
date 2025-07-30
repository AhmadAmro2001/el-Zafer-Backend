import { Router } from "express";
import * as quotesShipmentService from "./services/quotesShipment.services.js";
import { errorHandler , authenticationMiddleware } from "../../middleware/index.js";


const quotesShipmentController = Router();

quotesShipmentController.post('/add-quote-for-import',errorHandler(quotesShipmentService.addQuoteForImport));
quotesShipmentController.post('/add-quote-for-export',errorHandler(quotesShipmentService.addQuoteForExport));
quotesShipmentController.post('/add-quote-for-clearness',errorHandler(quotesShipmentService.addQuoteForClearness));
quotesShipmentController.get('/list-import',authenticationMiddleware(),errorHandler(quotesShipmentService.listImportQuotes));
quotesShipmentController.get('/list-export',authenticationMiddleware(),errorHandler(quotesShipmentService.listExportQuotes));
quotesShipmentController.get('/list-clearance',authenticationMiddleware(),errorHandler(quotesShipmentService.listClearnessQuotes));


export default quotesShipmentController