var soccerConstant = require('soccerConstant');
var Linker = require('Linker');
var Utils = require('Utils');
var Constant = require('Constant');
var HeadBallConstant = require("HeadBallConstant");
var NewAudioManager = require('NewAudioManager');
var Global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
        portalTopLayer: cc.Node,
        portalOnTopLayer: cc.Node,
        portalBottomTopContainer: cc.Node,
        portalMidContainer: cc.Node,
        commonTopBottomPrefab: cc.Prefab,
    },
    configTopBottomLayer: function () {
        this.portalBottomTopContainer.removeAllChildren(true);
        var commonTopBottom = cc.instantiate(this.commonTopBottomPrefab);
        this.portalBottomTopContainer.addChild(commonTopBottom);
    },

    onMoPopupChangeDisplayName: function () {
        var portalTopLayerScript = this.getPortalTopLayerComponent();
        if (portalTopLayerScript) {
            portalTopLayerScript.onMoPopupChangeDisplayName();
        }
    },
    onChangeName: function () {
        this.showActiveAccountDialog();
    },
    onMoPopupNhanMoiChoi: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupNhanMoiChoi(event);
            }
        }
    },
    onMoHopThoaiDailyGift: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalOnTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoHopThoaiDailyGift(event);
            }
        }
    },
    onMoHopThoaiXacNhanNhanQua: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalOnTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoHopThoaiXacNhanNhanQua(event);
            }
        }
    },
    onInviteAccept: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onInviteAccept(event);
            }
        }
    },
    onMoPopupKichHoatTaiKhoan: function () {
        var portalOnTopLayerScript = this.getPortalOnTopLayerComponent();
        if (portalOnTopLayerScript) {
            portalOnTopLayerScript.onMoPopupKichHoatTaiKhoan();
        }
    },
    showLoading: function () {
        var portalOnTopLayerScript = this.getPortalOnTopLayerComponent();
        if (portalOnTopLayerScript) {
            portalOnTopLayerScript.onShowLoading();
        }
    },
    onHideLoading: function () {
        var portalOnTopLayerScript = this.getPortalOnTopLayerComponent();
        if (portalOnTopLayerScript) {
            portalOnTopLayerScript.onHideLoading();
        }
    },
    onMoPopupSetting: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupSetting(event);
            }
        }
    },
    onMoPopupTaoBan: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupTaoBan(event);
            }
        }
    },
    onRequestSetting: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onRequestSetting(event);
            }
        }
    },
    onClosePopup: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onClosePopup(event);
            }
            var portalOnTopLayerScript = this.getPortalOnTopLayerComponent();
            if (portalOnTopLayerScript) {
                portalOnTopLayerScript.onClosePopup(event);
            }

        }
    },
    onMoPopupFormation: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupFormation(event);
            }
        }
    },
    onMoPopupProfile: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupProfile(event);
            }
        }
    },
    onMoPopupCuaHang: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupCuaHang(event);
            }
        }
    },
    onMoPopupNhiemVu: function(event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupNhiemVu(event);
            }
        }
    },
    onMoPopupNap: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupNap(event);
            }
        }
    },
    onMoPopupSuKien: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupSuKien(event);
            }
        }
    },
    onMoPopupGiftCode: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupGiftCode(event);
            }
        }
    },
    onMoPopupHopThu: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupHopThu(event);
            }
        }
    },
    onMoPopupHoTro: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupHoTro(event);
            }
        }
    },
    onMoPopupLuckyDay: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupLuckyDay(event);
            }
        }
    },
    onMoPopupVqmm: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupVqmm(event);
            }
        }
    },
    onMoPopupBanBe: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupBanBe(event);
            }
        }
    },
    onMoPopupTroChuyen: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupTroChuyen(event);
            }
        }
    },
    onMoPopupChatSocial: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupChatSocial(event);
            }
        }
    },
    // by Son
    onMoPopupMXH: function (event) {
        cc.error("CLICK: PortalHeroView");
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupMXH(event);
            }
        }
    },
    // by Son
    onMoPopupNoHu: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupNoHu(event);
            }
        }
    },
    onMoPopupHuongDan: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupHuongDan(event);
            }
        }
    },
    onBackToLogin: function (event) {
        if (event) {
            //phai preload hallscene nhung hien tai lay bida lam scene chinh nen load bida scene
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onBackToLogin(event);
            }
        }
    },
    onBackToSplash: function (event) {
        if (event) {
            //phai preload hallscene nhung hien tai lay bida lam scene chinh nen load bida scene
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onBackToSplash(event);
            }
        }
    },
    getPortalTopLayerComponent: function () {
        return this.portalTopLayer.getComponent("PortalTopLayer");
    },
    getPortalOnTopLayerComponent: function () {
        return this.portalOnTopLayer.getComponent("PortalOnTopLayer");
    },
    start() {
        this.betaGame();
    },
    betaGame: function () {
        cc.error("Start: Layer 2");
        this.configTopBottomLayer();
        this.resetTopPortalLayer();
        this.checkShowDialog();
        this.resetMidPortalLayer();
        this.initMidPortalLayer();

        //chay xuyen suot thoi gian
        NewAudioManager.stopSoundBackground();
        NewAudioManager.playBackground(NewAudioManager.SOUND_GAME.COMMON.BACKGROUND, 1.0, true, false);
    },
    checkShowDialog() {
        if (Linker.userData && (Linker.userData.hasOwnProperty("displayName") && Linker.userData.displayName.trim() == "")) {
            Linker.showDialogActive = false;
            this.showChangeDisplayName();
        } else {
            this.showActiveAccountDialog();
        }
    },
    startPortalHeroView() {

        this.configTopBottomLayer();
        this.resetTopPortalLayer();
        if (Linker.userData && (Linker.userData.hasOwnProperty("displayName") && Linker.userData.displayName.trim() == "")) {
            Linker.showDialogActive = false;
            this.showChangeDisplayName();
        } else {
            this.showActiveAccountDialog();
        }
        this.resetMidPortalLayer();
        this.initMidPortalLayer();

        //chay xuyen suot thoi gian
        NewAudioManager.stopSoundBackground();
        NewAudioManager.playBackground(NewAudioManager.SOUND_GAME.COMMON.BACKGROUND, 1.0, true, false);
    },

    showChangeDisplayName: function () {
        this.onMoPopupChangeDisplayName();
    },
    showActiveAccountDialog: function () {
        // if (Linker.userData && Linker.userData.isActive == 0 || Linker.userData.isActive == "0") {
        //     Linker.showDialogActive = true;
        // } else {
        //     Linker.showDialogActive = false;
        // }
        // if (Linker.showDialogActive) {
        //     this.onMoPopupKichHoatTaiKhoan();
        // }
    },

    resetMidPortalLayer: function () {
        var portalMidLayerScript = this.getPortalMidLayerComponent();
        if (portalMidLayerScript) {
            portalMidLayerScript.resetListGameContent();
        }
    },
    initMidPortalLayer: function () {
        var portalMidLayerScript = this.getPortalMidLayerComponent();
        if (portalMidLayerScript) {
            portalMidLayerScript.initListGame();
        }
    },
    getPortalMidLayerComponent: function () {
        if (this.portalMidContainer && cc.isValid(this.portalMidContainer)) {
            return this.portalMidContainer.getComponent("PortalMidLayer");
        }
        return null;
    },
    resetTopPortalLayer: function () {
        this.portalTopLayer.removeAllChildren(true);
        var portalTopLayerScript = this.getPortalTopLayerComponent();
        if (portalTopLayerScript) {
            portalTopLayerScript.offAllLayer();
        }
    },
    onCloseAllCommonsPopup: function () {
        var portalTopLayerScript = this.getPortalTopLayerComponent();
        if (portalTopLayerScript) {
            portalTopLayerScript.offAllLayer();
        }
    }
});
