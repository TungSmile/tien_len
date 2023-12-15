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
var Global = require('Global');
var CommonSend = require('CommonSend');
var Api = require('Api');
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        itemAgency: cc.Prefab,
        listAgency: cc.Node,
        transferNode: cc.Node,
        agencyNode: cc.Node,
        agencyBtn: cc.Node,
        transferBtn: cc.Node,
        inputTaiKhoan: cc.EditBox,
        reInputTaiKhoan: cc.EditBox,
        inputMoney: cc.EditBox,
      //  inputPass : cc.EditBox,
        OTPuser:cc.EditBox
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        Linker.AgencyDialog = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //self.node.active = false;
        }, this);
    },
    onEnable: function () {
        // this.stopPropagationOnBackdrop = Utils.Node.stopPropagation(this.backdrop);
        this.node.stopAllActions();
        this.node.setScale(0.3);
        this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
        Api.get(Global.configPurchase.API_URL+"client-list-agency", (data) => {
            Linker.AgencyDialog.onGetListAgency(data);
        });
        this.agencyNode.active = true;
        this.transferNode.active = false;
        this.agencyBtn.getChildByName("check").active = true;
        this.transferBtn.getChildByName("check").active = false;
        if(cc.find("Loading")) cc.find("Loading").active = true;
        this.inputMoney.string = "";
       // this.inputPass.string = "";
        this.inputTaiKhoan.string = "";
        this.reInputTaiKhoan.string = "";
        this.OTPuser.string = "";
        
    },



    onDisable: function () {
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
    },
    closeBtnClick() {
        this.node.active = false;
    },
    chuyenTienBtnClick(data) {
        //cc.log(data);
        this.chuyenKhoanBtn();
        this.inputTaiKhoan.string = data.viewname;
        this.reInputTaiKhoan.string = data.viewname;
        this.inputMoney.string = "";
        this.OTPuser.string = "";
      //  this.inputPass.string = "";
    },
    start() {
        this.addSocketEvent();
    },
    addSocketEvent() {
        Linker.Event.addEventListener(12011, this.onGetTransferMoney, this);
        
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(12011, this.onGetTransferMoney, this);
        
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onGetListAgency(data) {
        this.createListAganecy(data.array);
        if(cc.find("Loading")) cc.find("Loading").active = false;
    },
    onGetTransferMoney(message) {
        cc.log('*** tranfer',message);
        if (message.status == 1) {
            this.resetUi();
            cc.Global.showMessage(message.text);
        } else {
            cc.Global.showMessage(message.text);

        }
        if(cc.find("Loading")) cc.find("Loading").active = false;
    },
    createListAganecy(list) {
        this.listAgency.removeAllChildren();
        list.forEach((element ,pos) => {
            var item = cc.instantiate(this.itemAgency);
            item.data = element;
            item.data.pos = pos;
            item.getComponent(require('ItemAgency')).init();
            this.listAgency.addChild(item);
        });
    },
    checkInput(taikhoan, taikhoan1, soTien) {
        if(this.OTPuser.string==''){
            cc.Global.showMessage(i18n.t("Not empty OTP"));
            return false;
        }
        if (taikhoan != taikhoan1 || taikhoan == "" || taikhoan1 == "") {
            cc.Global.showMessage(i18n.t("Account name does not match"));
            return false;
        }
        return true;
    },
    xacNhanBtn() {
       // this.checkOTP();
        var taiKhoan = this.inputTaiKhoan.string;
        var reTaiKhoan = this.reInputTaiKhoan.string;
        var tien = this.inputMoney.string;
      //  var matKhau = this.inputPass.string;
        if (this.checkInput(taiKhoan,reTaiKhoan,tien)) {
            //cc.log("OK");
            var test = CommonSend.transferMoney(tien, taiKhoan,this.OTPuser.string );
            Linker.Socket.send(test);
            if(cc.find("Loading")) cc.find("Loading").active = true;
        } else {
            //cc.log("FAIL");
        }
    },
    dailyBtn() {
        this.agencyNode.active = true;
        this.transferNode.active = false;
        this.agencyBtn.getChildByName("check").active = true;
        this.transferBtn.getChildByName("check").active = false;
    },
    chuyenKhoanBtn() {
        this.agencyNode.active = false;
        this.transferNode.active = true;
        this.agencyBtn.getChildByName("check").active = false;
        this.transferBtn.getChildByName("check").active = true;
        this.inputMoney.string = "";
       // this.inputPass.string = "";
        this.inputTaiKhoan.string = "";
        this.reInputTaiKhoan.string = "";
        this.OTPuser.string='';
    },
    resetUi() {
        this.inputMoney.string = "";
       // this.inputPass.string = "";
        this.inputTaiKhoan.string = "";
        this.reInputTaiKhoan.string = "";
        this.OTPuser.string='';
    }
    // update (dt) {},
});
