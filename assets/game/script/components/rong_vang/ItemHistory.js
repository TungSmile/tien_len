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
cc.Class({
    extends: cc.Component,

    properties: {
        textThoiGian: cc.Label,
        textUserName: cc.Label,
        textMucCuoc: cc.Label,
        textTienThuong: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init(data) {
        this.data = data;
        this.textThoiGian.string = data.date;
        this.textUserName.string = data.username ? data.username : "";
        this.textMucCuoc.string = data.muccuoc;
        this.textTienThuong.string = data.money;
    },
    start() {

    },

    // update (dt) {},
});