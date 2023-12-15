// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const Linker = require("Linker");
const Constant = require("Constant");
const CommonSend = require('CommonSend');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    setKey(key) {
        this.key = key;
    },

    setSpriteFrame(spriteFrame) {
        this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },

    setClip(idClip) {
        var clipName = "Clip" + idClip;
        var clip = cc.Global.findClip(clipName);
        if (clip) {
            clip.speed = 0.2;
            this.node.getComponent(cc.Animation).addClip(clip);
            this.node.getComponent(cc.Animation).play(clipName);
            this.setKey(clipName);
        }
    },

    getKey() {
        return this.key;
    },


    /* ----------------------- BUTTON EVENT ---------------------- */
    onClickButton(event, customEventData) {
        var roomId = Linker.roomIdChattingSocial;
        uId = Linker.userData.userId;
        var message = this.key;
        var createdTime = new Date().getTime();
        var type = 3;
        var req = CommonSend.sendMessageSocial(roomId, message, uId, createdTime, type);
        Linker.Socket.send(req);
        Linker.ChatSocial.destroyEmoji();
    }
});
