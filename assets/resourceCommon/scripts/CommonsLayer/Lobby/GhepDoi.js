var Linker = require("Linker");
var Constant = require("Constant");
const i18n = require("../../../../i18n/i18n");

cc.Class({
    extends: cc.Component,

    properties: {
        listAvatar: [cc.SpriteFrame],
        ghepdoiSoccer: cc.Prefab,
        ghepdoiHeadball: cc.Prefab,
        ghepdoiBida: cc.Prefab,
        ghepdoiShooting: cc.Prefab,
        ghepdoiPhiDao: cc.Prefab,
        ghepdoiFootball: cc.Prefab,
        avatarAtlas: cc.SpriteAtlas
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.index = 0;
        this.addSocketEvent();
    },
    addSocketEvent: function () {
        Linker.Event.addEventListener(12021, this.OnMatchMakingResponse, this);
    },
    removeSocketEvent: function () {
        Linker.Event.removeEventListener(12021, this.OnMatchMakingResponse, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    OnMatchMakingResponse: function (message) {
        if (this && cc.isValid(this)) {
            if (message && message.status == 1) {
                if (Number(message.type) == 1) {

                } else if (Number(message.type) == 0) {

                } else if (Number(message.type) == -1) {

                } else if (Number(message.type) == -2) { // Không hủy đc

                } else if (Number(message.type) == 2) { // Đang hủy, vui lòng chờ

                } else if (Number(message.type) == 3) { // Hủy thành công
                    this.unschedule(this.timeOutNotification);
                } else if (Number(message.type) == -4) {
                    this.unschedule(this.timeOutNotification);
                }
            }
        }
    },
    onEnable() {
        //this.randomAvatar();
    },
    start() {

    },
    // update (dt) {},
    init: function (data) {
        this.node.active = true;
        if (data) {
            this.data = data;
        }
        var game;
        this.node.removeAllChildren(true);
        switch (Linker.ZONE) {
            case Constant.ZONE_ID.SOCCER_GALAXY_1VS1:
                game = cc.instantiate(this.ghepdoiSoccer);
                game.active = true;
                this.node.addChild(game);
                break;
            case Constant.ZONE_ID.HEAD_BALL_1VS1:
                game = cc.instantiate(this.ghepdoiHeadball);
                game.active = true;
                this.node.addChild(game);
                break;
            case Constant.ZONE_ID.BAN_SUNG:
                game = cc.instantiate(this.ghepdoiShooting);
                game.active = true;
                this.node.addChild(game);
                break;
            case Constant.ZONE_ID.PHI_DAO:
                game = cc.instantiate(this.ghepdoiPhiDao);
                game.active = true;
                this.node.addChild(game);
                break;
            case Constant.ZONE_ID.BIDA_1VS1:
                game = cc.instantiate(this.ghepdoiBida);
                game.active = true;
                this.node.addChild(game);
                break;
            case Constant.ZONE_ID.FOOTBALL_1VS1:
                game = cc.instantiate(this.ghepdoiFootball);
                game.active = true;
                this.node.addChild(game);
                break;
        }
        var MatchItemComponent = game.getComponent("MatchItem");
        if (MatchItemComponent) {
            MatchItemComponent.setMyPlyerInfo(Linker.userData);
            if (this.data) {
                MatchItemComponent.initInfoTable(this.data);
            }
            this.randomAvatar();
        }
        this.unscheduleAllCallbacks();
        this.unschedule(this.timeOutNotification);
        this.scheduleOnce(this.timeOutNotification, 15);//15s tu dong huy
    },
    timeOutNotification: function () {
        if (this && cc.isValid(this) && this.node && cc.isValid(this.node)) {
            for (var i = 0; i < this.node.children.length; i++) {
                var matchItem = this.node.children[i];
                if (matchItem) {
                    var matchItemComponent = matchItem.getComponent("MatchItem");
                    if (matchItemComponent && cc.isValid(matchItemComponent)) {
                        matchItemComponent.unschedule(matchItemComponent.timeOutNotification);
                        matchItemComponent.stopRunningPlayer();
                        matchItemComponent.showContinueGhepDoi();
                        break;
                    }
                }
            }
            if ((!Linker.CURRENT_TABLE) || (Linker.CURRENT_TABLE && isNaN(Number(Linker.CURRENT_TABLE.tableId)) == false && Number(Linker.CURRENT_TABLE.tableId) == 0)) {
                cc.Global.showMessage(i18n.t("game_invite_busy"));
            }
        }
    },
    setAvatar: function () {
        this.avatar.spriteFrame = this.listAvatar[this.index];
        ++this.index;
    },
    randomAvatar: function () {
        this.avatar = this.getAvatarRight();
        if (this.avatar) {
            this.schedule(this.setAvatar, 0.5);
        }
    },
    stopRandomAvatar: function () {
        this.unschedule(this.setAvatar);
    },
    getAvatarRight: function () {
        return this.node.children[0].getComponent("MatchItem").getAvatarRight();
    },

});
