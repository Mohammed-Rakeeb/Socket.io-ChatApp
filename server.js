const express = require('express');

const app = express();

const PORT = 3000;

const path = require('path');

const http = require('http');

const server = http.createServer(app);



const socket = require('socket.io');
const io = socket(server);

const {
    renderMsg,
    chatHistory,
    gethistory
} = require('./utils/msgObj');

const { userList, getCurUser, CheckdefaultUser, changeUserMeta, setDefaultUser, userLeft, getSessionUser } = require('./utils/users')


app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', socket => {

    socket.on('check', data => {
        let sessionuserList = getSessionUser();
        let duplicate;
        if (!sessionuserList.find(user => user.username == data.name) && !sessionuserList.find(user => user.color == data.color)) {
            console.log("you are unique is " + data);
            duplicate = false;
            socket.emit('valid', duplicate);
        } else {
            duplicate = true;
            console.log("already there " + data);
            console.log("sending...." + duplicate);
            socket.emit('valid', duplicate);

        }

    })



    socket.on('user_color', ({ username, ucolor }) => {


        console.log("so the name is " + username);
        let user;
        if (username === "") {
            //console.log("no username" + username);
            user = userList(socket.id, setDefaultUser(), ucolor);
        } else {
            //console.log("yes name" + username);
            user = userList(socket.id, username, ucolor);
        }

        console.log(getCurUser(socket.id));
        socket.emit('whoU',
            getCurUser(socket.id)
        );
        socket.broadcast.emit('join-leave-update', renderMsg(user.username, user.color, `${user.username} joined the chat`));

        io.emit('SessionUsers', {
            user: getSessionUser()
        });

        if (gethistory().length != 0) {
            socket.emit('history', {
                chat: gethistory()
            });
        }



    });



    socket.on('message', function(msg) {
        let user = getCurUser(socket.id);
        chatHistory(user.username, user.color, msg);
        // console.log("length now is " + JSON.stringify(gethistory(), null, 2));
        socket.broadcast.emit('message', renderMsg(user.username, user.color, msg));

    });


    socket.on('changeNameColor', (changeMeta) => {
        // console.log("server says" + changeUserMeta(changeMeta.type, socket.id, changeMeta.meta));
        let user = getCurUser(socket.id);
        let text = changeUserMeta(changeMeta.type, socket.id, changeMeta.meta);
        let color;
        if (changeMeta.type == 'changeColor' && text.flag == true) {
            color = changeMeta.meta;
        } else {
            color = user.color

        }
        if (text.flag == true) {
            socket.broadcast.emit('sessionUserUpdate', {
                text: renderMsg(user.username, color, text.str),
                users: getSessionUser(),
            })
        }

        socket.emit('changeMetaStatus', {
            text: renderMsg(user.username, color, text.str),
            users: getSessionUser(),
            userColor: color,
            curUser: getCurUser(socket.id)

        })


    });


    socket.on('disconnect', () => {
        let user = userLeft(socket.id);
        if (user) {

            CheckdefaultUser(user);
            io.emit('join-leave-update', renderMsg(user.username, user.color, `${user.username} left the chat`));

            io.emit('SessionUsers', {
                user: getSessionUser()
            });

        }

    });

});

server.listen(PORT, () => console.log(`running on ${PORT}`));