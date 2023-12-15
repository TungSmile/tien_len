var NewAudioManager = require('NewAudioManager');
var Linker = require('Linker');
var MauBinhCard = require('MauBinhCard');
cc.Class({
    extends: cc.Component,
    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchEnd,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this);
    },

    start() {
    },
    touchStart(event){
        if(Linker.MauBinhController){
            NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.CARD_SLIDE, 1, false, false);
        }
        this.item = cc.instantiate(this.node);
        var card = this.item.getComponent("MauBinhCard");
        if(card){
            card.setSelect(false);
        }
        this.node.parent.addChild(this.item);
        this.node.getComponent(cc.Sprite).enabled = false;
    },
    touchMove(event){
        //var size = cc.view.getCanvasSize();
        var size = cc.winSize;
        this.item.x = event.getLocation().x - size.width/2;
        this.item.y = event.getLocation().y - size.height/2;
    },
    touchEnd(event){
        if(this.item){
            this.item.destroy();
        }
        var that = this;
        //var size = cc.view.getCanvasSize();
        var size = cc.winSize;
        var location = new cc.Vec2(event.getLocation().x - size.width/2, event.getLocation().y - size.height/2);
        Linker.MauBinhXepBai.checkTouch(this.node,location,()=>{
            that.node.getComponent(cc.Sprite).enabled = true;
            if(Linker.MauBinhController){
                NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.DANH_BAI, 1, false, false);
                
            }
        });
    },
    // update (dt) {},
});
