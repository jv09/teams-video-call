const express = require("express");
const app = express();
const authRoutes = require('./routes/auth-routes');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const{ v4: uuidV4 } = require("uuid");
const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-access-token')
const User = require("./models/user");
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const Chat = require('./models/chat');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [keys.session.cookieKey]
}))
app.use(require("cors")());



//initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded());
app.use('/', authRoutes);

mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
.then((result)=> {
    console.log('connected');
    server.listen(process.env.PORT || 3000, () => {
        console.log('listening to port 3000');
    });
})
.catch((err) => {
    console.log(err);
})

io.on('connection', (socket) => {
    socket.on('join-chat-room', (roomId, channelName, username) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', username);
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', username);
        })
        socket.on('message', (message, username) => {
            new Chat({
                message: message,
                username: username,
                roomId: roomId 
            }).save().then(newChat => {
                console.log("Chat message " + newChat.message + " saved");
            })
             io.to(roomId).emit('createMessage', message, username);
        })
    })

    socket.on('join-room-home', (roomId, username) => {
        socket.join(roomId);
        console.log(username);
        socket.on('message', (message, username) => {
            new Chat({
                message: message,
                username: username,
                roomId: roomId 
            }).save().then(newChat => {
                console.log("Chat message " + newChat.message + " saved");
            })
             io.to(roomId).emit('createMessage', message, username);
        })
    })
})
