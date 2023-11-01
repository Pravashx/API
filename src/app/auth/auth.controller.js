// Always should be at TOP
const dotenv = require('dotenv')
dotenv.config();

const { z } = require("zod")
const { generateRandomString } = require('../../config/helpers')
const nodemailer = require('nodemailer')
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


            // Mail, OTP
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

             /** Email compulsory ho vane write awai*/
                const mailAck = await transporter.sendMail({
                to: payload.email,
                from: "Test@gmail.com",
                subject: "Activate your account",
                html: `<b> Dear ${payload.name}<b/><br/>
                <p> Your account has been successfully registerd. Please copy or click the link below to activate your account</p>
                <a href = "http://localhost:5173/activate/${payload.token}">
                http://localhost:5173/activate/${payload.token}
                <a/><br/>

                <p>
                    <b> Regards </b>
                </p>
                <p>
                    <b> System Admin</b>
                </p>
                <p>
                   <em> <small>Please do not reply to this email </small> </em>
                </p>
                `,
                text: ""
            })
            console.log(mailAck)
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