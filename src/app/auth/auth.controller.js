// Always should be at TOP
const dotenv = require('dotenv')
dotenv.config();

const { z } = require("zod")
const mailSvc = require('../../services/mail.service');
const authSvc = require('./auth.services');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const AuthRequest = require('./auth.request');
const UserModel = require('../user/user.model');
const { generateRandomString } = require('../../config/helpers');

class AuthController {
    register = async (req, res, next) => {
        try {
            let payload = (new AuthRequest(req)).transformRequestData();

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
        try {
            let token = req.params.token

            //query
            let userDetail = await authSvc.getuserByFilter({
                token: token
            });


            if (userDetail) {
                res.json({
                    result: userDetail,
                    msg: "Token Verified",
                    meta: null
                })
            } else {
                next({ code: 400, message: "Token Does not Exists", result: { token } })
            }
        } catch (except) {
            next(except)
        }
    }

    async setPassword(req, res, next) {
        try {
            let data = req.body
            let token = req.params.token
            let userDetail = await authSvc.getuserByFilter({
                token: token
            })
            //TODO: DB Update         
            if (userDetail) {
                let encPass = bcrypt.hashSync(data.password, 10);

                const updateData = {
                    password: encPass,
                    token: null,
                    status: 'active'
                }

                let updateResponse = await authSvc.updateUser({ token: token }, updateData)

                res.json({
                    result: updateResponse,
                    message: "User Activated Succesfully",
                    meta: null
                })
            } else {
                next({ code: 400, message: "User Does not exists/token expired/broken", token: data })
            }

        } catch (except) {
            next(except)
        }
    }

    async login(req, res, next) {

        try {
            let credentials = req.body;

            let userDetail = await authSvc.getuserByFilter({
                email: credentials.email
            })
            if (userDetail) {
                if (userDetail.token === null && userDetail.status === 'active') {
                    // User Login
                    if (bcrypt.compareSync(credentials.password, userDetail.password)) {
                        let token = jwt.sign({
                            userId: userDetail._id
                        }, process.env.JWT_SECRET, {
                            expiresIn: "1h" // Default is 3hr
                        })

                        let refreshToken = jwt.sign({
                            userId: userDetail._id
                        }, process.env.JWT_SECRET, {
                            expiresIn: "1d"
                        })

                        // TODO: STORE DB LOGGEDIN TOKEN
                        let patData = {
                            userId: userDetail._id,
                            token: token,
                            refreshToken: refreshToken
                        }

                        await authSvc.storePAT(patData)

                        res.json({
                            result: {
                                token: token,
                                refreshToken: refreshToken,
                                type: "Bearer"
                            }
                        })
                    } else {
                        next({ code: 400, message: "Credential does not match." })
                    }
                } else {
                    next({ code: 401, message: "User not activated. Check your email for activation process" })
                }
            } else {
                next({ code: 400, message: "User does not exists" })
            }
        } catch (except) {
            next(except)
        }
    }
    getLoggedInUser(req, res, next) {
        res.json({
            result: req.authUser
        })
    }

    forgetPassword = async (req, res, next) => {
        try {
            let body = req.body;
            let userDetail = await authSvc.getuserByFilter({
                email: body.email
            })
           
            if(userDetail.status === 'active'){
                 // Token
            let token = generateRandomString(100)
            let expiry = Date.now() + 86400000
            let updateData = {
                resetToken: token,
                resetExpiry: expiry
            }
            // Update
            let status = await authSvc.updateUser({
                _id: userDetail._id
            }, updateData)

            // Email
            let message = await authSvc.forgetPasswordMessage(userDetail.name, token)
            await mailSvc.emailSend(userDetail.email, "Reset Password!", message)
            res.json({
                result: null,
                message: "Check your email for the further processing",
                meta: null
            })
            }else{
                next({code: 400, message: "User not activated"})
            }
        } catch (exception) {
            next(exception)
        }
    }

    logout = async (req, res, next) => {
        try {
            let token = getTokenFromHeader(req)
            let loggedout = await authSvc.deletePatData(token);
            res.json({
                result: null,
                message: "Logged out successfully",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }

    resetPassword = async (req, res, next) =>{
        let payload = req.body;
        // Token
        let userDetail = {resetExpiry: "2023-10-11 10:30:00 AM"}
        let date = new Date(userDetail.resetExpiry)
        let timestamp = date.getTime()
        let todaysTime = Date.now();

        try{
            let payload = req.body;
            let token = req.params.resetToken
            let userDetail = await authSvc.getuserByFilter({
                resetToken: token
            })
            if(!userDetail){
                throw{code:400, message: "Token not found"}
            }else{
                // User Exists:
                let todays = new Date()
                if(todays > userDetail.resetExpiry){
                    throw{code: 400, message: "Token Expired"}
                }else{
                    let updateData = {
                        password: bcrypt.hashSync(payload.password, 10),
                        resetExpiry: null,
                        resetToken: null
                    }
                    const updateRes = await authSvc.updateUser({
                        resetToken: token
                    }, updateData)
                    res.json({
                        result: null,
                        message: "Your password has been changed succesfully, Please login to continue",
                        meta: null
                    })
                }
            }
        }catch(exception){
            next(exception)
        }
    }


}


const authCtrl = new AuthController()

module.exports = authCtrl;