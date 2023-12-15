// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        textId: cc.Label,
        textTitle: cc.Label,
        lineVe: cc.Node,
        icon: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable () {
        Linker.MessageDialog.node.on("clickItem", this.onClickItem, this);
    },

    start () {

    },
    init() {
        var data = this.node.data;
        if (data) {
            this.textId.string = data.id;
            this.textTitle.string = ("[" + data.name + "] " + data.title).substring(0, 33) + "..." + "\n" +
                data.time;
            if (data.isRead == 1) {
                this.textId.node.color = cc.Color.BLACK;
                this.textTitle.node.color = cc.Color.BLACK;
                this.seen(false);
            } else {
                this.textId.node.color = cc.Color.BLUE;
                this.textTitle.node.color = cc.Color.BLUE;
                this.seen(true);
            }
        }
    },
    clickEvent(event) {
        Linker.MessageDialog.itemClick(event);
        // this.MessageDialog.on(cc.Node.EventType.TOUCH_START,this.init,this);
        // this.onLoad();
    },

    onClickItem(event) {
        // console.error(event.target);
        // console.error(this.node);
        if (event.target == this.node) {
            this.lineVe.active = true;
            this.textId.node.color = cc.Color.BLACK;
                this.textTitle.node.color = cc.Color.BLACK;
        } else {
            this.lineVe.active = false;
        }
    },
    seen(bool) {
        if (bool)
        {
            this.icon.getChildByName("on").active = true;
        }
        else
        {
            this.icon.getChildByName("on").active = false;
        }
    }

    // update (dt) {},
});
