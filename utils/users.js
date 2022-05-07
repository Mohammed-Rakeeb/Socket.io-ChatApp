const userArr = [];

const defaultUser = {
    user1: false,
    user2: false,
    user3: false,
    user4: false,
    user5: false,
    user6: false,
    user7: false
}


function userList(id, username, color) {
    const user = { id, username, color };

    userArr.push(user);

    return user;
}


function changeUserMeta(type, id, meta) {
    // let userlist = getSessionUser();
    let curUser = getCurUser(id);
    let str;
    if (type == 'changeColor' && !userArr.find(user => user.color == meta)) {
        str = `color changed to ${meta}`;
        curUser["color"] = meta;
        return { str, flag: true };
    } else if (type == 'changeName' && !userArr.find(user => user.username == meta)) {
        str = `${curUser.username} nickname changed to ${meta}`;
        curUser["username"] = meta;
        return { str, flag: true };
    } else {
        if (type == 'changeColor') {
            str = `color already taken`;
            return { str, flag: false };
        } else {
            str = `nickname already taken`;
            return { str, flag: false };

        }
    }

}



function setDefaultUser() {
    let user = Object.keys(defaultUser).find(username => defaultUser[username] === false);
    if (defaultUser[user] == false) {
        defaultUser[user] = true;
        console.log("user now is made to  " + defaultUser[user]);
        console.log("user now is " + user);
        return user;
    }
}

function CheckdefaultUser(user) {
    // Object.keys(defaultUser).find(username => defaultUser[username] == user.username)
    if (user.username in defaultUser) {
        console.log('default user was ' + user.username);
        defaultUser[user.username] = false;
    }
}




function getCurUser(id) {
    // let user;
    return userArr.find(user => user.id === id);
}


function userLeft(id) {
    const index = userArr.findIndex(user => user.id === id);

    if (index !== -1) {
        return userArr.splice(index, 1)[0];
    }
}

function getSessionUser() {
    return userArr;
}

module.exports = {
    userList,
    getCurUser,
    setDefaultUser,
    CheckdefaultUser,
    changeUserMeta,
    userLeft,
    getSessionUser
};