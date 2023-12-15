var Utils = require('Utils');
var i18n = require('i18n');
var soccerConstant = require('soccerConstant');
var Linker = require('Linker');
var Constant = require('Constant');
var NewAudioManager = require('NewAudioManager');

cc.Class({
    extends: cc.Component,
    properties: {
        label: cc.Label,
        bgOn: cc.Node,
        bgOff: cc.Node,
        toggle: cc.Toggle,
        iconSprite: cc.Sprite,
        onSprite: cc.Sprite,
        listOnSpriteFrames: [cc.SpriteFrame],
        offSprite: cc.Sprite,
        listOffSpriteFrames: [cc.SpriteFrame],
        listColorLabel: [cc.Color]
    },
    init: function (data) {
        if (data) {
            var betMoney = Number(data.betMoney);
            this.betMoney = betMoney;
        }
        // this.value = 0;
    },
    getLabelNode: function () {
        return this.label.node;
    },
    onEnable: function () {
        this.setCommonSprite();
    },
    setCommonSprite: function () {
        var index = 0;
        switch (Linker.ZONE) {
            case soccerConstant.ZONE_ID.ZONE_1VS1:
                index = 0;
                break;
            default:
                break;
        }
        var data = { index: index };
        this.setIconOnByIndex(data);
        this.setIconOffByIndex(data);
    },
    nextScroll: function () {
        if (this.listBetScrollView) {
            var currentOffset = this.listBetScrollView.getScrollOffset();
            if (currentOffset) {
                // 
            }
        }
    },
    preScroll: function () {
        if (this.listBetScrollView) {
            var currentOffset = this.listBetScrollView.getScrollOffset();
            if (currentOffset) {
                // 
            }
        }
    },
    setIconOnByIndex: function (data) {
        if (data) {
            var index = data.index;
            index = parseInt(index);
            if (isNaN(index) == false) {
                if (index >= 0 && index < this.listOnSpriteFrames.length) {
                    this.onSprite.spriteFrame = this.listOnSpriteFrames[index];
                }
            }
        }
    },
    setIconOffByIndex: function (data) {
        if (data) {
            var index = data.index;
            index = parseInt(index);
            if (isNaN(index) == false) {
                if (index >= 0 && index < this.listOffSpriteFrames.length) {
                    this.offSprite.spriteFrame = this.listOffSpriteFrames[index];
                }
            }
        }
    },
    setColorMoney: function (option) {
        if (option) {
            if (this.label && this.label.node) {
                if (option.hasOwnProperty("indexSprite")) {
                    var index = parseInt(option.indexSprite);
                    if (isNaN(index) == false && index >= 0 && index < this.listColorLabel.length) {
                        this.label.node.color = this.listColorLabel[index];
                    }
                }
            }
        }
    },
    setBackgroundBetting: function (option) {
        if (option) {
            if (this.onSprite && this.offSprite) {
                if (option.hasOwnProperty("indexSprite")) {
                    var index = parseInt(option.indexSprite);
                    if (isNaN(index) == false) {
                        if (index >= 0 && index < this.listOnSpriteFrames.length) {
                            this.onSprite = this.listOnSpriteFrames[index];
                        }
                        if (index >= 0 && index < this.listOffSpriteFrames.length) {
                            this.offSprite.spriteFrame = this.listOffSpriteFrames[index];
                        }
                    }
                }
            }
        }
    },
    updateCell(option) {
        if (option.label != undefined) {
            this.node.scale = 1;
            this.label.string = Utils.Malicious.moneyWithFormat(option.label, ".");
            if (typeof (option.label) == "number") {
                this.betMoney = option.label;
            }
            if (option.label == i18n.t("Tất cả")) {
                this.value = -1;
            }
            // Utils.Malicious.setColorMoney(this.label.node);
            this.setColorMoney(option);
            this.setBackgroundBetting(option);
            // Utils.Malicious.getCoinFrame(Linker.MoneyTypeSpriteFrame, function (err, data) {
            //     if (!err) {
            //         Linker.MoneyTypeSpriteFrame = data;
            //         var coinFrame = (Number(cc.Global.moneyType) == 1) ? Linker.MoneyTypeSpriteFrame.Quan : Linker.MoneyTypeSpriteFrame.Xu;
            //         if (coinFrame) {
            //             this.iconSprite.spriteFrame = coinFrame;
            //         }
            //     }
            // }.bind(this));
        }
    },
    
    getIconSprite: function () {
        return this.iconSprite;
    },
    onToggleButtonClick: function (event) {
        if (event) {
            this.betMoney = Number(this.betMoney);
            if (isNaN(this.betMoney) == false /*&& this.betMoney >= 0*/) {
                this.toggle.check();
                NewAudioManager.playClick();
                // cc.error("event toggle request filter rooms", this.betMoney);
                var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_YEU_CAU_LOC_BAN_THEO_MENH_GIA, true);
                customEvent.betMoney = this.betMoney;
                this.node.dispatchEvent(customEvent);
            }
        }
    }
});