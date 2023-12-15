// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Md5 = require('Md5');
var SocketConstant = require('SocketConstant');
var Global = require("Global");
var Constant = require('Constant');
var TQUtil = require('TQUtil');
var CommonSend = {
    login(username, password, version, device, deviceId) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 1000 + SocketConstant.SEPERATOR.N4 + username + SocketConstant.SEPERATOR.ELEMENT +
            Md5(password) + SocketConstant.SEPERATOR.ELEMENT + version + SocketConstant.SEPERATOR.ELEMENT + device + SocketConstant.SEPERATOR.ELEMENT + deviceId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);

    },
    register(username, password, deviceType, deviceId) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        // var tempString = 1115 + SocketConstant.SEPERATOR.N4 + username + SocketConstant.SEPERATOR.ELEMENT +
        //     password + SocketConstant.SEPERATOR.ELEMENT + deviceType + SocketConstant.SEPERATOR.ELEMENT + deviceId;
        // var str = Constant.CMD.REGISTER_ACCOUNT +
        //     Constant.SEPERATOR.N4 + username +
        //     Constant.SEPERATOR.ELEMENT + pass +
        //     Constant.SEPERATOR.ELEMENT + 96 +
        //     Constant.SEPERATOR.ELEMENT + 96 +
        //     Constant.SEPERATOR.ELEMENT + 4 +
        //     Constant.SEPERATOR.ELEMENT + '' +
        //     Constant.SEPERATOR.ELEMENT + 1 +
        //     Constant.SEPERATOR.ELEMENT + registerTime +
        //     Constant.SEPERATOR.ELEMENT + Global.deviceID;


        // var tempString = 1115 + SocketConstant.SEPERATOR.N4 + username + SocketConstant.SEPERATOR.ELEMENT +
        //     password + "\u000196\u000196\u00014\u0001\u00011\u0001sdsaddsada";
        //edit by zep, fix register
        var registerTime = new Date().getTime();
        var tempString = 1115 +
            SocketConstant.SEPERATOR.N4 + username +
            SocketConstant.SEPERATOR.ELEMENT + password +
            SocketConstant.SEPERATOR.ELEMENT + 96 +
            SocketConstant.SEPERATOR.ELEMENT + ApplicationConfig.PLATFORM +
            SocketConstant.SEPERATOR.ELEMENT + ApplicationConfig.PLATFORM +
            SocketConstant.SEPERATOR.ELEMENT + '' +
            SocketConstant.SEPERATOR.ELEMENT + 1 +
            SocketConstant.SEPERATOR.ELEMENT + registerTime +
            SocketConstant.SEPERATOR.ELEMENT + Global.deviceID;

        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    changeViewName(name) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 14000 + SocketConstant.SEPERATOR.N4 + name;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    updatePhone(phone) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 12014 + SocketConstant.SEPERATOR.N4 + phone;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    giftCode(code) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 83 + SocketConstant.SEPERATOR.N4 + code;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    getHistory(page = 1, type = null) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 14003 + SocketConstant.SEPERATOR.N4 + page;
        // if (type != null) {
        //     tempString = 14003 + SocketConstant.SEPERATOR.N4 + page + SocketConstant.SEPERATOR.ELEMENT + type;
        // }
        // var typeMoney = 1;//tien that, realmoney, 2 money
        var gameid = Constant.ZONE_ID.TLMN;// game football3D, game khac thi phai sua game khac
        tempString = 14003 + SocketConstant.SEPERATOR.N4 + page + SocketConstant.SEPERATOR.ELEMENT + type + SocketConstant.SEPERATOR.ELEMENT + gameid;

        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    getListMail(page = 1) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 400002 + SocketConstant.SEPERATOR.N4 + page;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    readMail(idMail) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 400003 + SocketConstant.SEPERATOR.N4 + idMail;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    getListAvatar() {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 1202 + SocketConstant.SEPERATOR.N4;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    changeAvatar(id) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 2 + SocketConstant.SEPERATOR.N4 + id;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    cancelOrder(id) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 400006 + SocketConstant.SEPERATOR.N4 + id;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    getOrderHistory(page) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 400007 + SocketConstant.SEPERATOR.N4 + page;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    bonus(id) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 400005 + SocketConstant.SEPERATOR.N4 + id;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    getListBonus(type) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 400004 + SocketConstant.SEPERATOR.N4 + type;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    chargeCard(nhaMang, seriCard, cardPin, menhGia, typeMoney) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 4000 + SocketConstant.SEPERATOR.N4 + nhaMang + SocketConstant.SEPERATOR.ELEMENT + seriCard + SocketConstant.SEPERATOR.ELEMENT + cardPin + SocketConstant.SEPERATOR.ELEMENT + typeMoney + SocketConstant.SEPERATOR.ELEMENT + menhGia;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    getListCard() {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 1506 + SocketConstant.SEPERATOR.N4;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    getUserInfo(playerId) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 121001 + SocketConstant.SEPERATOR.N4 + playerId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    updateUserInfo() {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 1123 + SocketConstant.SEPERATOR.N4;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    getListEvent() {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 57 + SocketConstant.SEPERATOR.N4;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    detailEvent(idEvent) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 58 + SocketConstant.SEPERATOR.N4 + idEvent;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    getLeaderboard(type = 1) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 1208 + SocketConstant.SEPERATOR.N4 + type;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    fastLogin(deviceId, deviceType, currentTime) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 10001 + SocketConstant.SEPERATOR.N4 + deviceId + SocketConstant.SEPERATOR.ELEMENT + deviceType +
            SocketConstant.SEPERATOR.ELEMENT + currentTime + SocketConstant.SEPERATOR.ELEMENT + Md5(deviceId + deviceType + cu + "vas2@#$(_34#%^&*|})))*vbKLMLlJ");
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    loginFb(idSocial, version, deviceType, token, deviceId) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 100001 + SocketConstant.SEPERATOR.N4 + idSocial + SocketConstant.SEPERATOR.ELEMENT + version +
            SocketConstant.SEPERATOR.ELEMENT + deviceType + SocketConstant.SEPERATOR.ELEMENT + token + SocketConstant.SEPERATOR.ELEMENT + deviceId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    transferMoney(money, username, pass) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 12011 + SocketConstant.SEPERATOR.N4 + money + SocketConstant.SEPERATOR.ELEMENT + username +
            SocketConstant.SEPERATOR.ELEMENT + pass + SocketConstant.SEPERATOR.ELEMENT + '012345678';
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    joinZone(idZone, cacheVerion = 0) {
        console.log('--1day');
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 110701 + SocketConstant.SEPERATOR.N4 + idZone + SocketConstant.SEPERATOR.ELEMENT + cacheVerion;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    ingameReconnectRequest() {

    },

    kickPlayer(tableId, userId) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1117 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT + userId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    invitePlayerRequest() {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1212 + SocketConstant.SEPERATOR.N4 + 0;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    leaveTableRequest(tableId) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1103 + SocketConstant.SEPERATOR.N4 + tableId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    noneInvite() {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 75 + SocketConstant.SEPERATOR.N4;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    pingRequest() {
        return "1";
    },
    readyGameRequest(tableId, isReady = 0) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1110 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT + isReady;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    sendAcceptInviteRequest(tableId, playerId, isAccept) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1102 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT +
            isAccept + SocketConstant.SEPERATOR.ELEMENT + playerId + SocketConstant.SEPERATOR.ELEMENT + 1;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    sendInviteRequest(tableId, playerId) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1101 + SocketConstant.SEPERATOR.N4 +
            tableId + SocketConstant.SEPERATOR.ELEMENT + playerId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    simpleSettingRequest(tableId, capacity, minMoney) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1242 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT + capacity +
            SocketConstant.SEPERATOR.ELEMENT + minMoney;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    startGameRequest(tableId) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1108 + SocketConstant.SEPERATOR.N4 + tableId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    checkUserIsFriendByUID(message) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 73 + SocketConstant.SEPERATOR.N4 + message.userId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    sendFastLogin(version = 1) {
        console.log("sendFastLogin---");
        if(!Global.deviceID){
             Global.deviceID = TQUtil.getWebDeviceID();
        }
        var time = new Date().getTime();
        var sign = Md5(Global.deviceID + cc.sys.os + time + "vas2@#$(_34#%^&*|})))*vbKLMLlJ");
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var str = Constant.CMD.FAST_LOGIN +
            Constant.SEPERATOR.N4 + Global.deviceID +
            Constant.SEPERATOR.ELEMENT + cc.sys.os +
            Constant.SEPERATOR.ELEMENT + version +
            Constant.SEPERATOR.ELEMENT + time +
            Constant.SEPERATOR.ELEMENT + sign;
        sendData.v = str;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    changePasswordRequest(oldPass, newPass, renewPass) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var str = 10901 + Constant.SEPERATOR.N4 + oldPass +
            Constant.SEPERATOR.ELEMENT + newPass +
            Constant.SEPERATOR.ELEMENT + renewPass;
        sendData.v = str;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    CashIap(receipt) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = SocketConstant.COMMON.IAP + SocketConstant.SEPERATOR.N4 + receipt;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    CashIap2(receipt, type) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = SocketConstant.COMMON.IAP + SocketConstant.SEPERATOR.N4 + receipt + Constant.SEPERATOR.ELEMENT + type;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    //:__: pingToServer
    pingToServer() {
        var arraySend = {};
        var sendData = {}
        arraySend.r = [];
        var str = 1;
        sendData.v = str;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    //friends zone
    getFriendList(page, status) {
        if (!page) {
            page = 1;
        }
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 1203 + SocketConstant.SEPERATOR.N4 + page + SocketConstant.SEPERATOR.ELEMENT + status;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    getFriendSend(page) {
        if (!page) {
            page = 1;
        }
        var arraySend = {};
        var sendData = {};
        arraySend.r = [];
        var tempString = 7051 + SocketConstant.SEPERATOR.N4 + page;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    addAFriend(idFriend) {
        if (idFriend && !isNaN(idFriend)) {
            var arraySend = {}
            var sendData = {};
            arraySend.r = [];
            var tempString = 1204 + SocketConstant.SEPERATOR.N4 + idFriend;
            sendData.v = tempString;
            arraySend.r.push(sendData);
            cc.log(tempString);
            cc.log(arraySend);
            return JSON.stringify(arraySend);
        } else {
            return null;
        }
    },
    replyFriendRequest(idFriend, yesno) {
        if (idFriend && !isNaN(idFriend)) {
            var arraySend = {}
            var sendData = {};
            arraySend.r = [];
            var tempString = 7010 + SocketConstant.SEPERATOR.N4 + idFriend + SocketConstant.SEPERATOR.ELEMENT + yesno;
            sendData.v = tempString;
            arraySend.r.push(sendData);
            cc.log(tempString);
            cc.log(arraySend);
            return JSON.stringify(arraySend);
        } else {
            return null;
        }
    },
    sendFriendRequest(pageIndex) {

    },
    findAFriendByName(viewName, page) {
        if (!page) {
            page = 1;
        }
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var isMale = "";
        var name = viewName;
        var countryId = 0;
        var cityId = 0;
        var pageId = page;

        var tempString = 8 + SocketConstant.SEPERATOR.N4 +
            isMale + SocketConstant.SEPERATOR.ELEMENT +
            name + SocketConstant.SEPERATOR.ELEMENT +
            countryId + SocketConstant.SEPERATOR.ELEMENT +
            cityId + SocketConstant.SEPERATOR.ELEMENT +
            pageId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    sendSettingRequest(zoneID, matchID, isFastPlay, isTotalError) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1242 + SocketConstant.SEPERATOR.N4 + zoneID + SocketConstant.SEPERATOR.ELEMENT + matchID +
            SocketConstant.SEPERATOR.ELEMENT + isFastPlay + SocketConstant.SEPERATOR.ELEMENT + isTotalError;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    getChatZonePage(pageIndex) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 1303 + SocketConstant.SEPERATOR.N4 + 0 + SocketConstant.SEPERATOR.ELEMENT + pageIndex + SocketConstant.SEPERATOR.ELEMENT + "some" +
            SocketConstant.SEPERATOR.ELEMENT + 8;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },

    sendChatZone(message) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 1303 + SocketConstant.SEPERATOR.N4 + 1 + SocketConstant.SEPERATOR.ELEMENT + 0 + SocketConstant.SEPERATOR.ELEMENT + message + " " +
            SocketConstant.SEPERATOR.ELEMENT + 8;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    // by Son
    getListRoomSocial(userId, action = 1, inputSearch = "", page = 1, numberRoom = 20) { // Get List Room Social
        var arraySend = {};
        var sendData = {};
        arraySend.r = [];
        var msg = 280198 + SocketConstant.SEPERATOR.N4 + userId +
            SocketConstant.SEPERATOR.ELEMENT + action +
            SocketConstant.SEPERATOR.ELEMENT + inputSearch +
            SocketConstant.SEPERATOR.ELEMENT + page +
            SocketConstant.SEPERATOR.ELEMENT + numberRoom +
            SocketConstant.SEPERATOR.ELEMENT;
        sendData.v = msg;
        arraySend.r.push(sendData);
        cc.log(msg);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    getListMessageSocial(roomId, page = 1, numbMess = 20) { //Get List Message In Room Social
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var msg = 290198 + SocketConstant.SEPERATOR.N4 + roomId +
            SocketConstant.SEPERATOR.ELEMENT + page +
            SocketConstant.SEPERATOR.ELEMENT + numbMess +
            SocketConstant.SEPERATOR.ELEMENT;
        sendData.v = msg;
        arraySend.r.push(sendData);
        cc.log(msg);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    sendMessageSocial(roomId, mess, uId, createdTime, type, status = 0) { //Send Message Social
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var msg = 270198 + SocketConstant.SEPERATOR.N4 + roomId +
            SocketConstant.SEPERATOR.ELEMENT + uId +
            SocketConstant.SEPERATOR.ELEMENT + createdTime +
            SocketConstant.SEPERATOR.ELEMENT + type +
            SocketConstant.SEPERATOR.ELEMENT + mess +
            SocketConstant.SEPERATOR.ELEMENT + status +
            SocketConstant.SEPERATOR.ELEMENT;
        sendData.v = msg;
        arraySend.r.push(sendData);
        cc.log(msg);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    createRoomChat(listPlayerID, ownerId, zondeId, createType) {  //Insert New Room Social
        var createTime = new Date().getTime();
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var msg = 260198 + SocketConstant.SEPERATOR.N4 + createType +
            SocketConstant.SEPERATOR.ELEMENT + ownerId +
            SocketConstant.SEPERATOR.ELEMENT + listPlayerID +
            SocketConstant.SEPERATOR.ELEMENT + zondeId +
            SocketConstant.SEPERATOR.ELEMENT + createTime +
            SocketConstant.SEPERATOR.ELEMENT;
        sendData.v = msg;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    createRoomChatWithoutGameId: function (listPlayerID, ownerId, zondeId = 0, createType = 2) {
        var createTime = new Date().getTime();
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var msg = 260198 + SocketConstant.SEPERATOR.N4 + createType +
            SocketConstant.SEPERATOR.ELEMENT + ownerId +
            SocketConstant.SEPERATOR.ELEMENT + listPlayerID +
            SocketConstant.SEPERATOR.ELEMENT + zondeId +
            SocketConstant.SEPERATOR.ELEMENT + createTime +
            SocketConstant.SEPERATOR.ELEMENT;
        sendData.v = msg;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },

    sendActionTheme(userId, action, themeId) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 19721 + SocketConstant.SEPERATOR.N4 + userId +
            SocketConstant.SEPERATOR.ELEMENT + action +
            SocketConstant.SEPERATOR.ELEMENT + themeId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },

    // end by Son
    sendAppStatus(zoneID, tableId, status) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 12020 + SocketConstant.SEPERATOR.N4 + zoneID +
            SocketConstant.SEPERATOR.ELEMENT + tableId +
            SocketConstant.SEPERATOR.ELEMENT + status;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },

    sendChallenge(userId, otherId, zoneID, money, cancelPairing, isInvite) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 12031 + SocketConstant.SEPERATOR.N4 + userId +
            SocketConstant.SEPERATOR.ELEMENT + otherId +
            SocketConstant.SEPERATOR.ELEMENT + zoneID +
            SocketConstant.SEPERATOR.ELEMENT + money +
            SocketConstant.SEPERATOR.ELEMENT + cancelPairing +
            SocketConstant.SEPERATOR.ELEMENT + isInvite;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },

};
module.exports = CommonSend;