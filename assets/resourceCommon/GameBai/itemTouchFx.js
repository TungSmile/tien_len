// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export var itemTouchFx = cc.Class({
    extends: cc.Component,

    properties: {
        particleSystem: cc.ParticleSystem
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    RunAnimation(sprite = null) {
        if (sprite) {
            this.node.getComponent(cc.Sprite).spriteFrame = sprite;
            this.particleSystem.spriteFrame = sprite;
        }
        cc.tween(this.node).set({scale: 0.75, opacity: 255}).to(0.5, {scale: 1.75, opacity: 0}, {easing: "fade"}).call((target) => {
            target.destroy();
        }).start();
    }
});
