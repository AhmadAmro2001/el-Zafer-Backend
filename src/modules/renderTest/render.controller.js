import { Router } from "express";
import { testSmtp, verifySmtp } from "./services/render.services.js";



const renderController = Router();

renderController.get('/smtp/verify', verifySmtp);
renderController.get('/net/smtp-test/:host/:port', testSmtp);



export default renderController;