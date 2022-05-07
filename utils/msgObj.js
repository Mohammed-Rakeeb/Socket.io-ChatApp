const moment = require("moment");


const msgDivList = [];

function renderMsg(username, color, text) {

    return {
        username,
        color,
        text,
        time: moment().format('h:mm a')
    }
}



function chatHistory(username, color, text) {

    const log = { username, color, text, time: moment().format('h:mm a') };
    msgDivList.push(log);
}

function gethistory() {
    return msgDivList
}
module.exports = { renderMsg, chatHistory, gethistory };