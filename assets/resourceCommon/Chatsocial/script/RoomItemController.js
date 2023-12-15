var Linker = require("Linker");
var Constant = require("Constant");
var CommonSend = require('CommonSend');
cc.Class({
    extends: cc.Component,


    properties: {
        userInfoItemUIPrefab: cc.Prefab,

    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    onEnable() {

    },
    start() {
    },

    onDestroy: function () {
    },
    onRoomItemClick: function () {
        if (this.data) {
            var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.ITEM_ROOM_CHAT_SOCIAL_CLICK, true);
            // , this.roomId, this.roomName
            customEvent.roomData = this.data;
            this.node.dispatchEvent(customEvent);
        }
    },
    setNewMessage: function (data) {
        if (this.data && data) {
            this.data.lastMessageInRoom = data.message;
            this.data.lastTimeMessage = data.createdTime;
            if (this.userInfoItem) {
                var userInfoData = this.userInfoItem.getComponent("userInfoItem");
                if (userInfoData) {
                    userInfoData.setNewMessage(data);
                }
            }
        }
    },
    getData: function () {
        return this.data;
    },
    init: function (data) {
        if (data) {
            this.data = data;
            if (this.data.chatControllerNode && cc.isValid(this.data.chatControllerNode)) {
                this.chatControllerNode = this.data.chatControllerNode;
            }
        } else {
            this.data = null;
        }
        if (!this.userInfoItem || (this.userInfoItem && !cc.isValid(this.userInfoItem))) {
            this.node.removeAllChildren(true);
            this.userInfoItem = cc.instantiate(this.userInfoItemUIPrefab);
            this.node.addChild(this.userInfoItem);
        }
        if (this.userInfoItem) {
            var userInfoData = this.userInfoItem.getComponent("userInfoItem");
            if (userInfoData) {
                userInfoData.init(this.data);
            }
        }
    }
    // update (dt) {},
});