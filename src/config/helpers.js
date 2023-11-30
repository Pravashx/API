const fs = require('fs')

const generateRandomString = (len = 100)=>{
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ"
    let lengths = chars.length;
    let random = ""

    for(let i =0; i<= len; i++){
        let posn = Math.ceil(Math.random() * (lengths - 1))
        random += chars[posn]
    }
    return random
}

const getTokenFromHeader = (req) =>{
    let token = null;
    if (req.query['token']) {
        token = req.headers['token']
    }
    if (req.headers['x-xsrf-token']) {
        token = req.headers['x-xsrf-token']
    }
    if (req.headers['authorization']) {
        token = req.headers['authorization']
    }
    return token;
}

deleteFile = (path, filename) =>{
    if(filename && fs.existsSync(path + filename)){
        fs.unlinkSync(path + filename)
    }
}
module.exports = {generateRandomString, getTokenFromHeader, deleteFile}