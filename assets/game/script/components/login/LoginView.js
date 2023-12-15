var Linker = require('Linker');
var Utils = require('Utils');
var LoginCache = require('LoginCache');
cc.Class({
    extends: cc.Component,

    properties: {
        popupContainer: cc.Node,
        toggleDangNhapPopup: cc.Toggle,
        toggleDangKyPopup: cc.Toggle,
        //dang nhap
        editBoxDangNhapUserName: cc.EditBox,
        editBoxDangNhapPassWord: cc.EditBox,

        //dang ky
        editBoxDangKyUserName: cc.EditBox,
        editBoxDangKyPassWord1: cc.EditBox,
        editBoxDangKyPassWord2: cc.EditBox,
        //tu dong dang nhap
        toggleTuDongDangNhap: cc.Toggle,
        toggleNhoMatKhau: cc.Toggle,
        loadingProgressContainer: cc.Node,
        loadingProgressLabelArr: [cc.Label],
        loadingCircle: cc.Node,
        loadingProgressSprite: cc.Sprite
    },
    getEditBoxReg: function () {
        return {
            editBoxNameReg: this.editBoxDangKyUserName,
            editBoxPaswordReg: this.editBoxDangKyPassWord1,
            editBoxRePaswordReg: this.editBoxDangKyPassWord2
        }
    },
    setUserPasswordCache: function () {
        LoginCache.set(this.editBoxDangNhapUserName.string, this.editBoxDangNhapPassWord.string);
    },
    getToggleDangKyDangNhap: function () {
        return [this.toggleDangNhapPopup, this.toggleDangKyPopup];
    },
    getToggleDangKy: function () {
        return this.toggleDangKyPopup;
    },
    getToggleDangNhap: function () {
        return this.toggleDangNhapPopup;
    },
    resetUserNameAndPasswordDangNhapEditBox: function () {
        var cache = LoginCache.get();
        if (cache) {
            cache.username = cache.username && cache.username.length > 0 ? cache.username : "";
            cache.password = "";
        }
        this.editBoxDangNhapUserName.string = cache.username;
        this.editBoxDangNhapPassWord.string = cache.password;
    },
    resetUserNameAndPasswordDangKyEditBox: function () {
        this.resetUserNameReg();
        this.resetPasswordReg();
        
    },
    resetPasswordReg: function(){
        this.editBoxDangKyPassWord1.string = "";
        this.editBoxDangKyPassWord2.string = "";
    },
    resetUserNameReg: function(){
        this.editBoxDangKyUserName.string = "";
    },
    hidePoupDangKy: function () {
        this.toggleDangKyPopup.node.active = false;
        this.toggleDangNhapPopup.node.active = true;
        //toggle tu dong dang nhap
        this.setAutoLogin();
        this.hideLoadingProgress();
    },
    hideLoadingProgress: function () {
        if (this && cc.isValid(this.node)) {
            this.loadingProgressContainer.active = false;
            this.loadingCircle.active = true;
            this.loadingCircle.stopAllActions();
        }

    },
    showLoadingProgress: function () {
        if (this && cc.isValid(this.node)) {
            this.loadingProgressContainer.active = true;
            this.loadingCircle.active = true;
            this.loadingCircle.stopAllActions();
            this.loadingCircle.runAction(
                cc.repeatForever(cc.rotateBy(0.8, -360))
            )
        }
    },
    getProgressSprite: function () {
        return this.loadingProgressSprite;
    },
    getProgressLabelArr: function () {
        return this.loadingProgressLabelArr;
    },
    showPoupDangKy: function () {
        this.toggleDangKyPopup.node.active = true;
        this.toggleDangNhapPopup.node.active = false;
        this.hideLoadingProgress();
    },
    resetCache: function () {
        var cache = LoginCache.get();
        if (cache) {
            cache.username = cache.username && cache.username.length > 0 ? cache.username : "";
            cache.password = "";
        }
        LoginCache.set(cache.username, cache.password);
    },
    setEditBoxDangNhapInfo: function (userData) {
        if (userData) {
            var username = userData.username;
            var password = userData.password;
            if (username) {
                this.editBoxDangNhapUserName.string = username;
            }
            if (password && password.length > 0) {
                this.editBoxDangNhapPassWord.string = password;
            } else {
                this.editBoxDangNhapPassWord.string = "";
            }
        }
    },
    getEditBoxDangNhapInfo: function () {
        return {
            username: this.editBoxDangNhapUserName.string,
            password: this.editBoxDangNhapPassWord.string,
            editBoxUserName: this.editBoxDangNhapUserName,
            editBoxPassword: this.editBoxDangNhapPassWord,
        }
    },
    getEditBoxDangKyInfo: function () {
        return {
            username: this.editBoxDangKyUserName.string,
            password: this.editBoxDangKyPassWord1.string,
            editBoxUserName: this.editBoxDangKyUserName,
            editBoxPassword: this.editBoxDangKyPassWord1,
        }
    },
    getTuDongDangNhapToggle: function () {
        return this.toggleTuDongDangNhap;
    },
    getNhoMatKhauToggle: function () {
        return this.toggleNhoMatKhau;
    },
    setAutoLogin: function () {
        var userData = Linker.Local.readUserData();
        if (userData) {
            if (userData.autoLogin) {
                this.toggleTuDongDangNhap.check();
            } else {
                this.toggleTuDongDangNhap.uncheck();
                this.resetCache();
            }

        } else {
            this.toggleTuDongDangNhap.uncheck();
            this.resetCache();
        }
    }

    // update (dt) {},
});
