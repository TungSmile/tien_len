

cc.Class({
    extends: cc.Component,

    properties: {
        avatarSpriteAtlas: cc.SpriteAtlas,
        avatarSprite: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init() {
        var data = this.node.data;
        const id = data.avatarID;
        var frame = this.avatarSpriteAtlas.getSpriteFrame("avatar (" + id + ")");
        if (!frame) {
            frame = this.avatarSpriteAtlas.getSpriteFrame("avatar (1)");
        }
        this.avatarSprite.spriteFrame = frame;
        
    }
    // update (dt) {},
});
