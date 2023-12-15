var Constant = require('Constant');
var Linker = require('Linker');
var Utils = require('Utils');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
var BiDaConstant = require('BiDaConstant');
var DataAccess = require('DataAccess');
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        listAvatar: cc.Node,
        listAvatarScrollView: cc.ScrollView
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //self.node.active = false;
        }, this);
        this.updateAvatar();
    },


    onEnable: function () {
        // this.stopPropagationOnBackdrop = Utils.Node.stopPropagation(this.backdrop);
        this.node.stopAllActions();
        this.node.setScale(0.3);
        this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
        var test1 = CommonSend.getListAvatar(this.page);
        Linker.Socket.send(test1);
        this.updateAvatar();
    },
    updateAvatar: function () {
        var lastAvatar = Number(Linker.userData.avatar);
        if (!lastAvatar) {
            lastAvatar = 1;
        }
        this.activeCurrentAvartById(lastAvatar);
        this.avatar = lastAvatar;
    },
    activeCurrentAvartById: function (id) {
        if (id) {
            for (var i = 0; i < this.listAvatar.children.length; i++) {
                var avatar = this.listAvatar.children[i];
                var avatarId = Number(avatar.name);
                var avatarToggle = avatar.getComponent(cc.Toggle);
                if (avatarToggle) {
                    if (avatarId && avatarId == id) {
                        avatarToggle.check();
                        this.scrollToAvatar(avatar);
                    } else {
                        avatarToggle.uncheck();
                    }
                }
            }

        }
    },
    scrollToAvatar: function (avatar) {
        if (avatar) {
            var size = this.listAvatar.getContentSize();
            var avatarPos = avatar.position.x / size.width;
            this.listAvatarScrollView.scrollToPercentHorizontal(avatarPos);
        }
    },
    onDisable: function () {
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
    },
    closeBtnClick() {
        this.node.active = false;
    },
    xacNhanBtnClick() {
        var self = this;
        if (this.avatar) {
            var test1 = CommonSend.changeAvatar(this.avatar);
            Linker.Socket.send(test1);
            if (cc.find("Loading")) cc.find("Loading").active = true;
        } else {
            cc.Global.showMessage(i18n.t("Có lỗi xảy ra, vui lòng thử lại sau"));
        }


    },
    onToggleClick(toggle, id) {
        id = Number(id);
        if (id) {
            this.avatar = id;
            Linker.userData._avatar = this.avatar;
            cc.log('avatar chosen:', this.avatar);
        }
    },
    start() {
        this.addSocketEvent();
    },
    addSocketEvent() {
        Linker.Event.addEventListener(2, this.onChangeAvatar, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(2, this.onChangeAvatar, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onChangeAvatar(message) {
        if (message.status == 1) {
            Linker.userData.avatar = this.avatar + "";
            DataAccess.Instance.userData.avatar = this.avatar + "";
            var msg = (Linker.gameLanguage !== "vi" && message.text == "Cập nhật avatar thành công") ? "Change avatar successful" : message.text;
            cc.Global.showMessage(msg);
            // if (Linker.HallView) {
            //     Linker.HallView.updateAvatar();
            // }
            // if (Linker.PhomLobbyView) {
            //     Linker.PhomLobbyView.updateAvatar();
            // }
            // if (Linker.UserTab) {
            //     Linker.UserTab.updateAvatar();
            // }
            // var xocDiaMini = cc.find("Canvas/XocDiaMini")
            // if (xocDiaMini && xocDiaMini.isValid){
            //     var xdjs = xocDiaMini.getComponent("XocDiaMini");
            //     xdjs.onChangeAvatar(message);
            // }
            var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.CHANGE_AVATAR, true);
            this.node.dispatchEvent(customEvent);
            this.node.active = false;
        } else {
            cc.Global.showMessage(message.text);

        }
        if (cc.find("Loading")) cc.find("Loading").active = false;
    }
    // update (dt) {},
});
