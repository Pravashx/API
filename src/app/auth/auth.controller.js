// Always should be at TOP
const dotenv = require('dotenv')
dotenv.config();

const { z } = require("zod")
const { generateRandomString } = require('../../config/helpers');
const mailSvc = require('../../services/mail.service');
const authSvc = require('./auth.services');

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
            res.json({
                result: data
            })
        }catch(except){
            next(except)
        }
     }

    login = (req, res, next) => {

    }

    forgetPassword = (req, res, next) => {

    }

    logout = (req, res, next) => {

    }



}


const authCtrl = new AuthController()

module.exports = authCtrl;