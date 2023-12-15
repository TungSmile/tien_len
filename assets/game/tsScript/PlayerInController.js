// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var CommonSend = require('CommonSend')
var Linker = require('Linker');
var Constant = require('Constant');
const LobbySend = require("LobbySend");
const DataAccess = require("../script/network/base/DataAccess");
const Utils = require("../script/base/lib/Utils");
const { t } = require('../../i18n/i18n');

cc.Class({
    extends: cc.Component,

    properties: {
        avatarSpriteSheet: cc.SpriteAtlas,
        spriteAvatar: cc.Sprite,
        labelName: cc.Label,
        moneyLabel: cc.Label,
        dialogProfilePrefab: cc.Prefab,
        dialogShopPrefab: cc.Prefab,
        dialogSuKienPrefab: cc.Prefab,
        dialogGiftCodePrefab: cc.Prefab,
        dialogHopThuPrefab: cc.Prefab,
        dialogCaiDatPrefab: cc.Prefab,
        dialogNhiemVu: cc.Prefab,
        dialogXepHang: cc.Prefab,
        dialogInvitePrefab: cc.Prefab,
        userLevelLabel: cc.Label,
        dialogVQMM : cc.Prefab,
        // rank: cc.Node,
        prefabTenHienThi: cc.Prefab,
        dialogDailyGift: cc.Prefab,
        // rankAvatar: cc.Node,
        prefabMoiChoi: cc.Prefab,
        dialogLoadingScenePrefab: cc.Prefab,
        chuyenKhoanPrefab: cc.Prefab,
        RankingController: cc.Prefab,
        backgroundListPrefab: cc.Prefab,
        popupXacNhanPrefab: cc.Prefab,
        mainBackground: cc.Sprite,
        listBackground: [cc.SpriteFrame],

        popupNoti: cc.Prefab,
    },

    start() {
        Linker.ZONE = 5;
    },

    onEnable() {

    },

    onLoad() {
        DataAccess.Instance.node.on("update-user-data", this.onUpdateUserData, this);
        this.addSocketEvent();
       
        this.node.on(Constant.GAME_COMMONS_EVENT.CHANGE_DISPLAY_NAME, this.setUserName, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_HOP_THOAI_YEU_CAU_CHOI, this.onMoPopupNhanMoiChoi, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_LOAD_BUNDLE_VA_SCENE_NAME_ACCEPT_INVITE, this.onInviteAcceptClick, this);
        // this.node.on("openRankAvatar", this.openRankAvatar, this);
        // this.node.on("openRankDiaLog", this.openRankDiaLog, this);

        this.node.on('SHOW_POPUP_PAY_BACKGROUND', this.showPopupPayBackground, this);
        this.node.on('UPDATE_REAL_MONEY', this.setUserMoney, this);
        this.node.on('UPDATE_THEME', this.updateTheme, this);
        this.node.on('ERR_THEME', this.showNoti, this);

    },
    onEnable: function () {
      
    },
    loadDataTheme() {
        var dataSend = CommonSend.sendActionTheme(Linker.userData.userId, Constant.ACTION_THEME.GET_DATA_THEME, 0);
        if (dataSend) {
            Linker.Socket.send(dataSend);
        }
    },
    caseAction(response) {
        if (response.status == 1) {
            switch (response.action) {
                case Constant.ACTION_THEME.GET_DATA_THEME:
                    var theme = null;
                    if (response.listBackground) {
                        Linker.listTheme = response.listBackground;
                        response.listBackground.forEach(element => {
                            if (element.isUse) {
                                theme = element;
                            }
                        });
                    }
                    if (theme != null) {
                        this.setTheme(theme);
                    }
                    break;
            }
        } else {
            //Khong load duoc list background
            // load list background off
            // var listBackgroundBackup = this.dataBack.json.listBackgound;
            // if (listBackgroundBackup) {
            //     Linker.listTheme = listBackgroundBackup;
            // }
        }

    },
    showPopupPayBackground: function (event) {
        if (event.dataItem) {
            let xacNhanNode = this.node.getChildByName('PopupMuaBackground');
            if (xacNhanNode) {
                let xacNhanScript = xacNhanNode.getComponent('handlerXacNhan');
                if (xacNhanScript) {
                    xacNhanScript.renderDataPopup(event.dataItem);
                } else {
                    console.error("Không có script");
                }
                xacNhanNode.active = !xacNhanNode.active;
            } else {
                xacNhanNode = cc.instantiate(this.popupXacNhanPrefab);
                let xacNhanScript = xacNhanNode.getComponent('handlerXacNhan');
                if (xacNhanScript) {
                    xacNhanScript.renderDataPopup(event.dataItem);
                } else {
                    console.error("Không có script");
                }
                this.node.addChild(xacNhanNode);
            }
        }
    },
    showNoti: function (event) {
        if (event.err_key) {
            let notiNode = this.node.getChildByName('PopupNoTiTheme');
            if (notiNode) {
                let notiScript = notiNode.getComponent('notiTheme');
                if (notiScript) {
                    notiScript.renderDataPopup(event.err_key);
                } else {
                    console.error("Không có script");
                }
                notiNode.active = !notiNode.active;
            } else {
                notiNode = cc.instantiate(this.popupNoti);
                let notiScript = notiNode.getComponent('notiTheme');
                if (notiScript) {
                    notiScript.renderDataPopup(event.err_key);
                } else {
                    console.error("Không có script");
                }
                this.node.addChild(notiNode);
            }
        }
    },
    updateTheme(event) {
        var idTheme = event.theme.idTheme;
        if (idTheme) {
            if (this.listBackground) {
                let spriteFrame = this.listBackground[idTheme - 1];
                if (spriteFrame) {
                    this.mainBackground.spriteFrame = spriteFrame;
                }
            }
        }
    },
    setTheme(theme) {
        var idTheme = theme.idTheme;
        if (idTheme) {
            if (this.listBackground) {
                let spriteFrame = this.listBackground[idTheme - 1];
                if (spriteFrame) {
                    this.mainBackground.spriteFrame = spriteFrame;
                }
            }
        }
    },
    onDestroy() {
        this.removeSocketEvent();
    },

    onInviteAcceptClick: function (event) {
        if (event) {
            if (!this.dialogLoadingScene) {
                Linker.showDialogActive = true;
                this.dialogLoadingScene = cc.instantiate(this.dialogLoadingScenePrefab);
                //check dang o scene nao da
                this.node.addChild(this.dialogLoadingScene);
                this.setToggleDialog(this.dialogLoadingScene);
                // var sceneNameCurrent = cc.Global.getSceneName();
                var bundleName = event.bundleName;
                var sceneNameLoad = event.sceneNameLoad;
                var data = event.data;
                if (sceneNameLoad) {
                    var dialogLoadingSceneScript = this.dialogLoadingScene.getComponent("LoadingScene");
                    if (dialogLoadingSceneScript) {
                        var toggle = this.dialogLoadingScene.getComponent(cc.Toggle);
                        if (toggle) {
                            this.offLayerWithout(toggle);
                            dialogLoadingSceneScript.setSceneName(sceneNameLoad);
                            Linker._sceneTag = Constant.TAG.scenes.HOME;
                            dialogLoadingSceneScript.onBeginLoadScene({
                                bundleName: bundleName,
                                data: data
                            });
                        }
                    }
                }
            }
        }
    },
    onMoPopupNhanMoiChoi: function (event) {
        if (event) {
            if (!this.dialogNhanMoiChoi) {
                this.dialogNhanMoiChoi = cc.instantiate(this.dialogNhanYeuCauChoiPrefab);
                this.node.addChild(this.dialogNhanMoiChoi);
            }
            this.node.active = true;
            var dialogNhanMoiChoiScript = this.dialogNhanMoiChoi.getComponent("InviteReceiverDialog");
            if (dialogNhanMoiChoiScript) {
                var toggle = this.dialogNhanMoiChoi.getComponent(cc.Toggle);
                if (toggle) {
                    dialogNhanMoiChoiScript.init(event);
                }
            }
        }
    },

    onClickButtonAvatar() {

    },

    // openRankAvatar() {
    //     this.rankAvatar.active = true;
    //     this.rank.active = false;
    // },

    // openRankDiaLog() {
    //     this.rankAvatar.active = false;
    //     this.rank.active = true;
    // },

    onClickButtonAddMoney() {

    },

    addSocketEvent: function () {
        Linker.Event.addEventListener(2, this.onChangeAvatar, this);
        Linker.Event.addEventListener(19721, this.caseAction, this);
        Linker.Event.addEventListener(1101, this.onInviteAccept, this);
    },

    removeSocketEvent: function () {
        Linker.Event.removeEventListener(2, this.onChangeAvatar, this);
        Linker.Event.addEventListener(19721, this.caseAction, this);
        Linker.Event.removeEventListener(1101, this.onInviteAccept, this);
    },

    onInviteAccept(message) {
        console.log("message1123    " + JSON.stringify(message));
        if (!this.inviteDialog) {
            this.inviteDialog = cc.instantiate(this.prefabMoiChoi);
            this.node.addChild(this.inviteDialog);
            console.log("message1123  install success")
        }
        this.inviteDialog.getComponent("InviteReceiverDialog").init(message);
        this.inviteDialog.active = true;
    },

    onUpdateUserData(message) {
        console.log("onUpdateUserData   " + JSON.stringify(message));
        if (message && message.userId && Linker.userData && message.userId == Linker.userData.userId) {
            Linker.userData.userRealMoney = message.userRealMoney;
            this.setUserMoney();
            this.setUserName();
            this.setUserLevel();
            this.setUserAvatar();
            // this.rank.active = true;
            if (!Linker.userData.displayName) {
                if (this.prefabTenHienThi) {
                    var node = cc.instantiate(this.prefabTenHienThi);
                    this.node.getChildByName("playerInfoNode").addChild(node);
                }
            }
            this.loadDataTheme();
        }
    },

    onMoPopupProfile: function () {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_PROFILE_USER, true);
        customEvent.userId = Number(Linker.userData.userId);
        cc.Global.showLoading();
        if (!this.dialogProfile) {
            this.dialogProfile = cc.instantiate(this.dialogProfilePrefab);
            this.node.addChild(this.dialogProfile);
            // this.setToggleDialog(this.dialogProfile);
        }
        this.dialogProfile.active = true;
        var dialogProfileScript = this.dialogProfile.getComponent("ProfileDialog");
        if (dialogProfileScript) {
            var toggle = this.dialogProfile.getComponent(cc.Toggle);
            if (toggle) {
                dialogProfileScript.requestUserInfo(customEvent);
                this.offLayerWithout(toggle);
            }
        }

    },
    onMopupVqmm : function (event){
        if(event) {
            if(this.dialogVQMM) {
                let dialogVQMM = cc.instantiate(this.dialogVQMM);
                this.node.addChild(dialogVQMM);
                this.setToggleDialog(dialogVQMM);
            }
            var dialogVQMMScript = this.dialogVQMM.getComponent("VQMM");
            if(dialogVQMMScript) {
                var toggle = this.dialogVQMM.getComponent(cc.Toggle);
                if (toggle) {
                    this.offLayerWithout(toggle);
                }
            }

        }
    },
    onMoPopupSuKien: function (event) {
        if (event) {
            if (!this.dialogSuKien) {
                this.dialogSuKien = cc.instantiate(this.dialogSuKienPrefab);
                this.node.addChild(this.dialogSuKien);
                this.setToggleDialog(this.dialogSuKien);
            }

            var dialogSuKienScript = this.dialogSuKien.getComponent("sukienDialogV2");
            if (dialogSuKienScript) {
                var toggle = this.dialogSuKien.getComponent(cc.Toggle);
                if (toggle) {
                    this.offLayerWithout(toggle);
                }
            }
        }
    },
    onMopupChuyenKhoan: function () {
        Linker.ShopType = 0;
        if (!Linker.isLogin && Linker.HomeManager && Linker.HomeManager.isValid) {
            Linker.HomeManager.showLayer();
            return;
        }
        if (!this.dialogShop) {
            this.dialogShop = cc.instantiate(this.dialogShopPrefab);
            this.node.addChild(this.dialogShop);
            // this.setToggleDialog(this.dialogShop);
        }
        this.dialogShop.active = true;
        //do mở từ tặng quà thì mở popup khác
        let shopDialogComponent = this.dialogShop.getComponent("ShopDialog");
        if (shopDialogComponent) {
            shopDialogComponent.topBtnClick({
                target: {
                    name: "btn_chuyenkhoan"
                }
            })
        }

    },
    onMoPopupCuaHang: function () {
        Linker.ShopType = 0;
        if (!Linker.isLogin && Linker.HomeManager && Linker.HomeManager.isValid) {
            Linker.HomeManager.showLayer();
            return;
        }
        if (!this.dialogShop) {
            this.dialogShop = cc.instantiate(this.dialogShopPrefab);
            this.node.addChild(this.dialogShop);
            // this.setToggleDialog(this.dialogShop);
        }
        this.dialogShop.active = true;

        // var dialogShopScript = this.dialogShop.getComponent("ShopDialog");
        // if (dialogShopScript) {
        //     var toggle = this.dialogShop.getComponent(cc.Toggle);
        //     if (toggle) {
        //         this.offLayerWithout(toggle);
        //     }
        // }

    },

    onMoPopupRank: function () {
        let nodeRanking = this.node.getChildByName('RankingController');
        if (nodeRanking) {
            nodeRanking.active = !nodeRanking.active;
        } else {
            nodeRanking = cc.instantiate(this.RankingController);
            this.node.addChild(nodeRanking);
        }
    },
    onMoPopupGiftCode: function () {
        if (!this.dialogGiftCode) {
            this.dialogGiftCode = cc.instantiate(this.dialogGiftCodePrefab);
            this.node.addChild(this.dialogGiftCode);
            //this.setToggleDialog(this.dialogGiftCode);
        }

        this.dialogGiftCode.active = true;
        // var dialogGiftCodeScript = this.dialogGiftCode.getComponent("GiftCodeDialog");
        // if (dialogGiftCodeScript) {
        //     var toggle = this.dialogGiftCode.getComponent(cc.Toggle);
        //     if (toggle) {
        //         this.offLayerWithout(toggle);
        //     }
        // }
    },

    onMoPopupHopThu: function () {

        if (!this.dialogHopThu) {
            this.dialogHopThu = cc.instantiate(this.dialogHopThuPrefab);
            this.node.addChild(this.dialogHopThu);
            // this.setToggleDialog(this.dialogHopThu);
        }
        this.dialogHopThu.active = true;
        // var dialogHopThuScript = this.dialogHopThu.getComponent("MessageDialog");
        // if (dialogHopThuScript) {
        //     var toggle = this.dialogHopThu.getComponent(cc.Toggle);
        //     if (toggle) {
        //         this.offLayerWithout(toggle);
        //     }
        // }

    },

    onMoPopupNhiemVu: function () {
        if (!this.dialogNhiemVuPrefab) {
            this.dialogNhiemVuPrefab = cc.instantiate(this.dialogNhiemVu);
            this.node.addChild(this.dialogNhiemVuPrefab);
        }
        this.dialogNhiemVuPrefab.active = true;
    },

    onMoPopupDailyGift: function () {
        if (!this.dialogDailyGiftPrefab) {
            this.dialogDailyGiftPrefab = cc.instantiate(this.dialogDailyGift);
            this.node.addChild(this.dialogDailyGiftPrefab);
        }
        this.dialogDailyGiftPrefab.active = true;
    },



    onMoPopupXepHang: function () {
        if (!this.dialogXepHangPrefab) {
            this.dialogXepHangPrefab = cc.instantiate(this.dialogXepHang);
            this.node.addChild(this.dialogXepHangPrefab);
            // this.setToggleDialog(this.dialogHopThu);
        }
        this.dialogXepHangPrefab.active = true;
    },

    requestQuickPlay: function () {
        if (5) {
            Linker.Socket.send(LobbySend.fastPlayRequest(5));
        } else {
            cc.error("Không thể join game random, please try again...", Linker);
        }
    },

    onRequestSetting: function (event) {
        if (!this.dialogCaiDat) {
            this.dialogCaiDat = cc.instantiate(this.dialogCaiDatPrefab);
            this.node.addChild(this.dialogCaiDat);
            // this.dialogCaiDat.active = false;
            // this.setToggleDialog(this.dialogCaiDat);
        }
        this.dialogCaiDat.active = true;
        var dialogCaiDatScript = this.dialogCaiDat.getComponent("SettingDialogCommon");
        if (dialogCaiDatScript) {
            dialogCaiDatScript.updateDevice();
            var toggle = this.dialogCaiDat.getComponent(cc.Toggle);
            if (toggle) {
                var mainGameSetting = this.dialogCaiDat.getComponent("SettingInGame");
                if (mainGameSetting) {
                    mainGameSetting.requestSetting(event);
                }
            }
        }

    },

    offLayer: function (toggle) {
        if (toggle && cc.isValid(toggle)) {
            if (this.listPopupToggle) {
                for (var i = 0; i < this.listPopupToggle.length; i++) {
                    var currentToggle = this.listPopupToggle[i];
                    if (currentToggle && cc.isValid(currentToggle)) {
                        if (currentToggle == toggle) {
                            currentToggle.node.active = false;
                            this.activeCheckMark(currentToggle, false);
                        }
                    }
                }
            }
        }
    },
    setToggleDialog: function (dialog) {
        if (dialog) {
            if (!this.listPopupToggle) {
                this.listPopupToggle = [];
            }

            var toggle = dialog.getComponent(cc.Toggle);

            if (toggle) {
                this.listPopupToggle.push(toggle);
            }
        }
    },

    setUserLevel() {
        var data = Utils.Malicious.getLevelByExp(Linker.userData.userExp);
        Linker.userData.userLevel = data.level;
        this.userLevelLabel.string = Linker.userData.userLevel;
    },
    setUserMoney() {
        var moneyQuan = (Linker.userData.userRealMoney == 0) ? 0 : Utils.Malicious.moneyWithFormat(Linker.userData.userRealMoney, ".");
        var moneyXu = (Linker.userData.userMoney == 0) ? 0 : Utils.Malicious.moneyWithFormat(Linker.userData.userMoney, ".");
        this.moneyLabel.string = Utils.Number.abbreviate(Number(Linker.userData.userRealMoney));
    },

    setUserName() {
        this.labelName.string = Utils.Malicious.formatNameData(Linker.userData.displayName);
    },

    setUserAvatar() {
        var avatarId = Linker.userData.avatar;
        var frame = this.avatarSpriteSheet.getSpriteFrame("avatar (" + avatarId + ")");
        if (frame) {
            this.spriteAvatar.spriteFrame = frame;
        }
    },

    onChangeAvatar(message) {
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

    updateDataInfo: function () {
        if (Linker && Linker.userData) {
            this.setUserMoney();
            this.setUserName();
            this.setUserLevel();
            this.setUserAvatar();
        }
    },

    offLayerWithout: function (toggle) {
        if (toggle && cc.isValid(toggle)) {
            if (this.listPopupToggle) {
                for (var i = 0; i < this.listPopupToggle.length; i++) {
                    var currentToggle = this.listPopupToggle[i];
                    if (currentToggle && cc.isValid(currentToggle)) {
                        if (currentToggle != toggle) {
                            currentToggle.node.active = false;
                            this.activeCheckMark(currentToggle, false);
                        } else {
                            currentToggle.node.active = true;
                            this.activeCheckMark(currentToggle, true);
                        }
                    }
                }
            }
        }
    },
    activeCheckMark: function (toggle, enable) {
        if (toggle) {
            var checkMark = toggle.checkMark;
            if (checkMark) {
                if (enable) {
                    checkMark.enable = true;
                    toggle.check();

                } else {
                    checkMark.enable = false;
                    toggle.uncheck();
                }
            }
        }
    },

    onClickBtnBackground: function () {
        let listBgNode = this.node.getChildByName('BackgroundContainer');
        if (listBgNode) {
            listBgNode.active = !listBgNode.active;
        } else {
            listBgNode = cc.instantiate(this.backgroundListPrefab);
            this.node.addChild(listBgNode)
        }
    },




});
