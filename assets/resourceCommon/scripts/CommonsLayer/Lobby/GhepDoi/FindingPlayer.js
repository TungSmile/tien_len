var Linker = require('Linker');
var Utils = require('Utils');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        isRollAvatar: false,
        normalAvatarFindingNode: cc.Node,
        randomNode: cc.Node,
        isAutoRun: true
    },
    addReplayAvatarByFrame: function (spriteFrame) {
        if (this.randomNode) {
            this.randomNode.stopAllActions();
            this.randomNode.position = cc.v2(0, 0);
            this.randomNode.removeAllChildren(true);
            if (spriteFrame) {
                var avatar = new cc.Node();
                avatar.zIndex = cc.macro.MAX_ZINDEX;
                if (spriteFrame) {
                    avatar.name = spriteFrame.name;
                    var size = spriteFrame.getOriginalSize();
                    avatar.setContentSize(size);
                    var avatarComponent = avatar.addComponent(cc.Sprite);
                    avatarComponent.spriteFrame = spriteFrame;
                    this.randomNode.addChild(avatar);
                }
            }
        }
    },
    resetAllChild: function () {
        this.randomNode.stopAllActions();
        this.randomNode.removeAllChildren(true);
        this.randomNode.position = cc.v2(0, 0);
        var spriteFrames = this.avatarSpriteSheet.getSpriteFrames();
        if (spriteFrames && Array.isArray(spriteFrames)) {
            for (var i = 0; i < spriteFrames.length; i++) {
                var avatar = new cc.Node();
                avatar.zIndex = (i * 5);
                var spriteFrame = spriteFrames[i];
                if (spriteFrame) {
                    avatar.name = spriteFrame.name;
                    var size = spriteFrame.getOriginalSize();
                    avatar.setContentSize(size);
                    var avatarComponent = avatar.addComponent(cc.Sprite);
                    avatarComponent.spriteFrame = spriteFrame;
                    this.randomNode.addChild(avatar);
                }
            }
        }
    },
    runFindingAnimation: function () {
        if (this.randomNode && this.avatarSpriteSheet) {
            this.node.active = true;
            this.resetAllChild();
            if (this.randomNode.children.length > 0) {
                var layout = this.randomNode.getComponent(cc.Layout);
                if (layout) {
                    this.randomNode.stopAllActions();
                    this.randomNode.position = cc.v2(0, 0);
                    layout.updateLayout();
                    var offsetY = layout.spacingY;
                    var height = -this.randomNode.height - (offsetY * 0.5);
                    var seq = cc.sequence(
                        cc.moveBy(1.5, cc.v2(0, height)),
                        cc.callFunc(function () {
                            this.randomNode.position = cc.v2(0, 0);
                        }.bind(this)));
                    this.randomNode.runAction(cc.repeatForever(seq));
                }

                //test
                // setTimeout(function () {
                //     this.stopFindingAnimation();
                // }.bind(this), 3000)
            }
        }
    },
    stopFindingAnimation: function () {
        if (this.randomNode && this.randomNode.children.length > 0) {
            this.node.active = false;
            var layout = this.randomNode.getComponent(cc.Layout);
            if (layout) {
                this.randomNode.stopAllActions();
                var stopRandom = Utils.Malicious.randomMinMax(0, this.randomNode.children.length - 1, true);
                // cc.error("index: " + stopRandom);
                var avatar = this.randomNode.children[stopRandom];
                if (avatar) {
                    // cc.error("zIndex: " + avatar.zIndex);
                    var centerNode = this.randomNode.parent;
                    var centerWorldPosition = centerNode.parent.convertToWorldSpaceAR(centerNode.position);
                    var avatarWorldPosition = avatar.parent.convertToWorldSpaceAR(avatar.position);
                    var gapX = avatarWorldPosition.x - centerWorldPosition.x;
                    var gapY = avatarWorldPosition.y - centerWorldPosition.y;
                    this.randomNode.runAction(cc.moveBy(0.1, cc.v2(0, -gapY + avatar.height * 0.5)));
                    // this.node.active = false;
                }
            }

        }
    },
    onStopFindingPlayer: function (message) {
        this.stopFindingAnimation();
    },
    showRunningAvatar: function () {
        if (this.normalAvatarFindingNode) {
            if (this.isRollAvatar) {
                this.normalAvatarFindingNode.active = false;
                this.node.active = true;
            } else {
                this.normalAvatarFindingNode.active = true;
                this.node.active = false;
            };
        }
    },
    onLoad() {
        cc.Canvas.instance.node.on("yeu-cau-tao-ban-choi-ghep-doi", this.onStopFindingPlayer, this);
        this.showRunningAvatar();
        cc.loader.loadRes("avatar/avatar",
            cc.SpriteAtlas,
            function (err, spriteAtlas) {
                if (!err) {
                    this.avatarSpriteSheet = spriteAtlas;
                    this.isFinishLoadAllAvatar = true;
                    if (this.isAutoRun) {
                        this.runFindingAnimation();
                    }
                } else {
                    this.avatarSpriteSheet = null;
                }
            }.bind(this))
    },
    start() {

    }
    // update (dt) {},
});