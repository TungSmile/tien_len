var Constant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        onSearchNode: cc.Node,
        onFindNode: cc.Node,
        onAllListRoom: cc.Node,
        chatControllerNode: cc.Node,
        headerChatControllerNode: cc.Node
    },
    getChatController: function () {
        if (this.chatControllerNode && cc.isValid(this.chatControllerNode)) {
            return this.chatControllerNode.getComponent("Chat");
        }
        return null;
    },
    getHeaderChatController: function () {
        if (this.headerChatControllerNode && cc.isValid(this.headerChatControllerNode)) {
            return this.headerChatControllerNode.getComponent("HeaderChatSocial");
        }
        return null;
    },
    onLoad() {
        this.isOnSearchNode = 3;
        this.activeIconAndBoxNode();
    },
    activeIconAndBoxNode: function () {
        var chatController = this.getChatController();
        var headerChatController = this.getHeaderChatController();
        if (chatController && headerChatController) {
            if (this.isOnSearchNode == 1) {
                headerChatController.activeHomeSearchTab(Constant.HEADER_CONTROLLER_TAG.SEARCH_IN_GLOBAL);
                chatController.activeScrollView(Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_FRIEND);
                this.activeFindNode();
            } else if (this.isOnSearchNode == 2) {
                headerChatController.activeHomeSearchTab(Constant.HEADER_CONTROLLER_TAG.SEARCH_IN_CHAT);
                chatController.activeScrollView(Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_ROOM_SEARCH);
                this.activeSearchNode();

            } else if (this.isOnSearchNode == 3) {
                headerChatController.activeHomeSearchTab(Constant.HEADER_CONTROLLER_TAG.SEARCH_IN_CHAT);
                chatController.activeScrollView(Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_ROOM);
                this.activeAllNode();
            }
        }
    },
    activeSearchNode: function () {
        this.onSearchNode.active = true;
        this.onFindNode.active = false;
        this.onAllListRoom.active = false;
    },
    activeFindNode: function () {
        this.onSearchNode.active = false;
        this.onFindNode.active = true;
        this.onAllListRoom.active = false;

    },
    activeAllNode: function () {
        this.onSearchNode.active = false;
        this.onFindNode.active = false;
        this.onAllListRoom.active = true;
    },
    onSearchFindNodeClick: function () {
        var page = this.isOnSearchNode + 1;
        if (page > 0 && page < 4) {
            this.isOnSearchNode = page;
        } else {
            this.isOnSearchNode = 1;
        }
        this.activeIconAndBoxNode();

    }

    // update (dt) {},
});
