var soccerConstant = require('soccerConstant');
var Linker = require('Linker');
var Utils = require('Utils');
var Constant = require('Constant');
var HeadBallConstant = require("HeadBallConstant");
var FootBallConstant = require("FootBallConstant");
var BiDaConstant = require('BiDaConstant');
var TLMNConstant = require('TLMNConstant');
var PhomConstant = require('PhomConstant');
var NewAudioManager = require('NewAudioManager');
var NativeBridge = require("NativeBridge");

export var PortalView = cc.Class({
    extends: cc.Component,

    properties: {
        lobbyLayer: cc.Node,
        gameLayer: cc.Node,
        portalTopLayer: cc.Node,
        portalOnTopLayer: cc.Node,
        lobbyPrefab: cc.Prefab,
        gamePrefab: cc.Prefab,
        backgroundLobby: cc.Node
    },
    onLoad () {
        Linker.PortalView = this;
    },
    activeLobby: function (value) {
        console.log("activeLobby------");
        this.lobbyLayer.active = value;
        // this.backgroundLobby.active = value;
    },

    onMoHopThoaiThongBaoChung: function (event) {
        if (event) {
            var portalOnTopLayerScript = this.getPortalOnTopLayerComponent();
            if (portalOnTopLayerScript) {
                portalOnTopLayerScript.onMoHopThoaiThongBaoChung(event);
            }
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
    onResetSetting: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onResetSetting(event);
            }
        }
    },
    onClosePopup: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onClosePopup(event);
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
    onMoPopupNhiemVu: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupNhiemVu(event);
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
    onBackToHome: function (event) {
        if (event) {
            //phai preload hallscene nhung hien tai lay bida lam scene chinh nen load bida scene
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onBackToHome(event);
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
    onMoPopupChangeDisplayName: function () {
        //phai preload hallscene nhung hien tai lay bida lam scene chinh nen load bida scene
        var portalTopLayerScript = this.getPortalTopLayerComponent();
        if (portalTopLayerScript) {
            portalTopLayerScript.onMoPopupChangeDisplayName();
        }
    },
    onMoPopupNhanMoiChoi: function (event) {
        if (event) {
            var portalTopLayerScript = this.getPortalTopLayerComponent();
            if (portalTopLayerScript) {
                portalTopLayerScript.onMoPopupNhanMoiChoi(event);
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

    onMoPopupGuiMoiChoi: function () {
        //phai preload hallscene nhung hien tai lay bida lam scene chinh nen load bida scene
        var portalTopLayerScript = this.getPortalTopLayerComponent();
        if (portalTopLayerScript) {
            portalTopLayerScript.onMoPopupGuiMoiChoi();
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
    getPortalTopLayerComponent: function () {
        // if (Linker.ZONE == FootBallConstant.ZONE_ID.ZONEID_PENALTY)
        //     return this.portalTopLayer.getComponent("PortalTopLayerFootBall");
        // else
        return this.portalTopLayer.getComponent("PortalTopLayer");
    },
    getPortalOnTopLayerComponent: function () {
        return this.portalOnTopLayer.getComponent("PortalOnTopLayer");
    },
    start() {
        console.log("portal view start: Layer 2");
        this.isStarted = true;
        // var data = this.data;
        // if (data) {
            this.resetLobbyLayer();
            this.resetGameLayer();
            this.resetTopPortalLayer();
            this.addLobbyLayer();
            this.showChangeDisplayName();
        // }
    },
    showChangeDisplayName: function () {
        cc.error("showChangeDisplayName", Linker.userData);
        if (Linker.userData && Linker.userData.displayName && Linker.userData.displayName.trim() == "") {
            this.onMoPopupChangeDisplayName();
        }
    },
    createSoccerMatch: function (data) {
        cc.error(data);
        this.addGameLayer(data);
    },
    createBidaGame: function (data) {
        cc.error(data);
        this.addGameLayer(data);
    },
    createHeadBallMatch: function (data) {
        cc.log(data);
        this.addGameLayer(data);
    },

    createFootBallMatch: function (data) {
        cc.log(data);
        this.addGameLayer(data);
    },

    createTLMNGame: function (data) {
        console.log(data);
        this.addGameLayer(data);
    },

    createPhomGame: function (data) {
        cc.log(data);
        this.addGameLayer(data);
    },

    createMauBinhGame: function (data) {
        cc.log(data);
        this.addGameLayer(data);
    },

    createPokerGame: function (data) {
        this.addGameLayer(data);
    },

    createShootingGame: function (data) {
        cc.log(data);
        // this.addGameLayer(data);
        // this.showGameLayer(true);
        var ckcbBundle = "CongKichCuongBao";

        Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
            if (!err) {
                
                gameLoaderBundle.loadScene("GameSceneCKCB", function (err, scene) {
                    if (!err) {
                        cc.director.runSceneImmediate(scene, null, function (err, scene) {
                            NativeBridge.changeOrientationH(false);
                            var controller = cc.Canvas.instance.getComponentInChildren("ShootingGameController");
                            controller.InitializeGame(data);
                        });
                    }
                })
            }
        }.bind(this), ckcbBundle);
    },

    showGameLayer(isShow) {
        // if (Linker.ZONE != 48) return;
        if (isShow) {
            this.lobbyLayer.active = false;
            if (this.backgroundLobby) {
                this.backgroundLobby.active = false;
                Linker.HomeManager.hideGamePlay();
            }
        } else {
            this.lobbyLayer.active = true;
            if (this.backgroundLobby) {
                this.backgroundLobby.active = true;
            }
        }
    },

    addLobbyLayer: function () {
        var lobbyPoker = cc.find("Lobby/LobbyPoker",Linker.HomeManager.TLMNPortal);
        if (this.lobbyPrefab && !lobbyPoker) {
            var lobby = cc.instantiate(this.lobbyPrefab);
            var lobbyScript = lobby.getComponent("LobbyController");
            if (lobbyScript) {
                this.lobbyLayer.addChild(lobby);
                lobbyScript.init(this.data);
            }
        } else {
            // this.lobbyLayer.removeAllChildren(true);
        }

    },
    onResetBlockEventLobby: function (event) {
        if (this.lobbyPrefab) {
            if (event) {
                var Lobby = this.lobbyLayer.children[0];
                // var Lobby = this.lobbyLayer.getChildByName("Lobby");
                if (Lobby) {
                    var LobbyController = Lobby.getComponent("LobbyController");
                    if (LobbyController) {
                        LobbyController.activeBlockLobby(event);
                    }
                }
            }
        }

    },
    requestDataJoinZone: function () {
        if (this.lobbyPrefab) {
            var Lobby = this.lobbyLayer.children[0];
            // var Lobby = this.lobbyLayer.getChildByName("Lobby");
            if (Lobby) {
                var LobbyController = Lobby.getComponent("LobbyController");
                if (LobbyController) {
                    LobbyController.requestDataJoinZone();
                }
            }
        }

    },

    addGameLayer: function (data) {
        var game = cc.instantiate(this.gamePrefab);
        if (game) {
            Linker.GAME = game;
            game.name = "MainGame";
            if (Linker.ZONE == soccerConstant.ZONE_ID.ZONE_1VS1) {
                var gameScript = game.getComponent("soccerGalaxyGameController");
                if (gameScript) {
                    this.gameLayer.addChild(game);
                    game.opacity = 0;
                    gameScript.init(data);
                    var gameView = gameScript.soccerGalaxyView;
                    if (gameView) {
                        var gameViewScript = gameView.getComponent("soccerGalaxyGameView");
                        if (gameViewScript) {
                            gameViewScript.blockAllEvent();
                        }
                    }
                }
            } else if (Linker.ZONE == HeadBallConstant.ZONE_ID.LOBBY) {
                var gameScript = game.getComponent("ControllerMainGame");
                if (gameScript) {
                    this.gameLayer.addChild(game);
                    // game.opacity = 0;
                    gameScript.init(data);
                }
            } else if (Linker.ZONE == FootBallConstant.ZONE_ID.ZONEID_PENALTY) {
                var gameScript = game.getComponent("FootBallController");
                if (gameScript) {
                    this.gameLayer.addChild(game);
                    game.opacity = 255;
                    gameScript.init(data);
                }
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                var gameScript = game.getComponent("BillardsGameTable");
                if (gameScript) {
                    this.gameLayer.addChild(game);
                    game.opacity = 0;
                    gameScript.createHeaderUserInfo();
                    gameScript.configPanelUsers();
                    gameScript.init();
                    gameScript.initData(data);

                }
            } else if (Linker.ZONE == TLMNConstant.ZONEID) {
                var gameScript = game.getComponent("TLMNController");
                if (gameScript) {
                    this.gameLayer.addChild(game);
                    game.opacity = 0;
                    gameScript.init(data);
                    gameScript.blockAllEvent();
                }
            } else if (Linker.ZONE == PhomConstant.ZONEID) {
                var gameScript = game.getComponent("PhomController");
                if (gameScript) {
                    this.gameLayer.addChild(game);
                    game.opacity = 0;
                    gameScript.init(data);
                    gameScript.blockAllEvent();
                }
            } else if (Linker.ZONE == 14) {
                var gameScript = game.getComponent("MauBinhController");
                if (gameScript) {
                    this.gameLayer.addChild(game);
                    game.opacity = 0;
                    gameScript.init(data);
                    gameScript.blockAllEvent();
                }
            }else if (Linker.ZONE == 15) {
                var gameScript = game.getComponent("Poker");
                if (gameScript) {
                    gameScript.init(data);
                    this.gameLayer.addChild(game);
                }
            }
        } else {
            cc.error("Game null, thu lai", game, this.gamePrefab);
        }

    },

    resetLobbyLayer: function () {
        // this.lobbyLayer.removeAllChildren(true);
    },
    resetGameLayer: function () {
        if (this.gameLayer && cc.isValid(this.gameLayer)) {
            // this.gameLayer.removeAllChildren(true);
            
        }
    },
    resetTopPortalLayer: function () {
        // this.portalTopLayer.removeAllChildren(true);
        var portalTopLayerScript = this.getPortalTopLayerComponent();
        console.log("portalTopLayerScript----",portalTopLayerScript);
        if (portalTopLayerScript) {
            portalTopLayerScript.offAllLayer();
           
        }
    },
    onCloseAllCommonsPopup: function () {
        var portalTopLayerScript = this.getPortalTopLayerComponent();
        if (portalTopLayerScript) {
            portalTopLayerScript.offAllLayer();
        }
    },
    initLobby: function (data) {
        console.log("Linker._sceneTag:",Linker._sceneTag);
        if (data) {
            this.data = data;
        }
        // if (this.data && this.isStarted) {
            this.resetTopPortalLayer();
            this.showChangeDisplayName();
        // }
    },

    createDraggerMatch: function (data) {
        cc.log(data);
        this.addGameLayer(data);
    },

    showGameLobby: function () {
        if (this.gameLayer && cc.isValid(this.gameLayer)) {
            this.lobbyLayer.opacity = 255;
            for (var i = 0; i < this.gameLayer.children.length; i++) {
                var child = this.gameLayer.children[i];
                if (child && cc.isValid(child)) {
                    if (child.opacity == 255 && child.active == true) {
                        this.lobbyLayer.opacity = 0;
                    }
                }
            }
        }
    },
    update(dt) {
        if (this.gameLayer && cc.isValid(this.gameLayer)) {
            if (this.lobbyPrefab) {
                this.showGameLobby();
            }
        }
    },
    createQuickPlay () {
        console.log("createQuickPlay-----");
        this.initLobby({
            zoneId: Linker.ZONE
        });
        Linker.requestQuickPlayGame = true;
        Linker.HomeManager.activeLobby();
       
        this.createTLMNGame("");
        
    }
});