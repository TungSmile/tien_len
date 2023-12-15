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
import {
    PortalView
} from "../PortalView";

cc.Class({
    extends: PortalView,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onEnable() {
        // this.node.getChildByName("");
    },
    start() {
        this._super();
        cc.Canvas.instance.node.on("yeu-cau-tao-ban-choi-ghep-doi", this.createTableGhepDoi, this);
        cc.Canvas.instance.node.on("yeu-cau-hien-thi-game-layer", this.showGameLayer, this);

        if (Linker.save_1100_message && Linker.save_1100_message.isChallenge) {
            this.createTableGhepDoi(Linker.save_1100_message);
        } else if (Linker.save_1105_message && Linker.save_1105_message.isChallenge) {
            this.createTableGhepDoi(Linker.save_1105_message);
        }
    },
    // update (dt) {},
    createTableGhepDoi: function (data) {
        //this.scheduleOnce(() => {
        this.addGameLayer(data);
        this.showGameLayer(true);
        //}, 2);
    },
    addGameLayer: function (data) {
        if (this.gameLayer && this.gameLayer.getChildByName("MainGame")) {
            this.gameLayer.getChildByName("MainGame").active = true;
            return;
        };
        var game = cc.instantiate(this.gamePrefab);
        if (game) {
            //Linker.GAME = game;
            if (game) game.name = "MainGame";
            if (Linker.ZONE == HeadBallConstant.ZONE_ID.LOBBY) {
                var gameScript = game.getComponent("ControllerMainGame");
                if (gameScript) {
                    this.gameLayer.addChild(game);
                    // game.opacity = 0;
                    //gameScript.init(data);
                    gameScript.initGameGhepDoi(data);
                }
            } else if (Linker.ZONE == soccerConstant.ZONE_ID.ZONE_1VS1) {
                var gameScript = game.getComponent("soccerGalaxyGameController");
                if (gameScript) {
                    this.gameLayer.addChild(game);
                    // game.opacity = 0;
                    var dataInit = {
                        isGhepDoi: true
                    }
                    gameScript.init(dataInit);
                    gameScript.initGameGhepDoi(data);
                    var gameView = gameScript.soccerGalaxyView;
                    if (gameView) {
                        var gameViewScript = gameView.getComponent("soccerGalaxyGameView");
                        if (gameViewScript) {
                            //gameViewScript.blockAllEvent();
                        }
                    }
                }
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                var gameScript = game.getComponent("BillardsGameTable");
                if (gameScript) {
                    this.gameLayer.addChild(game);
                    game.opacity = 0;
                    gameScript.createHeaderUserInfo();
                    gameScript.configPanelUsers();
                    gameScript.init();
                    //gameScript.initData(data);
                    gameScript.initGameGhepDoi(data);

                }
            } else if (Linker.ZONE == Constant.ZONE_ID.FOOTBALL_1VS1) {
                var gameScript = game.getComponent("FootBallController");
                if (gameScript) {
                    var mainGame = this.gameLayer.getChildByName("MainGame");
                    if (mainGame) {
                        mainGame.active = true;
                    }
                    else {
                        this.gameLayer.addChild(game);
                    }
                    game.opacity = 255;
                    gameScript.init(data);
                    gameScript.initGameGhepDoi(data);

                }
            }
        } else {
            cc.error("Khởi tạo sceen do lanscape thay đổi =)", game, this.gamePrefab);
            if (Linker.ZONE == 48) {
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
            } else if (Linker.ZONE == Constant.ZONE_ID.PHI_DAO) {
                var bundleName = Constant.BUNDLE.PHI_DAO.name;
                Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                    if (!err) {
                        var sceneInfo = Utils.Malicious.getBundleNameAndSceneNameByZoneId(Linker.ZONE);
                        var gameName = sceneInfo.sceneNameLoad2;
                        gameLoaderBundle.loadScene(gameName, function (err, scene) {
                            if (!err) {
                                cc.director.runSceneImmediate(scene, null, function (err, scene) {
                                    NativeBridge.changeOrientationH(false);
                                    var canvas = cc.find("Canvas");
                                    if (canvas) {
                                        var children = canvas.children;
                                        if (children) {
                                            for (var i = 0; i < children.length; i++) {
                                                var portalNode = children[i];
                                                var portalController = portalNode.getComponent("PortalPhiDaoController");
                                                if (portalController) {
                                                    portalController.addGameGhepDoiLayer(data);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        })
                    }
                }.bind(this), bundleName);
            }
        }

    }
});