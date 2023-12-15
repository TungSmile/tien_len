var Linker = require('Linker');
var CommonSend = require('CommonSend');
var Global = require("Global");
var Constant = require('Constant');
var SocketConstant = require('SocketConstant');
var Facebook = require('Facebook');
var LoginCache = require('LoginCache');
var i18n = require('i18n');
var FacebookSDK = require('FacebookSDK');
var LobbySend = require('LobbySend');
var Utils = require('Utils');
var NativeBridge = require('NativeBridge');
var i18n = require('i18n');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        LoginControllerNode: cc.Node,
        LoginViewNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {

    },

    start() {
        console.log("vaoday");
       
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                sdkbox.PluginFacebook.init();
                sdkbox.PluginFacebook.setListener({
                    onLogin: function (isLogin, msg) {
                        if (isLogin) {
                            cc.log("Fb_Successful");
                            cc.Global.showMessage("Successful");
                            var token = sdkbox.PluginFacebook.getAccessToken();
                            var userId = sdkbox.PluginFacebook.getUserID();
                            Linker.Event.dispatchEvent("token", {
                                token: token,
                                userId: userId
                            });
                            cc.Global.loginType = LoginType.FB;
                        }
                        else {
                            cc.log("FB_Fail");
                            cc.Global.showMessage("Fail");
                        }
                    },
                    onAPI: function (tag, data) {

                    },
                    onSharedSuccess: function (data) {

                    },
                    onSharedFailed: function (data) {

                    },
                    onSharedCancel: function () { },
                    onPermission: function (isLogin, msg) {
                        // cc.Global.showMessage(sdkbox.PluginFacebook.getAccessToken());
                    }
                });
            }

        }
    },
    onEnable(){
        // Linker.GameManager.autoLoginByWhenPlayGameChan();
        Linker.GameManager.prepareGame(function (isCanLogin) {
            if (isCanLogin) {
               var data = CommonSend.sendFastLogin();
            console.log("data"+data);
            Linker.Socket.send(data);
            } else {
                // logginViewComponent.hideLoadingProgress();
                cc.Global.hideLoading();
                userData.autoLogin = false;
                Linker.Local.saveUserData(userData);
                LoginCache.set(username, "");
                this.hidePoupDangKy();
                cc.Global.showMessage(i18n.t("Đăng nhập không thành công, vui lòng kiểm tra lại kết nối mạng"));
            }
        }.bind(this));
    },
    onToggleDangNhapDangKy: function (toggle) {
        if (toggle) {
            if (this && cc.isValid(this.node)) {
                var logginViewComponent = this.getLogginViewComponent();
                if (logginViewComponent) {
                    if (toggle == logginViewComponent.toggleDangNhapPopup && toggle.isChecked == true) {
                        logginViewComponent.hidePoupDangKy();
                        logginViewComponent.resetUserNameAndPasswordDangNhapEditBox();
                        var logginControllerComponent = this.getLogginControllerComponent();
                        if (logginControllerComponent) {
                            logginControllerComponent.autoLogin();
                        }
                    } else {
                        logginViewComponent.resetUserNameAndPasswordDangKyEditBox();
                        logginViewComponent.showPoupDangKy();
                    }
                }
            }
        }
    },
    getLogginViewComponent: function () {
        return this.LoginViewNode.getComponent("LoginView");
    },
    getLogginControllerComponent: function () {
        return this.LoginControllerNode.getComponent("LoginController");
    },
    showPoupDangKy: function () {
        if (this && cc.isValid(this.node)) {
            var logginViewComponent = this.getLogginViewComponent();
            if (logginViewComponent) {
                logginViewComponent.toggleDangKyPopup.check();
            }
        }

    },
    hidePoupDangKy: function () {
        if (this && cc.isValid(this.node)) {
            var logginViewComponent = this.getLogginViewComponent();
            if (logginViewComponent) {
                logginViewComponent.toggleDangNhapPopup.check();
            }
        }

    },
    onToggleTuDongDangNhap: function (toggle) {
        if (this && cc.isValid(this.node)) {
            NewAudioManager.playClick();
            var logginViewComponent = this.getLogginViewComponent();
            if (logginViewComponent) {
                if (toggle) {
                    var userData = Linker.Local.readUserData();
                    if (userData) {
                        if (toggle.isChecked) {
                            userData.autoLogin = true;
                            logginViewComponent.setUserPasswordCache();
                        } else {
                            userData.autoLogin = false;
                        }
                        Linker.Local.saveUserData(userData);
                    }
                }
            }
        }

    },
    onNhoMatKhau: function (toggle) {
        if (this && cc.isValid(this.node)) {
            NewAudioManager.playClick();
            var logginViewComponent = this.getLogginViewComponent();
            if (logginViewComponent) {
                if (toggle) {
                    var userData = Linker.Local.readUserData();
                    if (userData) {
                        if (toggle.isChecked) {
                            userData.isRememberPW = true;
                            logginViewComponent.setUserPasswordCache();
                        } else {
                            userData.autoLogin = false;
                            userData.isRememberPW = false;
                        }
                        Linker.Local.saveUserData(userData);
                    }
                }
            }
        }

    },
    login: function () {
        if (this && cc.isValid(this.node)) {
            var logginViewComponent = this.getLogginViewComponent();
            var userData = Linker.Local.readUserData();
            if (logginViewComponent) {
                var editBoxDangNhapInfo = logginViewComponent.getEditBoxDangNhapInfo();
                if (editBoxDangNhapInfo) {
                    var username = editBoxDangNhapInfo.username;
                    var password = editBoxDangNhapInfo.password;
                    var isError = false;
                    var msgError = "";
                    if(username.length <= 0){
                        isError = true;
                        msgError = i18n.t("You have not entered username");
                    }else if(username.length >= 32){
                        isError = true;
                        msgError = i18n.t("Your username must be under 32 characters.");
                    }else if(password.length <= 0){
                        isError = true;
                        msgError = i18n.t("You have not entered password.");
                    }else if(username.length <= 4){
                        isError = true;
                        msgError = i18n.t("Username at least 5 characters");
                    }else if(password.length <= 4){
                        isError = true;
                        msgError = i18n.t("Password at least 5 characters");
                    }

                    if (!isError && username.length > 0 && password.length > 0) {
                        cc.Global.showLoading();
                        Linker.GameManager.prepareGame(function (isCanLogin) {
                            if (isCanLogin) {
                                if (userData.isRememberPW) {
                                    LoginCache.set(username, password);
                                } else {
                                    LoginCache.set(username, "");
                                }
                                Linker.autoLogin = false;
                                // logginViewComponent.showLoadingProgress();
                                var message = CommonSend.login(username, password, "2", cc.Global.getDeviceName(), Global.deviceID);
                                Linker.Socket.send(message);
                            } else {
                                // logginViewComponent.hideLoadingProgress();
                                cc.Global.hideLoading();
                                userData.autoLogin = false;
                                Linker.Local.saveUserData(userData);
                                LoginCache.set(username, "");
                                this.hidePoupDangKy();
                                cc.Global.showMessage(i18n.t("Đăng nhập không thành công, vui lòng kiểm tra lại kết nối mạng"));
                            }
                        }.bind(this));
                    } else {
                        logginViewComponent.hideLoadingProgress();
                        cc.Global.showMessage(i18n.t(msgError));
                        cc.Global.hideLoading();
                    }
                }
            }
        }

    },
    loginFbWeb: function () {
        cc.log("Linker.TOKEN:", Linker.TOKEN);
        if (Linker.TOKEN) {
            cc.Global.showLoading();
            Linker.GameManager.prepareGame((isCanLogin) => {
                if (isCanLogin) {
                    var device = "";
                    if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
                        device = "android";
                    } else {
                        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
                            device = "ios";
                        } else {
                            if (cc.sys.isBrowser) {
                                device = "web";
                            }
                        }

                    }
                    var login = CommonSend.loginFb("fb_" + Linker.TOKEN.userId, 1,
                        ApplicationConfig.PLATFORM, Linker.TOKEN.token, Global.deviceID);
                    Linker.Socket.send(login);
                    cc.Global.loginType = LoginType.FB;
                } else {
                    cc.Global.hideLoading();
                }
            });
        } else {
            let Appid = require('GameConstant').APP_FB_ID;
            let scope = "";
            cc.log("Appid", Appid);
            let sdk = new Facebook(Appid, scope, (response) => {
                cc.log(response);
                if (response.status == 200) {
                    if (response.response.authResponse) {
                        cc.Global.showLoading();
                        Linker.GameManager.prepareGame((isCanLogin) => {
                            if (isCanLogin) {
                                var login = CommonSend.loginFb("fb_" + response.response.authResponse.userID, 1, ApplicationConfig.PLATFORM, response.response.authResponse.accessToken, Global.deviceID);
                                Linker.Socket.send(login);

                                Linker.TOKEN = {
                                    token: response.response.authResponse.accessToken,
                                    userId: response.response.authResponse.userID
                                }
                                cc.Global.loginType = LoginType.FB;
                            } else {
                                cc.Global.hideLoading();
                            }

                        });
                    } else {

                        cc.Global.showMessage(i18n.t("Vui lòng thử lại sau"));
                        //cc.log(response.response.authResponse);
                    }
                }
            });
            cc.Global.hideLoading();
        }
    },
    loginOnRegister: function () {
        if (this && cc.isValid(this.node)) {
            var logginViewComponent = this.getLogginViewComponent();
            if (logginViewComponent) {
                var editBoxDangKyInfo = logginViewComponent.getEditBoxDangKyInfo();
                if (editBoxDangKyInfo) {
                    var username = editBoxDangKyInfo.username;
                    var password = editBoxDangKyInfo.password;
                    if (username.length > 0 && password.length > 0) {
                        Linker.GameManager.prepareGame(function (isCanLogin) {
                            if (isCanLogin) {
                                Linker.autoLogin = false;
                                // cc.Global.showLoading();
                                // logginViewComponent.showLoadingProgress();
                                var message = CommonSend.login(username, password, "2", cc.Global.getDeviceName(), Global.deviceID);
                                Linker.Socket.send(message);
                            } else {
                                // logginViewComponent.hideLoadingProgress();
                                cc.Global.hideLoading();
                                var userData = Linker.Local.readUserData();
                                userData.autoLogin = false;
                                Linker.Local.saveUserData(userData);
                                LoginCache.set(username, "");
                                this.hidePoupDangKy();
                                cc.Global.showMessage(i18n.t("Đăng nhập không thành công, vui lòng kiểm tra lại kết nối mạng"));
                            }
                        }.bind(this));
                    } else {
                        logginViewComponent.hideLoadingProgress();
                        cc.Global.showMessage(i18n.t("Tài khoản hoặc mật khẩu không đúng"));
                        cc.Global.hideLoading();
                    }
                }
            }
        }

    },
    registerBtnClick() {
        if (this && this.isValid) {
            var loginViewComponent = this.getLogginViewComponent();
            if (loginViewComponent) {
                //dang nhap
                cc.Global.showLoading();
                Linker.GameManager.prepareGame(function (isCanLogin) {
                    if (isCanLogin) {
                        var editBoxReg = loginViewComponent.getEditBoxReg();
                        if (editBoxReg) {
                            var editBoxNameReg = editBoxReg.editBoxNameReg;
                            var editBoxPaswordReg = editBoxReg.editBoxPaswordReg;
                            var editBoxRePaswordReg = editBoxReg.editBoxRePaswordReg;
                            if (editBoxNameReg && editBoxPaswordReg && editBoxRePaswordReg) {
                                var registerName = editBoxNameReg.string;
                                var registerPass = editBoxPaswordReg.string;
                                var registerRePass = editBoxRePaswordReg.string;
                                if (this.validateUserName(registerName)
                                    && this.validatePassword(registerPass)
                                    && (registerPass == registerRePass)) {
                                    //
                                    var userData = Linker.Local.readUserData();
                                    userData.autoLogin = false;
                                    Linker.Local.saveUserData(userData);
                                    loginViewComponent.resetUserNameAndPasswordDangNhapEditBox();
                                    var message = CommonSend.register(registerName, registerPass);
                                    Linker.Socket.send(message);
                                    // cc.Global.showLoading();
                                } else {
                                    loginViewComponent.resetPasswordReg();
                                    loginViewComponent.resetCache();
                                    cc.Global.showMessage(i18n.t("Please check your information, your username must be more than 5 characters, no spaces, no numbers!"));
                                    cc.Global.hideLoading();
                                }
                            }

                        }

                    }
                }.bind(this));
            }
        }
    },
    validateUserName(username) {
        if (username.length > 5 && username.length < 20) {
            if (isNaN(Number(username)) == true) {
                return true;
            }
        }
        return false;
    },
    validatePassword(password) {
        if (password.length >= 6) {
            return true;
        }
        return false;
    },
    onButtonClick(event) {
        NewAudioManager.playClick();
        switch (event.target.name) {
            case "btn_quaylai":
                this.hidePoupDangKy();
                break;
            case "btn_dangky":
                this.registerBtnClick();
                break;
            case "btn_mopopupdangky":
                this.showPoupDangKy();
                break;
            case "btn_dangnhap":
                this.login();
                break;
            case "btn_dangnhapbangfacebook":
                if (cc.sys.isNative) {
                    Linker.MySdk.loginFb();
                } else {
                    this.loginFbWeb();
                }
                break;
            case "btn_quenmatkhau":
                if (Linker.Config) {
                    var url = Linker.Config.MESSAGER;
                    cc.sys.openURL(url);
                }
                break;
            case "btn_close":
                if (Linker.HomeManager && Linker.HomeManager.isValid) {
                    Linker.HomeManager.hideLoginNode();
                }
                break;
            default:
                break;
        }

    },

    // update (dt) {},
});
