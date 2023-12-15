var CommonSend = require('CommonSend');
var Linker = require('Linker');
var Utils = require('Utils');
var BiDaConstant = require('BiDaConstant');
var NewAudioManager = require('NewAudioManager');
var i18n = require('i18n');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,
    ctor() {
        this.dataUser = {}
    },
    properties: {
        btnCancleInviteRequest: cc.Node,
        btnAcceptInviteRequest: cc.Node,
        btnLockFriend: cc.Node,
        btnInboxFriend: cc.Node,
        btnRemoveFriend: cc.Node,
        btnAddFriendRequest: cc.Node,
        btnChat: cc.Node,
        //left
        userNameNode: cc.Node,
        statusNode: cc.Node,
        hintNode: cc.Node,
        levelNode: cc.Node,
        moneyNode: cc.Node,
        expNode: cc.Node,
        avatarSprite: cc.Sprite,
        avatarFrameList: cc.SpriteAtlas,
        iconCommonFramesList: cc.SpriteAtlas,
        isEnableClick: true,
        onlineToggle: cc.Toggle,
        offlineToggle: cc.Toggle,
        onOfflineToggleNode: cc.Node
    },
    addGetFriendTab: function (data) {
        this.isFindFriendTab = false;
        //utype
        this.dataUser = data;
        if (Number(data.utype) == 1) {
            //da la ban be
            // this.btnRemoveFriend.active = true;
            //level
            // this.levelNode.active = true;
            this.levelNode.getComponent(cc.Label).string = "Level: " + data.level;
            // this.moneyNode.active = true;
            this.moneyNode.getComponent(cc.Label).string = Utils.Malicious.moneyWithFormat(data.money, ",");
            //status
            this.statusNode.active = true;
            if (Number(data.online) == 1) {
                //online
                var statusFrame = this.iconCommonFramesList.getSpriteFrame("icons_friends_01");
                if (statusFrame) {
                    this.statusNode.getChildByName("iconStatus").getComponent(cc.Sprite).spriteFrame = statusFrame;
                    this.statusNode.getChildByName("txtstatus").color = cc.color("#03FA0D");
                    this.statusNode.getChildByName("txtstatus").getComponent(cc.Label).string = "Online";
                }

            } else {
                //offline
                var statusFrame = this.iconCommonFramesList.getSpriteFrame("icons_friends_02");
                if (statusFrame) {
                    this.statusNode.getChildByName("iconStatus").getComponent(cc.Sprite).spriteFrame = statusFrame;
                    this.statusNode.getChildByName("txtstatus").color = cc.color("#A8A8A8");
                    this.statusNode.getChildByName("txtstatus").getComponent(cc.Label).string = "Offline";
                }
            }
        } else if (Number(data.utype) == 2) {
            //danh cho ban da gui loi moi di
            // this.btnRemoveFriend.active = true;
            // this.btnCancleInviteRequest.active = true;
            this.statusNode.active = true;
            this.statusNode.getChildByName("iconStatus").active = false;
            this.statusNode.getChildByName("txtstatus").color = cc.color("#FFFF00");
            this.statusNode.getChildByName("txtstatus").getComponent(cc.Label).string = i18n.t("Đã gửi lời mời kết bạn");
        } else if (Number(data.utype) == -1) {
            //truong hop nay khong nen hien thi
            this.node.active = false;
            return;
        }
        this.userNameNode.active = true;
        this.userNameNode.getComponent(cc.Label).string = data.displayName;

        //avatar
        var avatarFrame = this.avatarFrameList.getSpriteFrame("avatar (" + data.avatarID + ")");
        if (avatarFrame) {
            this.avatarSprite.spriteFrame = avatarFrame;
        }
        //inbox
        // this.btnInboxFriend.active = true;

        //add uid friend
        this.userId = data.uid;
    },
    addFindFriendTab: function (data) {
        this.isFindFriendTab = true;
        this.dataUser = data;
        this.userNameNode.active = true;
        this.userNameNode.getComponent(cc.Label).string = data.viewname;
        //avatar
        var avatarFrame = this.avatarFrameList.getSpriteFrame("avatar (" + data.avatarID + ")");
        if (avatarFrame) {
            this.avatarSprite.spriteFrame = avatarFrame;
        }
        //inbox
        // this.btnInboxFriend.active = true;
        //add friend button
        if (this.isItemFriendInChatSearch) {
            this.btnAddFriendRequest.active = false;
        } else {
            this.btnAddFriendRequest.active = true;
        }
        //add uid friend
        this.userId = data.uid;
    },
    getListSendFriend: function (data) {

        this.dataUser = data;
        this.userNameNode.active = true;
        this.userNameNode.getComponent(cc.Label).string = data.viewname;
        //avatar
        var avatarFrame = this.avatarFrameList.getSpriteFrame("avatar (" + data.avatarID + ")");

        if (avatarFrame) {
            this.avatarSprite.spriteFrame = avatarFrame;
        }
        //inbox
        // this.btnInboxFriend.active = true;
        this.btnAcceptInviteRequest.active = true;
        this.btnRemoveFriend.active = true;
        // this.moneyNode.active = true;
        // this.moneyNode.getComponent(cc.Label).string = Utils.Malicious.moneyWithFormat(data.money, ",");
        //add uid friend
        this.userId = data.uid;
    },
    getData: function () {
        return this.data;
    },
    init: function (data) {
        if (data) {
            this.data = data;
        } else {
            this.data = null;
        }
        this.configDefault();
        if (data.isGetFriends) {
            this.addGetFriendTab(data);
        } else if (data.isSendFriends) {
            cc.log(data);
            this.getListSendFriend(data);
        } else {
            this.addFindFriendTab(data);
        }
    },
    configDefault: function () {
        //
        this.userNameNode.active = true;
        this.statusNode.active = false;
        this.hintNode.active = false;
        this.levelNode.active = false;
        this.expNode.active = false;
        this.moneyNode.active = false;
        //
        this.btnCancleInviteRequest.active = false;
        this.btnAcceptInviteRequest.active = false;
        this.btnChat.active = false;
        this.btnLockFriend.active = false;
        this.btnInboxFriend.active = false;
        this.btnRemoveFriend.active = false;
        this.btnAddFriendRequest.active = false;
        this.onOfflineToggleNode.active = false;

    },
    handleRunAction(send) {
        this.node.runAction(
            cc.sequence(
                cc.scaleTo(0.3, 0).easing(cc.easeBackInOut(0.2)),
                cc.fadeOut(0.3),
                cc.callFunc(function () {
                    Linker.Socket.send(send);
                    this.node.destroy();
                }.bind(this))
            )
        )
    },
    enableItemClick: function (enable) {
        this.isEnableClick = enable ? true : false;
    },
    enableItemInChat: function (enable) {
        this.isItemFriendInChatSearch = enable ? true : false;
    },
    onButtonClick: function (event) {
        NewAudioManager.playClick();
        if (event) {
            if (event.currentTarget == this.btnCancleInviteRequest) {
                cc.log("FZ: BTN CANCLE INVITE CLICK ...");
            } else if (event.currentTarget == this.btnAcceptInviteRequest) {
                if (this.userId && !isNaN(this.userId)) {
                    //1 dong y ket ban
                    var send = CommonSend.replyFriendRequest(this.userId, 1);
                    if (send) {
                        this.handleRunAction(send);
                    }
                }
                cc.log("FZ: BTN ACCEPT INVITE CLICK ...");
            } else if (event.currentTarget == this.btnLockFriend) {
                cc.log("FZ: BTN BLOCK FRIEND CLICK ...");
            } else if (event.currentTarget == this.btnInboxFriend) {
                cc.log("FZ: BTN INBOX FRIEND CLICK ...");
            } else if (event.currentTarget == this.btnRemoveFriend) {
                if (this.userId && !isNaN(this.userId)) {
                    //2 khong dong y ket ban
                    var send = CommonSend.replyFriendRequest(this.userId, 2);
                    if (send) {
                        this.handleRunAction(send);
                    }
                }
                cc.log("FZ: BTN REMOVE FRIEND CLICK ...");
            } else if (event.currentTarget == this.btnAddFriendRequest) {
                if (this.userId && !isNaN(this.userId)) {
                    var send = CommonSend.addAFriend(this.userId);
                    if (send) {
                        this.handleRunAction(send);
                    }
                }
                cc.log("FZ: BTN ADD INVITE CLICK ...");
            } else if (event.currentTarget == this.btnChat) {
                if (this.dataUser) {
                    var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_CHAT_SOCIAL, true);
                    customEvent.dataUser = this.dataUser;
                    customEvent.isChatDirect = true;
                    this.node.dispatchEvent(customEvent);
                }
                // Linker.Socket.send(CommonSend.createRoomChat(new Array(Linker.userData.userId, this.dataUser.userId), Linker.userData.userId, 0, 2));

            } else if (event.currentTarget == this.node) {
                if (this.isEnableClick) {
                    var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_PROFILE_USER, true);
                    customEvent.userId = Number(this.dataUser.userId);
                    customEvent.isFriendZoneTab = true;
                    customEvent.isFindFriendTab = this.isFindFriendTab;
                    customEvent.isFriendZoneClick = true;
                    this.node.dispatchEvent(customEvent);
                } else {
                    if (this.dataUser) {
                        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_CHAT_SOCIAL, true);
                        customEvent.dataUser = this.dataUser;
                        customEvent.isChatDirect = true;
                        this.node.dispatchEvent(customEvent);
                    }
                }
            } else {
                cc.log("Button's not founded, please check again this condition ...", event);
            }
        }
    }
    // update (dt) {},
});