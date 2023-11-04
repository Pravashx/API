require('dotenv').config()
const jwt = require('jsonwebtoken')
const CheckLogin = (req, res, next)=>{
    // token verify here
    try{
        let token = null;
        if(req.query['token']){
            token = req.headers['token']
        }
        if(req.headers['x-xsrf-token']){
            token = req.headers['x-xsrf-token']
        }
        if(req.headers['authorization']){
            token = req.headers['authorization']
        }

        // Token => null, "Bearer token", token
        if(token=== null){
            next({code: 401, message: "Login required"})
        }else{
            // Token => "Bearer Token", "Token"
            // "Bearer Token" => ["Bearer", "Token"]
            // "Token" => ["Token"]
            token = (token.split(" ")).pop()
            if(!token){
                next({code: 401, message: "Token required"})
            }else{
                // let data = jwt.decode(token)
                let data = jwt.verify(token, process.env.JWT_SECRET )

                // TODO: DB Verify Payload
                let userDetail = {
                    _id: "qw12314",
                    name: "Pravash Thakuri",
                email: "pravashotaku@gmail.com",
                role: "admin",
                status: "active",
                token: null,
                }
                if(userDetail){
                    req.authUser = userDetail
                    next()
                }else{
                    next({code: 401, message: "User does not exists anymore"})
                }
            }
        }
    }catch(except){
        console.log(except)
        next({code: 400, message: except.message})
    }
}

module.exports = CheckLogin;