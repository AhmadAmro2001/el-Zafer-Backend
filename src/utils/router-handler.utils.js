import adminController from "../modules/admin/admin.controller.js"
import quotesShipmentController from "../modules/quotesShipment/quotesShipment.controller.js"
import quotesController from "../modules/quotes/quotes.controller.js"
import trackShipmentController from "../modules/trackShipment/trackShipment.controller.js"
import helmet from "helmet"
import {rateLimit} from "express-rate-limit"
import { userAppController } from "../modules/userApp/userApp.controller.js"




const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });
const controllerHandler = (app)=>{

    app.use(helmet())
    app.use(limiter)
    app.use('/admin',adminController)
    app.use('/user',userAppController)
    app.use('/quotes',quotesController)             
    app.use('/quotes/shipment',quotesShipmentController)
    app.use('/track-shipment',trackShipmentController)
    
    app.get('/',async (req, res) => res.status(200).json({ message: 'Welcome to El Zafer API' }))
    app.use((req, res) => {
        res.status(404).json({ message: 'Route not found.' });
      });
}

export default controllerHandler