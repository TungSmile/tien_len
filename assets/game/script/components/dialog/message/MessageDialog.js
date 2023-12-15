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
        listEvent: cc.Node,
        detailEvent: cc.Node,
        itemEvent: cc.Prefab,
        pageContainer: cc.Node,
        scrollView: cc.ScrollView,
        pageHandler: PageHandler,
        noMessageNode: cc.Node,

        date1TextNodeButton: cc.Node,
        date2TextNodeButton: cc.Node,
        date3TextNodeButton: cc.Node,
        date4TextNodeButton: cc.Node,
        date5TextNodeButton: cc.Node,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.MessageDialog = this;
        this.initMessage();
        this.addSocketEvent();
    },
    initMessage: function (listMail) {
        if (listMail) {
            var page = this.createListMessage(listMail);
            return page;
        } else {
            this.listEvent.removeAllChildren();
            this.detailEvent.getComponent(cc.Label).string = "";
            return null;
        }
    },
    onEnable: function () {
        this.sendGetListMail();

    },
    sendGetListMail: function () {
        if (!this.currentPageIndex) {
            this.currentPageIndex = 1;
        }
        var test1 = CommonSend.getListMail(this.currentPageIndex);
        Linker.Socket.send(test1);
    },
    onDisable: function () {
        this.hideLisMessage();
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
        this.pageContainer.removeAllChildren(true);
        this.scrollView.content = this.listEvent;
        this.currentPageIndex = 1;
    },
    closeBtnClick() {
        NewAudioManager.playClick();
        this.node.active = false;
    },
    start() {
        // this.addSocketEvent();

    },
    addSocketEvent() {
        Linker.Event.addEventListener(400002, this.onGetListMessage, this);
        Linker.Event.addEventListener(400003, this.onDetailMessage, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(400002, this.onGetListMessage, this);
        Linker.Event.removeEventListener(400003, this.onDetailMessage, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    createListMessage(data) {
        var page = cc.instantiate(this.listEvent);
        data.forEach(element => {
            var item = cc.instantiate(this.itemEvent);
            var ItemEvent = item.getComponent(require('ItemMessage'));
            item.data = element;
            if (ItemEvent) {
                ItemEvent.init();
            }
            page.addChild(item);
        });
        return page;
    },
    showListMessage: function (page) {
        page.active = true;
        if (this.prevPage) {
            this.prevPage.active = false;
        }
        this.scrollView.content = page;
        this.scrollView.getComponent("scrollOptimizeH").mainContent = page;
        //show first mail

        if (page.children.length > 0) {
            var target = page.children[0];
            var event = {
                target: target
            };
            this.itemClick(event);
        }
    },
    hideLisMessage: function () {
        this.listEvent.active = false;
    },
    onDetailMessage(message) {
        if (message.status == 1) {
            this.detailEvent.getComponent(cc.Label).string = this.title + "\n\n" + message.content + "\n" + this.date;
        }
        if (cc.find("Loading")) cc.find("Loading").active = false;
    },
    itemClick(event) {
        NewAudioManager.playClick();
        if (Number(event.target.data.isRead) !== 1) {
            cc.Global.unSeenMail -= 1;
            event.target.color = cc.Color.WHITE;
            BiDaConstant.METHODS.createListenerNode().emit("initMailInfo", {});
            event.target.getComponent("ItemMessage").seen(true);
        }
        this.node.emit("clickItem", event);
        this.id = event.target.data.id;
        this.date = event.target.data.time;
        this.title = event.target.data.title;
        var test = CommonSend.readMail(this.id);
        Linker.Socket.send(test);
        if (cc.find("Loading")) cc.find("Loading").active = true;
    },
    onGetListMessage(message) {
        if (message.status == 1) {
            //get mail list
            if (message.listMail && message.listMail.length > 0) {
                this.noMessageNode.active = false;
                var page = this.initMessage(message.listMail);
                this.pageContainer.addChild(page);
                this.prevPage = this.currentPage;
                this.currentPage = page;
                this.showListMessage(this.currentPage);
            } else {
                if (this.currentPage && cc.isValid(this.currentPage)) {
                    this.currentPage.active = false;
                }
                this.detailEvent.getComponent(cc.Label).string = "";
                this.noMessageNode.active = true;
            }
        }
    },

    onClickNexPage(event) {
        NewAudioManager.playClick();
        var test1 = CommonSend.getListMail(++this.currentPageIndex);
        Linker.Socket.send(test1);
    },

    onClickPrevPage(event) {
        NewAudioManager.playClick();
        if (this.currentPageIndex > 1) {
            var data = CommonSend.getListMail(--this.currentPageIndex);
            Linker.Socket.send(data);
        }

    },

    dateClick: function (event) {
        NewAudioManager.playClick();
        var ctarget = event.currentTarget;
        var name = ctarget.name;
        switch (name) {
            case "d1":
                var page = Number(this.date1TextNodeButton.getComponent(cc.Label).string);
                this.currentPageIndex = page;
                break;

            case "d2":

                var page = Number(this.date2TextNodeButton.getComponent(cc.Label).string);
                this.currentPageIndex = page;
                break;
            case "d3":
                var page = Number(this.date3TextNodeButton.getComponent(cc.Label).string);
                this.currentPageIndex = page;

                break;
            case "d4":
                var page = Number(this.date4TextNodeButton.getComponent(cc.Label).string);
                this.currentPageIndex = page;

                break;
            case "d5":
                var page = Number(this.date5TextNodeButton.getComponent(cc.Label).string);
                this.currentPageIndex = page;

                break;
            default:
                break;
        }
        var data = CommonSend.getListMail(this.currentPageIndex);
        Linker.Socket.send(data);
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