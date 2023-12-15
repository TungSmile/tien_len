var Utils = require('Utils');
var soccerConstant = require('soccerConstant');
var Linker = require('Linker');
var SoccerGalaxySend = require('SoccerGalaxySend');
var Constant = require('Constant');
var BiDaConstant = require('BiDaConstant');
var FootBallConstant = require('FootBallConstant');
var HeadBallConstant = require("HeadBallConstant");
var NewAudioManager = require("NewAudioManager");
var DataAccess = require('DataAccess');
var NodePoolManager = require('NodePoolManager');
var LobbySend = require("LobbySend");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    btnAvatarOnClick: function (event) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_PROFILE_USER, true);
        customEvent.userId = Number(Linker.userData.userId);
        this.node.dispatchEvent(customEvent);
    },
    btnDoiHinhOnClick: function (event) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_DOI_HINH, true);
        this.node.dispatchEvent(customEvent);
    },
    btnCuaHangOnClick: function (event) {
        Linker.ShopType = 1;
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_CUA_HANG, true);
        this.node.dispatchEvent(customEvent);
    },
    btnNapOnClick: function (event) {
        Linker.ShopType = 0;
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_NAP, true);
        this.node.dispatchEvent(customEvent);
    },
    btnCaiDatOnClick: function (event) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_CAI_DAT, true);
        this.node.dispatchEvent(customEvent);
    },
    btnSuKienOnClick: function (event) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_SU_KIEN, true);
        this.node.dispatchEvent(customEvent);
    },
    btnGiftCodeOnClick: function (event) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_GIFT_CODE, true);
        this.node.dispatchEvent(customEvent);
    },
    btnHopThuOnClick: function (event) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_HOP_THU, true);
        this.node.dispatchEvent(customEvent);
    },
    btnHoTroOnClick: function (event) {
        if (event) {
            var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_HO_TRO, true);
            var wpos = event.currentTarget.parent.convertToWorldSpaceAR(event.currentTarget.position);
            customEvent.buttonLayout = {
                width: event.currentTarget.width,
                height: event.currentTarget.height,
                x: wpos.x,
                y: wpos.y,
            }
            this.node.dispatchEvent(customEvent);
        }
    },
    btnLuckyDayOnClick: function (event) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_LUCKY_DAY, true);
        this.node.dispatchEvent(customEvent);
    },
    btnVQMMOnClick: function (event) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_VQMM, true);
        this.node.dispatchEvent(customEvent);
    },
    btnBanBeOnClick: function (event) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_BAN_BE, true);
        this.node.dispatchEvent(customEvent);
    },
    btnTroChuyenOnClick: function (event) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_TRO_CHUYEN, true);
        this.node.dispatchEvent(customEvent);
    },
    btnHuongDanOnClick: function (event) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_HUONG_DAN, true);
        this.node.dispatchEvent(customEvent);
    },
    btnBackLobbyOnClick: function (event) {
        console.log("btnBackLobbyOnClick2------");
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_BACK_TO_HOME, true);
        this.node.dispatchEvent(customEvent);
    },
    btnNapXuOnClick: function (event) {
        Linker.ShopType = 0;
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_NAP, true);
        customEvent.isNapXu = true;
        this.node.dispatchEvent(customEvent);
    },
    btnAdsOnClick: function (event) {
        console.log("btnAdsOnClick");
        if (Linker.MySdk) {
            Linker.MySdk.showRewarded();
        } else {
            console.log("khong co sdk");
        }
    },
    btnAdsBannerOnClick: function (event) {
        console.log("btnAdsBannerOnClick");
        if (Linker.MySdk) {
            Linker.MySdk.showInterstitial();
        } else {
            console.log("khong co sdk");
        }
    },
    btnNapQuanOnClick: function (event) {
        Linker.ShopType = 0;
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_NAP, true);
        customEvent.isNapQuan = true;
        this.node.dispatchEvent(customEvent);
    },
    btnQuanOnToggle: function (toggle) {
        if (toggle.isChecked) {
            NewAudioManager.playClick(NewAudioManager.SOUND_GAME.COMMON.CHANGE_QUAN, 0.1, false);
            this.toggleXu.uncheck();
            this.requestChangeQuanMoneyType();
        }
    },
    btnXuOnToggle: function (toggle) {
        // if (toggle.isChecked) {
        //     NewAudioManager.playClick(NewAudioManager.SOUND_GAME.COMMON.CHANGE_XU, 0.1, false);
        //     this.toggleQuan.uncheck();
        //     this.requestChangeXuMoneyType();
        // }
    },
    requestChangeQuanMoneyType: function () {
        // var moneyType = Number(cc.Global.moneyType);
        // if (moneyType == 1) {
        //     cc.error("Khong request change zone quan");
        // } else {
        //     this.requestChangeMoneyType(1);
        // }
    },
    requestChangeXuMoneyType: function () {
        var moneyType = Number(cc.Global.moneyType);
        if (moneyType == 0) {
            cc.error("Khong request change zone xu")
        } else {
            this.requestChangeMoneyType(0);
        }
    },
    requestChangeMoneyType: function (type) {
        // var data = SoccerGalaxySend.sendChangeMoneyType(type);
        // if (data) {
        //     Linker.Socket.send(data);
        // }
    },

    requestGhepDoi: function () {
        var zoneId = Linker.ZONE;
        var uid = Linker.userData.userId;
        var money = Linker.LobbyGeneralController.getCurrentBet();
        if (parseInt(zoneId) != 0 && parseInt(uid) != 0 && (isNaN(money) == false && Number(money) != 0)) {
            var data = LobbySend.requestGhepDoi(uid, zoneId, money);
            Linker.Socket.send(data);
        }
    },
});
