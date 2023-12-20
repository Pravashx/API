const http = require('http')
const app = require('./src/config/express.config')
const {Server} = require('socket.io')

const server = http.createServer(app);

const io = new Server(server)
io.emit("event", {})
io.on("connection", (socket)=>{
    io.on('event', (s)=>{
        
    })
})

server.listen(process.env.PORT || 80, (err)=>{
    if(!err){
        console.log("Server Is Running Sir ^_^");
    }
})
