var Constant = require('Constant');
var Linker = require("Linker");
var Utils = require('Utils');
var NewAudioManager = require('NewAudioManager');
const LobbySend = require("LobbySend");
cc.Class({
    extends: cc.Component,
    properties: {
        buttonUI: cc.Node,
        homeTouchEventNode: cc.Node,
        night: cc.Node
    },
    onHomeButtonClick: function (event) {
        if (event) {
            var buttonNode = event.currentTarget;
            if (buttonNode) {
                var buttonType = buttonNode.getComponent("ButtonTypes");
                if (buttonType) {
                    var _nameTag = buttonType.getNameGameTag();
                    var _bundleTag = buttonType.getBundleNameTag();
                    if (_nameTag != Constant.GAME_NAME.UNDEFINED && _bundleTag != Constant.BUNDLE_NAME.UNDEFINED) {
                        var bundleName = buttonType.getBundleNameByTag(_bundleTag);
                        var zoneId = buttonType.getZoneId();
                        if (bundleName) {
                            var loadingPercent;
                            if (this.loadingPercentLabel) {
                                loadingPercent = this.loadingPercentLabel;
                                loadingPercent.string = "Loading 0%...";
                            }
                            var loadingButtonContainer = buttonType.getLoadingButtonContainer();
                            this.getBundle(function (err, bundle) {
                                if (!err) {
                                    var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.ON_BUTTON_GAME_HALL_SCENE_CLICK, true);
                                    customEvent.isButtonGameClick = true;
                                    customEvent.chooseZone = null;
                                    customEvent.name = null;


                                    if (zoneId) {
                                        var sceneName = Utils.Malicious.getBundleNameAndSceneNameByZoneId(zoneId);
                                        if (sceneName) {
                                            customEvent.chooseZone = zoneId;
                                            customEvent.name = sceneName;
                                        }
                                    }
                                    event.isButtonGameClick = customEvent.isButtonGameClick;
                                    event.sceneName = customEvent.sceneName;

                                    event.loadingContainer = loadingButtonContainer;
                                    event.chooseZone = zoneId;
                                    event.name = sceneName;
                                    customEvent.data = event;
                                    this.node.dispatchEvent(customEvent);
                                } else {
                                    cc.error("Lỗi", err);
                                }
                            }.bind(this), bundleName, loadingPercent);
                        } else {
                            cc.error("Không thể get được tên bundle cần tải game button...");
                            if (cb) {
                                cb(true, null);
                            }
                        }


                    }
                } else {
                    var nameButton = buttonNode.name;
                    switch (nameButton) {
                        case "shop":
                            if (!Linker.isLogin && Linker.HomeManager && Linker.HomeManager.isValid) {
                                Linker.HomeManager.showLayer();
                                return;
                            }
                            Linker.ShopType = 0;
                            var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_NAP, true);
                            customEvent.isNapXu = true;
                            this.node.dispatchEvent(customEvent);
                            break;
                        default:
                            break;
                    }
                }
            }

        }
    },

    quickPlay (event) {
        var buttonNode = event.currentTarget;
        if (buttonNode) {
            var buttonType = buttonNode.getComponent("ButtonTypes");
            if (buttonType) {
                if (Linker.ZONE) {
                    var sceneName;
                    var sceneName2;
                    var bundleName;

                    var loadingButtonContainer = buttonType.getLoadingButtonContainer();
                    var animation = loadingButtonContainer.getComponent(cc.Animation);

                    loadingButtonContainer.active = true;
                    var labelLoading = loadingButtonContainer.getChildByName("loadingText").getComponent(cc.Label);
                    var bundleNameObj = Utils.Malicious.getBundleNameAndSceneNameByZoneId(Linker.ZONE);
                    if (bundleNameObj) {
                        bundleName = bundleNameObj.bundleName;
                        sceneName = bundleNameObj.sceneNameLoad;
                        sceneName2 = bundleNameObj.sceneNameLoad2;
                        if (bundleName) {
                            // loginViewComponent.showLoadingProgress();
                            if (animation) {
                                animation.play("btnLoading");
                            }
                            console.log("sceneName",sceneName);
                            // cc.director.loadScene(sceneName);
                            // Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                            //     if (!err) {
                            //         Linker.isLoadingRecconnectGame = true;
                            //         gameLoaderBundle.preloadScene(sceneName, function (completedCount, totalCount, item) {
                            //             this.onProgressPreloadScene(completedCount, totalCount, item, labelLoading);
                            //         }.bind(this), function (err, scene) {
                            //             if (!err) {
                            //                 var isPortrait = false;
                                            if (Linker.ZONE == Constant.ZONE_ID.BAN_SUNG || Linker.ZONE == Constant.ZONE_ID.PHI_DAO) {
                                                sceneName = sceneName2;
                                                isPortrait = true;
                                                NativeBridge.changeOrientationH(false);
                                            }
                            //                 gameLoaderBundle.loadScene(sceneName, function (err, scene) {
                            //                     if (!err) {
                            //                         if (!isPortrait) {
                            //                             cc.director.runSceneImmediate(scene, null, (err, scene) => {
                            //                                 if (!err) {
                                                                // 
                                                                // animation.play("btnStopLoading");
                                                                cc.Canvas.instance.getComponentInChildren("PortalView").createQuickPlay();
                            //                                 }
                            //                             });
                            //                         }
                            //                     }
                            //                 })
                            //             }

                            //         }.bind(this));
                            //     } else {
                            //         cc.error(err);
                            //         Linker.isLoadingRecconnectGame = false;
                            //     }
                            // }.bind(this), bundleName);
                        }
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

    getBundle: function (cb, bundleName, loadingPercent) {
        if (bundleName) {
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
            }.bind(this), bundleName, loadingPercent);
        } else {
            if (cb) {
                cb(true, null);
            }
        }
    },
    onLoad() {
        this._unhide = 0;
        Linker.isDay = true;
        this.validTimeClick = 0.2;
        this.maxClickRange = 10;
    },
    onDisable() {
        this.unschedule(this.opacityNight2);
        this.unschedule(this.opacityNight);
    },
    getHomeTouchEvent: function () {
        if (this.homeTouchEventNode && cc.isValid(this.homeTouchEventNode)) {
            var homeTouchEventScript = this.homeTouchEventNode.getComponent("HomeTouchEvent");
            if (homeTouchEventScript) {
                return homeTouchEventScript;
            }
        }
        return null;
    },
    start() {
        this.addButtonTouchevent();
        // this.countDownToNight();
        this.runSoundGame();
    },
    addButtonTouchevent: function () {
        if (this.buttonUI && this.buttonUI.children.length > 0) {
            for (var i = 0; i < this.buttonUI.children.length; i++) {
                var button = this.buttonUI.children[i];
                if (button && cc.isValid(button)) {

                    button.on(cc.Node.EventType.TOUCH_START, this.onButtonMapStart, this);
                    button.on(cc.Node.EventType.TOUCH_MOVE, this.onButtonMapMove, this);
                    button.on(cc.Node.EventType.TOUCH_END, this.onButtonMapEnd, this);
                    button.on(cc.Node.EventType.TOUCH_CANCEL, this.onButtonMapCancle, this);

                    // for (var j = 0; j < button.children.length; j++) {
                    //     var polyButton = button.children[j];
                    //     if (polyButton) {
                    //         var _polygonColiderButton = polyButton.getComponent("PolygonColiderButton");
                    //         if (_polygonColiderButton) {
                    // polyButton.on(cc.Node.EventType.TOUCH_START, this.onButtonMapStart, this);
                    // polyButton.on(cc.Node.EventType.TOUCH_MOVE, this.onButtonMapMove, this);
                    // polyButton.on(cc.Node.EventType.TOUCH_END, this.onButtonMapEnd, this);
                    // polyButton.on(cc.Node.EventType.TOUCH_CANCEL, this.onButtonMapCancle, this);
                    //         }
                    //     }

                    // }

                }
            }
            //bật debugger để xem vùng collider
            // cc.director.getCollisionManager().enabled = true;
            // cc.director.getCollisionManager().enabledDebugDraw = true;
        }
    },

    countDownToNight() {
        this.time = new Date().getMinutes();
        this._unhide = Linker.CurrentOpacity;
        if (!this._unhide)
            this._unhide = 0;

        if (this._unhide < 175)
            this._unhide = 0;
        else
            this._unhide = 255;
        this.night.opacity = this._unhide;
        this.schedule(this.opacityNight, 20, 1000, 0);
    },

    opacityNight() {
        this.schedule(this.opacityNight2, 0.1, 128, 0);
    },

    opacityNight2() {
        if (Linker.isDay) {
            this.night.opacity = this._unhide;
            this._unhide += 2;
            if (this._unhide > 255) {
                this._unhide = 255;
                Linker.isDay = false;
            }
            Linker.CurrentOpacity = this._unhide;
        }
        else {
            this.night.opacity = this._unhide;
            this._unhide -= 2;
            if (this._unhide < 0) {
                this._unhide = 0;
                Linker.isDay = true;
            }
            Linker.CurrentOpacity = this._unhide;
        }
    },
    pushTouchEventToHomeTouch: function (event) {
        if (event) {
            var homeTouchEventScript = this.getHomeTouchEvent();
            if (homeTouchEventScript && cc.isValid(homeTouchEventScript)) {
                homeTouchEventScript.onMovingButtonMap(event);
            }
        }
    },
    onButtonMapStart: function (event) {
        if (event) {
            this.eventTouchStart = event.getLocation();
            this.isClickStart = true;
            event._key = cc.Node.EventType.TOUCH_START;
            this.pushTouchEventToHomeTouch(event);

            //check run sound game
            var dataClick = this.checkInsideButton(event);
            if (dataClick.isInside && dataClick.buttonNode) {
                this.runSoundGame(dataClick.buttonNode);
            }
        }
    },
    runSoundGame: function (node) {
        if (node) {
            var btnTypes = node.getComponent("ButtonTypes");
            if (btnTypes && btnTypes.NAME_GAME) {
                if (this.activeSoundNode !== node) {
                    this.activeSoundNode = node;
                } else {
                    return;
                }
                var NAME_GAME = btnTypes.NAME_GAME;
                switch (NAME_GAME) {
                    case Constant.GAME_NAME.UNDEFINED:
                        break;
                    case Constant.GAME_NAME.BIDA_8:
                        break;
                    case Constant.GAME_NAME.BIDA_TA_LA:
                        break;
                    case Constant.GAME_NAME.SOCCER:
                        NewAudioManager.playAudioClipFX(NewAudioManager.SOUND_GAME.TRANG_CHU.COMMON.BONG_DA, 1, false, false, Constant.BUNDLE.TRANG_CHU.name);
                        break;
                    case Constant.GAME_NAME.HEADBALL:
                        NewAudioManager.playAudioClipFX(NewAudioManager.SOUND_GAME.TRANG_CHU.COMMON.BONG_DA, 1, false, false, Constant.BUNDLE.TRANG_CHU.name);
                        break;
                    case Constant.GAME_NAME.FOOTBALL:
                        NewAudioManager.playAudioClipFX(NewAudioManager.SOUND_GAME.TRANG_CHU.COMMON.BONG_DA, 1, false, false, Constant.BUNDLE.TRANG_CHU.name);
                        break;
                    case Constant.GAME_NAME.BAN_SUNG:
                        NewAudioManager.playAudioClipFX(NewAudioManager.SOUND_GAME.TRANG_CHU.COMMON.TIENG_SUNG, 1, false, false, Constant.BUNDLE.TRANG_CHU.name);
                        break;
                    case Constant.GAME_NAME.PHI_DAO:
                        NewAudioManager.playAudioClipFX(NewAudioManager.SOUND_GAME.TRANG_CHU.COMMON.PHI_DAO, 1, false, false, Constant.BUNDLE.TRANG_CHU.name);
                        break;
                    case Constant.GAME_NAME.POCKER:
                        break;
                    case Constant.GAME_NAME.CA_CHEP_HOA_RONG:
                        break;
                    case Constant.GAME_NAME.SLOT_777:
                        break;
                    case Constant.GAME_NAME.BIDA:
                        break;
                    case Constant.GAME_NAME.NUOI_CA:
                        NewAudioManager.playAudioClipFX(NewAudioManager.SOUND_GAME.TRANG_CHU.COMMON.SONG_NUOC, 1, false, false, Constant.BUNDLE.TRANG_CHU.name);
                        break;
                    case Constant.GAME_NAME.TAY_DU_KY:
                        break;
                    case Constant.GAME_NAME.SLOT_CANDY:
                        break;
                    case Constant.GAME_NAME.TLMN:
                        break;
                    default:
                        break;
                }
            }
        } else {
            var timeCoiXe = Utils.Malicious.randomMinMax(60, 120);
            this.schedule(function () {
                NewAudioManager.playAudioClipFX(NewAudioManager.SOUND_GAME.TRANG_CHU.COMMON.COI_XE, 1, false, false, Constant.BUNDLE.TRANG_CHU.name);
            }, timeCoiXe, cc.macro.REPEAT_FOREVER, 5);

            var timeGio = Utils.Malicious.randomMinMax(120, 180);
            this.schedule(function () {
                NewAudioManager.playAudioClipFX(NewAudioManager.SOUND_GAME.TRANG_CHU.COMMON.GIO, 1, false, false, Constant.BUNDLE.TRANG_CHU.name);
            }, timeGio, cc.macro.REPEAT_FOREVER, 15);
        }
    },
    onButtonMapMove: function (event) {
        if (event) {
            this.isClickStart = true;
            event._key = cc.Node.EventType.TOUCH_MOVE;
            this.pushTouchEventToHomeTouch(event);
        }
    },
    getClickRange: function () {
        if (this.eventTouchStart && this.eventTouchEnd) {
            return this.eventTouchEnd.sub(this.eventTouchStart).mag();
        }
        return -1;
    },
    isInsideButton: function (event) {
        this.clickRange = this.getClickRange();
        if (event && this.timeClick <= this.validTimeClick && this.clickRange > -1 && this.clickRange <= this.maxClickRange) {

            var location = event.getLocation();
            var button = event.currentTarget;
            if (button) {

                var childrenButton = button.children;
                if (childrenButton && childrenButton.length > 0) {
                    var i = 0;
                    var j = 0;
                    var posX = 0;
                    var posY = 0;
                    var polygonWPoints = [];
                    for (i; i < childrenButton.length; i++) {
                        var polyButton = childrenButton[i];
                        if (polyButton) {
                            var _polygonColiderButton = polyButton.getComponent("PolygonColiderButton");
                            if (_polygonColiderButton) {
                                var HQ_POLY = polyButton.getChildByName("HQ_POLY");
                                if (HQ_POLY) {
                                    var polygonRangeClick = HQ_POLY.getComponent(cc.PolygonCollider);
                                    if (polygonRangeClick) {
                                        var points = polygonRangeClick.points;
                                        if (points) {
                                            for (j; j < points.length; j++) {
                                                posX = points[j].x;
                                                posY = points[j].y;
                                                polygonWPoints.push(polyButton.parent.convertToWorldSpaceAR(cc.v2(posX, posY)));
                                            }
                                        }
                                        if (polygonWPoints && polygonWPoints.length > 0) {
                                            if (cc.Intersection.pointInPolygon(location, polygonWPoints)) {
                                                return true;
                                            } else {
                                                return false;
                                            }
                                        } else {
                                            return false;
                                        }
                                    }

                                }

                            }
                        }
                    }
                }
            }
        }
        return false;
    },
    isInsideButtons: function (event) {
        this.clickRange = this.getClickRange();
        if (event && this.timeClick <= this.validTimeClick && this.clickRange > -1 && this.clickRange <= this.maxClickRange) {
            var location = event.getLocation();
            for (var k = 0; k < this.buttonUI.children.length; k++) {
                var button = this.buttonUI.children[k];
                if (button) {
                    var childrenButton = button.children;
                    if (childrenButton && childrenButton.length > 0) {
                        var i = 0;
                        var j = 0;
                        var posX = 0;
                        var posY = 0;
                        var polygonWPoints = [];
                        for (i; i < childrenButton.length; i++) {
                            var polyButton = childrenButton[i];
                            if (polyButton) {
                                var _polygonColiderButton = polyButton.getComponent("PolygonColiderButton");
                                if (_polygonColiderButton) {
                                    var HQ_POLY = polyButton.getChildByName("HQ_POLY");
                                    if (HQ_POLY) {
                                        var polygonRangeClick = HQ_POLY.getComponent(cc.PolygonCollider);
                                        if (polygonRangeClick) {
                                            var points = polygonRangeClick.points;
                                            if (points) {
                                                for (j; j < points.length; j++) {
                                                    posX = points[j].x;
                                                    posY = points[j].y;
                                                    polygonWPoints.push(polyButton.parent.convertToWorldSpaceAR(cc.v2(posX, posY)));
                                                }
                                            }
                                            if (polygonWPoints && polygonWPoints.length > 0) {
                                                if (cc.Intersection.pointInPolygon(location, polygonWPoints)) {
                                                    return { buttonNode: button, isInside: true };
                                                }
                                            }
                                        }

                                    }

                                }
                            }
                        }
                    }
                }
            }
        }
        return { buttonNode: null, isInside: false };
    },
    checkInsideButton: function (event) {
        this.clickRange = this.getClickRange();
        if (event) {
            var location = event.getLocation();
            for (var k = 0; k < this.buttonUI.children.length; k++) {
                var button = this.buttonUI.children[k];
                if (button) {
                    var childrenButton = button.children;
                    if (childrenButton && childrenButton.length > 0) {
                        var i = 0;
                        var j = 0;
                        var posX = 0;
                        var posY = 0;
                        var polygonWPoints = [];
                        for (i; i < childrenButton.length; i++) {
                            var polyButton = childrenButton[i];
                            if (polyButton) {
                                var _polygonColiderButton = polyButton.getComponent("PolygonColiderButton");
                                if (_polygonColiderButton) {
                                    var HQ_POLY = polyButton.getChildByName("HQ_POLY");
                                    if (HQ_POLY) {
                                        var polygonRangeClick = HQ_POLY.getComponent(cc.PolygonCollider);
                                        if (polygonRangeClick) {
                                            var points = polygonRangeClick.points;
                                            if (points) {
                                                for (j; j < points.length; j++) {
                                                    posX = points[j].x;
                                                    posY = points[j].y;
                                                    polygonWPoints.push(polyButton.parent.convertToWorldSpaceAR(cc.v2(posX, posY)));
                                                }
                                            }
                                            if (polygonWPoints && polygonWPoints.length > 0) {
                                                if (cc.Intersection.pointInPolygon(location, polygonWPoints)) {
                                                    return { buttonNode: button, isInside: true };
                                                }
                                            }
                                        }

                                    }

                                }
                            }
                        }
                    }
                }
            }
        }
        return { buttonNode: null, isInside: false };
    },
    onButtonMapEnd: function (event) {
        if (event) {
            this.eventTouchEnd = event.getLocation();
            this.isClickStart = false;
            event._key = cc.Node.EventType.TOUCH_END;
            this.pushTouchEventToHomeTouch(event);
            var isClick = false;
            if (event._multipleTouch) {
                var dataClick = this.isInsideButtons(event);
                isClick = dataClick.isInside;
                event.buttonNode = dataClick.buttonNode;
            } else {
                isClick = this.isInsideButton(event);
            }
            if (isClick) {
                if (event._multipleTouch) {
                    event.currentTarget = event.buttonNode;
                    event._tmpTarget = event.target;
                    event.target = event.buttonNode;
                }
                this.onHomeButtonClick(event);
            }
            this.clickRange = -1;
            this.eventTouchStart = null;
            this.eventTouchEnd = null;
        }
    },
    onButtonMapCancle: function (event) {
        if (event) {
            this.eventTouchStart = null;
            this.eventTouchEnd = null;
            this.clickRange = -1;
            this.isClickStart = false;
            event._key = cc.Node.EventType.TOUCH_CANCEL;
            this.pushTouchEventToHomeTouch(event);

        }
    },
    update: function (dt) {
        if (this.isClickStart) {
            if (isNaN(this.timeClick) == true) {
                this.timeClick = 0;
            }
            this.timeClick += dt;
        } else {
            this.timeClick = 0;
        }
    }
});
