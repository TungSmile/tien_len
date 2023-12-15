// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Api = require('Api');
var Linker = require('Linker');
var Global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
        listSms: cc.Node,
        itemSms: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Api.get(Global.configPurchase.API_URL + 'api-list-sms?uid='+Linker.userData.userId, (data) => {
            var temp = '';
            this.listSms.removeAllChildren();
            data.forEach((element ,pos) => {
                element.forEach((item ,pos) => {
                    cc.log("element",item);
                    var sms = cc.instantiate(this.itemSms);
                    this.listSms.addChild(sms);
                    var itemSmsContent = sms.getComponent(require('itemSms'));
                    if (itemSmsContent) {
                        cc.log("item",item);
                        itemSmsContent.init(item);
                    }
                    
                });
            });

        
        });
    },

    start () {
      
        

    },

    // update (dt) {},
});
