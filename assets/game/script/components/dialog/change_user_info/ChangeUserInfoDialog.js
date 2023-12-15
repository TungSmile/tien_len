var Utils = require('Utils');
var Linker = require('Linker');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
var LoginCache = require('LoginCache');
var NewAudioManager = require('NewAudioManager');
var Md5 = require('Md5');
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        oldPass: cc.EditBox,
        newPass: cc.EditBox,
        reNewPass: cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {
        Linker.Event.addEventListener(10901, this.onChangePassword, this);
    },
    onEnable: function () {
        // this.stopPropagationOnBackdrop = Utils.Node.stopPropagation(this.backdrop);

    },
    onDestroy() {
        Linker.Event.removeEventListener(10901, this.onChangePassword, this);
    },
    updateLoginCache: function () {
        var cache = LoginCache.get();
        if (Utils.Malicious.getLengthObj(cache) < 2) {
            cache.username = "";
            cache.password = "";
        }
        if (cache.username.length > 0 && cache.password.length > 0) {
            LoginCache.set(cache.username, this.newPass.string);
        }
        this.oldPass.string = "";
        this.newPass.string = "";
        this.reNewPass.string = "";

    },
    onChangePassword(message) {
        if (message.status == 1) {
            this.updateLoginCache();
            cc.Global.showMessage(message.data);
        } else {
            cc.Global.showMessage(message.error);
        }
    },
    onDisable: function () {
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
    },
    clickBtnClose() {
        NewAudioManager.playClick();
        this.node.active = false;
    },
    xacNhanBtnClick(event) {
        NewAudioManager.playClick();
        // If  login with facebook
        if (Linker.TOKEN && Linker.TOKEN.token && Linker.isFb) {
            cc.Global.showMessage(i18n.t("This feature is not available when logging in with facebook."));
            return;
        }
        // Normal login

        if (this.newPass.string == this.reNewPass.string) {
            var cache = LoginCache.get();
            cc.log(cache);
            cc.log('this.oldpass:', this.oldPass.string);
            cc.log('this.newPass:', this.newPass.string);
            if (cache.password) {
                if (this.oldPass.string == cache.password) {
                    var oldPass = Md5(this.oldPass.string);
                    var newPass = Md5(this.newPass.string);
                    var reNewPass = Md5(this.reNewPass.string);
                    var data = CommonSend.changePasswordRequest(oldPass, newPass, reNewPass);
                    Linker.Socket.send(data);
                    this.node.active = false;
                    //cc.Global.showMessage('Tính năng này đang được bảo trì.');
                } else {
                    cc.Global.showMessage(i18n.t("The current password you entered does not match."));
                }
            }
            else {
                cc.Global.showMessage(i18n.t("An error occurred. Please log in again to try again."))
            }
        } else {
            cc.Global.showMessage(i18n.t("The new password you have entered for the secend time does not match."));
        }

    }
    // update (dt) {},
});
