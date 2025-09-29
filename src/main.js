import express from 'express';
import {config} from 'dotenv';
config();
import { database_connection } from './DB/connection.js';
import controllerHandler from './utils/router-handler.utils.js';
import cors from 'cors';




const allowedOrigins = [
  'https://el-zafer.vercel.app',
  'http://localhost:5173',
  process.env.CORS_ORIGIN, // ok if undefined
];

// optional: allow vercel preview subdomains too
const vercelPreview = /^https:\/\/el-zafer(-[\w-]+)?\.vercel\.app$/;

const corsOptions = {
  origin(origin, cb) {
    // allow non-browser tools (no Origin header)
    if (!origin) return cb(null, true);
    const ok =
      allowedOrigins.filter(Boolean).includes(origin) ||
      vercelPreview.test(origin);
    return ok ? cb(null, true) : cb(new Error(`CORS not allowed: ${origin}`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // <-- fix
  credentials: false,
  optionsSuccessStatus: 204,
};

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