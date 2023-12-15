var Linker = require("Linker");
var NewAudioManager = require('NewAudioManager');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        guideBidaText: {
            default: null,
            type: cc.TextAsset,
        },
        btnBidaGuideToggle: cc.Toggle,
        btnSoccerGuideToggle: cc.Toggle,
        btnHeadBallGuideToggle: cc.Toggle,
        btnFootBallGuideToggle: cc.Toggle,
        guideBidaJson: {
            default: null,
            type: cc.JsonAsset,
        },
        guideCardGameJson: cc.JsonAsset,
        UIContainer: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.loadSilientGuide();
    },

    start() {

    },
    //An huong dan 1vs4
    //Không biết làm sao index không bị đè chữ lên nhau nên text thêm thẻ <br> ở đầu hướng dẫn, nội dung hướng dẫn bắt đầu từ index 1 của parseGuide
    onEnable: function () {
        this.showToggleUIContainer();
        this.activeGuideContent(this.btnBidaGuideToggle, this.guideBidaJson.json.bida.vi, 8);
    },
    activeGuideContent: function (toggle, content, zoneId) {
        if (toggle) {
            if (toggle.isChecked) {
                this.addContent(content, zoneId);
            }
            toggle.check();
        }
    },
    hideToggleUIContainer: function () {
        this.UIContainer.active = false;
    },
    showToggleUIContainer: function () {
        this.UIContainer.active = true;
    },
    hideAllContent: function () {
        for (var i = 0; i < this.content.children.length; i++) {
            this.content.children[i].active = false;
        }
    },
    loadSilientGuide: function () {
        var guideArr = [{ json: this.guideBidaJson.json.bida.vi, zoneId: 8 },
        { json: this.guideCardGameJson.json.TLMN, zoneId: 5 },
        { json: this.guideCardGameJson.json.Phom, zoneId: 4 },
        { json: this.guideCardGameJson.json.MauBinh, zoneId: 14 },
        { json: this.guideCardGameJson.json.Soccer, zoneId: 45 }];
        for (var k = 0; k < guideArr.length; k++) {
            var zoneId = guideArr[k].zoneId;
            var data = guideArr[k].json;
            var nameNode = "GUIDE_" + zoneId;
            var contentNode = this.content.getChildByName(nameNode);
            if (!contentNode) {
                contentNode = new cc.Node();

                contentNode.width = 806;
                contentNode.height = 50;

                var contentNodeLayout = contentNode.addComponent(cc.Layout);
                contentNodeLayout.type = cc.Layout.Type.VERTICAL;
                contentNodeLayout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
                contentNodeLayout.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
                contentNode.name = nameNode;
                for (var i = 0; i < data.length; i++) {
                    var guideLabelNode = new cc.Node();
                    guideLabelNode.anchorX = 0;
                    var guideLabel = guideLabelNode.addComponent(cc.Label);
                    var guideLabelWidget = guideLabelNode.addComponent(cc.Widget);
                    guideLabelNode.width = 700;
                    guideLabel.node = guideLabelNode;
                    guideLabelWidget.node = guideLabelNode;

                    guideLabelWidget.isAlignLeft = true;
                    guideLabelWidget.isAlignRight = false;
                    guideLabelWidget.left = 0;
                    guideLabel.fontSize = data[i].size;
                    guideLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
                    guideLabel.cacheMode = cc.Label.CacheMode.CHAR;
                    guideLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    guideLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;

                    guideLabelNode.color = cc.color(data[i].color);
                    guideLabel.string = data[i].string;

                    contentNode.addChild(guideLabelNode);
                }
                this.content.addChild(contentNode);
            }
            contentNode.active = false;
        }
    },
    addContent: function (data, zoneId) {
        if (data) {
            if (zoneId) {
                this.hideAllContent();
                var nameNode = "GUIDE_" + zoneId;
                var contentNode = this.content.getChildByName(nameNode);
                if (!contentNode) {
                    contentNode = new cc.Node();
                    contentNode.width = 806;
                    contentNode.height = 50;
                    var contentNodeLayout = contentNode.addComponent(cc.Layout);
                    contentNodeLayout.type = cc.Layout.Type.VERTICAL;
                    contentNodeLayout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
                    contentNodeLayout.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;

                    contentNode.name = nameNode;
                    for (var i = 0; i < data.length; i++) {
                        var guideLabelNode = new cc.Node();
                        guideLabelNode.anchorX = 0;
                        var guideLabel = guideLabelNode.addComponent(cc.Label);
                        var guideLabelWidget = guideLabelNode.addComponent(cc.Widget);
                        guideLabelNode.width = 700;
                        guideLabel.node = guideLabelNode;
                        guideLabelWidget.node = guideLabelNode;

                        guideLabelWidget.isAlignLeft = true;
                        guideLabelWidget.isAlignRight = false;
                        guideLabelWidget.left = 0;
                        guideLabel.fontSize = data[i].size;
                        guideLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
                        guideLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                        guideLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
                        guideLabel.cacheMode = cc.Label.CacheMode.CHAR;
                        guideLabelNode.color = cc.color(data[i].color);
                        guideLabel.string = data[i].string;
                        contentNode.addChild(guideLabelNode);
                    }
                    this.content.addChild(contentNode);
                } else {
                    contentNode.active = true;
                }
            }
        }
    },

    onDisable: function () {
    },
    closeBtnClick() {
        NewAudioManager.playClick();
        this.node.active = false;
    },
    // update (dt) {},
    onToggleGuideClick: function (toggle, customData) {
        NewAudioManager.playClick();
        if (toggle && toggle.isChecked) {
            switch (customData) {
                case "TLMN": {
                    this.addContent(this.guideCardGameJson.json.TLMN, 5);
                    break;
                }
                case "Phom": {
                    this.addContent(this.guideCardGameJson.json.Phom, 4);
                    break;
                }
                case "MauBinh": {
                    this.addContent(this.guideCardGameJson.json.MauBinh, 14);
                    break;
                }
                case "Soccer": {
                    this.addContent(this.guideCardGameJson.json.Soccer, 45);
                    break;
                }
                case "Bida": {
                    this.addContent(this.guideBidaJson.json.bida.vi, 8);
                    break;
                }
            }
        }
    },
    showSoccerGalaxyGuide: function (event) {
        if (event) {
            switch (event.target.name) {
                case "1v1":
                    break;
                default:
                    break;
            }
        }
    },
    showBida11Guide: function (event) {
        NewAudioManager.playClick();
        this.addContent(Linker.gameLanguage == "en" ? this.guideData.bida.en : this.guideData.bida.vi, 8);
    },
    showBidaPhomGuide: function (event) {
        NewAudioManager.playClick();
        this.addContent(Linker.gameLanguage == "en" ? this.guideData.bidaPhom.en : this.guideData.bidaPhom.vi, 8);
    },
    showBida14Guide: function (event) {
        NewAudioManager.playClick();

    },
    parseGuide: function () {
        var data = this.guideBidaText.text.split("<br>");
        for (var i = 0; i < data.length; ++i) {
            data[i] = data[i].split("<p>");
        }
        return data;
    },
    onBtnCloseClick: function () {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        customEvent.toggle = this.node.getComponent(cc.Toggle);
        this.node.dispatchEvent(customEvent);
    }
});
