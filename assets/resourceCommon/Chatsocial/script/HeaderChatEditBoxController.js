var Constant = require("Constant");
var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        headerControllerTagNode: cc.Node,
        editBoxInput: cc.EditBox,
        chatControllerNode: cc.Node
    },
    getChatController: function () {
        if (this.chatControllerNode && cc.isValid(this.chatControllerNode)) {
            return this.chatControllerNode.getComponent("Chat");
        }
        return null;
    },
    getHeaderControllerTag: function () {
        if (this.headerControllerTagNode && cc.isValid(this.headerControllerTagNode)) {
            return this.headerControllerTagNode.getComponent("HeaderControllerTags");
        }
        return null;
    },
    getTag: function () {
        var headerController = this.getHeaderControllerTag();
        if (headerController) {
            return headerController.getTag();
        }
        return null;
    },
    getStringEditBox: function () {
        if (this.editBoxInput) {
            return this.editBoxInput.string;
        }
        return "";
    },
    enableSystemListener: function (enable) {
        this.isListenSystemKyboard = enable ? true : false;
    },
    setStringEditBox: function (string) {
        if (this.editBoxInput) {
            this.editBoxInput.string = string;
        }
    },
    onEditBoxEditingBegan: function (editbox) {
        this.isBeginEditBox = true;
    },
    onEditBoxEditingEnded: function (editbox) {
        this.isBeginEditBox = false;
    },
    removeWhiteSpace: function (string) {
        return string.replace(/\s/g, '');
    },
    permitSearch: function () {
        this.unschedule(this.permitSearch);
        this.isPermitAutoSearch = true;
    },
    onEditBoxTextChanged: function (editbox) {
        // var s = this.removeWhiteSpace(editbox.string);
        var s = editbox.string;
        editbox.string = s;
        editbox.textLabel.string = s;
        editbox.focus = true;
        if (s.length >= 3 && s.length % 3 == 0) {
            if (this.isPermitAutoSearch == true) {
                this.isPermitAutoSearch = false;
                //sau 10s neu data khong tra ve thi se tu dong reset cho tim du lieu tiep theo
                this.scheduleOnce(this.permitSearch, 10);
                //tu dong tim kiem
                this.requestTimBanTimPhong(event);
            } else {
                cc.log("chua the tim kiem ngay luc nay")
            }
        }
    },
    focusEditBox: function (isFocused) {
        if (this.editBoxInput) {
            this.editBoxInput.focus = isFocused ? true : false;
        }
    },
    requestTimBanTimPhong: function (event) {
        var chatControllerComponent = this.getChatController();
        if (chatControllerComponent) {
            if (this.getTag() == Constant.HEADER_CONTROLLER_TAG.HOME || this.getTag() == Constant.HEADER_CONTROLLER_TAG.SEARCH_IN_CHAT) {
                chatControllerComponent.onFindRoomChatClick(event);
            } else if (this.getTag() == Constant.HEADER_CONTROLLER_TAG.SEARCH_IN_GLOBAL) {
                chatControllerComponent.onFindFriendClick(event);
            }
        }
    },
    onEditBoxEditingReturn: function (event) {
        if (this.editBoxInput)
            if (event) {
                if (this.isListenSystemKyboard && this.isBeginEditBox && this.editBoxInput.isFocused()) {
                    this.requestTimBanTimPhong(event);
                }
            }
    },
    onLoad() {
        if (this.editBoxInput) {
            this.editBoxInput.node.on("editing-did-began", this.onEditBoxEditingBegan, this);
            this.editBoxInput.node.on("editing-did-ended", this.onEditBoxEditingEnded, this);
            this.editBoxInput.node.on("text-changed", this.onEditBoxTextChanged, this);
            this.editBoxInput.node.on("editing-return", this.onEditBoxEditingReturn, this);
        }
    },
    start() {
        this.addSocketEvent();
    },
    onListRoomSocialResponse: function (message) {
        if (message) {
            this.permitSearch();
        }
    },
    onGetUserFinding: function (message) {
        if (message) {
            this.permitSearch();
        }
    },
    addSocketEvent() {
        if (this.editBoxInput) {
            if (this.getTag() == Constant.HEADER_CONTROLLER_TAG.HOME || this.getTag() == Constant.HEADER_CONTROLLER_TAG.SEARCH_IN_CHAT) {
                Linker.Event.addEventListener(280198, this.onListRoomSocialResponse, this);
            } else if (this.getTag() == Constant.HEADER_CONTROLLER_TAG.SEARCH_IN_GLOBAL) {
                Linker.Event.addEventListener(8, this.onGetUserFinding, this);
            }
        }
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(280198, this.onListRoomSocialResponse, this);
        Linker.Event.removeEventListener(8, this.onGetUserFinding, this);
    },
    onDestroy: function () {
        this.removeSocketEvent();
    }
    // update (dt) {},
});
