var Linker = require('Linker');
var TQUtil = require('TQUtil');
var NewAudioManager = require('NewAudioManager');
var GameConstant = require('GameConstant');
var BiDaConstant = require('BiDaConstant');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        initDefaultMoney: 500,
        currentMoney: 0,
        moneyText: {
            type: cc.Label,
            displayName: "moneyText",
            default: null
        },
        nohu_bg: {
            type: cc.Sprite,
            displayName: "nohu_bg",
            default: null
        },
        nohu_spine: {
            type: sp.Skeleton,
            displayName: "nohu_spine",
            default: null
        },
        sukienDialogV2Prefab: cc.Prefab,
        cofferDialogPrefab: cc.Prefab
    },
    onLoad() {
        if (this.isValidToShow()) {
            this.node.parent.active = true;
            this.init();
            this.runAsAnimation();
        } else {
            this.node.parent.active = false;
            this.removeEventSocket();
        }
    },
    runAsAnimation: function () {
        var parent = this.node.parent;
        var anhSang = parent.getChildByName("as");
        if (anhSang) {
            anhSang.opacity = 0;
            anhSang.setScale(0.0, 0.0);
            anhSang.runAction(
                cc.repeatForever(
                    cc.sequence(
                        cc.spawn(
                            cc.scaleTo(2, 0.56),
                            cc.fadeIn(3)
                        ),
                        cc.delayTime(1.5),
                        cc.spawn(
                            cc.scaleTo(2, 0.48),
                            cc.fadeOut(3)
                        )
                    )
                )

            )
        }

    },
    init() {
        // this.addMouseController();
        this.addSocketEvent();
        this.onUpdateMoneyNoHuInfo();

    },
    addSocketEvent() {
        Linker.Event.addEventListener(1004, this.onUpdateMoneyNoHuInfo, this);
    },
    removeEventSocket() {
        Linker.Event.removeEventListener(1004, this.onUpdateMoneyNoHuInfo, this);
    },
    onClickIcon() {
        if (Linker.ZONE != 4 && Linker.ZONE != 5 && Linker.ZONE != 14) {
            NewAudioManager.playClick();
            var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_NO_HU, true);
            this.node.dispatchEvent(customEvent);
        } else {
            var node = cc.Canvas.instance.node.getChildByName("CofferDialog");
            if (!node) {
                var cofferDialogPrefab = cc.instantiate(this.cofferDialogPrefab);
                cc.Canvas.instance.node.addChild(cofferDialogPrefab, cc.macro.MAX_ZINDEX);
            } else {
                node.active = true;
            }
        }
    },
    onUpdateMoneyNoHuInfo: function () {
        if (Linker.Hu && Linker.HuTemp) {
            var currentStringM = Number(this.moneyText.string.replace(/\./g, ''));
            if (Linker.Hu.hasOwnProperty("listHu") && Linker.HuTemp.hasOwnProperty("listHu")) {
                if (Linker.Hu.listHu.hasOwnProperty(GameConstant.IDHUSLOT.idNoHuGameBai) &&
                    Linker.Hu.listHu[GameConstant.IDHUSLOT.idNoHuGameBai].hasOwnProperty("0") &&
                    Linker.HuTemp.listHu.hasOwnProperty(GameConstant.IDHUSLOT.idNoHuGameBai) &&
                    Linker.HuTemp.listHu[GameConstant.IDHUSLOT.idNoHuGameBai].hasOwnProperty("0")
                ) {
                    if (Linker.Hu.listHu[GameConstant.IDHUSLOT.idNoHuGameBai] && Linker.Hu.listHu[GameConstant.IDHUSLOT.idNoHuGameBai][0] && Linker.HuTemp.listHu[GameConstant.IDHUSLOT.idNoHuGameBai][0] && Linker.HuTemp.listHu[GameConstant.IDHUSLOT.idNoHuGameBai][0].moneyHu1) {
                        var currentM = Number(Linker.HuTemp.listHu[GameConstant.IDHUSLOT.idNoHuGameBai][0].moneyHu1);
                        var nextM = Number(Linker.Hu.listHu[GameConstant.IDHUSLOT.idNoHuGameBai][0].moneyHu1);
                        if (Linker.ZONE == 8 || Linker.ZONE == 84 || Linker.ZONE == 86) {
                            if (Linker.HuTemp.listHu[GameConstant.IDHUSLOT.idBida][0] && Linker.Hu.listHu[GameConstant.IDHUSLOT.idBida][0]) {
                                currentM = Number(Linker.HuTemp.listHu[GameConstant.IDHUSLOT.idBida][0].moneyHu1);
                                nextM = Number(Linker.Hu.listHu[GameConstant.IDHUSLOT.idBida][0].moneyHu1);
                            }

                        } else if (Linker.ZONE == 45) {
                            if (Linker.Hu.listHu[GameConstant.IDHUSLOT.idSoccerGalaxy] && Linker.Hu.listHu[GameConstant.IDHUSLOT.idSoccerGalaxy][0]) {
                                currentM = Number(Linker.HuTemp.listHu[GameConstant.IDHUSLOT.idSoccerGalaxy][0].moneyHu1);
                                nextM = Number(Linker.Hu.listHu[GameConstant.IDHUSLOT.idSoccerGalaxy][0].moneyHu1);
                            }

                        } else if (Linker.ZONE == 46) {
                            if (Linker.Hu.listHu[GameConstant.IDHUSLOT.idHeadBall] && Linker.Hu.listHu[GameConstant.IDHUSLOT.idHeadBall][0]) {
                                currentM = Number(Linker.HuTemp.listHu[GameConstant.IDHUSLOT.idHeadBall][0].moneyHu1);
                                nextM = Number(Linker.Hu.listHu[GameConstant.IDHUSLOT.idHeadBall][0].moneyHu1);
                            }
                        }
                        if (nextM > currentM) {
                            this.runMoneyTextAnimation(currentM, nextM, 2, this.moneyText);
                            Linker.HuTemp = Linker.Hu;
                        } else {
                            this.runMoneyTextAnimation(currentStringM, nextM, 2, this.moneyText);
                        }
                    }
                }
            }

        } else {
            Linker.HuTemp = Linker.Hu;
        }
    },
    addMouseController() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },
    onTouchStart: function () {
        this.touchStartTime = Date.now();
    },

    onTouchMove: function (event) {
        if (!this.isLobbyScene()) {
            this.node.position = event.getLocation();
        }

    },
    isLobbyScene: function () {
        var sceneName = cc.Global.getSceneName();
        return (sceneName == "LobbyScene") ? true : false;
    },
    onTouchEnd: function (event) {
        NewAudioManager.playClick();
        var container = cc.find('Canvas/NoHuIcon/NoHuContainer');
        var currentLocation = event.getLocation();
        var startLocation = event.getStartLocation();
        //neu click thi open container con neu move thi khong open container
        if (!this.isLobbyScene()) {
            if (currentLocation.sub(startLocation).mag() <= 20) {
                //neu khong move thi open container
                if (container) {
                    this.showSukienDialogContainer();
                }
            }
            this.updatePosition({ event: event });
            //sau khi move xong tiep tuc chay hieu ung heart beat =)
        } else {
            this.showSukienDialogContainer();
        }

    },
    showSukienDialogContainer: function () {
        var dialog = cc.find("Canvas/sukienDialogV2");
        if (!dialog) {
            var sk = cc.instantiate(this.sukienDialogV2Prefab);
            sk.position = cc.v2(0, 0);
            sk.active = true;
            sk.zIndex = cc.macro.MAX_ZINDEX - 1;
            cc.find("Canvas").addChild(sk);
            var sks = sk.getComponent("sukienDialogV2");
            sks.configPopup({
                data: {
                    currentGameId: 91,
                    currentTabId: 0
                }
            });
            sks.launchSukien();
        } else if (dialog && dialog.active == false) {
            dialog.active = true;
            var sks = dialog.getComponent("sukienDialogV2");
            sks.configPopup({
                data: {
                    currentGameId: 91,
                    currentTabId: 0
                }
            });
            sks.launchSukien();
        } else if (dialog && dialog.active == true) {
            dialog.active = false;
        }
    },
    updatePosition: function (eventDataController) {
        //set up lai vi tri cua container hoac icon sau khi move hoac click
        var newPosition = this.getValidPosition(eventDataController);
        var animationTime = 0.2;
        //move den vi tri dam bao nguoi dung co the nhin thay va click mini game
        this.node.runAction(cc.moveTo(animationTime, newPosition));
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
        var container = cc.find('Canvas/NoHuIcon/NoHuContainer');
        var x = 0;
        var y = 0;
        // var bdBox = (container && container.active) ? container.getContentSize() : this.node.getContentSize();
        var bdBox = this.node.getContentSize();

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
        var halfMiniIconSize = (container && container.active) ? 10 * 0.5 : 0;

        //cho x
        if ((pos.x + bdBox.width * container.scaleX * 0.2 * 0.5 + halfMiniIconSize) >= size.width) {

            var x1 = pos.sub(cc.v2(size.width, pos.y)).mag();
            var x2 = pos.sub(cc.v2(pos.x + bdBox.width * container.scaleX * 0.2 * 0.5 + halfMiniIconSize, pos.y)).mag();
            offsetX = x2 - x1;
            pos.x = pos.x - offsetX;
        } else if (pos.x - bdBox.width * container.scaleX * 0.2 * 0.5 - halfMiniIconSize <= 0) {
            var x1 = pos.sub(cc.v2(0, y)).mag();
            var x2 = pos.sub(cc.v2(pos.x - bdBox.width * container.scaleX * 0.2 * 0.5 - halfMiniIconSize, pos.y)).mag();
            offsetX = x2 - x1;
            pos.x = pos.x + offsetX;
        }
        //cho y
        if ((pos.y + bdBox.height * container.scaleY * 0.2 * 0.5 + halfMiniIconSize) >= size.height) {
            var y1 = pos.sub(cc.v2(pos.x, size.height)).mag();
            var y2 = pos.sub(cc.v2(pos.x, pos.y + bdBox.height * container.scaleY * 0.2 * 0.5 + halfMiniIconSize)).mag();
            offsetY = y2 - y1;
            pos.y = pos.y - offsetY;

        } else if (pos.y - bdBox.height * container.scaleY * 0.2 * 0.5 - halfMiniIconSize <= 0) {
            var y1 = pos.sub(cc.v2(pos.x, 0)).mag();
            var y2 = pos.sub(cc.v2(pos.x, pos.y - bdBox.height * container.scaleY * 0.2 * 0.5 - halfMiniIconSize)).mag();
            offsetY = y2 - y1;
            pos.y = pos.y + offsetY;
        }
        return pos;
    },
    isValidToShow: function () {
        var cardGameType = {
            maubinhType: 14,
            tlmnType: 5,
            phomType: 4,
            samType: 37,
            xocdiaType: 10,
            bacayType: 11,
            liengType: 9,
            pokerType: 15,
            bida11Type: 8,
            bida14Type: 84,
            bidaPhom: 86,
        }
        var condition = [cardGameType.maubinhType, cardGameType.tlmnType, cardGameType.phomType, cardGameType.samType, cardGameType.bida14Type, cardGameType.bida11Type, cardGameType.bidaPhom];
        cc.log(" Linker._sceneTag", Linker._sceneTag);
        if (Linker.Config) {
            return (Linker.Config.ISBAINOHU == 1 && ((condition.indexOf(Linker.ZONE) != -1) || Linker._sceneTag == Constant.TAG.scenes.HOME || Linker._sceneTag == Constant.TAG.scenes.LOBBY)) ? true : false;
        }
        return false;
    },
    runMoneyTextAnimation: function (currentMoney, nextMoney, timeRunAction, moneyText) {
        // if (currentMoney >= nextMoney) {
        //     return;
        // }
        moneyText.value = nextMoney;
        var duration = timeRunAction * 1000;
        var range = nextMoney - currentMoney;
        // no timer shorter than 50ms (not really visible any way)
        var minTimer = 50;
        // calc step time to show all interediate values
        var stepTime = Math.abs(Math.floor(duration / range));

        // never go below minTimer
        stepTime = Math.max(stepTime, minTimer);

        // get current time and calculate desired end time
        var startTime = new Date().getTime();
        var endTime = startTime + duration;
        var timer;

        function run() {
            var now = new Date().getTime();
            var remaining = Math.max((endTime - now) / duration, 0);

            var value = Math.round(nextMoney - (remaining * range));

            if (moneyText && moneyText.isValid) {
                moneyText.string = TQUtil.addDot(value);
            } else {
                clearInterval(timer);
            }
            if (Number(value) == Number(nextMoney)) {
                clearInterval(timer);
            }
        }
        timer = setInterval(run, stepTime);
        run();
    },
    onDestroy: function () {
        this.removeEventSocket();
    }

});
