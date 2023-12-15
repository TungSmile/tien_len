var Linker = require('Linker');
var Constant = require('Constant');
var Utils = require('Utils');
var LobbySend = require('LobbySend');
var NativeBridge = require('NativeBridge');
cc.Class({
    extends: cc.Component,

    properties: {
        loadingContainer: cc.Node,
        progressSprite: cc.Sprite,
        progressLabelArr: [cc.Label],
        sceneName: cc.String,
        loadingSpinContainer: cc.Node,
        loadingSpriteContainer: cc.Node
    },
    onLoad() {

    },
    setSceneName: function (sceneName) {
        this.sceneName = sceneName;
    },
    getSceneName: function () {
        return this.sceneName;
    },
    hideLoadingProgress: function () {
        this.hideLoadingSpriteContainer();
        this.hideLoadingSpinContainer();
        this.loadingContainer.active = false;
        this.progressSprite.fillStart = 0;
        this.progressSprite.fillRange = 0;
        this.lastProgressRange = this.progressSprite.fillRange;
        this.setProgressLabel("");
    },
    setProgressLabel: function (str) {
        if (str) {
            for (var i = 0; i < this.progressLabelArr.length; i++) {
                var label = this.progressLabelArr[i];
                label.string = str;
            }
        }
    },
    hideLoadingSpriteContainer: function () {
        this.loadingSpriteContainer.active = false;
    },
    showLoadingSpinContainer: function () {
        this.loadingSpinContainer.active = true;
    },
    showLoadingSpriteContainer: function () {
        his.loadingSpriteContainer.active = true;
    },
    hideLoadingSpinContainer: function () {
        this.loadingSpinContainer.active = false;
    },

    showLoadingProgress: function () {
        this.hideLoadingSpriteContainer();
        this.showLoadingSpinContainer();
        this.progressSprite.fillStart = 0;
        this.progressSprite.fillRange = 0;
        this.lastProgressRange = this.progressSprite.fillRange;
        this.setProgressLabel("");
    },
    onBeginLoadScene: function (event) {
        this.showLoadingProgress();
        if (this.sceneName) {
            cc.error("this.sceneName: " + this.sceneName);
            //nhung scene public thi load direct bang resource.
            if (this.sceneName == "Login" || this.sceneName == "Splash") {
                Linker._sceneTag = Constant.TAG.scenes.HOME;
                cc.director.preloadScene(this.sceneName, function (completedCount, totalCount, item) {
                    this.onProgressPreloadScene(completedCount, totalCount, item);
                }.bind(this), function (err, scene) {
                    this.onFinishPreloadScene(err, scene);
                }.bind(this));
            } else {
                if (this.sceneName == "TrangChu") {
                    // if (this.sceneName == "HeroesBall") {
                    Linker._sceneTag = Constant.TAG.scenes.HOME;
                    NativeBridge.changeOrientationH(true);  
                }
                if (event) {
                    if (event.bundleName) {
                        var bundleName = event.bundleName;
                        var sceneName = this.sceneName;
                        Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                            if (!err) {
                                gameLoaderBundle.preloadScene(sceneName, function (completedCount, totalCount, item) {
                                    this.onProgressPreloadScene(completedCount, totalCount, item);
                                }.bind(this), function (err, scene) {
                                    if (!err && sceneName) {
                                        gameLoaderBundle.loadScene(sceneName, function (err, scene) {
                                            if (!err) {
                                                Linker._sceneTag = Constant.TAG.scenes.LOBBY;
                                                if (event.data) {
                                                    cc.error("sao lai vao day?????", event.data);
                                                    cc.director.runScene(scene, function (err, scene) {

                                                    }, function (err, scene) {
                                                        if (!err) {
                                                           
                                                            Linker.joinInviteData = event.data;
                                                            Linker.ZONE = Number(event.data.zoneID);
                                                            Linker.AbortByReceiveInvitePlayer = false;
                                                        }
                                                    })
                                                } else {
                                                    cc.error("Loaded scene success 4 ..", sceneName);
                                                    cc.director.runScene(scene, function(){}, function (err, scene) {
                                                        if(!err){
                                                          
                                                        }
                                                        
                                                    });
                                                }
                                            }
                                        }.bind(this))
                                    } else {
                                        cc.log("Không thể load lại hall scene lỗi xảy ra...");
                                    }
                                }.bind(this));
                            } else {
                                cc.error(err);
                            }
                        }.bind(this), bundleName);
                    }
                } else {
                    // var data = LobbySend.joinTableRequest(event.data.matchID);
                    // Linker.Socket.send(data);
                }
            }

        } else {
            cc.log("Không thể load lại homescene lỗi xảy ra...");
            this.resetLayerLoading();
        }
    },
    onProgressPreloadScene: function (completedCount, totalCount, item) {
        var percent = completedCount / totalCount;
        if (percent > this.lastProgressRange) {
            this.progressSprite.fillRange = percent;
            this.lastProgressRange = this.progressSprite.fillRange;
        }
        var progressText = this.lastProgressRange * 100;
        var percent = (isNaN(Math.round(progressText)) ? "..." : Math.round(progressText)) + " %";
        this.setProgressLabel(percent);
    },

    onFinishPreloadScene: function (err, scene) {
        if (!err) {
            if (this.sceneName) {
                cc.director.loadScene(this.sceneName, function (err, scene) {
                    if (!err) {
                        cc.error("Loaded scene success 5...", this.sceneName);
                    } else {
                        cc.log("Không thể load lại homescene lỗi xảy ra...");
                        this.resetLayerLoading();
                    }
                }.bind(this))
            } else {
                cc.log("Không thể load lại homescene lỗi xảy ra...");
                this.resetLayerLoading();
            }
        }
    },
    resetLayerLoading: function () {
        this.hideLoadingProgress();
    }
    // update (dt) {},
});
