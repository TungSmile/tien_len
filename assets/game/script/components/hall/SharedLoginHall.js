var NewAudioManager = require('NewAudioManager');
var Linker = require('Linker');
var SceneManager = require('SceneManager');
var NodePoolManager = require('NodePoolManager');
var SocketConstant = require('SocketConstant');
var BiDaConstant = require('BiDaConstant');
var BiDaOfflineController = require('BiDaOfflineController');
cc.Class({
    extends: cc.Component,

    properties: {

        samLoading: cc.Node,

        switchGame: cc.Node,
        buttonGameBaiFrame: cc.SpriteFrame,
        buttonGameSlotFrame: cc.SpriteFrame,
        gameContainer: {
            type: cc.PageView,
            displayName: "gameContainer",
            default: null
        },
        listContent: {
            default: [],
            type: cc.Node
        },
        listBtn: {
            default: [],
            type: cc.Node
        },

        samGame: cc.Node,

        xocdiaGame: cc.Node,
        xosoGame: cc.Node,
        notifyPrefab: cc.Node,
        //
        xocdiaMiniPrefab: cc.Prefab,
        xosoPrefab: cc.Prefab,
        xosoLoading: cc.Node,
        lobbyContaier: cc.Node,
        lobbyPrefab: cc.Prefab,
        biDaGameContainer: cc.Node,
        biDaGamePrefab: cc.Prefab,
        centerGameContainer: cc.Node,
        hallView: cc.Node,
        biDaGame1vs4Container: cc.Node,
        biDaGame1vs4Prefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.SharedLoginHall = this;
        this.isLoaded = true;
        this.node.on("ACTIVE_ALL_PROPERIES", function () { this.node.active = true; }.bind(this));
        this.configLobbyHallScene();
        this.updateFrameSwitch();
        this.node.on("ON_UPDATE_TIME_LEFT_XO_SO", this.onUpdateTimeleftXoSo, this);
        if (Linker.notifyText) {
            this.notifyPrefab.getChildByName("text_thongbao").getComponent(cc.Label).string = Linker.notifyText;
        }
        if (!!Linker.checkLeaveScenePlay) {
            Linker.checkLeaveScenePlay = null;
            this.insLobbyPrefab(this);
            this.initHall();
        }
    },
    initHall() {
        // SceneManager.loadScene('HallScene', function () {
            Linker.HallController.removeEventSocket();
            Linker.HallController.removeEventSocket();
            Linker.HallController.initHallScene();
            Linker.HallController.controlledOnEnable();
            Linker.HallController.infoUser();
            Linker.HallController.addSocketEvent();
            // Linker.HallController.showLayer();
        // });
    }
    ,
    onUpdateTimeleftXoSo: function (data) {
        this.resetTimerXoSo();
        if (data.timeleft && data.timeleft > 0) {
            Linker.timeLeftXoSo = data.timeleft;
            this.setCountDownTime(data.timeleft, this["xosoGame"].getChildByName("timer"));
        } else {
            this.resetTimerXoSo();
        }
    },
    resetTimerXoSo: function () {
        Linker.timeLeftXoSo = 0;
        var timeNode = this["xosoGame"].getChildByName("timer");
        var hn = timeNode.getChildByName("hlabel");
        var mn = timeNode.getChildByName("mlabel");
        var sn = timeNode.getChildByName("slabel");

        var h = hn.getComponent(cc.Label);
        var m = mn.getComponent(cc.Label);
        var s = sn.getComponent(cc.Label);

        h.string = "..";
        m.string = "..";
        s.string = "..";
        // hn.color = cc.color("#ffffff");
        // mn.color = cc.color("#ffffff");
        // sn.color = cc.color("#ffffff");
    },
    setTimerXoSo: function (hours, minutes, seconds) {
        var timeNode = this["xosoGame"].getChildByName("timer");
        var hn = timeNode.getChildByName("hlabel");
        var mn = timeNode.getChildByName("mlabel");
        var sn = timeNode.getChildByName("slabel");

        var h = hn.getComponent(cc.Label);
        var m = mn.getComponent(cc.Label);
        var s = sn.getComponent(cc.Label);
        h.string = hours;
        m.string = minutes;
        s.string = seconds;
        return { colornode: { hour: hn, minute: mn, second: sn } };
    },
    setCountDownTime(time, timeNode) {
        if (time >= 0) {


            timeNode.active = true;
            timeNode.stopAllActions();
            var _this = this;
            time *= 1000;
            timeNode.runAction(cc.sequence(cc.callFunc(function () {
                var actionCount = cc.repeatForever(cc.sequence(cc.callFunc(function () {
                    var XoSo = cc.find("Canvas/Xo_So");
                    if (time > 0) {
                        time -= 1000;//1second
                        var timeStr = cc.Global.getCountTimeStringByMillis(time);
                        var timeArr = timeStr.split(":");
                        var colorData = _this.setTimerXoSo(timeArr[0], timeArr[1], timeArr[2]);
                        // colorData.colornode.hour.color = cc.color("#3EA305");
                        // colorData.colornode.minute.color = cc.color("#3EA305");
                        // colorData.colornode.second.color = cc.color("#3EA305");
                        if (XoSo) {
                            XoSo.emit("ON_UPDATE_TIME_LEFT_XO_SO_FROM_HALL_SCENE", timeStr);
                        }
                    } else {
                        this.stopActionByTag(1);
                        var colorData = _this.setTimerXoSo("..", "..", "..");
                        // colorData.colornode.hour.color = cc.color("#808080");
                        // colorData.colornode.minute.color = cc.color("#808080");
                        // colorData.colornode.second.color = cc.color("#808080");
                        if (XoSo) {
                            XoSo.emit("ON_UPDATE_TIME_LEFT_XO_SO_FROM_HALL_SCENE", "Hết giờ");
                        }
                    }
                }.bind(this)), cc.delayTime(1)));
                actionCount.setTag(1);
                this.runAction(actionCount);
            }.bind(timeNode))));
        }
    },
    onEnable: function () {
        if (!this.isLoaded) {
            this.configLobbyHallScene();
        }
    },
    configLobbyHallScene: function () {
        this.configGameBai();
        this.configMiniGame();
    },

    configGameBai: function () {
        this.hideAllGameBai();
        var showSam = (Linker.Config.issam == 1) ? true : false;

        if (showSam) {
            this.showGame("samGame");
        }

    },
    configMiniGame: function () {
        this.hideAllMiniGame();
        var showXoSo = (Linker.Config.isxoso == 1) ? true : false;
        if (showXoSo) {
            this.showGame("xosoGame");
            this.initXoSoNodePool();
            this.resetTimerXoSo();
        }
    },
    initXoSoNodePool: function () {
        this.xosoGameNodePool = new cc.NodePool();
        this.xosoGameNodePool.put(cc.instantiate(this.xosoPrefab));
    },
    hideAllMiniGame: function () {
        this.hideGame("xosoGame");
    },
    hideAllGameBai: function () {
        this.hideGame("samGame");
    },

    showGame: function (id) {
        this[id].active = true;
    },
    hideGame: function (id) {
        this[id].active = false;
    },
    start() {
        this.userData = Linker.Local.readUserData();
        Linker.isGameType = this.userData.isGameType;
        // this.checkGameType();
        this.isLoaded = false;
    },
    onButtonClick(event) {
        NewAudioManager.playClick();

        if (Linker.isPreloadingAtHall) {
            cc.Global.showMessage('Đang nhận dữ liệu từ Server!');
            return;
        }
        switch (event.target.name) {
            case "btn_sam": {
                if (Linker.isLogin) {
                    Linker.HallViewScrollToTop = true;
                    Linker.ZONE = 8;
                    // Linker.ZONE = 84;
                    if (Linker.LoadedFromHallScene.loadedBiDa && this.lobbyContaier.getChildByName("lobbyContainerPrefab")) {
                        this.lobbyContaier.getChildByName("lobbyContainerPrefab").active = true;
                    } else {
                        var that = this;
                        this.lobbyContaier.removeAllChildren();
                        Linker.LoadedFromHallScene.loadedBiDa = true;
                        // Linker.isPreloadingAtHall = false;
                        NodePoolManager.MiniGame.putNodePool();
                        NodePoolManager.TopHu.putNodePool();
                        that.insLobbyPrefab(that);
                        // cc.director.preloadScene('BiDaScene', function () {}, 
                        //     function () {

                        //     });
                    }
                } else {
                    this.showDialogRegisterLogin();
                }
                break;
            }

            case "btn_event_home": {
                var data = event.target.data
                if (data) {
                    if (data.type == 0) {
                        cc.sys.openURL(data.url);
                    } else {

                    }
                }

                break;
            }

            case "btn_taixiu": {
                if (Linker.isLogin) {
                    if (!Linker.isOpenTaiXiu) {
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
                } else {
                    this.showDialogRegisterLogin();
                }
                //Linker.MinigamePopup.hide();
                break;
            }
            case "btn_larva": {
                if (Linker.isLogin) {
                    Linker.HallViewScrollToTop = true;
                    if (!Linker.isOpenLarva) {
                        Linker.isOpenLarva = true;
                        Linker.MiniGame.larvaMini.active = true;
                        Linker.MiniGame.larvaMini.zIndex = cc.macro.MAX_ZINDEX - 1;
                        Linker.MiniGame.larvaMini.position = cc.v2(0, 0);
                        Linker.MiniGame.larvaMini.opacity = 255;
                    } else {
                        if (Linker.MiniGame.larvaMini && Linker.MiniGame.larvaMini.position != cc.v2(0, 0)) {
                            Linker.isOpenLarva = true;
                            Linker.MiniGame.larvaMini.active = true;
                            Linker.MiniGame.larvaMini.zIndex = cc.macro.MAX_ZINDEX - 1;
                            Linker.MiniGame.larvaMini.runAction(cc.moveTo(0.3, cc.v2(0, 0)));
                            Linker.MiniGame.larvaMini.opacity = 255;
                        }
                    }
                } else {
                    this.showDialogRegisterLogin();
                }
                break;
            }
            case "btn_minislot": {
                if (Linker.isLogin) {
                    Linker.HallViewScrollToTop = true;
                    if (Linker.MiniGame) {
                        if (!Linker.isOpenMiniSlot) {
                            Linker.isOpenMiniSlot = true;
                            Linker.MiniGame.slotMini.active = true;
                            Linker.MiniGame.slotMini.zIndex = cc.macro.MAX_ZINDEX - 1;
                            Linker.MiniGame.slotMini.position = cc.v2(0, 0);
                            Linker.MiniGame.slotMini.opacity = 255;
                        } else {
                            if (Linker.MiniGame.slotMini && Linker.MiniGame.slotMini.position != cc.v2(0, 0)) {
                                Linker.isOpenMiniSlot = true;
                                Linker.MiniGame.slotMini.active = true;
                                Linker.MiniGame.slotMini.zIndex = cc.macro.MAX_ZINDEX - 1;
                                Linker.MiniGame.slotMini.runAction(cc.moveTo(0.3, cc.v2(0, 0)));
                                Linker.MiniGame.slotMini.opacity = 255;
                            }
                        }
                    }

                } else {
                    this.showDialogRegisterLogin();
                }
                break;
            }

            case "btn_minipoker": {
                if (Linker.isLogin) {
                    Linker.HallViewScrollToTop = true;
                    if (!Linker.isOpenMinipoker) {
                        Linker.isOpenMinipoker = true;
                        Linker.MiniGame.minipoker.active = true;
                        Linker.MiniGame.minipoker.zIndex = cc.macro.MAX_ZINDEX - 1;
                        Linker.MiniGame.minipoker.position = cc.v2(0, 0);
                        Linker.MiniGame.minipoker.opacity = 255;
                    } else {
                        if (Linker.MiniGame.minipoker && Linker.MiniGame.minipoker.position != cc.v2(0, 0)) {
                            Linker.isOpenMinipoker = true;
                            Linker.MiniGame.minipoker.active = true;
                            Linker.MiniGame.minipoker.zIndex = cc.macro.MAX_ZINDEX - 1;
                            Linker.MiniGame.minipoker.runAction(cc.moveTo(0.3, cc.v2(0, 0)));
                            Linker.MiniGame.minipoker.opacity = 255;
                        }
                    }
                } else {
                    this.showDialogRegisterLogin();
                }
                break;
            }

            case "btn_xocdia": {
                if (Linker.isLogin) {
                    var xdmini = cc.instantiate(this.xocdiaMiniPrefab);
                    xdmini.zIndex = cc.macro.MAX_ZINDEX - 2;
                    cc.find("Canvas").addChild(xdmini);
                    this.node.active = false;
                    var hallGames = cc.find("Canvas/Hall");
                    if(hallGames){
                        hallGames.active = false;
                    }
                } else {
                    Linker.LoginView.showRegister();
                }
                break;
            }
            case "btn_xoso": {
                if (Linker.isLogin) {
                    if (!Linker.XoSoObj || (Linker.XoSoObj && !Linker.XoSoObj.isValid)) {
                        //turn on loading
                        var loading = event.target.getChildByName("xosoLoading");
                        if(loading){
                            loading.on("OFF_LOADING_NOW", function () {
                                this.active = false;
                            }.bind(loading));
                            loading.active = true;
                            
                        }
                        Linker.XoSoObj = null;
                        if (this.xosoGameNodePool.size() > 0) {
                            Linker.XoSoObj = this.xosoGameNodePool.get();
                        } else {
                            Linker.XoSoObj = cc.instantiate(this.xosoPrefab);
                        }
                        
                        Linker.XoSoObj.loading = loading;
                        cc.find("Canvas").addChild(Linker.XoSoObj);
                        this.node.active = false;
                        var hallGames = cc.find("Canvas/Hall");
                        if (hallGames) {
                            hallGames.active = false;
                        }
                        Linker.XoSoObj.zIndex = cc.macro.MAX_ZINDEX - 1;
                    } else if (!Linker.XoSoObj.active) {
                        var hallGames = cc.find("Canvas/Hall");
                        if (hallGames) {
                            hallGames.active = false;
                        }
                        Linker.XoSoObj.active = true;
                    }
                } else {
                    this.showDialogRegisterLogin();
                }
                break;
            }
            case "btn_vqmm": {
                // if (Linker.isLogin) {
                //     if (!Linker.MiniGame.vqmm.active) {
                //         Linker.MiniGame.vqmm.getComponent('MovableObject').turnOn();
                //         Linker.MiniGame.vqmm.active = true;
                //         Linker.MiniGame.vqmm.zIndex = cc.macro.MAX_ZINDEX - 1;
                //         Linker.MiniGame.vqmm.position = cc.v2(0, 0);
                //     }
                //     break;
                // } else {
                //     // cc.Global.showMessage("Vui lòng đăng nhập");
                //     Linker.LoginView.showRegister();
                // }
                if (Linker.isLogin) {
                    Linker.HallViewScrollToTop = true;
                    // Linker.ZONE = 8;
                    Linker.ZONE = 84;
                    if (Linker.LoadedFromHallScene.loadedBiDa && this.lobbyContaier.getChildByName("lobbyContainerPrefab")) {
                        this.lobbyContaier.getChildByName("lobbyContainerPrefab").active = true;
                    } else {
                        var that = this;
                        this.lobbyContaier.removeAllChildren();
                        Linker.LoadedFromHallScene.loadedBiDa = true;
                        // Linker.isPreloadingAtHall = false;
                        NodePoolManager.MiniGame.putNodePool();
                        NodePoolManager.TopHu.putNodePool();
                        that.insLobbyPrefab(that);
                    }
                } else {
                    this.showDialogRegisterLogin();
                }
                break;
            }

            case 'switch': {
                this.updateFrameSwitch();
                break;
            }
            //below for top hall
            case "btn_quaylai": {
                G.alert("Bạn có chắc chắn muốn đăng xuất？", G.AT.OK_CANCEL, () => {
                    cc.log("thoat");
                    Linker.Socket.close();
                    if (Linker.isFb) {
                        Linker.MySdk.logoutFb();
                        Linker.isFb = false;
                    }

                }, () => {
                    cc.log("choi tiep");

                });
                break;
            }
            case 'btn_gamebai': {
                Linker.isGameType = 0;
                // this.checkGameType();
                break;
            }
            case 'btn_slot': {
                Linker.isGameType = 1;
                // this.checkGameType();
                break;
            }
            case 'btn_minigame': {
                Linker.isGameType = 2;
                // this.checkGameType();
                break;
            }
            case 'btn_all': {
                Linker.isGameType = 3;
                // this.checkGameType();
                break;
            }

        }
    },
    showDialogRegisterLogin: function () {
        // cc.Global.showMessage("Vui lòng đăng nhập");
        this.catchLoginError(function (err, data) {
            Linker.LoginView.showRegister();
        });
    },
    checkNoHuEvent: function () {
        return (Linker.Config.ISBAINOHU == 1) ? true : false;
    },
    enableNoHuLabel: function () {

    },
    disableNoHuLabel: function () {

    },
    updateFrameSwitch: function () {
        if (Linker.isGameSlotHall) {
            Linker.isGameSlotHall = false;
            this.gameContainer.scrollToTop(0);
            this.switchGame.getComponent(cc.Sprite).spriteFrame = this.buttonGameBaiFrame;
        } else {
            Linker.isGameSlotHall = true;
            this.gameContainer.scrollToBottom(0);
            this.switchGame.getComponent(cc.Sprite).spriteFrame = this.buttonGameSlotFrame;
        }
    },
    checkGameType: function () {
        var check = Linker.isGameType;
        var listBtn = this.listBtn;
        var listContent = this.listContent;
        // check active content
        if (check !== 3) {
            for (let i = 0; i < listContent.length; i++) {
                if (i == check) {
                    // listContent[i].active = true;
                    this.userData.isGameType = i;
                } else {
                    // listContent[i].active = false;
                }
            }
        } else {
            listContent[0].active = listContent[1].active = true;
            this.userData.isGameType = 3;
        }
        Linker.Local.saveUserData(this.userData);
        // check active btn
        for (let i = 0; i < listBtn.length; i++) {
            if (i == check) {
                listBtn[i].getChildByName("on").active = true;
                listBtn[i].getChildByName("off").active = false;
            } else {
                listBtn[i].getChildByName("on").active = false;
                listBtn[i].getChildByName("off").active = true;
            }
        }
    },
    catchLoginError: function (cb) {
        if (Linker && Linker.isLogin == false) {
            //remove all listener relative game process
            var _this = this;
            if (Linker.Event) {
                if (SocketConstant.hasOwnProperty("GAME")) {
                    for (var gamekey in SocketConstant.GAME) {
                        if (SocketConstant.GAME.hasOwnProperty(gamekey)) {
                            for (var game in SocketConstant.GAME[gamekey]) {
                                if (SocketConstant.GAME[gamekey].hasOwnProperty(game)) {
                                    var eventCode = parseInt(SocketConstant.GAME[gamekey][game]);
                                    var en = !(isNaN(eventCode));
                                    if (en) {
                                        var targetListening = _this.checkOwnListener(eventCode);
                                        //nếu có bất kỳ thằng nào đang lắng nghe xóa hết vì lỗi đăng nhập false nhưng lại trong game.
                                        if (targetListening.length > 0) {
                                            for (let k = 0; k < targetListening.length; k++) {
                                                Linker.Event.removeEventListener(eventCode.toString(), targetListening[k].listener, targetListening[k].scope);
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            };

            Linker.TopHuController = null;
            var s = cc.director.getScene();
            var tophu = cc.find("Canvas/TopHu");
            if (tophu) {
                tophu.removeFromParent(true);
                Linker.TopHuController = null;
            }
            var mini = s.getChildByName("Canvas").getChildByName("MiniGame");
            if (mini) {
                mini.removeFromParent(true);
                Linker.MiniGame = null;
            }
            Linker.GameManager.offSlotGame();

            if (Linker.LoginController && Linker.LoginController.isValid) {
                Linker.LoginController.node.getComponent("LoginManager").showLayer();
                if (cb) {
                    cb(null, true);
                }

            } else {
                SceneManager.loadScene('HallScene', function () {
                    Linker.Socket.close();
                    Linker.isLogin = false;
                    if (Linker.isFb) {
                        Linker.MySdk.logoutFb();
                        Linker.isFb = false;
                    }
                    Linker.LoginController.node.getComponent("LoginManager").showLayer();
                    Linker.TaiXiuController = null;
                    Linker.HallView = null;
                    Linker.TaiXiuView = null;
                    Linker.MiniGame = null;
                    Linker.TopHuController = null;
                    if (cb) {
                        cb(null, true);
                    }
                });
            }
        }

    },
    checkOwnListener: function (eventCode) {
        //check xem thằng nào đang nghe event này mục đích để xóa, không nó cứ nghe mãi thôi =)
        var targets = [];
        if (Linker.Event.hasOwnProperty("eventListeners")) {
            for (let key in Linker.Event.eventListeners) {
                if (!isNaN(parseInt(key))) {
                    if (parseInt(key) == eventCode) {
                        for (let j = 0; j < Linker.Event.eventListeners[eventCode].length; j++) {
                            targets.push(Linker.Event.eventListeners[eventCode][j]);
                        }
                    }
                }
            }
        }
        return targets;
    },

    insLobbyPrefab (that) {
        var lobbyPrefab = cc.instantiate(that.lobbyPrefab);
        that.lobbyContaier.addChild(lobbyPrefab);
    },

    insBiDaGamePrefab () {
        if (this.biDaGameContainer.getChildByName("BiDaGame")) {
            this.biDaGameContainer.getChildByName("BiDaGame").active = true;
        } else {

            var biDaGamePrefab = cc.instantiate(this.biDaGamePrefab);
            this.biDaGameContainer.addChild(biDaGamePrefab);
        }
        this.setActiveLoginHall(false);
    },

    insBiDaGame1vs4Prefab () {
        if (this.biDaGame1vs4Container.getChildByName("BiDaGame1vs4")) {
            this.biDaGame1vs4Container.getChildByName("BiDaGame1vs4").active = true;
        } else {
            var biDaGame1vs4Prefab = cc.instantiate(this.biDaGame1vs4Prefab);
            this.biDaGame1vs4Container.addChild(biDaGame1vs4Prefab);
        }
        this.setActiveLoginHall(false);
    },

    setActiveLoginHall (value) {
        this.centerGameContainer.active = value;
        this.lobbyContaier.active = value;
        this.hallView.active = value;
    }
    // update (dt) {},
});
