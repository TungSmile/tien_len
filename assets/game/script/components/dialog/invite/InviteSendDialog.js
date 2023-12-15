var NewAudioManager = require('NewAudioManager');
var Linker = require('Linker');
var Utils = require('Utils');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        listPlayer: cc.Node,
        itemInvite: cc.Prefab,
        loadingContainer: cc.Node,
        loadingIcon: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.node.active = false;
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //self.node.active = false;
        }, this);
        this.listPlayer.removeAllChildren();
        this.addCustomEventListener();
        this.addSocketEvent();
        this.message = null;
    },
    addCustomEventListener: function () {

    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onEnable: function () {
        this.showLoading();
        // this.stopPropagationOnBackdrop = Utils.Node.stopPropagation(this.backdrop);
        var data = CommonSend.invitePlayerRequest();
        Linker.Socket.send(data);
        this.node.stopAllActions();
        this.node.setScale(0.3);
        this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
    },
    showLoading: function () {
        this.unschedule(this.hideLoading, this);
        this.scheduleOnce(this.hideLoading, 5000);
        this.loadingContainer.active = true;
        this.loadingIcon.stopAllActions();
        this.loadingIcon.runAction(cc.repeatForever(cc.rotateBy(0.8, -360)));
    },
    hideLoading: function () {
        this.loadingContainer.active = false;
        this.loadingIcon.stopAllActions();
    },
    onDisable: function () {
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
    },
    addSocketEvent() {
        Linker.Event.addEventListener(1212, this.onGetListFree, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(1212, this.onGetListFree, this);
    },
    onGetListFree(message) {
        cc.log(message);
        this.hideLoading();
        if (message.status == 1) {
            var listMinimum = [];
            this.listPlayer.removeAllChildren();
            this.message = message;
            for (var i = 0; i < message.listPlayer.length; i++) {
                listMinimum.push(message.listPlayer[i]);
            }
            if (listMinimum.length > 0) {
                listMinimum.forEach((data, pos) => {
                    var item = cc.instantiate(this.itemInvite);
                    this.listPlayer.addChild(item);
                    var script = item.getComponent(require("InviteItem"));
                    if (script) {
                        script.init(data);
                    } else {
                        cc.log("NULL", script);
                    }
                });
            } else {
                var item = cc.instantiate(this.itemInvite);
                var script = item.getComponent(require("InviteItem"));
                if (script) {
                    script.showBusy();
                    this.listPlayer.addChild(item);
                } else {
                    cc.log("NULL", script);
                }
                // cc.Global.showMessage("Tất cả người chơi đều đang bận, vui lòng chờ trong giây lát.");
            }
        } else {
            cc.Global.showMessage(message.error);
        }
    },
    refreshList() {
        this.showLoading();
        NewAudioManager.playClick();
        this.listPlayer.removeAllChildren();
        var data = CommonSend.invitePlayerRequest();
        Linker.Socket.send(data);
    },
    onBtnCloseClick: function () {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        customEvent.toggle = this.node.getComponent(cc.Toggle);
        this.node.dispatchEvent(customEvent);
        if (Number(Linker.CURRENT_TABLE.tableId)) {
            this.node.active = false;
        }
    }
});