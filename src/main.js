import express from 'express';
import {config} from 'dotenv';
config();
import { database_connection } from './DB/connection.js';
import controllerHandler from './utils/router-handler.utils.js';
import cors from 'cors';

const corsOptions = {
    origin: [process.env.FRONTEND_ORIGIN,process.env.CORS_ORIGIN], 
    methods: ['GET', 'POST'],
    credentials: true,
}



const bootstrap = async ()=>{
    const app = express();
    app.use(express.json());
    app.use(cors(corsOptions))
    controllerHandler(app)
    database_connection();
   

    return app;
}


export default bootstrap