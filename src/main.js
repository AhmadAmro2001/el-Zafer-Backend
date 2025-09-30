import express from 'express';
import {config} from 'dotenv';
config();
import { database_connection } from './DB/connection.js';
import controllerHandler from './utils/router-handler.utils.js';
import cors from 'cors';




const corsOptions = { 
  origin: [
    'https://el-zafer.vercel.app',
    process.env.CORS_ORIGIN,
    'http://localhost:5173'],
  methods: ['GET', 'POST','OPTIONS'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, }

 // ensure preflight responds



const bootstrap = async ()=>{
    const app = express();
    app.use(express.json());
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));
    controllerHandler(app)
    database_connection();
     // force IPv4 first

   
    app.listen(process.env.PORT,()=>console.log(`Server is running on port ${process.env.PORT}`))
    // return app;
}


export default bootstrap