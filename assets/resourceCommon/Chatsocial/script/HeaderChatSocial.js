var Constant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        btnBackFromSearchInGlobal: cc.Node,
        btnBackFromSearchInChat: cc.Node,
        btnChat: cc.Node,
        btnSearch: cc.Node,

        blocksHeader: [cc.Node],
        chatControllerNode: cc.Node
    },
    getChatController: function () {
        if (this.chatControllerNode && cc.isValid(this.chatControllerNode)) {
            return this.chatControllerNode.getComponent("Chat");
        }
        return null;
    },
    onLoad() {
        this.onBackToHomeTab();
    },
    onBackToHomeTab: function (event) {
        // this.activeHomeSearchTab(Constant.HEADER_CONTROLLER_TAG.HOME);
        var chatController = this.getChatController();
        if (chatController) {
            chatController.activeScrollView(Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_ROOM);
        }
    },
    onOpenSearchInGlobal: function (event) {
        this.activeHomeSearchTab(Constant.HEADER_CONTROLLER_TAG.SEARCH_IN_GLOBAL);
        var chatController = this.getChatController();
        if (chatController) {
            chatController.activeScrollView(Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_FRIEND);
        }
    },
    onOpenSearchInChat: function (event) {
        this.activeHomeSearchTab(Constant.HEADER_CONTROLLER_TAG.SEARCH_IN_CHAT);
        var chatController = this.getChatController();
        if (chatController) {
            chatController.activeScrollView(Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_ROOM_SEARCH);
        }
    },
    activeHomeSearchTab: function (_tag) {
        if (this.blocksHeader) {
            var activeBlockEditBoxController;
            for (var i = 0; i < this.blocksHeader.length; i++) {
                var block = this.blocksHeader[i];
                if (block) {
                    var blockComponent = block.getComponent("HeaderControllerTags");
                    if (blockComponent) {
                        var headerEditBoxCtrl = block.getComponent("HeaderChatEditBoxController");
                        var tag = blockComponent.getTag();
                        if (tag == _tag) {
                            block.active = true;
                            activeBlockEditBoxController = headerEditBoxCtrl;
                            
                        } else {
                            block.active = false;
                            headerEditBoxCtrl.enableSystemListener(false);
                            headerEditBoxCtrl.focusEditBox(false);
                        }
                    }
                }
            }
            var textString = "";
            for (var j = 0; j < this.blocksHeader.length; j++) {
                var block = this.blocksHeader[j];
                if (block) {
                    var blockComponent = block.getComponent("HeaderControllerTags");
                    var blockEditBoxController = block.getComponent("HeaderChatEditBoxController");
                    if (blockComponent) {
                        if (block.active == false) {
                            if (blockEditBoxController) {
                                textString = blockEditBoxController.getStringEditBox();
                                blockEditBoxController.enableSystemListener(false);
                                blockEditBoxController.focusEditBox(false);
                            }
                        }
                    }

                }
            }
            if (activeBlockEditBoxController) {
                activeBlockEditBoxController.setStringEditBox(textString);
                activeBlockEditBoxController.enableSystemListener(true);
                activeBlockEditBoxController.focusEditBox(true);
                activeBlockEditBoxController.permitSearch();
            }
        }
    },
    start() {

    },

    // update (dt) {},
});
