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
        historyContent: cc.Node,
        itemHistory: cc.Prefab,

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
        Linker.BonusHistoryTab = this;
        this.MaxPage = 1;
        this.CurrentPage = 1;

        var self = this;
        // this.node.on(cc.Node.EventType.TOUCH_END, () => {
        //     //self.node.active = false;
        // }, this);
        this.addSocketEvent();
        this.resetAllButton();

    },

    onEnable: function () {
        this.setActiveDateButton();
        // this.stopPropagationOnBackdrop = Utils.Node.stopPropagation(this.backdrop);
        // this.node.stopAllActions();
        // this.node.setScale(0.3);
        // this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
        var test = CommonSend.getOrderHistory(this.CurrentPage);
        Linker.Socket.send(test);
        
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
        // this.addSocketEvent();
    },
    addSocketEvent() {
        Linker.Event.addEventListener(400007, this.onGetListHistoryBonus, this);
        Linker.Event.addEventListener(400006, this.onCancelBonus, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(400007, this.onGetListHistoryBonus, this);
        Linker.Event.removeEventListener(400006, this.onCancelBonus, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onGetListHistoryBonus(message) {
        if (message.status == 1) {
            this.createListHistoryBonus(message.bonus);
        }
    },
    onCancelBonus(message) {
        if (message.status ==1) {
            cc.Global.showMessage(message.message);
            var test = CommonSend.getOrderHistory(1);
            Linker.Socket.send(test);
        } else {
            cc.Global.showMessage(message.message);
        }
    },
    createListHistoryBonus(listHistory) {
        this.historyContent.removeAllChildren();
        listHistory.forEach((item, pos) => {
            if(item.id){
                var history = cc.instantiate(this.itemHistory);
                this.historyContent.addChild(history);
                history.data = item;
                history.data.pos = pos + 1;
                var script = history.getComponent(require('ItemHistoryBonus'));
                if (script) {
                    script.init();
                }
            }
        })
    },
    hoanTraBtn(data) {
        //cc.log(data);
        var test = CommonSend.cancelOrder(data.id);
        Linker.Socket.send(test);
    },
    //add by zep
    nextDate: function (event) {
        if (this.CurrentPage > this.MaxPage) {
            this.CurrentPage -= 1;
        } else if (this.CurrentPage < 1) {
            this.CurrentPage = 1;
        }
        var test1 = CommonSend.getOrderHistory(this.CurrentPage);
        Linker.Socket.send(test1);
        if (cc.find("Loading")) cc.find("Loading").active = true;
        this.reorderNumberDate();
        this.setActiveDateButton();
    },
    prevDate: function (event) {
        this.CurrentPage += 1;
        var test1 = CommonSend.getOrderHistory(this.CurrentPage);
        Linker.Socket.send(test1);
        if (cc.find("Loading")) cc.find("Loading").active = true;
        this.reorderNumberDate();
        this.setActiveDateButton();
    },
    getDate: function (number) {
        var test1 = CommonSend.getOrderHistory(number);
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
            // this[buttonName].spriteFrame = this.onDateButtonSpriteFrame;
            // this[buttonNode].color = cc.color("#3D200C");
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
                // this[buttonNode].color = cc.color("#FFFF00");
            } else {
                this[buttonName].spriteFrame = this.offDateButtonSpriteFrame;
                // this[buttonNode].color = cc.color("#FFFFFF");
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
