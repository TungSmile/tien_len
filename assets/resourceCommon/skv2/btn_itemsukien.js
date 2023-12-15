var constantSukienDialog = require("constantSukienDialog");
var NewAudioManager = require("NewAudioManager");
cc.Class({
    extends: cc.Component,
    properties: {
        //sprite frame tai xiu button
        taiXiuEventGame: cc.SpriteFrame,
        gameBaiEventGame: cc.SpriteFrame,
        taThanEventGame: cc.SpriteFrame,
        thuyCungEventGame: cc.SpriteFrame,
        thinhKinhEventGame: cc.SpriteFrame,
        longThanEventGame: cc.SpriteFrame,
        luckyDayEventGame: cc.SpriteFrame,
        defaultEventGame: cc.SpriteFrame,
        parrentNode: cc.Node,
        btnSprite: cc.Sprite,
        btnLabel: cc.Label,
        btnOn: cc.SpriteFrame,
        btnOff: cc.SpriteFrame,
    },
    onLoad() {

    },

    start() {

    },
    changetoOnStatus: function () {
        this.btnSprite.spriteFrame = this.btnOn;
        this.parrentNode.width = 200;
        this.parrentNode.height = 65;
    },
    changetoOffStatus: function () {
        this.btnSprite.spriteFrame = this.btnOff;
        this.parrentNode.width = 200;
        this.parrentNode.height = 65;
    },
    setIDEvent: function (id) {
        this.idevent = id;
    },
    getIDEvent: function (id) {
        return this.idevent;
    },
    setFrameAsGameID: function (name) {        
        var fr = null;
        var btnTxt = null;
        switch (this.idevent) {
            case constantSukienDialog.taiXiuID:
                this.btnSprite.enabled = true;
                // this.btnLabel.enabled = false;
                fr = this.taiXiuEventGame;
                btnTxt = (name) ? name :  "Tài Xỉu";
                break;
            case constantSukienDialog.gameBaiID:
                this.btnSprite.enabled = true;
                // this.btnLabel.enabled = false;
                fr = this.gameBaiEventGame;
                btnTxt = (name) ? name : "Game Bài";
                break;
            case constantSukienDialog.taThanID:
                this.btnSprite.enabled = true;
                // this.btnLabel.enabled = false;
                fr = this.taThanEventGame;
                btnTxt = (name) ? name : "Tà Thần";
                break;
            case constantSukienDialog.thuyCungID:
                this.btnSprite.enabled = true;
                // this.btnLabel.enabled = false;
                fr = this.thuyCungEventGame;
                btnTxt = (name) ? name : "Thủy Cung";
                break;
            case constantSukienDialog.thinhKinhID:
                this.btnSprite.enabled = true;
                // this.btnLabel.enabled = false;
                fr = this.thinhKinhEventGame;
                btnTxt = (name) ? name : "Thỉnh Kinh";
                break;
            case constantSukienDialog.longThanID:
                this.btnSprite.enabled = true;
                // this.btnLabel.enabled = false;
                fr = this.longThanEventGame;
                btnTxt = (name) ? name : "Long Thần";
                break;
            case constantSukienDialog.luckyDayID:
                this.btnSprite.enabled = true;
                // this.btnLabel.enabled = false;
                fr = this.luckyDayEventGame;
                btnTxt = (name) ? name : "Lucky Day";
                break;
            default:
                fr = this.defaultEventGame;
                this.btnSprite.enabled = true;
                // this.btnLabel.enabled = true;
                btnTxt = (name) ? name : "Default";
                break;

        }
        // this.btnSprite.spriteFrame = fr;
        this.btnLabel.string = btnTxt;
    },
    configDispatchEvent: function () {
        this.taiXiuDispatchEvent = new cc.Event.EventCustom("EVENT_TAI_XIU", true);
        this.gameBaiDispatchEvent = new cc.Event.EventCustom("EVENT_GAME_BAI", true);
        this.taThanDispatchEvent = new cc.Event.EventCustom("EVENT_TA_THAN", true);
        this.thinhKinhDispatchEvent = new cc.Event.EventCustom("EVENT_THINH_KINH", true);
        this.thuyCungDispatchEvent = new cc.Event.EventCustom("EVENT_THUY_CUNG", true);
        this.longThanDispatchEvent = new cc.Event.EventCustom("EVENT_LONG_THAN", true);
        this.longThanDispatchEvent = new cc.Event.EventCustom("EVENT_LONG_THAN", true);
        this.luckyDayDispatchEvent = new cc.Event.EventCustom("EVENT_LUCKY_DAY", true);
        this.anonymousDispatchEvent = new cc.Event.EventCustom("EVENT_ANONYMOUS", true);
    },
    dispatchEvent: function () {
        NewAudioManager.playClick();
        switch (this.idevent) {
            case constantSukienDialog.taiXiuID:
                this.parrentNode.dispatchEvent(this.taiXiuDispatchEvent);
                break;
            case constantSukienDialog.gameBaiID:
                this.parrentNode.dispatchEvent(this.gameBaiDispatchEvent);
                break;
            case constantSukienDialog.taThanID:
                this.parrentNode.dispatchEvent(this.taThanDispatchEvent);
                break;
            case constantSukienDialog.thuyCungID:
                this.parrentNode.dispatchEvent(this.thuyCungDispatchEvent);
                break;
            case constantSukienDialog.thinhKinhID:
                this.parrentNode.dispatchEvent(this.thinhKinhDispatchEvent);
                break;
            case constantSukienDialog.longThanID:
                this.parrentNode.dispatchEvent(this.longThanDispatchEvent);
                break;
            case constantSukienDialog.luckyDayID:
                this.parrentNode.dispatchEvent(this.luckyDayDispatchEvent);
                break;
            default:
                this.anonymousDispatchEvent.idevent = this.getIDEvent();
                this.parrentNode.dispatchEvent(this.anonymousDispatchEvent);
                break;

        }
    },


    // update (dt) {},
});
