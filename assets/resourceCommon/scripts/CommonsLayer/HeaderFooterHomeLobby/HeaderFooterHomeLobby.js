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
var NativeBridge = require('NativeBridge');
cc.Class({
    extends: cc.Component,

    properties: {
        avatarSpriteSheet: cc.SpriteAtlas,
        toggleQuan: cc.Toggle,
        toggleXu: cc.Toggle,
        avatarSprite: cc.Sprite,
        userNameLabel: cc.Label,
        userLevelLabel: cc.Label,
        userMoneyQuanLabel: cc.Label,
        userMoneyXuLabel: cc.Label,
        numberPlayerOnlineLabel: cc.Label,
        notifyPrefab: cc.Prefab,
        notifyContainer: cc.Node,
        notifyContent: cc.Node,
        noHuNode: cc.Node,
        listButtonsShowInHome: [cc.Node],
        listButtonsShowInLobby: [cc.Node],
        listButtonsHideInHome: [cc.Node],
        listButtonsHideInLobby: [cc.Node],
        buttonDoiHinh: cc.Node,
        shopNode: cc.Node,
        btnGuide: cc.Node,
        btnHoTro: cc.Node,
        btnAds: cc.Node,
        btnAdsBanner: cc.Node,
        commonBottomLeft: cc.Node,
        commonBottomTop: cc.Node,
        limitBottomLeftNode: cc.Node,
        limitBottonTopNode: cc.Node,
        buttonBag: cc.Node,
        buttonBack: cc.Node,
        btnLogin: cc.Node,
        TopContainerNode: cc.Node,
        BottomContainerNode: cc.Node,
        moneyFrame: [cc.SpriteFrame],
        quanMoneySprite: cc.Sprite,
        xuMoneySprite: cc.Sprite
    },
    ctor: function () {
        this.isBottomLeftOpen = true;
    },
    onLoad() {
       
        this.addSocketEvent();
        this.collapseBottomMenuBag();
        if (Linker && Linker.userData) {
            this.setUserOnline();
        }
        // NodePoolManager.MiniGame.getNodePool();
        // NodePoolManager.TopHu.getNodePool();
        var sceneName = cc.Global.getSceneName();
       
        //load colapse bag
    },
    onEnable: function () {
        if(DataAccess.Instance.node){
        DataAccess.Instance.node.on("update-user-data", this.onUpdateUserData, this);
    }
    },
    runLeftBottomCollapse: function () {
        if (this.commonBottomLeft) {
            var container = this.commonBottomLeft.parent;
            if (container) {
                var animation = container.getComponent(cc.Animation);
                if (animation) {
                    var currentClip =  animation.play("collapse_left_bottom");
                    currentClip.speed = 0.5;
                }
            }
        }
    },
    runTopBottomCollapse: function () {
        if (this.commonBottomTop) {
            var container = this.commonBottomTop.parent;
            if (container) {
                var animation = container.getComponent(cc.Animation);
                if (animation) {
                    var currentClip = animation.play("collapse_top_bottom");
                    currentClip.speed = 0.5;

                }
            }
        }
    },
    runLeftBottomUnCollapse: function () {
        if (this.commonBottomLeft) {
            var container = this.commonBottomLeft.parent;
            if (container) {
                var animation = container.getComponent(cc.Animation);
                if (animation) {
                    var currentClip =  animation.play("uncollapse_left_bottom");
                    currentClip.speed = 0.5;

                }
            }
        }
    },
    runTopBottomUnCollapse: function () {
        if (this.commonBottomTop) {
            var container = this.commonBottomTop.parent;
            if (container) {
                var animation = container.getComponent(cc.Animation);
                if (animation) {
                    var currentClip = animation.play("uncollapse_top_bottom");
                    currentClip.speed = 0.5;
                    
                }
            }

        }
    },
    unCollapseBottomMenuBag: function () {
        //vi tri open all

        //đang thu lại thì mở ra
        this.runTopBottomCollapse();
        this.runLeftBottomCollapse();
        this.isBottomLeftOpen = !this.isBottomLeftOpen;
        // this.positionStart = cc.v2(0, 0);
        // this.commonBottomLeft.stopAllActions();
        // this.commonBottomTop.stopAllActions();
        // this.commonBottomLeft.runAction(cc.moveTo(0.15, this.positionStart).easing(cc.easeIn(3.0)));
        // this.commonBottomTop.runAction(cc.moveTo(0.15, this.positionStart).easing(cc.easeIn(3.0)));
    },
    collapseBottomMenuBag: function () {
        //đang mở thì thu lại
        this.runLeftBottomUnCollapse();
        this.runTopBottomUnCollapse();
        this.isBottomLeftOpen = !this.isBottomLeftOpen;
        //vi tri close
        // this.commonBottomLeft.stopAllActions();
        // this.commonBottomTop.stopAllActions();
        // this.positionStopCommonLeft = cc.v2(this.limitBottomLeftNode.width, 0);
        // this.positionStartCommonTop = cc.v2(0, -this.commonBottomTop.height);
        // this.commonBottomLeft.runAction(cc.sequence(cc.moveTo(0.15, this.positionStopCommonLeft).easing(cc.easeIn(3.0)), cc.callFunc(function () {
        // })));
        // this.commonBottomTop.runAction(cc.sequence(cc.moveTo(0.15, this.positionStartCommonTop).easing(cc.easeIn(3.0)), cc.callFunc(function () {
        // })));
    },
    checkZoneShowHu: function () {
        // if (cc.director.getScene().name == "HeroesBall") {
        // if (cc.director.getScene().name == "TrangChu") {
        //     this.noHuNode.active = false;
        //     return;
        // }
        // var zoneArray = [Constant.ZONE_ID.SOCCER_GALAXY_1VS1, Constant.ZONE_ID.BIDA_1VS1, Constant.ZONE_ID.BIDA_PHOM, Constant.ZONE_ID.MAU_BINH,
        // Constant.ZONE_ID.TLMN, Constant.ZONE_ID.PHOM];
        // this.noHuNode.active = (zoneArray.indexOf(Linker.ZONE) !== -1) ? true : false;
    },
    addSocketEvent: function () {
        Linker.Event.addEventListener(1243, this.onChangeMoneyType, this);
        Linker.Event.addEventListener(12017, this.onUserOnline, this);
        Linker.Event.addEventListener(121001, this.onGetUserData, this);
        Linker.Event.addEventListener(2, this.onChangeAvatar, this);
        Linker.Event.addEventListener(14000, this.onChangeViewName, this);
    },
    removeSocketEvent: function () {
        Linker.Event.removeEventListener(1243, this.onChangeMoneyType, this);
        Linker.Event.removeEventListener(12017, this.onUserOnline, this);
        Linker.Event.removeEventListener(121001, this.onGetUserData, this);
        Linker.Event.removeEventListener(2, this.onChangeAvatar, this);
        Linker.Event.removeEventListener(14000, this.onChangeViewName, this);
    },

    onUpdateUserData(message) {
        console.log("onUpdateUserData  HeaderFooterHome")
        if (message.userId == Linker.userData.userId) {
            Linker.userData.userRealMoney = message.userRealMoney;
            this.setUserMoney();
            this.setUserName();
            this.setUserLevel();
        }
    },
    onChangeViewName(message) {
        if (message.status == 1) {
            //Linker.showDialogActive = false;
            //an popup hien thi khi doi ten thanh cong
            this.scheduleOnce(function () {
                this.setUserName();
            }.bind(this), 0.1);
        }
    },
    onChangeMoneyType(message) {
        cc.Global.moneyType = message.moneyType;
        this.node.dispatchEvent(new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.UPDATE_MONEY_TYPE, true));
        this.setMoneyTypeActive();
        if (Linker._sceneTag == Constant.TAG.scenes.LOBBY) {
            var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_KHOI_TAO_LAI_LOBBY, true);
            customEvent.isChangeZone = true;
            customEvent.isReset = true;
            this.node.dispatchEvent(customEvent);
        }
    },
    onUserOnline(data) {
        if (data.status == 1) {
            cc.Global.userOnline = data.userOnline;
            this.setUserOnline();
        }
    },
    setUserOnline: function () {
        // this.numberPlayerOnlineLabel.string = "Online: " + cc.Global.userOnline;
        this.numberPlayerOnlineLabel.string = "ID: " + Linker.userData.userId;
    },
    onGetUserData: function (message) {
        if (message && message.status == 1) {
            Linker.userData.viewname = message.viewname;
            this.setUserMoney();
        }
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onEnable: function () {
        this.updateDataInfo();
        this.checkButtonHome();
    },
    updateDataInfo: function () {
        if (Linker && Linker.userData) {
            this.setUserMoney();
            this.setUserName();
            this.setUserLevel();
            this.setMoneyTypeActive();
            this.setUserAvatar();
            this.configShowHideButton();
            this.checkNotitication();
            this.checkZoneShowHu();
        }
    },
    configShowHideButton: function () {
        //scene name
        // var sceneName = cc.Global.getSceneName();
        // // if (sceneName == "HeroesBall") {
        // if (sceneName == "TrangChu") {
        //     this.notifyContainer.setContentSize(cc.size(1280, 50));
        //     this.hideButtons(this.listButtonsHideInHome);
        //     this.showButtons(this.listButtonsShowInHome);
        // } else {
        //     this.notifyContainer.setContentSize(cc.size(630, 50));
        //     this.hideButtons(this.listButtonsHideInLobby);
        //     this.showButtons(this.listButtonsShowInLobby);

        // }
        // if (Linker.Config && !Linker.Config.pmE) {
        //     this.shopNode.active = false;
        //     this.btnGuide.active = false;
        //     // this.btnHoTro.active = false;//xau qua

        // }
        // if ((Linker.Config && !Linker.Config.isads) || !cc.sys.isNative) {
        //     this.btnAds.active = false;
        //     this.btnAdsBanner.active = false;

        // }
        // //check ads show btton

        // if (Linker.ZONE) {
        //     if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
        //         this.buttonDoiHinh.active = false;
        //     } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
        //         this.buttonDoiHinh.active = false;
        //     } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
        //         this.buttonDoiHinh.active = false;
        //     } else if (Linker.ZONE == soccerConstant.ZONE_ID.ZONE_1VS1) {
        //         this.buttonDoiHinh.active = true;
        //     } else if (Linker.ZONE == FootBallConstant.ZONE_ID.ZONEID_PENALTY) {
        //         this.buttonDoiHinh.active = false;
        //     } else if (Linker.ZONE == HeadBallConstant.ZONE_ID.LOBBY) {
        //         this.buttonDoiHinh.active = false;
        //     } else if (Linker.ZONE == 4 || Linker.ZONE == 5 || Linker.ZONE == 14) {
        //         this.buttonDoiHinh.active = false;
        //     }
        //     this.buttonBack.active = true;
        //     this.commonBottomLeft.active = false;
        //     this.buttonBag.active = false;
        // } else {
        //     this.buttonBack.active = false;
        //     this.commonBottomLeft.active = true;
        //     this.buttonBag.active = true;
        // }
    },
    showButtons: function (listButtons) {
        if (listButtons) {
            for (var i = 0; i < listButtons.length; i++) {
                listButtons[i].active = true;
            }
        }
    },
    hideButtons: function (listButtons) {
        if (listButtons) {
            for (var i = 0; i < listButtons.length; i++) {
                listButtons[i].active = false;
            }
        }
    },
    checkNotitication: function () {
        var notifyNode = cc.instantiate(this.notifyPrefab);
        notifyNode.position = cc.v2(0, 0);
        var textNotify = notifyNode.getChildByName('text_thongbao');
        textNotify.x = 1745;
        if (!Linker.notifyText) {
            var path = Linker.Config.APP_API + 'api-events/notification';
            // var path = 'http://api.vipgame.com:3200/api-events/notification';
            var _this = this;
            Utils.Malicious.get(path, (data) => {
                _this.notifyContent.removeAllChildren(true);
                var temp = '';
                data.forEach(item => {
                    temp = temp + '                           ' + item;
                });
                if (textNotify && textNotify.isValid) {
                    var s = textNotify.getComponent(cc.Label);
                    if (s) {
                        s.string = temp;
                        Linker.notifyText = temp;
                        _this.notifyContent.addChild(notifyNode);
                    } else {
                        Linker.notifyText = null;
                        notifyNode.destroy();
                    }
                }
            });
        } else if (Linker.notifyText && Linker.notifyText.length > 0) {
            this.notifyContent.removeAllChildren(true);
            if (textNotify && textNotify.isValid) {
                var s = textNotify.getComponent(cc.Label);
                if (s) {
                    s.string = Linker.notifyText;
                    this.notifyContent.addChild(notifyNode);
                } else {
                    notifyNode.destroy();
                }
            }
        }
    },
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
    btnNhiemVuOnClick: function (event) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_NHIEM_VU, true);
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
    btnMXHOnClick: function (event) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_CHAT_SOCIAL, true);
        this.node.dispatchEvent(customEvent);
    },
    btnHuongDanOnClick: function (event) {
        // var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_HUONG_DAN, true);
        // this.node.dispatchEvent(customEvent);
        this.btnDailyGiftOnClick();
    },
    btnDailyGiftOnClick: function (event) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_HOP_THOAI_DAILY_GIFT, true);
        this.node.dispatchEvent(customEvent);
    },
    btnBackLobbyOnClick: function (event) {
        console.log("btnBackLobbyOnClick-----");
        var lobbyLayer = Linker.PortalController.portalView.getComponent("PortalView").lobbyLayer;
        var ghepDoi = null; //= lobbyLayer.getChildByName("Lobby").getChildByName("LobbyView").getChildByName("CommonsLobbyHomeTopBot").getChildByName("GhepDoi");
        if (ghepDoi) {
            var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_HUY_NODE_GHEP_DOI, true);
            this.node.dispatchEvent(customEvent);
        }
        else {
            var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_BACK_TO_HOME, true);
            this.node.dispatchEvent(customEvent);
        }
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
        if (toggle.isChecked) {
            NewAudioManager.playClick(NewAudioManager.SOUND_GAME.COMMON.CHANGE_XU, 0.1, false);
            this.toggleQuan.uncheck();
            this.requestChangeXuMoneyType();
        }
    },
    requestChangeQuanMoneyType: function () {
        var moneyType = Number(cc.Global.moneyType);
        if (moneyType == 1) {
            cc.error("Khong request change zone quan");
        } else {
            this.requestChangeMoneyType(1);
        }
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
    setUserMoney: function () {
        var moneyQuan = (Linker.userData.userRealMoney == 0) ? 0 : Utils.Malicious.moneyWithFormat(Linker.userData.userRealMoney, ".");
        var moneyXu = (Linker.userData.userMoney == 0) ? 0 : Utils.Malicious.moneyWithFormat(Linker.userData.userMoney, ".");
        // this.userMoneyQuanLabel.string = moneyQuan;
        // this.userMoneyXuLabel.string = moneyXu;
        this.userMoneyQuanLabel.string = Utils.Number.abbreviate(Number(Linker.userData.userRealMoney));
        this.userMoneyXuLabel.string = Utils.Number.abbreviate(Number(Linker.userData.userMoney));
        // var _m = [10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 1,12,123,1234,12345,123456,1234567,12345678,123456789,123456789,12345678910,1234567891011,12345678910111];
        // var i = 0;
        // setInterval(function () {
        //     if (i >= 0 && i <= _m.length - 1) {
        //         this.userMoneyQuanLabel.string = Utils.Number.abbreviate(_m[i]);
        //         this.userMoneyXuLabel.string = Utils.Number.abbreviate(_m[i]);
        //         i++;
        //     } else {
        //         i = 0;
        //     }
        // }.bind(this), 500)
    },
    setUserName: function () {
        console.log("setUserName    header footer   ");
        this.userNameLabel.string = Utils.Malicious.formatNameData(Linker.userData.displayName);
    },
    setUserLevel: function () {
        var data = Utils.Malicious.getLevelByExp(Linker.userData.userExp);
        Linker.userData.userLevel = data.level;
        this.userLevelLabel.string = Linker.userData.userLevel;
    },
    setMoneyTypeActive: function () {
        var moneyType = Number(cc.Global.moneyType);
        if (moneyType == 1) {
            this.toggleQuan.check();
            // this.quanMoneySprite.spriteFrame = this.moneyFrame[1];
            // this.xuMoneySprite.spriteFrame = this.moneyFrame[0];
        } else {
            this.toggleXu.check();
            // this.quanMoneySprite.spriteFrame = this.moneyFrame[0];
            // this.xuMoneySprite.spriteFrame = this.moneyFrame[1];
        }
    },
    setUserAvatar: function () {
        var avatarId = Linker.userData.avatar;
        var frame = this.avatarSpriteSheet.getSpriteFrame("avatar (" + avatarId + ")");
        if (frame) {
            this.avatarSprite.spriteFrame = frame;
        }
    },
    onChangeAvatar: function (message) {
        if (message) {
            if (message.status == 1) {
                cc.Global.showMessage(message.text);
                if (Linker.userData._avatar) {
                    Linker.userData.avatar = Linker.userData._avatar;
                    Linker.userData._avatar = 0;
                }
                this.setUserAvatar();
            } else {
                cc.Global.showMessage(message.error);
                Linker.userData._avatar = 0;
            }
        }
    },
    start: function () {
        if (cc.sys.isMobile) {
            // window.addEventListener('resize', this.scaleToFrameSize.bind(this));
            window.addEventListener('resize', this.updateWidget.bind(this));
        } else {
            // cc.view.on('canvas-resize', this.scaleToFrameSize, this);
            cc.view.on('canvas-resize', this.updateWidget, this);
        }
        this.updateWidget();
    },
    updateWidget: function () {
        var widget = this.node.getComponent(cc.Widget);
        if (widget) {
            var canvas = cc.find("Canvas");
            if (canvas && cc.isValid(canvas)) {
                if (!widget.target || (widget.target && !cc.isValid(widget.target)) || (widget.target && cc.isValid(widget.target) && widget.target != canvas)) {
                    widget.target = canvas;
                }
                widget.enabled = true;
                widget.isAlignLeft = true;
                widget.isAlignRight = true;
                widget.isAlignTop = true;
                widget.isAlignBottom = true;
                widget.top = 0;
                widget.bottom = 0;
                widget.left = 0;
                widget.right = 0;
                widget.updateAlignment();
            }
        }
    },
    // scaleToFrameSize: function (sceneName) {
    // var currentFrameSize = cc.view.getFrameSize();
    // var current_width = currentFrameSize.width;
    // var current_height = currentFrameSize.height;
    // cc.error("current_width: " + current_width);
    // cc.error("current_height: " + current_height);
    // sceneName = cc.Global.getSceneName();
    // if (sceneName) {
    //     var designResolutionSize = cc.view.getDesignResolutionSize();
    //     var design_width = designResolutionSize.width;
    //     var design_height = designResolutionSize.height;
    //     var scaleX;
    //     var scaleY;
    //     var custom_width;
    //     var custom_height;
    //     var finalSize;
    //     if (current_width > 0 && current_height && design_width > 0 && design_height > 0) {
    //         var custom_scaleX = current_width / design_width;
    //         var custom_scaleY = current_height / design_height;
    //         var custom_width = custom_scaleX * design_width;
    //         var custom_height = custom_scaleY * design_height;
    //         if (custom_height > design_height) {
    //             custom_height = design_height;
    //         }
    //         finalSize = cc.size(custom_width, custom_height);

    //     } else {
    //         scaleX = 1;
    //         scaleY = 1;
    //         finalSize = cc.size(design_width, design_height);
    //     }
    //     if (finalSize) {
    //         if (finalSize.width < design_width) {
    //             finalSize.width = design_width;
    //         }
    //         if (finalSize.height < design_height) {
    //             finalSize.height = design_height;
    //         }
    //         this.node.setContentSize(finalSize)
    //     }
    // }
    // },
    buttonBagClick() {
        // if (this.isBottomLeftOpen) {
        //     this.isBottomLeftOpen = false;
        //     var tweenClose = cc.tween().by(0.5, {x: this.commonBottomLeft.width}, {easing: "backOut"});
        //     tweenClose.clone(this.commonBottomLeft).start();
        // } else {
        //     this.isBottomLeftOpen = true;
        //     var tweenOpen = cc.tween().by(0.5, {x: -1 * this.commonBottomLeft.width}, {easing: "backIn"});
        //     tweenOpen.clone(this.commonBottomLeft).start();
        // }
        if (this.isBottomLeftOpen) {
            this.collapseBottomMenuBag();
        } else {
            this.unCollapseBottomMenuBag();
        }
    },

    checkButtonHome() {
        this.isBottomLeftOpen = false;
        this.buttonBagClick();
        if (Linker.isLogin) {
            this.btnLogin.active = false;
            this.TopContainerNode.active = true;
            this.BottomContainerNode.active = true;
            this.updateDataInfo();
        } else {
            if (cc.director.getScene().name == "TrangChu") {
                this.btnLogin.active = true;
                this.TopContainerNode.active = false;
                this.BottomContainerNode.active = false;
            } else {
                cc.Global.showLoading();
                cc.director.loadScene('TrangChu', () => {
                    cc.Global.hideLoading();
                });
            }
        }
    },

    showLogin() {
        if (Linker.HomeManager && Linker.HomeManager.isValid) {
            Linker.HomeManager.showLayer();
        }
    }
});
