
const Linker = require("Linker");
const Constant = require("Constant");
const CommonSend = require('CommonSend');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,


    properties: {
        itemRoomPrefab: cc.Prefab,
        content: cc.Node,
        // itemChatPrefab: cc.Prefab,
        // contentNode: cc.Node,
        chatBox: cc.EditBox,
        itemEmoji: cc.Prefab,
        contentEmojiPage: cc.Node,
        emojiPage: cc.Node,
        // itemChatEmoji: cc.Prefab,
        avatarAtlas: cc.SpriteAtlas,
        scollRoomChatSocial: cc.ScrollView,
        scrollMessageChatSocial: cc.ScrollView,
        roomName: cc.Node,
        localMessagePrefab: cc.Prefab,
        localEndGameMessagePrefab: cc.Prefab,
        remoteMessagePrefab: cc.Prefab,
        iconMessageLocalPrefab: cc.Prefab,
        iconMessageRemotePrefab: cc.Prefab,
        contentMessage: cc.Node,
        contentFindingFriends: cc.Node,
        nameSearchingGlobalNode: cc.Node,
        nameSearchingChatNode: cc.Node,
        listScrollViewContainers: [cc.Node],
        itemFriendPrefab: cc.Prefab,
        contentListRoomSearch: cc.Node,
        btnSearchChatFriend: cc.Node,
        headerChat: cc.Node,
        inChatOnlineNode: cc.Node,
        inChatAvatarRoom: cc.Node,
        inChatAvatarSprite: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:
    getButtonHeaderComponent: function () {
        if (this.btnSearchChatFriend && cc.isValid(this.btnSearchChatFriend)) {
            return this.btnSearchChatFriend.getComponent("btnOnSearchAndFindFriend");
        }
        return null;
    },
    onLoad() {
        this.addSocketListener();
        this.node.on(Constant.GAME_COMMONS_EVENT.ITEM_ROOM_CHAT_SOCIAL_CLICK, this.onItemRoomChatSocialClick, this);
        this.contentMessage.on(cc.Node.EventType.CHILD_ADDED, this.onChatUpdate, this);
        var userId = Linker.userData.userId;
        var req = CommonSend.getListRoomSocial(userId);
        Linker.Socket.send(req);
        Linker.ChatSocial = this;
        this.activeScrollView(Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_ROOM);
    },
    getContentByTag: function (tag) {
        if (tag) {
            switch (tag) {
                case Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_ROOM:
                    return this.content;
                case Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_CHAT:
                    return this.contentMessage;
                case Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_FRIEND:
                    return this.contentFindingFriends;
                case Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_ROOM_SEARCH:
                    return this.contentListRoomSearch;
                default:
                    break;
            }
        }
        return null;
    },
    activeHeaderByTag: function (_tag) {
        if (_tag == Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_CHAT) {
            this.headerChat.active = false;
        } else {
            this.headerChat.active = true;
        }
    },
    resetPageFriendSearchByTag: function (_tag) {
        if (_tag == Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_FRIEND) {
            this.currentPageFriendSearch = 1;
            Linker.isScrollToSearchFriend = false;
        }
    },
    resetPageRoomSearchByTag: function (_tag) {
        if (_tag == Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_ROOM_SEARCH || _tag == Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_ROOM) {
            this.currentPageRoomSearch = 1;
            Linker.isScrollToSearchRoom = false;
        }
    },
    activeScrollView: function (_tag) {
        this.currentWindowTag = _tag;
        this.activeHeaderByTag(_tag);
        this.resetPageFriendSearchByTag(_tag);
        this.resetPageRoomSearchByTag(_tag);
        if (this.listScrollViewContainers) {
            for (var i = 0; i < this.listScrollViewContainers.length; i++) {
                var block = this.listScrollViewContainers[i];
                if (block) {
                    block.x = 0;
                    var blockComponent = block.getComponent("HeaderControllerTags");
                    if (blockComponent) {
                        var tag = blockComponent.getTag();
                        if (tag == _tag) {
                            block.active = true;
                        } else {
                            block.active = false;
                        }
                    }
                }
            }
        }
    },
    requestUserInfo: function (event) {
        if (event) {
            var isChatDirect = event.isChatDirect;
            if (isChatDirect) {
                this.openChatRoom(event);
            }
        }
    },
    openChatRoom: function (event) {
        if (event) {
            var dataUser = event.dataUser;
            if (dataUser) {
                var ownerId = Number(Linker.userData.userId);
                var chatId = Number(dataUser.userId);
                if (ownerId && isNaN(ownerId) == false && chatId && isNaN(chatId) == false) {
                    var listPlayerID = [ownerId, chatId];
                    var req = CommonSend.createRoomChatWithoutGameId(listPlayerID, ownerId);
                    if (req) {
                        Linker.Socket.send(req);
                    }
                }
            }
        }
    },
    onEnable() {

    },
    start() {
        this.initializeEmojiPage();
    },
    onChatUpdate: function () {
        this.scrollMessageChatSocial.scrollToBottom(0.1);
    },
    onDisable: function () {
        this.node.off('content-emoji', this.onReceiveEmojiChat, this);
    },
    addSocketListener: function () {
        Linker.Event.addEventListener(280198, this.onListRoomSocialResponse, this);
        Linker.Event.addEventListener(290198, this.onListMessageSocialResponse, this);
        Linker.Event.addEventListener(270198, this.onSendMessageSocialResponse, this);
        Linker.Event.addEventListener(8, this.onGetUserFinding, this);
    },
    onDestroy: function () {
        Linker.Event.removeEventListener(290198, this.onListMessageSocialResponse, this);
        Linker.Event.removeEventListener(280198, this.onListRoomSocialResponse, this);
        Linker.Event.removeEventListener(270198, this.onSendMessageSocialResponse, this);
        Linker.Event.removeEventListener(8, this.onGetUserFinding, this);
    },
    onBtnCloseClick: function () {
        this.node.destroy();
    },
    onBtnBackClick: function () {
        var buttonHeaderComponent = this.getButtonHeaderComponent();
        if (buttonHeaderComponent) {
            buttonHeaderComponent.isOnSearchNode = 3;
            buttonHeaderComponent.activeIconAndBoxNode();
        }
        // this.scollRoomChatSocial.node.active = true;
        // this.scrollMessageChatSocial.node.active = false;
        var userId = Linker.userData.userId;
        var req = CommonSend.getListRoomSocial(userId);
        Linker.Socket.send(req);
    },
    initializeEmojiPage() {
        this.contentEmojiPage.destroyAllChildren();
        var length = cc.Global.EmojiClip.length;
        for (let i = 1; i <= length; ++i) {
            var itemEmoji = cc.instantiate(this.itemEmoji);
            itemEmoji.getComponent("iconScript").setClip(i);
            this.contentEmojiPage.addChild(itemEmoji);
        }
    },

    onReceiveEmojiChat() {
        this.emojiPage.active = false;
    },
    destroyEmoji: function () {
        this.emojiPage.active = false;
    },
    clickImoji() {
        this.emojiPage.active = !this.emojiPage.active;
    },
    onItemRoomChatSocialClick: function (event) {
        // var roomItem = event.target;
        // var roomId = roomItem.getChildByName("room-Id").getComponent(cc.Label).string;
        // var roomName = roomItem.getChildByName("room-name").getComponent(cc.Label).string;
        if (event && event.roomData) {
            var roomData = event.roomData;
            this.activeScrollView(Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_CHAT);
            // avatarRoom: "4,"
            // createedTime: "1606558682191"
            // lastMessageInRoom: "Không có tin nhắn nào gần đây!"
            // lastTimeMessage: "0"
            // roomId: "243047243039"
            // roomName: "MANHUNI6"
            // uId: 243039
            var roomId = roomData.roomId;
            var roomName = roomData.roomName;
            var req = CommonSend.getListMessageSocial(roomId);
            if (req) {
                Linker.Socket.send(req);
                this.setRoomName(roomName);
            }
        }
    },
    onBtnSendMeassageClick: function () {
        var roomId = Linker.roomIdChattingSocial;
        var uId = Linker.userData.userId;
        var message = this.chatBox.string;
        if (message !== "") {
            this.chatBox.string = "";
            var createdTime = new Date().getTime();
            var type = 1;
            var req = CommonSend.sendMessageSocial(roomId, message, uId, createdTime, type);
            Linker.Socket.send(req);
        }
    },
    trimRoomNames: function (roomNames) {
        if (roomNames) {
            var _roomNames = roomNames.split(",");
            var tmpRoomNames = [];
            for (var i = 0; i < _roomNames.length; i++) {
                var name = _roomNames[i];
                if (name.length > 0) {
                    tmpRoomNames.push(name);
                }
            }
            return tmpRoomNames;
        }
        return [];
    },
    onListRoomSocialResponse: function (message) {
        if (message) {
            this.isCanSearchRoomNext = false;
            var contentNode = this.content;
            var action = Number(message.action);
            if (action == 2) {
                contentNode = this.contentListRoomSearch;
            }
            if (contentNode) {
                var listRoom = message.listRoom;
                if (listRoom) {
                    if (listRoom.length > 0) {
                        this.isCanSearchRoomNext = true;
                        if (!Linker.isScrollToSearchRoom) {
                            contentNode.removeAllChildren(true);
                            for (var i = 0; i < listRoom.length; i++) {
                                var dataRoom = listRoom[i];
                                if (dataRoom) {
                                    if (dataRoom.roomName) {
                                        var _roomNames = this.trimRoomNames(dataRoom.roomName);
                                        if (_roomNames.length == 1) {
                                            dataRoom.roomName = _roomNames[0];
                                            var roomItem = cc.instantiate(this.itemRoomPrefab);
                                            if (roomItem) {
                                                var roomScript = roomItem.getComponent("RoomItemController");
                                                if (roomScript) {
                                                    dataRoom.chatControllerNode = this.node;
                                                    roomScript.init(dataRoom);
                                                    contentNode.addChild(roomItem);
                                                }
                                            }
                                        } else if (_roomNames.length > 1) {
                                            cc.log("Chat nhom");
                                        }
                                    }
                                }
                            }
                        }
                    }
                    cc.log(contentNode);
                }
            }
        }
    },
    setRoomName: function (roomName) {
        if (roomName) {
            var titleRoom = this.roomName.getComponent(cc.Label);
            if (titleRoom) {
                titleRoom.string = roomName;
            }
        }
    },
    onListMessageSocialResponse: function (message) {
        cc.log(message);
        if (message) {
            var roomName = message.roomName;
            var roomId = message.roomId;
            this.setAvatarAndOnline(message);
            if (roomName && roomId) {
                this.activeScrollView(Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_CHAT);
                this.setRoomName(roomName);
                Linker.roomIdChattingSocial = roomId;
                var listMessage = message.listMessage;
                this.contentMessage.removeAllChildren(true);
                for (var i = 0; i < listMessage.length; i++) {
                    var uId = listMessage[i].uId;
                    var viewName = listMessage[i].viewName;
                    var type = listMessage[i].type;
                    var mess = listMessage[i].message;
                    switch (type) {
                        case 1:
                            var localMessage = cc.instantiate(this.localMessagePrefab);
                            var remoteMessage = cc.instantiate(this.remoteMessagePrefab);


                            if (uId == Linker.userData.userId) {
                                this.contentMessage.addChild(localMessage);
                                var localMessageComponent = localMessage.getComponent("itemMessageSocial");
                                if (localMessageComponent) {
                                    localMessageComponent.init(listMessage[i]);
                                    localMessageComponent.setContentMessage(mess);
                                }
                            } else {
                                this.contentMessage.addChild(remoteMessage);
                                var remoteMessageComponent = remoteMessage.getComponent("itemMessageSocial");
                                if (remoteMessageComponent) {
                                    remoteMessageComponent.init(listMessage[i]);
                                    remoteMessageComponent.setContentMessage(mess);
                                }
                            }
                            break;
                        case 2:
                            var endGameMessage = cc.instantiate(this.localEndGameMessagePrefab);
                            var endGameData = JSON.parse(mess);
                            cc.log(endGameData);
                            var endGameMessageScript = endGameMessage.getComponent("localEndGameMessage");
                            if(endGameMessageScript){
                                endGameMessageScript.init(endGameData);                                
                                this.contentMessage.addChild(endGameMessage);
                            }
                            
                            break;
                        case 3:
                            if (uId == Linker.userData.userId) {
                                var iconMessageLocal = cc.instantiate(this.iconMessageLocalPrefab);
                                iconMessageLocal.getChildByName("messuser").getComponent(cc.RichText).string = viewName + " : ";
                                var clip = cc.Global.findClip(mess);
                                if (clip) {
                                    clip.speed = 0.2;
                                    iconMessageLocal.getChildByName("Emoji").getComponent(cc.Animation).addClip(clip);
                                    iconMessageLocal.getChildByName("Emoji").getComponent(cc.Animation).play(mess);
                                    this.contentMessage.addChild(iconMessageLocal);
                                    var localMessageComponent = iconMessageLocal.getComponent("itemMessageSocial");
                                    if (localMessageComponent) {
                                        localMessageComponent.init(listMessage[i]);
                                        localMessageComponent.setContentMessage(mess);
                                    }
                                }
                            } else {
                                var iconMessageRemote = cc.instantiate(this.iconMessageRemotePrefab);
                                iconMessageRemote.getChildByName("messuser").getComponent(cc.RichText).string = " : " + viewName;
                                var clip = cc.Global.findClip(mess);
                                if (clip) {
                                    clip.speed = 0.2;
                                    iconMessageRemote.getChildByName("Emoji").getComponent(cc.Animation).addClip(clip);
                                    iconMessageRemote.getChildByName("Emoji").getComponent(cc.Animation).play(mess);
                                    this.contentMessage.addChild(iconMessageRemote);
                                    var remoteMessageComponent = iconMessageRemote.getComponent("itemMessageSocial");
                                    if (remoteMessageComponent) {
                                        remoteMessageComponent.init(listMessage[i]);
                                        remoteMessageComponent.setContentMessage(mess);
                                    }
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            }

        }
    },
    setCurrentFriendListPage: function (page) {
        if (page) {
            this.currentPageFriendSearch = page;
        }
    },
    getCurrentFriendListPage: function () {
        return this.currentPageFriendSearch;
    },
    setCurrentRoomListPage: function (page) {
        if (page) {
            this.currentPageRoomSearch = page;
        }
    },
    getCurrentRoomListPage: function () {
        return this.currentPageRoomSearch;
    },
    onGetUserFinding: function (message) {
        if (this && this.isValid) {
            this.isCanSearchFriendNext = false;
            if (message.status == 1) {
                //hiển thị tất cả bạn bè bạn có
                var childrenListFriend = [];
                if (message.listUsers.length > 0) {
                    this.isCanSearchFriendNext = true;
                }
                if (!Linker.isScrollToSearchFriend) {
                    this.contentFindingFriends.removeAllChildren(true);
                    childrenListFriend = this.createListChildNodeByPrefab(message.listUsers.length, this.itemFriendPrefab);
                    for (let i = 0; i < childrenListFriend.length; i++) {
                        var itemFriendJS = childrenListFriend[i].getComponent("itemFriend");
                        if (itemFriendJS) {
                            itemFriendJS.enableItemInChat(true);
                            itemFriendJS.enableItemClick(false);
                            itemFriendJS.init(message.listUsers[i]);
                        }
                    }
                    this.addContentToNode(this.contentFindingFriends, childrenListFriend);
                }

            } else {
                cc.log("Không thể get danh sách bạn bè của bạn")
            }
        }
    },
    setAvatarRoomInChat: function (avatarId) {
        if (this.inChatAvatarRoom && this.inChatAvatarSprite) {
            var frame = this.avatarAtlas.getSpriteFrame("avatar (" + avatarId + ")");
            if (!frame) {
                frame = this.avatarAtlas.getSpriteFrame("avatar (1)");
            }
            if (frame) {
                this.inChatAvatarSprite.spriteFrame = frame;
            }
        }
    },
    setIsOnlineRoomChat: function (isOnline) {
        if (this.inChatOnlineNode) {
            if (isOnline == 1) {
                this.inChatOnlineNode.active = true;
            } else {
                this.inChatOnlineNode.active = false;
            }
        }
    },
    setAvatarAndOnline: function (message) {
        var isOnline = Number(message.isOnline);
        if (isNaN(isOnline)) {
            isOnline = 0;
        }
        var avatarIdRoom = Number(message.avatarRoom);
        if (isNaN(avatarIdRoom) || avatarIdRoom == 0) {
            avatarIdRoom = 1;
        }
        this.setAvatarRoomInChat(avatarIdRoom);
        this.setIsOnlineRoomChat(isOnline);
    },
    onSendMessageSocialResponse: function (message) {
        var roomId = message.roomId;
        var uId = message.uId;
        var type = message.type;
        var mess = message.message;
        var viewName = message.viewName;
        this.setAvatarAndOnline(message);

        switch (type) {
            case 1:
                var localMessage = cc.instantiate(this.localMessagePrefab);
                var remoteMessage = cc.instantiate(this.remoteMessagePrefab);
                if (roomId == Linker.roomIdChattingSocial) {
                    if (uId == Linker.userData.userId) {
                        this.contentMessage.addChild(localMessage);
                        var localMessageComponent = localMessage.getComponent("itemMessageSocial");
                        if (localMessageComponent) {
                            localMessageComponent.init(message);
                            localMessageComponent.setContentMessage(mess);
                        }
                    } else {
                        this.contentMessage.addChild(remoteMessage);
                        var remoteMessageComponent = remoteMessage.getComponent("itemMessageSocial");
                        if (remoteMessageComponent) {
                            remoteMessageComponent.init(message);
                            remoteMessageComponent.setContentMessage(mess);
                        }
                    }
                } else {
                    cc.log("vao tin nhan moi");
                }
                break;
            case 2:
                var endGameMessage = cc.instantiate(this.localEndGameMessagePrefab);
                if (roomId == Linker.roomIdChattingSocial) {
                    var endGameData = JSON.parse(mess);
                    cc.log(endGameData);
                    endGameMessage.getChildByName("name-1").getComponent(cc.Label).string = endGameData.userData[0].viewName;
                    endGameMessage.getChildByName("zone").getComponent(cc.Label).string = endGameData.zoneId;
                    endGameMessage.getChildByName("name-2").getComponent(cc.Label).string = endGameData.userData[1].viewName;
                    endGameMessage.getChildByName("avt-1").getComponent(cc.Sprite).spriteFrame = this.avatarAtlas.getSpriteFrame("avatar (1)");
                    endGameMessage.getChildByName("avt-2").getComponent(cc.Sprite).spriteFrame = this.avatarAtlas.getSpriteFrame("avatar (2)");
                    this.contentMessage.addChild(endGameMessage);
                    this.scrollMessageChatSocial.scrollToBottom(0.1);
                } else {
                    cc.log("vao tin nhan moi");
                }
                break;
            case 3:
                if (roomId == Linker.roomIdChattingSocial) {
                    if (uId == Linker.userData.userId) {
                        var iconMessageLocal = cc.instantiate(this.iconMessageLocalPrefab);
                        iconMessageLocal.getChildByName("messuser").getComponent(cc.RichText).string = viewName + " : ";
                        var clip = cc.Global.findClip(mess);
                        if (clip) {
                            clip.speed = 0.2;
                            iconMessageLocal.getChildByName("Emoji").getComponent(cc.Animation).addClip(clip);
                            iconMessageLocal.getChildByName("Emoji").getComponent(cc.Animation).play(mess);
                            this.contentMessage.addChild(iconMessageLocal);
                            var localMessageComponent = iconMessageLocal.getComponent("itemMessageSocial");
                            if (localMessageComponent) {
                                localMessageComponent.init(message);
                                localMessageComponent.setContentMessage(mess);
                            }
                        }
                    } else {
                        var iconMessageRemote = cc.instantiate(this.iconMessageRemotePrefab);
                        iconMessageRemote.getChildByName("messuser").getComponent(cc.RichText).string = " : " + viewName;
                        var clip = cc.Global.findClip(mess);
                        if (clip) {
                            clip.speed = 0.2;
                            iconMessageRemote.getChildByName("Emoji").getComponent(cc.Animation).addClip(clip);
                            iconMessageRemote.getChildByName("Emoji").getComponent(cc.Animation).play(mess);
                            this.contentMessage.addChild(iconMessageRemote);
                            var remoteMessageComponent = iconMessageRemote.getComponent("itemMessageSocial");
                            if (remoteMessageComponent) {
                                remoteMessageComponent.init(message);
                                remoteMessageComponent.setContentMessage(mess);
                            }
                        }
                    }

                } else {
                    cc.log("vao tin nhan moi");
                }
                break;
        }
        this.onChatUpdate();
    },
    getNameSearchFriend: function () {
        var nameEditBox = this.nameSearchingGlobalNode.getComponent(cc.EditBox);
        if (nameEditBox) {
            var name = nameEditBox.string;
            if (name.length >= 1) {
                //tu dong tim kiem
                if (this.checkNameValid(name)) {
                    return name;
                }
            }
        }
        return null;
    },
    onFindFriendClick: function (event) {
        this.activeScrollView(Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_FRIEND);
        var nameEditBox = this.nameSearchingGlobalNode.getComponent(cc.EditBox);
        if (nameEditBox) {
            var name = nameEditBox.string;
            if (name.length >= 1) {
                //tu dong tim kiem
                if (this.checkNameValid(name)) {
                    if (!this.currentPageFriendSearch || this.currentPageFriendSearch == 0) {
                        this.currentPageFriendSearch = 1;
                    }
                    this.findFriendByNameAndPage(name, this.currentPageFriendSearch);
                }
            }
        }
    },
    getNameSearchRoom: function () {
        var nameEditBox = this.nameSearchingChatNode.getComponent(cc.EditBox);
        if (nameEditBox) {
            var name = nameEditBox.string;
            if (name.length >= 1) {
                //tu dong tim kiem
                if (this.checkNameValid(name)) {
                    return name;
                }
            }
        }
        return null;
    },
    onFindRoomChatClick: function (event) {
        this.activeScrollView(Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_ROOM);
        var nameEditBox = this.nameSearchingChatNode.getComponent(cc.EditBox);
        if (nameEditBox) {
            var name = nameEditBox.string;
            if (name.length >= 1) {
                //tu dong tim kiem
                if (this.checkNameValid(name)) {
                    if (!this.currentPageRoomSearch || this.currentPageRoomSearch == 0) {
                        this.currentPageRoomSearch = 1;
                    }
                    // getListRoomSocial(userId, action, inputSearch, page, numbRoom) *thêm cả tìm kiếm
                    var userId = Linker.userData.userId;
                    var action = 2;// dùng cho tìm kiếm
                    var inputSearch = name;// mặc định
                    var page = this.currentPageRoomSearch;// mặc định
                    var numbRoom = 0;// mặc định
                    this.activeScrollView(Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_ROOM_SEARCH);
                    var req = CommonSend.getListRoomSocial(userId, action, inputSearch, page, numbRoom);
                    if (req) {
                        Linker.Socket.send(req);
                    }
                }
            }
        }
    },
    createListChildNodeByPrefab: function (quantity, prefab) {
        var l = [];
        for (let i = 0; i < quantity; i++) {
            var c = cc.instantiate(prefab);
            l.push(c);
        }
        return l;
    },
    addContentToNode: function (node, children) {
        for (let i = 0; i < children.length; i++) {
            node.addChild(children[i]);
        }
    },
    findFriendByNameAndPage: function (name, page) {
        var send = CommonSend.findAFriendByName(name, page);
        if (send) {
            this.activeScrollView(Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_FRIEND);
            Linker.Socket.send(send);
        }
    },
    checkNameValid: function (name) {
        var name = name.toString();
        var reg = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?-]/;
        if (reg.test(name)) {
            cc.log("Lỗi, tên người dùng không được chứa ký tự đặc biệt ...");
            return false;
        }
        return true;
    },
    // update (dt) {},
});