var TQUtils = require('TQUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        textRank: cc.Label,
        textUserName: cc.Label,
        textRankData: cc.Label,
        avatarSpriteAtlas: cc.SpriteAtlas,
        avatarSprite: cc.Sprite,
        rankSprite: cc.Sprite,
        rankSpriteFrame: [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    init() {
        var data = this.node.data;
        if (data) {
            if (data.pos <= 2 && !data.isMe) {
                this.textRank.node.active = false;
                this.rankSprite.spriteFrame = this.rankSpriteFrame[Number(data.pos)];
            } else {
                this.rankSprite.node.active = false;
                this.textRank.string = (data.isMe) ? data.currRank : data.pos + 1;
            }
            var spriteFrameAvatar = this.avatarSpriteAtlas.getSpriteFrame("avatar (" + data.avatarID + ")");
            if (!spriteFrameAvatar) {
                spriteFrameAvatar = this.avatarSpriteAtlas.getSpriteFrame("avatar (1)");
            }
            this.textUserName.string = data.userName;
            this.avatarSprite.spriteFrame = spriteFrameAvatar //tu avatarID => get this.ava
            this.textRankData.string = TQUtils.abbreviate(data.rank);
        }
    }

    // update (dt) {},
});