var Linker = require('Linker');
var Utils = require('Utils');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
var BiDaConstant = require('BiDaConstant');
var NewAudioManager = require('NewAudioManager');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,
    properties: {
        tabListFriends: cc.Node,
        scrollViewTabListFriend: cc.ScrollView,
        contentTabListFriends: cc.Node,

        tabAddFriends: cc.Node,
        scrollViewTabAddFriends: cc.ScrollView,
        contentTabAddFriends: cc.Node,
        //
        tabSendFriends: cc.Node,
        contentTabSendFriends: cc.Node,
        btnSendFriendNode: cc.Node,
        btnCloseSendFramePopupNode: cc.Node,
        containerTabSendFriends: cc.Node,
        txtNumSendFriendZone: cc.Label,

        itemFriendPrefab: cc.Prefab,
        btnCloseListFriendPopupNode: cc.Node,
        btnCloseAddFramePopupNode: cc.Node,
        btnAddFriendNode: cc.Node,
        btnRemoveFriendNode: cc.Node,

        //
        btnFindFriendNode: cc.Node,
        nameSearchingNode: cc.Node,
        //
        FriendLoadingPrefab: cc.Prefab,
        containerTabListFriends: cc.Node,
        containerTabAddFriends: cc.Node,
        pageIndexListFriend: cc.Node,
        pageIndexListUserFindFriend: cc.Node,
        pageIndexPrefab: cc.Prefab,
        pageIndexListSendFriend: cc.Node,
        friendContainer: cc.Node

    },
    onLoad() {
        this.resetFriendZone();
        this.nameSearchingNode.on("editing-did-began", this.onEditBoxEditingBegan, this);
        this.nameSearchingNode.on("editing-did-ended", this.onEditBoxEditingEnded, this);
        this.nameSearchingNode.on("text-changed", this.onEditBoxTextChanged, this);
        //active main list friend
        this.tabListFriends.active = true;
        //add page index container
        this.pageIndexListFriend.removeAllChildren(true);
        this.pageIndexListUserFindFriend.removeAllChildren(true);
        this.addPageIndexContainer(
            [
                {
                    parent: this.pageIndexListFriend,
                    page: this.CurrentPageListFriend,
                    name: "PageIndexFriendList"
                },
                {
                    parent: this.pageIndexListUserFindFriend,
                    page: this.CurrentPageAddFriend,
                    name: "PageIndexUserList"
                },
                {
                    parent: this.pageIndexListSendFriend,
                    page: this.CurrentPageSendFriend,
                    name: "PageIndexSendList"
                }
            ]
        )
        //add event listener
        this.addSocketEvent();
    },
    addPageIndexContainer: function (arr) {
        for (let i = 0; i < arr.length; i++) {
            var p = cc.instantiate(this.pageIndexPrefab);
            arr[i].parent.addChild(p);
            var pcpn = p.getComponent("pageIndex");
            if (pcpn) {
                var data = {
                    page: arr[i].page,
                    name: arr[i].name,
                    componentContain: this
                }
                pcpn.init(data);
            }
        }
    },
    resetFriendZone: function () {
        this.tabListFriends.active = false;
        this.tabAddFriends.active = false;
        this.tabSendFriends.active = false;
        this.contentTabAddFriends.removeAllChildren(true);
        this.contentTabListFriends.removeAllChildren(true);
        this.contentTabSendFriends.removeAllChildren(true);
        //current page
        this.CurrentPageListFriend = 1;
        this.CurrentPageAddFriend = 1;
        this.CurrentPageSendFriend = 1;
        this.onActiveFindFriend();
        //edit box
        this.nameSearchingNode.getComponent(cc.EditBox).string = "";
        this.setPageIndex(this.pageIndexListUserFindFriend, "PageIndexUserList", this.CurrentPageAddFriend, null);
        this.setPageIndex(this.pageIndexListSendFriend, "PageIndexSendList", this.CurrentPageSendFriend, null);
    },
    onEditBoxEditingBegan: function (editbox) {
        cc.log("Began");
    },
    onEditBoxEditingEnded: function (editbox) {
        cc.log("Ended, Mouse or Touch Moved Out Of Edit Box ...");
    },
    onEditBoxTextChanged: function (editbox) {
        var s = this.removeWhiteSpace(editbox.string);
        editbox.string = s;
        editbox.textLabel.string = s;
        editbox.focus(true);
        if (s.length >= 3 && s.length % 3 == 0) {
            if (this._isValidToFindMoreFriend == true) {
                this._isValidToFindMoreFriend = false;
                //sau 10s neu data khong tra ve thi se tu dong reset cho tim du lieu tiep theo
                this.scheduleOnce(this.onActiveFindFriend, 10)
                //tu dong tim kiem
                this.onFindFriendClick(event);
            } else {
                cc.log("chua the tim kiem ngay luc nay")
            }
        }
    },
    onActiveFindFriend: function () {
        this._isValidToFindMoreFriend = true;
    },
    requesInitListFriend: function () {
        this.tabListFriends.active = true;
        this.CurrentPageListFriend = 1;
        this.setPageIndex(this.pageIndexListFriend, "PageIndexFriendList", this.CurrentPageListFriend);
        this.requestListFriendByPage(this.CurrentPageListFriend);
        this.requestInitSendFriend();
    },
    requestInitSendFriend: function () {
        this.CurrentPageSendFriend = 1;
        this.setPageIndex(this.pageIndexListSendFriend, "PageIndexSendList", this.CurrentPageSendFriend);
        this.requestSendFriendByPage(this.CurrentPageSendFriend);
    },
    requestListFriendByPage: function (page) {
        //yeu cau danh sach nhung nguoi da la ban roi
        var send = CommonSend.getFriendList(page, Constant.FRIEND_ZONE.GET_TAT_CA_NGUOI_CHOI_LA_BAN_BE_KET_CA_LOI_MOI);
        if (send) {
            // var FriendLoadingNode = cc.instantiate(this.FriendLoadingPrefab);
            // this.containerTabListFriends.addChild(FriendLoadingNode);
            cc.Global.showLoading();
            Linker.Socket.send(send);
        }
    },
    requestSendFriendByPage: function (page) {
        var send = CommonSend.getFriendSend(page);
        // var send = CommonSend.getFriendList(page, Constant.FRIEND_ZONE.GET_TAT_CA_LOI_MOI_KET_BAN);
        if (send) {
            // var FriendLoadingNode = cc.instantiate(this.FriendLoadingPrefab);
            // this.containerTabListFriends.addChild(FriendLoadingNode);
            cc.Global.showLoading();
            Linker.Socket.send(send);
        }
    },
    removeWhiteSpace: function (string) {
        return string.replace(/\s/g, '');
    },
    onGetFriendList: function (message) {
        cc.log(message);
        cc.Global.hideLoading();
        if (this && this.isValid) {
            this.removeLoadingInThisTab(this.containerTabListFriends);
            this.contentTabListFriends.removeAllChildren(true);
            if (message.status == 1 && message.listFriends && message.listFriends.length > 0) {
                // Add label "No friends found"
                this.scrollViewTabListFriend.active = true;
                this.pageIndexListFriend.active = true;
                this.containerTabListFriends.getChildByName("noFriendLabel").active = false;

                message.listFriends = this.resortUserType(message.listFriends, message);
                //hiển thị tất cả bạn bè bạn có
                var childrenListFriend = [];
                cc.log(message.listFriends);
                childrenListFriend = this.createListChildNodeByPrefab(message.listFriends.length, this.itemFriendPrefab);
                for (let i = 0; i < childrenListFriend.length; i++) {
                    var itemFriendJS = childrenListFriend[i].getComponent("itemFriend");
                    if (itemFriendJS) {
                        itemFriendJS.init(message.listFriends[i]);
                    }
                }
                this.addContentToNode(this.contentTabListFriends, childrenListFriend);

            } else if (!!message.data) {
                cc.Global.showMessage(message.data);
            }
            else {
                // Add label "No friends found"
                cc.log("Không có bạn bè nào");
                this.scrollViewTabListFriend.active = false;
                // this.pageIndexListFriend.active = false;
                this.containerTabListFriends.getChildByName("noFriendLabel").active = true;
            }
        }
    },
    resortUserType: function (listUsers, message) {
        var myFriend = [];
        var myRequest = [];
        var otherRequest = [];
        for (let i = 0; i < listUsers.length; i++) {
            if (Number(listUsers[i].utype) == 1 || (message && message.isGetFriends)) {
                myFriend.push(listUsers[i]);
            } else if (Number(listUsers[i].utype) == 2) {
                myRequest.push(listUsers[i]);
            } else {
                otherRequest.push(listUsers[i])
            }
        }
        return Utils.Malicious.flattern([myFriend, myRequest, otherRequest]);
    },
    onGetUserFinding: function (message) {
        if (this && this.isValid) {
            cc.Global.hideLoading();
            this.removeLoadingInThisTab(this.containerTabAddFriends);
            if (message.status == 1) {
                this.unschedule(this.onActiveFindFriend);
                this.onActiveFindFriend();
                this.contentTabAddFriends.removeAllChildren(true);
                //hiển thị tất cả bạn bè bạn có
                var childrenListFriend = [];
                childrenListFriend = this.createListChildNodeByPrefab(message.listUsers.length, this.itemFriendPrefab);
                for (let i = 0; i < childrenListFriend.length; i++) {
                    var itemFriendJS = childrenListFriend[i].getComponent("itemFriend");
                    if (itemFriendJS) {
                        itemFriendJS.init(message.listUsers[i]);
                    }
                }
                this.addContentToNode(this.contentTabAddFriends, childrenListFriend);
            } else {
                cc.log("Không thể get danh sách bạn bè của bạn")
            }
        }

    },
    onGetSendFriend: function (message) {
        if (this && this.isValid) {
            cc.Global.hideLoading();
            this.removeLoadingInThisTab(this.containerTabSendFriends);
            if (message.status == 1) {
                this.contentTabSendFriends.removeAllChildren(true);

                message.listSendFriends.length > 0
                    ? this.txtNumSendFriendZone.string = message.listSendFriends.length
                    : this.txtNumSendFriendZone.string = "";

                var childrenListSendFriend = [];
                if (message.listSendFriends) {
                    childrenListSendFriend = this.createListChildNodeByPrefab(message.listSendFriends.length, this.itemFriendPrefab);
                }
                for (let i = 0; i < childrenListSendFriend.length; i++) {
                    var itemFriendJS = childrenListSendFriend[i].getComponent("itemFriend");
                    if (itemFriendJS) {
                        itemFriendJS.init(message.listSendFriends[i]);
                    }
                }
                this.addContentToNode(this.contentTabSendFriends, childrenListSendFriend);
            } else {
                cc.log("Không thể get danh sách ");
            }
        }
    },
    removeLoadingInThisTab: function (tabcontent) {
        for (let i = 0; i < tabcontent.children.length; i++) {
            var c = tabcontent.children[i];
            var cjs = c.getComponent("FriendLoading");
            if (c.name == "FriendLoading" && cjs) {
                if (cjs && cjs.isValid) {
                    cjs.removeFromContent();
                } else {
                    c.destroy();
                }
            }
        }
    },
    onAddFriend: function (message) {
        if (this && this.isValid) {
            var mess = message.data;
            cc.Global.showMessage(mess);
            if (Number(message.status) == 1) {
                //truong hop gui ket ban thanh cong
                cc.log(message.data);
            } else {
                //truong hop da gui ket ban roi
                cc.log(message.data);
            }
        }

    },
    onReplyInviteFriend: function (message) {
        if (this && this.isValid) {
            cc.log(message);
            if (!!message.data && message.data != "-1") cc.Global.showMessage(message.data);
            //update lai ban be
            this.requestListFriendByPage(this.CurrentPageListFriend);
            //update lai loi moi
            this.requestSendFriendByPage(this.CurrentPageSendFriend);
        }

    },

    addSocketEvent() {
        Linker.Event.addEventListener(1203, this.onGetFriendList, this);
        Linker.Event.addEventListener(1204, this.onAddFriend, this);
        Linker.Event.addEventListener(8, this.onGetUserFinding, this);
        Linker.Event.addEventListener(7010, this.onReplyInviteFriend, this);
        Linker.Event.addEventListener(7051, this.onGetSendFriend, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(1203, this.onGetFriendList, this);
        Linker.Event.removeEventListener(1204, this.onAddFriend, this);
        Linker.Event.removeEventListener(8, this.onGetUserFinding, this);
        Linker.Event.removeEventListener(7010, this.onReplyInviteFriend, this);
        Linker.Event.removeEventListener(7051, this.onGetSendFriend, this);
    },
    onCloseNode: function () {
        var customEvent = new cc.Event.EventCustom(Constant.POPUP_EVENT.FRIEND_ZONE.CLOSED, true);
        this.node.dispatchEvent(customEvent);
        this.onBtnCloseClick();
    },
    onButtonClick: function (event) {
        if (event) {
            if (event.currentTarget == this.btnCloseListFriendPopupNode) {
                this.onCloseNode();
                this.resetFriendZone();
                cc.log("FZ: BTN CLOSE MAIN POPUP ...");
            } else if (event.currentTarget == this.btnCloseAddFramePopupNode) {
                NewAudioManager.playClick();
                this.tabAddFriends.active = false;
                cc.log("FZ: BTN ADD FRIEND POPUP ...");
            } else if (event.currentTarget == this.btnAddFriendNode) {
                NewAudioManager.playClick();
                this.tabAddFriends.active = true;
                if (this.tabSendFriends.active) this.tabSendFriends.active = false;
                cc.log("FZ: BTN ADD FRIEND POPUP ...");
            } else if (event.currentTarget == this.btnFindFriendNode) {
                NewAudioManager.playClick();
                this.onFindFriendClick(event);
                cc.log("FZ: BTN ADD FRIEND POPUP ...");
            } else if (event.currentTarget == this.btnSendFriendNode) {
                NewAudioManager.playClick();
                this.tabSendFriends.active = true;
                if (this.tabAddFriends.active) this.tabAddFriends.active = false;
                this.requestInitSendFriend();
            } else if (event.currentTarget == this.btnCloseSendFramePopupNode) {
                NewAudioManager.playClick();
                this.tabSendFriends.active = false;
            } else {
                NewAudioManager.playClick();
                cc.log("Button's not founded, please check again this condition ...", event);
            }
        }
    },
    onFindFriendClick: function (event) {
        var nameEditBox = this.nameSearchingNode.getComponent(cc.EditBox);
        if (nameEditBox) {
            var name = nameEditBox.string;
            if (name.length >= 1) {
                //tu dong tim kiem
                if (this.checkNameValid(name)) {
                    this.CurrentPageAddFriend = 1;
                    this.setPageIndex(this.pageIndexListUserFindFriend, "PageIndexUserList", this.CurrentPageAddFriend, name);
                    this.findFriendByNameAndPage(name, this.CurrentPageAddFriend);
                }
            }
        }
    },
    findFriendByNameAndPage: function (name, page) {
        var send = CommonSend.findAFriendByName(name, page);
        if (send) {
            if (!this.containerTabAddFriends.getChildByName("FriendLoading")) {
                // var FriendLoadingNode = cc.instantiate(this.FriendLoadingPrefab);
                // this.containerTabListFriends.addChild(FriendLoadingNode);
                cc.Global.showLoading();
            }
            Linker.Socket.send(send);
        }
    },
    setPageIndex: function (pageContainer, name, page, nameUserFinding) {
        var pageIndex = pageContainer.getChildByName(name);
        if (pageIndex) {
            var pageIndexComponent = pageIndex.getComponent("pageIndex");
            if (pageIndexComponent) {
                pageIndexComponent.setPage(page);
                pageIndexComponent.setUserFinding(nameUserFinding);
            }
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
    onEnable: function () {
        this.node.opacity = 255;
    },
    onDestroy: function () {
        this.removeSocketEvent();
    },
    onBtnCloseClick: function () {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        customEvent.toggle = this.node.getComponent(cc.Toggle);
        this.node.dispatchEvent(customEvent);
        //setting info
    }
    // update (dt) {},
});
