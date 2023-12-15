var soccerConstant = require('soccerConstant');
var Linker = require('Linker');
var Utils = require('Utils');
var Constant = require('Constant');
var HeadBallConstant = require("HeadBallConstant");
var NewAudioManager = require("NewAudioManager");
var NativeBridge = require("NativeBridge");
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {

    },
    onToggleBidaChoose: function (event) {
        if (event && event.isButtonGameClick) {
            var toggle = event.toggle;
            if (this.onClickChooseZoneBida) {
                this.onClickChooseZoneBida = false;
                var chooseZone = event.chooseZone;
                if (chooseZone) {
                    chooseZone.active = false;
                    var name = toggle.node.name;
                    var loadingContainer = event.loadingGameNode;
                    var data;
                    if (loadingContainer) {
                        data = {
                            loadingContainer: loadingContainer,
                            iconLoading: loadingContainer.getChildByName("loading_icon"),
                            labelLoadingNode: loadingContainer.getChildByName("loadingText"),
                            chooseZone: chooseZone
                        }
                        if (data.labelLoadingNode) {
                            data.labelProgress = data.labelLoadingNode.getComponent(cc.Label);
                        }
                    }
                    switch (name) {
                        case "BidaGame":
                        case "btnBida8Ball":
                            this.runActionLoadingCircle(data);
                            var _tmp = {
                                bundleName: Constant.BUNDLE.BIDA.name,
                                sceneName: "BidaGame",
                                label: data.labelProgress,
                                zoneid: 8,
                                event: data
                            };
                            this.loadBidaBundle(_tmp);
                            break;
                        case "btnBidaTala":
                            this.runActionLoadingCircle(data);
                            var _tmp = {
                                bundleName: Constant.BUNDLE.BIDA.name,
                                sceneName: "BidaGame",
                                label: data.labelProgress,
                                zoneid: 86,
                                event: data
                            }
                            this.loadBidaBundle(_tmp);
                            break;
                        default:
                            break;
                    }
                    cc.error(name);
                    // this.runActionLoadingCircle(event);
                }
            }
        }
    },
    getLoadingButton: function (event) {
        var loadingContainer;
        if (event) {
            if (event.loadingContainer) {
                if (cc.isValid(event.loadingContainer)) {
                    loadingContainer = event.loadingContainer;
                }
            } else {
                loadingContainer = event.target.parent.getChildByName("loadingContainer");
                if (!loadingContainer) {
                    loadingContainer = event.target.parent.parent.getChildByName("loadingContainer");
                }
            }
        }
        return loadingContainer;
    },
    getLabelProgress: function (event) {
        if (event) {
            var loading = this.getLoadingButton(event);
            if (loading) {
                var labelLoadingNode = loading.getChildByName("loadingText");
                if (labelLoadingNode) {
                    return labelLoadingNode.getComponent(cc.Label);
                }
            }
        }
        return null;
    },
    stopRunActionLoadingCircle: function (event) {
        if (event) {
            this.sceneName = null;
            if (event.chooseZone) {
                if (cc.isValid(event.chooseZone) && event.chooseZone.active) {
                    event.chooseZone.active = false;
                }
            }
            var loading = this.getLoadingButton(event);
            if (loading) {
                loading.active = false;
                var iconLoading = loading.getChildByName("loading_icon");
                var labelLoadingNode = loading.getChildByName("loadingText");
                if (iconLoading && labelLoadingNode) {
                    var animation = loading.getComponent(cc.Animation);
                    if (animation) {
                        animation.play("btnStopLoading");
                        cc.error("Chay stop animation loading 222222...");
                    } else {
                        iconLoading.active = false;
                        iconLoading.stopAllActions();
                        labelLoadingNode.active = false;
                    }
                    var labelLoading = labelLoadingNode.getComponent(cc.Label);
                    if (labelLoading) {
                        labelLoading.string = "";
                    }
                }
            }
        }
    },
    runActionLoadingCircle: function (event) {
        if (event) {
            var loading = this.getLoadingButton(event);
            if (loading) {
                loading.active = true;
                loading.opacity = 255;

                var iconLoading = loading.getChildByName("loading_icon");
                var labelLoadingNode = loading.getChildByName("loadingText");
                if (iconLoading && labelLoadingNode) {
                    var animation = loading.getComponent(cc.Animation);
                    if (animation) {
                        animation.play("btnLoading");
                    } else {
                        iconLoading.active = true;
                        iconLoading.opacity = 255;
                        iconLoading.stopAllActions();
                        iconLoading.runAction(cc.repeatForever(cc.rotateBy(0.8, -360)));
                        labelLoadingNode.active = true;
                        labelLoadingNode.opacity = 255;
                    }

                    var labelLoading = labelLoadingNode.getComponent(cc.Label);
                    if (labelLoading) {
                        labelLoading.string = "";
                    }
                }
            }
        }
    },
    onProgressPreloadScene: function (completedCount, totalCount, item, label) {
        if (this && cc.isValid(this.node)) {
            if (label) {
                var percent = completedCount / totalCount;
                if (percent > 1.0) {
                    percent = 1.0;
                }
                var progressText = percent * 100;
                progressText = (isNaN(Math.round(progressText)) ? "..." : Math.round(progressText)) + " %";
                label.string = progressText;
            }
        }
    },
    getBundle: function (bundleName, sceneName, label, cb) {
        Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
            if (!err) {
                gameLoaderBundle.preloadScene(sceneName, function (completedCount, totalCount, item) {
                    this.onProgressPreloadScene(completedCount, totalCount, item, label);
                }.bind(this), function (err, scene) {
                    if (cb) {
                        cb(null, sceneName)
                    }
                }.bind(this));
            } else {
                cc.error(err);
                if (cb) {
                    cb(err, null);
                }
            }
        }.bind(this), bundleName);
    },
    getBundleAll: function (bundleName, cb) {
        Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
            if (!err) {
                if (cb) {
                    cb(null, gameLoaderBundle)
                }
            } else {
                cc.error(err);
                if (cb) {
                    cb(err, null);
                }
            }
        }.bind(this), bundleName);
    },
    runGame: function (bundleName, sceneName, zoneid) {
        cc.error("Chạy scene...", bundleName, sceneName, zoneid);
        if (bundleName && sceneName && !Linker.AbortByReceiveInvitePlayer) {
            Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                if (!err) {
                    gameLoaderBundle.loadScene(sceneName, function (err, scene) {
                        if (!err) {
                            if (!Linker.AbortByReceiveInvitePlayer) {
                                Linker.ZONE = zoneid;
                                Linker._sceneTag = Constant.TAG.scenes.LOBBY;
                                cc.director.runScene(scene, null, function (err, scene) {
                                    if (!err) {
                                        cc.error("Loaded scene success login 0...", sceneName);
                                      
                                    }
                                })
                                cc.error("Loaded scene success login1...", sceneName);
                            } else {
                                cc.error("Do đang có hành động người khác mời chơi, nên phải tải lại scene mới, không thể chạy scene này...");
                            }

                        }
                    }.bind(this))
                } else {
                    cc.error(err);
                    if (cb) {
                        cb(err, null);
                    }
                }
            }.bind(this), bundleName);
        } else {
            cc.error("Do đang có hành động người khác mời chơi, nên phải tải lại scene mới, không thể chạy scene này...");
        }
    },
    loadBidaBundle: function (data) {
        if (data) {
            var bundleName = data.bundleName;
            var sceneName = data.sceneName;
            var label = data.label;
            var zoneid = data.zoneid;
            var event = data.event;
            if (bundleName && sceneName && label && zoneid) {
                this.getBundle(bundleName, sceneName, label, function (err, sceneName) {
                    if (!err) {
                        if (this && cc.isValid(this.node)) {
                            if (!this.sceneName) {
                                cc.error("sceneName: " + sceneName + " loaded!..");
                                this.sceneName = sceneName;
                                this.runGame(bundleName, this.sceneName, zoneid);
                                if (event) {
                                    this.stopRunActionLoadingCircle(event);
                                }
                            }
                        }
                    }
                }.bind(this))
            }
        }
    },
    processConnect() {
        Utils.Malicious.processConnect(Linker, this.node);
    },
    onClickMiniGame: function (event) {
        NewAudioManager.playClick();
        if (!Linker.isLogin && Linker.HomeManager && Linker.HomeManager.isValid) {
            Linker.HomeManager.showLayer();
            return;
        }
        if (event && event.target) {
            if (Linker.Socket.isOpen()) {
                var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.ON_BUTTON_GAME_HALL_SCENE_CLICK, true);
                customEvent.isButtonGameClick = true;
                customEvent.data = event;
                customEvent.loadingGameNode = event.target.parent.getChildByName('loadingContainer');
                this.onButtonClick(customEvent);
            } else {
                this.processConnect();
            }
        }
    },
    joinTaiXiu() {
        var testdata = {
            "r": [{
                "v": "12004\u0004"
            }]
        }
        Linker.Socket.send(JSON.stringify(testdata));
    },
    onButtonClick: function (event) {
       
        if (!Linker.isLogin && Linker.HomeManager && Linker.HomeManager.isValid) {
            Linker.HomeManager.showLayer();
            return;
        }
        if (event && event.isButtonGameClick) {
            event = event.data;
            console.log("onButtonClick-----",event.target.name);
            if (event && event.target && event.target.name) {
                var name = event.target ? event.target.name : event.name;
                switch (name) {
                    case "BidaGame":
                    case "btnBida":
                        // this.onClickChooseZoneBida = true;
                        // var chooseZone = event.target.parent.getChildByName("chooseZone");
                        // if (!chooseZone) {
                        //     chooseZone = event.target.parent.parent.getChildByName("chooseZone");
                        // }
                        // if (chooseZone) {
                        //     chooseZone.active = !chooseZone.active;
                        // }
                        this.runActionLoadingCircle(event);
                        var label = this.getLabelProgress(event);
                        var _tmp = {
                            bundleName: Constant.BUNDLE.BIDA.name,
                            sceneName: "BidaGame",
                            label: label,
                            zoneid: 8,
                            event: event
                        };
                        this.loadBidaBundle(_tmp);
                        break;
                    case "SoccerGame":
                    case "btnSoccerGalaxy":
                        this.runActionLoadingCircle(event);
                        var bundleName = Constant.BUNDLE.SOCCER_GALAXY.name;
                        var sceneName = "SoccerGalaxy";
                        var label = this.getLabelProgress(event);
                        var zoneid = 45;
                        if (label) {
                            this.getBundle(bundleName, sceneName, label, function (err, sceneName) {
                                if (!err) {
                                    if (this && cc.isValid(this.node)) {
                                        if (!this.sceneName) {
                                            cc.error("sceneName: " + sceneName + " loaded!..");
                                            this.sceneName = sceneName;
                                            this.runGame(bundleName, this.sceneName, zoneid);
                                            this.stopRunActionLoadingCircle(event);
                                        }
                                    }
                                }
                            }.bind(this))
                        }
                        break;
                    case "HeadBallGame":
                    case "btnHeadBall":
                        this.runActionLoadingCircle(event);
                        var bundleName = Constant.BUNDLE.HEAD_BAL.name;
                        var sceneName = "HeadBallPlay";
                        var label = this.getLabelProgress(event);
                        var zoneid = 46;
                        if (label) {
                            this.getBundle(bundleName, sceneName, label, function (err, sceneName) {
                                if (!err) {
                                    if (this && cc.isValid(this.node)) {
                                        if (!this.sceneName) {
                                            cc.error("sceneName: " + sceneName + " loaded!..");
                                            this.sceneName = sceneName;
                                            this.runGame(bundleName, this.sceneName, zoneid);
                                            this.stopRunActionLoadingCircle(event);
                                        }
                                    }
                                }
                            }.bind(this))
                        }
                        break;
                    case "FootBall3DGame":
                    case "btnFootBall":
                        this.runActionLoadingCircle(event);
                        var bundleName = Constant.BUNDLE.FOOT_BALL.name;
                        var sceneName = "FootBall";
                        var label = this.getLabelProgress(event);
                        var zoneid = 44;
                        if (label) {
                            this.getBundle(bundleName, sceneName, label, function (err, sceneName) {
                                if (!err) {
                                    if (this && cc.isValid(this.node)) {
                                        if (!this.sceneName) {
                                            cc.error("sceneName: " + sceneName + " loaded!..");
                                            this.sceneName = sceneName;
                                            this.runGame(bundleName, this.sceneName, zoneid);
                                            this.stopRunActionLoadingCircle(event);
                                        }
                                    }
                                }
                            }.bind(this))
                        }
                        break;
                    case "btnXocDia":
                        break;
                    case "TLMNGame":
                    case "btnTLMN":
                        // if (Linker.userData.countryId != "vn") {
                        //     cc.Global.showMessage(i18n.t("GAME_NOT_SUPPORT_COUNTRY"));
                        //     break;
                        // }
                        console.log("vaoday------");
                        this.runActionLoadingCircle(event);
                        var bundleName = Constant.BUNDLE.TLMN.name;
                        var sceneName = "TLMN";
                        var label = this.getLabelProgress(event);
                        var zoneid = 5;
                        //test kieu goi cu
                        // if (label) {
                        //     this.getBundle(bundleName, sceneName, label, function (err, sceneName) {
                        //         if (!err) {
                        //             if (this && cc.isValid(this.node)) {
                        //                 cc.error("sceneName: " + sceneName + " loaded!..");
                        //                 this.sceneName = sceneName;
                        //                 this.runGame(bundleName, this.sceneName, zoneid);
                        //                 this.stopRunActionLoadingCircle(event);
                        //             }
                        //         }
                        //     }.bind(this));
                        // }
                        //end test
                        Linker.ZONE = zoneid;
                        Linker._sceneTag = Constant.TAG.scenes.LOBBY;
                        // Linker.HomeManager.Login.active = false;
                        // Linker.HomeManager.HomePortal.active = false;
                        // Linker.HomeManager.TLMNPortal.active = true;
                        Linker.HomeManager.activeLobby();
                        Linker.PortalView.activeLobby(true);
                        break;
                    case "btnPhom":
                        this.runActionLoadingCircle(event);
                        var bundleName = Constant.BUNDLE.PHOM.name;
                        var sceneName = "Phom";
                        var label = this.getLabelProgress(event);
                        var zoneid = 4;
                        if (label) {
                            this.getBundle(bundleName, sceneName, label, function (err, sceneName) {
                                if (!err) {
                                    if (this && cc.isValid(this.node)) {
                                        cc.error("sceneName: " + sceneName + " loaded!..");
                                        this.sceneName = sceneName;
                                        this.runGame(bundleName, this.sceneName, zoneid);
                                        this.stopRunActionLoadingCircle(event);
                                    }
                                }
                            }.bind(this));
                        }
                        break;
                    case "btnMaubinh":
                        this.runActionLoadingCircle(event);
                        var bundleName = Constant.BUNDLE.MAUBINH.name;
                        var sceneName = "MauBinh";
                        var label = this.getLabelProgress(event);
                        var zoneid = 14;
                        if (label) {
                            this.getBundle(bundleName, sceneName, label, function (err, sceneName) {
                                if (!err) {
                                    if (this && cc.isValid(this.node)) {
                                        cc.error("sceneName: " + sceneName + " loaded!..");
                                        this.sceneName = sceneName;
                                        this.runGame(bundleName, this.sceneName, zoneid);
                                        this.stopRunActionLoadingCircle(event);
                                    }
                                }
                            }.bind(this));
                        }
                        break;
                    case "PokerGame":
                    case "btnPoker": {
                        this.runActionLoadingCircle(event);
                        var bundleName = Constant.BUNDLE.POKER.name;
                        var sceneName = "Poker";
                        var label = this.getLabelProgress(event);
                        var zoneid = 15;
                        if (label) {
                            this.getBundle(bundleName, sceneName, label, function (err, sceneName) {
                                if (!err) {
                                    if (this && cc.isValid(this.node)) {
                                        cc.error("sceneName: " + sceneName + " loaded!..");
                                        this.sceneName = sceneName;
                                        this.runGame(bundleName, this.sceneName, zoneid);
                                        this.stopRunActionLoadingCircle(event);
                                    }
                                }
                            }.bind(this));
                        }
                        break;
                    }
                    case "Slot777Game":
                    case "btnSlot777":
                        var node = cc.find("Canvas/MiniSlot");
                        if (!node) {
                            this.runActionLoadingCircle(event);
                            var label = this.getLabelProgress(event);
                            var bundleName = Constant.BUNDLE.MINI_SLOT.name
                            if (label) {
                                this.getBundleAll(bundleName, function (err, bundle) {
                                    if (!err) {
                                        if (this && cc.isValid(this.node)) {
                                            cc.error("bundle: " + bundle + " loaded!..");
                                            bundle.load('prefab/MiniSlot', cc.Prefab, function (completedCount, totalCount, item) {
                                                this.onProgressPreloadScene(completedCount, totalCount, item, label);
                                            }.bind(this), (err, prefab) => {
                                                if (!err) {
                                                    var node = cc.find("Canvas/MiniSlot");
                                                    if (!node) {
                                                        node = cc.instantiate(prefab);
                                                        cc.find("Canvas").addChild(node, 10);
                                                    }
                                                }
                                                label.node.parent.active = false;
                                            });
                                        }
                                    }
                                }.bind(this))
                            }
                        } else {
                            this.stopRunActionLoadingCircle(event);
                            node.active = true;
                        }
                        break;
                    case "SlotCandy":
                        var node = cc.find("Canvas/Larva");
                        this.runActionLoadingCircle(event);
                        if (!node) {
                            var label = this.getLabelProgress(event);
                            var bundleName = Constant.BUNDLE.LARVA.name;
                            if (label) {
                                this.getBundleAll(bundleName, function (err, bundle) {
                                    if (!err) {
                                        if (this && cc.isValid(this.node)) {
                                            cc.error("bundle: " + bundle + " loaded!..");
                                            bundle.load('Larva', cc.Prefab, function (completedCount, totalCount, item) {
                                                this.onProgressPreloadScene(completedCount, totalCount, item, label);
                                            }.bind(this), (err, prefab) => {
                                                if (!err) {
                                                    var node = cc.find("Canvas/Larva");
                                                    if (!node) {
                                                        node = cc.instantiate(prefab);
                                                        cc.find("Canvas").addChild(node, 10);
                                                    }
                                                }
                                                label.node.parent.active = false;
                                            });
                                        }
                                    }
                                }.bind(this))
                            }
                        } else {
                            this.stopRunActionLoadingCircle(event);
                            node.active = true;

                        }
                        break;
                    case "btnMiniPoker":
                        var node = cc.find("Canvas/MiniPoker");
                        if (!node) {
                            this.runActionLoadingCircle(event);
                            var label = this.getLabelProgress(event);
                            var bundleName = Constant.BUNDLE.MINI_POKER.name;
                            if (label) {
                                this.getBundleAll(bundleName, function (err, bundle) {
                                    if (!err) {
                                        if (this && cc.isValid(this.node)) {
                                            cc.error("bundle: " + bundle + " loaded!..");
                                            bundle.load('MiniPoker', cc.Prefab, function (completedCount, totalCount, item) {
                                                this.onProgressPreloadScene(completedCount, totalCount, item, label);
                                            }.bind(this), (err, prefab) => {
                                                if (!err) {
                                                    var node = cc.find("Canvas/MiniPoker");
                                                    if (!node) {
                                                        node = cc.instantiate(prefab);
                                                        cc.find("Canvas").addChild(node, 10);
                                                    }
                                                }
                                                label.node.parent.active = false;
                                            });
                                        }
                                    }
                                }.bind(this))
                            }
                        } else {
                            this.stopRunActionLoadingCircle(event);
                            node.active = true;
                        }
                        break;
                    case "btnTaiXiu":
                        this.runActionLoadingCircle(event);
                        var node = cc.find("Canvas/Tai_Xiu");
                        if (!node) {
                            var label = this.getLabelProgress(event);
                            var bundleName = Constant.BUNDLE.TAI_XIU.name;
                            if (label) {
                                this.getBundleAll(bundleName, function (err, bundle) {
                                    if (!err) {
                                        if (this && cc.isValid(this.node)) {
                                            cc.error("bundle: " + bundle + " loaded!..");
                                            bundle.load('Tai_Xiu', cc.Prefab, function (completedCount, totalCount, item) {
                                                this.onProgressPreloadScene(completedCount, totalCount, item, label);
                                            }.bind(this), (err, prefab) => {
                                                if (!err) {
                                                    node = cc.instantiate(prefab);
                                                    cc.find("Canvas").addChild(node, cc.macro.MAX_ZINDEX - 3);

                                                    if (Linker.MiniGame && Linker.MiniGame.isValid) {
                                                        Linker.MiniGame.activeTimeTaiXiuMiniGame();
                                                    }
                                                }
                                                label.node.parent.active = false;
                                                this.joinTaiXiu();
                                            });
                                        }
                                    }
                                }.bind(this))
                            }
                        } else {
                            this.stopRunActionLoadingCircle(event);
                            node.active = true;
                            this.joinTaiXiu();
                        }
                        break;
                    case "SlotWuKong":
                    case "btnThinhKinh":
                        var node = cc.find("Canvas/Tay_Du_Ky");
                        this.runActionLoadingCircle(event);
                        if (!node) {
                            var label = this.getLabelProgress(event);
                            var bundleName = Constant.BUNDLE.TAY_DU_KY.name;
                            if (label) {
                                this.getBundleAll(bundleName, function (err, bundle) {
                                    if (!err) {
                                        if (this && cc.isValid(this.node)) {
                                            cc.error("bundle: " + bundle + " loaded!..");
                                            bundle.load('prefab/Tay_Du_Ky', cc.Prefab, function (completedCount, totalCount, item) {
                                                this.onProgressPreloadScene(completedCount, totalCount, item, label);
                                            }.bind(this), function (err, prefab) {
                                                if (!err) {
                                                    var node = cc.find("Canvas/Tay_Du_Ky");
                                                    if (!node) {
                                                        node = cc.instantiate(prefab);
                                                        cc.find("Canvas").addChild(node, 7);
                                                        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.REQUEST_CANVAS_ENABLE_CHILD_BY_NAME, true);
                                                        customEvent.nameChild = Utils.Malicious.getPortalGameName();
                                                        customEvent.enableChild = false;
                                                        this.node.dispatchEvent(customEvent);
                                                    }
                                                }
                                                label.node.parent.active = false;
                                            }.bind(this));
                                        }
                                    }
                                }.bind(this))
                            }
                        } else {
                            this.stopRunActionLoadingCircle(event);
                            node.active = true;
                            var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.REQUEST_CANVAS_ENABLE_CHILD_BY_NAME, true);
                            customEvent.nameChild = Utils.Malicious.getPortalGameName();
                            customEvent.enableChild = false;
                            this.node.dispatchEvent(customEvent);
                        }
                        break;
                    case "DragonLegend":
                    case "btnCachepHoaRong":
                        this.runActionLoadingCircle(event);
                        var node = cc.find("Canvas/SlotDragonLegend");
                        if (!node) {
                            var label = this.getLabelProgress(event);
                            var bundleName = Constant.BUNDLE.CA_CHEP_HOA_RONG.name;
                            if (label) {
                                this.getBundleAll(bundleName, function (err, bundle) {
                                    if (!err) {
                                        if (this && cc.isValid(this.node)) {
                                            cc.error("bundle: " + bundle + " loaded!..");
                                            bundle.load('prefabs/SlotDragonLegend', cc.Prefab, function (completedCount, totalCount, item) {
                                                this.onProgressPreloadScene(completedCount, totalCount, item, label);
                                            }.bind(this), function (err, prefab) {
                                                if (!err) {
                                                    var node = cc.find("Canvas/SlotDragonLegend");
                                                    if (!node) {
                                                        node = cc.instantiate(prefab);
                                                        cc.find("Canvas").addChild(node, 7);
                                                        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.REQUEST_CANVAS_ENABLE_CHILD_BY_NAME, true);
                                                        customEvent.nameChild = Utils.Malicious.getPortalGameName();
                                                        customEvent.enableChild = false;
                                                        this.node.dispatchEvent(customEvent);
                                                    }
                                                }
                                                label.node.parent.active = false;
                                            }.bind(this));
                                        }
                                    }
                                }.bind(this))
                            }
                        } else {
                            this.stopRunActionLoadingCircle(event);
                            node.active = true;
                            var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.REQUEST_CANVAS_ENABLE_CHILD_BY_NAME, true);
                            customEvent.nameChild = Utils.Malicious.getPortalGameName();
                            customEvent.enableChild = false;
                            this.node.dispatchEvent(customEvent);
                        }
                        break;
                    case "btnVQMM":
                        var node = cc.find("Canvas/LuckyWheel");
                        this.runActionLoadingCircle(event);
                        if (!node) {
                            var label = this.getLabelProgress(event);
                            var bundleName = Constant.BUNDLE.VQMM.name;
                            if (label) {
                                this.getBundleAll(bundleName, function (err, bundle) {
                                    if (!err) {
                                        if (this && cc.isValid(this.node)) {
                                            cc.error("bundle: " + bundle + " loaded!..");
                                            bundle.load('LuckyWheel', cc.Prefab, function (completedCount, totalCount, item) {
                                                this.onProgressPreloadScene(completedCount, totalCount, item, label);
                                            }.bind(this), (err, prefab) => {
                                                if (!err) {
                                                    var node = cc.find("Canvas/LuckyWheel");
                                                    if (!node) {
                                                        node = cc.instantiate(prefab);
                                                        cc.find("Canvas").addChild(node, 7);
                                                    }
                                                }
                                                label.node.parent.active = false;
                                            });
                                        }
                                    }
                                }.bind(this))
                            }
                        } else {
                            this.stopRunActionLoadingCircle(event);
                            node.active = true;

                        }
                        break;
                    case "NuoiCaGame":
                    case "btnNuoiCa":
                        var node = cc.find("Canvas/NuoiCa");
                        this.runActionLoadingCircle(event);
                        if (!node) {
                            var label = this.getLabelProgress(event);
                            var bundleName = Constant.BUNDLE.NUOI_CA.name;
                            if (label) {
                                this.getBundleAll(bundleName, function (err, bundle) {
                                    if (!err) {
                                        if (this && cc.isValid(this.node)) {
                                            cc.error("bundle: " + bundle + " loaded!..");
                                            bundle.load('prefabs/NuoiCa', cc.Prefab, function (completedCount, totalCount, item) {
                                                this.onProgressPreloadScene(completedCount, totalCount, item, label);
                                            }.bind(this), (err, prefab) => {
                                                if (!err) {
                                                    var node = cc.find("Canvas/NuoiCa");
                                                    if (!node) {
                                                        node = cc.instantiate(prefab);
                                                        cc.find("Canvas").addChild(node, 7);
                                                    }
                                                }
                                                label.node.parent.active = false;
                                            });
                                        }
                                    }
                                }.bind(this))
                            }
                        } else {
                            this.stopRunActionLoadingCircle(event);
                            node.active = true;

                        }
                        break;
                    case "BanSungGame":
                    case "ShootingButton": {
                        this.runActionLoadingCircle(event);
                        var bundleName = Constant.BUNDLE.CONG_KICH_CUONG_BAO.name;
                        var sceneName = "CongKichCuongBaoScene";
                        var label = this.getLabelProgress(event);
                        var zoneid = 48;
                        if (label) {
                            this.getBundle(bundleName, sceneName, label, function (err, sceneName) {
                                if (!err) {
                                    this.runGame(bundleName, sceneName, zoneid);
                                }
                            }.bind(this));
                        }
                        break;
                    }
                    case "PhiDaoGame":
                    case "btnDragger":
                        this.runActionLoadingCircle(event);
                        var bundleName = Constant.BUNDLE.PHI_DAO.name;
                        var sceneName = "PlayGameDagger";
                        var label = this.getLabelProgress(event);
                        var zoneid = 47;
                        if (label) {
                            this.getBundle(bundleName, sceneName, label, function (err, sceneName) {
                                if (!err) {
                                    if (this && cc.isValid(this.node)) {
                                        if (!this.sceneName) {
                                            cc.error("sceneName: " + sceneName + " loaded!..");
                                            this.sceneName = sceneName;
                                            this.runGame(bundleName, this.sceneName, zoneid);
                                        }
                                    }
                                }
                            }.bind(this))
                        }

                        break
                    default:
                        break;
                }
            }
        }

    }
});