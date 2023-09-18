const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');

const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')

const Signup=require('../schema/signup');

router.post('/signup',(req,res,next)=>{
    //  console.log("call post");
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err)
        {
            return res.status(500).json({
                error:err
            })
        }
        else{
            const userSignup =new Signup({
                _id:new mongoose.Types.ObjectId,
                username:req.body.username,
                email:req.body.email,
                phone:req.body.phone,
                gender:req.body.gender,
                password:hash,
                userType:req.body.userType
            })
            
            userSignup.save()
            .then(result=>{
                
                res.status(200).json({
                    newuser:result,
                    message:"data save"
                    
                })
            })
            .catch(err=>{
                res.status(500).json({  
                    error:err
                })
            })
        }
    })
   
})

//login rout 
router.post('/login',(req,res,next)=>{
    // console.log(req.body.email)
    Signup.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1)
        {
            return res.status(401).json({
                message:'user not register'
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(!result)
            {
               
                return res.status(401).json({
                    message:'wrong crediential'
                })
            }
            if(result)
            {
                const token=jwt.sign({
                    username:user[0].username,
                    userType:user[0].userType
                }, 'this is dummy text',{
                    expiresIn:"24h"
                });
                res.status(200).json({
                    username:user[0].username,
                    userType:user[0].userType,
                    email:user[0].email,
                    phone:user[0].phone,
                    gender:user[0].gender,
                    token:token
                })
            }
        })
    })
    .catch(err=>{
        res.send(500).json({
            err:err
        })
    })
})
module.exports=router