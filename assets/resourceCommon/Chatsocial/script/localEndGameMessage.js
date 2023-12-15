var Constant = require('Constant');
var Linker = require("Linker");
var CommonSend = require('CommonSend');
var Utils = require('Utils');
const tr = require('../../../i18n/data/tr');

cc.Class({
    extends: cc.Component,

    properties: {
        avatarAtlas: cc.SpriteAtlas,
        zoneIdLabel: cc.Label,
        avatarSprites: [cc.Sprite],
        nameLables: [cc.Label],
        bgBida: cc.SpriteFrame,
        bgBanSung: cc.SpriteFrame,
        bgSoccer: cc.SpriteFrame,
        bgPhiDao: cc.SpriteFrame,
        iconBida: cc.SpriteFrame,
        iconBanSung: cc.SpriteFrame,
        iconPhiDao: cc.SpriteFrame,
        iconSoccer: cc.SpriteFrame,
        backgroundSprite: cc.Sprite,
        iconGameSprite: cc.Sprite,
        containerWidget: cc.Widget,
        btnChallenge: cc.Node,
        btnCancel: cc.Node
    },
    init: function (data) {
        if (data) {
            this.data = data;
        } else {
            this.data = null;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    setGameIconById: function () {
        if (this.data) {
            if (this.backgroundSprite && this.iconGameSprite) {
                var zoneId = this.data.zoneId;
                zoneId = Number(zoneId);
                if (isNaN(zoneId) == false && zoneId != 0) {
                    if (this.zoneIdLabel) {
                        this.zoneIdLabel.string = zoneId;
                    }
                    switch (zoneId) {
                        case Constant.ZONE_ID.SOCCER_GALAXY_1VS1:
                            if (this.bgSoccer) {
                                this.backgroundSprite.spriteFrame = this.bgSoccer;
                            }
                            if (this.iconSoccer) {
                                this.iconGameSprite.spriteFrame = this.iconSoccer;
                            }
                            break;
                        case Constant.ZONE_ID.BIDA_1VS1:
                            if (this.bgBida) {
                                this.backgroundSprite.spriteFrame = this.bgBida;
                            }
                            if (this.iconBida) {
                                this.iconGameSprite.spriteFrame = this.iconBida;
                            }
                            break;
                        case Constant.ZONE_ID.BIDA_1VS4:
                            if (this.bgBida) {
                                this.backgroundSprite.spriteFrame = this.bgBida;
                            }
                            if (this.iconBida) {
                                this.iconGameSprite.spriteFrame = this.iconBida;
                            }
                            break;
                        case Constant.ZONE_ID.BIDA_PHOM:
                            if (this.bgBida) {
                                this.backgroundSprite.spriteFrame = this.bgBida;
                            }
                            if (this.iconBida) {
                                this.iconGameSprite.spriteFrame = this.iconBida;
                            }
                            break;
                        case Constant.ZONE_ID.BAN_SUNG:
                            if (this.bgBanSung) {
                                this.backgroundSprite.spriteFrame = this.bgBanSung;
                            }
                            if (this.iconBanSung) {
                                this.iconGameSprite.spriteFrame = this.iconBanSung;
                            }
                            break;
                        case Constant.ZONE_ID.PHI_DAO:
                            if (this.bgPhiDao) {
                                this.backgroundSprite.spriteFrame = this.bgPhiDao;
                            }
                            if (this.iconPhiDao) {
                                this.iconGameSprite.spriteFrame = this.iconPhiDao;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }

        }
    },
    alignLeft: function (isLeft) {
        if (this.containerWidget) {
            this.containerWidget.isAlignLeft = false;
            this.containerWidget.isAlignRight = false;
            this.containerWidget.left = 0;
            this.containerWidget.right = 0;
            this.containerWidget.updateAlignment();
            if (isLeft) {
                this.containerWidget.isAlignLeft = true;
                this.containerWidget.left = 0;
            } else {
                this.containerWidget.isAlignRight = true;
                this.containerWidget.right = 0;
            }
            this.containerWidget.updateAlignment();
        }
    },
    start() {
        if (this.data) {
            var userData = this.data.userData;
            if (userData && Array.isArray(userData)) {
                if (this.avatarSprites && this.nameLables && userData.length <= this.avatarSprites.length && userData.length <= this.nameLables.length) {
                    if (this.containerWidget) {
                        this.alignLeft(false);
                        for (var i = 0; i < userData.length; i++) {
                            var data = userData[i];
                            var avatarSprite = this.avatarSprites[i];
                            var userNameLabel = this.nameLables[i];
                            if (data && avatarSprite && userNameLabel) {
                                var avatarId = data.avatar;
                                var uId = Number(data.uId);
                                if (uId == Number(Linker.userData.userId) && i == 0) {
                                    this.alignLeft(true);
                                }
                                var viewName = data.viewName;
                                userNameLabel.string = viewName;
                                var frame = this.avatarAtlas.getSpriteFrame("avatar (" + avatarId + ")");
                                if (!frame) {
                                    frame = this.avatarAtlas.getSpriteFrame("avatar (1)");
                                }
                                if (frame) {
                                    avatarSprite.spriteFrame = frame;
                                }
                            }
                        }
                    }
                }
            }
            this.setGameIconById();
            this.btnChallenge.active = true;
            this.btnCancel.active = false;
        }
    },

    onBtnChallenge () {
        var userList = this.data.userData;
        var otherId = null;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].uId !== Number(Linker.userData.userId)) {
                otherId = userList[i].uId;
                break;
            }
        }
        if (otherId) {
            var bundleData = Utils.Malicious.getBundleNameAndSceneNameByZoneId(this.data.zoneId);
            if (bundleData) {
                var bundleName = bundleData.bundleName;
                this.getBundle(function (err, bundle) {
                    if (!err) {
                        this.showBtnChallenge(false);
                        var bet = (this.data.money) ? this.data.money : 500;
                        var data = CommonSend.sendChallenge(Linker.userData.userId, otherId, this.data.zoneId, bet, false, true);
                        Linker.Socket.send(data);
                    } else {
                        cc.error("Lỗi", err);
                    }
                }.bind(this), bundleName);
            }  
        }
    },

    onBtnCancel () {
        var userList = this.data.userData;
        var otherId = null;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].uId !== Number(Linker.userData.userId)) {
                otherId = userList[i].uId;
                break;
            }
        }
        if (otherId) {
            var bundleData = Utils.Malicious.getBundleNameAndSceneNameByZoneId(this.data.zoneId);
            if (bundleData) {
                var bundleName = bundleData.bundleName;
                this.getBundle(function (err, bundle) {
                    if (!err) {
                        this.showBtnChallenge(true);
                        var data = CommonSend.sendChallenge(Linker.userData.userId, otherId, this.data.zoneId, 500, true, true);
                        Linker.Socket.send(data);
                    } else {
                        cc.error("Lỗi", err);
                    }
                }.bind(this), bundleName);
            }  
        }
    },

    showBtnChallenge(isShow) {
        var childs = this.node.parent.children;
        for (var i = 0; i < childs.length; i++) {
            var js = childs[i].getComponent("localEndGameMessage");
            if (js && js.isValid) {
                if (isShow) {
                    if (this.node == childs[i]) {
                        js.btnChallenge.active = true;
                        js.btnCancel.active = false;
                    } else {
                        js.btnChallenge.active = true;
                        js.btnCancel.active = false;
                    }
                } else {
                    if (this.node == childs[i]) {
                        js.btnChallenge.active = false;
                        js.btnCancel.active = true;
                    } else {
                        js.btnChallenge.active = false;
                        js.btnCancel.active = false;
                    }
                }
            }
        }
    },

    getBundle: function (cb, bundleName) {
        if (bundleName) {
            Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                if (!err) {
                    if (cb) {
                        cb(null, gameLoaderBundle)
                    }
                } else {
                    cc.error(err);
                    if (cb) {
                        cb(err, null);
                    }
                }
            }.bind(this), bundleName);
        } else {
            if (cb) {
                cb(true, null);
            }
        }
    },

    // update (dt) {},
});
