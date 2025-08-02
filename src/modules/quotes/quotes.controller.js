import { Router } from "express";
import * as quotesService from "./services/quotes.services.js";
import { errorHandler , authenticationMiddleware } from "../../middleware/index.js";



const quotesController = Router();

quotesController.post('/send-quote',errorHandler(quotesService.getQuote));
quotesController.get('/list-quotes',errorHandler(quotesService.listQuotes));

export default quotesController