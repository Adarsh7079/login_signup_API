const express=require('express');
const app=express();
const mongoose=require('mongoose');
const { connected } = require('process');
const bodyParser=require('body-parser');
const signuprout=require('./api/rout/signup')

mongoose.connect('mongodb+srv://adarshk8271:Adarsh123@cluster0.96enh9y.mongodb.net/?retryWrites=true&w=majority');

mongoose.connection.on('error',err=>{
    console.log("connection fail");
});

mongoose.connection.on('connected',connected=>{
    console.log(`connected with database.....`);
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//calling our rout 
app.use('/user',signuprout);

app.use((req,res,next)=>{
    res.status(400).json({
        error:'bad request'
    })
})
module.exports=app