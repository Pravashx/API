const {z} = require("zod")
class AuthController {
    register = (req, res, next) => {

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
            res.json({
                result: payload
            })
        }
        catch (except) {
        
            next(except)
        }
    }

    verifyToken = (req, res, next) => { }
    setPassword = (req, res, next) => { }

    login = (req, res, next) => {

    }

    forgetPassword = (req, res, next) => {

    }

    logout = (req, res, next) => {

    }



}


const authCtrl = new AuthController()

module.exports = authCtrl;