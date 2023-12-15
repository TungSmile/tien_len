// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export var Gift = cc.Class({
    extends: cc.Component,

    properties: {
        particleSystem: cc.ParticleSystem,
        ID: cc.Integer
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    RunAnimation() {
        var animation = this.node.getComponent(cc.Animation);
        if (animation.getClips().length > 0) {
            animation.play();
        } else {
            cc.tween(this.node).delay(1).call(target => target.destroy()).start();
        }
    },

    OnAnimationEnd() {
        this.node.destroy();
    },

    OnAnimationDelayEnd() {
        cc.tween(this.node).delay(2).call(target => target.destroy()).start();
    }
});
