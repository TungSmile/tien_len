var Linker = require("Linker");
var func = require("functionAll");
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
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
        Linker.GetNow = this;
    },

    start () {

    },

    // update (dt) {},

    btnClickVideoAds(event) {
        if(Linker.MySdk){
            cc.Global.showMessage(i18n.t("Finding ADS"));
            this.onShowQC(event);
            Linker.MySdk.showRewarded();
        }
    },
    onShowQC(event) {
        console.log("onShowQC getNow::::");
        console.log("event.target",event.target);
        
            console.log("onShowQCset Linker::::");
            // blockInputEvents.active = true;
            Linker.eventGetMoney = event;
        // var event = Linker.eventGetMoney;
        // var nodeClick = event.target;
        // console.log("nodeClick.name:",nodeClick.name);
    },
    // sendResultAdmob: function(type, complete) {
    //     func.prototype.sendAdmob(type, complete);
    // }

    sendResultAdmob: function() {
        func.prototype.sendAdmob(2, 1);
        func.prototype.sendAdmob(4, 1);
    }
});
