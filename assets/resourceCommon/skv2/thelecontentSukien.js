var constantSukienDialog = require("constantSukienDialog");
var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        thoigianHeading: cc.Label,
        thoigianSukienDetail: cc.Label,
        theleHeading: cc.Label,
        theleDetail: cc.Label,
        giaiThuongHeading: cc.Label,
        giaiThuongDetail: cc.Label,
        tenSuKien: cc.Label,
        doituongthamgiaHeading: cc.Label,
        doituongthamgiaDetail: cc.Label
    },
    onLoad () {},

    start () {

    },
    setThoigianDetail: function(tgdt){
        this.thoigianSukienDetail.string = tgdt;
    },
    setTheLeDetail: function(tldt){
        this.theleDetail.string = tldt;
    },
    setGiaiThuongDetail: function(gtdt){
        this.giaiThuongDetail.string = gtdt;
    },
    setTenSuKien: function(tsk){
        this.tenSuKien.string = tsk;
    },
    setDoiTuongThamGia: function(dttg){
        this.doituongthamgiaDetail.string = dttg;
    }
    // update (dt) {},
});
