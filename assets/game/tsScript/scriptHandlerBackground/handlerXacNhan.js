// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var CommonSend = require('CommonSend')
var Linker = require('Linker');
const Constant = require('../../script/network/base/Constant');


cc.Class({
    extends: cc.Component,

    properties: {
        txtMoneyXacNhan: cc.Label
    },

    dataPopup: null,

    renderDataPopup(data) {
        if (data) {
            this.dataPopup = data;
            this.txtMoneyXacNhan.string = `BẠN ĐỒNG Ý MUA CHỦ ĐỀ VỚI GIÁ ${data.price} CHỨ?`;
        }
    },
    onClickXacNhan() {
        cc.error(Linker.userData);
        var dataSend = CommonSend.sendActionTheme(Linker.userData.userId, Constant.ACTION_THEME.PAY_THEME, this.dataPopup.idTheme);
        if (dataSend) {
            Linker.Socket.send(dataSend);
        }
        this.node.active = !this.node.active;
    },

    onClickHuy() {
        this.node.active = !this.node.active;
    }
});
