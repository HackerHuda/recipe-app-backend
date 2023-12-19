import express from 'express';
import cors from 'cors';
import {config} from 'dotenv';
import userRoutes from './Routes/userRoutes.js'
import RecipeRoutes from './Routes/recipeRoutes.js'
config();


const app=express();

app.use(express.json());


app.use(cors())

app.use('/ping',function(req,res){
    res.send("pong")
})

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/recipe',RecipeRoutes);

app.all('*',(req,res)=>{
    res.send("page not found");
})
export default app;