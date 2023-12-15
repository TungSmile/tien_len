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

    renderDataPopup(keyErr) {
        if (keyErr) {
            var str = "";
            switch (Number(keyErr)) {
                case Constant.ERR_THEME.ERR_NO_LISTBACKGROUND:
                    str = "KHÔNG TẢI ĐƯỢC DANH SÁCH CHỦ ĐỀ!";
                    break;
                case Constant.ERR_THEME.ERR_PAY:
                    str = "MUA CHỦ ĐỀ KHÔNG THÀNH CÔNG!";
                    break;
                case Constant.ERR_THEME.ERR_USE:
                    str = "KHÔNG THỂ CHỌN CHỦ ĐỀ!";
                    break;
                case Constant.ERR_THEME.ERR_UNKNOW:
                    str = "LỖI KHÔNG XÁC ĐỊNH!";
                    break;
                case Constant.ERR_THEME.ERR_NO_ENOUGHT_MONEY:
                    str = "KHÔNG ĐỦ TIỀN MUA CHỦ ĐỀ!";
                    break;
            }
            this.txtMoneyXacNhan.string = str;
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
