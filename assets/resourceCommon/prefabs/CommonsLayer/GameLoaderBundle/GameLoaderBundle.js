var Utils = require('Utils');
var Linker = require('Linker');
var soccerConstant = require('soccerConstant');
var Constant = require('Constant');
var NativeBridge = require("NativeBridge");
cc.Class({
    extends: cc.Component,

    properties: {
        loadingContainer: cc.Node,
        progressSprite: cc.Sprite,
        progressLabel: cc.Label,
        sceneName: "SoccerGalaxy",
        zoneId: soccerConstant.ZONE_ID.ZONE_1VS1,
        nameBundle: Constant.BUNDLE.SOCCER_GALAXY.name,
        loadingScenePrefab: cc.Prefab,
        isCircleLoading: false
    },
    onLoad() {

    },
    start() {
        this.hideLoadingProgress();
        this.checkReconnectGame();
    },
    checkReconnectGame: function () {
        if (Linker && Linker.userData) {
            var currenZoneId = Number(Linker.userData.zoneId);
            var matchId = Number(Linker.userData.lastRoom);
            if (!isNaN(currenZoneId) && !isNaN(matchId)) {
                switch (currenZoneId) {
                    case soccerConstant.ZONE_ID.ZONE_1VS1:
                        this.nameBundle = Constant.BUNDLE.SOCCER_GALAXY.name;
                        this.sceneName = "SoccerGalaxy";
                        break;
                    default:
                        break;
                }
                Linker.ZONE = currenZoneId;
                if (!Linker.isLoadingRecconnectGame) {
                    Linker.isLoadingRecconnectGame = true;
                    var loadingScene = cc.instantiate(this.loadingScenePrefab);
                    if (loadingScene) {
                        var canvas = cc.find("Canvas");
                        if (canvas) {
                            var loadingSceneScript = loadingScene.getComponent("LoadingScene");
                            if (loadingSceneScript) {
                                canvas.addChild(loadingScene, cc.macro.MAX_ZINDEX);
                                loadingSceneScript.showLoadingProgress();
                                this.loadGame({ loadingScene: loadingScene });
                            }
                        }
                    }
                }

            } else {
                this.setZoneId(this.zoneId);
                this.setSceneName(this.sceneName);
            }
        }
    },
    setSceneName: function (sceneName) {
        this.sceneName = sceneName;
    },
    getSceneName: function () {
        return this.sceneName;
    },
    setZoneId: function (zoneId) {
        this.zoneId = zoneId;
    },
    getZoneId: function () {
        return this.zoneId;
    },
    removeButtonEvent: function () {
        var button = this.node.getComponent(cc.Button);
        if (button) {
            button.interactable = false;
        }
    },
    addButtonEvent: function () {
        var button = this.node.getComponent(cc.Button);
        if (button) {
            button.interactable = true;
        }
    },
    hideLoadingProgress: function () {
        this.loadingContainer.active = false;
        if (!this.isCircleLoading) {
            this.progressSprite.fillStart = 0;
            this.progressSprite.fillRange = 0;
            this.lastProgressRange = this.progressSprite.fillRange;
        } else {
            this.lastProgressRange = 0.05;
            this.progressSprite.node.active = false
        }
        this.progressLabel.string = "";
    },
    showLoadingProgress: function () {
        this.loadingContainer.active = true;
        if (!this.isCircleLoading) {
            this.progressSprite.fillStart = 0;
            this.progressSprite.fillRange = 0;
            this.lastProgressRange = this.progressSprite.fillRange;
        } else {
            this.lastProgressRange = 0.05;
            this.progressSprite.node.active = true;
        }
        this.progressLabel.string = "";
    },
    onLoaderClick: function (event) {
        if (event) {
            this.removeButtonEvent();
            this.showLoadingProgress();
            Linker.ZONE = this.getZoneId();
            if (Linker.ZONE) {
                if (this.sceneName) {
                    this.loadGame();
                } else {
                    // cc.error("Không thể tìm thấy tên scene cần load");
                    this.resetButtonLoader();
                }
            } else {
                // cc.error("Không thể load game soccer galaxy, zone không xác định");
                // cc.error("Linker.ZONE", Linker.ZONE);
                this.resetButtonLoader();
            }
        }
    },
    loadGame: function (data) {
        Linker.isLoadingRecconnectGame = true;
        if (data) {
            var loadingScene = data.loadingScene;
        }
        Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
            if (!err) {
                Linker.isLoadingRecconnectGame = true;
                gameLoaderBundle.preloadScene(this.sceneName, function (completedCount, totalCount, item) {
                    if (loadingScene) {
                        var loadingSceneScript = loadingScene.getComponent("LoadingScene");
                        if (loadingSceneScript) {
                            loadingSceneScript.onProgressPreloadScene(completedCount, totalCount, item);
                        }
                    }
                    this.onProgressPreloadScene(completedCount, totalCount, item);
                }.bind(this), function (err, scene) {
                    this.onFinishPreloadScene(err, scene);
                }.bind(this));
            } else {
                cc.error(err);
                Linker.isLoadingRecconnectGame = false;
            }
        }.bind(this), this.nameBundle);
    },
    onProgressPreloadScene: function (completedCount, totalCount, item) {
        var percent = completedCount / totalCount;
        if (percent > this.lastProgressRange) {
            if (!this.isCircleLoading) {
                this.progressSprite.fillRange = percent;
            }
            this.lastProgressRange = percent;
        }
        var progressText = this.lastProgressRange * 100;
        var percent = (isNaN(Math.round(progressText)) ? "..." : Math.round(progressText)) + " %";
        this.progressLabel.string = percent;

    },

    onFinishPreloadScene: function (err, scene) {
        if (!err) {
            if (Linker.ZONE && this.sceneName == "SoccerGalaxy") {
                Utils.Malicious.loadSoccerMapsPositionResource(Linker.SoccerGalaxy.Maps, {}, function (err, maps) {
                    if (!err) {
                        Linker.SoccerGalaxy.Maps = maps;
                        //load avatar and money type
                        //khi load xong scene thì trước nhất phải load scene thành công, khi load scene thành công công xong thì gửi yêu cầu join zone
                        Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                            if (!err) {
                                Utils.Malicious.getCoinFrame(Linker.MoneyTypeSpriteFrame, function (err, data) {
                                    if (!err) {
                                        Linker.MoneyTypeSpriteFrame = data;
                                        gameLoaderBundle.loadScene(this.sceneName, function (err, scene) {
                                            if (!err) {
                                                cc.director.runScene(scene, null, function () {
                                                    if (!err) {
                                                        // cc.director.runScene(scene);
                                                        cc.error("Loaded scene success 1...", this.sceneName);
                                                    }
                                                })
                                            }
                                        }.bind(this))
                                    }
                                }.bind(this))
                            } else {
                                cc.error(err);
                            }
                        }.bind(this), this.nameBundle)
                    }
                }.bind(this));
            } else if (Linker.ZONE && this.sceneName == "HeadBallPlay") {
                Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                    if (!err) {
                        Utils.Malicious.getCoinFrame(Linker.MoneyTypeSpriteFrame, function (err, data) {
                            if (!err) {
                                Linker.MoneyTypeSpriteFrame = data;
                                gameLoaderBundle.loadScene(this.sceneName, function (err, scene) {
                                    if (!err) {
                                        // cc.director.runScene(scene);
                                        cc.director.runScene(scene, null, function () {
                                            if (!err) {
                                               
                                                cc.error("Loaded scene success 2...", this.sceneName);
                                            }
                                        })
                                    }
                                }.bind(this))
                            } else {
                                cc.error(err);
                            }
                        }.bind(this))
                    }
                }.bind(this), this.nameBundle);
            } else if (Linker.ZONE && this.sceneName == "FootBall") {
                Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                    if (!err) {
                        Utils.Malicious.getCoinFrame(Linker.MoneyTypeSpriteFrame, function (err, data) {
                            if (!err) {
                                Linker.MoneyTypeSpriteFrame = data;
                                gameLoaderBundle.loadScene(this.sceneName, function (err, scene) {
                                    if (!err) {
                                        // cc.director.runScene(scene);
                                        cc.director.runScene(scene, null, function () {
                                            if (!err) {
                                                
                                                cc.error("Loaded scene success 3...", this.sceneName);
                                            }
                                        })
                                    }
                                }.bind(this))
                            }
                        }.bind(this))
                    } else {
                        cc.error(err);
                    }
                }.bind(this), this.nameBundle);
            }
        } else {
            Linker.isLoadingRecconnectGame = false;
            cc.log("Không thể load lại homescene lỗi xảy ra...");
            this.resetButtonLoader();
        }
    },
    resetButtonLoader: function () {
        Linker.ZONE = 0;
        this.hideLoadingProgress();
        this.addButtonEvent();
    }
    // update (dt) {},
});
