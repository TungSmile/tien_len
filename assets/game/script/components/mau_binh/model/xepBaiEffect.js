var MauBinhEffect = require('MauBinhEffect');

cc.Class({
    extends: cc.Component,
    ctor(){
        this.count = 0;
    },
    properties: {
        cardOnHandList : cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {

    },

    xepBai(){
        var listCard = this.cardOnHandList.children;
        var index1 = this.Random(0,13);
        var index2 = this.Random(0,13);
        if(index1 != index2){
            var card1 = cc.instantiate(listCard[index1]);
            var card2 = cc.instantiate(listCard[index2]);
            listCard[index1].active = false;
            listCard[index2].active = false;
            this.cardOnHandList.addChild(card1);
            this.cardOnHandList.addChild(card2);
            card1.runAction(cc.sequence(cc.moveTo(0.2,listCard[index2].position),cc.callFunc(()=>{
                card1.destroy();
                listCard[index2].active = true;
            })));
            card2.runAction(cc.sequence(cc.moveTo(0.2,listCard[index1].position),cc.callFunc(()=>{
                card2.destroy();
                listCard[index1].active = true;
            })));
        }
    },
    reset(cb){
        for (let i = 0; i < this.cardOnHandList.children.length; i++) {
            var item = this.cardOnHandList.children[i];
            if(item){
                item.stopAllActions();
                if(i > 12){
                    item.destroy();
                }
            }   
        }
        if(cb){
            cb();
        }
    },
    Random(min, max) {
        var rd = Math.floor(Math.random() * (max - min) + min);
        return rd;
    },
    update (dt) {
        if(Math.floor(this.count) != Math.floor(this.count + dt)){
            var that = this;
            this.reset(()=>{
                that.xepBai();
            });
        }
        this.count += dt;
    },
});
