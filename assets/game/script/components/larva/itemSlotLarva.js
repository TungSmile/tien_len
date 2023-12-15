cc.Class({
    extends: cc.Component,

    properties: {
        listItem: [cc.SpriteFrame],
        image: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.size = cc.v2(90, 90);
    },

    start() {

    },
    setType(type, id) {
        this.type = type;
        this.id = id;
        switch (id) {
            case 'E': {
                this.image.spriteFrame = this.listItem[1];
                // this.image.node.width=80;
                // this.image.node.height=80;
                break;
            }
            case 'C': {
                this.image.spriteFrame = this.listItem[2];
                // this.image.node.width=80;
                // this.image.node.height=80;
                break;
            }
            case 'D': {
                this.image.spriteFrame = this.listItem[3];
                // this.image.node.width=80;
                // this.image.node.height=80;
                break;
            }
            case 'B': {
                this.image.spriteFrame = this.listItem[4];
                // this.image.node.width=80;
                // this.image.node.height=80;
                break;
            }
            case 'A': {
                this.image.spriteFrame = this.listItem[5];
                // this.image.node.width=80;
                // this.image.node.height=80;
                break;
            }
            case 'W': {
                this.image.spriteFrame = this.listItem[6];
                this.image.node.width=80;
                this.image.node.height=80;
                break;
            }
            case 'X2': {
                this.image.spriteFrame = this.listItem[7];
                this.image.node.width=70;
                this.image.node.height=40;
                break;
            }
            case 'X3': {
                this.image.spriteFrame = this.listItem[8];
                this.image.node.width=70;
                this.image.node.height=40;
                break;
            }
            case 'X5': {
                this.image.spriteFrame = this.listItem[9];
                this.image.node.width=70;
                this.image.node.height=40;
                break;
            }
            case 'X10': {
                this.image.spriteFrame = this.listItem[10];
                this.image.node.width=80;
                this.image.node.height=40;
                break;
            }
            case 'X15': {
                this.image.spriteFrame = this.listItem[11];
                this.image.node.width=80;
                this.image.node.height=40;
                break;
            }
            case 'X100': {
                this.image.spriteFrame = this.listItem[12];
                this.image.node.width=80;
                this.image.node.height=40;
                break;
            }
        }

    },
    playEffect() {
        this.node.scale = 1;
        this.node.stopAllActions();
        var action = cc.sequence(cc.scaleTo(0.3, 1.1), cc.scaleTo(0.3, 1));
        this.node.runAction(cc.repeatForever(action));
    },
    stopEffect() {
        this.node.scale = 1;
        this.node.stopAllActions();
    }

});