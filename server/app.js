import express from 'express';
import cors from 'cors';
import { connectDB } from './db/index.js';
import healthcheckRouter from './routes/healthcheck.routes.js';
const app = express();


connectDB();
app.use(cors(
   {
    origin:process.env.CORS_ORIGIN,
    credentials:true
   }
));

//common middleware
app.use(express.json({
    limit:"50mb"
}));

app.use(express.urlencoded({extended:true,limit:'50mb'}));

app.use(express.static('public'));
app.get('/',(req,res)=>{
    res.json({
        message:"hello"
    });
})
app.use('/api/v1/healthCheck',healthcheckRouter);
export  {app};