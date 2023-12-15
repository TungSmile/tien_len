var Utils = require('Utils');
var Linker = require('Linker');
var Constant = require('Constant');
var NewAudioManager = require("NewAudioManager");
var DataAccess = require('DataAccess');
cc.Class({
    extends: cc.Component,

    properties: {
        iconFrameSprites: [cc.SpriteFrame],
        avatarSprite: cc.Sprite,
        levelSprite: cc.Sprite,
        levelLabel: cc.Label,
        iconLevelSprite: cc.Sprite,
        avatarSpriteSheet: cc.SpriteAtlas
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        DataAccess.Instance.node.on("update-user-data", this.onUpdateUserData, this);
    },
    onEnable: function () {
        if (Linker && Linker.userData) {
            // this.setUserMoney();
            // this.setUserName();
            this.setUserLevel();
            // this.setMoneyTypeActive();
            this.setUserAvatar();
            // this.configShowHideButton();
            // this.checkNotitication();
            // this.checkZoneShowHu();
        }
    },
    onUpdateUserData: function (message) {
        if (message.userId == Linker.userData.userId) {
            Linker.userData.userRealMoney = message.userRealMoney;
            // this.setUserMoney();
            // this.setUserName();
            this.setUserLevel();
        }
    },
    setUserAvatar: function () {
        if (Linker.userData) {
            var avatarId = Linker.userData.avatar;
            var frame = this.avatarSpriteSheet.getSpriteFrame("avatar (" + avatarId + ")");
            if (frame) {
                this.avatarSprite.spriteFrame = frame;
            }
        }
    },
    setUserLevel: function () {
        if (Linker.userData) {
            var exp = Linker.userData.userExp;
            exp = Number(exp);
            exp = (isNaN(exp) == false) ? exp : 0;
            // var levelObj = Utils.Malicious.getLevelRankingByExp(exp);
            // var maxRank = levelObj.maxRank;
            // var level = levelObj.level;
            var data = Utils.Malicious.getLevelByExp(exp);
            var level = data.level;
            var maxRank = 100;
            //max level 30;
            var levelPercent = (level * 100) / maxRank;
            var fillRange = (levelPercent / 100);
            fillRange = fillRange >= 1 ? 1 : fillRange <= 0 ? 0 : fillRange;
            var levelString = levelPercent;
            var levelString = level;
            this.levelLabel.string = levelString;
            this.levelSprite.fillRange = fillRange;
            //max level
            var maxSpriteIconLength = this.iconFrameSprites.length;
            if (maxSpriteIconLength > 0) {
                var index = maxSpriteIconLength * level / maxRank;
                index = Math.floor(index);
                if (index >= 0 && index < maxSpriteIconLength) {
                    this.iconLevelSprite.spriteFrame = this.iconFrameSprites[index];
                } else {
                    this.iconLevelSprite.spriteFrame = this.iconFrameSprites[0];
                }
            }
        }

    },
    start() {

    },

    // update (dt) {},
});
