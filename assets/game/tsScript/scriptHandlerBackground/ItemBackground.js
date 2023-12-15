// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var CommonSend = require('CommonSend')
var Linker = require('Linker');
var Constant = require('Constant');

cc.Class({
    extends: cc.Component,

    properties: {
        listThumbBackground: cc.SpriteAtlas,
        mainSprite: cc.Sprite,
        tick: cc.Node,
        grey: cc.Node,
        lock: cc.Node
    },
    dataItem: null,

    renderBackground(data) {
        this.dataItem = data;
        if (data) {
            this.mainSprite.spriteFrame = this.listThumbBackground.getSpriteFrame('thumb_' + data.idTheme);
            this.tick.active = false;
            if (data.isBought) {
                this.grey.active = false;
                this.lock.active = false;
            }
            if (data.isUse) {
                this.tick.active = !this.tick.active;
            }
        }
    },
    btnClickNode: function () {
        if (this.dataItem.isUse == false) {
            if (this.dataItem.isBought == false) {
                // ban len sv pay bg
                var customEvent = new cc.Event.EventCustom('SHOW_POPUP_PAY_BACKGROUND', true);
                customEvent.dataItem = this.dataItem;
                this.node.dispatchEvent(customEvent);
            } else {
                // ban len server use bg
                var dataSend = CommonSend.sendActionTheme(Linker.userData.userId, Constant.ACTION_THEME.SELECT_THEME, this.dataItem.idTheme);
                if (dataSend) {
                    Linker.Socket.send(dataSend);
                }
            }
        }
    }
});
