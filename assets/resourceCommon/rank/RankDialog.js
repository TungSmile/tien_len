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
var Constant = require('Constant');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        // textRankType: cc.Label,
        listRank: cc.Node,
        itemRank: [cc.Prefab],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //self.node.active = false;
        }, this);
        this.addSocketEvent();
    },
    onEnable: function () {
        // this.stopPropagationOnBackdrop = Utils.Node.stopPropagation(this.backdrop);
        this.node.active = true;
        // this.textRankType.string = "Tiền";

        if(Linker.RankData && Linker.RankData.listRank != null){
            this.createListRank(Linker.RankData.listRank);
        }else{
            var test1 = CommonSend.getLeaderboard(1);
            Linker.Socket.send(test1);
            cc.Global.showLoading();
        }
        
    },

    onDisable: function () {
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
    },
    closeBtnClick() {
        NewAudioManager.playClick();
        // var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        // customEvent.toggle = this.node.getComponent(cc.Toggle);
        // this.node.dispatchEvent(customEvent);
        this.node.active = false;
    },
    start() {
        // this.addSocketEvent();
    },
    addSocketEvent() {
        Linker.Event.addEventListener(1208, this.onGetListRank, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(1208, this.onGetListRank, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    
    customListRank(data) {
        if (data && data.length > 0 && data[0].userId == Linker.userData.userId) {
            if (Number(data[0].currRank) > data.length) {
                data[0].isMe = true;
                data.push(data[0]);
                data.shift();
            } else if (Number(data[0].currRank) > 0) {
                data.shift();
            }
            return data;
        }   
        return data;     
    },

    onGetListRank(message) {
        if (message.status == 1) {
            if(Linker.RankData && Linker.RankData.listRank == null){
                var listRank = this.customListRank(message.listRank);
                Linker.RankData.listRank = listRank;
                this.createListRank(listRank);
            }
        }else{
            Linker.RankData.listRank = null;
        }
        cc.Global.hideLoading();
    },

    createListRank(array) {
        this.listRank.removeAllChildren();
        array.forEach((element, pos) => {
            var item;
            // if (pos < 3) {
            //     item = cc.instantiate(this.itemRank[pos]);
            // } else {
            //     item = cc.instantiate(this.itemRank[3]);
            // }
            item = cc.instantiate(this.itemRank[0]);
            var ItemRankHome = item.getComponent(require('ItemRankHome'));
            const ItemRankAvatar = item.getComponent(require('ItemRankAvatar'));
            item.data = element;
            item.data.pos = pos;
            if (ItemRankHome) {
                ItemRankHome.init();
            } else if (ItemRankAvatar) {
                ItemRankAvatar.init();
            }
            this.listRank.addChild(item);
        });
    },

    clickBtnBack () {
        const customEvent = new cc.Event.EventCustom("openRankAvatar", true);
        this.node.dispatchEvent(customEvent);
    },
    
    clickBtnOpen () {
        const customEvent = new cc.Event.EventCustom("openRankDiaLog", true);
        this.node.dispatchEvent(customEvent);
    }
    // update (dt) {},
});
