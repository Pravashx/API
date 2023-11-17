// Always should be at TOP
const dotenv = require('dotenv')
dotenv.config();

const { z } = require("zod")
const { generateRandomString } = require('../../config/helpers');
const mailSvc = require('../../services/mail.service');
const authSvc = require('./auth.services');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class AuthController {
    register = async (req, res, next) => {
        try {
            let payload = req.body;

            // FILE
            // let file = req.file
            // payload.image = file.filename;

            // FILES
            if (req.file) {
                payload.image = req.file.filename;
            } else if (req.files) {
                payload.image = req.files.map((item) => item.filename)
            }

            payload.status = "inactive";
            payload.token = generateRandomString();

       
            // let response = await dbSvc.db.collection('users').insertOne(payload)
            let response = await authSvc.registerUser(payload)
            
            
            

           let mailMsg = authSvc.registerEmailMessage(payload.name, payload.token)

             /** Email compulsory ho vane write await*/
                await mailSvc.emailSend(
               payload.email,
                "Activate your account",
                mailMsg
            )
            res.json({
                result: response,
                msg: 'User registered succesfully.',
                meta: null
            })
        }
        catch (except) {

            next(except)
        }
    }

    verifyToken = async (req, res, next) => { 
        try{
            let token = req.params.token

            //query
            let userDetail= await authSvc.getuserByFilter(token);



           if(userDetail){
            res.json({
                result: userDetail,
                msg: "Token Verified",
                meta: null
            })
           }else{
            next({code: 400, message: "Token Does not Exists", result: {token}})
           }
        }catch(except){
            next(except)
        }
    }

    async setPassword (req, res, next){
        try{
            let data = req.body
            let token = req.params.token
            let userDetail = await authSvc.getuserByFilter({
                token: token
            })
            //TODO: DB Update         
            if(userDetail){
                let encPass = bcrypt.hashSync(data.password, 10);

                const updateData = {
                    password: encPass,
                    token: null,
                    status: 'active'
                }

                let updateResponse = await authSvc.updateUser({token: token}, updateData)

                res.json({
                    result: updateResponse,
                    message: "User Activated Succesfully",
                    meta: null
                })
            }else{
                next({code: 400, message: "User Does not exists/token expired/broken", token: data})
            }
            
        }catch(except){
            next(except)
        }
     }

    async login (req, res, next){
        
        try{
            let credentials = req.body;
            let userDetail = {
                _id: "qw12314",
                name: "Pravash Thakuri",
            email: "pravashotaku@gmail.com",
            role: "admin",
            status: "active",
            token: null,
            password : "$2a$10$FAIYqZznn1qIQDwkKUzrfez25v44PUZ7zXHPEfSR9u6Gau8F5pLwS"
            }


            if(bcrypt.compareSync(credentials.password, userDetail.password)){
                let token = jwt.sign({
                    userId: userDetail._id
                },process.env.JWT_SECRET,{
                     expiresIn: "1h" // Default is 3hr
                })

                let refreshToken = jwt.sign({
                    userId: userDetail._id
                },process.env.JWT_SECRET,{
                     expiresIn: "1d" 
                })


                res.json({
                    result: {
                        token: token,
                        refreshToken: refreshToken,
                        type: "Bearer"
                    }
                })
            }else{
                next({code: 400, message: "Credential does not match."})
            }
        }catch(except){
            next(except)
        }
    }
    getLoggedInUser(req, res, next){
        res.json({
            result: req.authUser
        })
    }

    forgetPassword = (req, res, next) => {

    }

    logout = (req, res, next) => {

    }



}


const authCtrl = new AuthController()

module.exports = authCtrl;