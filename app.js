const express=require('express')
const socket=require('socket.io')
const app=express()
const port=8000
app.use(express.static("public"))
const server=app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
const io=socket(server)
io.on('connection',(socket)=>{
    console.log('socked connected successfully.')
    socket.on("beginPath",(data)=>{
        io.sockets.emit("beginPath",data)
    })
    socket.on('drawStroke',(data)=>{
        io.sockets.emit("drawStroke",data)

    })
   socket.on('undoRedo',(data)=>{
    io.sockets.emit("undoRedo",data)
   })
})