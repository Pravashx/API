const express = require('express')
const app = express();
require('./db.config')
const router = require('../router/index');
const { MulterError } = require('multer');
const {ZodError} = require('zod')
const {MongooseError} =require('mongoose')

// Body Parser
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))


app.use('/health', (req, res, next)=>{
    res.send("Success Ok")
})

app.use('/api/v1', router)


// 404 Error Handle 
app.use((req, res, next)=>{
    res.status(404).json({
        result: null,
        message: "Not Found",
        meta: null
    })
})

// Exception Handling Middleware
app.use((error, req, res, next)=>{
    console.log("GarbageCollector: ", error)
    let code = error.code ?? 500;
    let message = error.message ?? "Internal Server Error..."
    let result = error.result ?? null

    // TODO: Handle different type of exception

    if(error instanceof MulterError){
        //Handle Multer Errors
        if(error.code == 'LIMIT_FILE_SIZE'){
            code = 400;
            message = error.message
        }
    }

    // TODO: Form Validation Formatting (ZOD)
    if(error instanceof ZodError){
        code = 400;
        let zodErrors = error.errors;
        let msg = {}
        zodErrors.map((err)=>{
            // msg.push({
            //     [err.path[0]]: err.message       (FOR msg = ARRAY)
            // })
            msg[err.path[0]]= err.message
        })
        message = "Validation Failure"
        result = msg
    }
    if(error.code === 11000){
        code = 400;
        let uniqueKeys = Object.keys(error.keyPattern)
        let msgBody = uniqueKeys.map((key) => {
            return {
                [key]: key+" should be unique"
            }
        }) 
        result = msgBody;
        message ="Validation Fail"
    }

    res.status(code).json({
        result: result,
        message: message,
        meta: null
    })
})

module.exports = app;