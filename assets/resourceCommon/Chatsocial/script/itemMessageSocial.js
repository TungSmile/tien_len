var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        avatarSprite: cc.Sprite,
        avatarSpriteAtlas: cc.SpriteAtlas,
        contentMessageLabel: cc.Label,
        isEmoji: false,
        imojAnimation: cc.Animation
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init: function (data) {
        if (data) {
            this.data = data;
        } else {
            this.data = null;
        }
    },
    setContentMessage: function (message) {
        if (!this.isEmoji) {
            if (this.contentMessageLabel && message) {
                message = Utils.Decoder.decode(message);
                this.contentMessageLabel.string = message;
            }
        } else {
            var clip = cc.Global.findClip(message);
            if (clip) {
                if (this.imojAnimation) {
                    clip.speed = 0.2;
                    this.imojAnimation.addClip(clip);
                    this.imojAnimation.play(message);
                }
            }
        }
    },
    getUserId: function () {
        if (this.data) {
            return Number(this.data.uId);
        }
        return 0;
    },
    isMyChattingUp: function () {
        var parent = this.node.parent;
        if (parent) {
            var indexOfItem = parent.children.indexOf(this.node);
            if (indexOfItem >= 0) {
                if (indexOfItem == 0) {
                    return false;
                } else {
                    var previousIndex = indexOfItem - 1;
                    if (previousIndex >= 0 && previousIndex <= parent.children.length - 1) {
                        var chatBefore = parent.children[previousIndex];
                        if (chatBefore) {
                            var chatBeforeComponent = chatBefore.getComponent("itemMessageSocial");
                            if (chatBeforeComponent) {
                                var chatUserId = chatBeforeComponent.getUserId();
                                if (chatUserId && isNaN(chatUserId) == false && chatUserId != 0) {
                                    if (chatUserId == this.getUserId()) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return true;
    },
    start() {
        if (this.data) {
            if (this.isMyChattingUp() == true) {
                this.avatarSprite.node.active = false;
            } else {
                this.avatarSprite.node.active = true;
            }
        }
    },

    // update (dt) {},
});
