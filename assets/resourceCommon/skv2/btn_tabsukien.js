var constantSukienDialog = require("constantSukienDialog");
var i18n = require('i18n');
var NewAudioManager = require("NewAudioManager");
cc.Class({
    extends: cc.Component,

    properties: {
        parrentNode: cc.Node,
        btnLabel: cc.Label,
        btnSprite: cc.Sprite,
        onFrameThele: cc.SpriteFrame,
        onFrameLichSu: cc.SpriteFrame,
        onFrameThanhTich: cc.SpriteFrame,
        onFrameVinhDanh: cc.SpriteFrame,
        onFrameHomQua: cc.SpriteFrame
    },
    onLoad() { },

    start() {

    },
    changetoOnStatus: function () {
        this.parrentNode.opacity = constantSukienDialog.opacity.on;
        this.onStatus = true;
        this.offStatus = false;
    },
    changetoOffStatus: function () {
        this.parrentNode.opacity = constantSukienDialog.opacity.off;
        this.onStatus = false;
        this.offStatus = true;
    },
    setIDEvent: function (id) {
        this.idevent = id;
    },
    getIDEvent: function () {
        return this.idevent;
    },
    setFrameAsGameID: function () {
        var btnTxt = null;
        switch (this.idevent) {
            case constantSukienDialog.theletabID:
                this.btnSprite.spriteFrame = this.onFrameThele;
                btnTxt = i18n.t("minigame_title_guide");
                break;
            case constantSukienDialog.vinhdanhtabID:
                this.btnSprite.spriteFrame = this.onFrameVinhDanh;
                btnTxt = i18n.t("honors");
                break;
            case constantSukienDialog.lichsutabID:
                this.btnSprite.spriteFrame = this.onFrameLichSu;
                
                btnTxt = i18n.t("shop_button_history");
                break;
            case constantSukienDialog.thanhtichtabID:
                this.btnSprite.spriteFrame = this.onFrameThanhTich;
                btnTxt = i18n.t("achievements");
                break;
            case constantSukienDialog.homquatabID:
                this.btnSprite.spriteFrame = this.onFrameHomQua;
                btnTxt = i18n.t("gift_box");
                break;
            default:
                btnTxt = "Default";
                break;
        }
        this.parrentNode.width = 149;
        this.parrentNode.height = 42;
        this.btnLabel.string = btnTxt;
    },
    dispatchEvent: function () {
        NewAudioManager.playClick();
        switch (this.idevent) {
            case constantSukienDialog.theletabID:
                this.parrentNode.dispatchEvent(this.theletabDispatchEvent);
                break;
            case constantSukienDialog.vinhdanhtabID:
                this.parrentNode.dispatchEvent(this.vinhdanhtabDispatchEvent);
                break;
            case constantSukienDialog.lichsutabID:
                this.parrentNode.dispatchEvent(this.lichsutabDispatchEvent);
                break;
            case constantSukienDialog.thanhtichtabID:
                this.parrentNode.dispatchEvent(this.thanhtichtabDispatchEvent);
                break;
            case constantSukienDialog.homquatabID:
                this.parrentNode.dispatchEvent(this.homquatabDispatchEvent);
                break;
            default:
                break;

        }
    },
    configDispatchEvent: function () {
        this.theletabDispatchEvent = new cc.Event.EventCustom("EVENT_THELE_TAB", true);
        this.vinhdanhtabDispatchEvent = new cc.Event.EventCustom("EVENT_VINH_DANH_TAB", true);
        this.homquatabDispatchEvent = new cc.Event.EventCustom("EVENT_HOM_QUA_TAB", true);
        this.lichsutabDispatchEvent = new cc.Event.EventCustom("EVENT_LICH_SU_TAB", true);
        this.thanhtichtabDispatchEvent = new cc.Event.EventCustom("EVENT_THANH_TICH_TAB", true);
    },
    // update (dt) {},
});
