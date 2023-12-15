var Linker = require('Linker');
var Utils = require('Utils');
var SocketConstant = require('SocketConstant');
var Global = require('Global');
var CommonSend = require('CommonSend');
var Api = require('Api');
var i18n = require('i18n');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        tenTaiKhoanNhan: cc.EditBox,
        reTenTaiKhoanNhan: cc.EditBox,
        soTienGui: cc.EditBox,
        lydoChuyenTien: cc.EditBox,
        itemMoneyHintPrefab: cc.Prefab,
        itemMoneyHintNode: cc.Node,
        scrollHintNode: cc.Node,
        messLabel: cc.Label,
        messNode: cc.Node,
        contentNode: cc.Node,
        tabIndex: {
            readonly: true,
            type: cc.Integer,
            default: 333//readonly purpose for only tab chuyen khoan not other tab press
        }
    },
    onLoad: function () {
        this.addCustomEventListener();
        this.addSocketEvent();
    },
    setTabIndex: function(){
        //tat ca tab index deu phai chung nhau do do tabIndex property phai la same nhau tren tat ca các truong
        this.lydoChuyenTien.tabIndex = this.tabIndex;
        this.soTienGui.tabIndex = this.tabIndex;
        this.reTenTaiKhoanNhan.tabIndex = this.tabIndex;
        this.tenTaiKhoanNhan.tabIndex = this.tabIndex;
    },
    onEnable: function(){
        this.resetUi();
        this.setTabIndex();
    },
    addSocketEvent() {
        Linker.Event.addEventListener(12011, this.onGetTransferMoney, this);
        
    },
    onGetTransferMoney(message) {
        cc.log('*** tranfer',message);
        if (message.status == 1) {
            cc.Global.showMessage(message.text);
            this.resetUi();
            this.setMessage(null, message.text);

        } else {
            cc.Global.showMessage(message.text);
            this.resetUi();
            this.setMessage(message.text, null);
        }
        if(cc.find("Loading")) cc.find("Loading").active = false;

    },
    resetUi: function(){
        this.node.active = true;
        this.scrollHintNode.active = false;
        this.messNode.active = false;
        this.itemMoneyHintNode.removeAllChildren(true);
        this.tenTaiKhoanNhan.string = "";
        this.reTenTaiKhoanNhan.string = "";
        this.soTienGui.string = "";
        this.lydoChuyenTien.string = "";
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(12011, this.onGetTransferMoney, this);
    },
    addCustomEventListener: function () {
        this.node.on("EVENT_SELECT_MONEY_FROM_HINT_ITEM", this.setMoney, this);
    },
    setMoney: function (event) {
        this.isItemMoneyCall = true;
        this.scrollHintNode.active = false;
        var item = event.target;
        var items = item.getComponent("itemMoneyHint");
        var money = items.getMoneyValue();
        this.soTienGui.string = money;
    },
    addHintMoneyItem: function (moneys) {
        //remove all child
        this.itemMoneyHintNode.removeAllChildren(true);
        this.scrollHintNode.active = true;
        this.messNode.active = false;
        for (var i = 0; i < moneys.length; i++) {
            var itemMoneyHint = cc.instantiate(this.itemMoneyHintPrefab);
            var itemMoneyHintJS = itemMoneyHint.getComponent("itemMoneyHint");
            itemMoneyHintJS.setMoneyValue(moneys[i]);
            this.itemMoneyHintNode.addChild(itemMoneyHint);
        }
    },
    start: function () {

    },
    requestChuyenKhoan: function () {
        NewAudioManager.playClick();
        var _this = this;
        this.validatedForm(function (err, data) {
            // thông báo ở đây
            if(!err){
                //gui chuyen khoan ngay bay gio
                var taikhoan = _this.tenTaiKhoanNhan.string;
                var tien = parseInt(_this.soTienGui.string.replace(/\,/g,''));
                var lydoChuyenTien = _this.lydoChuyenTien.string;
                var test = CommonSend.transferMoney(tien, taikhoan, lydoChuyenTien);
                Linker.Socket.send(test);

            }else{
                //thong bao loi o day
                cc.Global.showMessage(err);
                _this.setMessage(err, null);
            }
        });
    },
    validatedForm: function (cb) {
        var isTenTaiKhoan = this.checkTenTaiKhoan(this.tenTaiKhoanNhan);
        var isReTenTaiKhoan = this.checkTenTaiKhoan(this.reTenTaiKhoanNhan);
        var isLyDoChuyenTien = this.checkLyDoChuyenTien(this.lydoChuyenTien);
        var isSoTienGui = this.checkMoney(this.soTienGui);
        //check neu co bat ky ky tu nao trong
        if (!isTenTaiKhoan || !isReTenTaiKhoan || !isLyDoChuyenTien || !isSoTienGui) {
            if (!isTenTaiKhoan) return cb( i18n.t("shop_transfer_error_1"), null);
            if (!isReTenTaiKhoan) return cb( i18n.t("shop_transfer_error_2"), null);
            if (!isSoTienGui) return cb( i18n.t("shop_transfer_error_3"), null);
            if (!isLyDoChuyenTien) return cb( i18n.t("shop_transfer_error_4"), null);
        }
        //check neu ten tai khoan 1 va 2 khong trung nhau
        if (this.tenTaiKhoanNhan.string != this.reTenTaiKhoanNhan.string) {
            return cb("Tài khoản nhập lại không trùng khớp", null);
        }
        //neu thoa man cac dieu kien tren thi cho phep return true
        return cb(null, true);

    },
    checkTenTaiKhoan: function (tentaikhoan) {
        //check xem ten tai khoan co  trung voi ten cua minh hay khong?
        var isDuplicate = true;
        if (tentaikhoan.string != "" && tentaikhoan.string != null && tentaikhoan.string.length >= 5) {
            if(Linker.userData.displayName  == tentaikhoan.string){
                //không hợp lệ nếu tự chuyển khoản cho mình
                return false;
            }else{
                //trường hợp username hợp lệ không duplicate tên người dùng
                return true;
            }
        } else {
            return false;
        }
    },
    checkLyDoChuyenTien: function (lydo) {
        if (lydo.string != "" && lydo.string != null && lydo.string.length >= 5) {
            return true;
        } else {
            return false;
        }
    },
    checkMoney: function (money) {
        var moneyParseInt = money.string.replace(/\,/g,'');
        var numberFormatMoney = parseInt(moneyParseInt);
        var isNumber = !(isNaN(numberFormatMoney));
        if (money.string != "" && money.string != null && isNumber) {
            //kiem tra xem so tien co lon hon 0 hay khong neu khong lon hon yeu cau nhap lai
            if (moneyParseInt > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    hintMoney: function (text, editbox, customevent) {
        var isNumberMoney = this.validateMoney(text);
        if (isNumberMoney == false){
            this.itemMoneyHintNode.removeAllChildren(true);
            return
        }
        var valueHints = this.findValueToHint(text);
        this.addHintMoneyItem(valueHints);
        if(this.itemMoneyHintNode.children.length > 0){
            this.scrollHintNode.active = true;
        }
    },
    validateMoney: function (money) {
        var moneyParseInt = money.toString().replace(/\,/g,'');
        var isNumber = !(isNaN(moneyParseInt));
        if (isNumber && parseInt(moneyParseInt) > 0) {
            return true;
        } else {
            return false;
        }
    },
    findValueToHint: function (money) {
        var moneys = [];
        var moneyParseInt = money.toString().replace(/\,/g,'');
        moneyParseInt = this.limitMoneyInteger(moneyParseInt);
        var moneyNumber = parseInt(moneyParseInt);
        var lenMoney =  this.getLengthMoney(moneyNumber);
        if((lenMoney - 1) < 0){
            lenMoney = 0;
        }else{
            lenMoney = lenMoney - 1;
        }
        for (var i = 0; i < this.getMaxLimit() - lenMoney; i++) {
            moneys.push(Utils.Malicious.moneyWithFormat(Math.pow(10, i) * moneyNumber, ","));
        }
        return moneys;
    },
    getMaxLimit: function(){
        //default maxlength = 10; co 2 dau "," so 10 - 2 = 8
        return parseInt(this.soTienGui.maxLength - 2);
    },
    limitMoneyInteger: function(moneyInt){
        //10,000,000 8 ten millions
        if(this.getLengthMoney(moneyInt) > this.getMaxLimit()){
            moneyInt = parseInt(moneyInt.toString().slice(0, this.getMaxLimit()));
        }
        return moneyInt;
    },
    getLengthMoney: function(moneyInt){
        return Math.ceil(Math.log10(moneyInt + 1));
    },
    getDigit: function (money, n) {
        return Math.floor((money / Math.pow(10, n - 1))) % 10;
    },
    turnOnTheHint: function(){
        this.itemMoneyHintNode.removeAllChildren(true);
        this.scrollHintNode.active = true;
        if(this.itemMoneyHintNode.children.length == 0){
            this.scrollHintNode.active = false;
        }
        //off message
        this.messNode.active = false;
        
    },
    setTheHint: function(event){
        var moneyParseInt = this.soTienGui.string.replace(/\,/g,'');
        moneyParseInt = this.limitMoneyInteger(moneyParseInt);
        var moneyNumber = parseInt(moneyParseInt);
        if(this.checkMoney(this.soTienGui) && moneyNumber > 0){
            this.soTienGui.string = Utils.Malicious.moneyWithFormat(moneyParseInt, ",");
        }else{
            this.soTienGui.string = "";
        }

    },
    checkTheHint: function(event){
        var isColision = this.checkColision(event);
        if(!isColision){
            this.scrollHintNode.active = false;
        }
        this.messNode.active = false;
        // https://docs.cocos.com/creator/api/en/classes/Intersection.html Intersection
    },
    turnOffTheHint: function(event){
        this.scrollHintNode.active = false;
        this.messNode.active = false;
        this.setTheHint();
    },
    checkColision: function(event){
        var touchLoc = event.touch;
        var isCollision = false;
        for(var i = 0; i< this.itemMoneyHintNode.children.length; i++){
            if (cc.Intersection.pointInPolygon(touchLoc, this.itemMoneyHintNode.children[i].getComponent(cc.PolygonCollider).world.points)) {
                isCollision = true;
                break;
            }else {
                isCollision = false;
            }
        }
        return isCollision
    },
    onDestroy: function(){
        this.removeSocketEvent();
    },
    setMessage: function(error, data){
        if(!error){
            //neu thanh cong thi se co mau xanh
            this.messLabel.string = data;
            this.messNode.color = cc.color("#3EEE1C");
        }else{
            //neu khong cong thi se co mau do
            this.messLabel.string = error;
            this.messNode.color = cc.color("#EE241C");
        }
        this.messNode.active = true;
    }
});
