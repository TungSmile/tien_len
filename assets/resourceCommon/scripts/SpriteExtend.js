// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Sprite,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // update (dt) {},

    setFillRange(range) {
        if (cc.js.isNumber(range)) {
            if (this.type == cc.Sprite.Type.FILLED) {
                this.fillRange = Number(range);
            }
        } else {
            if (range instanceof cc.Slider) {
                this.fillRange = range.progress;
            }
        }
    }
});