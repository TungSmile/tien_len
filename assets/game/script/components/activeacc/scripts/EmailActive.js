var Linker = require('Linker');
var CommonSend = require('CommonSend');
var i18n = require('i18n');

cc.Class({
    extends: cc.Component,

    properties: {
        emailAddrNode: cc.Node,
        emailAddrEdb: cc.EditBox,
        otpCodeNode: cc.Node,
        otpCodeEdb: cc.EditBox,
        btnCapNhatEmailNode: cc.Node,
        btnKichHoatOTPNode: cc.Node,
        blockInputUserEmail: cc.BlockInputEvents
    },

    onLoad() {
        // Nhận OTP
        // Xác Nhận
    },
    config: function () {
        if (Linker.userData) {
            if (Linker.userData.hasOwnProperty("email")) {
                // Linker.userData.email = "nguyenvanmanh@gmail.com";
                if (Linker.userData.email.length > 0) {
                    this.emailAddrEdb.string = Linker.userData.email;
                    this.showKichHoatOTP();
                } else {
                    this.showCapNhatEmail();
                }
            } else {
                this.showCapNhatEmail();
            }
        } else {
            this.showCapNhatEmail();
        }
    },
    showKichHoatOTP: function () {
        this.emailAddrNode.active = true;
        this.blockInputUserEmail.enabled = true;
        this.otpCodeNode.active = true;
        this.btnKichHoatOTPNode.active = true;
        this.btnCapNhatEmailNode.active = false;
    },
    showCapNhatEmail: function () {
        this.emailAddrNode.active = true;
        this.blockInputUserEmail.enabled = false;
        this.otpCodeNode.active = false;
        this.btnKichHoatOTPNode.active = false;
        this.btnCapNhatEmailNode.active = true;
    },
    btnClosePopup: function () {
        this.node.active = false;
    },
    start() {

    },
    editBoxReturn: function (editbox) {
        if (this.otpCodeNode.active && this.emailAddrNode.active) {
            this.kichHoatOTP();
        } else if (this.emailAddrNode.active) {
            this.xacNhanEmail();
        }
    },
    checkBothInvalid: function () {
        var isEmail = this.checkValidEmail().isEmail;
        var isOTP = this.checkValidOTP().isOTP;
        return {
            isEmail: isEmail,
            isOTP: isOTP
        }
    },
    checkValidEmail: function () {
        if (this.emailAddrNode.active) {
            var re = /\S+@\S+\.\S+/;
            return { isEmail: re.test(this.emailAddrEdb.string) };
        } else {
            return { isEmail: true };
        }
    },
    checkValidOTP: function () {
        if (this.otpCodeNode.active) {
            if (this.otpCodeEdb.string != "") {
                return { isOTP: true };
            } else {
                return { isOTP: false };
            }
        } else {
            return { isOTP: true };
        }
    },
    kichHoatOTP: function (event) {
        var isValidated = false;
        this.btnKichHoatOTPNode.active = false;
        var validate = this.checkBothInvalid();
        var isOTP = validate.isOTP;
        var isEmail = validate.isEmail;
        if (isOTP == true && isEmail == true) {
            isValidated = true;
        } else {
            isValidated = false;
            this.showKichHoatOTP();
            cc.Global.showMessage(i18n.t("Invalid email or OTP, please try again ..."));
        }
        if (Linker.Config.APP_API && isValidated) {
            //type = 1 cap nhat email, type = 2 xac nhan OTP
            var sql = Linker.Config.APP_API + Linker.Config.KHGMAIL + "?" + "uid=" + Linker.userData.userId + "&email=" + this.emailAddrEdb.string + "&type=2";
            var self = this;
            this.getData(sql, function (err, data) {
                var err = null;
                if (!err) {
                    var mess = data.msg;
                    cc.Global.showMessage(mess);
                    self.getUserInfo();
                } else {
                    cc.log("Lỗi không thể kích hoạt OTP ...\n" + sql);
                }
            });
        } else {
            cc.log("Lỗi không thể kích hoạt OTP ...\n");
        }
    },
    xacNhanEmail: function (event) {
        var isValidated = false;
        this.btnCapNhatEmailNode.active = false;
        //co event la tu button click
        var validate = this.checkValidEmail();
        var isEmail = validate.isEmail;
        if (isEmail == true) {
            isValidated = true;
        } else {
            isValidated = false;
            this.showCapNhatEmail();
            cc.Global.showMessage(i18n.t("Invalid email, please try again ..."));
        }
        if (Linker.Config.APP_API && isValidated) {
            //type = 1 cap nhat email, type = 2 xac nhan OTP
            var sql = Linker.Config.APP_API + Linker.Config.KHGMAIL + "?" + "uid=" + Linker.userData.userId + "&email=" + this.emailAddrEdb.string + "&type=1";
            var self = this;
            this.getData(sql, function (err, data) {
                var err = null;
                if (!err) {
                    var mess = data.msg;
                    cc.Global.showMessage(mess);
                } else {
                    cc.log("Lỗi không thể cập nhật email kích hoạt ...\n" + sql);
                }
            });
        } else {
            cc.log("Lỗi không thể cập nhật email kích hoạt ...\n");
        }
    },
    getUserInfo: function(){
        var test = CommonSend.getUserInfo(Linker.userData.userId);
        Linker.Socket.send(test);
        this.showLoadingLayer();
    },
    showLoadingLayer: function(){
        var loadingLayer = cc.find("Loading");
        if (loadingLayer) cc.find("Loading").active = true;
        var self = this;
        setTimeout(function(){
            self.hideLoadingLayer();
        }, 6000);
    },
    hideLoadingLayer: function(){
        var loadingLayer = cc.find("Loading");
        if (loadingLayer) cc.find("Loading").active = false;
    },
    getData(sql, cb) {
        var self = this;
        self.get(sql, (data) => {
            var err = null;
            if (data) {
                cb(err, data);
            } else {
                err = "Lỗi không thể load API sự kiện ...";
                cb(err, data);
            }
        });
    },
    get(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('error', function () { })
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                if (callback) {
                    callback(JSON.parse(response));
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }
    // update (dt) {},
});
