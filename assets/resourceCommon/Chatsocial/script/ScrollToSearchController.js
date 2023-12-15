var Constant = require("Constant");
var Linker = require('Linker');
var CommonSend = require('CommonSend');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        scrollViewSearch: cc.ScrollView,
        editBoxInput: cc.EditBox,
        contentResultSearch: cc.Node,
        chatControllerNode: cc.Node,
        loadingScrollPrefab: cc.Prefab,
        itemFriendPrefab: cc.Prefab,
        itemRoomPrefab: cc.Prefab,
        headerControllerTagNode: cc.Node
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
    getChatController: function () {
        if (this.chatControllerNode && cc.isValid(this.chatControllerNode)) {
            return this.chatControllerNode.getComponent("Chat");
        }
        return null;
    },
    hideLoadingItem: function () {
        var nameLoading = "LOADING_SEARCH_ITEM";
        var loadingItem = this.contentResultSearch.getChildByName(nameLoading);
        if (!loadingItem || (loadingItem && !cc.isValid(loadingItem))) {
            loadingItem = cc.instantiate(this.loadingScrollPrefab);
            loadingItem.name = nameLoading;
            this.contentResultSearch.addChild(loadingItem);
        }
        if (loadingItem) {
            loadingItem.active = false;
            loadingItem.zIndex = cc.macro.MAX_ZINDEX;
        }
    },
    onLoad: function () {
        this.addEventListenerToScrollView();
        this.addSocketEvent();
    },
    onDestroy: function () {
        this.removeSocketEvent();
    },
    isFriendExistedInContentNode: function (content, userId) {
        if (content && userId) {
            for (var i = 0; i < content.children.length; i++) {
                var item = content.children[i];
                if (item && cc.isValid(item)) {
                    var itemScript = item.getComponent("itemFriend");
                    if (itemScript) {
                        var data = itemScript.getData();
                        if (data) {
                            var uid = data.userId;
                            if (uid && uid == userId) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    },
    isRoomExistedInContentNode: function (content, roomId) {
        if (content && roomId) {
            for (var i = 0; i < content.children.length; i++) {
                var item = content.children[i];
                if (item && cc.isValid(item)) {
                    var itemScript = item.getComponent("RoomItemController");
                    if (itemScript) {
                        var data = itemScript.getData();
                        if (data) {
                            var _roomId = Number(data.roomId);
                            if (_roomId && _roomId == roomId) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    },
    addMoreFriendContent: function (content, listUsers) {
        if (content && listUsers && this.itemFriendPrefab) {
            for (var i = 0; i < listUsers.length; i++) {
                var uId = listUsers[i].uid;
                if (uId && !this.isFriendExistedInContentNode(content, uId)) {
                    var itemFriend = cc.instantiate(this.itemFriendPrefab);
                    if (itemFriend) {
                        var itemFriendJS = itemFriend.getComponent("itemFriend");
                        if (itemFriendJS) {
                            itemFriendJS.enableItemInChat(true);
                            itemFriendJS.enableItemClick(false);
                            itemFriendJS.init(listUsers[i]);
                            content.addChild(itemFriend);
                        }
                    }
                } else {
                    // cc.error("Uid đã tồn tại không thêm vào nữa...");
                }
            }
        }
    },
    addMoreRoomContent: function (content, listRooms) {
        if (content && listRooms && this.itemRoomPrefab) {
            for (var i = 0; i < listRooms.length; i++) {
                var roomId = Number(listRooms[i].roomId);
                if (roomId && !this.isRoomExistedInContentNode(content, roomId)) {
                    var itemRoom = cc.instantiate(this.itemRoomPrefab);
                    if (itemRoom) {
                        var itemRoomJS = itemRoom.getComponent("RoomItemController");
                        if (itemRoomJS) {
                            listRooms[i].chatControllerNode = this.chatControllerNode;
                            itemRoomJS.init(listRooms[i]);
                            content.addChild(itemRoom);
                        }
                    }
                } else {
                    // cc.error("Room đã tồn tại không thêm vào nữa...");
                }
            }
        }
    },
    onGetUserFinding: function (message) {
        if (message) {
            this.hideLoadingItem();
            if (Linker.isScrollToSearchFriend) {
                var listUsers = message.listUsers;
                if (listUsers && Array.isArray(listUsers)) {
                    this.addMoreFriendContent(this.contentResultSearch, listUsers);
                }
            }
        }
    },

    onListRoomSocialResponse: function (message) {
        if (message) {
            this.hideLoadingItem();
            if (Linker.isScrollToSearchRoom) {
                var listRooms = message.listRoom;
                if (listRooms && Array.isArray(listRooms)) {
                    this.addMoreRoomContent(this.contentResultSearch, listRooms);
                }
            }
        }
    },
    addSocketEvent: function () {
        Linker.Event.addEventListener(280198, this.onListRoomSocialResponse, this);
        Linker.Event.addEventListener(8, this.onGetUserFinding, this);
    },
    removeSocketEvent: function () {
        Linker.Event.removeEventListener(8, this.onGetUserFinding, this);
        Linker.Event.removeEventListener(280198, this.onListRoomSocialResponse, this);
    },
    addEventListenerToScrollView: function () {
        if (this.scrollViewSearch) {
            this.scrollViewSearch.node.on("bounce-bottom", this.onBounceToBottom, this);
            this.scrollViewSearch.node.on("scroll-began", this.onScrollBegan, this);
            this.scrollViewSearch.node.on("scroll-ended", this.onScrollEnded, this);
        }
    },
    addLoadingNodeToResult: function () {
        if (this.loadingScrollPrefab) {
            var nameLoading = "LOADING_SEARCH_ITEM";
            var loadingItem = this.contentResultSearch.getChildByName(nameLoading);
            if (!loadingItem || (loadingItem && !cc.isValid(loadingItem))) {
                loadingItem = cc.instantiate(this.loadingScrollPrefab);
                loadingItem.name = nameLoading;
                this.contentResultSearch.addChild(loadingItem);
            }
            if (loadingItem) {
                loadingItem.active = true;
                loadingItem.zIndex = cc.macro.MAX_ZINDEX;
            }
        }
    },
    requestNextPageFriend: function () {
        var chatControllerComponent = this.getChatController();
        if (chatControllerComponent) {
            this.addLoadingNodeToResult();
            if (this.contentResultSearch.children.length > 0 && chatControllerComponent.isCanSearchFriendNext) {
                var currentPage = chatControllerComponent.getCurrentFriendListPage();
                var nextPage = currentPage + 1;
                chatControllerComponent.setCurrentFriendListPage(nextPage);
                Linker.isScrollToSearchFriend = true;
                var name = chatControllerComponent.getNameSearchFriend();
                this.requestFindFriend(name, nextPage);
            } else {
                this.hideLoadingItem();
            }
        }
    },
    requestNextPageRoom: function () {
        var chatControllerComponent = this.getChatController();
        if (chatControllerComponent) {
            this.addLoadingNodeToResult();
            if (this.contentResultSearch.children.length > 0 && chatControllerComponent.isCanSearchRoomNext) {
                var currentPage = chatControllerComponent.getCurrentRoomListPage();
                var nextPage = currentPage + 1;
                chatControllerComponent.setCurrentRoomListPage(nextPage);
                Linker.isScrollToSearchRoom = true;
                var name = chatControllerComponent.getNameSearchRoom();
                this.requestFindRoom(name, nextPage);
            } else {
                this.hideLoadingItem();
            }
        }
    },
    requestFindRoom: function (name, page) {
        if (name && page) {
            var userId = Linker.userData.userId;
            var action = 2;// dùng cho tìm kiếm
            var numbRoom = 0;// mặc định
            var req = CommonSend.getListRoomSocial(userId, action, name, page, numbRoom);
            if (req) {
                Linker.Socket.send(req);
            }
        }
    },
    requestFindFriend: function (name, page) {
        if (name && page) {
            var send = CommonSend.findAFriendByName(name, page);
            if (send) {
                Linker.Socket.send(send);
            }
        }
    },
    onBounceToBottom: function (event) {
        if (event) {
            if (this.isBeginScrollToSearch) {
                if (this.getTag() == Constant.HEADER_CONTROLLER_TAG.HOME ||
                    this.getTag() == Constant.HEADER_CONTROLLER_TAG.SEARCH_IN_CHAT ||
                    this.getTag() == Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_ROOM_SEARCH) {
                    this.requestNextPageRoom();
                } else if (this.getTag() == Constant.HEADER_CONTROLLER_TAG.SEARCH_IN_GLOBAL ||
                    this.getTag() == Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_FRIEND) {
                    this.requestNextPageFriend();
                }
            }
        }
    },
    onScrollBegan: function (event) {
        if (event) {
            this.isBeginScrollToSearch = true;
        }
    },
    onScrollEnded: function (event) {
        if (event) {
            this.isBeginScrollToSearch = false;
        }
    },
    start() {

    },

    // update (dt) {},
});
