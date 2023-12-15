// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Linker = require('Linker');
var Utils = require('Utils');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
cc.Class({
    extends: cc.Component,

    properties: {
        listEvent: cc.Node,
        detailEvent: cc.Node,
        itemEvent: cc.Prefab,
        webviewNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.EventDialog = this;
        if(Linker.configPurchase){
            var url=Linker.configPurchase.WEBVIEW_EVENT;
            this.webviewNode.getComponent(cc.WebView).url=url;
        }
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //self.node.active = false;
        }, this);
    },
    onEnable: function () {
        // this.stopPropagationOnBackdrop = Utils.Node.stopPropagation(this.backdrop);
        this.node.stopAllActions();
        this.node.setScale(0.3);
        this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
        var test = CommonSend.getListEvent();
        Linker.Socket.send(test);


        var test1 = CommonSend.getListAvatar();
        Linker.Socket.send(test1);
        if(cc.find("Loading")) cc.find("Loading").active = true;
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
    start() {
        this.addSocketEvent();
    },
    addSocketEvent() {
        Linker.Event.addEventListener(57, this.onGetListEvent, this);
        Linker.Event.addEventListener(58, this.onDetailEvent, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(57, this.onGetListEvent, this);
        Linker.Event.removeEventListener(58, this.onDetailEvent, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onGetListEvent(message) {
        if (message.status == 1) {
            this.createListEvent(message.listEvent);
        }
        if(cc.find("Loading")) cc.find("Loading").active = false;
    },
    createListEvent(data) {
        this.listEvent.removeAllChildren();
        data.forEach(element => {
            var item = cc.instantiate(this.itemEvent);
            var ItemEvent = item.getComponent(require('ItemEvent'));
            item.data = element;
            if (ItemEvent) {
                ItemEvent.init();
            }
            this.listEvent.addChild(item);
        });
    },
    onDetailEvent(message) {
        if (message.status == 1) {
            this.detailEvent.getComponent(cc.Label).string = this.title+"\n\n"+message.detailEvent;
        }
    },
    itemClick(event) {
        this.id = event.target.data.id;
        this.title = event.target.data.title;
        var test = CommonSend.detailEvent(this.id);
        Linker.Socket.send(test);
    }
    // update (dt) {},
});
