// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Linker = require('Linker');
var Utils = require('Utils');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
cc.Class({
    extends: cc.Component,

    properties: {
        typeNet: cc.Label,
        value: cc.Label,
        ingameValue: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    init() {
        var data = this.node.data;
        if (data) {
            this.typeNet.string = data.name
            this.value.string = Utils.Number.format(data.price);
            this.ingameValue.string = Utils.Number.format(data.price_change);
        }
    },
    btnDoi(event) {
        Linker.BonusTab.btnDoi(this.node.data);
    }

    // update (dt) {},
});
