// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Linker = require('Linker')
cc.Class({
    extends: cc.Component,

    properties: {
        listItem: [cc.SpriteFrame],
        image: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.size = cc.v2(160, 160);
    },

    start() {

    },
    setType(type, id) {
        this.type = type;
        this.id = id;
        switch (id) {
            case 0:
                {
                    this.image.spriteFrame = this.listItem[0];
                    break;
                }
            case 1:
                {
                    this.image.spriteFrame = this.listItem[1];
                    break;
                }
            case 2:
                {
                    this.image.spriteFrame = this.listItem[2];
                    break;
                }
            case 3:
                {
                    this.image.spriteFrame = this.listItem[3];
                    break;
                }
            case 4:
                {
                    this.image.spriteFrame = this.listItem[4];
                    break;
                }
            case 5:
                {
                    this.image.spriteFrame = this.listItem[5];
                    break;
                }
            case 6:
                {
                    this.image.spriteFrame = this.listItem[6];
                    break;
                }
        }

    },
    playEffect() {
        this.node.scale = 1;
        this.node.stopAllActions();
        var action = cc.sequence(cc.scaleTo(0.2, 1.2,0.8), cc.scaleTo(0.2, 0.8,1.2));
        this.node.runAction(cc.repeatForever(action));
    },
    
    playEffectThuyCung() {
        this.node.scale = 1;
        this.node.stopAllActions();
        var action = cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 0.8),cc.rotateBy(0.25,30),cc.rotateBy(0.25,-60),cc.rotateBy(0.25,30));
        this.node.runAction(cc.repeatForever(action));
    },

    playEffectNew() {
        this.node.scale = 1;
        this.node.stopAllActions();
        var action = cc.sequence(cc.rotateBy(0.4,20), cc.rotateBy(0.4,-40), cc.rotateBy(0.3,-360));
        var action2 = cc.sequence(cc.scaleTo(0.2, 1.1,0.9), cc.scaleTo(0.2, 0.9,1.1),cc.scaleTo(0.2, 1.1,0.9), cc.scaleTo(0.2, 0.9,1.1));
        this.node.runAction(cc.repeatForever(action));
        this.node.runAction(cc.repeatForever(action2));
    },
    stopEffect() {
        this.node.rotation=0;
        this.node.scale = 1;
        this.node.stopAllActions();
    }

    // update (dt) {},
});