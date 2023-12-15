var i18n = require("i18n");
var Utils = require('Utils');
var Linker = require('Linker');
var Constant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {

        avatarSprite: cc.Sprite,
        avatarAtlas: cc.SpriteAtlas,
        unreadCountLabel: cc.Label,
        roomNameLabel: cc.Label,
        latestMessageLabel: cc.Label,
        latestTimeMessageLabel: cc.Label,
        onLineNode: cc.Node,
        unReadIconNode: cc.Node
    },
    getChatController: function () {
        if (this.chatControllerNode && cc.isValid(this.chatControllerNode)) {
            return this.chatControllerNode.getComponent("Chat");
        }
        return null;
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
        this.setAvatarChatRoom();
        this.setLatestMessage();
        this.setNameRoom();
        this.setLatestTimeMessage();
        this.setOnlineStatus();
        this.setUnreadMessages();
    },
    setOnlineStatus: function () {
        if (this.onLineNode) {
            this.onLineNode.active = false;
            if (this.data) {
                var isOnline = parseInt(this.data.isOnline);
                if (isNaN(isOnline) == false && isOnline != 0) {
                    this.onLineNode.active = true;
                }
            }
        }
    },
    setUnreadMessages: function () {
        if (this.data && this.unreadCountLabel && this.unReadIconNode) {
            var count = this.data.countNewMessage;
            if (count) {
                count = parseInt(count);
                if (isNaN(count) == false && count > 0) {

                } else {

                    count = 0;
                }
            } else {
                count = 0;
            }
            this.data.countNewMessage = count;
            this.unReadIconNode.active = (count > 0) ? true : false;
            this.unreadCountLabel.string = this.data.countNewMessage;
        }
    },
    setNameRoom: function () {
        if (this.roomNameLabel && this.data) {
            this.roomNameLabel.string = this.data.roomName;
        }
    },
    trimMessageWithDot: function (message) {
        if (message) {
            var maxLength = 23;
            return message.substring(0, maxLength) + '...';
        }
        return "...";
    },
    howFarAgo: function (ms) {
        if (ms) {
            var currentDate = new Date();
            var currentTime = currentDate.getTime();
            var timeDiff = currentTime - ms;
            var s = (timeDiff / 1000) % 60;
            var m = (timeDiff / (1000 * 60)) % 60;
            var h = (timeDiff / (1000 * 60 * 60)) % 24;
            var d = (h / 24);
            var w = d / 7;
            var mon = w / 30;
            var y = mon / 365;
            s = Math.floor(s);
            m = Math.floor(m);
            h = Math.floor(h);
            d = Math.floor(d);
            w = Math.floor(w);
            mon = Math.floor(mon);
            y = Math.floor(y);
            if (y > 0) {
                return y + " " + i18n.t("year");
            } else if (mon > 0) {
                return mon + " " + i18n.t("month");
            } else if (w > 0) {
                return w + " " + i18n.t("week");
            } else if (d > 0) {
                return d + " " + i18n.t("day");
            } else if (h > 0) {
                return h + " " + i18n.t("hour") + " " + m + " " + i18n.t("minute");
            } else if (m > 0) {
                return m + " " + i18n.t("minute");
            } else if (s >= 0) {
                return s + " " + i18n.t("second");
            }
        }
        return 0;
    },
    setLatestMessage: function () {
        if (this.latestMessageLabel && this.data) {
            if (this.data) {
                // nếu là không phải icon type thì set như này còn không thì như nào nhỉ
                var msg = "";
                if (Utils.Malicious.isJsonString(this.data.lastMessageInRoom)) {
                    msg = i18n.t("Just played ") + Utils.Malicious.getNameGameByZone(JSON.parse(this.data.lastMessageInRoom).zoneId);
                } else {
                    var content = this.data.lastMessageInRoom;
                    if (this.data.lastMessageInRoom == "Không có tin nhắn nào gần đây!" && Linker.gameLanguage !== "vi") {
                        content = "No recent messages!";
                    }
                    msg = Utils.Decoder.decode(content);
                }
                this.latestMessageLabel.string = this.trimMessageWithDot(msg);
            }
        }
    },
    setLatestTimeMessage: function () {
        if (this.latestTimeMessageLabel && this.data) {
            var time = Number(this.data.createedTime);
            if (isNaN(time) == false && time >= 0) {
                this.latestTimeMessageLabel.string = this.howFarAgo(time);
            }
        }
    },
    setAvatarChatRoom: function () {
        if (this.data) {
            var data = this.data;
            var avatarId = Number(data.avatarRoom);
            avatarId = (isNaN(avatarId) == false && avatarId != 0) ? avatarId : 1;
            var frame = this.avatarAtlas.getSpriteFrame("avatar (" + avatarId + ")");
            if (frame) {
                this.avatarSprite.spriteFrame = frame;
            }
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.addSocketEvent();
    },
    onDestroy: function () {
        this.removeEventSocket();
    },
    setNewMessage: function (data) {
        if (this.data && data) {
            this.data.lastMessageInRoom = data.message;
            this.data.lastTimeMessage = data.createdTime;
            this.data.createedTime = data.createdTime;
            this.setLatestMessage();
            this.setLatestTimeMessage();
            this.data.countNewMessage += 1;
            this.setUnreadMessages();
        }
    },
    onSendMessageSocialResponse: function (message) {
        if (this && cc.isValid(this)) {
            if (message) {
                if (Number(message.uId) == Number(Linker.userData.userId)) {
                    //nếu người chơi đang gửi thì không thực hiện count lại tin nhắn kia
                } else {
                    var roomId = message.roomId;
                    if (Number(this.data.roomId) == Number(roomId)) {
                        var chatControllerComponent = this.getChatController();
                        if (chatControllerComponent) {
                            var _tag = chatControllerComponent.currentWindowTag;
                            var content = chatControllerComponent.getContentByTag(_tag);
                            switch (_tag) {
                                case Constant.HEADER_CONTROLLER_TAG.HOME:
                                    break;
                                case Constant.HEADER_CONTROLLER_TAG.SEARCH_IN_CHAT:
                                    break;
                                case Constant.HEADER_CONTROLLER_TAG.SEARCH_IN_GLOBAL:
                                    break;
                                case Constant.HEADER_CONTROLLER_TAG.CHAT:
                                    break;
                                case Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_ROOM:
                                    if (content) {
                                        var room;
                                        var itemRoom;
                                        var itemRoomScript;
                                        var data;
                                        var roomId = message.roomId;
                                        for (var i = 0; i < content.children.length; i++) {
                                            itemRoom = content.children[i];
                                            if (itemRoom && cc.isValid(itemRoom)) {
                                                itemRoomScript = itemRoom.getComponent("RoomItemController");
                                                if (itemRoomScript && cc.isValid(itemRoomScript)) {
                                                    data = itemRoomScript.data;
                                                    if (data) {
                                                        if (Number(roomId) == Number(data.roomId)) {
                                                            room = itemRoom;
                                                            break;
                                                        };
                                                    }
                                                }
                                            }
                                        }
                                        if (room) {
                                            itemRoomScript.setNewMessage(message);
                                        }
                                    }
                                    break;
                                case Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_CHAT:
                                    break;
                                case Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_FRIEND:
                                    break;
                                case Constant.HEADER_CONTROLLER_TAG.SCROLL_LIST_ROOM_SEARCH:
                                    break;
                                default:
                                    break;
                            }
                        }
                    }

                }
            }
        }

    },
    addSocketEvent: function () {
        Linker.Event.addEventListener(270198, this.onSendMessageSocialResponse, this);
    },
    removeEventSocket() {
        Linker.Event.removeEventListener(270198, this.onSendMessageSocialResponse, this);
    },
    // update (dt) {},
});
