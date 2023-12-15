var Linker = require('Linker');
var Utils = require('Utils');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
var BiDaConstant = require('BiDaConstant');
var i18n = require("i18n");
var Constant = require('Constant');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        inputName: cc.EditBox,
        buttonXacNhan: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //self.node.active = false;
        }, this);
    },

    onEnable: function () {
        // this.stopPropagationOnBackdrop = Utils.Node.stopPropagation(this.backdrop);
        this.node.stopAllActions();
        this.node.setScale(0.3);
        this.buttonXacNhan.active = true;
        this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
        Utils.Malicious.setMaxZindex(this.node.parent, this.node);
    },
    onActiveBtnXacNhan: function () {
        this.inputName.string = "";
        this.textDisplayName = this.inputName.string;
        this.buttonXacNhan.active = true;
        cc.Global.showMessage(i18n.t("Có lỗi xảy ra, vui lòng thử lại sau"));
    },
    xacNhanBtnClick() {
        if (this.inputName.string.length > 0) {
            this.textDisplayName = this.inputName.string;
            var test1 = CommonSend.changeViewName(this.textDisplayName);
            Linker.Socket.send(test1);
            this.buttonXacNhan.active = false;
            if (cc.find("Loading")) cc.find("Loading").active = true;
            this.unschedule(this.onActiveBtnXacNhan, this);
            this.scheduleOnce(this.onActiveBtnXacNhan, 5);
        } else {
            cc.Global.showMessage(i18n.t("The display name cannot be left blank !"));
        }
    },
    start() {
        this.addSocketEvent();
    },
    addSocketEvent() {
        Linker.Event.addEventListener(14000, this.onChangeViewName, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(14000, this.onChangeViewName, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onChangeViewName(message) {
        if (message.status == 1) {
            this.unschedule(this.onActiveBtnXacNhan, this);
            Linker.showDialogActive = false;
            //an popup hien thi khi doi ten thanh cong
            Linker.userData.displayName = this.textDisplayName;
            var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.CHANGE_DISPLAY_NAME, true);
            this.node.dispatchEvent(customEvent);
            if (message.message == "Cập nhật tên hiển thị thành công!.") {
                cc.Global.showMessage(i18n.t("change_view_name"));
            } else {
                cc.Global.showMessage(message.message);
            }
            this.node.destroy();
        } else {
            this.buttonXacNhan.active = true;
            if (message.message == "Tên hiển thị đã tồn tại, vui lòng chọn tên hiển thị khác!") {
                cc.Global.showMessage(i18n.t(message.message));
            } else {
                cc.Global.showMessage(message.message);
            }
        }
        if (cc.find("Loading")) cc.find("Loading").active = false;

    },
    joinTaiXiu() {
        var testdata = { "r": [{ "v": "12004\u0004" }] }
        Linker.Socket.send(JSON.stringify(testdata));
    },
    onBtnCloseClick: function () {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        customEvent.toggle = this.node.getComponent(cc.Toggle);
        this.node.dispatchEvent(customEvent);
    }
    // update (dt) {},
});
