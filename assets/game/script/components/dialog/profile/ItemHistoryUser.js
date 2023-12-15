var Linker = require('Linker');
var Global = require("Global");
var i18n = require('i18n');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        //textId: cc.Label,
        textThoiGian: cc.Label,
        textNoiDung: cc.Label,
        textPhatSinh: cc.Label,
        textHienTai: cc.Label,
        textBet: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    init() {
        var data = this.node.data;
        if (data) {
            //this.textId.string = data.pos;
            var gameplaystr = "";
            var string = "";
            if ((data.logTypeId == 8 || data.logTypeId == 86 || data.logTypeId == 84 || data.logTypeId == 45 || data.logTypeId == 48 || data.logTypeId == 46 || data.logTypeId == 47) && Utils.Malicious.isJsonString(data.description)) {
                var stringNoidung = JSON.parse(data.description);
                if (data.logTypeId == 45 || data.logTypeId == 48 || data.logTypeId == 46 || data.logTypeId == 47) {
                    var text = i18n.t("popup_rank_player") + ": " + stringNoidung.users + "\n" +
                    i18n.t("title_win_money") + ": " + stringNoidung.winMoney + "\n";

                    if (stringNoidung.n > 0) {
                        text += i18n.t("title_additonal_reward") + ": " + stringNoidung.n;
                    }
                } else {
                    var text = i18n.t("popup_rank_player") + ": " + stringNoidung.us + "\n" +
                        i18n.t("title_ball_target") + ": " + stringNoidung.c + "\n" +
                        i18n.t("title_error_label") + ": " + stringNoidung.s + "\n" +
                        i18n.t("title_player_win") + ": " + stringNoidung.w + "\n" +
                        i18n.t("title_win_money") + ": " + stringNoidung.wm + "\n";
                    if (stringNoidung.n > 0) {
                        text += i18n.t("title_additonal_reward") + ": " + stringNoidung.n;
                    }
                }



                string = text;
                this.textNoiDung.description = text;
            } else {
                string = data.description;
                this.textNoiDung.description = data.description;
            }
            if (string.length >= 45) string = string.substring(0, 20) + "...";

            this.textNoiDung.string = gameplaystr + string;
            this.textThoiGian.string = data.time;
            this.textPhatSinh.string = data.money;
            this.textHienTai.string = data.balanceAfter;
            this.textBet.string = data.bet;


            if (data.type == 1) {
                this.textPhatSinh.node.color = cc.Global.blackHole;
                this.textHienTai.node.color = cc.Global.blackHole;
            } else {
                this.textPhatSinh.node.color = cc.Global.blackHole;
                this.textHienTai.node.color = cc.Global.blackHole;
            }
        }
    },
    clickEvent(event) {
        var noidung = event.target.getChildByName("item").getChildByName("noidung").getChildByName("text").getComponent(cc.Label).description;
        var thoigian = event.target.getChildByName("item").getChildByName("thoigian").getChildByName("text").getComponent(cc.Label).string;
        var text = noidung + "\n" + i18n.t("title_time") + thoigian;

        if (cc.Global.alertPrefab && cc.isValid(cc.Global.alertPrefab)) {
            var node = cc.instantiate(cc.Global.alertPrefab);
            cc.find('Canvas').addChild(node, cc.macro.MAX_ZINDEX)
            var nodeJs = node.getComponent("Alert");
            if (nodeJs) {
                var msg = text;
                var type = G.AT.OK;
                var okCallback = function () {
                    node.destroy();
                };
                nodeJs.setString(msg);
                nodeJs.setType(type);
                nodeJs.setCallBack(okCallback);
            }
        } else {
            cc.Global.instanceAlert();
        }
    }

    // update (dt) {},
});