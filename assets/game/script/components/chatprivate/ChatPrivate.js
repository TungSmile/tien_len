var Linker = require('Linker');
var Constant = require('Constant');
var BiDaSend = require('BiDaSend');
var BiDaConstant = require('BiDaConstant');
const CommonSend = require('CommonSend');
var Global = require("Global");
var i18n = require('i18n');
var NewAudioManager = require('NewAudioManager');

cc.Class({
    extends: cc.Component,

    properties: {
        itemChatPrefab: cc.Prefab,
        contentNode: cc.Node,
        chatBox: cc.EditBox,
        iconsAtlas: cc.SpriteAtlas,
        quickChatPage: cc.Node,
        chatHistoryPage: cc.Node,
        emojiPage: cc.Node,
        itemEmoji: cc.Prefab,
        contentEmojiPage: cc.Node,
        itemQuickChat: cc.Prefab,
        contentQuickChatPage: cc.Node,
        listButton:[cc.Button],
    },

    ctor: function () {
        this.countNewChat = 0;
        this.arrChatBox = [];
        this.tableId = 0;
        this.countChat = 0;
        this.statusActive = false;
    },

    // LIFE-CYCLE CALLBACKS:
   

    onLoad() {
        Linker.Event.addEventListener(Constant.CMD.CHAT, this.onChatResponse, this);
        Linker.Event.addEventListener(73, this.onCheckFriend, this);
        Linker.Event.addEventListener(1204, this.onAddFriend, this);
        this.node.on('content-quick-chat', this.onReceiveQuickChat, this);
        this.node.on('content-emoji', this.onReceiveEmojiChat, this);
        this.arrChatBox = [];
        this.contentNode.destroyAllChildren();
        this.node.active = false;
        this.listUserIDFriendChat = [];
        this.initializeEmojiPage();
        this.initializeQuickChatPage();
        BiDaConstant.METHODS.createListenerNode().on("resetCountChat", this.resetCountChat, this);
        this.resetCountChat();
        this.disableListButton(2);
        this.emojiPage.active = false;
        this.quickChatPage.active = false;
    },
    onEnable: function () {
        this.chatBox.string = "";
        this.countChat = 0;
        Linker.CURRENT_TABLE.tableId = Linker.CURRENT_TABLE.tableId ? Linker.CURRENT_TABLE.tableId : (Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.tableId) ? Linker.CURRENT_TABLE.tableId : 0;
    },

    onDisable: function () {

    },
    addFriendRequest: function (event) {
        var target = event.currentTarget;
        if (target.userData) {
            var userId = parseInt(target.userData.userId);
            if (isNaN(userId) == false) {
                var type = G.AT.OK_CANCEL;
                var msg = i18n.t("ask_request_add_friend") + " " + target.userData.username + " ?";
                var okCb = function () {
                    cc.error("Gửi yêu cầu kết bạn...");
                    this.currentCheckingFriendId = userId;
                    var send = CommonSend.addAFriend(userId);
                    Linker.Socket.send(send);
                }.bind(this);
                var cancleCb = function () {
                    cc.error("Không gửi yêu cầu kết bạn...");
                };
                var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_THONG_BAO_CHUNG, true);
                customEvent.popup_msg = msg;
                customEvent.popup_type = type;
                customEvent.popup_okCallback = okCb;
                customEvent.popup_cancelCallback = cancleCb;
                this.node.dispatchEvent(customEvent);
            }
        }
    },
    onAddFriend: function (message) {
        var itemChat = null;
        if (this.currentCheckingFriendId) {
            itemChat = this.getItemChatByUID(this.currentCheckingFriendId, {
                property_name: "_isShowBtnAddFriend",
                property_data: true
            });
            if (itemChat) {
                var btnAddFriend = itemChat.getChildByName("btnAddFriend");
                if (btnAddFriend) {
                    btnAddFriend.runAction(
                        cc.sequence(
                            cc.scaleTo(0.3, 0).easing(cc.easeBackInOut(0.2)),
                            cc.fadeOut(0.3),
                            cc.callFunc(function () {
                                this.destroy();
                            }.bind(btnAddFriend))
                        )
                    )
                    // btnAddFriend.active = true;
                }
            }
        }
        var mess = message.data;
        cc.Global.showMessage(mess);
        if (Number(message.status) == 1) {
            //truong hop gui ket ban thanh cong
            cc.log(message.data);
        } else {
            //truong hop da gui ket ban roi
            cc.log(message.data);
        }
    },
    resetCountChat: function () {
        this.countChat = 0;
    },
    clearContentChat() {
        this.contentNode.destroyAllChildren();
    },
    onCheckFriend: function (message) {
        if (message.status == 1) {
            if (this.listUserIDFriendChat.indexOf(message.userId) == -1) {
                this.listUserIDFriendChat.push(message.userId);
                this.currentCheckingFriendId = message.userId;
                var itemChat = this.getItemChatByUID(message.userId);
                if (itemChat && message.isFriend == false) {
                    itemChat._isShowBtnAddFriend = true;
                    var btnAddFriend = itemChat.getChildByName("btnAddFriend");
                    if (btnAddFriend) {
                        btnAddFriend.active = true;
                    }
                }
            }
        }
    },
    getItemChatByUID: function (uid, data) {
        if (uid) {
            for (let i = 0; i < this.contentNode.children.length; i++) {
                var item = this.contentNode.children[i];
                if (item && cc.isValid(item)) {
                    if (data) {
                        if (item.userId == uid && item[data.property_name] == data.property_data) {
                            return item;
                        }
                    } else {
                        if (item.userId == uid) {
                            return item;
                        }
                    }

                }
            }
        }
        return null;
    },
    onDestroy: function () {
        Linker.Event.removeEventListener(Constant.CMD.CHAT, this.onChatResponse, this);
        Linker.Event.removeEventListener(73, this.onCheckFriend, this);
        Linker.Event.addEventListener(1204, this.onAddFriend, this);
    },
    start() { },

    sendChat(str) {
        var chatString = str;
        if (!!chatString) {
            var str = Constant.CMD.CHAT +
                Constant.SEPERATOR.N4 + Linker.CURRENT_TABLE.tableId +
                Constant.SEPERATOR.ELEMENT + chatString +
                Constant.SEPERATOR.ELEMENT + 0;
            var data = {
                status: 1,
                message: chatString,
                username: Linker.userData.displayName,
                id: Linker.userData.userId,
                userId: Linker.userData.userId
            };
            this.onChatResponse(data);
            this.chatBox.string = "";
            cc.Canvas.instance.node.emit(1300, data);
            var data = BiDaSend.sendChatPrivate(str);
            Linker.Socket.send(data);
        }
    },

    /* ------------------------------ BUTTON EVENT CALL BACKS -------------------------- */

    clickSendChat() {
        NewAudioManager.playClick();
        var chatString = this.chatBox.string;
        if (!!chatString) {
            var str = Constant.CMD.CHAT +
                Constant.SEPERATOR.N4 + Linker.CURRENT_TABLE.tableId +
                Constant.SEPERATOR.ELEMENT + chatString +
                Constant.SEPERATOR.ELEMENT + 0;
            var data = {
                status: 1,
                message: chatString,
                username: Linker.userData.displayName,
                id: Linker.userData.userId,
                userId: Linker.userData.userId
            };
            this.onChatResponse(data);
            this.chatBox.string = "";
            cc.Canvas.instance.node.emit(1300, data);
            var data = BiDaSend.sendChatPrivate(str);
            Linker.Socket.send(data);
        }
    },

    disableListButton(index){
        for(var i = 0;i< this.listButton.length;i++){
            this.listButton[i].interactable = ! (i == index);
        }
    },
    clickButton(event, customEventData) {
        NewAudioManager.playClick();
        switch (customEventData) {
            case "quick-chat": {
                this.quickChatPage.active = !this.quickChatPage.active;
                this.emojiPage.active = false;
                this.disableListButton(1);
                break;
            }
            case "emoji": {
                this.emojiPage.active = !this.emojiPage.active;
                this.quickChatPage.active = false;
                this.disableListButton(0);
                break;
            }
            default:{
                this.emojiPage.active = false;
                this.quickChatPage.active = false;
                this.disableListButton(2);
                break;
            }
                
        }
    },

    clickClosePopup() {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        customEvent.toggle = this.node.getComponent(cc.Toggle);
        this.node.dispatchEvent(customEvent);
        this.node.active = false;
        this.statusActive = false;
    },

    clickOpenChatTable() {

    },
    getLetters: function (sentences) {
        return Array.from(sentences);
    },
    getWords: function (sentences) {
        return sentences.split(/\s+/g);
    },
    onChatResponse(message) {
        if (message.status == 1) {            
            this.disableListButton(2);
            this.emojiPage.active = false;
            this.quickChatPage.active = false;
            if (this.node.active == false && message.username != Linker.userData.displayName) {
                this.countChat++;
                var customEvent = new cc.Event.EventCustom(Constant.POPUP_EVENT.CHAT_PRIVATE.COUNT, true);
                customEvent.countChat = this.countChat;
                this.node.dispatchEvent(customEvent);
            }
            var self = this;
            var data = {
                username: message.username,
                msg: message.message
            }
            var itemChat = cc.instantiate(self.itemChatPrefab);
            itemChat.destroyAllChildren();

            var colorName = cc.color("#fff500"); //other user chat
            var colorBtnFriend = cc.color("#02DF52"); //message user chat
            var isShowButtonFriend = false;
            if (data.username != Linker.userData.displayName) {
                isShowButtonFriend = true;
                // itemChat.getComponent(cc.RichText).string = "<color=#fff500><b>" + data.username + ": " + "</b></c><color=#ffffff>" + data.msg + "</color>";
            } else {
                colorName = cc.color("#00ff1f");
                // itemChat.getComponent(cc.RichText).string = "<color=#00ff1f><b>" + data.username + ": " + "</b></c><color=#ffffff>" + data.msg + "</color>";
            }
            var userNameString = this.getLetters(data.username + ": ");
            for (let i = 0; i < userNameString.length; i++) {
                var n = new cc.Node();
                n.color = colorName;
                var l = n.addComponent(cc.Label);
                l.cacheMode = cc.Label.CacheMode.CHAR;
                l.lineHeight = 30;
                l.fontSize = 30;
                l.string = userNameString[i];
                itemChat.addChild(n);
                // itemChat.getComponent(cc.Layout).updateLayout();
            };
            //add icon add friend
            // if (isShowButtonFriend) {
            //     var btnFriend = new cc.Node();
            //     btnFriend.color = colorBtnFriend;
            //     btnFriend.name = "btnAddFriend";
            //     var btnSprite = btnFriend.addComponent(cc.Sprite);
            //     var btnButton = btnFriend.addComponent(cc.Button);
            //     btnButton.target = btnFriend;
            //     btnButton.transition = cc.Button.Transition.SCALE;
            //     btnButton.zoomScale = 1.05;
            //     btnButton.duration = 0.1;
            //     btnSprite.spriteFrame = this.iconsAtlas.getSpriteFrame("icon_themban");
            //     btnFriend.on(cc.Node.EventType.TOUCH_START, this.addFriendRequest, this);
            //     itemChat.addChild(btnFriend);
            //     btnFriend.active = false;
            //     if (message.userId) {
            //         var userId = parseInt(message.userId);
            //         if (isNaN(userId) == false) {
            //             btnFriend.userData = message;
            //             itemChat.userId = userId;
            //             var send = CommonSend.checkUserIsFriendByUID(btnFriend.userData);
            //             Linker.Socket.send(send);
            //         }
            //     }
            // } else {
            //     itemChat._isShowBtnAddFriend = false;
            // }
            //add content
            var contentChatString = this.getWords(data.msg);
            for (let j = 0; j < contentChatString.length; j++) {
                var n = new cc.Node();
                // n.color = colorName;
                if (contentChatString[0].includes("Clip") && contentChatString.length < 2) {
                    var l = n.addComponent(cc.Animation);
                    n.addComponent(cc.Sprite);
                    var clip = cc.Global.findClip(contentChatString[0]);
                    l.addClip(clip);
                    l.play(clip.name);
                    var tempNode = new cc.Node("temp");
                    tempNode.height = 140;
                    itemChat.addChild(tempNode);
                } else {
                    var l = n.addComponent(cc.Label);
                    l.cacheMode = cc.Label.CacheMode.CHAR;
                    l.lineHeight = 30;
                    l.fontSize = 30;
                    //l.string = "<img src = '" + contentChatString[0] + "'/>";
                    l.string = " " + contentChatString[j];
                }
                itemChat.addChild(n);
            };
            //add to chat panel
            this.contentNode.addChild(itemChat);
            itemChat.width = this.contentNode.width * 1.1;
            itemChat.getComponent(cc.Layout).updateLayout();

        }

    },
    /* ----------------------- EDITBOX EVENT CALLBACKS ------------------------ */
    onEditEnd(a) {
        if (this._isEditReturn) {
            this.clickSendChat();
            this._isEditReturn = false;
        } else {
            cc.log("Chat end");
        }
    },

    onEditReturn() {
        this._isEditReturn = true;
    },

    /* ----------------------- CUSTOM EVENT CALLBACK ------------------------ */
    onReceiveQuickChat(event) {
        this.sendChat(event.chat);
        this.quickChatPage.active = false;
        this.chatHistoryPage.active = true;
    },

    onReceiveEmojiChat(event) {
        this.sendChat(event.chat);
        this.emojiPage.active = false;
    },

    /* ----------------------- OTHER FUNCITON ------------------------ */

    initializeEmojiPage() {
        this.contentEmojiPage.destroyAllChildren();
        var length = cc.Global.EmojiClip.length;
        for (let i = 1; i <= length; ++i) {
            var itemEmoji = cc.instantiate(this.itemEmoji);
            itemEmoji.getComponent("itemEmoji").setClip(i);
            this.contentEmojiPage.addChild(itemEmoji);
        }
    },

    initializeQuickChatPage() {
        this.contentQuickChatPage.destroyAllChildren();
        var length = text_chat.length;
        for (let i = 0; i < length; ++i) {
            var itemQuickChat = cc.instantiate(this.itemQuickChat);
            itemQuickChat.getComponent("itemQuickChat").setTextQuickChat(i18n.t(text_chat[i]));
            this.contentQuickChatPage.addChild(itemQuickChat);
        }
    }
});

const text_chat = [
    "Chào cả nhà!",
    "Đánh nhanh nào",
    "Chào các bạn, cho xin chân nhé!",
    "Xin lỗi! Mình có việc bận. Lúc khác đánh tiếp nhé",
    "Hết ván mình nghỉ, hẹn cả nhà lúc khác nhé",
    "Hiện tại mình không tiện nói chuyện. Các bạn thông cảm",
    "Xin lỗi! Đời quá đen",
    "Thần rùa xuất hiện haha",
    "Từ từ rồi khoai sẽ nhừ",
    "Cũng thường thôi bạn hiền",
    "Tưởng thế nào haha.",
    "Hay không bằng hên.",
];