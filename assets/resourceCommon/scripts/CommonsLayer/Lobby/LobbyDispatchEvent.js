var soccerConstant = require('soccerConstant');
var Linker = require('Linker');
var Global = require("Global");
var Utils = require('Utils');
var CommonSend = require('CommonSend');
var Constant = require('Constant');
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {

    },
    requestDataJoinZone: function () {
        cc.error("requestDataJoinZone ...");
        if (!Linker.Socket.isOpen()) {
            Linker.isLoadLogin = false;
            this.processConnect();
            return false;
        }
        // cc.Global.showLoading();
        if (Linker.ZONE) {
            console.log('--1');
            var sendData = CommonSend.joinZone(Linker.ZONE, 0);
            Linker.Socket.send(sendData);
        } else {
            cc.error("Không xác định được linker zone id, không thể join zone", Linker.ZONE);
        }
    },
    processConnect() {
        Utils.Malicious.processConnect(Linker, this.node);
    }
    // update (dt) {},
});
