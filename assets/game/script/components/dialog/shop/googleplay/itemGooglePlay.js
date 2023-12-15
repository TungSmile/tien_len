var Constant = require("Constant");
var Linker = require("Linker");
var BiDaConstant = require('BiDaConstant');
var Global = require("Global");
var Utils = require("Utils");
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        iconSprite: cc.Sprite,
        costLabel: cc.Label,
        moneyLabel: cc.Label,
        firstLabel: cc.Label,
        moneyBtnLabel: cc.Label,
        goldFrame: cc.SpriteFrame,
        rubyFrame: cc.SpriteFrame,
        iconsAtlas: cc.SpriteAtlas
    },

    // onLoad () {},

    start () {
    },

    setType (type, value, index) {
        var frame = this.iconsAtlas.getSpriteFrame((index+1)+"");
        if (!frame) {
            frame = this.iconsAtlas.getSpriteFrame("1");
        }
        if (type == Constant.GOOGLE_PLAY.GOLD) {
            this.iconSprite.spriteFrame = frame;
            this.moneyLabel.node.color = cc.Color.YELLOW;
            this.setMoney(type, value);
            this.costLabel.node.active = true;
            this.firstLabel.node.active = true;
        } else if (type == Constant.GOOGLE_PLAY.RUBY) {
            this.iconSprite.spriteFrame = this.rubyFrame;
            this.moneyLabel.node.color = cc.Color.GREEN;
            this.setMoney(type, value);
            this.costLabel.node.active = false;
            this.firstLabel.node.active = false;
        }
    },

    setMoney (type, value) {
        this.idItem = value;
        this.value = (Linker.gameLanguage == BiDaConstant.LANGUAGE.VIETNAMESE) ? value * 22000 : value;
        var valueText = (Linker.gameLanguage == BiDaConstant.LANGUAGE.VIETNAMESE) ? Utils.Number.format(this.value) + " đ" : this.value + " $";
        this.moneyBtnLabel.string = valueText;
        var chargeMoney;
        var ratio;
        if (type == Constant.GOOGLE_PLAY.GOLD) {
            ratio = JSON.parse(Global.configPurchase.CASHGOLD);
            chargeMoney =  this.value * Number(ratio["1"]);
            chargeMoney = (Linker.gameLanguage == BiDaConstant.LANGUAGE.VIETNAMESE) ? chargeMoney : chargeMoney * 22000;
            this.costLabel.string = Utils.Number.format(chargeMoney);
            var dealMoney = chargeMoney * 2; // khuyen mai 100%
            this.moneyLabel.string = Utils.Number.format(dealMoney);
            this.firstLabel.string = i18n.t("googleplay_first_charge");
        } else if (type == Constant.GOOGLE_PLAY.RUBY) {
            ratio = JSON.parse(Global.configPurchase.CASHRUBY);
            chargeMoney = this.value * Number(ratio["1"]);
            chargeMoney = (Linker.gameLanguage == BiDaConstant.LANGUAGE.VIETNAMESE) ? chargeMoney : chargeMoney * 22000;
            this.moneyLabel.string = Utils.Number.format(chargeMoney);
        }
    },

    onBtnClick () {
        var customEvent = new cc.Event.EventCustom("EVENT_SHOW_POPUP_CHARGE", true);
        customEvent.idItem = this.idItem;
        customEvent.realMoney = this.value;
        customEvent.itemJs = this;
        this.node.dispatchEvent(customEvent);
    }

    // update (dt) {},
});
