const Linker = require("Linker");
const Constant = require("Constant");
const CommonSend = require("CommonSend");
cc.Class({
    extends: cc.Component,

    properties: {
        dialogChatSocialPrefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Linker.ChatSocialController = this;
    },
    onEnable() {

    },
    start () {
    },
    setToggleDialog: function (dialog) {
        if (dialog) {
            if (!this.listPopupToggle) {
                this.listPopupToggle = [];
            }
            var toggle = dialog.getComponent(cc.Toggle);

            if (toggle) {
                this.listPopupToggle.push(toggle);
            }
        }
    },
    onDestroy: function () {
        Linker.Event.removeEventListener(290198, this.onChatSocialResponse, this);
    },
    sendMessageOnEndGame: function (listPlayerID) {
        var ownerId = Linker.userData.userId;
        var req = CommonSend.createRoomChat(listPlayerID, ownerId, 47, 1);
        Linker.Socket.send(req);
    }

    // update (dt) {},
});
