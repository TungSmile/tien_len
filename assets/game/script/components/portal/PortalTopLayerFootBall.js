var Linker = require('Linker');
var FootBallConstant = require('FootBallConstant');
var Constant = require('Constant');
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,
    properties: {
        dialogCaiDatPrefab: cc.Prefab,
        dialogTaoBanPrefab: cc.Prefab,
        dialogShopPrefab: cc.Prefab,
        dialogLoadingScenePrefab: cc.Prefab,
        dialogHopThuPrefab: cc.Prefab,
        dialogGiftCodePrefab: cc.Prefab,
        dialogHoTroPrefab: cc.Prefab,
        dialogHuongDanPrefab: cc.Prefab,
        dialogBanBePrefab: cc.Prefab,
        dialogChatPrefab: cc.Prefab,
        dialogProfilePrefab: cc.Prefab,
        dialogVQMMPrefab: cc.Prefab,
        dialogLuckyDayPrefab: cc.Prefab,
        dialogSuKienPrefab: cc.Prefab,
        dialogNoHuPrefab: cc.Prefab,
        dialogAlertPrefab: cc.Prefab,
        dialogChangeNameDisplayPrefab: cc.Prefab,
        dialogGuiYeuCauChoiPrefab: cc.Prefab,
        dialogNhanYeuCauChoiPrefab: cc.Prefab
    },
    onMoPopupSetting: function (event) {
        if (event) {
            if (!this.dialogCaiDat) {
                this.dialogCaiDat = cc.instantiate(this.dialogCaiDatPrefab);
                this.node.addChild(this.dialogCaiDat);
                this.setToggleDialog(this.dialogCaiDat);
            }
            var dialogCaiDatScript = this.dialogCaiDat.getComponent("SettingDialogCommon");
            if (dialogCaiDatScript) {
                dialogCaiDatScript.updateDevice();
                var toggle = this.dialogCaiDat.getComponent(cc.Toggle);
                if (toggle) {
                    this.offLayerWithout(toggle);
                    var mainGameSetting = this.dialogCaiDat.getComponent("SettingInGame");
                    if (mainGameSetting) {
                        mainGameSetting.configSetting(event);
                    }
                }
            }
        }
    },
    onMoPopupTaoBan: function (event) {
        if (event) {
            if (!this.dialogTaoBan) {
                this.dialogTaoBan = cc.instantiate(this.dialogTaoBanPrefab);
                this.node.addChild(this.dialogTaoBan);
                this.setToggleDialog(this.dialogTaoBan);
            }
            var dialogTaoBanScript = this.dialogTaoBan.getComponent("CreateTableLobby");
            if (!dialogTaoBanScript)
            {
                dialogTaoBanScript = this.dialogTaoBan.getComponent("CreateTableLobbyFootBall");
            }
            if (dialogTaoBanScript) {
                var toggle = this.dialogTaoBan.getComponent(cc.Toggle);
                if (toggle) {
                    this.offLayerWithout(toggle);
                    // dialogTaoBanScript.setInGameSetting(event);
                }
            }

        }
    },
    onRequestSetting: function (event) {
        if (event) {
            if (!this.dialogCaiDat) {
                this.dialogCaiDat = cc.instantiate(this.dialogCaiDatPrefab);
                this.node.addChild(this.dialogCaiDat);
                this.dialogCaiDat.active = false;
                this.setToggleDialog(this.dialogCaiDat);
            }
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
    onClosePopup: function (event) {
        if (event) {
            if (event.toggle) {
                //check reopen friend tab zone
                this.offLayer(event.toggle);
                if (event.isFriendZoneClick) {
                    if (event.isFriendZoneTab) {
                        this.onMoPopupBanBe(event);
                    } else if (event.isFindFriendTab) {
                        this.onMoPopupBanBeTabFindFriend(event);
                    } else {
                        this.onMoPopupBanBe(event);
                    }
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
    offAllLayer: function () {
        if (this.listPopupToggle) {
            for (var i = 0; i < this.listPopupToggle.length; i++) {
                var currentToggle = this.listPopupToggle[i];
                if (currentToggle && cc.isValid(currentToggle)) {
                    if (currentToggle) {
                        currentToggle.node.active = false;
                        this.activeCheckMark(currentToggle, false);
                    }
                }

            }
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
    onBackToHome: function (event) {
        if (event) {
            if (!this.dialogLoadingScene) {
                Linker.ZONE = null;
                Linker.showDialogActive = true;
                this.dialogLoadingScene = cc.instantiate(this.dialogLoadingScenePrefab);
                //check dang o scene nao da

                this.node.addChild(this.dialogLoadingScene);
                this.setToggleDialog(this.dialogLoadingScene);
                // var sceneNameCurrent = cc.Global.getSceneName();
                // var bundleName = Constant.BUNDLE.HEROES_BALL.name;
                var bundleName = Constant.BUNDLE.TRANG_CHU.name;
                var sceneNameLoad = "TrangChu";
                if (sceneNameLoad) {
                    var dialogLoadingSceneScript = this.dialogLoadingScene.getComponent("LoadingScene");
                    if (dialogLoadingSceneScript) {
                        var toggle = this.dialogLoadingScene.getComponent(cc.Toggle);
                        if (toggle) {
                            this.offLayerWithout(toggle);
                            dialogLoadingSceneScript.setSceneName(sceneNameLoad);
                            Linker._sceneTag = Constant.TAG.scenes.HOME;
                            Linker.ZONE = null;
                            dialogLoadingSceneScript.onBeginLoadScene({ bundleName: null });
                        }
                    }
                }
            }
        }
    },
    onInviteAccept: function (event) {
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
                            dialogLoadingSceneScript.onBeginLoadScene({ bundleName: bundleName, data: data });
                        }
                    }
                }
            }
        }
    },
    onLogOut: function () {
        Linker.isLoadLogin = false;
        Linker.showDialogActive = false;
        cc.log("thoat");
        Linker.Socket.close();
        if (Linker.isFb) {
            Linker.MySdk.logoutFb();
            Linker.isFb = false;
        }
        //xoa auto dang nhap di khong no lai dang nhap lai =))
        this.onLoadLoginScene();
    },
    onLoadLoginScene: function () {
        if (!this.dialogLoadingScene) {

            this.dialogLoadingScene = cc.instantiate(this.dialogLoadingScenePrefab);
            //check dang o scene nao da

            this.node.addChild(this.dialogLoadingScene);
            this.setToggleDialog(this.dialogLoadingScene);
            // var sceneNameCurrent = cc.Global.getSceneName();
            var bundleName = null;
            var sceneNameLoad = "Login";
            if (sceneNameLoad) {
                var dialogLoadingSceneScript = this.dialogLoadingScene.getComponent("LoadingScene");
                if (dialogLoadingSceneScript) {
                    var toggle = this.dialogLoadingScene.getComponent(cc.Toggle);
                    if (toggle) {
                        this.offLayerWithout(toggle);
                        dialogLoadingSceneScript.setSceneName(sceneNameLoad);
                        Linker._sceneTag = Constant.TAG.scenes.HOME;
                        dialogLoadingSceneScript.onBeginLoadScene({ bundleName: bundleName });
                    }
                }
            }
        }
    },
    onLoadSplashScene: function () {
        if (!this.dialogLoadingScene) {
            this.dialogLoadingScene = cc.instantiate(this.dialogLoadingScenePrefab);
            //check dang o scene nao da

            this.node.addChild(this.dialogLoadingScene);
            this.setToggleDialog(this.dialogLoadingScene);
            // var sceneNameCurrent = cc.Global.getSceneName();
            var bundleName = null;
            var sceneNameLoad = "Splash";
            if (sceneNameLoad) {
                var dialogLoadingSceneScript = this.dialogLoadingScene.getComponent("LoadingScene");
                if (dialogLoadingSceneScript) {
                    var toggle = this.dialogLoadingScene.getComponent(cc.Toggle);
                    if (toggle) {
                        this.offLayerWithout(toggle);
                        dialogLoadingSceneScript.setSceneName(sceneNameLoad);
                        Linker._sceneTag = Constant.TAG.scenes.HOME;
                        dialogLoadingSceneScript.onBeginLoadScene({ bundleName: bundleName });
                    }
                }
            }
        }
    },
    onBackToLogin: function (event) {
        if (event) {
            if (event.isForced) {
                cc.error("Loading login forced...");
                this.onLoadLoginScene();
            } else {
                if (!this.dialogAlert || (this.dialogAlert && !cc.isValid(this.dialogAlert))) {
                    this.dialogAlert = cc.instantiate(this.dialogAlertPrefab);
                    this.node.addChild(this.dialogAlert);
                    this.setToggleDialog(this.dialogAlert);
                }
                var dialogAlertScript = this.dialogAlert.getComponent("Alert");
                if (dialogAlertScript) {
                    var toggle = this.dialogAlert.getComponent(cc.Toggle);
                    if (toggle) {
                        var msg = i18n.t("Do you want to logout?");
                        var type = G.AT.OK_CANCEL;
                        var okCallback = this.onLogOut.bind(this);
                        var cancelCallback = function () { cc.error("Ở lại xíu đã...") };
                        dialogAlertScript.setString(msg);
                        dialogAlertScript.setType(type);
                        dialogAlertScript.setCallBack(okCallback, cancelCallback);
                        this.offLayerWithout(toggle);
                    }
                }
            }

        }

        // if (event) {
        //     G.alert(i18n.t("Do you want to logout?"), G.AT.OK_CANCEL, () => {
        //         cc.log("thoat");
        //         Linker.Socket.close();
        //         if (Linker.isFb) {
        //             Linker.MySdk.logoutFb();
        //             Linker.isFb = false;
        //         }

        //     }, () => {
        //         cc.log("choi tiep");

        //     });
        // }
    },
    onBackToSplash: function (event) {
        if (event) {
            if (event.isForced) {
                cc.error("Loading splash forced...");
                this.onLoadSplashScene();
            } else {
                if (!this.dialogAlert || (this.dialogAlert && !cc.isValid(this.dialogAlert))) {
                    this.dialogAlert = cc.instantiate(this.dialogAlertPrefab);
                    this.node.addChild(this.dialogAlert);
                    this.setToggleDialog(this.dialogAlert);
                }
                var dialogAlertScript = this.dialogAlert.getComponent("Alert");
                if (dialogAlertScript) {
                    var toggle = this.dialogAlert.getComponent(cc.Toggle);
                    if (toggle) {
                        var msg = i18n.t("Do you want to logout?");
                        var type = G.AT.OK_CANCEL;
                        var okCallback = this.onLogOut.bind(this);
                        var cancelCallback = function () { cc.error("Ở lại xíu đã...") };
                        dialogAlertScript.setString(msg);
                        dialogAlertScript.setType(type);
                        dialogAlertScript.setCallBack(okCallback, cancelCallback);
                        this.offLayerWithout(toggle);
                    }
                }
            }

        }
    },
    onMoPopupProfile: function (event) {
        if (event) {
            if (!this.dialogProfile) {
                this.dialogProfile = cc.instantiate(this.dialogProfilePrefab);
                this.node.addChild(this.dialogProfile);
                this.setToggleDialog(this.dialogProfile);
            }
            var dialogProfileScript = this.dialogProfile.getComponent("ProfileDialog");
            if (dialogProfileScript) {
                var toggle = this.dialogProfile.getComponent(cc.Toggle);
                if (toggle) {
                    dialogProfileScript.requestUserInfo(event);
                    this.offLayerWithout(toggle);
                }
            }
        }
    },
    onMoPopupChangeDisplayName: function () {
        if (!this.dialogChangeName || (this.dialogChangeName && !cc.isValid(this.dialogChangeName))) {
            this.dialogChangeName = cc.instantiate(this.dialogChangeNameDisplayPrefab);
            this.node.addChild(this.dialogChangeName);
            this.setToggleDialog(this.dialogChangeName);
        }
        var dialogChangeNameScript = this.dialogChangeName.getComponent("ChangeDisplayNameDialog");
        if (dialogChangeNameScript) {
            var toggle = this.dialogChangeName.getComponent(cc.Toggle);
            if (toggle) {
                this.offLayerWithout(toggle);
            }
        }
    },
    onMoPopupNhanMoiChoi: function (event) {
        if (event) {
            if (!this.dialogNhanMoiChoi || (this.dialogNhanMoiChoi && !cc.isValid(this.dialogNhanMoiChoi))) {
                this.dialogNhanMoiChoi = cc.instantiate(this.dialogNhanYeuCauChoiPrefab);
                this.node.addChild(this.dialogNhanMoiChoi);
                this.setToggleDialog(this.dialogNhanMoiChoi);
            }
            var dialogNhanMoiChoiScript = this.dialogNhanMoiChoi.getComponent("InviteReceiverDialog");
            if (dialogNhanMoiChoiScript) {
                var toggle = this.dialogNhanMoiChoi.getComponent(cc.Toggle);
                if (toggle) {
                    this.offLayerWithout(toggle);
                    dialogNhanMoiChoiScript.init(event);
                }
            }
        }
    },
    onMoPopupGuiMoiChoi: function () {
        if (!this.dialogGuiMoiChoi || (this.dialogGuiMoiChoi && !cc.isValid(this.dialogGuiMoiChoi))) {
            this.dialogGuiMoiChoi = cc.instantiate(this.dialogGuiYeuCauChoiPrefab);
            this.node.addChild(this.dialogGuiMoiChoi);
            this.setToggleDialog(this.dialogGuiMoiChoi);
        }
        var dialogGuiMoiChoiScript = this.dialogGuiMoiChoi.getComponent("InviteSendDialog");
        if (dialogGuiMoiChoiScript) {
            var toggle = this.dialogGuiMoiChoi.getComponent(cc.Toggle);
            if (toggle) {
                this.offLayerWithout(toggle);
            }
        }
    },
    onMoPopupCuaHang: function (event) {
        if (event) {
            if (!this.dialogShop) {
                this.dialogShop = cc.instantiate(this.dialogShopPrefab);
                this.node.addChild(this.dialogShop);
                this.setToggleDialog(this.dialogShop);
            }

            var dialogShopScript = this.dialogShop.getComponent("ShopDialog");
            if (dialogShopScript) {
                var toggle = this.dialogShop.getComponent(cc.Toggle);
                if (toggle) {
                    this.offLayerWithout(toggle);
                }
            }
        }
    },
    onMoPopupNap: function (event) {
        if (event) {
            this.onMoPopupCuaHang(event);
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
    onMoPopupGiftCode: function (event) {
        if (event) {
            if (!this.dialogGiftCode) {
                this.dialogGiftCode = cc.instantiate(this.dialogGiftCodePrefab);
                this.node.addChild(this.dialogGiftCode);
                this.setToggleDialog(this.dialogGiftCode);
            }

            var dialogGiftCodeScript = this.dialogGiftCode.getComponent("GiftCodeDialog");
            if (dialogGiftCodeScript) {
                var toggle = this.dialogGiftCode.getComponent(cc.Toggle);
                if (toggle) {
                    this.offLayerWithout(toggle);
                }
            }
        }
    },
    onMoPopupHopThu: function (event) {
        if (event) {
            if (!this.dialogHopThu) {
                this.dialogHopThu = cc.instantiate(this.dialogHopThuPrefab);
                this.node.addChild(this.dialogHopThu);
                this.setToggleDialog(this.dialogHopThu);
            }

            var dialogHopThuScript = this.dialogHopThu.getComponent("MessageDialog");
            if (dialogHopThuScript) {
                var toggle = this.dialogHopThu.getComponent(cc.Toggle);
                if (toggle) {
                    this.offLayerWithout(toggle);
                }
            }
        }
    },
    onMoPopupHoTro: function (event) {
        if (event) {
            if (!this.dialogHoTro) {
                this.dialogHoTro = cc.instantiate(this.dialogHoTroPrefab);
                this.node.addChild(this.dialogHoTro);
                this.setToggleDialog(this.dialogHoTro);
            }

            var dialogHoTroScript = this.dialogHoTro.getComponent("SupportDialog");
            if (dialogHoTroScript) {
                var toggle = this.dialogHoTro.getComponent(cc.Toggle);
                if (toggle) {
                    dialogHoTroScript.configGroupButtonLayout(event);
                    this.offLayerWithout(toggle);
                }
            }
        }
    },
    onMoPopupLuckyDay: function (event) {
        if (event) {

        }
    },
    onMoPopupVqmm: function (event) {
        if (event) {
        }
    },
    onMoPopupBanBe: function (event) {
        if (event) {
            if (!this.dialogBanBe) {
                this.dialogBanBe = cc.instantiate(this.dialogBanBePrefab);
                this.node.addChild(this.dialogBanBe);
                this.setToggleDialog(this.dialogBanBe);
            }
            var dialogBanBeScript = this.dialogBanBe.getComponent("FriendsZone");
            if (dialogBanBeScript) {
                var toggle = this.dialogBanBe.getComponent(cc.Toggle);
                if (toggle) {
                    dialogBanBeScript.tabListFriends.active = true;
                    dialogBanBeScript.requestListFriendByPage(1);
                    this.offLayerWithout(toggle);
                }
            }
        }
    },
    onMoPopupBanBeTabFindFriend: function (event) {
        if (event) {
            if (!this.dialogBanBe) {
                this.dialogBanBe = cc.instantiate(this.dialogBanBePrefab);
                this.node.addChild(this.dialogBanBe);
                this.setToggleDialog(this.dialogBanBe);
            }
            var dialogBanBeScript = this.dialogBanBe.getComponent("FriendsZone");
            if (dialogBanBeScript) {
                var toggle = this.dialogBanBe.getComponent(cc.Toggle);
                if (toggle) {
                    dialogBanBeScript.tabListFriends.active = true;
                    dialogBanBeScript.tabListFriends.active = true;
                    dialogBanBeScript.requestListFriendByPage(1);
                    this.offLayerWithout(toggle);
                }
            }
        }
    },
    onMoPopupTroChuyen: function (event) {
        if (event) {
            if (!this.dialogChat) {
                this.dialogChat = cc.instantiate(this.dialogChatPrefab);
                this.node.addChild(this.dialogChat);
                this.setToggleDialog(this.dialogChat);
            }
            var dialogChatScript = this.dialogChat.getComponent("ChatZone");
            if (dialogChatScript) {
                var toggle = this.dialogChat.getComponent(cc.Toggle);
                if (toggle) {
                    this.offLayerWithout(toggle);
                }
            }
        }
    },
    onMoPopupNoHu: function (event) {
        if (event) {
            if (!this.dialogNoHu) {
                this.dialogNoHu = cc.instantiate(this.dialogNoHuPrefab);
                this.node.addChild(this.dialogNoHu);
                this.setToggleDialog(this.dialogNoHu);
            }
            var dialogNoHuScript = this.dialogNoHu.getComponent("CofferDialog");
            if (dialogNoHuScript) {
                var toggle = this.dialogNoHu.getComponent(cc.Toggle);
                if (toggle) {
                    this.offLayerWithout(toggle);
                }
            }
        }
    },
    onMoPopupHuongDan: function (event) {
        if (event) {
            if (!this.dialogHuongDan) {
                this.dialogHuongDan = cc.instantiate(this.dialogHuongDanPrefab);
                this.node.addChild(this.dialogHuongDan);
                this.setToggleDialog(this.dialogHuongDan);
            }

            var dialogHuongDanScript = this.dialogHuongDan.getComponent("GuideDialog");
            if (dialogHuongDanScript) {
                var toggle = this.dialogHuongDan.getComponent(cc.Toggle);
                if (toggle) {
                    this.offLayerWithout(toggle);
                }
            }
        }
    },



    // update (dt) {},
});
