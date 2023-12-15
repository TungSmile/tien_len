var NewAudioManager = require("NewAudioManager");
var Linker = require('Linker');
var Utils = require('Utils');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
const BiDaConstant = require('BiDaConstant');
var PageHandler = require('PageHandler');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        btnFaceBookFanpage: cc.Node,
        btnFaceBookMessages: cc.Node,
        groupBtnNode: cc.Node
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },
    configGroupButtonLayout: function (event) {
        if (event) {
            var buttonLayout = event.buttonLayout;
            if (buttonLayout) {
                var x = buttonLayout.x + (buttonLayout.width * 0.25);
                var y = buttonLayout.y + (buttonLayout.height * 0.5);
                this.groupBtnNode.position = this.groupBtnNode.parent.convertToNodeSpaceAR(cc.v2(x, y));
            }
        }
    },
    onButtonClick: function (event) {
        if (event) {
            var clickingNode = event.target;
            switch (clickingNode) {
                case this.btnFaceBookFanpage:
                    if (Linker.Config) {
                        var url = Linker.Config.FACEBOOK_PAGE;
                        cc.sys.openURL(url);
                    }
                    break;
                case this.btnFaceBookMessages:
                    if (Linker.Config) {
                        var url = Linker.Config.MESSAGER;
                        cc.sys.openURL(url);
                    }
                    break;
                default:
                    break;
            }
            this.onBtnCloseClick();
        }
    },
    onBtnCloseClick: function () {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        customEvent.toggle = this.node.getComponent(cc.Toggle);
        this.node.dispatchEvent(customEvent);
    }
    // update (dt) {},
});