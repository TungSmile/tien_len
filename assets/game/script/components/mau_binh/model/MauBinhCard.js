
// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var MauBinhCard = require('MauBinhCard');
cc.Class({
    extends: cc.Component,
    properties: {
        backgroundCard: cc.Sprite,
        cardSprite: cc.SpriteAtlas,
        selectCard: cc.Node
    },
    fromRankType(rank, type) {
        this.rank = rank;
        this.type = type;
        if (this.rank == 12) {

            this.serverValue = (type) * 13 + 1;
        } else {

            this.serverValue = (type) * 13 + this.rank + 2;
        }
        this.i = 0;
        this.j = 0;
        this.setType();
        this.canTouch = true;
    },
    fromServerValue(serverValue) {
        this.setServerValue(serverValue);
        this.i = 0;
        this.j = 0;
        this.setType();
        this.canTouch = true;
    },
    setSelect(isShow = false){
        this.selectCard.active = isShow;
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {

    },
    setServerValue(serverValue) {
        this.serverValue = serverValue;
        this.rank = parseInt((serverValue - 1) % 13 + 1);
        var temp = parseInt((serverValue - 1) / 13 + 1);
        //cc.log(temp);
        switch (temp) {
            case 1:
                this.type = 2;
                break;

            case 2:
                this.type = 1;
                break;

            case 3:
                this.type = 3;
                break;

            case 4:
                this.type = 4;
                break;
            default:
                break;
        }
        if (Number(this.serverValue) < 0) {
            this.rank = -1;
            this.type = -1;
            this.serverValue = -1;
        }
    },
    copy(card) {
        this.serverValue = card.serverValue;
        this.rank = card.rank;
        this.type = card.type;
        this.canTouch = card.canTouch;
    },
    clone() {
        var clone = new MauBinhCard();
        clone.serverValue = this.serverValue;
        clone.rank = this.rank;
        clone.type = this.type;
        clone.canTouch = this.canTouch;
        clone.i = this.i;
        clone.j = this.j;
        return clone;
    },
    setType() {
        var name = "card_face_down";
        if (this.type != -1 && this.rank != -1 && this.serverValue != -1) {
            name = this.rank + "";
            switch (this.type) {
                case 1: {
                    name = name + "b";
                    break;
                }
                case 2: {
                    name = name + "t";
                    break;
                }
                case 3: {
                    name = name + "r";
                    break;
                }
                case 4: {
                    name = name + "c";
                    break;
                }
            }
        } else {

        }
        this.backgroundCard.spriteFrame = this.cardSprite.getSpriteFrame(name);
    },


    // update (dt) {},
});

