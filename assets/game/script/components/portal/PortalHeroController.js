var Utils = require('Utils');
var Linker = require('Linker');
var soccerConstant = require('soccerConstant');
var Constant = require('Constant');
var SocketConstant = require('SocketConstant');
var DataAccess = require('DataAccess');
var CommonSend = require('CommonSend');
var i18n = require('i18n');
const NativeBridge = require('../../utils/NativeBridge');
var SdkBoxUtil = require('SdkBoxUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        portalView: cc.Node,
        portalListener: cc.Node,
        taskPrefab: cc.Prefab
    },
    onLoad() {
        cc.Global.instanceAlert();
        cc.Global.instanceLoading(function (err, loadingPrefab) { }.bind(this));
        this.addCustomEventListener();
        this.addEventListener();
        this.resetLoadingScene();
    },
    resetLoadingScene: function () {
        Linker.AbortByReceiveInvitePlayer = false;
    },
    addEventListener: function () {
        Linker.Event.addEventListener(1101, this.onInvite, this);
        Linker.Event.addEventListener(10001, this.onFastLogin, this);
        Linker.Event.addEventListener("cashIap", this.onSendCashIap, this);
        Linker.Event.addEventListener(SocketConstant.COMMON.IAP, this.onCashIap, this);
        Linker.Event.addEventListener(12031, this.onChallenge, this);

        Linker.Event.addEventListener(1108, this.onMatchStartResponse, this);
        Linker.Event.addEventListener(1100, this.onCreateTableResponse, this);
        Linker.Event.addEventListener(1105, this.onJoinTableResponse, this);
        Linker.Event.addEventListener(1106, this.onPlayerJoinedResponse, this);
    },
    removeEventListener: function () {
        Linker.Event.removeEventListener(1101, this.onInvite, this);
        Linker.Event.removeEventListener(10001, this.onFastLogin, this);
        Linker.Event.removeEventListener("cashIap", this.onSendCashIap, this);
        Linker.Event.removeEventListener(SocketConstant.COMMON.IAP, this.onCashIap, this);
        Linker.Event.removeEventListener(12031, this.onChallenge, this);

        Linker.Event.removeEventListener(1108, this.onMatchStartResponse, this);
        Linker.Event.removeEventListener(1100, this.onCreateTableResponse, this);
        Linker.Event.removeEventListener(1105, this.onJoinTableResponse, this);
        Linker.Event.removeEventListener(1106, this.onPlayerJoinedResponse, this);
    },

    onMatchStartResponse(message) {
        if (message.status == 1) {
            message.isChallenge = true;
            Linker.save_1108_message = message;
        }
    },
    onCreateTableResponse(message) {
        if (message.status == 1) {
            message.isChallenge = true;
            Linker.save_1100_message = message;
        }
    },
    onJoinTableResponse(message) {
        if (message.status == 1) {
            message.isChallenge = true;
            Linker.save_1105_message = message;
        }
    },
    onPlayerJoinedResponse(message) {
        if (message.status == 1) {
            message.isChallenge = true;
            Linker.save_1106_message = message;
        }
    },

    addCustomEventListener: function () {
        cc.error("Add Portal Customevent...");

        //commons dialog
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_CAI_DAT, this.onMoPopupSetting, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, this.onClosePopup, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_PROFILE_USER, this.onMoPopupProfile, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_CHAT_SOCIAL, this.onMoPopupChatSocial, this);

        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_CUA_HANG, this.onMoPopupCuaHang, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_NAP, this.onMoPopupNap, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_SU_KIEN, this.onMoPopupSuKien, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_NHIEM_VU, this.onMoPopupNhiemVu, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_GIFT_CODE, this.onMoPopupGiftCode, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_HOP_THU, this.onMoPopupHopThu, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_HO_TRO, this.onMoPopupHoTro, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_LUCKY_DAY, this.onMoPopupLuckyDay, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_VQMM, this.onMoPopupVqmm, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_BAN_BE, this.onMoPopupBanBe, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_TRO_CHUYEN, this.onMoPopupTroChuyen, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_NO_HU, this.onMoPopupNoHu, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_HUONG_DAN, this.onMoPopupHuongDan, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_HOP_THOAI_DAILY_GIFT, this.onMoHopThoaiDailyGift, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_HOP_THOAI_XAC_NHAN_NHAN_QUA, this.onMoHopThoaiXacNhanNhanQua, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_BACK_TO_HOME, this.onBackToLogin, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_BACK_TO_LOGIN, this.onBackToLogin, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_BACK_TO_SPLASH, this.onBackToSplash, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_OPEN_HOP_THOAI_DOI_TEN_HIEN_THI, this.onMoPopupChangeDisplayName, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.CHANGE_DISPLAY_NAME, this.onChangeName, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_HOP_THOAI_YEU_CAU_CHOI, this.onMoPopupNhanMoiChoi, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_LOAD_BUNDLE_VA_SCENE_NAME_ACCEPT_INVITE, this.onInviteAccept, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.ON_BUTTON_GAME_HALL_SCENE_CLICK, this.onButtonGameClick, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.ON_BUTTON_GAME_BIDA_HALL_SCENE_CLICK, this.onButtonGameBidaClick, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_THONG_BAO_CHUNG, this.onMoHopThoaiThongBaoChung, this);
    },
    onChallenge(message) {
        if (message && Number(message.status)) {
            if (message.message > 0) {
                if (message.zoneId) {
                    Linker.ZONE = message.zoneId;
                }
                var bundleData = Utils.Malicious.getBundleNameAndSceneNameByZoneId(Linker.ZONE);
                if (bundleData) {
                    var bundleName = bundleData.bundleName;
                    var sceneName = bundleData.sceneNameLoad;
                }
                if (message.message == 6 && message.otherUserId == Linker.userData.userId) { // check doi phuong co dong y hay khong
                    this.getBundle(function (err, bundle) {
                        if (!err) {
                            if (!cc.find('Canvas/Alert')) {
                                //khoi tao alert xem co dong y choi hay khong
                                if (cc.Global.alertPrefab && cc.isValid(cc.Global.alertPrefab)) {
                                    var _this = this;
                                    var node = cc.instantiate(cc.Global.alertPrefab);
                                    cc.find('Canvas').addChild(node, cc.macro.MAX_ZINDEX - 1)
                                    var nodeJs = node.getComponent("Alert");
                                    if (nodeJs) {
                                        var msg = message.otherViewName + i18n.t("invite_challenge_text", { name: Utils.Malicious.getNameGameByZone(message.zoneId), bet: message.money });
                                        var type = G.AT.OK_CANCEL;
                                        var okCallback = function () {
                                            node.destroy();
                                            var data = CommonSend.sendChallenge(message.userId, message.otherUserId, message.zoneId, message.money, false, false);
                                            Linker.Socket.send(data);
                                        };
                                        var cancelCallback = function () {
                                            node.destroy();
                                            var data = CommonSend.sendChallenge(message.userId, message.otherUserId, message.zoneId, message.money, true, false);
                                            Linker.Socket.send(data);
                                        };
                                        nodeJs.setString(msg);
                                        nodeJs.setType(type);
                                        nodeJs.setCallBack(okCallback, cancelCallback);
                                    }
                                } else {
                                    cc.Global.instanceAlert();
                                }
                            }
                        } else {
                            cc.error("Lỗi", err);
                        }
                    }.bind(this), bundleName);
                } else if (message.message == 5) { // chap nhan thanh cong
                    this.getBundle(function (err, bundle) {
                        if (!err) {
                            bundle.loadScene(sceneName, function (err, scene) {
                                cc.Global.hideLoading();
                                if (!err) {
                                    cc.director.runScene(scene, null, function (err, data) {
                                        if (!err) {
                                            cc.Global.hideLoading();
                                            cc.error("Loaded scene success portal...", sceneName);
                                            NativeBridge.changeOrientationH(false);
                                        }
                                    }.bind(this));
                                }
                            })
                        } else {
                            cc.error("Lỗi", err);
                        }
                    }.bind(this), bundleName);
                } else if (message.message == 2) {
                    cc.Global.showMessage(i18n.t("Người chơi đã hủy thách đấu"));
                }
            } else {
                if (message.message == -6) {
                    cc.Global.showMessage(i18n.t("Người chơi không online"));
                } else if (message.message == -7) {
                    cc.Global.showMessage(i18n.t("Người chơi không phản hồi"));
                } else if (message.message == -8) {
                    cc.Global.showMessage(i18n.t("Người chơi không đồng ý"));
                } else if (message.message == -9) {
                    cc.Global.showMessage(i18n.t("Người chơi đã hủy thách đấu"));
                }
            }
        } else {
            cc.Global.showMessage(i18n.t("Có lỗi xảy ra, vui lòng thử lại sau"));
        }
    },
    onSendCashIap(receipt) {
        cc.log("onSendCashIap:" + receipt);
        if (receipt) {
            var login = CommonSend.CashIap2(receipt.receipt, cc.Global.IapType);
            Linker.Socket.send(login);
        }
    },
    onCashIap(message) {
        cc.log("onCashIap:");
        cc.log(message);
        if (message) {
            if (message.data) {
                cc.Global.showMessage(message.data);
            }
            DataAccess.Instance.requestUserData();
        }
    },
    onInvite: function (message) {
        if (this && cc.isValid(this.node)) {
            this.onMoPopupNhanMoiChoi(message);
        }
    },
    onMoPopupSetting: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupSetting(event);
        }
    },
    onMoPopupTaoBan: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupTaoBan(event);
        }
    },
    onRequestSetting: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onRequestSetting(event);
        }
    },
    onMoPopupChatSocial: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupChatSocial(event);
        }
    },
    onMoPopupFormation: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            if (Linker.ZONE == soccerConstant.ZONE_ID.ZONE_1VS1) {
                portalView.onMoPopupFormation(event);
            }
        }
    },
    onClosePopup: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onClosePopup(event);
        }
    },
    onMoPopupProfile: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupProfile(event);
        }
    },
    onMoPopupCuaHang: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupCuaHang(event);
        }
    },
    onMoPopupNap: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupNap(event);
        }
    },
    onMoPopupSuKien: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupSuKien(event);
        }
    },
    onMoPopupNhiemVu: function (event) {
        // var portalView = this.getPortalViewComponent();
        // if (portalView) {
        //     portalView.onMoPopupNhiemVu(event);
        // }
        if (this.node.getChildByName("Task")) {
            this.node.getChildByName("Task").active = true;
        } else {
            const task = cc.instantiate(this.taskPrefab);
            this.node.addChild(task);
        }
    },
    onMoPopupGiftCode: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupGiftCode(event);
        }
    },
    onMoPopupHopThu: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupHopThu(event);
        }
    },
    onMoPopupHoTro: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupHoTro(event);
        }
    },
    onMoPopupLuckyDay: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupLuckyDay(event);
        }
    },
    onMoPopupVqmm: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupVqmm(event);
        }
    },
    onMoPopupBanBe: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupBanBe(event);
        }
    },
    onMoPopupTroChuyen: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupTroChuyen(event);
        }
    },
    onMoPopupNoHu: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupNoHu(event);
        }
    },
    onMoPopupHuongDan: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupHuongDan(event);
        }
    },
    onBackToLogin: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onBackToLogin(event);
        }
    },
    onBackToSplash: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onBackToSplash(event);
        }
    },
    onMoPopupChangeDisplayName: function () {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupChangeDisplayName();
        }
    },
    onChangeName: function () {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onChangeName();
        }
    },
    onMoPopupNhanMoiChoi: function (event) {
        if (event) {
            var portalView = this.getPortalViewComponent();
            if (portalView) {
                portalView.onMoPopupNhanMoiChoi(event);
            }
        }
    },
    onMoHopThoaiDailyGift: function (event) {
        if (event) {
            var portalView = this.getPortalViewComponent();
            if (portalView) {
                portalView.onMoHopThoaiDailyGift(event);
            }
        }
    },
    onMoHopThoaiXacNhanNhanQua: function (event) {
        if (event) {
            var portalView = this.getPortalViewComponent();
            if (portalView) {
                portalView.onMoHopThoaiXacNhanNhanQua(event);
            }
        }
    },
    onInviteAccept: function (event) {
        if (event) {
            var portalView = this.getPortalViewComponent();
            if (portalView) {
                portalView.onInviteAccept(event);
            }
        }
    },
    onMoHopThoaiThongBaoChung: function (event) {
        if (event) {
            var portalView = this.getPortalViewComponent();
            if (portalView) {
                portalView.onMoHopThoaiThongBaoChung(event);
            }
        }
    },
    onButtonGameClick: function (event) {
        if (event) {
            var portalListener = this.getPortalListenerComponent();
            if (portalListener) {
                portalListener.onButtonClick(event);
            }
        }
    },
    onButtonGameBidaClick: function (event) {
        if (event) {
            var portalListener = this.getPortalListenerComponent();
            if (portalListener) {
                portalListener.onToggleBidaChoose(event);
            }
        }
    },
    onResetLobbyAndGameTable: function (event) {
        console.log("Start: Config Lobby", Linker.ZONE, event);
        if (Linker.ZONE) {
            //vao lobby truoc tien roi
            var portalView = this.getPortalViewComponent();

            if (portalView) {
                Linker._sceneTag = Constant.TAG.scenes.LOBBY;
                //lobby controller
                portalView.initLobby({
                    zoneId: Linker.ZONE
                });
                //update setting
                portalView.onCloseAllCommonsPopup();
                //sau do moi vao ban
                if (event) {
                    if (event.isLeaveTable || event.isChangeZone) {
                        console.log('--3');
                        portalView.requestDataJoinZone();
                        
                    }
                }
            }
        }
    },
    configTopBottomLayer: function () {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.configTopBottomLayer();
        }
    },

    getPortalViewComponent: function () {
        return this.portalView? this.portalView.getComponent("PortalHeroView"): null;
    },
    getPortalListenerComponent: function () {
        return this.portalListener.getComponent("PortalHeroEventListener");
    },
    unBlockItemTable: function () {
        var lobbyViewScript = this.getLobbyViewController();
        if (lobbyViewScript) {
            lobbyViewScript.unBlockItemTable();
        }
    },
    onDestroy: function () {
        Linker.MoneyTypeSpriteFrame = null;
        this.removeEventListener();
    },

    onFastLogin(message) {
        if (message.status == 1) {
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
                        //this.setUserPasswordCache();
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
                        //this.dangNhapThanhCong(message);
                        Linker.isOtherLogin = false;
                    } else {
                        //this.dangNhapLoi(message);
                        Linker.Socket.close();
                    }
                    // cc.Global.hideLoading();
                } else {
                    //this.dangNhapLoi(message);
                }
                this.getPortalViewComponent().startPortalHeroView();
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
            } else if (Number(message.zoneId) == 48) {
                Linker.redirectOnReconnect = 'CongKichCuongBao';
            }
        }
    },
    getBundle: function (cb, bundleName) {
        if (bundleName) {
            Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                if (!err) {
                    if (cb) {
                        cb(null, gameLoaderBundle)
                    }
                } else {
                    cc.error(err);
                    if (cb) {
                        cb(err, null);
                    }
                }
            }.bind(this), bundleName);
        } else {
            if (cb) {
                cb(true, null);
            }
        }
    },
    // update (dt) {},
    onClickShareFB(){
        SdkBoxUtil.btnShareFB();
    },
});
