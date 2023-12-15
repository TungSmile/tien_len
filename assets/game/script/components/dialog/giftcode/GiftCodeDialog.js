var NewAudioManager = require("NewAudioManager");
var Linker = require('Linker');
var Utils = require('Utils');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
var Constant = require('Constant');
const i18n = require("../../../../../i18n/i18n");
cc.Class({
    extends: cc.Component,

    properties: {
        inputCode: cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
           // self.node.active = false;
        }, this);
    },

    start() {
        this.addSocketEvent();
    },
    addSocketEvent() {
        Linker.Event.addEventListener(83, this.onGetGiftCode, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(83, this.onGetGiftCode, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onGetGiftCode(message) {
        if (message.status == 1) {
            cc.Global.showMessage(message.text);
        } else {
            var msg = (Linker.gameLanguage == "vi") ? message.text : "Please activate your account to receive GiftCode";
            cc.Global.showMessage(msg);
        }
    },
    onEnable: function () {
        this.inputCode.string = "";
    },

    onDisable: function () {
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
    },
    closeBtnClick() {
        NewAudioManager.playClick();
        this.node.active = false;
    },
    xacNhanBtnClick() {
        NewAudioManager.playClick();
        if (this.inputCode.string.length > 0) {
            var test1 = CommonSend.giftCode(this.inputCode.string);
            Linker.Socket.send(test1);
        } else {
            cc.Global.showMessage(i18n.t("Please enter the code and press confirm to receive your gift"));
        }
    },
    onBtnCloseClick: function () {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        customEvent.toggle = this.node.getComponent(cc.Toggle);
        this.node.dispatchEvent(customEvent);
        this.node.active = false;
    }
    // update (dt) {},
});
