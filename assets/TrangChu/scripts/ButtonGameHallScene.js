var soccerConstant = require('soccerConstant');
var Linker = require('Linker');
var Utils = require('Utils');
var Constant = require('Constant');
var NewAudioManager = require('NewAudioManager');
const i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        commingSoonNode: cc.Node,
        loadingGameNode: cc.Node,
        btnPlayContainer: cc.Node,
        isCommingSoon: false,
        isHide: false
    },
    onLoad: function () {
        if (this.isHide) {
            this.node.active = false;
        } else {
            if (this.isCommingSoon) {
                this.commingSoonNode.active = true;
            } else {
                this.commingSoonNode.active = false;
            }
            this.btnPlayContainer.active = !this.commingSoonNode.active;
            this.loadingGameNode.active = false;

        }
    },
    onButtonClick: function (event) {
        NewAudioManager.playClick();
        if (event && event.target) {
            if (Linker.Socket.isOpen()) {
                var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.ON_BUTTON_GAME_HALL_SCENE_CLICK, true);
                customEvent.isButtonGameClick = true;
                customEvent.data = event;
                customEvent.loadingGameNode = this.loadingGameNode;
                customEvent.chooseZone = this.getChooseZone();
                this.node.dispatchEvent(customEvent);
            } else {
                this.processConnect();
            }
        }
    },
    getChooseZone: function () {
        var chooseZone;
        var buttonZonesComponent = this.node.getComponent("ButtonZones");
        if (buttonZonesComponent) {
            chooseZone = buttonZonesComponent.getChooseZone();
            if (chooseZone) {
                cc.error("Tìm thấy select zone game...", chooseZone);
            } else {
                cc.error("Không tìm thấy select zone game...", chooseZone);
            }
        }
        return chooseZone;
    },
    onToggleBidaChoose: function (toggle) {
        if (toggle) {
            NewAudioManager.playClick();
            if (Linker.Socket.isOpen()) {
                var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.ON_BUTTON_GAME_BIDA_HALL_SCENE_CLICK, true);
                customEvent.toggle = toggle;
                customEvent.isButtonGameClick = true;
                customEvent.loadingGameNode = this.loadingGameNode;
                customEvent.chooseZone = this.getChooseZone();
                this.node.dispatchEvent(customEvent);
            } else {
                this.processConnect();
            }
        }
    },
    processConnect() {
        Utils.Malicious.processConnect(Linker, this.node);
    },
    onButtonCommingSoonClick: function () {
        cc.Global.showMessage(i18n.t("game_comming_soon"));
    },
    start() {

    },

    // update (dt) {},
});
