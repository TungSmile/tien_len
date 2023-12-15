var Utils = require('Utils'),
    MINIGAME_POPUP_PREFAB = 'games/minigame/MinigamePopup',
    ACTIVE_OPACITY = 255,
    IDLE_OPACITY = 255 * 0.75,
    IDLE_TIMEOUT = 2000,
    SMALL_MOVE_DISTANCE = 50,
    BOUNDARY_PADDING = 10,
    MINIGAME_QUICK_ICON_POSITION_KEY = 'minigame_icon_pos';
var Linker = require('Linker');
var SocketConstant = require('SocketConstant');
var NewAudioManager = require('NewAudioManager');
var Api = require('Api');
var Global = require('Global');
var TaiXiuConstant = require('TaiXiuConstant');
var GameConstant = require('GameConstant');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        taixiuTimeLeftNode: cc.Node,
        taixiuTimeLeftLabel: cc.Label,
        taixiuTimeLeftLabel2: cc.Label,
        taixiuTimeLeftExtra: cc.Node,
        // popup: cc.Prefab,
        taiXiuPrefab: cc.Prefab,
        miniPokerPrefab: cc.Prefab,
        larvarPrefab: cc.Prefab,
        miniSlotPrefab: cc.Prefab,
        vqmmPrefab: cc.Prefab,
        countVqmm: cc.Node,
        isUpdate: true
        //miniPokerPrefab: cc.Prefab,
        //larvaPrefab: cc.Prefab,
        // kyun: Add vqmm Prefab
        // vqmmPrefab: cc.Prefab,
    },
    // onMiniGameClick(event) {

    //     if (!Linker.isOpenTaiXiu) {
    //         Linker.isOpenTaiXiu = true;
    //         Linker.MiniGame.taiXiuMini.active = true;
    //         Linker.MiniGame.taiXiuMini.zIndex = cc.macro.MAX_ZINDEX - 1;
    //         Linker.MiniGame.taiXiuMini.position = cc.v2(0, 0);
    //         Linker.MiniGame.taiXiuMini.opacity = 255;

    //     } else {
    //         if (Linker.MiniGame.taiXiuMini && Linker.MiniGame.taiXiuMini.position != cc.v2(0, 0)) {
    //             Linker.isOpenTaiXiu = true;
    //             Linker.MiniGame.taiXiuMini.zIndex = cc.macro.MAX_ZINDEX - 1;
    //             Linker.MiniGame.taiXiuMini.runAction(cc.moveTo(0.3, cc.v2(0, 0)));
    //             Linker.MiniGame.taiXiuMini.opacity = 255;
    //         }
    //     }
    //     this.hide();
    // },

    // use this for initialization
    onLoad: function () {
        this.initMiniGame();
        this.activeTimeTaiXiuMiniGame();
    },
    onEnable: function(){
        if(!Linker.MiniGame){
            Linker.MiniGame = this;
        }
    },
    activeTimeTaiXiuMiniGame: function () {
        var bundle = cc.assetManager.getBundle(Constant.BUNDLE.TAI_XIU.name);
        if (bundle) {
            this.taixiuTimeLeftNode.active = true;
            this.taixiuTimeLeftExtra.active = true;
        } else {
            this.taixiuTimeLeftNode.active = false;
            this.taixiuTimeLeftExtra.active = false;
        }
    },
    initMiniGame: function () {
        Linker.MiniGame = this;
        this.MIN_SCALE = 100 / this.node.width;
        this.MAX_SCALE = 120 / this.node.width;

        this.blinkAnimation = this.node.getComponentInChildren(cc.Animation);

        this.heartBeatAction = cc.sequence(
            cc.scaleTo(1, this.MIN_SCALE),
            cc.scaleTo(1, this.MAX_SCALE)
        ).repeatForever();

        this.touchStartTime = Date.now();
        this.mouseEnter = false;

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        // this.node.on(cc.Node.EventType.MOUSE_ENTER, function () {
        //     this.mouseEnter = true;
        //     this._cancelScheduleIdleState();
        // }, this);
        // this.node.on(cc.Node.EventType.MOUSE_LEAVE, function () {
        //     if (this.mouseEnter) {
        //         this._scheduleIdleState();
        //     }
        //     this.mouseEnter = false;
        // }, this);

        var position = this._loadPosition();
        if (position) {
            this.node.position = position;
        }
        this.node.position = this._correctPosition(this.node.position);
        this._scheduleIdleState();
        this.onTinhNangNew();
        // EventDispatcher.addEventListener(EventDispatcherConstant.TINH_NANG.NEW, this.onTinhNangNew, this);
        this.show();

        // kyun: Add vqmm
        // Linker.MiniGame.vqmm = cc.instantiate(this.vqmmPrefab);
        // Linker.MiniGame.vqmm.active = false;
        // cc.find("Canvas/MiniGame/Container").addChild(Linker.MiniGame.vqmm);
        // kyun: EOF Add vqmm
        // this.initPokerMiniGame();
        // this.initVqmmMiniGame();
        // this.initLarvaMiniGame();
        // this.initTaiXiuMiniGame();
        // this.initSlotMiniGame();
        Linker.MINI = this.node;
        // Linker.MiniGame.taiXiuMini.opacity = 0;
        // cc.game.addPersistRootNode(Linker.MINI);
        var obj = 'userId=' + Linker.userData.userId;
        try {
            Api.postNoJson(Global.configPurchase.API_URL + "vqmn-count", obj, (data) => {
                if (data) {
                    if (Number(data.count) > 0) {
                        this.countVqmm.active = true;
                        this.countVqmm.getComponent(cc.Label).string = data.count;
                    } else {
                        this.countVqmm.active = false;
                    }
                } else {
                    cc.Global.showMessage('Đã xảy ra lỗi, Vui lòng thử lại sau');
                }
            })
        } catch (error) {
        }
        this.openMini = false;
        this.node.zIndex = cc.macro.MAX_ZINDEX;
        this.node.parent.zIndex = cc.macro.MAX_ZINDEX - 1;
        var s = cc.director.getScene();
        var cvas = s.getChildByName("Canvas");
        var miniGame = cvas.getChildByName("MiniGame");
        this.node.parent = miniGame;
        this.addSocketEvent();
        // Linker.MiniGame.taiXiuMini.active = true;

        // if (Linker.userData != null && Linker.userData.displayName != null) {
        //     if (Linker.firstGoToHome && Linker.userData.displayName.length > 3) {
        //         Linker.firstGoToHome = false;
        //         this.onMiniGameClick();
        //     }
        // }
    },
    initPokerMiniGame: function () {
        //remove mini pocker before

        Linker.MiniGame.minipoker = cc.instantiate(this.miniPokerPrefab);
        Linker.MiniGame.minipoker.active = false;
        var ctn = cc.find("Canvas/MiniGame/Container");
        if (ctn) {
            var miniBf = ctn.getChildByName("MiniPoker");
            if (miniBf) {
                miniBf.removeFromParent(true);
            }
            ctn.addChild(Linker.MiniGame.minipoker);
        }
    },
    initLarvaMiniGame: function () {
        //remove larvar before
        Linker.MiniGame.larvaMini = cc.instantiate(this.larvarPrefab);
        Linker.MiniGame.larvaMini.active = false;
        var ctn = cc.find("Canvas/MiniGame/Container");
        if (ctn) {
            var lavarBf = ctn.getChildByName("Larva");
            if (lavarBf) {
                lavarBf.removeFromParent(true);
            }
            ctn.addChild(Linker.MiniGame.larvaMini);
        }
    },
    initVqmmMiniGame: function () {
        //remove vqmm before
        Linker.MiniGame.vqmm = cc.instantiate(this.vqmmPrefab);
        Linker.MiniGame.vqmm.active = false;
        var ctn = cc.find("Canvas/MiniGame/Container");
        if (ctn) {
            var vqmmrBf = ctn.getChildByName("VQMM");
            if (vqmmrBf) {
                vqmmrBf.removeFromParent(true);
            }
            ctn.addChild(Linker.MiniGame.vqmm);
        }
    },
    initSlotMiniGame: function () {
        //remove miniSlot before
        Linker.MiniGame.slotMini = cc.instantiate(this.miniSlotPrefab);
        Linker.MiniGame.slotMini.active = false;
        var ctn = cc.find("Canvas/MiniGame/Container");
        if (ctn) {
            var miniSlot = ctn.getChildByName("MiniSlot");
            if (miniSlot) {
                miniSlot.removeFromParent(true);
            }
            ctn.addChild(Linker.MiniGame.slotMini);
        }
    },
    initTaiXiuMiniGame: function () {
        //remove tai xiu before
        Linker.MiniGame.taiXiuMini = cc.instantiate(this.taiXiuPrefab);
        //Linker.MiniGame.taiXiuMini.active = false;
        Linker.MiniGame.taiXiuMini.zIndex = cc.macro.MAX_ZINDEX - 1;
        Linker.MiniGame.taiXiuMini.position = cc.v2(3000, 3000);

        var ctn = cc.find("Canvas/MiniGame/Container");
        if (ctn) {
            var taixiuBf = ctn.getChildByName("Tai_Xiu");
            if (taixiuBf) {
                taixiuBf.getComponent("TaiXiuController").removeAllTaxiuListener();
                taixiuBf.removeFromParent(true);

            }
            ctn.addChild(Linker.MiniGame.taiXiuMini);
            var testdata = {
                "r": [{
                    "v": "12004\u0004"
                }]
            }
            Linker.Socket.send(JSON.stringify(testdata)); 
        }
    },
    addSocketEvent: function () {
        // Linker.MiniGame.taiXiuMini.getComponent("TaiXiuController").addSocketEvent();
        Linker.Event.addEventListener(SocketConstant.GAME.TAI_XIU.UPDATE_TAI_XIU, this._updateTaiXiuTimeLeft, this);
        Linker.Event.addEventListener(SocketConstant.GAME.TAI_XIU.PHIEN_TX_STATE, this._onPhienTXState, this);
    },
    onDestroy: function () {
        Linker.Event.removeEventListener(SocketConstant.GAME.TAI_XIU.UPDATE_TAI_XIU, this._updateTaiXiuTimeLeft, this);
        Linker.Event.removeEventListener(SocketConstant.GAME.TAI_XIU.PHIEN_TX_STATE, this._onPhienTXState, this);
        // if(Linker.MiniGame) Linker.MiniGame = null;    
    },
    // called every frame, uncomment this function to activate update callback
    update: function () {
        if (this.isUpdate && Linker.TaiXiuController) {
            this._updateTaiXiu();
        }
    },
    unScheduleUpdate: function () {
        this.isUpdate = false;
    },
    updateSchedule: function () {
        this.isUpdate = true;
    },
    onTinhNangNew: function () {
        // this.taixiuTimeLeftNode.active = TinhNangManager.choPhep(GameConstant.TAI_XIU.ID);
    },

    onTouchStart: function () {
        this.touchStartTime = Date.now();
        this._cancelScheduleIdleState();
    },

    onTouchMove: function (event) {
        var location = event.getLocation();
        this.node.position = location;
    },
    onTouchEnd: function (event) {
        NewAudioManager.playClick();
        var container = cc.find('Canvas/MiniGame/MinigameQuickIcon/Container');
        var currentLocation = event.getLocation();
        var startLocation = event.getStartLocation();
        //neu click thi open container con neu move thi khong open container
        if (currentLocation.sub(startLocation).mag() <= 20) {
            //neu khong move thi open container
            if (container) {
                if (!container.active) {
                    this.showMiniContainer(container);
                } else {
                    this.hideMiniContainer(container);
                }
            }
        }
        this.updatePosition({ event: event });
        //sau khi move xong tiep tuc chay hieu ung heart beat =)
        this.mouseEnter = false;
    },
    showMiniContainer: function (container) {
        var s = this.heartBeatAction.getTarget();
        if (s) {
            this.node.stopAction(this.heartBeatAction);
        }
        if (container) {
            container.rotation = 0;
            container.active = true;
            container.scale = 0;
            var animationTime = 0.2,
                animation = cc.spawn([
                    cc.scaleTo(animationTime, 1),
                    cc.rotateBy(animationTime, -720),
                    cc.fadeIn(animationTime)
                ]);
            container.runAction(animation);
            var timeLabel = cc.find('Canvas/MiniGame/MinigameQuickIcon/TaiXiuTimeLeft/BgTime');
            if (timeLabel) {
                timeLabel.active = false;
            }
            //after 2s mini game se tu dong an, set time out cho truong hop nay
            var self = this;
            this._timeOutHideMiniGameContainer = setTimeout(function () {
                if (!container) {
                    var container = cc.find('Canvas/MiniGame/MinigameQuickIcon/Container');
                    if (container) {
                        self.hideMiniContainer(container);
                        self.updatePosition({ event: null });
                    }
                } else {
                    self.hideMiniContainer(container);
                    self.updatePosition({ event: null });
                }
            }, 3000);
        }
    },
    updatePosition: function (eventDataController) {
        //set up lai vi tri cua container hoac icon sau khi move hoac click
        var newPosition = this.getValidPosition(eventDataController);
        var animationTime = 0.2;
        //move den vi tri dam bao nguoi dung co the nhin thay va click mini game
        this.node.runAction(cc.sequence(cc.moveTo(animationTime, newPosition),
            cc.callFunc(function () {
                var container = cc.find('Canvas/MiniGame/MinigameQuickIcon/Container');
                if (container && !container.active) {
                    this.node.runAction(this.heartBeatAction).repeatForever();
                }
            }.bind(this))
        ));
    },
    hideMiniContainer: function (container) {
        if (this._timeOutHideMiniGameContainer) {
            clearTimeout(this._timeOutHideMiniGameContainer);
        }
        container.rotation = -720;
        var animationTime = 0.2;
        var animation = cc.spawn([
            cc.scaleTo(animationTime, 0),
            cc.rotateBy(animationTime, 720),
            cc.fadeOut(animationTime)
        ]);
        var c = cc.callFunc(function () {
            container.active = false;
        }, this);
        container.runAction(cc.sequence(animation, c));
        var timeLabel = cc.find('Canvas/MiniGame/MinigameQuickIcon/TaiXiuTimeLeft/BgTime');
        if (timeLabel) {
            timeLabel.active = true;
        }
        //cap nhat lai vi tri cho dung

    },
    getValidPosition: function (eventDataController) {
        var event = eventDataController.event;
        var size = cc.winSize;
        var currentPosition = (event) ? event.getLocation() : this.node.getPosition();
        var leftOffset = (currentPosition.x <= 0) ? true : false;
        var rightOffset = (currentPosition.x >= size.width) ? true : false;
        var bottomOffset = (currentPosition.y <= 0) ? true : false;
        var topOffset = (currentPosition.y >= size.height) ? true : false;
        var insideWidthSize = (currentPosition.x > 0 && currentPosition.x < cc.winSize.width);
        var insideHeightSize = (currentPosition.y > 0 && currentPosition.y < cc.winSize.height);
        var insideWinSize = (insideWidthSize && insideHeightSize) ? true : false;
        //xet cac truong hop offset
        if (insideWinSize) {
            //neu inside khong can di chuyen, co the chay animation co keo
            return this.findAPosition({ event: event, tag: "insideborder" });
        } else if (insideWidthSize && topOffset) {
            //tren
            return this.findAPosition({ event: event, tag: "toptobottom" });
        } else if (insideWidthSize && bottomOffset) {
            //se di tu duoi len tren
            //duoi
            return this.findAPosition({ event: event, tag: "bottomtotop" });

        } else if (insideHeightSize && leftOffset) {
            //se di tu trai sang phai
            //trai
            return this.findAPosition({ event: event, tag: "lefttoright" });

        } else if (insideHeightSize && rightOffset) {
            //se di tu phai sang trai
            //phai
            return this.findAPosition({ event: event, tag: "righttoleft" });

        } else if (!insideWinSize && bottomOffset && leftOffset) {
            //se di mot goc tu vi tri hien tai den vi tri hop le co offset
            //o duoi ngoai bounding va lech trai
            return this.findAPosition({ event: event, tag: "anglelefttoright" });

        } else if (!insideWinSize && bottomOffset && rightOffset) {
            //se di mot goc tu vi tri hien tai den vi tri hop le co offset
            //o duoi ngoai bounding va lech phai
            return this.findAPosition({ event: event, tag: "anglerighttoleft" });

        } else if (!insideWinSize && topOffset && leftOffset) {
            //se di mot goc tu vi tri hien tai den vi tri hop le co offset
            //o tren ngoai bounding va lech trai
            return this.findAPosition({ event: event, tag: "angletoptobottom" });

        } else if (!insideWinSize && topOffset && rightOffset) {
            //se di mot goc tu vi tri hien tai den vi tri hop le co offset
            //o tren ngoai bounding va lech phai
            return this.findAPosition({ event: event, tag: "anglebottomtotop" });
        } else {
            //get default
            return this.findAPosition({ event: event, tag: "default" });
        }
    },
    findAPosition: function (eventDataController) {
        var event = eventDataController.event;
        var tag = eventDataController.tag;
        var currentPosition = (event) ? event.getCurrentTarget().getPosition() : this.node;
        var pos = cc.v2(0, 0);
        var container = cc.find('Canvas/MiniGame/MinigameQuickIcon/Container');
        var x = 0;
        var y = 0;

        var bdBox = (container && container.active) ? container.getContentSize() : this.node.getContentSize();
        switch (tag) {
            case "toptobottom":
                var dis = currentPosition.sub(cc.v2(currentPosition.x, cc.winSize.height)).mag();
                x = currentPosition.x + dis * Math.cos(cc.misc.degreesToRadians(270));
                y = currentPosition.y + dis * Math.sin(cc.misc.degreesToRadians(270));
                pos = this.getOffsetPos(x, y, bdBox, container);
                break;
            case "bottomtotop":
                var dis = currentPosition.sub(cc.v2(currentPosition.x, 0)).mag();
                x = currentPosition.x + dis * Math.cos(cc.misc.degreesToRadians(90));
                y = currentPosition.y + dis * Math.sin(cc.misc.degreesToRadians(90));
                pos = this.getOffsetPos(x, y, bdBox, container);
                break;
            case "righttoleft":
                var dis = currentPosition.sub(cc.v2(cc.winSize.width, currentPosition.y)).mag();
                x = currentPosition.x + dis * Math.cos(cc.misc.degreesToRadians(180));
                y = currentPosition.y + dis * Math.sin(cc.misc.degreesToRadians(180));
                pos = this.getOffsetPos(x, y, bdBox, container);
                break;
            case "lefttoright":
                var dis = currentPosition.sub(cc.v2(0, currentPosition.y)).mag();
                x = currentPosition.x + dis * Math.cos(cc.misc.degreesToRadians(0));
                y = currentPosition.y + dis * Math.sin(cc.misc.degreesToRadians(0));
                pos = this.getOffsetPos(x, y, bdBox, container);
                break;
            case "anglerighttoleft":
                pos = this.getOffsetPos(currentPosition.x, currentPosition.y, bdBox, container);
                break;
            case "anglelefttoright":
                pos = this.getOffsetPos(currentPosition.x, currentPosition.y, bdBox, container);
                break;
            case "angletoptobottom":
                pos = this.getOffsetPos(currentPosition.x, currentPosition.y, bdBox, container);
                break;
            case "anglebottomtotop":
                pos = this.getOffsetPos(currentPosition.x, currentPosition.y, bdBox, container);
                break;
            case "insideborder":
                pos = this.getOffsetPos(currentPosition.x, currentPosition.y, bdBox, container);
                break;
            default:
                pos = this.getOffsetPos(currentPosition.x, currentPosition.y, bdBox, container);
                break;
        }
        return pos;
    },
    getOffsetPos: function (x, y, bdBox, container) {
        var size = cc.winSize;
        var pos = cc.v2(x, y);
        var offsetX = 0;
        var offsetY = 0;
        var halfMiniIconSize = (container && container.active) ? 56 * 0.5 : 0;

        //cho x
        if ((pos.x + bdBox.width * 0.5 + halfMiniIconSize) >= size.width) {

            var x1 = pos.sub(cc.v2(size.width, pos.y)).mag();
            var x2 = pos.sub(cc.v2(pos.x + bdBox.width * 0.5 + halfMiniIconSize, pos.y)).mag();
            offsetX = x2 - x1;
            pos.x = pos.x - offsetX;
        } else if (pos.x - bdBox.width * 0.5 - halfMiniIconSize <= 0) {
            var x1 = pos.sub(cc.v2(0, y)).mag();
            var x2 = pos.sub(cc.v2(pos.x - bdBox.width * 0.5 - halfMiniIconSize, pos.y)).mag();
            offsetX = x2 - x1;
            pos.x = pos.x + offsetX;
        }
        //cho y
        if ((pos.y + bdBox.height * 0.5 + halfMiniIconSize) >= size.height) {
            var y1 = pos.sub(cc.v2(pos.x, size.height)).mag();
            var y2 = pos.sub(cc.v2(pos.x, pos.y + bdBox.height * 0.5 + halfMiniIconSize)).mag();
            offsetY = y2 - y1;
            pos.y = pos.y - offsetY;

        } else if (pos.y - bdBox.height * 0.5 - halfMiniIconSize <= 0) {
            var y1 = pos.sub(cc.v2(pos.x, 0)).mag();
            var y2 = pos.sub(cc.v2(pos.x, pos.y - bdBox.height * 0.5 - halfMiniIconSize)).mag();
            offsetY = y2 - y1;
            pos.y = pos.y + offsetY;
        }
        return pos;
    },
    show: function () {
        this._correctPositionToShow();

        var animationTime = 0.2,
            animation = cc.spawn([
                cc.scaleTo(animationTime, 1),
                cc.rotateBy(animationTime, -720),
                cc.fadeIn(animationTime)
            ]);
        this.node.runAction(cc.sequence(animation, cc.callFunc(this._scheduleIdleState.bind(this))));
    },

    hide: function () {
        this._correctPositionToHide();

        var animationTime = 0.2,
            animation = cc.spawn([
                cc.scaleTo(animationTime, 0),
                cc.rotateBy(animationTime, 720),
                cc.fadeOut(animationTime)
            ]);
        this.node.runAction(animation);
    },

    _getShortestBoundaryPosition: function (position, size) {
        var winSize = cc.winSize,
            xMin = 0,
            xMax = xMin + winSize.width,
            yMin = 0,
            yMax = yMin + winSize.height,
            width = size ? size.width : this.node.width,
            halfWidth = width / 2,
            height = size ? size.height : this.node.height,
            halfHeight = height / 2,
            deltaXLeft = position.x - xMin,
            deltaXRight = xMax - position.x,
            deltaYTop = yMax - position.y,
            deltaYBottom = position.y - yMin,
            minDelta = Math.min(deltaXLeft, deltaXRight, deltaYTop, deltaYBottom),
            newPos = {
                x: position.x,
                y: position.y
            };

        switch (minDelta) {
            case deltaXLeft:
                newPos.x = xMin + halfWidth;
                break;

            case deltaXRight:
                newPos.x = xMax - halfWidth;
                break;

            case deltaYTop:
                newPos.y = yMax - halfHeight;
                break;

            case deltaYBottom:
                newPos.y = yMin + halfHeight;
                break;
        }

        return newPos;
    },

    _correctPosition: function (position, size) {
        var winSize = cc.winSize,
            xMin = 0,
            xMax = xMin + winSize.width,
            yMin = 0,
            yMax = yMin + winSize.height,
            width = size ? size.width : this.node.width,
            halfWidth = width / 2,
            height = size ? size.height : this.node.height,
            halfHeight = height / 2,
            xLeft = position.x - halfWidth,
            xRight = position.x + halfWidth,
            yTop = position.y + halfHeight,
            yBottom = position.y - halfHeight;

        if (xLeft < xMin) {
            xLeft = xMin + halfWidth;
        } else if (xRight > xMax) {
            xLeft = xMax - halfWidth;
        } else {
            xLeft = position.x;
        }

        if (yBottom < yMin) {
            yBottom = yMin + halfHeight;
        } else if (yTop > yMax) {
            yBottom = yMax - halfHeight;
        } else {
            yBottom = position.y;
        }

        return cc.v2(xLeft, yBottom);
    },

    _correctPositionToShow: function () {
        this.node.stopAllActions();
        this.node.scale = 0;
        this.node.angle = 0;
        this.node.opacity = 0;
    },

    _correctPositionToHide: function () {
        this.node.stopAllActions();
        this.node.scale = 1;
        this.node.angle = 0;
        this.node.opacity = 255;
    },

    _changeToIdleState: function () {
        if (this.node) {
            var container = cc.find('Canvas/MiniGame/MinigameQuickIcon/Container');
            if (!container) return;
            if (container.active) {
                return;
            }
            this.node.opacity = IDLE_OPACITY;
            if (this.node.scale >= this.MIN_SCALE) {
                var self = this,
                    oldWidth = this.node.width,
                    oldHeight = this.node.height,
                    newWidth = oldWidth * this.MAX_SCALE,
                    newHeight = oldHeight * this.MAX_SCALE,
                    halfNewWidth = newWidth / 2,
                    halfNewHeight = newHeight / 2,
                    winSize = cc.winSize,
                    xMin = 0,
                    xMax = xMin + winSize.width,
                    yMin = 0,
                    yMax = yMin + winSize.height,
                    deltaWidth = oldWidth - newWidth,
                    deltaHeight = oldHeight - newHeight,
                    xLeft = this.node.x - deltaWidth / 2,
                    xRight = this.node.x + deltaWidth / 2,
                    yTop = this.node.y + deltaHeight / 2,
                    yBottom = this.node.y - deltaHeight / 2,
                    newSize = {
                        width: newWidth,
                        height: newHeight
                    },
                    newPos = this._correctPosition(this.node.position, newSize);

                newPos = this._getShortestBoundaryPosition(newPos, newSize);

                if (Math.abs(xMin - (xLeft - halfNewWidth)) < BOUNDARY_PADDING) {
                    newPos.x = xLeft;
                } else if (Math.abs(xMax - (xRight + halfNewWidth)) < BOUNDARY_PADDING) {
                    newPos.x = xRight;
                }

                if (Math.abs(yMax - (yTop + halfNewHeight)) < BOUNDARY_PADDING) {
                    newPos.y = yTop;
                } else if (Math.abs(yMin - (yBottom - halfNewHeight)) < BOUNDARY_PADDING) {
                    newPos.y = yBottom;
                }

                this.node.scale = this.MAX_SCALE;
                this.node.runAction(cc.sequence(
                    cc.moveTo(0.3, newPos),
                    cc.callFunc(function () {
                        self.node.runAction(self.heartBeatAction);
                    })
                ));
            }

            if (this.blinkAnimation) {
                this.blinkAnimation.stop();
            }
        }

    },

    _changeToActiveState: function () {
        try {
            this.node.stopAction(this.heartBeatAction);
            if (this.node.scale >= this.MIN_SCALE && this.node.scale <= this.MAX_SCALE) {
                var action = cc.spawn([
                    cc.scaleTo(0.2, 1),
                    cc.moveTo(0.2, this._correctPosition(this.node.position))
                ]);
                this.node.runAction(action);
            }
        } catch (e) { }

        this.node.opacity = ACTIVE_OPACITY;
        if (this.blinkAnimation) {
            this.blinkAnimation.play();
        }
    },

    _scheduleIdleState: function () {
        this._cancelScheduleIdleState();
        this._idleTimeoutId = setTimeout(this._changeToIdleState.bind(this), IDLE_TIMEOUT);
    },

    _cancelScheduleIdleState: function () {
        if (this._idleTimeoutId) {
            clearTimeout(this._idleTimeoutId);
            this._idleTimeoutId = null;
        }
        this._changeToActiveState();
    },

    _updateTaiXiu: function () {
        this.nowTime = this.lastTime - Date.now();
        if (this.nowTime > 0) {
            this.taixiuTimeLeftLabel.string = Math.round(this.nowTime / 1000) + "";
            this.taixiuTimeLeftLabel2.string = Math.round(this.nowTime / 1000) + "";
        } else {
            //this.allowBetting = false;
            if (this.gameState == TaiXiuConstant.GAME_STATE.GAME_TAI) {
                this.taixiuTimeLeftLabel.string = "Tài";
                this.taixiuTimeLeftLabel2.string = "Tài";
            } else if (this.gameState == TaiXiuConstant.GAME_STATE.GAME_XIU) {
                this.taixiuTimeLeftLabel.string = "Xỉu";
                this.taixiuTimeLeftLabel2.string = "Xỉu";
            } else {
                this.taixiuTimeLeftLabel.string = "Cân cửa";
                this.taixiuTimeLeftLabel2.string = "Cân cửa";
            }
        }
        // Linker.TaiXiuController.updateControlledByMiniGame();
    },

    _updateTaiXiuTimeLeft: function (message) {
        // var gameRuntimeConfigs = GameManager.getGameRuntimeConfigs(GameConstant.TAI_XIU.CMD),
        //     gameManager = gameRuntimeConfigs && gameRuntimeConfigs.gameManager;
        // if (gameManager) {
        //     this.taixiuTimeLeftLabel.string = gameManager.getFormattedCurrentTimeLeft();
        // }
        // this.taixiuTimeLeftLabel.string = message.timeOut;
        this.lastTime = Number(message.timeOut) * 1000 + Date.now();
    },

    _onPhienTXState: function (message) {
        if (message) {
            if (message.phienTXstate) {
                if (message.phienTXstate == 5) {
                    this.gameState = TaiXiuConstant.GAME_STATE.GAME_CHECK;
                }
                if (message.phienTXstate == 2) {
                    this.gameState = TaiXiuConstant.GAME_STATE.GAME_NULL;
                    this.gameState = this.checkGame_Tai_Xiu(message.kq1, message.kq2, message.kq3);
                }
            }

            if (message.totalMatch && message.phienTXstate == 1) {
                this.gameState == TaiXiuConstant.GAME_STATE.GAME_CHECK;
            }
        }
    },

    checkGame_Tai_Xiu(x1, x2, x3) {
        var p1 = this.check_Point_XucXac(x1);
        var p2 = this.check_Point_XucXac(x2);
        var p3 = this.check_Point_XucXac(x3);
        var check = p1 + p2 + p3;
        if (check > 10) {
            return TaiXiuConstant.GAME_STATE.GAME_TAI;
        }
        else {
            return TaiXiuConstant.GAME_STATE.GAME_XIU;
        }
    },

    check_Point_XucXac(x) {
        if (x == 1) return 1;
        else if (x == 2) return 2;
        else if (x == 3) return 3;
        else if (x == 4) return 4;
        else if (x == 5) return 5;
        else if (x == 6) return 6;
    },

    _savePosition: function () {
        cc.sys.localStorage.setItem(MINIGAME_QUICK_ICON_POSITION_KEY, JSON.stringify({
            x: this.node.x,
            y: this.node.y
        }));
    },

    _loadPosition: function () {
        try {
            var position = JSON.parse(cc.sys.localStorage.getItem(MINIGAME_QUICK_ICON_POSITION_KEY));
            if (position && Utils.Type.isDefined(position.x) && Utils.Type.isDefined(position.y)) {
                // position.x=0;
                // position.y=0;
                return position;
            }
        } catch (e) {
            return null;
        }
    },
    removeAllTaxiuListener: function () {
        Linker.Event.removeEventListener(SocketConstant.GAME.TAI_XIU.UPDATE_TAI_XIU, this._updateTaiXiuTimeLeft, this);
    },

    onMiniGamePokerClick(event) {
        NewAudioManager.playClick();
        if (!Linker.MiniGame) {
            Linker.MiniGame = this;
            Linker.MiniGame.initPokerMiniGame();
        }
        Linker.MiniGame.minipoker.active = true;
        Linker.MiniGame.minipoker.zIndex = cc.macro.MAX_ZINDEX - 1;
        Linker.MiniGame.minipoker.position = cc.v2(0, 0);

        cc.find('Canvas/MiniGame/MinigameQuickIcon/Container').active = !cc.find('Canvas/MiniGame/MinigameQuickIcon/Container').active;
        var timeLabel = cc.find('Canvas/MiniGame/MinigameQuickIcon/TaiXiuTimeLeft/BgTime');
        if (cc.find('Canvas/MiniGame/MinigameQuickIcon/Container').active == true) {
            timeLabel.active = false;
        } else {
            timeLabel.active = true;
        }
    },

    onMiniGameLarvaClick(event) {
        NewAudioManager.playClick();
        if (!Linker.MiniGame) {
            Linker.MiniGame = this;
            Linker.MiniGame.initLarvaMiniGame();
        }
        Linker.MiniGame.larvaMini.active = true;
        Linker.MiniGame.larvaMini.zIndex = cc.macro.MAX_ZINDEX - 1;
        Linker.MiniGame.larvaMini.position = cc.v2(0, 0);

        cc.find('Canvas/MiniGame/MinigameQuickIcon/Container').active = !cc.find('Canvas/MiniGame/MinigameQuickIcon/Container').active;
        var timeLabel = cc.find('Canvas/MiniGame/MinigameQuickIcon/TaiXiuTimeLeft/BgTime');
        if (cc.find('Canvas/MiniGame/MinigameQuickIcon/Container').active == true) {
            timeLabel.active = false;
        } else {
            timeLabel.active = true;
        }
    },

    onMiniGameVqmmClick(event) {
        NewAudioManager.playClick();
        if (!Linker.MiniGame) {
            Linker.MiniGame = this;
            Linker.MiniGame.initVqmmMiniGame();

        }
        if (!Linker.MiniGame.vqmm.active) {
            Linker.MiniGame.vqmm.getComponent('MovableObject').turnOn();
            Linker.MiniGame.vqmm.active = true;
            Linker.MiniGame.vqmm.zIndex = cc.macro.MAX_ZINDEX - 1;
            Linker.MiniGame.vqmm.position = cc.v2(0, 0);

            cc.find('Canvas/MiniGame/MinigameQuickIcon/Container').active = !cc.find('Canvas/MiniGame/MinigameQuickIcon/Container').active;
            var timeLabel = cc.find('Canvas/MiniGame/MinigameQuickIcon/TaiXiuTimeLeft/BgTime');
            if (cc.find('Canvas/MiniGame/MinigameQuickIcon/Container').active == true) {
                timeLabel.active = false;
            } else {
                timeLabel.active = true;
            }
        }

    },

    onMiniGameClick(event) {
        NewAudioManager.playClick();
        if (!Linker.MiniGame) {
            Linker.MiniGame = this;
            Linker.MiniGame.initTaiXiuMiniGame();        
               
        }
        if (!Linker.isOpenTaiXiu || !Linker.MiniGame.taiXiuMini.active) {
            Linker.isOpenTaiXiu = true;
            Linker.MiniGame.taiXiuMini.active = true;
            Linker.MiniGame.taiXiuMini.zIndex = cc.macro.MAX_ZINDEX - 1;
            Linker.MiniGame.taiXiuMini.position = cc.v2(0, 0);
            Linker.MiniGame.taiXiuMini.opacity = 255;

        } else {
            if (Linker.MiniGame.taiXiuMini && Linker.MiniGame.taiXiuMini.position != cc.v2(0, 0)) {
                Linker.isOpenTaiXiu = true;
                Linker.MiniGame.taiXiuMini.zIndex = cc.macro.MAX_ZINDEX - 1;
                Linker.MiniGame.taiXiuMini.runAction(cc.moveTo(0.3, cc.v2(0, 0)));
                Linker.MiniGame.taiXiuMini.opacity = 255;
            }
        }
        cc.find('Canvas/MiniGame/MinigameQuickIcon/Container').active = false;
        var timeLabel = cc.find('Canvas/MiniGame/MinigameQuickIcon/TaiXiuTimeLeft/BgTime');
        if (cc.find('Canvas/MiniGame/MinigameQuickIcon/Container').active == true) {
            timeLabel.active = false;
        } else {
            timeLabel.active = true;
        }
    },

    onMiniGameSlotClick(event) {
        NewAudioManager.playClick();
        if (!Linker.MiniGame) {
            Linker.MiniGame = this;
            Linker.MiniGame.initSlotMiniGame();
        }
        Linker.MiniGame.slotMini.active = true;
        Linker.MiniGame.slotMini.zIndex = cc.macro.MAX_ZINDEX - 1;
        Linker.MiniGame.slotMini.position = cc.v2(0, 0);

        Linker.MiniSlotView.showGamePlay(true);

        cc.find('Canvas/MiniGame/MinigameQuickIcon/Container').active = !cc.find('Canvas/MiniGame/MinigameQuickIcon/Container').active;
        var timeLabel = cc.find('Canvas/MiniGame/MinigameQuickIcon/TaiXiuTimeLeft/BgTime');
        if (cc.find('Canvas/MiniGame/MinigameQuickIcon/Container').active == true) {
            timeLabel.active = false;
        } else {
            timeLabel.active = true;
        }
    },
});