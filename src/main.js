import express from 'express';
import {config} from 'dotenv';
config();
import { database_connection } from './DB/connection.js';
import controllerHandler from './utils/router-handler.utils.js';
import cors from 'cors';

const corsOptions = {
    origin: ['https://el-zafer.vercel.app',process.env.CORS_ORIGIN,'http://localhost:5173'], 
    methods: ['GET', 'POST'],
    credentials: false,
}



const bootstrap = async ()=>{
    const app = express();
    app.use(express.json());
    app.use(cors(corsOptions))
    controllerHandler(app)
    database_connection();
   
    app.listen(process.env.PORT,()=>console.log(`Server is running on port ${process.env.PORT}`))
    // return app;
}


export default bootstrap