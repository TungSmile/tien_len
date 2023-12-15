var TQUtil = require('TQUtil');
var Constant = require('Constant');
var Global = require('Global');
var AudioManager = require('AudioManager');
var XocDiaSend = require('XocDiaSend');
var PopupFactory = require('PopupFactory');
var Linker = require('Linker')
var pPosChair = [0, 4, 6, 2, 7, 5, 3, 1, 8];
var Utils = require('Utils');
var NodePoolManager = require('NodePoolManager');
var SceneManager = require('SceneManager');
const location9P = [
    cc.v2(-287, -260),
    cc.v2(-500, -160), cc.v2(-500, 5),
    cc.v2(-500, 185), cc.v2(-225, 265), cc.v2(225, 265),
    cc.v2(500, 5), cc.v2(500, -160)
];

const locationOther = cc.v2(500, 185);

const SCALE_BTN = 1.3;
const maxPlayer = 8;

const STATE = {
    EndRound: 5, //thong bao startgame
    StartBet: 1,//30s
    CanTien: 2, //5s
    PrepareStart: 6,//5s
    TraTien: 3, //5s
    WaitReset: 4,
    BanCua: 7,
    MuaCua: 8,
};

const TYPE_BET = {
    LE: 0, //lẻ
    CHAN: 1, //chẳn
    WHITE4: 2,//4 trắng
    BLACK4: 3,//4 den
    WHITE3BLACK1: 4,// 3 trắng 1 đen
    BLACK3WHITE1: 5,// 3 đen 1 trắng
};

cc.Class({
    extends: cc.Component,

    properties: {
        AvatarPrefab: cc.Prefab,
        userList: cc.Node,
        chatToast: cc.Prefab,

        pnPlayers: cc.Node,
        pnBottomRight: cc.Node,
        pnContent: cc.Node,
        pnMoney: cc.Node,
        pnHistory: cc.Node,
        btnLamCai: cc.Node,
        pnNghiCai: cc.Node,
        pnTimer: cc.Node,
        pnBatUp: cc.Node,
        buttonTemp: cc.Node,
        otherUser: cc.Node,
        popupSetting: cc.Node,
        iconCai: cc.Node,
        pnDia: cc.Node,
        pnDiaAnim: cc.Node,

        txtMoneyCuoc: cc.Label,
        txtTableNo: cc.Label,
        txtNoOtherUsers: cc.Label,

        pnChat: cc.Node,
        srcChat: cc.ScrollView,
        edbChat: cc.EditBox,

        txtTimer: cc.Label,
        arrBtnBet: {
            type: cc.Node,
            default: []
        },

        arrLightContain: {
            type: cc.Node,
            default: []
        },

        arrBetContain: {
            type: cc.Node,
            default: []
        },

        arrBtnBan: {
            type: cc.Node,
            default: []
        },

        arrBtnMua: {
            type: cc.Node,
            default: []
        },

        arrSprite: {
            type: cc.Sprite,
            default: []
        },

        spriteFrame: {
            type: cc.SpriteFrame,
            default: []
        },
        userDialogId:cc.Label,
        userDialogName: cc.Label,
        userDialogMoney: cc.Label,
        userDialogAvatar: cc.Sprite,
        userListAvatar:{
            type: cc.SpriteFrame,
            default:[]
        },
        kLoadingDialog: cc.Prefab
    },

    onLoad() {
        var that=this;
        cc.find('Canvas').on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            Linker.lastTimeManipulation=new Date().getTime();
        }, that.node);
        if(this.kLoadingDialog) {
            this.kLoading = cc.instantiate(this.kLoadingDialog);
            if(cc.find('Canvas')){
                cc.find('Canvas').addChild(this.kLoading);
                cc.find('Canvas/Loading').active = false;
            }
        }
        //AudioManager.playEffect(AudioManager.sound.inroom);
        // SceneManager.preloadScene('LobbyScene');
        Linker.redirectOnReconnect = '';
        Global.chatToast = this.chatToast;
        Linker.isLoadXocDia = false;
        Linker.XocDiaScene = this;
        // var node = cc.instantiate(this.UserListPrefab);
        // var canvas=cc.find('Canvas');
        // canvas.addChild(node);
        // node.parent = this.popupNode;
        // this.userListComp = node.getComponent(cc.Component);


        this.pnItemMsg = this.srcChat.content.getChildByName("txt_msg");
        this.srcChat.content.removeAllChildren();

        this.ownerId = 0;
        this.isXinThoi = false;
        this.isCanBet = false;
        this.history = [];
        this.allUsers = [];
        this.otherUsers = [];
        this.listAvaComp = [];

        this.initDefaultPosition();
        this.registerNotifications();
        this.resetTable();
        //kyun: Fix loi Add Child 22/6/2019
        NodePoolManager.MiniGame.getNodePool();
        // NodePoolManager.TopHu.getNodePool();
        // if(cc.find('Canvas/TopHu')){
        //     cc.find('Canvas/TopHu').getChildByName('Container').active=false;
        // }
        if (Linker.CURRENT_TABLE) {
            cc.log(Linker.CURRENT_TABLE);
            if (Linker.CURRENT_TABLE.isCreate) {
                this.onNewTable(Linker.CURRENT_TABLE);
            } else {
                if (Linker.CURRENT_TABLE.isJoin) {
                    this.onJoinTable(Linker.CURRENT_TABLE);
                }
            } //:__: for reconnect with function onReconnect edited at 2019-07-03 09:37
            if(Linker.CURRENT_TABLE.isReconnect) { //:__: Ham onRecconect bi loi, dung tam ham onJoinTable edited at 2019-07-03 09:37
                this.onJoinTable(Linker.CURRENT_TABLE);
            }
        }
    },
    start() {

    },

    registerNotifications: function () {
        Linker.Event.addEventListener(Constant.CMD.ONCHANGE_AVATAR, this.onChangeAvatar, this);
        Linker.Event.addEventListener(Constant.CMD.CHAT, this.onChat, this);
        Linker.Event.addEventListener(Constant.CMD.XOCDIA_BANCUA, this.onBanCuaRes, this);
        Linker.Event.addEventListener(Constant.CMD.XOCDIA_MUACUA, this.onMuaCuaRes, this);
        Linker.Event.addEventListener(Constant.CMD.XOCDIA_REQUEST_OWNER, this.onLamCai, this);
        Linker.Event.addEventListener(Constant.CMD.MATCH_CANCEL, this.onUserLeave, this);
        Linker.Event.addEventListener(Constant.CMD.RECONNECTION, this.onReconnect, this);
        Linker.Event.addEventListener(Constant.CMD.MATCH_NEW, this.onNewTable, this);
        Linker.Event.addEventListener(Constant.CMD.MATCH_JOIN, this.onJoinTable, this);
        Linker.Event.addEventListener(Constant.CMD.MATCH_JOINED, this.onJoinedTable, this);
        Linker.Event.addEventListener(Constant.CMD.FINISH_PUT_MONEY, this.onPushMoney, this);
        Linker.Event.addEventListener(Constant.CMD.MATCH_START, this.onStartGame, this);
        Linker.Event.addEventListener(Constant.CMD.MATCH_END, this.onEndGame, this);
        Linker.Event.addEventListener(Constant.CMD.XOCDIA_BET, this.onMyBet, this);
        Linker.Event.addEventListener(Constant.CMD.XOCDIA_CANCUA, this.onCanCua, this);
        Linker.Event.addEventListener(Constant.CMD.XOCDIA_HISTORY, this.onHistory, this);
        Linker.Event.addEventListener(Constant.CMD.UPDATE_CASH_AFTER_CHARGED, this.onUpdateUser, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.backHandlerBtn, this);
    },
    showMessage(data){
        cc.Global.showMessage(data);
    },
    onSetCuoc(min) {
        if (min == this.currMin) return;

        this.currMin = min;
        this.arrMoney = [
            min, min * 5, min * 10, min * 20, min * 50
        ];

        var index, len;
        for (index = 0, len = this.arrBtnBet.length; index < len; ++index) {
            var money = this.arrMoney[index];
            var btn = this.arrBtnBet[index];
            btn.scale = 1;

            var label = btn.getComponentInChildren(cc.Label);
            label.string = Utils.Number.format(money);

            btn.off(cc.Node.EventType.TOUCH_END);
            btn.on(cc.Node.EventType.TOUCH_END, this.onBetClick.bind(this, btn, money));
        }

        this.moneyBet = this.arrMoney[0];
        this.arrBtnBet[0].scale = SCALE_BTN;
    },

    onChangeAvatar(name) {
        var avaComp = this.findAvaCompByUID(Linker.userData.userId);
        if (avaComp) {
            avaComp.updateAva(name);
        }
    },
    
    onGiftCode(data) {
        this.showMessage(data.content);
    },

    onBtnShowListUser() {
        // if (this.userList.active){
        //     this.userList.active = false;
        // }
        // else {
        //     this.userList.active = true;
        // }
        var userList = cc.find('Canvas/pn_main/UserList');
        userList.active = true;
        var userListComponent = userList.getComponent('UserList');
        userListComponent.showView(this.otherUsers);
    },

    onUpdateUser(data) {
        if (!data || data.error) {
            return;
        }

        var avaComp = this.findAvaCompByUID(data.id);
        if (avaComp) {
            avaComp.animMoneyChange(data.money);
        }
    },

    onChat(data) {
        if (data.error) {
            cc.log(data.error);
            return;
        }

        var item = cc.instantiate(this.pnItemMsg);
        item.parent = this.srcChat.content;

        var txtMsg = item.getComponent(cc.RichText);
        if (data.id == Linker.userData.userId) {
            txtMsg.string = "<color=#20FFE4>" + data.username + ": </c>" + data.message;
        }
        else {
            txtMsg.string = "<color=#61D9CT>" + data.username + ": </c>" + data.message;
        }

        this.srcChat.stopAutoScroll();
        this.srcChat.scrollToBottom(0.0, false);

        var avaComp = this.findAvaCompByUID(data.id);
        if (avaComp) {
            avaComp.onChatMessage(data.message);
        }
    },

    onMuaCuaRes(data) {
        if (data.error) {
            this.showMessage(data.error);
            return;
        }

        this.arrBtnMua[data.betside].active = false;
    },

    onBanCuaRes(data) {
        if (!data) return;
        if (data.error) {
            this.showMessage(data.error);
            return;
        }

        this.arrBtnBan[data.betside].active = false;

        if (this.ownerId !== Linker.userData.userId) {
            this.arrBtnMua[data.betside].active = true;
        }
    },

    onHistory(data) {
        
        if(data !== undefined){
            if (data.error) {
                cc.log(data.error);
                return;
            }
    
            this.drawHistory(data.history);
        }
    },

    drawHistory(arr) {
        cc.log("History:",arr);
        if (arr.length > 36) {
            arr = arr.slice(arr.length - 36, arr.length);
        }

        this.history = arr;

        var diffX = 24;
        var diffY = 25;

        this.pnHistory.removeAllChildren(true);

        for (var i = 0; i < this.history.length; i++) {
            var isChan = this.history[i];
            var buttonChild = cc.instantiate(this.buttonTemp);
            buttonChild.active = true;
            buttonChild.parent = this.pnHistory;

            var x = Math.floor(i / 4);
            var y = i % 4;

            buttonChild.position = cc.v2(x * diffX, y * diffY * -1);

            var sprite = buttonChild.getComponent(cc.Sprite);
            sprite.spriteFrame = this.spriteFrame[isChan ? 1 : 0];
        }
    },

    onLamCai(data) {
        cc.log('onLamCaiCall:',data);
        if (data.error) {
            this.showMessage(data.error);
            return;
        }

        this.btnLamCai.active = false;
        this.pnNghiCai.active = false;

        if (data.isOwner) {
             this.ownerId = data.ownerId;
        }
        else {
            this.ownerId = 0;
        }

        if (data.ownerId == Number(Linker.userData.userId)) {
            if (data.isOwner) {
                this.pnNghiCai.active = true;
            }
            else {
                this.btnLamCai.active = true;
                this.pnNghiCai.active = false;
            }
        }

        this.showMessage(data.msg);
    },

    onUserLeave(data) {
        if (data.error) {
            this.showMessage(data.error);
            return;
        }

        if (data.cancelStatus == 0) {
            this.onLeaveTable(data.id);
        }

        // if (data.cancelStatus == 1) {
        //     this.showMessage('Bạn đã đăng ký chuyển bàn!!!')
        // }
        // else if (data.cancelStatus == 2) {
        //     this.showMessage('Bạn đã huỷ đăng ký chuyển bàn!!!')
        // }
    },

    onReconnect(data) {
        if (data.error) {
            this.showMessage(data.error);
            return;
        }

        cc.log("onReconnect: ", data);
        this.data = data;
        this.ownerId = data.ownerId;
        this.allUsers = data.listUsers;

        this.xoayViTri();
        this.runTimerCount(data.remainTime);
        this.subMoneyChageAll(this.allUsers);
        this.setIconLamCai();

        this.fillDataBetTotal(this.arrBetContain[TYPE_BET.LE], data.totalLe);
        this.fillDataBetTotal(this.arrBetContain[TYPE_BET.CHAN], data.totalChan);
        this.fillDataBetTotal(this.arrBetContain[TYPE_BET.WHITE4], data.white4);
        this.fillDataBetTotal(this.arrBetContain[TYPE_BET.BLACK4], data.black4);
        this.fillDataBetTotal(this.arrBetContain[TYPE_BET.WHITE3BLACK1], data.white3black1);
        this.fillDataBetTotal(this.arrBetContain[TYPE_BET.BLACK3WHITE1], data.black3white1);
    },

    onLeaveTable(idLeave) {
        if (idLeave == Linker.userData.userId) {
            this.backToLobby();
        }
        else {
            this.allUsers = this.allUsers.filter(function (obj) {
                return obj.id !== idLeave;
            });

            var avaComp = this.findAvaCompByUID(idLeave);
            if (avaComp) {
                avaComp.reset();
            }

            this.xoayViTri();
        }
    },

    //đang chơi 1 thằng khác join vào
    onJoinedTable(data) {
        if (data.error) {
            this.showMessage(data.error);
            return;
        }

        this.allUsers = this.allUsers.concat(data.listUsers);
        cc.log("onJoinedTable: ", this.allUsers);
        this.xoayViTri();
    },

    onNewTable(data) {
        if (data.error) {
            cc.log(data.error);
            return;
        }
        cc.log("onNewTable: ", data);
        this.data = data;
        this.allUsers = data.listUsers;
        this.xoayViTri();
    },

    xoayViTri: function () {
        this.onSetCuoc(this.data.minMoney);
        this.txtMoneyCuoc.string = TQUtil.addDot(this.data.minMoney);
        this.txtTableNo.string = this.data.tableId;

        for (var i = 0; i < maxPlayer; i++) {
            var avaComp = this.listAvaComp[i];
            avaComp.reset();
        }

        this.moveToFront();

        if (this.allUsers.length > maxPlayer) {
            this.listUsers = this.allUsers.slice(0, maxPlayer);
            this.otherUsers = this.allUsers.slice(maxPlayer);
        }
        else {
            this.listUsers = this.allUsers;
        }

        if (this.otherUsers.length > 0) {
            this.txtNoOtherUsers.node.active = true;
            this.txtNoOtherUsers.string = '(' + this.otherUsers.length + ')';
        }
        else {
            this.txtNoOtherUsers.node.active = false;
        }

        var isChauRia = true;
        //tim index cua toi
        var playerSize = this.listUsers.length;
        for (var i = 0; i < playerSize; i++) {
            var playerData = this.listUsers[i];
            playerData.index = i;
            if (playerData.id == Linker.userData.userId) {
                isChauRia = false;
                this.myIndex = i;
            }
        }

        //xoay vi tri
        for (var i = 0; i < playerSize; i++) {
            var player = this.listUsers[i];
            if (player != null ) {
                var pos = this.getPosByIndex(player.index);
                player.pos = pos;

                this.initPosition(pos, player);
                cc.log("index player: %s, pos: %s", player.index, pos);
            }
        }
        return isChauRia;
    },

    moveToFront() {
        for (var i = 0; i < this.allUsers.length; i++) {
            if (Number(this.allUsers[i].id) == Number(Linker.userData.userId)) {
                this.allUsers = this.allUsers.splice(i, 1).concat(this.allUsers);
                break;
            }
        }
    },

    getPosByIndex: function (index) {
        var pos;
        var playersSize = this.listUsers.length;
        if( this.myIndex == index) {
            return 0;
        }
        if (this.myIndex == -1) {
            return -1;
        }
        else {
            pos = (index + playersSize - this.myIndex) % playersSize;
            // pos = pPosChair[playersSize - 1][pos];
            pos = pPosChair[pos];
        }

        return pos;
    },

    onJoinTable(data, cmd) {
        cc.log("onJoinTable: ", data);
        if (data.error) {
            //this.backToLobby(callFunc.bind(this, cmd, data));
            return;
        }

        XocDiaSend.sendNgoiTable(data.tableId);

        this.data = data;
        this.allUsers = data.listUsers;
        this.xoayViTri();
    },

    fillDataBetTotal(node, money) {
        var total = node.getChildByName("total").getComponent(cc.Label);

        if (money == 0) {
            return;
        }
        else if (money < 0) {
            total.node.active = false;
        }
        else {
            total.node.active = true;
        }

        total.string = TQUtil.addDot(money);
    },

    fillDataMyBet(node, money) {
        var total = node.getChildByName("my").getComponent(cc.Label);
        total.string = TQUtil.addDot(money);

        if (money <= 0) {
            total.node.active = false;
        }
        else {
            total.node.active = true;
        }
    },

    resetTable() {
        this.isPlaying = false;
        this.pnDia.active = true;
        this.pnDiaAnim.active = false;
        this.pnBatUp.stopAllActions();
        this.pnBatUp.runAction(cc.moveTo(0.5, cc.v2(0, 0)));
        this.pnMoney.removeAllChildren(true);
        if (this.ownerId == Linker.userData.userId) this.isPlaying = true;
        cc.log('reset----------------');
        for (var i = 0; i < 6; i++) {
            this.fillDataBetTotal(this.arrBetContain[i], -1);
            this.fillDataMyBet(this.arrBetContain[i], 0);
            this.showAnimWin(this.arrBetContain[i], true);
        }

        for (var i = 0; i < this.arrLightContain.length; i++) {
            this.arrLightContain[i].active = false;
        }

        for (var i = 0; i < this.arrBtnBan.length; i++) {
            this.arrBtnBan[i].active = false;
        }

        for (var i = 0; i < this.arrBtnMua.length; i++) {
            this.arrBtnMua[i].active = false;
        }
    },

onPushMoney(data) {
        if (data.error) {
            cc.log(data.error);
            return;
        }

        this.subMoneyChageAll(data.listUsers);
        this.totalLe = data.totalLe;
        this.totalChan = data.totalChan;
        cc.log('onPushMoney:',data);
        cc.log('onpush: ', data.totalLe)
        this.fillDataBetTotal(this.arrBetContain[TYPE_BET.LE], data.totalLe);
        this.fillDataBetTotal(this.arrBetContain[TYPE_BET.CHAN], data.totalChan);
        this.fillDataBetTotal(this.arrBetContain[TYPE_BET.WHITE4], data.white4);
        this.fillDataBetTotal(this.arrBetContain[TYPE_BET.BLACK4], data.black4);
        this.fillDataBetTotal(this.arrBetContain[TYPE_BET.WHITE3BLACK1], data.white3black1);
        this.fillDataBetTotal(this.arrBetContain[TYPE_BET.BLACK3WHITE1], data.black3white1);

        switch (data.state) {
            case STATE.EndRound:
                this.onEndRound(data);
                cc.log(data.state);
                break;
            case STATE.PrepareStart:
                this.onPrepareStart(data);
                cc.log(data.state);
                break;
            case STATE.StartBet:
                this.onStartBet(data);
                break;
            case STATE.WaitReset:
                cc.log(data.state);
                this.onWaitReset(data);
                break;
            case STATE.CanTien:
                cc.log(data.state);
                this.onCanTien(data);
                break;
            case STATE.BanCua:
                cc.log(data.state);
                this.onBanCua(data);
                break;
            case STATE.MuaCua:
                cc.log(data.state);
                this.onMuaCua(data);
                break;
            case STATE.TraTien:
                cc.log(data.state);
                this.onTraTien(data);
                break;
            default:
                break;
        }

        this.lastUsers = data.listUsers;
    },

    subMoneyChageAll(listUsers) {
        for (var i = 0; i < listUsers.length; i++) {
            var user = listUsers[i];
            var userOld = {};

            if (this.lastUsers == undefined || this.lastUsers[i] == undefined) {
                userOld = {};
            } else {
                userOld = this.lastUsers[i];
            }

            this.animCoinMove(TYPE_BET.LE, user.totalLe - userOld.totalLe, user.id);
            this.animCoinMove(TYPE_BET.CHAN, user.totalChan - userOld.totalChan, user.id);
            this.animCoinMove(TYPE_BET.WHITE4, user.white4 - userOld.white4, user.id);
            this.animCoinMove(TYPE_BET.BLACK4, user.black4 - userOld.black4, user.id);
            this.animCoinMove(TYPE_BET.WHITE3BLACK1, user.white3black1 - userOld.white3black1, user.id);
            this.animCoinMove(TYPE_BET.BLACK3WHITE1, user.black3white1 - userOld.black3white1, user.id);
        }
    },

    animCoinMove(type, moneyChage, idUser) {
        if (moneyChage <= 0 || isNaN(moneyChage)) return;
        var avaComp = this.findAvaCompByUID(idUser);
        if (avaComp) {
            avaComp.setMoneyChange(moneyChage * -1);
        }

        var parent = this.arrBetContain[type];
        var index = this.arrMoney.indexOf(moneyChage);
        if (index < 0) {
            index = 0
        }

        var btn = this.arrBtnBet[index];
        var node = cc.instantiate(btn);
        node.removeAllChildren();
        node.off(cc.Node.EventType.TOUCH_END);

        var size = parent.getContentSize();
        var x = Math.floor(Math.random() * (size.width - 30)) - size.width / 2 + 15;
        var y = Math.floor(Math.random() * (size.height - 30)) - size.height / 2 + 15;

        var size = cc.winSize;
        var vec = parent.convertToWorldSpaceAR(cc.v2(x, y));
        vec = vec.sub(cc.v2(size.width / 2, size.height / 2));

        node.scale = 0.3;
        node.parent = this.pnMoney;

        //find position of avatar
        var avaComp = this.findAvaCompByUID(idUser);
        var position = locationOther;
        var moveObj = this.otherUser;

        if (avaComp) {
            position = location9P[avaComp.pos];
            moveObj = avaComp.node;
        }

        var pos = cc.v2((vec.x - position.x) / 15, (vec.y - position.y) / 15);

        moveObj.position = position;
        moveObj.stopAllActions();
        moveObj.runAction(cc.sequence(cc.moveBy(0.1, pos), cc.moveTo(0.1, position)));

        node.position = position;
        node.runAction(cc.moveTo(0.4, vec));
    },

    onWaitReset(data) {
        cc.log("onWaitReset");
    },

    onCanTien(data) {
        this.isCanBet = false;
        this.hiddenTimer();

        cc.log("onCanTien");

        for (var i = 0; i < this.arrBtnBan.length; i++) {
            this.arrBtnBan[i].active = false;
        }

        for (var i = 0; i < this.arrBtnMua.length; i++) {
            this.arrBtnMua[i].active = false;
        }
    },

    onTraTien(data) {
        cc.log("onTraTien");
    },

    onMuaCua(data) {
        cc.log("onMuaCua");

        for (var i = 0; i < this.arrBtnMua.length; i++) {
            this.arrBtnMua[i].active = true;
        }
    },

    onBanCua(data) {
        cc.log("onBanCua");
        if (this.ownerId > 0 && Number(this.ownerId) == Number(Linker.userData.userId)) {
            for (var i = 0; i < this.arrBtnBan.length; i++) {
                this.arrBtnBan[i].active = true;
            }
        }
    },

    onPrepareStart(data) {
        this.showMessage('Ván chơi bắt đầu!!!');

        this.resetTable();
        // this.runTimerCount(5);
        this.pnBatUp.stopAllActions();
        this.pnBatUp.runAction(cc.moveTo(0.5, cc.v2(0, 0)));

        // if (this.allUsers.length < 2) return;
        if (this.ownerId <= 0) {
            this.btnLamCai.active = true;
        } else if (this.ownerId > 0 && this.ownerId == Number(Linker.userData.userId)) {
            this.pnNghiCai.active = true;
        }
    },

    onEndRound(data) {
        cc.log("EndRound");
    },

    onStartBet(data) {
        if (this.isCanBet == false) {
            cc.log("onStartBet");
            this.isCanBet = true;

            this.btnLamCai.active = false;
            this.pnNghiCai.active = false;

            this.runTimerCount(30);
        }
    },

    onMyBet(data) {
        if (data.error) {
            this.showMessage(data.error);
            return;
        }

        this.isPlaying = true;
        this.fillDataMyBet(this.arrBetContain[data.typeBet], data.betTotal);
    },

    onStartGame(data) {
        if (data.error) {
            cc.log(data.error);
            return;
        }
    },

    onCanCua(data) {
        if (data.error) {
            this.showMessage(data.error);
            return;
        }

        this.showMessage("Đang cân cửa!!!");

        for (var i = 0; i < data.listUsers.length; i++) {
            var user = data.listUsers[i];
            var avaComp = this.findAvaCompByUID(user.id);

            if (avaComp) {
                avaComp.setMoneyChange(user.moneyReturn);
            }
        }

        for (var i = 0; i < this.arrBtnBan.length; i++) {
            this.arrBtnBan[i].active = false;
        }

        for (var i = 0; i < this.arrBtnMua.length; i++) {
            this.arrBtnMua[i].active = false;
        }
    },

    setIconLamCai() {
        if (this.ownerId <= 0) {
            this.iconCai.active = false;
        } else {
            this.iconCai.active = true;
            var avaComp = this.findAvaCompByUID(this.ownerId);
            var other = this.findOtherUserByUID(this.ownerId);

            if (avaComp) {
                this.isPlaying = true;
                this.iconCai.position = cc.v2(avaComp.node.x + 40, avaComp.node.y-20);
            }

            if (other) {
                this.iconCai.position = cc.v2(locationOther.x + 10, locationOther.y-20);
            }
        }
    },

    onEndGame(data) {
        if (data.error) {
            cc.log(data.error);
            return;
        }
        cc.log('onEndGame');
        //kyun: Check FIXME:
        if(Linker.removeLamCai){
            this.ownerId = 0;
            this.pnNghiCai.active = false;
        } else{
            this.ownerId = data.ownerId;
        }
        

        // Do something onEndGame when huylamcaiClick
        
        this.setIconLamCai();

        //AudioManager.playEffect(AudioManager.sound.xocdia);

        this.pnDia.active = false;
        this.pnDiaAnim.active = true;
        var anim = this.pnDiaAnim.getComponent(cc.Animation);
        anim.play();

        this.scheduleOnce(this.showEndGame.bind(this, data), 2);
    },

    showAnimWin(node, hide = false) {
        var effect = node.getChildByName("effect");

        if (hide) {
            effect.active = false;
            effect.stopAllActions();
        } else {
            effect.active = true;
            effect.stopAllActions();

            var seq = cc.repeatForever(
                cc.rotateBy(1.5, 360)
            );

            effect.runAction(seq);
        }
    },

    showEndGame(data) {
        cc.log('ShowEndGame:',data);
        this.pnDia.active = true;
        this.pnDiaAnim.active = false;

        for (var i = 0; i < 6; i++) {
            this.showAnimWin(this.arrBetContain[i], true);
        }

        if (data.isChan) {
            this.arrLightContain[TYPE_BET.CHAN].active = true;
            this.showAnimWin(this.arrBetContain[TYPE_BET.CHAN]);
        } else {
            this.arrLightContain[TYPE_BET.LE].active = true;
            this.showAnimWin(this.arrBetContain[TYPE_BET.LE]);
        }

        if (data.is4Trang) {
            this.arrLightContain[TYPE_BET.WHITE4].active = true;
            this.showAnimWin(this.arrBetContain[TYPE_BET.WHITE4]);
        }

        if (data.is4Den) {
            this.arrLightContain[TYPE_BET.BLACK4].active = true;
            this.showAnimWin(this.arrBetContain[TYPE_BET.BLACK4]);
        }

        if (data.is3Trang1Den) {
            this.arrLightContain[TYPE_BET.WHITE3BLACK1].active = true;
            this.showAnimWin(this.arrBetContain[TYPE_BET.WHITE3BLACK1]);
        }

        if (data.is3Den1Trang) {
            this.arrLightContain[TYPE_BET.BLACK3WHITE1].active = true;
            this.showAnimWin(this.arrBetContain[TYPE_BET.BLACK3WHITE1]);
        }


        this.history.push(data.isChan);
        this.drawHistory(this.history);

        for (var i = 1; i <= 4; i++) {
            this.arrSprite[i - 1].node.active = true;
            this.arrSprite[i - 1].spriteFrame = this.spriteFrame[i > data.numWhite ? 1 : 0];
        }

        for (var i = 0; i < data.listUsers.length; i++) {
            var user = data.listUsers[i];
            var avaComp = this.findAvaCompByUID(user.id);

            if (avaComp) {
                avaComp.updateRealMoney(user.moneyWin, user.currMoney);
            } else {
                var other = this.findOtherUserByUID(user.id);
                if (other) {
                    other.money = user.currMoney;
                }
            }
            if(user.id==Linker.userData.userId && user.currMoney<this.data.minMoney){
                cc.Global.showMessage("Bạn không đủ tiền để đặt, vui lòng nạp thêm!!!");
                cc.log("vai liin ko du tien");
                this.scheduleOnce(this.backToLobby.bind(this, null), 3);
            }
            if (user.isOut) {
                this.scheduleOnce(this.onLeaveTable.bind(this, user.id), 3);
            }
        }

        this.pnBatUp.stopAllActions();
        this.pnBatUp.runAction(cc.moveTo(0.5, cc.v2(0, 95)));

        if (this.isXinThoi) {
            this.scheduleOnce(this.backToLobby.bind(this, null), 2.5);
        }
    },
    backHandlerBtn: function(event){
        cc.log("vailin vao day backHandlerBtn");
        if (event.keyCode == cc.macro.KEY.back || event.keyCode == cc.macro.KEY.backspace) {
            this.backToLobby();  
        }
    },
    backToLobby(func) {
        //this.showLoading();
        //Global.data.backToLobby = true;
        cc.log("vailin vao day backToLobby");
        if(cc.find('Canvas/Loading')) {
            cc.find('Canvas/Loading').active = true;
        }
        XocDiaSend.sendCancelMatch(this.data.tableId);
        // SceneManager.loadScene('LobbyScene',function(){});
        // SceneManager.loadScene('LobbyScene',function(){
        //     var scene = cc.director.getScene();
        //     var canvas = scene.getChildByName("Canvas");
        //     canvas.opacity = 0;
        //     cc.tween(canvas)
        //     .to(0.5, { opacity: 255})
        //     .start()
        // });
    },

    initDefaultPosition: function () {
        for (var i = 0; i < maxPlayer; i++) {
            var node = cc.instantiate(this.AvatarPrefab);
            node.parent = this.pnPlayers;

            var avaComp = node.getComponent(cc.Component);
            avaComp.node.setPosition(location9P[i]);
            avaComp.reset();

            this.listAvaComp.push(avaComp);
        }
    },

    initPosition: function (pos, player) {
        if (pos < 0 || pos >= maxPlayer) return;
        var avaComp = this.listAvaComp[pos];
        avaComp.initData(pos, player);
        avaComp.node.setPosition(location9P[pos]);
    },

    findOtherUserByUID: function (id) {
        for (var i = 0; i < this.otherUsers.length; i++) {
            var player = this.otherUsers[i];

            if (player != null) {
                if (player.id == id) {
                    return player;
                }
            }
        }

        return null;
    },

    findAvaCompByUID: function (id) {
        for (var i = 0; i < maxPlayer; i++) {
            var ava = this.listAvaComp[i];
            if (ava.player != undefined && ava.player.id == id) {
                return ava;
            }

        }

        return null;
    },

    onDestroy: function () {
        Linker.Event.removeEventListener(Constant.CMD.CHAT, this.onChat, this);
        Linker.Event.removeEventListener(Constant.CMD.XOCDIA_BANCUA, this.onBanCuaRes, this);
        Linker.Event.removeEventListener(Constant.CMD.XOCDIA_MUACUA, this.onMuaCuaRes, this);
        Linker.Event.removeEventListener(Constant.CMD.XOCDIA_REQUEST_OWNER, this.onLamCai, this);
        Linker.Event.removeEventListener(Constant.CMD.MATCH_CANCEL, this.onUserLeave, this);
        Linker.Event.removeEventListener(Constant.CMD.RECONNECTION, this.onReconnect, this);
        Linker.Event.removeEventListener(Constant.CMD.MATCH_NEW, this.onNewTable, this);
        Linker.Event.removeEventListener(Constant.CMD.MATCH_JOIN, this.onJoinTable, this);
        Linker.Event.removeEventListener(Constant.CMD.MATCH_JOINED, this.onJoinedTable, this);
        Linker.Event.removeEventListener(Constant.CMD.FINISH_PUT_MONEY, this.onPushMoney, this);
        Linker.Event.removeEventListener(Constant.CMD.MATCH_START, this.onStartGame, this);
        Linker.Event.removeEventListener(Constant.CMD.MATCH_END, this.onEndGame, this);
        Linker.Event.removeEventListener(Constant.CMD.XOCDIA_BET, this.onMyBet, this);
        Linker.Event.removeEventListener(Constant.CMD.XOCDIA_CANCUA, this.onCanCua, this);
        Linker.Event.removeEventListener(Constant.CMD.XOCDIA_HISTORY, this.onHistory, this);
        Linker.Event.removeEventListener(Constant.CMD.UPDATE_CASH_AFTER_CHARGED, this.onUpdateUser, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
        clearInterval(this.countdownInterval);
    },

    hiddenTimer: function () {
        this.txtTimer.node.active = false;
        this.pnTimer.active = false;

        clearInterval(this.countdownInterval);
    },

    runTimerCount: function (time) {
        clearInterval(this.countdownInterval);

        if (time == 0) {
            this.hiddenTimer();
            return;
        }

        this.timeReady = time;
        this.pnTimer.active = true;
        this.txtTimer.node.active = true;
        this.txtTimer.string = this.timeReady.toString();

        this.countdownInterval = setInterval(this.onTimerCount.bind(this), 1000);
    },

    onTimerCount: function (dt) {
        if (this.timeReady == 0) {
            this.hiddenTimer();
        } else {
            this.timeReady--;
            this.txtTimer.string = this.timeReady.toString();

            // AudioManager.playEffect(AudioManager.sound.tick);
        }
    },
    onBtnRoomsClick() {
        PopupFactory.openPopup(PopupFactory.Popup.TABLELIST, {
            matchID: this.data.tableId
        });
    },

    onBtnSettingClick() {
        if(this.popupSetting.active){
            this.popupSetting.active = false;
        } else {
            this.popupSetting.active = true;
        }
    },
    onBtnSendChatClick() {
        var msg = this.edbChat.string;
        if (msg.length <= 0) {
            return;
        }

        var str = Constant.CMD.CHAT +
            Constant.SEPERATOR.N4 + this.data.tableId +
            Constant.SEPERATOR.ELEMENT + msg +
            Constant.SEPERATOR.ELEMENT + 0;

        var data = {
            message: msg,
            username: Linker.userData.displayName,
            id: Linker.userData.userId
        };
        this.onChat(data);

        this.edbChat.string = '';
        XocDiaSend.sendRequest(str);
    },

    onBtnChatClick() {
        this.pnChat.active = !this.pnChat.active;
    },

    onBtnBackClick() {
        cc.log("vailin vao day backToLobby2:");
        if (!this.isPlaying) {
            this.backToLobby();
            XocDiaSend.sendCancelMatch(this.data.tableId);
            return;
        }

        if (this.isXinThoi) {
            this.showMessage('Bạn đã huỷ hết ván xin thôi!!!');
        } else {
            this.showMessage('Bạn đã đăng ký hết ván xin thôi!!!');
        }

        this.isXinThoi = !this.isXinThoi;
    },

    onBetClick(target, money) {
        this.moneyBet = parseInt(money);

        var index, len;
        for (index = 0, len = this.arrBtnBet.length; index < len; ++index) {
            this.arrBtnBet[index].scale = 1;
        }

        target.scale = SCALE_BTN;
    },

    onBanCuaClick({
        target
    }, type) {
        type = parseInt(type);

        var str = Constant.CMD.XOCDIA_BANCUA +
            Constant.SEPERATOR.N4 + type;

        XocDiaSend.sendRequest(str);
    },

    onMuaCuaClick({
        target
    }, type) {
        type = parseInt(type);
        var money = type == TYPE_BET.LE ? this.totalLe : this.totalChan;

        var str = Constant.CMD.XOCDIA_MUACUA +
            Constant.SEPERATOR.N4 + money;

        XocDiaSend.sendRequest(str);
    },

    onSelectCuaClick({
        target
    }, type) {
        if (!this.isCanBet) return;
        //AudioManager.playEffect(AudioManager.sound.click);

        var typeBet = parseInt(type);

        var str = Constant.CMD.XOCDIA_BET +
            Constant.SEPERATOR.N4 + this.moneyBet +
            Constant.SEPERATOR.ELEMENT + typeBet;

        XocDiaSend.sendRequest(str);
    },

    onNghiCaiClick() {
        var str = Constant.CMD.XOCDIA_REQUEST_OWNER +
            Constant.SEPERATOR.N4 + Linker.userData.userId +
            Constant.SEPERATOR.ELEMENT + 0;
        Linker.removeLamCai = true;
        XocDiaSend.sendRequest(str);
    },

    onLamCaiClick() {
        var str = Constant.CMD.XOCDIA_REQUEST_OWNER +
            Constant.SEPERATOR.N4 + Linker.userData.userId +
            Constant.SEPERATOR.ELEMENT + 1;
            Linker.removeLamCai = false; 
        XocDiaSend.sendRequest(str);
    },
    showPlayerInfo(player){
        cc.log("hello:",player);
        
        
        Linker.showInfoPlayer = player;
        this.userDialogName.string = Linker.showInfoPlayer.name;
        this.userDialogMoney.string = TQUtil.addDot(Linker.showInfoPlayer.money);
        this.userDialogId.string = Linker.showInfoPlayer.id;
        this.userDialogAvatar.spriteFrame = this.userListAvatar[(Number(Linker.showInfoPlayer.avatar)-1).toString()];
        cc.find('Canvas/PopupUserInfo').active = true;
        
    }
});