var Linker = require('Linker');
var constantSukienDialog = require("constantSukienDialog");
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        stt: cc.Label,
        accName: cc.Label,
        gameName: cc.Label,
        roomId: cc.Label,
        bonusReason: cc.Label,
        bonusTotal: cc.Label,
        time: cc.Label,
        bgHeadingFrame: cc.SpriteFrame,
        bgContentFrame: cc.SpriteFrame,
        bgItemSprite: cc.Sprite
    },
    onLoad() { },

    start() {

    },
    setAccName(name) {
        this.accName.string = name;
    },
    setTime(time) {
        this.time.string = time;
    },
    setStt(stt) {
        this.stt.string = stt;
    },
    setGameName(gn) {
        this.gameName.string = gn;
    },
    setRoomId(rid) {
        this.roomId.string = Utils.Malicious.moneyWithFormat(rid, ".");
    },
    setBonusReason(bnr) {
        this.bonusReason.string = bnr;
    },
    setTotalBonus(tbn) {
        this.bonusTotal.string = Utils.Malicious.moneyWithFormat(tbn, ".");
    },
    setHeadingBackgroundType() {
        this.bgItemSprite.spriteFrame = this.bgHeadingFrame;
    },
    setContentBackgroundType() {
        this.bgItemSprite.spriteFrame = this.bgContentFrame;
    }
});
