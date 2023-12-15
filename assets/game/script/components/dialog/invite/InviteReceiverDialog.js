var Linker = require('Linker');
var Utils = require('Utils');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
var LobbySend = require('LobbySend');
var SceneManager = require('SceneManager');
const BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var NewAudioManager = require('NewAudioManager');
var Global = require('Global');
var Constant = require('Constant');
var DataAccess = require('DataAccess');
cc.Class({
    extends: cc.Component,

    properties: {
        playerName: cc.Label,
        betMoney: cc.Label,
        dongYBtn: cc.Node,
        huyBoBtn: cc.Node,
        tuChoiMoi: cc.Toggle,
        idTable: cc.Label,
        iconMoney: cc.Sprite,
        listMoneyIcon: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.InviteReceiverDialog = this;
        // this.node.active = false;
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //self.node.active = false;
        }, this);
    },
    init(data) {
        console.log("InviteReceiverDialog1")
        this.data = null;
        if (data) {
            console.log("InviteReceiverDialog2")
            if (data.status == 1 && data.invite) {
                console.log("InviteReceiverDialog3")
                this.data = data.invite;
                // cc.log(this.data);
                // var zoneName = "";
                switch (Number(this.data.zoneID)) {
                    case 8: {
                        this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} Bida 1 vs 1`;
                        this.sceneNameLoad = "BidaGame";
                        this.bundleName = Constant.BUNDLE.BIDA.name;
                        break;
                    }
                    case 84: {
                        this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} Bida 1 vs 4`;
                        this.sceneNameLoad = "BidaGame";
                        this.bundleName = Constant.BUNDLE.BIDA.name;
                        break;
                    }
                    case 44: {
                        //football
                        this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} FootBall 1 vs 1`;
                        this.sceneNameLoad = "FootBall";
                        this.bundleName = Constant.BUNDLE.FOOT_BALL.name;
                        break;
                    }
                    case 45: {
                        //soccer
                        this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} Soccer 1 vs 1`;
                        this.bundleName = Constant.BUNDLE.SOCCER_GALAXY.name;
                        this.sceneNameLoad = "SoccerGalaxy";
                        break;
                    }
                    case 46: {
                        // headball
                        this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} HeadBall 1 vs 1`;
                        this.sceneNameLoad = "HeadBallPlay";
                        this.bundleName = Constant.BUNDLE.HEAD_BAL.name;
                        break;
                    }
                    case 86: {
                        if (Linker.gameLanguage == "en") {
                            this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} Billard Card`;
                        } else if (Linker.gameLanguage == "vi") {
                            this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} Bida Phỏm`;
                        }
                        this.sceneNameLoad = "BidaGame";
                        this.bundleName = Constant.BUNDLE.BIDA.name;
                        break;
                    }
                    case 4: {
                        this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} Phỏm`;
                        this.sceneNameLoad = "Phom";
                        this.bundleName = Constant.BUNDLE.PHOM.name;
                        break;
                    }
                    case 5: {
                        this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} TLMN`;
                        this.sceneNameLoad = "TLMN";
                        this.bundleName = Constant.BUNDLE.TLMN.name;
                        break;
                    }
                    case 47: {
                        this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} Phi Dao`;
                        this.sceneNameLoad = "PlayGameDagger";
                        this.bundleName = Constant.BUNDLE.PHI_DAO.name;
                    }
                    case 14: {
                        this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} Mậu binh`;
                        this.sceneNameLoad = "MauBinh";
                        this.bundleName = Constant.BUNDLE.MAUBINH.name;
                        break;
                    }
                    case Constant.ZONE_ID.LIENG: {
                        this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} Liêng`;
                        this.sceneNameLoad = "LIENG";
                        this.bundleName = Constant.BUNDLE.LIENG.name;
                        break;
                    }
                    case Constant.ZONE_ID.BACAY: {
                        this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} Ba Cây`;
                        this.sceneNameLoad = "BaCay";
                        this.bundleName = Constant.BUNDLE.BACAY.name;
                        break;
                    }
                    case Constant.ZONE_ID.POKER: {
                        this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} Poker`;
                        this.sceneNameLoad = "Poker";
                        this.bundleName = "Poker";
                        break;
                    }
                    case Constant.ZONE_ID.SAM: {
                        this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} Sâm`;
                        this.sceneNameLoad = "Sam";
                        this.bundleName = "Sam";
                        break;
                    }
                    case Constant.ZONE_ID.BAN_SUNG: {
                        this.idTable.string = `${i18n.t("button_title_table")} #${this.data.matchID} Công Kích Cuồng Bạo`;
                        this.sceneNameLoad = "GameSceneCKCB";
                        this.bundleName = "CongKichCuongBao";
                        break;
                    }
                }
                this.playerName.string = this.data.playerNameInvite + " " + `${i18n.t("title_invited")}`;
                this.betMoney.string = this.data.minBetCash;
                // Utils.Malicious.getCoinFrame(Linker.MoneyTypeSpriteFrame, function (err, _data) {
                //     if (!err) {
                //         Linker.MoneyTypeSpriteFrame = _data;
                //         var coinFrame = (Number(cc.Global.moneyType) == 1) ? Linker.MoneyTypeSpriteFrame.Quan : Linker.MoneyTypeSpriteFrame.Xu;
                //         if (coinFrame) {
                //             this.iconMoney.spriteFrame = coinFrame;
                //         }
                //     }
                // }.bind(this));
            }
        }
    },
    onEnable: function () {
        this.userData = Linker.Local.readUserData();
        // if (this.userData.isInvite == false) {
        //     // this.stopPropagationOnBackdrop = Utils.Node.stopPropagation(this.backdrop);
        //     this.node.active = false;
        // } else {
            this.node.stopAllActions();
            this.node.setScale(0.3);
            this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
        //}
        this.tuChoiMoi.isChecked = false;
    },
    dongYClick: function () {
        NewAudioManager.playClick();
        // if (Linker.userData.countryId != "vn" && Linker.ZONE == Constant.ZONE_ID.TLMN) {
        //     cc.Global.showMessage(i18n.t("GAME_NOT_SUPPORT_COUNTRY"));
        // } else {
            // if (!this.tuChoiMoi.isChecked) {
                Linker.AbortByReceiveInvitePlayer = true;
                cc.log("OK", this.data);
                // this.node.active = false;
                var scneName = cc.Global.getSceneName();
                // if (Linker.ZONE && scneName != "HeroesBall") {
    
                if (Linker.ZONE && scneName != "TrangChu") {
                    // if (Linker.ZONE == Number(this.data.zoneID)) {
                        //gui luon accept loi moi 
                        this.requestJoinGame();
                    // } else {
                    //     //phai load lai game va bundle
                    //     this.requestReloadBundleGame();
                    // }
                } else {
                    //không được xóa hàm này đi, load bundle khi ở ngoài trang chủ
                    this.requestReloadBundleGame();
                }
    
            // } else {
            //     Linker.AbortByReceiveInvitePlayer = false;
            //     this.userData.isInvite = false;
            //     Linker.Local.saveUserData(this.userData);
            //     this.tuChoiSend();
            // }
        // }
        this.node.active = false;
        // this.node.destroy();
        // this.node.removeFromParent(true);
    },
    requestJoinGame: function () {
        if (this.data) {
            if (this.data.matchID) {
                if (Number(this.data.minBetCash) * 6 <= Number(DataAccess.Instance.getCurrentBalance(cc.Global.bidaMoneyType))) {
                    var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_YEU_CAU_TAO_BAN_CHOI, true);
                    customEvent.tableData = { matchId: Number(this.data.matchID) };
                    customEvent.isReconnect = false;
                    customEvent.isCreate = false;
                    customEvent.isJoin = true;
                    this.node.dispatchEvent(customEvent);
                } else {
                    Linker.AbortByReceiveInvitePlayer = false;
                    cc.Global.showMessage(i18n.t("Bạn không đủ tiền để vào phòng"));
                }
            }
        }
    },
    requestAcceptInvite: function () {
        //cuoi cung moi accept
        NewAudioManager.playClick();
        if (this.data) {
            if (this.data.matchID) {
                cc.error("Accept request invite...", this.data);
                var data = CommonSend.sendAcceptInviteRequest(this.data.matchID, this.data.playerInviteId, 1);
                Linker.Socket.send(data);
            }
        }
    },
    requestReloadBundleGame: function () {
        if (this.data) {
            if (Number(this.data.minBetCash) * 6 <= Number(DataAccess.Instance.getCurrentBalance(cc.Global.bidaMoneyType))) {
                var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_LOAD_BUNDLE_VA_SCENE_NAME_ACCEPT_INVITE, true);
                customEvent.sceneNameLoad = this.sceneNameLoad;
                customEvent.bundleName = this.bundleName;
                customEvent.data = this.data;
                this.node.dispatchEvent(customEvent);
            } else {
                Linker.AbortByReceiveInvitePlayer = false;
                cc.Global.showMessage(i18n.t("Bạn không đủ tiền để vào phòng"));
            }
        }
    },
    tuChoiSend() {
        NewAudioManager.playClick();
        if (this.tuChoiMoi.isChecked) {
            this.userData.isInvite = false;
        } else {
            this.userData.isInvite = true;
        }
        Linker.Local.saveUserData(this.userData);
        // Linker.Local.saveUserData(local);

    },
    onBtnCloseClick: function () {
        // NewAudioManager.playClick();
        // var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        // customEvent.toggle = this.node.getComponent(cc.Toggle);
        // this.node.dispatchEvent(customEvent);
        this.node.active= false;
    }
});