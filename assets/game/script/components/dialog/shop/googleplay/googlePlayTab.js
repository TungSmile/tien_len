var Constant = require("Constant");
var Linker = require("Linker");
var Global = require("Global");
var i18n = require('i18n');

cc.Class({
    extends: cc.Component,

    properties: {
        btnGold: cc.Node,
        btnRuby: cc.Node,
        contentNode: cc.Node,
        itemGooglePlayPrefab: cc.Prefab,
        btnOnFrame: cc.SpriteFrame,
        btnOffFrame: cc.SpriteFrame
    },

    // onLoad () {},

    start () {
        this.node.on("EVENT_SHOW_POPUP_CHARGE", this.onShowPopupCharge, this);
    },

    onEnable () {
        // var e = {target: this.btnGold};
        // this.onBtnClick(e);
        this.createContent(Constant.GOOGLE_PLAY.GOLD);
    },

    onBtnClick (e) {
        if (e.target == this.btnGold) {
            cc.Global.IapType = Constant.GOOGLE_PLAY.GOLD;
            this.createContent(Constant.GOOGLE_PLAY.GOLD);
            // this.btnGold.getComponent(cc.Sprite).spriteFrame = this.btnOnFrame;
            // this.btnRuby.getComponent(cc.Sprite).spriteFrame = this.btnOffFrame;
        } else if (e.target == this.btnRuby) {
            cc.Global.IapType = Constant.GOOGLE_PLAY.RUBY;
            this.createContent(Constant.GOOGLE_PLAY.RUBY);
            this.btnGold.getComponent(cc.Sprite).spriteFrame = this.btnOffFrame;
            this.btnRuby.getComponent(cc.Sprite).spriteFrame = this.btnOnFrame;
        }
    },

    createContent (type) {
        this.contentNode.removeAllChildren(true);
        if (Global.configPurchase && Global.configPurchase.CASHLIST && Global.configPurchase.CASHGOLD && Global.configPurchase.CASHRUBY) {
            var cashList = JSON.parse(Global.configPurchase.CASHLIST);
            for (var i = 0; i < cashList.length; i++) {
                var node = cc.instantiate(this.itemGooglePlayPrefab);
                var js = node.getComponent("itemGooglePlay");
                js.setType(type, Number(cashList[i]), i);
                this.contentNode.addChild(node);
            }
        }
    },

    onShowPopupCharge (e) {
        if (e) {
            if (cc.Global.alertPrefab && cc.isValid(cc.Global.alertPrefab)) {
                var _this = this;
                var node = cc.instantiate(cc.Global.alertPrefab);
                cc.find('Canvas').addChild(node, cc.macro.MAX_ZINDEX - 1)
                var nodeJs = node.getComponent("Alert");
                if (nodeJs) {
                    var msg = i18n.t("googleplay_text_charge", { n: e.realMoney });
                    var type = G.AT.OK_CANCEL;
                    var okCallback = function () {
                        node.destroy();
                        if (e.idItem && !isNaN(e.idItem) && e.idItem > 0) {
                            _this.sendIAP(e.idItem);
                        } else {
                            cc.Global.showMessage(i18n.t("Có lỗi xảy ra, vui lòng thử lại sau"));
                        }
                    };
                    var cancelCallback = function () {
                        node.destroy();
                    };
                    nodeJs.setString(msg);
                    nodeJs.setType(type);
                    nodeJs.setCallBack(okCallback, cancelCallback);
                }
            } else {
                cc.Global.instanceAlert();
            }
        }
    },

    sendIAP (id) {
        console.log("sendIAP start");
        if (cc.sys.isNative) {
            Linker.MySdk.iapAll(id);
        } else {
            cc.Global.showMessage(i18n.t("Not support device"));
        }
        // Linker.Event.dispatchEvent("cashIap", {
        //     receipt: "iap1"
        // });
    }

    // update (dt) {},
});
