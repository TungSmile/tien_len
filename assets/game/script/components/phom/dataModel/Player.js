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

cc.Class({
    ctor() {
        this.point = 0;
        this.isHaPhom = 0;
        this.isTai = 0;
        this.isMom = 0;
        this.needHaPhom = 0;
        this.isWin = 0;
        this.rank = 0;
        this.takenCount = 0;
        this.timeResume = 20;
        this.userId;
        this.viewName = "zeptest";
        this.userMoney = 0;
        this.state = 0;
        this.isMaster = 0;
        this.isOut = 0;
        this.exp = 0;
        this.avatarId = "1";
        this.isReady = 0;
        this.isObserver = 0;
        this.level = 1;
        this.levelUpMoney = 0;
        this.phomList = [];
        this.takenCardList = [];
        this.turnedCardList = [];
        this.cardOwnerList = [];
        
    },
    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    
    },

    start() {

    },
    create(data) {
        
    },
    resetPlayer() {
        this.point = 0;
        this.isHaPhom = 0;
        this.isTai = 0;
        this.isMom = 0;
        this.needHaPhom = 0;
        this.isWin = 0;
        this.rank = 0;
        this.takenCount = 0;
        this.timeResume = 20;
        this.userId;
        this.viewName = "zeptest";
        this.userMoney = 0;
        this.state = 0;
        this.isMaster = 0;
        this.isOut = 0;
        this.exp = 0;
        this.avatarId = "1";
        this.phomList = [];
        this.takenCardList = [];
        this.turnedCardList = [];
        this.cardOwnerList = [];
    }

    // update (dt) {},
});
