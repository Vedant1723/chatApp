var app= require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',(req,res)=>{
    res.sendfile('index.html');
});

users=[];
io.on('connection',(socket)=>{
    console.log('user connected');
    socket.on('setUsername',(data)=>{
        console.log(data);
        
        if(users.indexOf(data)>-1){
            socket.emit('userExists',data+' username not available!');
        }
        else{
            users.push(data);
            socket.emit('userSet',{username:data});
        }
    });

    socket.on('msg',(data)=>{
        //msg to everyone
        io.sockets.emit('newmsg',data);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
      })
    
});

http.listen(3000,()=>{
    console.log('listening on :3000');
});