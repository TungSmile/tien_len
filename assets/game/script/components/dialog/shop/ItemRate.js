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
    init(data, type) {
        this.node.data = data;
        if (data) {
            this.typeNet.string = data.title
            var vnd = Number(data.vnd) / 1000 + "K";
            var quan = Number(data.quan) / 1000 + "K";
            this.ingameValue.node.color = cc.color("#FFF500");
            if (type == 1) {
                this.ingameValue.node.color = cc.color("#00C2FF");
                quan = Number(data.quan) * 5 / 1000 + "K";
            }
            // this.value.string = Utils.Number.format(data.vnd);
            // this.ingameValue.string = Utils.Number.format(data.quan);
            this.value.string = vnd;
            this.ingameValue.string = quan;
        }
    }

    // update (dt) {},
});
