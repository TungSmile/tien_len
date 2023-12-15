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
        listHistory: cc.Node,
        itemHistory: cc.Prefab,
        scrollView: cc.ScrollView,

        date1Sprite: cc.Sprite,
        date2Sprite: cc.Sprite,
        date3Sprite: cc.Sprite,
        date4Sprite: cc.Sprite,
        date5Sprite: cc.Sprite,

        date1TextNodeButton: cc.Node,
        date2TextNodeButton: cc.Node,
        date3TextNodeButton: cc.Node,
        date4TextNodeButton: cc.Node,
        date5TextNodeButton: cc.Node,
        //
        onDateButtonSpriteFrame: cc.SpriteFrame,
        offDateButtonSpriteFrame: cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.HistoryTab = this;
        this.MaxPage = 1;
        this.CurrentPage = 1;
        this.resetAllButton();
        this.addSocketEvent();
    },
    onEnable() {
        this.setActiveDateButton();
        cc.Global.showLoading();
        var test1 = CommonSend.getHistory(this.CurrentPage, 1);
        Linker.Socket.send(test1);
    },
    start() {
        // this.addSocketEvent();
    },
    addSocketEvent() {
        Linker.Event.addEventListener(14003, this.onGetListHistory, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(14003, this.onGetListHistory, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onGetListHistory(message) {
        if (message.status == 1) {
            this.createListHistory(message.listHistory);
        }
        cc.Global.hideLoading();
    },
    createListHistory(array) {
        if (array[0]["matchId"] !== undefined) {
            Linker.HistoryTab.listHistory.removeAllChildren();
            array.forEach((element, pos) => {
                var item = cc.instantiate(Linker.HistoryTab.itemHistory);
                var ItemEvent = item.getComponent(require('ItemHistoryUser'));
                item.data = element;
                item.data.pos = pos;
                item.data.type = 1;
                if (ItemEvent) {
                    ItemEvent.init();
                }
                Linker.HistoryTab.listHistory.addChild(item);
            });
        }
    },
    clickEvent(event) {

    },
    nextDate: function (event) {
        if (this.CurrentPage > this.MaxPage) {
            this.CurrentPage -= 1;
        } else if (this.CurrentPage < 1) {
            this.CurrentPage = 1;
        }
        var test1 = CommonSend.getHistory(this.CurrentPage);
        Linker.Socket.send(test1);
        if (cc.find("Loading")) cc.find("Loading").active = true;
        this.reorderNumberDate();
        this.setActiveDateButton();
    },
    prevDate: function (event) {
        this.CurrentPage += 1;
        var test1 = CommonSend.getHistory(this.CurrentPage);
        Linker.Socket.send(test1);
        if (cc.find("Loading")) cc.find("Loading").active = true;
        this.reorderNumberDate();
        this.setActiveDateButton();
    },
    getDate: function (number) {
        var test1 = CommonSend.getHistory(number);
        Linker.Socket.send(test1);
        if (cc.find("Loading")) cc.find("Loading").active = true;
    },
    reorderNumberDate: function () {
        //o day phai set lai string hix
        if (this.CurrentPage % 5 == 0) {
            var j = this.CurrentPage;
            for (var i = 0, j; i < 5; i++) {
                var nameid = i + 1;
                var buttonNode = "date" + nameid + "TextNodeButton";
                this[buttonNode].getComponent("cc.Label").string = j.toString();
                j++;
            }
        } else if (this.CurrentPage < 5) {
            //khoang ban dau
            for (var i = 0; i < 5; i++) {
                var nameid = i + 1;
                var buttonNode = "date" + nameid + "TextNodeButton";
                this[buttonNode].getComponent("cc.Label").string = nameid.toString();
            }
        } else if (this.CurrentPage % 5 != 0) {
            var rangeValueData = this.getRangeValue();

            var indexArr = 0;
            for (var i = 0; i < rangeValueData.length; i++) {
                var nameid = indexArr + 1;
                var buttonNode = "date" + nameid + "TextNodeButton";
                this[buttonNode].getComponent("cc.Label").string = rangeValueData[i].toString();
                indexArr++;
            }
            
        }
    },
    getRangeValue: function () {
        var maxLimit = this.CurrentPage + 10;
        var minLimit = this.CurrentPage - 10;
        var range = {
            start: 0,
            end: 0
        };
        for (var i = this.CurrentPage; i > minLimit; i--) {
            if (i % 5 == 0) {
                range.start = i;
                break;
            }
        };
        for (var j = this.CurrentPage; j < maxLimit; j++) {
            if (j % 5 == 0) {
                range.end = j;
                break;
            }
        }
        var rangeVData = [];
        for(var k = range.start; k<range.end; k++){
            rangeVData.push(k);
        }
        return rangeVData;
    },
    resetAllButton: function () {
        for (var i = 0; i < 5; i++) {
            var nameid = i + 1;
            var buttonName = "date" + nameid + "Sprite";
            var buttonNode = "date" + nameid + "TextNodeButton";
            this[buttonName].spriteFrame = this.onDateButtonSpriteFrame;
            this[buttonNode].color = cc.color("#3D200C");
            this[buttonNode].getComponent("cc.Label").string = nameid;
        }
    },
    setActiveDateButton: function () {
        for (var i = 0; i < 5; i++) {
            var nameid = i + 1;
            var buttonName = "date" + nameid + "Sprite";
            var buttonNode = "date" + nameid + "TextNodeButton";
            var stringValue = Number(this[buttonNode].getComponent("cc.Label").string);
            if (stringValue == this.CurrentPage) {
                this[buttonName].spriteFrame = this.onDateButtonSpriteFrame;
                this[buttonNode].color = cc.color("#FFFF00");
            } else {
                this[buttonName].spriteFrame = this.offDateButtonSpriteFrame;
                this[buttonNode].color = cc.color("#3D200C");
            }
        }
    },
    dateClick: function (event) {
        var ctarget = event.currentTarget;
        var name = ctarget.name;
        switch (name) {
            case "d1":
                var page = Number(this.date1TextNodeButton.getComponent(cc.Label).string);
                this.CurrentPage = page;
                this.getDate(page);
                this.setActiveDateButton();
                break;

            case "d2":

                var page = Number(this.date2TextNodeButton.getComponent(cc.Label).string);
                this.CurrentPage = page;
                this.getDate(page);
                this.setActiveDateButton();
                break;
            case "d3":
                var page = Number(this.date3TextNodeButton.getComponent(cc.Label).string);
                this.CurrentPage = page;
                this.getDate(page);
                this.setActiveDateButton();

                break;
            case "d4":
                var page = Number(this.date4TextNodeButton.getComponent(cc.Label).string);
                this.CurrentPage = page;
                this.getDate(page);
                this.setActiveDateButton();

                break;
            case "d5":
                var page = Number(this.date5TextNodeButton.getComponent(cc.Label).string);
                this.CurrentPage = page;
                this.getDate(page);
                this.setActiveDateButton();

                break;
            default:
                break;
        }
    }
    // update (dt) {},
});
