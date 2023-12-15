var Global = require('Global');
var Linker = require('Linker');
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        thoigian: cc.Label,
        vatpham: cc.Label,
        menhgia: cc.Label,
        noidung: cc.Label,
        hoanBtn: cc.Node,
        btnNapNgay: cc.Node//nvm
    },
    onLoad () {
    },
    start() {

    },
    init() {
        var data = this.node.data;
        if (data) {
            //this.id.string = data.pos + "";
            if(data.orderDate != undefined){
                this.thoigian.string = data.orderDate;
                this.rawdata = data;
                this.noidung.string = i18n.t(data.comment);
                this.menhgia.string = data.price;
                this.vatpham.string = data.name;
                var theData = this.getTheData();
                this.serial = theData.serial;
                this.mathe = theData.mathe;
                this.menhgia = this.getMenhGia();
                this.nhamang = this.getTenNhaMang();
                this.btnNapNgay.active = this.getValidToShowBtnNapNgay();
            }   
            if (data.status == 1) {
                this.hoanBtn.active = true;
            }else{
                this.hoanBtn.active = false;
            }
        }
    },
    hoanTraBtn() {
        Linker.BonusHistoryTab.hoanTraBtn(this.node.data);
    },
    trangthaiBtnButton(event) {
        var text = this.noidung.string;
        if (Global.Announcement.AnnouncePrefab && Global.Announcement.GlobalNodePrefab) {
            var gNode = cc.instantiate(Global.Announcement.GlobalNodePrefab);
            var gNodeC = gNode.getComponent("GlobalNode");
            if (gNodeC) {
                Global.Announcement._addChild(gNode);
                gNodeC.alert(text, G.AT.OK, () => {
                    Global.Announcement._removeAllChild();
                    Global.Announcement.AnnounceNode.active = false;
                    
                }, () => {
                    Global.Announcement._removeAllChild();
                    Global.Announcement.AnnounceNode.active = false;
                });
            }
        }
    },
    showNapNgay: function(){
        this.btnNapNgay.active = true;
    },
    hideNapNgayButton: function(){
        this.btnNapNgay.active = false;
    },
    napNgay: function(event){
        var data = {
            nhamang: {
                target: {
                    name: this.nhamang,
                }
            },
            menhgia: {
                target: {
                    name: this.menhgia * 1000,
                }
            },
            napthe: {
                target:{
                    name: "btn_napthe"
                }
            },
            serial: this.serial,
            mathe: this.mathe
        };

        cc.find("Canvas/Shop/popup/content/napthe").emit("EVENT_NAP_NHANH_FACOI", data);
        cc.find("Canvas/Shop").emit("EVENT_NAP_NHANH_FACOI", data);
    },
    getValidToShowBtnNapNgay: function(){
        var validDates = this.getPreviousDate(2);
        var orderDate = this.node.data.orderDate.slice(0, 10);
        if(validDates.indexOf(orderDate) != -1){
            return true;
        }else{
            return false;
        }
    },
    getPreviousDate(numberDate) {
        var validDates = [];
        for (let i = 0; i < numberDate; i++) {
            var day = this.getPreViousDay(i);
            // 2019-06-11
            var formatDay = day.y+"-"+day.d+"-"+day.m;
            validDates.push(formatDay);
        }
        return validDates;
    },
    getPreViousDay(days) {
        var previousDay = new Date();
        previousDay.setDate(previousDay.getDate() - days);
        var dn = previousDay.getDate();
        var dd = (dn < 10) ? "0" + String(dn) : String(dn);
        var mn = previousDay.getMonth() + 1;
        var mm = (mn < 10) ? "0" + String(mn) : String(mn);
        var yyyy = String(previousDay.getFullYear());
        previousDay = dd + "/" + mm + "/" + yyyy;
        return {
            d: dd,
            m: mm,
            y: yyyy,
            previousday: previousDay
        }
    },
    getTheData: function(){
        var serialPattern = "Serial";
        var mathePattern = "Mã";

        var startIndexSerial = this.rawdata.comment.toString().indexOf(serialPattern);
        var endIndexSerial = this.rawdata.comment.toString().indexOf(mathePattern);
        var startIndexMathe = this.rawdata.comment.toString().indexOf(mathePattern);
        var endIndexMathe = this.rawdata.comment.toString().length - 1;
        
        var serial = "";
        var mathe = "";

        if(startIndexSerial != -1 && endIndexSerial != -1 && startIndexMathe != -1){
            serial = this.rawdata.comment.toString().slice(startIndexSerial, endIndexSerial).replace(/\D/g,"");
            mathe = this.rawdata.comment.toString().slice(startIndexMathe, endIndexMathe).replace(/\D/g,"");
        }
        return {
            serial: serial,
            mathe: mathe
        };
    },
    getTenNhaMang: function(){
        var tennhamang = "";
        if (this.node.data.name.indexOf('VIET') >= 0) {
            tennhamang = "Viettel";
        }else if(this.node.data.name.indexOf('VINA') >= 0){
            tennhamang = "Vinaphone";
        }else if(this.node.data.name.indexOf('MOBI') >= 0){
            tennhamang = "Mobifone";
        }else{
            tennhamang = "default"
        }
        return tennhamang;
    },
    getMenhGia: function(){
        return Number(this.node.data.name.toString().replace(/\D/g,""));
    }
    // update (dt) {},
});
