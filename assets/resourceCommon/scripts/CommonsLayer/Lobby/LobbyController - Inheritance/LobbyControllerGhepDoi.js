import {
    LobbyController
} from "./../LobbyController";
var LobbySend = require('LobbySend');
var Linker = require('Linker');
var Constant = require('Constant');
var i18n = require('i18n');

cc.Class({
    extends: LobbyController,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // update (dt) {},

    addCustomEvent: function () {
        this._super();
        cc.Canvas.instance.node.on("request-match-making", this.onRequestMatchMaking, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.YEU_CAU_HUY_NODE_GHEP_DOI, this.onDestroyGhepDoi, this);
    },

    addEventListener() {
        this._super();
        Linker.Event.addEventListener(1108, this.OnStartGame, this);
    },

    removeEventListener() {
        this._super();
        Linker.Event.removeEventListener(1108, this.OnStartGame, this);
    },
    onDestroy(){
        this.removeEventListener();
    },
    onRequestMatchMaking(message) {
        if (this && cc.isValid(this)) {
            if (message) {
                var lobbyViewScript = this.getLobbyViewComponent();
                if (lobbyViewScript) {
                    lobbyViewScript.showMatchMaking(true, message);
                }
                cc.error("Yêu cầu ghép đôi...", message);
                var data = LobbySend.requestGhepDoi(message.userId, message.zoneID, message.money);
                Linker.Socket.send(data);
            }
        }

    },

    onGhepDoiResponse(message) {
        if (this && cc.isValid(this)) {
            if (message.status == 1) {
                if (Number(message.content) == 1) { // 1 = dang tim || 0 = khong thay || -1 = dang tim, khong tim nua!
                    cc.Global.showMessage(i18n.t("Đang tìm đối thủ, vui lòng chờ..."));
                } else if (Number(message.content) == 0) {
                    // this.onFailGhepDoi(message);
                } else if (Number(message.content) == -1) {
                    cc.Global.showMessage(i18n.t("Đang tìm đối thủ, vui lòng chờ trong giây lát..."));
                } else if (Number(message.content) == -2) { // Không hủy đc

                } else if (Number(message.content) == 2) { // Đang hủy, vui lòng chờ

                } else if (Number(message.content) == 3) { // Hủy thành công
                    cc.Global.showMessage(i18n.t("cancle_matching_success"));
                    this.closeGhepDoi();
                } else if (Number(message.content) == -3) { // Not enough level to play

                }
            } else {
                //xử lý như nào nhỉ nếu lỗi
                this.onFailGhepDoi(message);
            }
        }

    },
    onFailGhepDoi: function (message) {
        var lobbyViewScript = this.getLobbyViewComponent();
        if (lobbyViewScript) {
            var ghepDoi = lobbyViewScript.commonContainerTopBottom.getChildByName("GhepDoi");
            if (ghepDoi) {
                cc.Global.showMessage(i18n.t("Không tìm thấy người chơi phù hợp!"));
                // var scrollCard = Linker.ScrollCard;
                // if (scrollCard) {
                //     scrollCard.block = false;
                // }
            }
        }
    },
    closeGhepDoi: function () {
        var lobbyViewScript = this.getLobbyViewComponent();
        if (lobbyViewScript) {
            var ghepDoi = lobbyViewScript.commonContainerTopBottom.getChildByName("GhepDoi");
            if (ghepDoi && cc.isValid(ghepDoi)) {
                ghepDoi.removeFromParent(true);
            }
            // var scrollCard = Linker.ScrollCard;
            // if (scrollCard) {
            //     scrollCard.block = false;
            // }
        }
    },
    OnCreateTableResponse(message) {
        if (this && cc.isValid(this)) {
            if (message.status == 1) {
                cc.Canvas.instance.node.emit("yeu-cau-tao-ban-choi-ghep-doi", message);
                Linker.save_1100_message = message;
                var lobbyViewScript = this.getLobbyViewComponent();
                if (lobbyViewScript) {
                    lobbyViewScript.ghepDoiSuccess();
                }
            } else {
                cc.Global.showMessage(i18n.t("error_please_try_again"));
                // var scrollCard = Linker.ScrollCard;
                // if (scrollCard) {
                //     scrollCard.block = false;
                // }
            }

        }

    },
    OnJoinTableResponse(message) {
        if (this && cc.isValid(this)) {
            if (message.status == 1) {
                cc.Canvas.instance.node.emit("yeu-cau-tao-ban-choi-ghep-doi", message);
                Linker.save_1105_message = message;
                var ghepDoi = this.lobbyView.getChildByName("CommonsLobbyHomeTopBot").getChildByName("GhepDoi");
                if (ghepDoi) {
                    ghepDoi.children[0].getComponent("MatchItem").setInfoOtherPlayer(message.listPlayer);
                }
                var lobbyViewScript = this.getLobbyViewComponent();
                if (lobbyViewScript) {
                    lobbyViewScript.ghepDoiSuccess();
                }
            } else {
                cc.Global.showMessage(i18n.t("error_please_try_again"));
                // var scrollCard = Linker.ScrollCard;
                // if (scrollCard) {
                //     scrollCard.block = false;
                // }
            }
        }

    },
    OnPlayerJoinResponse(message) {
        if (this && cc.isValid(this)) {
            if (message.status == 1) {
                Linker.save_1106_message = message;
                var ghepDoi = this.lobbyView.getChildByName("CommonsLobbyHomeTopBot").getChildByName("GhepDoi");
                if (ghepDoi) {
                    ghepDoi.children[0].getComponent("MatchItem").setInfoOtherPlayer(message.player);
                }
            } else {
                cc.Global.showMessage(i18n.t("error_please_try_again"));
                // var scrollCard = Linker.ScrollCard;
                // if (scrollCard) {
                //     scrollCard.block = false;
                // }
            }
        }

    },

    OnStartGame(message) {
        if (this && cc.isValid(this)) {
            if (message.status == 1) {
                Linker.save_1108_message = message;
            } else {
                cc.Global.showMessage(i18n.t("start_match_fail"));
                // var scrollCard = Linker.ScrollCard;
                // if (scrollCard) {
                //     scrollCard.block = false;
                // }
            }
        }
    },

    //Constant.GAME_LOBBY_EVENT.LOBBY_YEU_CAU_TAO_BAN_CHOI


    onDestroyGhepDoi: function (event) {
        var lobbyViewNode = this.getLobbyViewComponent().node;
        var ghepDoi = cc.find("CommonsLobbyHomeTopBot/GhepDoi", lobbyViewNode);
        if (ghepDoi) {
            ghepDoi.destroy(true);
        }
    }
});