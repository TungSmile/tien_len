
var Api = require('Api');
var Linker = require("Linker");
var DataAccess = require('DataAccess');
var Md5 = require('Md5');
var i18n = require('i18n');
var NewAudioManager = require("NewAudioManager");
cc.Class({
    extends: cc.Component,

    properties: {
        phone: cc.Label,
        taikhoan: cc.Label,
        textCode1: cc.Label,
        textCode2: cc.Label,
        time: cc.Label,
        frameBtnOff: cc.SpriteFrame,
        frameBtnOn: cc.SpriteFrame,
        btnTaoCode: cc.Node
    },

    ctor() {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.handleGetCode();
        this.handleGetAcc();
    },

    start () {

    },

    clickBtnTaoCode: function () {
        NewAudioManager.playClick();
        this.handleGetCode();
    },

    onEnable: function () {
       
    },

    clickBtnCopyPhone: function () {
        NewAudioManager.playClick();
        if (this.phone.string == "") {
            cc.Global.showMessage(i18n.t("No phone number exists"));
            return;
        }
        if (cc.sys.isNative) {
            jsb.copyTextToClipboard(this.phone.string);
            cc.Global.showMessage(i18n.t("Đã copy"));
        } else {
            cc.Global.showMessage(i18n.t("Không hỗ trợ trên web"));
        }
    },

    clickBtnCopyTK: function () {
        NewAudioManager.playClick();
        if (this.taikhoan.string == "") {
            cc.Global.showMessage(i18n.t("No account exists"));
            return;
        }
        if (cc.sys.isNative) {
            jsb.copyTextToClipboard(this.taikhoan.string);
            cc.Global.showMessage(i18n.t("Đã copy"));
        } else {
            cc.Global.showMessage(i18n.t("Không hỗ trợ trên web"));
        }
    },

    clickBtnCopyCode: function () {
        NewAudioManager.playClick();
        if (this.textCode1.string == "") {
            cc.Global.showMessage(i18n.t("No code exists"));
            return;
        }
        if (cc.sys.isNative) {
            jsb.copyTextToClipboard(this.textCode1.string);
            cc.Global.showMessage(i18n.t("Đã copy"));
        } else {
            cc.Global.showMessage(i18n.t("Không hỗ trợ trên web"));
        }
    },

    handleGetAcc () {
        const url = Linker.Config.APP_API +"ServiceMono/listMonoAcc";
        var userId  = DataAccess.Instance.userData.userId;
        const username = DataAccess.Instance.userData.displayName;
        const request_id = 123;
        const request_time = new Date().getTime();
        const signature = Md5(request_id + request_time + username);

        var data = `username=${username}&request_id=${request_id}&request_time=${request_time}&signature=${signature}&userId=${userId}`;
        cc.log(data);
        Api.postNoJson(url, data, (result) => {
            cc.log(result);
            if (result.code == 200) {
                this.phone.string = result.partnerName.phone;
                this.taikhoan.string = result.partnerName.name;
               
            } else {
                cc.Global.showMessage(i18n.t(result.msg));
            }
        });
    },

    handleGetCode () {
        const url = Linker.Config.APP_API +"ServiceMono/getCode";
        const userId = DataAccess.Instance.userData.userId;
        const username = DataAccess.Instance.userData.displayName;
        const phone = this.phone.string;
        const taikhoan = this.taikhoan.string;
        var data = `username=${username}&userId=${userId}&phone=${phone}&taikhoan=${taikhoan}`;
        cc.log(data);
        Api.postNoJson(url, data, (result) => {
            cc.log(result);
            if (result.code) {
               // cc.Global.showMessage(i18n.t(result.msg));
               this.textCode1.string = result.code;
               this.textCode2.string = result.code;
               this.time.string = `${i18n.t("note")}: ${result.note}`;
                if (result.code.length > 0) {
                    this.activeBtnTaoCode(false);
                } else {
                    this.activeBtnTaoCode(true);
                }
            } else {
                cc.Global.showMessage(i18n.t(result.msg));
            }
        });
    },

    activeBtnTaoCode (isActive) {
        if (isActive) {
            this.btnTaoCode.getComponent(cc.Sprite).spriteFrame = this.frameBtnOn;
            this.btnTaoCode.getComponent(cc.Button).interactable = true;
        } else {
            this.btnTaoCode.getComponent(cc.Sprite).spriteFrame = this.frameBtnOff;
            this.btnTaoCode.getComponent(cc.Button).interactable = false;
        }
    }
    // update (dt) {},
});
