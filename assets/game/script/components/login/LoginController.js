var Linker = require('Linker');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
var LoginCache = require('LoginCache');
var Facebook = require('Facebook');
var LobbySend = require('LobbySend');
var Constant = require('Constant');
var XocDiaSend = require('XocDiaSend');
var Utils = require('Utils');
var NativeBridge = require('NativeBridge');
var SceneManager = require('SceneManager');
var Global = require("Global");
var NodePoolManager = require('NodePoolManager');
var DataAccess = require('DataAccess');
var NewAudioManager = require('NewAudioManager');
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        LoginViewNode: cc.Node
    },
    onLoad: function () {
        Linker.LoginController = this;
        Linker.gameLanguage = "vi";
        if (!Linker.isLogin) {
            i18n.init(Linker.gameLanguage);
            cc.Global.instanceAlert();
            //load loading prefab
            cc.Global.instanceLoading(function (err, loadingPrefab) {
                if (!err) {
                    this.initLogin();
                }
            }.bind(this))
        }
    },
    initLogin: function () {
        clearInterval(cc.Global.Reconnectinterval);
        this.resetGameInfo();
        //se bat poup dang nhap truoc
        this.enablePoupDangNhap();
    },
    resetGameInfo: function () {
        Linker.GameManager.isConnected = false;
        Linker.isLogin = false;
        Linker.isFb = false;
        Linker.userData = null;
        Linker.reconnecting = false;
        Linker.CHAT_MESSAGE = [];
        cc.Global.kCurrScene = -1;
        cc.Global.kPrevScene = -1;
        Linker.autoLoginByWhenPlayGameChan = false;
        Linker.RankData.listRank = null;
        Linker.countReconnect = 0;
        //add by zep
        //cc.director.preloadScene("HallScene");
        Linker.isRegister = false;
    },
    enablePoupDangNhap: function () {
        if (this && cc.isValid(this.node)) {
            var loginViewComponent = this.getLogginViewComponent();
            if (loginViewComponent) {
                //mo popup dang nhap
                loginViewComponent.toggleDangNhapPopup.active = true;
                loginViewComponent.toggleDangKyPopup.active = true;
                //khi nao chay thi se su dung chuc nang tu dong dang nhap nay,
                //neu nguoi dung click thoat game, dang xuat thi reset thanh false
                this.checkAutoLogin();
                this.checkRememberPWLogin();
                if (loginViewComponent.toggleDangNhapPopup.isChecked) {
                    this.checkAutoLoginIfLoginPanelActive();
                } else {
                    loginViewComponent.toggleDangNhapPopup.check();
                }
            }
        }

    },
    checkAutoLoginIfLoginPanelActive: function () {
        if (this && cc.isValid(this.node)) {
            var loginViewComponent = this.getLogginViewComponent();
            if (loginViewComponent) {
                var togglePopups = loginViewComponent.getToggleDangKyDangNhap();
                var toggleDangNhap = loginViewComponent.getToggleDangNhap();
                var toggleDangKy = loginViewComponent.getToggleDangKy();
                if (togglePopups && toggleDangNhap && toggleDangKy) {
                    for (var i = 0; i < togglePopups.length; i++) {
                        var toggle = togglePopups[i];
                        if (toggle == toggleDangNhap && toggle.isChecked == true) {
                            loginViewComponent.resetUserNameAndPasswordDangNhapEditBox();
                            this.autoLogin();
                        }
                    }
                }
            }
        }
    },
    checkAutoLogin: function () {
        if (this && cc.isValid(this.node)) {
            var loginViewComponent = this.getLogginViewComponent();
            if (loginViewComponent) {
                var userData = Linker.Local.readUserData();
                if (userData) {
                    var cache = LoginCache.get();
                    if (Utils.Malicious.getLengthObj(cache) < 2) {
                        cache.username = "";
                        cache.password = "";
                    }
                    if (userData.autoLogin) {
                        //dang nhap thoi hihi
                        if (cache.username.length > 0 && cache.password.length > 0) {
                            loginViewComponent.setEditBoxDangNhapInfo({
                                username: cache.username,
                                password: cache.password
                            });

                        } else {
                            if (!userData.isRememberPW) {
                                loginViewComponent.resetCache();
                                loginViewComponent.setEditBoxDangNhapInfo({
                                    username: cache.username.length > 0 ? cache.username : "",
                                    password: ""
                                });
                            }
                        }
                    } else {
                        if (!userData.isRememberPW) {
                            loginViewComponent.resetCache();
                            loginViewComponent.setEditBoxDangNhapInfo({
                                username: cache.username.length > 0 ? cache.username : "",
                                password: ""
                            });
                        }
                    }
                }
            }
        }
    },
    checkRememberPWLogin: function () {
        if (this && cc.isValid(this.node)) {
            var loginViewComponent = this.getLogginViewComponent();
            if (loginViewComponent) {
                var nhoMatKhauToggle = loginViewComponent.getNhoMatKhauToggle();
                if (nhoMatKhauToggle) {
                    var userData = Linker.Local.readUserData();
                    if (userData) {
                        var cache = LoginCache.get();
                        if (Utils.Malicious.getLengthObj(cache) < 2) {
                            cache.username = "";
                            cache.password = "";
                        }
                        if (userData.isRememberPW) {
                            //dang nhap thoi hihi
                            if (cache.username.length > 0 && cache.password.length > 0) {
                                loginViewComponent.setEditBoxDangNhapInfo({
                                    username: cache.username,
                                    password: cache.password
                                });
                                nhoMatKhauToggle.check();
                            } else {
                                nhoMatKhauToggle.uncheck();
                                loginViewComponent.resetCache();
                                loginViewComponent.setEditBoxDangNhapInfo({
                                    username: cache.username.length > 0 ? cache.username : "",
                                    password: ""
                                });
                            }
                        } else {
                            nhoMatKhauToggle.uncheck();
                            loginViewComponent.resetCache();
                            loginViewComponent.setEditBoxDangNhapInfo({
                                username: cache.username.length > 0 ? cache.username : "",
                                password: ""
                            });
                        }
                        if (cc.Global.firstTimeLogin) {
                            cc.Global.firstTimeLogin = false;
                            nhoMatKhauToggle.check();
                        }
                    }
                }
            }
        }
    },
    getLogginViewComponent: function () {
        return this.LoginViewNode.getComponent("LoginView");
    },
    get(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('error', function () { })
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                if (callback) {
                    callback(JSON.parse(response));
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    },
    start() {
        this.addSocketEvent();
        this.addSdkEventListener();
    },
    addSdkEventListener: function () {
        if (cc.sys.isMobile && typeof sdkbox != "undefined") {
            sdkbox.PluginFacebook.init();
            sdkbox.PluginFacebook.setListener({
                onLogin: function (isLogin, msg) {
                    if (isLogin) {
                        Linker.HomeManager.showLayer();
                        Linker.autoLogin = false;
                        cc.log("Fb_Successful");
                        cc.Global.showMessage("Successful");
                        var token = sdkbox.PluginFacebook.getAccessToken();
                        var userId = sdkbox.PluginFacebook.getUserID();
                        Linker.Event.dispatchEvent("token", {
                            token: token,
                            userId: userId
                        });
                        cc.Global.loginType = LoginType.FB;
                        if (cc.find("Loading")) cc.find("Loading").active = true;
                    } else {
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
    },
    loginBtnClick(event) {
        // cc.Global.showLoading();
        Linker.avatarFbFrame = null;
        var userData = Linker.Local.readUserData();
        this.tempUserPass = {
            name: this.editBoxNameLog.string,
            pass: this.editBoxPaswordLog.string
        };

        if (this && this.isValid) {
            var _this = this;
            // cc.Global.showLoading();
            Linker.GameManager.prepareGame(function (isCanLogin) {
                if (this && cc.isValid(this)) {
                    if (isCanLogin) {
                        var username;
                        var password;
                        if (this.editBoxNameLog && cc.isValid(this.editBoxNameLog) && this.editBoxPaswordLog && cc.isValid(this.editBoxPaswordLog)) {
                            username = this.editBoxNameLog.string.trim();
                            password = this.editBoxPaswordLog.string.trim();
                        }
                        if (event && event.hasOwnProperty("username") && event.hasOwnProperty("password")) {
                            username = event.username;
                            password = event.password;
                        }
                        cc.log("data login no cache", username, password);
                        cc.log("data login", username, password);
                        if (username && password && username.length > 0 && password.length > 0) {

                            if (userData.isRememberPW) {
                                LoginCache.set(username, password);
                            } else {
                                LoginCache.set(username, "");
                            }
                            var message = CommonSend.login(username,
                                password,
                                "2",
                                cc.Global.getDeviceName(),
                                Global.deviceID);
                            Linker.Socket.send(message);
                        } else {
                            this.background.active = false;
                            cc.Global.showMessage(i18n.t("Tài khoản hoặc mật khẩu không đúng"));
                            cc.Global.hideLoading();
                        }

                    } else {
                        cc.Global.hideLoading();
                        Global.Announcement._removeAllChild();
                        // if (!Global.LoginHandler.IS_REM_PASSWORD) {
                        //     LoginCache.remove();
                        //     cc.log("Remove password remember ...");
                        // }
                        //logout thanh cong
                        if (_this.node && cc.isValid(_this.node)) {
                            var customEvent = new cc.Event.EventCustom(BiDaConstant.LOGIN_EVENT.LOGOUTED_SUCCESS, true);
                            _this.node.dispatchEvent(customEvent);
                        }
                        this.background.active = false;
                        userData.autoLogin = false;
                        Linker.Local.saveUserData(userData);
                        LoginCache.set(_this.tempUserPass.name, _this.tempUserPass.pass);
                        cc.Global.showMessage(i18n.t("Đăng nhập không thành công, vui lòng kiểm tra lại kết nối mạng"));
                    }
                } else {
                    if (cc.Global.intervalTopHu) {
                        clearInterval(cc.Global.intervalTopHu);
                    }
                    cc.Global.showLoading();
                    cc.director.preloadScene("Splash", function (completedCount, totalCount, item) {
                        var percent = completedCount / totalCount;
                    }, function (err, data) {
                        cc.Global.hideLoading();
                        if (!err) {
                            cc.director.loadScene('Splash', () => {
                                NativeBridge.changeOrientationH(true);
                                // cc.Global.hideLoading();
                            });
                        } else {
                            cc.log("Không thể load lại homescene lỗi xảy ra...");
                        }
                    });
                }
            }.bind(this));
        }

    },
    addSocketEvent() {
        Linker.Event.addEventListener(Constant.CMD.FAST_LOGIN, this.onLogin, this);
        Linker.Event.addEventListener("token", this.onGetToken, this);
        Linker.Event.addEventListener(SocketConstant.COMMON.LOGIN, this.onLogin, this);
        Linker.Event.addEventListener(SocketConstant.COMMON.LOGIN_FB, this.onLoginFb, this);
        Linker.Event.addEventListener(SocketConstant.COMMON.REGISTER, this.onRegister, this);

    },
    removeEventListener() {
        Linker.Event.removeEventListener(Constant.CMD.FAST_LOGIN, this.onLogin, this);
        Linker.Event.removeEventListener("token", this.onGetToken, this);
        Linker.Event.removeEventListener(SocketConstant.COMMON.LOGIN, this.onLogin, this);
        Linker.Event.removeEventListener(SocketConstant.COMMON.LOGIN_FB, this.onLoginFb, this);
        Linker.Event.removeEventListener(SocketConstant.COMMON.REGISTER, this.onRegister, this);

    },
    onDestroy: function () {
        this.removeEventListener();
    },
    onLoginFb(message) {
        if (this && this.isValid) {
            // message = message ? Utils.Malicious.parseNumberElementsIn(message) : null;
            cc.Global.hideLoading();
            Linker.autoLogin = false;
            Linker.redirectOnReconnect = null;

            cc.log("onLoginFb****");
            if (Linker.Config && (message.hasOwnProperty("isNewLoginDay"))) {
                Linker.Config.ISLOGINDAY = Number(message.isNewLoginDay);
            }
            if (message && message.messageId == SocketConstant.COMMON.LOGIN_FB && message.status == 1) {
                // cc.Global.showLoading();
                //cc.log("LOGIN_OK", message);
                // this.joinTaiXiu();
                Linker.isLogin = true;
                Linker.isFb = true;
                Linker.userData = {};
                message.zoneId = Number(message.zoneId);
                message.checkMail = Number(message.checkMail);
                message.isActive = Number(message.isActive);
                message.isNewLoginDay = Number(message.isNewLoginDay);
                message.isPayment = Number(message.isPayment);
                message.isPhoneUpdate = Number(message.isPhoneUpdate);
                message.lastRoom = Number(message.lastRoom);
                Linker.DataSuKien.init();
                // cc.js.addon(Linker.userData, message);
                // cc.js.addon(DataAccess.Instance.userData, message);
                cc.js.mixin(Linker.userData, message);
                cc.js.mixin(DataAccess.Instance.userData, message);
                if (message.isActive == "0") {
                    Linker.showDialogActive = false;
                } else {
                    Linker.showDialogActive = false;
                }

                //cc.director.loadScene("HallScene",()=>{.active = false;});
                // var testdata = { "r": [{ "v": "12004\u0004" }] }
                // Linker.Socket.send(JSON.stringify(testdata));
                Linker.isOtherLogin = false;
                if (Linker.userData) {
                    if (!message.zoneId) {
                        //dang nhap binh thuong khong reconnect
                    } else if (message.zoneId && message.zoneId != 0) {
                        this.onReconnect(message);
                    }
                    this.dangNhapThanhCong(message);
                    Linker.isOtherLogin = false;
                } else {
                    this.dangNhapLoi(message);
                    Linker.Socket.close();
                }
                // cc.Global.hideLoading();
            } else {
                this.dangNhapLoi(message);
            }
        }

    },
    dangNhapThanhCong: function (message) {
        if (message) {
            var userData = Linker.Local.readUserData();
            userData.isFirstLaunch = false;
            Linker.Local.saveUserData(userData);
            // cc.Global.hideLoading();
            //tai bundle heroes ball
            // this.loadDreamCityBundle(function (err, heroesBallBundle) {
            //     if (!err) {
            //         Utils.Malicious.getCoinFrame(Linker.MoneyTypeSpriteFrame, function (err, data) {
            //             if (!err) {
            //                 Linker.MoneyTypeSpriteFrame = data;
            //                 this.loadGame();
            //             }
            //         }.bind(this))
            //     }
            // }.bind(this))

            //huy 13/11/20
            Linker.HomeManager.checkShowDialog();
            Utils.Malicious.getCoinFrame(Linker.MoneyTypeSpriteFrame, function (err, data) {
                if (!err) {
                    Linker.MoneyTypeSpriteFrame = data;
                    this.loadGame();
                }
            }.bind(this))
        }
    },
    loadGame: function () {
        Linker.showDialogActive = false;
        var nameHeroesBallBundle = Constant.BUNDLE.TRANG_CHU.name;
        // Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
        //     if (!err) {
        //         Linker.isLoadingRecconnectGame = true;
        //         var scenename = "HeroesBall";
        //         this.lastProgressRange = null;
        //         // cc.director.preloadScene(scenename, function (completedCount, totalCount, item) {
        //         gameLoaderBundle.preloadScene(scenename, function (completedCount, totalCount, item) {
        //             this.onProgressPreloadScene(completedCount, totalCount, item);
        //         }.bind(this), function (err, scene) {
        //             this.onFinishPreloadScene(err, scene, gameLoaderBundle, scenename);
        //         }.bind(this));
        //     } else {
        //         cc.error(err);

        //         Linker.isLoadingRecconnectGame = false;
        //     }
        // }.bind(this), nameHeroesBallBundle);

        // Linker.Config.pmE = true;
        // if (Linker.Config && Linker.Config.pmE) {
            // Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
            //     if (!err) {
            //         Linker.isLoadingRecconnectGame = true;
            //         // var scenename = "HeroesBall";
            //         var scenename = "TrangChu";
            //         this.lastProgressRange = null;
            //         // cc.director.preloadScene(scenename, function (completedCount, totalCount, item) {
            //         gameLoaderBundle.preloadScene(scenename, function (completedCount, totalCount, item) {
            //             this.onProgressPreloadScene(completedCount, totalCount, item);
            //         }.bind(this), function (err, scene) {
            //             this.onFinishPreloadScene(err, scene, gameLoaderBundle, scenename);
            //         }.bind(this));
            //     } else {
            //         cc.error(err);

            //         Linker.isLoadingRecconnectGame = false;
            //     }
            // }.bind(this), nameHeroesBallBundle);

            this.checkReconnectGame();
        // } else {

        //     this.quikJoinSoccer(45);
        // }

    },
    checkReconnectGame: function () {
        var loginViewComponent = this.getLogginViewComponent();
        if (loginViewComponent) {
            Linker.userData.lastRoom = isNaN(parseInt(Linker.userData.lastRoom)) ? 0 : parseInt(Linker.userData.lastRoom);
            Linker.ZONE = isNaN(parseInt(Linker.ZONE)) ? 0 : parseInt(Linker.ZONE);
            if (Linker.userData.lastRoom) {
                this.lastProgressRange = 0.05;
                var progressSprite = loginViewComponent.getProgressSprite();
                var progressLabelArr = loginViewComponent.getProgressLabelArr();
                if (progressSprite && progressLabelArr) {
                    progressSprite.fillRange = this.lastProgressRange;
                }
                if (Linker.ZONE) {
                    var sceneName;
                    var sceneName2;
                    var bundleName;
                    var bundleNameObj = Utils.Malicious.getBundleNameAndSceneNameByZoneId(Linker.ZONE);
                    if (bundleNameObj) {
                        bundleName = bundleNameObj.bundleName;
                        sceneName = bundleNameObj.sceneNameLoad;
                        sceneName2 = bundleNameObj.sceneNameLoad2;
                        if (bundleName) {
                            loginViewComponent.showLoadingProgress();
                            Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                                if (!err) {
                                    Linker.isLoadingRecconnectGame = true;
                                    gameLoaderBundle.preloadScene(sceneName, function (completedCount, totalCount, item) {
                                        this.onProgressPreloadScene(completedCount, totalCount, item);
                                    }.bind(this), function (err, scene) {
                                        if (!err) {
                                            var isPortrait = false;
                                            if (Linker.ZONE == Constant.ZONE_ID.BAN_SUNG || Linker.ZONE == Constant.ZONE_ID.PHI_DAO) {
                                                sceneName = sceneName2;
                                                isPortrait = true;
                                                NativeBridge.changeOrientationH(false);
                                            }
                                            gameLoaderBundle.loadScene(sceneName, function (err, scene) {
                                                if (!err) {
                                                    if (!isPortrait) {
                                                        cc.director.runSceneImmediate(scene, null, (err, scene) => {
                                                            if (!err) {
                                                                var data = {
                                                                    isReconnect: true,
                                                                    matchId: Linker.userData.lastRoom
                                                                }
                                                                // cc.Canvas.instance.getComponentInChildren("PortalView").createTableGhepDoi(data);
                                                            }
                                                        });
                                                    } else {
                                                        cc.director.runSceneImmediate(scene, null, function (err, scene) {
                                                            var canvas = cc.find("Canvas");
                                                            if (canvas) {
                                                                var children = canvas.children;
                                                                if (children) {
                                                                    var dataReconnect = {
                                                                        tableData: {
                                                                            matchId: Linker.userData.lastRoom
                                                                        },
                                                                        isReconnect: true,
                                                                        isCreate: false,
                                                                        isJoin: false
                                                                    }
                                                                    if (Linker.ZONE == Constant.ZONE_ID.PHI_DAO) {
                                                                        for (var i = 0; i < children.length; i++) {
                                                                            var portalNode = children[i];
                                                                            var portalController = portalNode.getComponent("PortalPhiDaoController");
                                                                            if (portalController) {
                                                                                portalController.addGameReconnect(dataReconnect);
                                                                                break;
                                                                            }
                                                                        }
                                                                    } else if (Linker.ZONE == Constant.ZONE_ID.BAN_SUNG) {
                                                                        var controller = cc.Canvas.instance.getComponentInChildren("ShootingGameController");
                                                                        controller.InitializeGame(dataReconnect);
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    }

                                                    cc.error("Loaded scene success login...", sceneName);
                                                }
                                            })
                                        }

                                    }.bind(this));
                                } else {
                                    cc.error(err);
                                    Linker.isLoadingRecconnectGame = false;
                                }
                            }.bind(this), bundleName);
                        }
                    }
                }
            } else {
                Linker.HomeManager.showLayer();
            }
        }
    },
    onProgressPreloadScene: function (completedCount, totalCount, item) {
        if (this && cc.isValid(this.node)) {
            var loginViewComponent = this.getLogginViewComponent();
            if (loginViewComponent) {
                var percent = completedCount / totalCount;
                if (!this.lastProgressRange || isNaN(this.lastProgressRange)) {
                    this.lastProgressRange = 0.05;
                }
                var progressSprite = loginViewComponent.getProgressSprite();
                var progressLabelArr = loginViewComponent.getProgressLabelArr();
                if (progressSprite && progressLabelArr) {
                    cc.error()
                    progressSprite.fillRange = this.lastProgressRange;
                    if (percent > this.lastProgressRange) {
                        progressSprite.fillRange = percent;
                        this.lastProgressRange = percent;
                    }
                    var progressText = this.lastProgressRange * 100;
                    var percent = (isNaN(Math.round(progressText)) ? "..." : Math.round(progressText));
                    this.setProgressPercent(progressLabelArr, percent);
                } else {
                    cc.error("Hellooooo.....");
                }
            }
        }

    },
    setProgressPercent: function (listLabel, percent) {
        if (listLabel && Array.isArray(listLabel) && listLabel.length) {
            for (var i = 0; i < listLabel.length; i++) {
                var progressLabel = listLabel[i];
                if (progressLabel.node.name == "circleLoadingText") {
                    progressLabel.string = percent + "%";

                } else {
                    progressLabel.string = i18n.t("title_loading", {
                        percent: percent
                    });
                }
            }
        }
    },
    onFinishPreloadScene: function (err, scene, gameLoaderBundle, scenename) {
        var loginViewComponent = this.getLogginViewComponent();
        if (loginViewComponent) {
            if (!err && scenename) {
                Linker.userData.lastRoom = isNaN(parseInt(Linker.userData.lastRoom)) ? 0 : parseInt(Linker.userData.lastRoom);
                Linker.ZONE = isNaN(parseInt(Linker.ZONE)) ? 0 : parseInt(Linker.ZONE);
                if (Linker.userData.lastRoom) {
                    this.lastProgressRange = 0.05;
                    var progressSprite = loginViewComponent.getProgressSprite();
                    var progressLabelArr = loginViewComponent.getProgressLabelArr();
                    if (progressSprite && progressLabelArr) {
                        progressSprite.fillRange = this.lastProgressRange;
                    }
                    if (Linker.ZONE) {
                        var sceneName;
                        var sceneName2;
                        var bundleName;
                        var bundleNameObj = Utils.Malicious.getBundleNameAndSceneNameByZoneId(Linker.ZONE);
                        if (bundleNameObj) {
                            bundleName = bundleNameObj.bundleName;
                            sceneName = bundleNameObj.sceneNameLoad;
                            sceneName2 = bundleNameObj.sceneNameLoad2;
                            if (bundleName) {
                                Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                                    if (!err) {
                                        Linker.isLoadingRecconnectGame = true;
                                        gameLoaderBundle.preloadScene(sceneName, function (completedCount, totalCount, item) {
                                            this.onProgressPreloadScene(completedCount, totalCount, item);
                                        }.bind(this), function (err, scene) {
                                            if (!err) {
                                                var isPortrait = false;
                                                if (Linker.ZONE == Constant.ZONE_ID.BAN_SUNG || Linker.ZONE == Constant.ZONE_ID.PHI_DAO) {
                                                    sceneName = sceneName2;
                                                    isPortrait = true;
                                                    NativeBridge.changeOrientationH(false);
                                                }
                                                gameLoaderBundle.loadScene(sceneName, function (err, scene) {
                                                    if (!err) {
                                                        if (!isPortrait) {
                                                            cc.director.runSceneImmediate(scene, null, (err, scene) => {
                                                                if (!err) {

                                                                    var data = {
                                                                        isReconnect: true,
                                                                        matchId: Linker.userData.lastRoom
                                                                    }
                                                                    // cc.Canvas.instance.getComponentInChildren("PortalView").createTableGhepDoi(data);
                                                                }
                                                            });
                                                        } else {
                                                            cc.director.runSceneImmediate(scene, null, function (err, scene) {

                                                                var canvas = cc.find("Canvas");
                                                                if (canvas) {
                                                                    var children = canvas.children;
                                                                    if (children) {
                                                                        var dataReconnect = {
                                                                            tableData: {
                                                                                matchId: Linker.userData.lastRoom
                                                                            },
                                                                            isReconnect: true,
                                                                            isCreate: false,
                                                                            isJoin: false
                                                                        }
                                                                        if (Linker.ZONE == Constant.ZONE_ID.PHI_DAO) {
                                                                            for (var i = 0; i < children.length; i++) {
                                                                                var portalNode = children[i];
                                                                                var portalController = portalNode.getComponent("PortalPhiDaoController");
                                                                                if (portalController) {
                                                                                    portalController.addGameReconnect(dataReconnect);
                                                                                    break;
                                                                                }
                                                                            }

                                                                        } else if (Linker.ZONE == Constant.ZONE_ID.BAN_SUNG) {
                                                                            var controller = cc.Canvas.instance.getComponentInChildren("ShootingGameController");
                                                                            controller.InitializeGame(dataReconnect);

                                                                        }
                                                                    }
                                                                }
                                                            });
                                                        }

                                                        cc.error("Loaded scene success...", sceneName);
                                                    }
                                                })
                                            }

                                        }.bind(this));
                                    } else {
                                        cc.error(err);
                                        Linker.isLoadingRecconnectGame = false;
                                    }
                                }.bind(this), bundleName);
                            }
                        }
                    }
                } else {
                    if (gameLoaderBundle) {
                        gameLoaderBundle.loadScene(scenename, function (err, scene) {
                            // cc.director.loadScene(scenename, function (err, scene) {
                            // gameLoaderBundle.loadScene(scenename, function (err, scene) {
                            if (!err) {
                                Linker._sceneTag = Constant.TAG.scenes.HOME;
                                // cc.director.runScene(scene);
                                cc.director.runScene(scene, null, function (err, scene) {
                                    if (!err) {
                                        cc.error("Loaded scene success...", scenename);
                                        cc.error("Linker.userData.lastRoom");
                                        cc.error(Linker.userData.lastRoom);
                                        cc.error("Linker.ZONE", Linker.ZONE);
                                    }
                                })


                            }
                        }.bind(this))
                    }
                }

            } else {
                cc.log("Không thể load lại hall scene lỗi xảy ra...");
            }
        }
    },
    quikJoinSoccer: function (zoneID) {
        var loginViewComponent = this.getLogginViewComponent();
        if (loginViewComponent) {


            Linker.ZONE = zoneID;

            this.lastProgressRange = 0.05;
            var progressSprite = loginViewComponent.getProgressSprite();
            var progressLabelArr = loginViewComponent.getProgressLabelArr();
            if (progressSprite && progressLabelArr) {
                progressSprite.fillRange = this.lastProgressRange;
            }
            if (Linker.ZONE) {
                var sceneName;
                var bundleName;
                var bundleNameObj = Utils.Malicious.getBundleNameAndSceneNameByZoneId(Linker.ZONE);
                if (bundleNameObj) {
                    bundleName = bundleNameObj.bundleName;
                    sceneName = bundleNameObj.sceneNameLoad;
                    if (bundleName) {
                        Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                            if (!err) {
                                Linker.isLoadingRecconnectGame = true;
                                gameLoaderBundle.preloadScene(sceneName, function (completedCount, totalCount, item) {
                                    this.onProgressPreloadScene(completedCount, totalCount, item);
                                }.bind(this), function (err, scene) {
                                    if (!err) {
                                        gameLoaderBundle.loadScene(sceneName, function (err, scene) {
                                            if (!err) {
                                                // cc.director.runScene(scene);
                                                cc.director.runScene(scene, null, function (err, scene) {
                                                    if (!err) {
                                                        cc.error("Loaded scene success...", sceneName);

                                                    }
                                                })
                                            }
                                        })
                                    }

                                }.bind(this));
                            } else {
                                cc.error(err);
                                Linker.isLoadingRecconnectGame = false;
                            }
                        }.bind(this), bundleName);
                    }
                }
            }

        }
    },
    dangNhapLoi: function (message) {
        if (message) {
            //cc.log("LOGIN_FAIL", message);
            cc.Global.hideLoading();
            cc.Global.showMessage(i18n.t(message.error));
            cc.error("Lỗi không thể đăng nhập...", message);
            if (this && cc.isValid(this.node)) {
                var loginViewComponent = this.getLogginViewComponent();
                if (loginViewComponent) {
                    //mo popup dang nhap
                    loginViewComponent.hideLoadingProgress();
                    var editBoxDangNhapInfo = loginViewComponent.getEditBoxDangNhapInfo();
                    if (editBoxDangNhapInfo) {
                        var editBoxPassword = editBoxDangNhapInfo.editBoxPassword;
                        var editBoxUserName = editBoxDangNhapInfo.editBoxUserName;
                        if (editBoxUserName && editBoxPassword) {
                            editBoxPassword.string = "";
                        }
                    }
                }
            }
        }
    },
    setUserPasswordCache: function () {
        if (this && cc.isValid(this.node)) {
            var loginViewComponent = this.getLogginViewComponent();
            if (loginViewComponent) {
                //mo popup dang nhap
                loginViewComponent.setUserPasswordCache();
            }
        }

    },
    onLogin: function (message) {
        if (this && this.isValid) {
            // message = message ? Utils.Malicious.parseNumberElementsIn(message) : null;
            Linker.autoLogin = false;
            Linker.redirectOnReconnect = null;
            cc.Global.hideLoading();
            cc.log('Catched message:', message);
            if (Linker.Config && (message.hasOwnProperty("isNewLoginDay"))) {
                Linker.Config.ISLOGINDAY = Number(message.isNewLoginDay);
            }
            if ((message && message.messageId == SocketConstant.COMMON.LOGIN && message.status == 1) || (message.messageId == Constant.CMD.FAST_LOGIN && message.status == 1)) {
                //cc.log("LOGIN_OK", message);
                // cc.Global.hideLoading();
                // this.joinTaiXiu();
                Linker.isLogin = true;
                Linker.isFb = false;
                Linker.userData = {};
                message.zoneId = Number(message.zoneId);
                message.checkMail = Number(message.checkMail);
                message.isActive = Number(message.isActive);
                message.isNewLoginDay = Number(message.isNewLoginDay);
                message.isPayment = Number(message.isPayment);
                message.isPhoneUpdate = Number(message.isPhoneUpdate);
                message.lastRoom = Number(message.lastRoom);
                Linker.DataSuKien.init();
                cc.js.mixin(Linker.userData, message);
                cc.js.mixin(DataAccess.Instance.userData, message);
                if (message.messageId == SocketConstant.COMMON.LOGIN) {
                    this.setUserPasswordCache();
                    cc.Global.loginType = LoginType.Normal;
                } else {
                    cc.Global.loginType = LoginType.FastLogin;
                }
                if (message.isActive == "0" && Linker.userData.displayName.length > 1) {
                    Linker.showDialogActive = true;
                } else {
                    Linker.showDialogActive = false;
                }
                //kyun: Try to reconnect
                if (Linker.userData) {
                    if (!message.zoneId) {
                        //dang nhap binh thuong khong reconnect
                    } else if (message.zoneId && message.zoneId != 0) {
                        this.onReconnect(message);
                    }
                    this.dangNhapThanhCong(message);
                    Linker.isOtherLogin = false;
                } else {
                    this.dangNhapLoi(message);
                    Linker.Socket.close();
                }
                // cc.Global.hideLoading();
            } else {
                this.dangNhapLoi(message);
            }
        }
    },
    onReconnect: function (message) {
        if (message) {
            Linker.ZONE = Number(message.zoneId);
            cc.error("Reconnect....", message);
            if (Number(message.zoneId) == 4) {
                Linker.redirectOnReconnect = 'PHOM';
            } else if (Number(message.zoneId) == 10) {
                Linker.redirectOnReconnect = 'XOCDIA';
            } else if (Number(message.zoneId) == 37) {
                Linker.redirectOnReconnect = 'SAM';
            } else if (Number(message.zoneId) == 5) {
                Linker.redirectOnReconnect = 'TLMN';
            } else if (Number(message.zoneId) == 15) {
                Linker.redirectOnReconnect = 'POKER';
            } else if (Number(message.zoneId) == 14) {
                Linker.redirectOnReconnect = 'MAUBINH';
            } else if (Number(message.zoneId) == 8) {
                Linker.redirectOnReconnect = 'BIDA11';
            } else if (Number(message.zoneId) == 84) {
                Linker.redirectOnReconnect = 'BIDA14';
                //tao lobby
            } else if (Number(message.zoneId) == 86) {
                Linker.redirectOnReconnect = 'BIDAPHOM';
                //tao lobby
            } else if (Number(message.zoneId) == 45) {
                Linker.redirectOnReconnect = 'SOCCERGALAXY';
            }
        }
    },
    joinTaiXiu() {
        var testdata = {
            "r": [{
                "v": "12004\u0004"
            }]
        }
        Linker.Socket.send(JSON.stringify(testdata));
    },
    loadHeroesBallBundle: function (cb) {
        var nameHeroesBallBundle = Constant.BUNDLE.HEROES_BALL.name;
        Utils.Malicious.getGameLoaderBundle(function (err, heroesBallBundle) {
            if (!err) {
                if (cb) {
                    cb(null, heroesBallBundle);
                }
            } else {
                cc.error(err);
                if (cb) {
                    cb(true, null);
                }
            }
        }.bind(this), nameHeroesBallBundle);
    },
    loadDreamCityBundle: function (cb) {
        var nameHeroesBallBundle = Constant.BUNDLE.TRANG_CHU.name;
        Utils.Malicious.getGameLoaderBundle(function (err, heroesBallBundle) {
            if (!err) {
                if (cb) {
                    cb(null, heroesBallBundle);
                }
            } else {
                cc.error(err);
                if (cb) {
                    cb(true, null);
                }
            }
        }.bind(this), nameHeroesBallBundle);
    },
    onRegister: function (message) {
        if (this && cc.isValid(this.node)) {
            cc.Global.hideLoading();
            var loginEventListenerNode = this.node.getChildByName("LoginEventListener");
            var loginViewComponent = this.getLogginViewComponent();
            if (loginEventListenerNode && loginViewComponent) {
                var loginEventListenerScript = loginEventListenerNode.getComponent("LoginEventListener");
                if (loginEventListenerScript) {
                    if (message.status == 1) {
                        if (message.text) {
                            //dang ky thanh cong roi dang nhap -> thay ten hien thi
                            cc.Global.showMessage(i18n.t(message.text));
                        }
                        var userData = Linker.Local.readUserData();
                        userData.isRememberPW = true;
                        userData.autoLogin = false;
                        Linker.Local.saveUserData(userData);
                        var editBoxDangKyInfo = loginViewComponent.getEditBoxDangKyInfo();
                        if (editBoxDangKyInfo) {
                            var username = editBoxDangKyInfo.username;
                            var password = editBoxDangKyInfo.password;

                            var data = {
                                username: username,
                                password: password
                            };
                            loginViewComponent.setEditBoxDangNhapInfo(data);
                        }
                        if (username) {
                            if (userData.isRememberPW) {
                                if (password) {
                                    LoginCache.set(username, password);
                                }
                            } else {
                                LoginCache.set(username, "");
                            }
                        } else {
                            LoginCache.set("", "");
                        }
                        loginEventListenerScript.loginOnRegister();
                    } else {
                        cc.Global.showMessage(i18n.t(message.text));
                    }

                }
            }
        }
    },
    onGetToken: function (data) {
        console.log("onGetToken", data);
        if (data) {
            console.log("onGetToken codata");
            Linker.TOKEN = {
                token: data.token,
                userId: data.userId
            }
            // if(this.cacheLogin){
            //     return;
            // }
            Linker.GameManager.prepareGame((isCanLogin) => {
                if (isCanLogin) {
                    Linker.TOKEN = {
                        token: data.token,
                        userId: data.userId
                    }
                    console.log("onGetToken send login", Linker.TOKEN);
                    var login = CommonSend.loginFb("fb_" + data.userId, 1, ApplicationConfig.PLATFORM, data.token, Global.deviceID);
                    //var login = CommonSend.loginFb("fb_" + data.userId, 1, "android", data.token, "abcdefg");
                    Linker.Socket.send(login);
                    cc.Global.loginType = LoginType.FB;
                } else {
                    cc.Global.hideLoading();
                }

            });
        } else {
            cc.Global.showMessage(i18n.t("Vui lòng thử lại sau"));
        }
    },
    btnFastPlayClick: function () {
        // cc.Global.showLoading();
        // Linker.GameManager.prepareGame((isCanLogin) => {
        //     if (isCanLogin) {
                var data = CommonSend.sendFastLogin();
                Linker.Socket.send(data);
        //     } else {
        //         cc.Global.hideLoading();
        //     }
        // });
    },
    autoLogin: function () {
        var loginViewComponent = this.getLogginViewComponent();
        var password;
        var username;
        if (loginViewComponent) {
            var userData = Linker.Local.readUserData();
            if (userData) {
                var cache = LoginCache.get();
                if (cache.username.length > 0 && cache.password.length > 0) {
                    if (userData.isRememberPW) {
                        loginViewComponent.setEditBoxDangNhapInfo({
                            username: cache.username,
                            password: cache.password
                        });
                        password = cache.password;
                        username = cache.username;
                    } else {
                        loginViewComponent.resetCache();
                        loginViewComponent.setEditBoxDangNhapInfo({
                            username: cache.username.length > 0 ? cache.username : "",
                            password: ""
                        });
                    }
                } else {
                    if (!userData.isRememberPW) {
                        loginViewComponent.resetCache();
                        loginViewComponent.setEditBoxDangNhapInfo({
                            username: cache.username.length > 0 ? cache.username : "",
                            password: ""
                        });
                    }
                }
            }
            if (Linker.autoLogin && username && password) {
                var loginEventListenerNode = this.node.getChildByName("LoginEventListener");
                if (loginEventListenerNode) {
                    var loginEventListenerScript = loginEventListenerNode.getComponent("LoginEventListener");
                    if (loginEventListenerScript) {
                        loginEventListenerScript.login();
                    }
                }
            }
        }
    }
});