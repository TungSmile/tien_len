var Utils = require('Utils');
var Linker = require('Linker');
var soccerConstant = require('soccerConstant');
var Constant = require('Constant');
var HeadBallConstant = require("HeadBallConstant");
var FootBallConstant = require("FootBallConstant");
var BiDaConstant = require('BiDaConstant');
var TLMNConstant = require('TLMNConstant');
var PhomConstant = require('PhomConstant');
var NewAudioManager = require('NewAudioManager');
var Global = require('Global');
var LobbySend = require("LobbySend");
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
var DataAccess = require('DataAccess');

cc.Class({
    extends: cc.Component,

    properties: {
        portalView: cc.Node
    },
    onLoad() {
        Linker.PortalController = this;
        this.addCustomEventListener();
        this.addEventListener();
        NewAudioManager.LoadSound(Linker.gameLanguage);
    },
    addEventListener: function () {
        Linker.Event.addEventListener(1101, this.onInvite, this);
    },
    removeEventListener: function () {
        Linker.Event.removeEventListener(1101, this.onInvite, this);
    },
    onDestroy: function () {
        this.removeEventListener();
    },
    addCustomEventListener: function () {
        cc.error("Add Portal Customevent... portal");
        this.node.on(Constant.GAME_LOBBY_EVENT.LOBBY_YEU_CAU_TAO_BAN_CHOI, this.onCreateSoccerMatch, this);
        this.node.on(Constant.GAME_LOBBY_EVENT.LOBBY_ITEM_BAN_YEU_CAU_BLOCK_SU_KIEN_CLICK, this.onResetBlockEventLobby, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_KHOI_TAO_LAI_LOBBY, this.onResetLobbyAndGameTable, this);
        //lobby
        this.node.on(Constant.GAME_LOBBY_EVENT.CREATE_TABLE_ADD_ROOM, this.onMoPopupTaoBan, this);
        this.node.on(Constant.GAME_LOBBY_EVENT.YEU_CAU_ACTIVE_LOBBY, this.onAvtiveLobby, this);
        //commons dialog
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_CAI_DAT, this.onMoPopupSetting, this);

        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_THONG_BAO_CHUNG, this.onMoHopThoaiThongBaoChung, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_REQUEST_THONG_TIN_CAI_DAT_PORTAL, this.onRequestSetting, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.RESET_THONG_TIN_CAI_DAT_BAN_CHOI, this.onResetSetting, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_DOI_HINH, this.onMoPopupFormation, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, this.onClosePopup, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_PROFILE_USER, this.onMoPopupProfile, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_NHIEM_VU, this.onMoPopupNhiemVu, this);

        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_CUA_HANG, this.onMoPopupCuaHang, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_NAP, this.onMoPopupNap, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_SU_KIEN, this.onMoPopupSuKien, this);
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

        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_BACK_TO_HOME, this.onBackToHome, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_BACK_TO_LOGIN, this.onBackToLogin, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_BACK_TO_SPLASH, this.onBackToSplash, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_OPEN_HOP_THOAI_DOI_TEN_HIEN_THI, this.onMoPopupChangeDisplayName, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_HOP_THOAI_YEU_CAU_CHOI, this.onMoPopupNhanMoiChoi, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_LOAD_BUNDLE_VA_SCENE_NAME_ACCEPT_INVITE, this.onInviteAccept, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_HOP_THOAI_MOI_CHOI, this.onMoPopupGuiMoiChoi, this);

    },
    onInvite: function (message) {
        if (message) {
            if (this && cc.isValid(this)) {
                if (message.status == 1) {
                    this.onMoPopupNhanMoiChoi(message);
                } else {
                    cc.Global.showMessage(message.error);
                }
            }
        }
    },

    onAvtiveLobby: function (event) {
        console.log("onAvtiveLobby----");
        if (event) {
            var portalView = this.getPortalViewComponent();
            if (portalView) {
                portalView.activeLobby(event.active);
            }
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
    onMoHopThoaiThongBaoChung: function (event) {
        if (event) {
            var portalView = this.getPortalViewComponent();
            if (portalView) {
                portalView.onMoHopThoaiThongBaoChung(event);
            }
        }
    },
    onRequestSetting: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onRequestSetting(event);
        }
    },
    onResetSetting: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onResetSetting(event);
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
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupSuKien(event);
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
    onMoHopThoaiDailyGift: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoHopThoaiDailyGift(event);
        }
    },
    onMoHopThoaiXacNhanNhanQua: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoHopThoaiXacNhanNhanQua(event);
        }
    },
    onBackToHome: function (event) {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onBackToHome(event);
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
    onMoPopupNhanMoiChoi: function (event) {
        if (event) {
            var portalView = this.getPortalViewComponent();
            if (portalView) {
                portalView.onMoPopupNhanMoiChoi(event);
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
    onMoPopupGuiMoiChoi: function () {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            portalView.onMoPopupGuiMoiChoi();
        }
    },
    onResetLobbyAndGameTable: function (event) {
        console.log("onResetLobbyAndGameTable----");
        if (event && event.isReset) {
            this.onStartLobby();
        } else {
            cc.error("Start: Config Lobby", Linker.ZONE, event);
            if (Linker.ZONE) {
                //vao lobby truoc tien roi
                var lobbyViewScript = this.getLobbyViewController();
                if (lobbyViewScript) {
                    lobbyViewScript.activeBlockLobby({
                        enableBlock: false
                    });
                }

                var portalView = this.getPortalViewComponent();
                portalView.onResetBlockEventLobby({
                    enableBlock: false
                });
                if (portalView) {
                    Linker._sceneTag = Constant.TAG.scenes.LOBBY;
                   
                    portalView.showGameLayer(false);
                    //lobby controller
                    portalView.initLobby({
                        zoneId: Linker.ZONE
                    });
                    //update setting
                    portalView.onCloseAllCommonsPopup();
                    //sau do moi vao ban
                    if (event) {
                        if (event.isLeaveTable || event.isChangeZone) {
                            console.log('--7');
                            portalView.requestDataJoinZone();
                        }
                    }
                }
            }
        }

    },
    onStartLobby: function () {
        console.log("onStartLobby---");
        this.onResetLobbyAndGameTable();
        if (Linker.ZONE == FootBallConstant.ZONE_ID.ZONEID_PENALTY) {
            this.bundleName;
            this.bundleSceneNameObj = Utils.Malicious.getBundleNameAndSceneNameByZoneId(Linker.ZONE);
            if (this.bundleSceneNameObj) {
                this.bundleName = this.bundleSceneNameObj.bundleName;
            }
            var filePath = NewAudioManager.SOUND_GAME.FOOT_BALL.COMMON.BACKGROUND;
            NewAudioManager.playAudioClipFX(filePath, 1, false, false, this.bundleName);
        }
    },
    start() {
        this.onStartLobby();
    },
    getPortalViewComponent: function () {
        var portalView = this.portalView.getComponent("PortalView");
        if (!portalView) {
            portalView = this.portalView.getComponent("PortalViewGhepDoi");
        }
        return portalView;
    },
    unBlockItemTable: function () {
        var lobbyViewScript = this.getLobbyViewController();
        if (lobbyViewScript) {
            lobbyViewScript.unBlockItemTable();
        }
    },
    blockItemTable: function () {
        var lobbyViewScript = this.getLobbyViewController();
        if (lobbyViewScript) {
            lobbyViewScript.blockItemTable();
        }
    },
    getLobbyViewController: function () {
        var portalView = this.getPortalViewComponent();
        if (portalView) {
            var lobbyLayer = portalView.lobbyLayer;
            if (lobbyLayer) {
                var lobby = lobbyLayer.getChildByName("Lobby");
                if (lobby) {
                    var lobbyController = lobby.getComponent("LobbyController");
                    if (lobbyController) {
                        var lobbyView = lobbyController.lobbyView;
                        if (lobbyView) {
                            var lobbyViewScript = lobbyView.getComponent("LobbyView");
                            if (lobbyViewScript) {
                                return lobbyViewScript;
                            }
                        }
                    }
                }
            }
        }
        return null;
    },
    onCreateSoccerMatch: function (event) {
        console.log("onCreateSoccerMatch------");
        if (event) {
            var portalView = this.getPortalViewComponent();
            if (portalView) {
                if (Linker.ZONE == soccerConstant.ZONE_ID.ZONE_1VS1) {
                    portalView.createSoccerMatch(event);
                } else if (Linker.ZONE == HeadBallConstant.ZONE_ID.LOBBY) {
                    portalView.createHeadBallMatch(event);
                } else if (Linker.ZONE == FootBallConstant.ZONE_ID.ZONEID_PENALTY) {
                    portalView.createFootBallMatch(event);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    portalView.createBidaGame(event);
                } else if (Linker.ZONE == TLMNConstant.ZONEID) {
                    cc.Global.showLoading();
                    portalView.createTLMNGame(event);
                } else if (Linker.ZONE == PhomConstant.ZONEID) {
                    cc.Global.showLoading();
                    portalView.createPhomGame(event);
                } else if (Linker.ZONE == 14) {
                    cc.Global.showLoading();
                    portalView.createMauBinhGame(event);
                } else if (Linker.ZONE == 48) {
                    //this.requestGhepDoi();
                    portalView.createShootingGame(event);
                } else if (Linker.ZONE == 47) {
                    portalView.createDraggerMatch(event);
                } else if (Linker.ZONE == 15) {
                    portalView.createPokerGame(event);
                }
            }
        }
    },
    onResetBlockEventLobby: function (event) {
        if (event) {
            var portalView = this.getPortalViewComponent();
            if (portalView) {
                portalView.onResetBlockEventLobby(event);
            }

        }
    },
    onDestroy: function () {
        Linker.MoneyTypeSpriteFrame = null;
    },

    requestGhepDoi: function () {
        var zoneId = Linker.ZONE;
        var uid = Linker.userData.userId;
        var money = 1000;
        if (parseInt(zoneId) != 0 && parseInt(uid) != 0 && (isNaN(money) == false && Number(money) != 0)) {
            var data = LobbySend.requestGhepDoi(uid, zoneId, money);
            Linker.Socket.send(data);
        }
    },
    // update (dt) {},
});