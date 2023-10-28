const http = require('http')
const app = require('./src/config/express.config')
const server = http.createServer(app);

server.listen('3005', 'localhost', (err)=>{
    if(!err){
        console.log("Server Is Running Sir ^_^");
    }
})