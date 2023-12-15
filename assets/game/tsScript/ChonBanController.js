// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var NewAudioManager = require('NewAudioManager');
var Constant = require('Constant');

cc.Class({
    extends: cc.Component,

    properties: {
        listButton: [cc.Button],
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.onClickButton(null,0);
    },

    start () {

    },


    onClickButton(target, index){
        for(var i = 0;i<this.listButton.length;i++){
            this.listButton[i].interactable = !i==index;
        }
        NewAudioManager.playClick();
        // cc.error("event toggle request filter rooms", this.betMoney);
        var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_YEU_CAU_LOC_BAN_THEO_MENH_GIA, true);
        customEvent.betMoney = 10000;
        customEvent.data = index;
        this.node.dispatchEvent(customEvent);
    }
    // update (dt) {},
});
