import { Router } from "express";



const renderController = Router();

renderController.get('/smtp/verify', verifySmtp);
renderController.get('/net/smtp-test', testSmtp);



export default renderController;