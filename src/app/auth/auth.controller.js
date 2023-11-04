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


            /** Name And Email Validation  (GOOD PACKAGE = zod, joi YUP, ajv, class-validator)
            if (!payload.name || payload.name === null || payload.name === "null") {
                next({ code: 400, messge: "Validation Failure", result: { name: "Name is required" } })
            }
            if (!payload.email || payload.email === null || payload.email === "null") {
                next({ code: 400, messge: "Validation Failure", result: { email: "Email is required" } })
            } else if (!payload.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
                next({ code: 400, messge: "Validation Failure", result: { email: "Invalid Email"}})
             }   */

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

            // TODO: DB Store


           let mailMsg = authSvc.registerEmailMessage(payload.name, payload.token)

             /** Email compulsory ho vane write await*/
                const mailAck = await mailSvc.emailSend(
               payload.email,
                "Activate your account",
                mailMsg
            )
            res.json({
                result: payload
            })
        }
        catch (except) {

            next(except)
        }
    }

    verifyToken = (req, res, next) => { 
        try{
            let token = req.params.token
            if(token){
                res.json({
                    result: {},
                    msg: "Valid Token",
                    meta: null
                })
            }else{
                next({code: 400, message: "Invalid or expired token"})
            }
        }catch(except){
            next(except)
        }
    }

    async setPassword (req, res, next){
        try{
            let data = req.body
            let token = req.params.token
            //TODO: DB Update
            let encPass = bcrypt.hashSync(data.password, 10)

            res.json({
                result: encPass
            })
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