var Utils = require('Utils');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    ctor() {
        this.isMaster = false;
        this.userId = 0;
        this.side = false;
    },

    properties: {
        namePlayer: cc.Label,
        moneyPlayer: cc.Label,
        flagPlayer: cc.Node,
        iconKey: cc.Node,
        pointPlayer: cc.Label,
        userAvatarSprite: cc.Sprite,
        userAvatarSpriteAtlas: cc.SpriteAtlas,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {

    },

    setInfoPlayer(data, side = false) {
        cc.log(data);
        this.side = side;
        this.userId = Number(data.userId);
        this.setName(data.viewName);
        this.setMoney(data.userMoney);
        this.setIsMaster(data.isMaster);
        this.setUserAvatar(data.avatarId);
    },

    setName(name) {
        this.namePlayer.string = name;
    },
    
    resetInfoPlayer () {
        this.setName("--");
        this.setMoney("--");
        this.setIsMaster(0);
        this.hideAvatar();
    },

    setMoney(money) {
        this.moneyPlayer.string = Utils.Malicious.moneyWithFormat(money, ".");
    },

    setPoint(point) {
        this.pointPlayer.string = point;
    },

    setIsMaster(status = 0) {
        this.isMaster = status;
    },

    getIsMaster () {
        return this.isMaster;
    },

    onAvatarClick: function () {
        if (!!this.userId) {
            var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_PROFILE_USER, true);
            customEvent.userId = Number(this.userId);
            this.node.dispatchEvent(customEvent);
        }
    },

    setUserAvatar: function (avatarId) {
        avatarId = Number(avatarId);
        this.avatarId = avatarId;
        var frame = this.userAvatarSpriteAtlas.getSpriteFrame("avatar (" + avatarId + ")");
        if (!frame) {
            var frames = this.userAvatarSpriteAtlas.getSpriteFrames();
            if (frames && Array.isArray(frames) && frames.length > 0) {
                frame = frames[0];
            }
        }
        if (frame) {
            this.userAvatarSprite.spriteFrame = frame;
            this.userAvatarSprite.node.active = true;
        }
    },

    hideAvatar () {
        this.userAvatarSprite.node.active = false;
    },

    getAvatarSpriteFrame: function () {
        return this.userAvatarSprite.spriteFrame;
    },
    // setName (name) {
    //     this.namePlayer.string = name;
    // },
    // update (dt) {},
});
