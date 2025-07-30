import { Router } from "express";
import * as quotesShipmentService from "./services/quotesShipment.services.js";
import { errorHandler } from "../../middleware/index.js";


const quotesShipmentController = Router();

quotesShipmentController.post('/add-quote-for-import',errorHandler(quotesShipmentService.addQuoteForImport));
quotesShipmentController.post('/add-quote-for-export',errorHandler(quotesShipmentService.addQuoteForExport));
quotesShipmentController.post('/add-quote-for-clearness',errorHandler(quotesShipmentService.addQuoteForClearness));


export default quotesShipmentController