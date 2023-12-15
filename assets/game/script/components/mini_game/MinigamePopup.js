var Utils = require('Utils');
var Linker = require('Linker');
var SocketConstant = require('SocketConstant');

cc.Class({
    extends: cc.Component,

    properties: {
        popupNode: cc.Node,
        taixiuTimeLeftLabel: cc.Label
    },

    start: function () {
        this.node.zIndex = cc.macro.MAX_ZINDEX;
        this.node.parent.zIndex = cc.macro.MAX_ZINDEX - 1;
    },

    // use this for initialization
    onLoad: function () {
        Linker.MiniGamePopUp = this;
        this.popupNode.on(cc.Node.EventType.TOUCH_END, this.hide, this);
        Linker.Event.addEventListener(SocketConstant.GAME.TAI_XIU.UPDATE_TAI_XIU, this._updateTaiXiuTimeLeft, this);
    },
    onEnable: function () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.hide, this);
        this.stopPropagationOnPopupNode = Utils.Node.stopPropagation(this.popupNode);
    },

    onDisable: function () {
        if (this.stopPropagationOnPopupNode) {
            this.stopPropagationOnPopupNode();
            this.stopPropagationOnPopupNode = null;
        }
        this.node.off(cc.Node.EventType.TOUCH_END, this.hide, this);
    },

    // called every frame, uncomment this function to activate update callback
    update: function () {
        if(Linker.TaiXiuController){
            this._updateTaiXiu();
        }
    },

    init: function (minigameQuickIcon) {
        this.minigameQuickIcon = minigameQuickIcon;
        this.minigameQuickIconSize = {
            width: minigameQuickIcon.node.width,
            height: minigameQuickIcon.node.height
        };
        this.show();
    },

    show: function () {
        //AudioManager.instance.playButtonClick();
        this._correctPositionToShow();

        var currentPosition = cc.v2(0, 0),
            animationTime = 0.2,
            afterAnimationTime = 0.15,
            animation = cc.sequence(
                cc.spawn([
                    cc.scaleTo(animationTime, 1),
                    cc.rotateBy(animationTime, -720),
                    cc.moveTo(animationTime, currentPosition),
                    cc.fadeIn(animationTime)
                ]),
                cc.spawn([
                    cc.scaleTo(afterAnimationTime, 0.8, 1.2),
                    cc.moveBy(afterAnimationTime, 0, 120),
                ]),
                cc.spawn([
                    cc.scaleTo(afterAnimationTime, 1.5, 0.6),
                    cc.moveBy(afterAnimationTime / 2, 0, -120),
                ]),
                cc.scaleTo(animationTime, 1)
            );
        this.popupNode.runAction(animation);
    },

    hide: function () {
        //AudioManager.instance.playButtonClick();
        this._correctPositionToHide();

        var targetPosition = this._getMinigameQuickIconPosition(),
            self = this,
            animationTime = 0.2,
            animation = cc.sequence(
                cc.spawn([
                    cc.scaleTo(animationTime, 0),
                    cc.rotateBy(animationTime, 720),
                    cc.moveTo(animationTime, targetPosition),
                    cc.fadeIn(animationTime),
                    cc.callFunc(function () {
                        if (self.minigameQuickIcon) {
                            self.minigameQuickIcon.show();
                        }
                    })
                ]),
                cc.callFunc(function () {
                    self.node.destroy();
                })
            );

        this.popupNode.runAction(animation);
    },

    _correctPositionToShow: function () {
        this.popupNode.stopAllActions();
        this.popupNode.scale = 0;
        this.popupNode.angle = 0;
        this.popupNode.opacity = 0;
        this.popupNode.position = this._getMinigameQuickIconPosition();
        this.node.active = true;
    },

    _correctPositionToHide: function () {
        this.popupNode.stopAllActions();
        this.popupNode.scale = 1;
        this.popupNode.angle = 0;
        this.popupNode.opacity = 255;
        this.popupNode.position = cc.v2(0, 0);
        this.node.active = true;
    },

    _getMinigameQuickIconPosition: function () {
        var oldScale = this.popupNode.scale,
            oldPosition = this.popupNode.position,
            targetPosition;

        this.popupNode.active = false;
        this.popupNode.scale = 1;
        this.popupNode.position = cc.v2(0, 0);

        targetPosition = this.popupNode.convertToNodeSpace(this.minigameQuickIcon.node.convertToWorldSpace(cc.v2(0, 0)));
        targetPosition.x = targetPosition.x + this.minigameQuickIconSize.width / 2 - this.popupNode.width / 2;
        targetPosition.y = targetPosition.y + this.minigameQuickIconSize.height / 2 - this.popupNode.height / 2;

        this.popupNode.scale = oldScale;
        this.popupNode.position = oldPosition;
        this.popupNode.active = true;

        return targetPosition;
    },

    _updateTaiXiu: function () {
        // this._updateTaiXiuTimeLeft();
        this.nowTime = this.lastTime - Date.now();
        if (this.nowTime > 0) {
            this.taixiuTimeLeftLabel.string = Math.round(this.nowTime / 1000) + "";
        } else {
            //this.allowBetting = false;
            this.taixiuTimeLeftLabel.string = "Cân cửa";
        }
    },

    _updateTaiXiuTimeLeft: function (message) {
        // var gameRuntimeConfigs = GameManager.getGameRuntimeConfigs(GameConstant.TAI_XIU.CMD),
        //     gameManager = gameRuntimeConfigs && gameRuntimeConfigs.gameManager;
        // if (gameManager) {
        //     this.taixiuTimeLeftLabel.string = gameManager.getFormattedCurrentTimeLeft();
        // }
        // this.taixiuTimeLeftLabel.string = message.timeOut;
        this.lastTime = Number(message.timeOut) * 1000 + Date.now();
    },
    onMiniGameClick(event) {
        
        if (!Linker.isOpenTaiXiu) {
            Linker.isOpenTaiXiu = true;
            Linker.MiniGame.taiXiuMini.active = true;
            Linker.MiniGame.taiXiuMini.zIndex = cc.macro.MAX_ZINDEX - 1;
            Linker.MiniGame.taiXiuMini.position = cc.v2(0, 0);
            Linker.MiniGame.taiXiuMini.opacity = 255;

        } else {
            if (Linker.MiniGame.taiXiuMini && Linker.MiniGame.taiXiuMini.position != cc.v2(0, 0)) {
                Linker.isOpenTaiXiu = true;
                Linker.MiniGame.taiXiuMini.zIndex = cc.macro.MAX_ZINDEX - 1;
                Linker.MiniGame.taiXiuMini.runAction(cc.moveTo(0.3, cc.v2(0, 0)));
                Linker.MiniGame.taiXiuMini.opacity = 255;
            }
        }
        this.hide();
    },
    onMiniGamePokerClick(event) {
        
        // if (!Linker.isOpenMiniPoker) {
             // Linker.isOpenMiniPoker = true;
             // cc.log(Linker.MiniGame);
             // Linker.MiniGame.miniPoker.active = true;
             // Linker.MiniGame.miniPoker.zIndex = cc.macro.MAX_ZINDEX - 1;
             // Linker.MiniGame.miniPoker.position = cc.v2(0, 0);
             // Linker.MiniGame.miniPoker.opacity = 255;
 
             Linker.MiniGame.minipoker.active = true;
             Linker.MiniGame.minipoker.zIndex = cc.macro.MAX_ZINDEX - 1;
             Linker.MiniGame.minipoker.position = cc.v2(0, 0);
 
         // } else {
         //     if (Linker.MiniGame.miniPoker && Linker.MiniGame.miniPoker.position != cc.v2(0, 0)) {
         //         Linker.isOpenTaiXiu = true;
         //         Linker.MiniGame.miniPoker.zIndex = cc.macro.MAX_ZINDEX - 1;
         //         Linker.MiniGame.miniPoker.runAction(cc.moveTo(0.3, cc.v2(0, 0)));
         //         Linker.MiniGame.miniPoker.opacity = 255;
         //     }
         // }
          this.hide();
     },
    onVQMMClick(event) {
        Linker.MiniGame.vqmm.active = true;
        this.hide();
    },
    onDestroy() {
        Linker.Event.removeEventListener(SocketConstant.GAME.TAI_XIU.UPDATE_TAI_XIU, this._updateTaiXiuTimeLeft, this);
    }
});
