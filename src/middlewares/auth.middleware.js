require('dotenv').config()
const jwt = require('jsonwebtoken');
const authSvc = require('../app/auth/auth.services');
const { getTokenFromHeader } = require('../config/helpers');

const CheckLogin = async (req, res, next) => {
    // token verify here
    try {
        let token = getTokenFromHeader(req)

        // Token => null, "Bearer token", token
        if (token === null) {
            next({ code: 401, message: "Login required" })
        } else {
            // Token => "Bearer Token", "Token"
            // "Bearer Token" => ["Bearer", "Token"]
            // "Token" => ["Token"]
            token = (token.split(" ")).pop()
            if (!token) {
                next({ code: 401, message: "Token required" })
            } else {
                let patData = await authSvc.getPatByToken(token)
                if (patData) {
                    // Token
                    let data = jwt.verify(token, process.env.JWT_SECRET)
                    // TODO: DB Verify Payload
                    let userDetail = await authSvc.getuserByFilter({
                        _id: data.userId
                    })
                    if (userDetail) {
                        req.authUser = userDetail
                        next()
                    } else {
                        next({ code: 401, message: "User does not exists anymore" })
                    }
                } else {
                    next({ code: 401, messgae: "Token already expired or invalid" })
                }
            }
        }
    } catch (except) {
        console.log(except)
        next({ code: 401, message: except.message })
    }
}

module.exports = CheckLogin;