var Linker = require('Linker');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
var Api = require('Api');
var Utils = require('Utils');
var NodePoolManager = require('NodePoolManager');
var SceneManager = require('SceneManager');
var NativeBridge = require("NativeBridge");
var FacebookSDK = require("FacebookSDK");
var NewAudioManager = require('NewAudioManager');
var GameConstant = require('GameConstant');

cc.Class({
    extends: cc.Component,

    properties: {
        // rongVangPrefab: cc.Prefab,        
        miniGame: cc.Prefab,
        TopHuPrefab: cc.Prefab,
        loginManagerment: cc.Node,
        sharedHall: cc.Node,
        DailyGiftPrefab: cc.Prefab
        // thuyCungPrefab: cc.Prefab,
        // TayDuKyPrefab: cc.Prefab,
        // profilePrefab: cc.Prefab,
        // eventPrefab: cc.Prefab,
        // agencyPrefab: cc.Prefab,
        // guidePrefab: cc.Prefab,
        // rankPrefab: cc.Prefab,
        // shopPrefab: cc.Prefab

    },
    onLoad() {
        cc.log("HallCOntroller");
        // SceneManager.preloadScene("LobbyScene");
        Linker.HallController = this;
    },

    onEnable() {
        this.musicData = Linker.Local.readUserData();
        var self = this;
        cc.loader.load(cc.url.raw(NewAudioManager.sound.background), function () {
            if (self.musicData) {
                if (self.musicData.isMusic) {
                    NewAudioManager.audioIDBG = null;
                    cc.audioEngine.stopAll();
                    NewAudioManager.playBackground(NewAudioManager.sound.background);
                }
            }
        });
    },

    initHallScene: function () {
        var that = this;
        if (Linker.isLogin && Linker.DataSuKien) {
            Linker.DataSuKien.taixiu_event.isOpenData = null;
            Linker.DataSuKien.taixiu_event.vinhdanh.today_data = null;
            Linker.DataSuKien.taixiu_event.vinhdanh.date_data = null;
            Linker.DataSuKien.taixiu_event.homqua.today_data = null;
            Linker.DataSuKien.taixiu_event.homqua.date_data = null;
            Linker.DataSuKien.nohubai_event.mylisthu = null;
            Linker.DataSuKien.nohubai_event.commonlisthu = null;
            Linker.DataSuKien.common.all_event = [];
            Linker.HallEventData = [];
            if (Linker && Linker.XoSoObj) {
                Linker.XoSoObj.removeFromParent(true);
                Linker.XoSoObj = null;
            }   
        }
        cc.find('Canvas').on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            Linker.lastTimeManipulation = new Date().getTime();
            // cc.log('*** o hall',Linker.lastTimeManipulation);
        }, that.node);
        cc.log("vao hallController");
        Utils.Malicious.removeNodeByNameFromParent("MiniGame", null);
        Utils.Malicious.removeNodeByNameFromParent("TopHu", null);
        Utils.Malicious.removeNodeByNameFromParent("thongbaoContainer", null);
        NodePoolManager.MiniGame.getNodePool();
        NodePoolManager.TopHu.getNodePool();
        NodePoolManager.Notification.getNodePool();
        this.addSocketEventIap();
    },
    controlledOnEnable() {
        cc.log("Linker.showDialogActive:", Linker.showDialogActive);
        if (Linker.Config.isOpenActive != 1 && Linker.showDialogActive) {
            G.alert("Xác thực bảo mật SĐT qua ứng dụng Telegram nhận thưởng 3.000 Facoi", G.AT.OK_CANCEL, () => {
                if (Linker.Config.APP_API) {
                    //this.btnTeleActive.active = false;
                    var url = Linker.Config.KHTELE;
                    if (url.length > 0) {
                        cc.sys.openURL(url);
                    } else {
                        cc.log("Địa chỉ API kích hoạt trống, hoặc không hợp lệ ...");
                    }
                } else {
                    //this.btnTeleActive.active = true;
                    cc.log("Lỗi không thể load API kích hoạt tài khoản ...");
                }
            });
            Linker.showDialogActive = false;
        } else if (Linker.Config.isOpenActive) {
            if (cc.find('Canvas/ActiveDialog')) {
                cc.find("Canvas/ActiveDialog").active = false;
            }
        }
        if (Number(Linker.Config.ISLOGINDAY) >= 1) {
            var dailyGift = cc.instantiate(this.DailyGiftPrefab);
            cc.find("Canvas").addChild(dailyGift);
        }
        cc.log("Linker.joinedTaiXiu:", Linker.joinedTaiXiu);
        if (!Linker.joinedTaiXiu) {
            Linker.joinedTaiXiu = true;
            this.joinTaiXiu();
            var data = CommonSend.getListEvent();
            Linker.Socket.send(data);
        }
        if (Linker.Config.isxoso == 1) {
            var url = Linker.Config.APP_API + "apiLoDeBet";
            var obj = "";
            if(Linker && !Linker.hasOwnProperty("timeLeftXoSo")){
                this.sendXoSo(url, obj, function (error, data) {
                    var timeleft = null;
                    if (!error) {
                        timeleft = data.timeLeft;
                    } else {
                        timeleft = null;
                    }
                    var cvas = cc.find("Canvas/SharedLoginHall");
                    if (cvas) {
                        cvas.emit("ON_UPDATE_TIME_LEFT_XO_SO", { timeleft: timeleft });
                    }
                });
            }
        }
    },
    infoUser () {
        cc.find("Canvas/Hall").getComponent("HallView").onLoadHallView();
        cc.find("Canvas/Hall").getComponent("HallView").initInfoHallView(Linker.userData);

        if (Linker.userData.displayName.trim() == "") {
            this.node.getComponent("HallView").showChangeNameDialog();
        } else {
            this.joinTaiXiu();
            Linker.joinedTaiXiu = true;
        }
    },
    sendXoSo: function (url, obj, cb) {
        this.postData(url, obj, function (err, data) {
            var err = null;
            if (!err) {
                if (data.error >= 1) {
                    //xu ly khi nhan su kien thanh cong
                    if (cb) {
                        cb(null, data);
                    }
                } else {
                    if (cb) {
                        cb(true, data);
                    }
                    // cc.Global.showMessage(data.msg);
                    // cc.log(data.msg);
                }
            } else {
                cc.log("Lỗi không thể load data từ server xổ số ...\n" + url);
            }
        });
    },

    postData(url, obj, cb) {
        var self = this;
        self.postNoJson(url, obj, (data) => {
            var err = null;
            if (data) {
                cb(err, data);
            } else {
                err = "Lỗi không thể load API xổ số ...";
                cb(err, data);
            }
        });
    },

    postNoJson(url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var json = JSON.parse(xhr.responseText);
                cc.log(xhr.responseText);
                if (callback) {
                    callback(json);
                }

            } else {
                //cc.log("ERROR")
            }
        }

        // xhr.send(JSON.stringify(data));
        xhr.send(data);
        // cc.log("URL", url, "SENT", data);
    },
    addSocketEvent() {
        Linker.Event.addEventListener(14002, this.onUnSeen, this);
        Linker.Event.addEventListener(1101, this.onInvite, this);
        //:__: Show error when can't join table when accepted invitation
        Linker.Event.addEventListener(1102, this.onResponseInvite, this);
        Linker.Event.addEventListener(400002, this.onGetListMessage, this);
        Linker.Event.dispatchEvent(14002, Linker.API_EVENT);


    },
    addSocketEventIap() {
        cc.log("addSocketEventIap");
        Linker.Event.addEventListener("cashIap", this.onSendCashIap, this);

        Linker.Event.addEventListener(SocketConstant.COMMON.IAP, this.onCashIap, this);

    },
    onSendCashIap(receipt) {
        console.log("onSendCashIap:" + receipt);
        if (receipt) {
            var login = CommonSend.CashIap(receipt.receipt);
            Linker.Socket.send(login);
        }
    },
    onCashIap(message) {
        cc.log("onCashIap:");
        cc.log(message);
        if (message) {
            if (message.data) {
                cc.Global.showMessage(message.data);
            }
        }
    },
    isLogin: function () {
        return (Linker.isLogin) ? true : false;
    },
    removeEventSocket() {
        Linker.Event.removeEventListener(14002, this.onUnSeen, this);
        Linker.Event.removeEventListener(1101, this.onInvite, this);
        //:__: Show error when can't join table when accepted invitation
        Linker.Event.removeEventListener(1102, this.onResponseInvite, this);

        Linker.Event.removeEventListener("cashIap", this.onSendCashIap, this);

        Linker.Event.removeEventListener(SocketConstant.COMMON.IAP, this.onCashIap, this);

    },
    onGetListMessage(message) {
        if (message.status == 1) {
            //get mail list
            if (message.listMail && message.listMail.length > 0) {
                Linker.ListMail.ListMailData = message.listMail;
                Linker.ListMail.MessageDialog.initMessage();
                Linker.ListMail.MessageDialog.showListMessage();
            } else {
                Linker.ListMail.ListMailData = null;
            }
        }
    },

    onDestroy() {
        this.removeEventSocket();
        // var testdata = { "r": [{ "v": "12008\u0004" }] }
        // Linker.Socket.send(JSON.stringify(testdata));
    },
    joinTaiXiu() {
        var testdata = {
            "r": [{
                "v": "12004\u0004"
            }]
        }
        Linker.Socket.send(JSON.stringify(testdata));
    },
    onUnSeen(message) {
        if (this.isLogin()) {
            if (message && message.status) {
                Linker.countReadMail = Number(message.unReadMail);
                cc.find("Canvas/Hall").getComponent("HallView").initInfoMailNoti();
                /*
                Api.get(Linker.BASE_API+message.apiEvent, (data) => {
                    if (data) {
                        //cc.log(data);
                        Linker.HallView.updateEventHome(data.array);
                    }
    
                });
                */
            }
        }


    },
    onInvite(message) {
        if (this.isLogin()) {
            if (message.status == 1) {
                //khong cho hien thi khi choi xoc dia
                if (Linker.ZONE != 22) {
                    var node = cc.find("Canvas/InviteReceiverDialog");
                    node.getComponent(require("InviteReceiverDialog")).init(message.invite);
                    node.active = true;
                    node.zIndex = Utils.Malicious.getMaxZindex();
                }
            } else {
                cc.Global.showMessage(message.error);
            }
        }
    },
    //:__: Show error when can't join table when accepted invitation
    onResponseInvite(message) {
        if (this.isLogin()) {
            if (message.status == 1) {

            } else {
                cc.Global.showMessage(message.error);
            }
        }

    }
});