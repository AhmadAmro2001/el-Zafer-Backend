import { Router } from "express";
import { testSmtp, verifySmtp } from "./services/render.services.js";



const renderController = Router();

renderController.get('/smtp/verify', verifySmtp);
renderController.get('/net/smtp-test', testSmtp);



export default renderController;