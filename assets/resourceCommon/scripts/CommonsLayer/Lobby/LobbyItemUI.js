cc.Class({
    extends: cc.Component,

    properties: {
        lobbySoccerAtlas: cc.SpriteAtlas
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.isStarted = true;
        if (this.data) {
            if (this.lobbySoccerAtlas && cc.isValid(this.lobbySoccerAtlas)) {
            }
        }
    },
    init: function (data) {
        if (data) {
            this.data = data;
        } else {
            this.data = null;
        }
    }
    // update (dt) {},
});
