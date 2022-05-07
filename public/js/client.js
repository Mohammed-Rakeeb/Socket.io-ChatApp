const chatApp = document.querySelector(".chatApp-container");

console.log(chatApp);
//get username and color 
const { username, ucolor } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

const joinApp = document.querySelector(".join-container");


let URL = window.location.href;

if (URL.includes("http://localhost:3000/") && !(URL.includes("http://localhost:3000/chatFront.html"))) {

    function myfunc() {
        var un = document.forms["myForm"]["username"].value;
        // if (un == "abc") {


        // }
        // document.getElementsByName("submit")[0].type = "submit";
        // window.location.href = "chatFront.html";

        const error = joinApp.querySelector('.error')

        const joinName = joinApp.querySelector(".join-main .form .form-control #username");

        const joinColor = joinApp.querySelector(".join-main .form .form-control #colorpicker");
        //     console.log("name was " + name);



        let name = joinName.value;
        let color = joinColor.value;
        // if (name == '' || name == null) {
        //     emsg.push('error');

        // }
        socket.emit('check', { name, color });

        socket.on('valid', function(duplicate) {
            console.log();
            if (duplicate) {
                //document.getElementsByName("submit")[0].type = "button";
                socket.emit('asi', 'paisis')
                emsg.push('user already there Please choose a different name');
                if (emsg.length > 0) {

                    socket.emit('asi', 'error dhorsi ')
                    error.innerHTML = emsg.join(', ');
                }


            } else {


                document.getElementsByName("submit")[0].type = "submit";
                // joinApp.querySelector(".form").submit();


            }
        });

    }


    // joinApp.querySelector(".join-main .form ").addEventListener('submit', (e) => {



    // });
} else if (URL.includes("http://localhost:3000/chatFront.html")) {
    console.log("here");
    socket.emit('user_color', { username, ucolor });
    chatApp.querySelector(".chat-main .message-container .form-container .send-btn").addEventListener("click", function() {

        let message = chatApp.querySelector(".chat-main .message-container .form-container #msg").value;
        if (message.length == 0) {
            return;
        }




        let changeCommand = message.substring(0, 10);
        if (changeCommand.localeCompare("/nickcolor") == 0) {
            const nColor = message.replace("/nickcolor ", "");

            console.log("the message is :" + nColor);
            changeNameColor('changeColor', nColor);
            //changeColor(newColor);
        } else if (changeCommand.substring(0, 5).localeCompare("/nick") == 0) {
            const nUsername = message.replace("/nick ", "");
            console.log("the message is :" + nUsername);
            changeNameColor('changeName', nUsername);
            //changeNickName(newNickName);
        } else {
            console.log("the message is :" + message);
            outputMessage("thisUser", message);
            socket.emit("message", message);
        }


        chatApp.querySelector(".chat-main .message-container .form-container #msg").value = "";
        chatApp.querySelector(".chat-main .message-container .form-container #msg").focus();
    });

    function changeNameColor(type, meta) {

        if (type == 'changeColor') {
            socket.emit('changeNameColor', { type, meta });
        } else if (type == 'changeName') {
            socket.emit('changeNameColor', { type, meta });
        }

    }



    //send username and color to backend



    socket.on('join-leave-update', function(msg) {
        outputMessage("statusUpdate", msg);
    });

    socket.on('message', function(msg) {
        outputMessage("otherUser", msg);
    });

    socket.on('SessionUsers', ({ user }) => {
        console.log(user);
        outputUsers(user);

    })

    socket.on('history', ({ chat }) => {
        console.log(chat[0]);
        outputHistory(chat);
    })




    socket.on('whoU', (user) => {
        console.log(user.username);
        whoU(user);
    })

    function whoU(user) {
        chatApp.querySelector(".chat-main .message-container .you-are").innerHTML = `
        <h3 style = " color : ${user.color}; text-align: center; padding: 10px;
        font-style: italic;
        font-size: 0.9rem;"> You are ${user.username} </h3>
        `;
    }


    socket.on('changeMetaStatus', (data) => {
        outputMessage("statusUpdate", data.text);
        outputUsers(data.users);
        whoU(data.curUser)
        this.ucolor = data.userColor;
        console.log(ucolor);
    })


    socket.on('sessionUserUpdate', (data) => {

        outputMessage("statusUpdate", data.text);
        outputUsers(data.users);



    });


    function outputHistory(chats) {



        let history = chatApp.querySelector(".chat-main .message-container .chats");
        // let userContainer = chatApp.querySelector(".chat-main .users-online .user-list #users");

        for (let i = 0; i < chats.length; i++) {
            let element = document.createElement("div");
            console.log(chats[i].text);
            element.setAttribute("class", "message other-msg");
            element.innerHTML = `

                    <div>
                        <div class="user-name" style= "color: ${chats[i].color}"> ${chats[i].username} - <span>${chats[i].time}</span></div>
                        <div class="msg">${chats[i].text}</div>
                    </div>
            `;

            history.appendChild(element);
        }


        history.scrollTop = history.scrollHeight;




    }


    function outputMessage(type, message) {


        let messageContainer = chatApp.querySelector(".chat-main .message-container .chats");
        if (type == "thisUser") {
            console.log(ucolor);
            console.log("here now" + message.text);
            let element = document.createElement("div");
            element.setAttribute("class", "message my-msg");
            element.innerHTML = `

                    <div>
                        <div class="user-name" style= "color: ${this.ucolor}"> Me - <span>${moment().format('h:mm a')} </span></div>
                        <div class="msg">${message}</div>
                    </div>
            `;
            messageContainer.appendChild(element);


        } else if (type == "otherUser") {
            let element = document.createElement("div");
            console.log(message.text);
            element.setAttribute("class", "message other-msg");
            element.innerHTML = `

                    <div>
                        <div class="user-name" style= "color: ${message.color}"> ${message.username} - <span>${message.time}</span></div>
                        <div class="msg">${message.text}</div>
                    </div>
            `;

            messageContainer.appendChild(element);

            // socket.emit('history', element);

        } else if (type == "statusUpdate") {
            console.log(message.username);
            let element = document.createElement("div");
            element.setAttribute("class", "join-leave-update");
            element.innerHTML = `<p style = "color:${message.color};">${message.text} </p>`;
            messageContainer.appendChild(element);
            // socket.emit('history', element);

        }
        messageContainer.scrollTop = messageContainer.scrollHeight;

    }


    function outputUsers(users) {
        let userContainer = chatApp.querySelector(".chat-main .users-online .user-list #users");


        userContainer.innerHTML = `

        ${users.map(user => `<li style= "color: ${user.color}">${user.username}</li>`).join('')}
    
    `;
    chatApp.querySelector(".chat-main .users-online .user-header .no-users h4").innerHTML = `
        ${users.length}
    `;
    }

}