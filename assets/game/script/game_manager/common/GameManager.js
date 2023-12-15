var Linker = require('Linker');
var ParseData = require('ParseData');
var CommonParse = require('CommonParse');
var SlotParse = require('SlotParse');
var TaiXiuParse = require('TaiXiuParse');
var SocketConstant = require('SocketConstant');
var Constant = require('Constant');

var LobbyParse = require('LobbyParse');
var CommonSend = require('CommonSend');
var XocDiaParse = require('XocDiaParse');
var MiniPokerParse = require('MiniPokerParse');
var Global = require('Global');
var SceneManager = require('SceneManager');
var Utils = require('Utils');
var LoginCache = require('LoginCache');

var BiDaParse = require('BiDaParse');
var PhomParse = require('PhomParse');
var MauBinhParse = require('MauBinhParse');
var PokerParse = require('PokerParse');

var NewAudioManager = require('NewAudioManager');
var GameManager1108 = require('GameManager1108');
var GameManager1100 = require('GameManager1100');
var GameManager2000 = require('GameManager2000');
var GameManager3 = require('GameManager3');
var GameManager1105 = require('GameManager1105');
var GameManager121007 = require('GameManager121007');
var GameManager1242 = require('GameManager1242');
var GameManager1106 = require("GameManager1106");
var GameManager1114 = require("GameManager1114");
var GameManager1112 = require("GameManager1112");
var GameManager1104 = require("GameManager1104");
var GameManager1246 = require("GameManager1246");
var GameManager1103 = require("GameManager1103");
var GameManager12021 = require("GameManager12021");
var BiDaConstant = require('BiDaConstant');
var gameEvent = require('CommonGameEvent');
var ChatBoxParse = require("ChatBoxParse");
var i18n = require('i18n');
var NativeBridge = require('NativeBridge');
cc.Class({
    extends: cc.Component,

    properties: {
        loadingProgressBar: cc.Sprite,
        txtMessage: cc.Label
    },
    onLoad() {
        Linker.GameManager = this;
        cc.game.addPersistRootNode(this.node);
        cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
            var userData = Linker.Local.readUserData();
            userData.isFirstLaunch = true;
            Linker.Local.saveUserData(userData);
        });
        cc.log('cc.game.isPersistRootNode', cc.game.isPersistRootNode(this.node));
        // Api.get("http://apilbg.langbagian.com/api-config", (data) => {
        //     cc.log(data);
        //     // data.version = 0;
        //     Linker.Config = data;
        //     var seq = cc.sequence(cc.delayTime(2), cc.callFunc(() => {
        //         cc.director.loadScene("LoginScene");
        //     }));
        //     Linker.GameManager.node.runAction(seq);
        // });
        this.pingTime = 0;
        Linker.gameLanguage = cc.sys.localStorage.getItem("languageCode");
        if (!Linker.gameLanguage) {
            Linker.gameLanguage = cc.sys.language;
            if (!Linker.gameLanguage) {
                Linker.gameLanguage = BiDaConstant.LANGUAGE.ENGLISH;
            }
        }
        cc.Global.loadClip();
        NewAudioManager.LoadCommonSoundGame();
        NewAudioManager.stopSoundBackground();
        //xu ly an hien game
        gameEvent.commonEvent(this);
        //end test

    },
    start() {
        this.addSocketEvent();
        //    this.PingPong();
        i18n.init(Linker.gameLanguage);
    },

    PingPong() {
        cc.Global.Reconnectinterval = setInterval(function () {
            if (require('Linker').pongtime) {
                var timenow = new Date().getTime();
                var time = timenow - require('Linker').pongtime;

                if (!cc.sys.isNative && Linker.lastTimeManipulation && timenow - Linker.lastTimeManipulation > 600000) {
                    cc.log('*** timeout no action');
                    Linker.Socket.closeToReconnect();
                    clearInterval(cc.Global.Reconnectinterval);
                    Linker.countReconnect = 0;
                    if (Global.Announcement.AnnouncePrefab && Global.Announcement.GlobalNodePrefab) {
                        var gNode = cc.instantiate(Global.Announcement.GlobalNodePrefab);
                        var gNodeC = gNode.getComponent("GlobalNode");
                        if (gNodeC) {
                            Global.Announcement._addChild(gNode);
                            var _this = this;
                            gNodeC.alert("message_lost_connection", G.AT.OK_CANCEL, () => {
                                cc.log("*** vaoket noi lai");
                                Linker.pongtime = new Date().getTime() - 6000;
                                Linker.GameManager.PingPong();
                                Linker.GameManager.autoLoginByWhenPlayGameChan();
                                Global.Announcement._removeAllChild();
                                Global.Announcement.AnnounceNode.active = false;

                            }, () => {
                                clearInterval(cc.Global.Reconnectinterval);

                                var userData = Linker.Local.readUserData();
                                userData.autoLogin = false;
                                Linker.Local.saveUserData(userData);
                                if (cc.Global.intervalTopHu) {
                                    clearInterval(cc.Global.intervalTopHu);
                                }
                                Global.Announcement._removeAllChild();
                                Global.Announcement.AnnounceNode.active = false;
                                cc.Global.hideLoading();
                                cc.log("goi tu day 1");
                                _this.showLogin();
                                // cc.director.preloadScene("Login", function (completedCount, totalCount, item) {
                                cc.director.preloadScene("TrangChu", function (completedCount, totalCount, item) {
                                    var percent = completedCount / totalCount;
                                }, function (err, data) {
                                    cc.Global.hideLoading();
                                    if (!err) {
                                        var userData = Linker.Local.readUserData();
                                        userData.autoLogin = false;
                                        Linker.Local.saveUserData(userData);
                                        cc.director.loadScene('TrangChu', () => {
                                            cc.Global.hideLoading();
                                        });
                                    } else {
                                        cc.log("Không thể load lại homescene lỗi xảy ra...");
                                    }
                                });

                            });
                        }
                    }
                } else if (time > 5000) {
                    if (!Linker.countReconnect) {
                        Linker.countReconnect = 1;
                    } else {
                        Linker.countReconnect++;
                    }
                    if (Linker.countReconnect >= 3) {
                        //reconnect
                    } else {
                        cc.log('*** đã đến lúc cần phải kết nối lại!');
                        Linker.Socket.closeToReconnect();
                        // Linker.GameManager.autoLoginByWhenPlayGameChan();
                    }
                }
            }
        }, 3000);
    },
    pingToServer: function () {
        Linker.Socket.send(CommonSend.pingToServer());
    },
    offMiniGame: function () {
        Linker.Event.dispatchEvent(Constant.CMD.XOCDIA_LOST_CONNECT);
    },
    addSocketEvent() {
        //Linker.Event.addEventListener("token", this.onGetToken,this);
        Linker.Event.addEventListener(SocketConstant.COMMON.LOGIN, this.onLogin, this);
        Linker.Event.addEventListener(SocketConstant.COMMON.LOGIN_FB, this.onLoginFb, this);

    },
    prepareGame(login) {
        Linker.isLoadLogin = false;
        this.isLoaded = false;
        this.isConnected = false;
        //cc.director.preloadScene("LoginScene");
        // cc.director.preloadScene("TaiXiuScene");

        // var urlSocket = "ws://" + Linker.BASE_SOCKET + ":"+Linker.BASE_PORT+"/websocket";
        var urlSocket = "ws://68.183.235.191:9090/websocket";
        
        //Tai xiu socket
        // var urlSocket = "ws://" + Linker.BASE_SOCKET + ":9097/websocket";
        //urlSocket = "ws://s1.sime.club:9091/websocket";
        // var urlSocket = "ws://" + Linker.BASE_SOCKET + ":9090/websocket";

        if (!cc.sys.isNative) {
            //  urlSocket = "wss://" + Linker.BASE_SOCKET + "/websocket";
        }
        Linker.Socket.open(urlSocket, function (isConnected) {
            Linker.GameManager = this;
            Linker.GameManager.isConnected = isConnected;
            cc.log("Linker.Socket.open isConnected:", isConnected);
            if (!Linker.GameManager.isConnected && !Linker.BiDaOfflineController) {
                cc.log("Linker.Socket.open Linker.logoutSocket:", Linker.logoutSocket);
                // Linker.Event.eventListeners=null;
                if (Linker.logoutSocket) {
                    Linker.logoutSocket = false;
                    this.showReconnectDialog();
                    // if (login) {
                    //     login(false);
                    // }
                    return;
                }
                if (!isConnected) {
                    cc.Global.hideLoading();
                    this.showReconnectDialog();
                    Linker.showMessage(i18n.t("Can not connect to the internet, please check the network again."));
                    return;
                }
                if (Linker.isLogin) {
                    Linker.isLogin = false;
                    //cc.Global.showMessage("Tài khoản đã đăng nhập ở thiết bị khác");
                    // cc.Global.showMessage("Lỗi kết nối");

                    Linker.isOtherLogin = true;
                } else {
                    Linker.isLogin = false;
                    // cc.Global.showMessage("Lỗi kết nối");

                    Linker.isOtherLogin = true;
                }
                if (login) {
                    login(false);
                }
                if (Global.Announcement.AnnouncePrefab && Global.Announcement.GlobalNodePrefab) {
                    var gNode = cc.instantiate(Global.Announcement.GlobalNodePrefab);
                    var gNodeC = gNode.getComponent("GlobalNode");
                    if (gNodeC) {
                        Global.Announcement._addChild(gNode);
                        var _this = this;
                        gNodeC.alert(i18n.t("message_lost_connection"), G.AT.OK_CANCEL, function () {
                            cc.log("vao dang nhap lai");
                            var authen = LoginCache.get();
                            if (Utils.Malicious.getLengthObj(authen) < 2) {
                                authen.username = "";
                                authen.password = "";
                            }
                            if (authen.hasOwnProperty("username") && authen.hasOwnProperty("password") && authen.password.length > 0 && authen.username.length > 0) {
                                if (!Linker.isFb) {
                                    if (cc.Global.loginType == LoginType.Normal) {
                                        Linker.LoginController.loginBtnClick({
                                            username: authen.username,
                                            password: authen.password
                                        })
                                    } else {
                                        Linker.Socket.send(CommonSend.sendFastLogin());
                                    }

                                } else {
                                    var login = CommonSend.loginFb("fb_" + Linker.TOKEN.userId, 1, ApplicationConfig.PLATFORM, Linker.TOKEN.token, Global.deviceID);
                                    //var login = CommonSend.loginFb("fb_" + data.userId, 1, "android", data.token, "abcdefg");
                                    Linker.Socket.send(login);
                                }
                            } else {
                                Linker.Socket.close();
                                Linker.isLogin = false;
                                if (Linker.isFb) {
                                    Linker.MySdk.logoutFb();
                                    Linker.isFb = false;
                                }
                                // if (!Global.LoginHandler.IS_REM_PASSWORD) {
                                //     LoginCache.remove();
                                //     cc.log("Remove password remember ...");
                                // }
                                cc.log("goi tu day 2");
                                _this.showLogin();

                            }
                            Global.Announcement._removeAllChild();
                            Global.Announcement.AnnounceNode.active = false;
                        }.bind(this), function () {
                            Global.Announcement._removeAllChild();
                            Global.Announcement.AnnounceNode.active = false;
                            cc.log("goi tu day 3");
                            _this.showLogin();
                        }.bind(this));
                    } else {
                        Linker.showMessage(i18n.t("Can not connect to the internet, please check the network again."));
                    }

                } else {
                    Linker.showMessage(i18n.t("Can not connect to the internet, please check the network again."));
                }
                Utils.Malicious.setActiveLayer(Linker._sceneTag);
            } else {
                if (login) {
                    login(true);
                }
            }
        }.bind(this));
        Linker.Socket.onMessage(this.onSocketMesage);
    },
    showReconnectDialog() {
        var _this = this;
        if (cc.Global.alertPrefab && cc.isValid(cc.Global.alertPrefab)) {
            Linker.CURRENT_TABLE = null;
            if (cc.director.getScene().name == "Login" || cc.director.getScene().name == "New Node" || cc.find('Canvas/Alert') || Linker.isLogOut || (Linker.HomeManager && Linker.HomeManager.isActiveLogin())) {
                Linker.isLogOut = false;
                return;
            }
            var node = cc.instantiate(cc.Global.alertPrefab);
            cc.find('Canvas').addChild(node, cc.macro.MAX_ZINDEX)
            var nodeJs = node.getComponent("Alert");
            if (nodeJs) {
                var msg = i18n.t("message_lost_connection");
                var type = G.AT.OK_CANCEL;
                var okCallback = function () {
                    if (Linker.GameManager.isConnected) {
                        // check neu trong ban choi thi load lai scene
                        node.destroy();
                    }
                    // check neu trong ban choi thi load lai scene
                    _this.autoLoginByWhenPlayGameChan();
                };
                var cancelCallback = function () {
                    node.destroy();
                    Linker.Socket.close();
                    Linker.isLogin = false;
                    if (Linker.isFb) {
                        Linker.MySdk.logoutFb();
                        Linker.isFb = false;
                    }
                    // cc.director.loadScene("Login", function () {
                    //     var scene = cc.director.getScene();
                    //     var canvas = scene.getChildByName("Canvas");

                    //     canvas.opacity = 0;
                    //     cc.tween(canvas)
                    //         .to(0.5, {
                    //             opacity: 255
                    //         })
                    //         .start();
                    // })
                    if (cc.director.getScene().name == "TrangChu") {
                        Linker.HomeManager.showLayer();
                    } else {
                        cc.director.loadScene("TrangChu", function () {
                            NativeBridge.changeOrientationH(true);
                            var scene = cc.director.getScene();
                            var canvas = scene.getChildByName("Canvas");
                            canvas.opacity = 0;
                            cc.tween(canvas)
                                .to(0.5, {
                                    opacity: 255
                                })
                                .start();
                            Linker.Socket.close();
                        })
                    }
                };
                nodeJs.setString(msg);
                nodeJs.setType(type);
                nodeJs.setCallBack(okCallback, cancelCallback);
            }
        } else {
            cc.Global.instanceAlert(function (err, result) {
                if (!err && cc.Global.alertPrefab && cc.isValid(cc.Global.alertPrefab)) {
                    _this.showReconnectDialog();
                }
            });
        }
    },
    checkReconnectGame: function () {
        var sceneNameArray = ["TLMN", "XocDia", "Poker", "Sam", "Phom", "MauBinh", "BaCay", "BidaGame", "SoccerGalaxy", "LIENG", "GameSceneCKCB", "PhiDaoGame"];
        var currSceneName = cc.director.getScene().name;
        if (sceneNameArray.indexOf(currSceneName) !== -1) {
            cc.Global.showLoading();
            if ((Linker.userData.lastRoom > 0 && Linker.ZONE > 0) || Linker._sceneTag == Constant.TAG.scenes.GAME) {
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
                                gameLoaderBundle.loadScene(sceneName, function (err, scene) {
                                    cc.Global.hideLoading();
                                    if (!err) {
                                        cc.director.runScene(scene, null, function () {
                                            if (!err) {
                                                cc.Global.hideLoading();
                                                cc.error("Loaded scene success gamemanager...", sceneName);
                                            }
                                        }.bind(this));
                                    }
                                })
                            } else {
                                cc.Global.hideLoading();
                                cc.error(err);
                                Linker.isLoadingRecconnectGame = false;
                            }
                        }.bind(this), bundleName);
                    }
                }
            } else {
                cc.Global.hideLoading();
            }
        }
    },
    showLogin: function () {
        if (Linker.LoginController && cc.isValid(Linker.LoginController)) {
            var _tmpN = Linker.LoginController.node;
            if (_tmpN && cc.isValid(_tmpN)) {
                //logout thanh cong
                var customEvent = new cc.Event.EventCustom(BiDaConstant.LOGIN_EVENT.LOGOUTED_SUCCESS, true);
                _tmpN.dispatchEvent(customEvent);
            }
        }
        cc.log("vao day de thiet lap lai");
        cc.log("vao day de thiet lap lai", cc.Global.getSceneName());
        if (cc.Global.getSceneName() == 'BiDaSplash') {
            if (this && cc.isValid(this)) {
                var mySdk = this.node.getComponent("MySdk");
                if (mySdk && cc.isValid(mySdk)) {
                    mySdk.DialogReconnect.active = true;
                    mySdk.DialogReconnect.opacity = 255;
                    Utils.Malicious.setMaxZindex(mySdk.DialogReconnect.parent, mySdk.DialogReconnect);
                    cc.log("vao day de thiet lap lai", cc.Global.getSceneName());
                    cc.log("vao day de thiet lap lai", mySdk.DialogReconnect.active);
                }
            }
        }
    },
    showErrorLogin: function () {
        cc.Global.hideLoading();
        Global.Announcement._removeAllChild();
        Linker.Socket.close();
        Linker.isLogin = false;
        if (Linker.isFb) {
            Linker.MySdk.logoutFb();
            Linker.isFb = false;
        }
        var userData = Linker.Local.readUserData();
        userData.autoLogin = false;
        Linker.Local.saveUserData(userData);
        // cc.director.loadScene("Login", function () {
        cc.director.loadScene("TrangChu", function () {
            var scene = cc.director.getScene();
            var canvas = scene.getChildByName("Canvas");
            cc.Global.showMessage(i18n.t("Đăng nhập không thành công, vui lòng kiểm tra lại kết nối mạng"));
            canvas.opacity = 0;
            cc.tween(canvas)
                .to(0.5, {
                    opacity: 255
                })
                .start();
        })
    },
    autoLoginByWhenPlayGameChan() {
        //cc.log("autoLoginByWhenPlayGameChan Linker.userData:", Linker.userData);
        var _this = this;
        if (cc.Global.intervalTopHu) {
            clearInterval(cc.Global.intervalTopHu);
        }
        if (Linker.isFb && Linker.TOKEN) { //dung cho login fb
            this.prepareGame((isCanLogin) => {
                if (isCanLogin) {
                    var login = CommonSend.loginFb("fb_" + Linker.TOKEN.userId, 1, cc.Global.getDeviceName(), Linker.TOKEN.token, Global.deviceID);
                    Linker.Socket.send(login);
                } else {
                    _this.showErrorLogin();
                }
            });
        } else {
            this.prepareGame((isCanLogin) => {
                if (isCanLogin) {
                    var cache = LoginCache.get();
                    if (Utils.Malicious.getLengthObj(cache) < 2) {
                        cache.username = "";
                        cache.password = "";
                    }
                    if (cache.username && cc.Global.loginType == LoginType.Normal) {
                        var message = CommonSend.login(cache.username, cache.password, "2", cc.Global.getDeviceName(), Global.deviceID);
                        Linker.Socket.send(message);
                    } else if (cc.Global.loginType == LoginType.FastLogin) {
                        Linker.Socket.send(CommonSend.sendFastLogin());
                    }
                } else {
                    _this.showErrorLogin();
                }
            });
        }
        Linker.autoLoginByWhenPlayGameChan = true;
        Utils.Malicious.setActiveLayer(Linker._sceneTag);
    },
    onLogin(message) { //dung cho login tu chan back ra
        cc.log('Catched message:', message, Linker.autoLoginByWhenPlayGameChan);
        if ((message && message.messageId == SocketConstant.COMMON.LOGIN && message.status == 1)) {
            //cc.log("LOGIN_OK", message);
            if (Linker.Config && (message.hasOwnProperty("isNewLoginDay"))) {
                Linker.Config.ISLOGINDAY = Number(message.isNewLoginDay);
            }
            Linker.isLogin = true;
            Linker.isFb = false;
            message.zoneId = Number(message.zoneId);
            message.checkMail = Number(message.checkMail);
            message.isActive = Number(message.isActive);
            message.isNewLoginDay = Number(message.isNewLoginDay);
            message.isPayment = Number(message.isPayment);
            message.isPhoneUpdate = Number(message.isPhoneUpdate);
            message.lastRoom = Number(message.lastRoom);
            Linker.userData = message;

            Linker.isOtherLogin = false;
            if (Linker.autoLoginByWhenPlayGameChan || (message.zoneId && message.alertEmailContent.length > 0)) {
                // if (message.zoneId && message.alertEmailContent.length > 0) {
                //     cc.Global.showMessage(message.alertEmailContent);
                // }
                // this.joinTaiXiu();
                if (message.zoneId) {
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
                this.checkReconnectGame();
                Linker.autoLoginByWhenPlayGameChan = false;
            }

        } else {
            //cc.log("LOGIN_FAIL", message);

        }
    },
    onLoginFb(message) {
        cc.log("onLoginFb");
        if ((message && message.messageId == SocketConstant.COMMON.LOGIN_FB && message.status == 1)) {
            //cc.log("LOGIN_OK", message);
            if (Linker.Config && (message.hasOwnProperty("isNewLoginDay"))) {
                Linker.Config.ISLOGINDAY = Number(message.isNewLoginDay);
            }
            Linker.isLogin = true;
            Linker.isFb = true;
            message.zoneId = Number(message.zoneId);
            message.checkMail = Number(message.checkMail);
            message.isActive = Number(message.isActive);
            message.isNewLoginDay = Number(message.isNewLoginDay);
            message.isPayment = Number(message.isPayment);
            message.isPhoneUpdate = Number(message.isPhoneUpdate);
            message.lastRoom = Number(message.lastRoom);
            Linker.userData = message;
            Linker.isOtherLogin = false;
            if (Linker.autoLoginByWhenPlayGameChan || (message.zoneId && message.alertEmailContent.length > 0)) {
                // if (message.zoneId && message.alertEmailContent.length > 0) {
                //     cc.Global.showMessage(message.alertEmailContent);
                // }
                // this.joinTaiXiu();
                if (message.zoneId) {
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
                this.checkReconnectGame();
                Linker.autoLoginByWhenPlayGameChan = false;
            }

        } else {
            //cc.log("LOGIN_FAIL", message);

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
    onSocketMesage(message) {
        require('Linker').pongtime = new Date().getTime();
        if (cc.director.getScene().getChildByName('Alert')) {
            if (cc.find('Alert/AlertNode/Label').getComponent(cc.Label).string == 'Mất kết nối vui lòng thử lại？') {
                clearInterval(cc.Global.Reconnectinterval);
                // Linker.GameManager.PingPong();
            }
            cc.director.getScene().getChildren().forEach(item => {
                if (item.name == 'Alert' && item.getChildByName('AlertNode').getChildByName('Label').getComponent(cc.Label).string == 'Mất kết nối vui lòng thử lại？') {
                    item.destroy();
                }
            });
        }
        ParseData.parse(message.data).forEach(element => {
            var tempData = element;
            //cc.log(tempData.messageId);
            if (Linker.isLogin) {
                switch (Number(tempData.messageId)) {

                    case 1: {
                        var response = CommonParse.parse(tempData);
                        //cc.log("ping response data",response);
                        Linker.pingCountResponse -= 1;
                        cc.Global.PINGTIME = new Date().getTime();
                        break;
                    }

                    case 1005: {
                        var response = SlotParse.parse(tempData);
                        cc.log(response);
                        if (response.id == 701) {
                            Linker.Event.dispatchEvent(701, response);
                        } else if (response.id == 901) {
                            Linker.Event.dispatchEvent(901, response);
                        } else {
                            Linker.Event.dispatchEvent(1005, response);
                        }
                        break;
                    }
                    case 10051: {
                        var response = SlotParse.parse(tempData);
                        cc.log(response);
                        Linker.Event.dispatchEvent(10051, response);
                        break;
                    }
                    case 1006: {
                        var response = SlotParse.parse(tempData);
                        Linker.Event.dispatchEvent(1006, response);
                        //cc.log("LIXI___");
                        break;
                    }
                    case SocketConstant.GAME.TAI_XIU.JOIN_TAI_XIU: {
                        var response = TaiXiuParse.parse(tempData);
                        Linker.Event.dispatchEvent(SocketConstant.GAME.TAI_XIU.JOIN_TAI_XIU, response);
                        break;
                    }
                    case SocketConstant.GAME.TAI_XIU.UPDATE_TAI_XIU: {
                        var response = TaiXiuParse.parse(tempData);
                        Linker.Event.dispatchEvent(SocketConstant.GAME.TAI_XIU.UPDATE_TAI_XIU, response);
                        break;
                    }
                    case SocketConstant.GAME.TAI_XIU.BET_TAI_XIU: {
                        var response = TaiXiuParse.parse(tempData);
                        cc.log(response);
                        Linker.Event.dispatchEvent(SocketConstant.GAME.TAI_XIU.BET_TAI_XIU, response);
                        break;
                    }
                    case SocketConstant.GAME.TAI_XIU.PHIEN_TX_STATE: {
                        var response = TaiXiuParse.parse(tempData);
                        // cc.log(response);
                        Linker.Event.dispatchEvent(SocketConstant.GAME.TAI_XIU.PHIEN_TX_STATE, response);
                        break;
                    }
                    case SocketConstant.GAME.TAI_XIU.CHAT_TAI_XIU: {
                        var response = TaiXiuParse.parse(tempData);
                        cc.log(response);
                        Linker.Event.dispatchEvent(SocketConstant.GAME.TAI_XIU.CHAT_TAI_XIU, response);
                        break;
                    }
                    case SocketConstant.GAME.MINIPOKER.SPIN: //add by zep
                        {
                            cc.log("SocketConstant.GAME.MINIPOKER.SPIN");
                            var response = MiniPokerParse.parse(tempData);
                            cc.log(response);
                            Linker.Event.dispatchEvent(SocketConstant.GAME.MINIPOKER.SPIN, response);
                            break;
                        }

                };
            } else {
                //Not logged in
            }

            switch (Number(tempData.messageId)) {
                case SocketConstant.COMMON.LOGIN: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(SocketConstant.COMMON.LOGIN, response);
                    break;
                }
                //:__: Change password
                case 10901: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(10901, response);
                    break;
                }
                case 10001: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(10001, response);
                    break;
                }
                case 14001: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.ServerZone = response;
                    break;
                }
                case 1004: {
                    var response = CommonParse.parse(tempData);
                    var parseListHu = {};
                    if (response.hasOwnProperty("listHu")) {
                        response.listHu.forEach(function (hu, index) {
                            parseListHu[hu[0].id] = hu;
                        });
                        Linker.Hu = response;
                        Linker.Hu.listHu = parseListHu;
                        Linker.Event.dispatchEvent(1004, Linker.Hu);
                        // cc.log("Linker.Hu", response);
                    }
                    break;
                }
                case 1115: {
                    var response = CommonParse.parse(tempData);
                    Linker.Event.dispatchEvent(SocketConstant.COMMON.REGISTER, response);
                    cc.log(response);
                    break;
                }
                case SocketConstant.COMMON.UPDATE_CRASH: {
                    var response = CommonParse.parse(tempData);
                    //Linker.userData.userMoney = response.userMoney;
                    Linker.userData.userExp = response.userExp;
                    Linker.userData.isActive = response.isActive;
                    cc.log(response);
                    Linker.FootBall.infoMe = response;
                    cc.log("USER_MONEY", Linker.userData.userMoney);
                    if (Linker.HallView && Linker.HallView.isValid) {
                        Linker.HallView.updateUserMoney();
                    }
                    Linker.Event.dispatchEvent(SocketConstant.COMMON.UPDATE_CRASH, response);
                    break;
                }
                case 9999: {
                    Linker.ZONE = null;
                    Linker.Event.dispatchEvent(9999, response);
                    var sceneName;
                    var _sceneInfos = cc.game._sceneInfos
                    for (var i = 0; i < _sceneInfos.length; i++) {
                        if (_sceneInfos[i].uuid == cc.director._scene._id) {
                            sceneName = _sceneInfos[i].url
                            sceneName = sceneName.substring(sceneName.lastIndexOf('/') + 1).match(/[^\.]+/)[0]
                        }
                    }
                    Linker.Socket.close();
                    var userData = Linker.Local.readUserData();
                    userData.autoLogin = false;
                    Linker.Local.saveUserData(userData);
                    if (cc.Global.intervalTopHu) {
                        clearInterval(cc.Global.intervalTopHu);
                    }
                    // cc.director.loadScene("Login", function () {
                    //     var scene = cc.director.getScene();
                    //     var canvas = scene.getChildByName("Canvas");
                    //     cc.Global.showMessage('Đã có người khác đăng nhập vào nick này!');
                    //     canvas.opacity = 0;
                    //     cc.tween(canvas)
                    //         .to(0.5, {
                    //             opacity: 255
                    //         })
                    //         .start();
                    //     Linker.Socket.close();
                    // })

                    if (cc.director.getScene().name == "TrangChu") {
                        Linker.HomeManager.showLayer();
                        cc.Global.showMessage(i18n.t("Someone has logged into this account!"));
                    } else {
                        cc.director.loadScene("TrangChu", function () {
                            NativeBridge.changeOrientationH(true);
                            var scene = cc.director.getScene();
                            var canvas = scene.getChildByName("Canvas");
                            cc.Global.showMessage(i18n.t("Someone has logged into this account!"));
                            canvas.opacity = 0;
                            cc.tween(canvas)
                                .to(0.5, {
                                    opacity: 255
                                })
                                .start();
                            Linker.Socket.close();
                        })
                    }

                    break;
                }
                case 14002: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(14002, response);
                    Linker.API_EVENT = response;
                    break;
                }
                case 80: {
                    cc.log("*** tempData 80 ", tempData);
                    // var response = ParseData.parse(tempData);
                    // cc.log(response);
                    Linker.Event.dispatchEvent(80, tempData);

                    break;
                }
                case 83: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(83, response);

                    break;
                }
                case 1202: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1202, response);

                    break;
                }
                case 2: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(2, response);

                    break;
                }
                case 2016020: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(2016020, response);

                    break;
                }
                case 400003: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(400003, response);

                    break;
                }
                case 400002: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(400002, response);

                    break;
                }
                case 14003: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(14003, response);

                    break;
                }
                case 1203: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1203, response);
                    break;
                }
                case 1204: {
                    cc.log(tempData);
                    Linker.Event.dispatchEvent(1204, tempData);
                    break;
                }
                case 7010: {
                    cc.log(tempData);
                    Linker.Event.dispatchEvent(7010, tempData);
                    break;
                }
                case 7051: {
                    var response = CommonParse.parse(tempData);
                    cc.log(tempData);
                    Linker.Event.dispatchEvent(7051, response);
                    break;
                }
                case 8: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(8, response);
                    break;
                }
                case 1506: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1506, response);

                    break;
                }
                case 4000: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(4000, response);

                    break;
                }
                case 400004: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(400004, response);

                    break;
                }
                case 400005: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(400005, response);

                    break;
                }
                case 400006: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(400006, response);

                    break;
                }
                case 400007: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(400007, response);

                    break;
                }
                case 121001: {
                    var response = CommonParse.parse(tempData);
                    cc.log("121001" + response);
                    Linker.Event.dispatchEvent(121001, response);

                    break;
                }
                case 121005: {
                    var response = MauBinhParse.parse(tempData);
                    Linker.Event.dispatchEvent(121005, response);
                    break;
                }
                case 121006: {
                    var response = MauBinhParse.parse(tempData);
                    Linker.Event.dispatchEvent(121006, response);
                    break;
                }
                case 121009: {
                    var response = MauBinhParse.parse(tempData);
                    Linker.Event.dispatchEvent(121009, response);
                    break;
                }
                case 1123: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1123, response);

                    break;
                }
                case 1208: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1208, response);

                    break;
                }
                case 57: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(57, response);

                    break;
                }
                case 58: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(58, response);

                    break;
                }
                case 14000: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(14000, response);

                    break;
                }
                case 12011: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(12011, response);
                    break;
                }
                case 12015: {
                    var response = CommonParse.parse(tempData);
                    cc.error(tempData);
                    Linker.Event.dispatchEvent(12015, response);
                    break;
                }
                case 100001: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(100001, response);
                    break;
                }
                case 110710: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(110710, response);
                    break;
                }
                case 110701: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(110701, response);
                    break;
                }
                case 1103: {
                    GameManager1103.load(tempData);
                    break;
                }
                case 75: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(75, response);
                    break;
                }
                case 1110: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1110, response);
                    break;
                }
                case 1102: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1102, response);
                    break;
                }
                case 1212: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1212, response);
                    break;
                }
                case 1101: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1101, response);
                    break;
                }

                case 1108: {
                    GameManager1108.load(tempData);
                    break;
                }
                case 1100: {
                    cc.error(tempData);
                    GameManager1100.load(tempData);
                    break;
                }
                case 1245: {
                    switch (Linker.ZONE) {
                        case 14: {
                            var response = MauBinhParse.parse(tempData);
                            Linker.Event.dispatchEvent(1245, response);
                            break;
                        }
                    }
                }
                case 1246: {
                    GameManager1246.load(tempData);
                    break;
                }
                case 1241: {
                    switch (Linker.ZONE) {
                        case 4: {
                            var response = LobbyParse.parse(tempData);
                            cc.log(response);
                            Linker.Event.dispatchEvent(1241, response);
                            break;
                        }
                        case 37: {
                            var response = LobbyParse.parse(tempData);
                            cc.log(response);
                            Linker.Event.dispatchEvent(1241, response);
                            break;
                        }
                        case 15: {
                            var response = LobbyParse.parse(tempData);
                            cc.log(response);
                            Linker.Event.dispatchEvent(1241, response);
                            break;
                        }
                        case 8: {
                            var response = LobbyParse.parse(tempData);
                            cc.log(response);
                            Linker.Event.dispatchEvent(1241, response);
                            break;
                        }
                        case 84: {
                            var response = LobbyParse.parse(tempData);
                            cc.log(response);
                            Linker.Event.dispatchEvent(1241, response);
                            break;
                        }
                        case 86: {
                            var response = LobbyParse.parse(tempData);
                            cc.log(response);
                            Linker.Event.dispatchEvent(1241, response);
                            break;
                        }
                        case 10: {
                            break;
                        }
                    }
                    break;
                }
                case 1243: {
                    var response = CommonParse.parse(tempData);
                    cc.log(tempData);
                    Linker.Event.dispatchEvent(1243, response);
                    break;
                }
                case 12017: {
                    var response = CommonParse.parse(tempData);
                    // cc.log(tempData);
                    Linker.Event.dispatchEvent(12017, response);
                    break;
                }
                case 121007: {
                    GameManager121007.load(tempData);
                    break;
                }
                case 1105: {
                    cc.error("1105 return ", tempData);

                    GameManager1105.load(tempData);

                    break;
                }
                case 12021: {
                    cc.error(tempData);
                    var response = GameManager12021.load(tempData);
                    Linker.Event.dispatchEvent(12021, response);
                    break;
                }

                case 121010: {
                    var response = PokerParse.parse(tempData);
                    Linker.Event.dispatchEvent(121010, response);
                    break;
                }

                case 3: {
                    GameManager3.load(tempData);
                    break;
                }
                case 1242: {
                    GameManager1242.load(tempData);
                    break;
                }
                case 1104: {
                    GameManager1104.load(tempData);
                    break;
                }
                case 1106: {
                    cc.error("1106 return ", tempData);
                    GameManager1106.load(tempData);
                    break;
                }
                case 1116: {
                    var response = CommonParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1116, response);
                    break;
                }
                case 1114: {
                    GameManager1114.load(tempData);
                    break;
                }
                case 1112: {
                    GameManager1112.load(tempData);
                    break;
                }

                case 1125: {
                    var response = PhomParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1125, response);
                    break;
                }
                case 1126: {
                    var response = PhomParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1126, response);
                    break;
                }
                case 1128: {
                    var response = PhomParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1128, response);
                    break;
                }
                case 1127: {
                    var response = PhomParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1127, response);
                    break;
                }
                //kyun Add new
                case 1300: {
                    var response = XocDiaParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1300, response);
                    break;
                }
                case 73: {
                    var response = BiDaParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(73, response);
                    break;
                }

                case 1301: {
                    var response = XocDiaParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1301, response);
                    break;
                }
                case 1303: {
                    var response = BiDaParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1303, response);
                    break;
                }
                case 13001: {
                    var response = XocDiaParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(13001, response);
                    break;
                }
                case 13002: {
                    var response = XocDiaParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(13002, response);
                    break;
                }
                case 13008: {
                    var response = XocDiaParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(13008, response);
                    break;
                }
                case 2000: {
                    GameManager2000.load(tempData);
                    break;
                }
                case 13006: {
                    var response = XocDiaParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(13006, response);
                    break;
                }
                case 13007: {
                    var response = XocDiaParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(13007, response);
                    break;
                }
                case 13004: {
                    var response = XocDiaParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(13004, response);
                    break;
                }
                // by Son
                case 260198: {
                    cc.log(tempData);
                    const response = ChatBoxParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(260198, response);
                    break;
                }
                case 270198: {
                    cc.log(tempData);
                    const response = ChatBoxParse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(270198, response);
                    break;
                }
                case 280198: {
                    cc.log(tempData);
                    const response = ChatBoxParse.parse(tempData);
                    Linker.Event.dispatchEvent(280198, response);
                    break;
                }
                case 290198: {
                    cc.log(tempData);
                    const response = ChatBoxParse.parse(tempData);
                    //cc.log(response);
                    Linker.Event.dispatchEvent(290198, response);
                    break;
                }

                case 19721: {
                    cc.log(tempData);
                    const response = CommonParse.parse(tempData);
                    //cc.log(response);
                    Linker.Event.dispatchEvent(19721, response);
                    break;
                }
                // by Son
                case SocketConstant.COMMON.CONFIG_DATA: //add by zep , get config server
                    {
                        var response = JSON.parse(tempData.data);
                        cc.log("CONFIG_DATA", response);
                        cc.log(response);
                        Global.configPurchase = response;
                        Linker.configPurchase = response;
                        console.log('Catch Global.configPurchase:', Global.configPurchase.API_URL);
                        Linker.Event.dispatchEvent(SocketConstant.COMMON.CONFIG_DATA, response);
                        // if (cc.sys.isNative || location.hostname == 'localhost') { // ko s
                        //     Api.get(Global.configPurchase.API_URL.replace('https', 'http') + "api-config-zone-chan", (data) => {

                        //         if (data) {
                        //             cc.Global.zoneData = data;
                        //         }
                        //     });
                        // } else { // co s
                        //     Api.get(Global.configPurchase.API_URL + "api-config-zone-chan", (data) => {
                        //         if (data) {
                        //             cc.Global.zoneData = data;
                        //         }
                        //     });
                        // }
                        if (!Linker.redirectOnReconnect) {
                            // if (Linker.TopHuController) {
                            //     Linker.TopHuController.initTophu();
                            // }
                        }
                        cc.sys.localStorage.setItem("CONFIG_DATA", response);
                        cc.log('cc.Global.zoneData', cc.Global.zoneData);
                        break;
                    }
                case SocketConstant.COMMON.UPDATE_PHONE: //add by zep
                    {
                        cc.log("SocketConstant UPDATE_PHONE");
                        cc.log(tempData);
                        //var response = CommonParse.parse(tempData);
                        var response = tempData.data //JSON.parse(tempData);
                        cc.log(response);
                        Linker.Event.dispatchEvent(SocketConstant.COMMON.UPDATE_PHONE, response);
                        break;
                    }



                case 1009: {
                    var response = MiniPokerParse.parse(tempData);
                    Linker.Event.dispatchEvent(SocketConstant.GAME.MINIPOKER.INFO, response);
                    break;
                }
                case SocketConstant.COMMON.IAP: {
                    var response = CommonParse.parse(tempData);
                    Linker.Event.dispatchEvent(SocketConstant.COMMON.IAP, response);
                    break;
                }
                case 12031: {
                    var response = CommonParse.parse(tempData);
                    Linker.Event.dispatchEvent(12031, response);
                    break;
                }
            };

        });
    },
    isLoginTop: function () {
        var canvas = cc.find("Canvas");
        var BillardPortalHandler = canvas.getChildByName("BillardPortalHandler");
        if (BillardPortalHandler) {
            var BillardPortalHandlerCmp = BillardPortalHandler.getComponent("BillardPortalHandler");
            if (BillardPortalHandlerCmp) {
                var BillardLoginTop = BillardPortalHandlerCmp.getLoginTop();
                if (BillardLoginTop && BillardLoginTop.active == true) {
                    return true;
                }
                return false;
            } else {
                return false;
            }
        }
        return false;
    },
    checkNameScene: function () {
        if ((cc.Global.getSceneName() == "BiDaHomeScene" && !this.isLoginTop()) && (cc.Global.getSceneName() != "" && (cc.Global.getSceneName() != "BiDaOffline" || cc.Global.getSceneName() != "BiDaSplash" || cc.Global.getSceneName() != "Splash"))) {
            return true;
        }
        return false;
    },
    checkNameSceneByAutoLogin: function () {
        if (cc.Global.getSceneName() == "BiDaOffline" || cc.Global.getSceneName() == "Login" || cc.Global.getSceneName() == "Splash") {
            return false;
        }
        return true;
    },
    checkValidHomeScene: function () {
        if (Linker._sceneTag == Constant.TAG.scenes.GAME || Linker._sceneTag == Constant.TAG.scenes.LOBBY || Linker._sceneTag == Constant.TAG.scenes.HOME) {
            return true;
        }
        return false;
    },

    update(dt) {
        if (Linker.GameManager && this && cc.isValid(this.node)) {
            this.pingTime += dt;
            if (this.checkValidHomeScene()) {
                if (this.pingTime > 5 && Linker.isLogin ||
                    (!Linker.isLogin && !this.isConnected && this.pingTime > 5)) {
                    this.pingTime = 0;
                    if (!this.isPlayOffline && this.checkNameSceneByAutoLogin()) { //neu ping khong tra ve data thi tu dong login lai
                        cc.Global.PINGTIME = new Date().getTime();
                        Linker.pingCountResponse += 1;
                        Linker.Socket.send(CommonSend.pingToServer());
                        cc.log("Linker.pingCountResponse", Linker.pingCountResponse);
                        if (Linker.pingCountResponse >= 4 && !Linker.BiDaOfflineController) { //neu ping khong tra ve data thi tu dong login lai
                            cc.Global.showMessage(i18n.t("message_unstable_network"));
                            Linker.pingCountResponse = 0;
                            // if (Linker._sceneTag == Constant.TAG.scenes.GAME) {
                            //     this.scheduleOnce(function () {
                            //         this.autoLoginByWhenPlayGameChan();
                            //     }, 1);
                            // }
                            var sceneName = cc.Global.getSceneName();
                            if (sceneName && sceneName != "Login") {
                                this.scheduleOnce(function () {
                                    cc.error("Dang nhap lai...", sceneName);
                                    if (!Linker.Socket.isOpen() && Linker.HomeManager && !Linker.HomeManager.isActiveLogin()) {
                                        Linker.isLogin = false;
                                        this.autoLoginByWhenPlayGameChan();
                                    }
                                }, 1);
                            }
                        }
                    }
                }
            }
        }
    }
});