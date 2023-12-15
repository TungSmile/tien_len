const BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var Linker = require('Linker');
var LobbySend = require('LobbySend');
var XocDiaSend = require('XocDiaSend');
var Utils = require('Utils');
var NodePoolManager = require('NodePoolManager');
var SceneManager = require('SceneManager');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        taoBan: cc.Node,
        taoBanBida: cc.Prefab,
        chat: cc.Node,
        rankPrefab: cc.Prefab,
        chatPrefab: cc.Prefab,
        itemChatPrefab: cc.Prefab,
        btnSortMoney: cc.Node,
        btnSortMoney2: cc.Node,
        btnSortPlayer: cc.Node,
        btnSortStatus: cc.Node,
        checkroomToggle: cc.Toggle,
        profilePrefab: cc.Prefab,
        settingPrefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.PhomLobbyEventListener = this;
        //Add NodePool ChatLobby
        // if (Linker.chatLobby){
        //     if (Linker.chatLobby._pool.length == 0){
        //         var chatPrefab = cc.instantiate(this.chatPrefab);
        //         var content =  chatPrefab.getChildByName('scrollview').getChildByName('mask').getChildByName('contentChat');

        //         if (Linker.CHAT_MESSAGE && this.chatPrefab) {
        //             for ( var i = 0; i < Linker.CHAT_MESSAGE.length; i++) {
        //                 var userChat = Linker.CHAT_MESSAGE[i].username;
        //                 var messChat = Linker.CHAT_MESSAGE[i].messchat;
        //                 var itemChat = cc.instantiate(this.itemChatPrefab);
        //                 content.addChild(itemChat);
        //                 itemChat.getChildByName('textchat').getComponent(cc.RichText).string = '<color=yellow>' + userChat + ': ' + '</color>' + '<color=white>' + messChat + '</color>';
        //             }
        //         }
        //         this.chat.addChild(chatPrefab);
        //     }  else {
        //         this.chat.addChild(Linker.chatLobby.get());
        //     }
        // } else {
        //     var chatPrefab = cc.instantiate(this.chatPrefab);
        //     var content =  chatPrefab.getChildByName('scrollview').getChildByName('mask').getChildByName('contentChat');

        //     if (Linker.CHAT_MESSAGE) {
        //         for ( var i = 0; i < Linker.CHAT_MESSAGE.length; i++) {
        //             var userChat = Linker.CHAT_MESSAGE[i].username;
        //             var messChat = Linker.CHAT_MESSAGE[i].messchat;
        //             var itemChat = cc.instantiate(this.itemChatPrefab);
        //             content.addChild(itemChat);
        //             itemChat.getChildByName('textchat').getComponent(cc.RichText).string = '<color=yellow>' + userChat + ': ' + '</color>' + '<color=white>' + messChat + '</color>';
        //         }
        //     }
        //     this.chat.addChild(chatPrefab);
        // }    

        this.sortMoney = null;
        this.sortPlayer = null;
        this.sortStatus = null;
    },

    start() {
        //this.addEventListener();
    },
    addEventListener() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
    },
    backHandlerBtn: function (event) {
        NewAudioManager.playClick();
        if (event.keyCode == cc.macro.KEY.back || event.keyCode == cc.macro.KEY.backspace) {
            if (cc.find("Canvas/Loading")) cc.find("Canvas/Loading").active = false;
            this.backBtnClick();
        }

    },
    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
        Linker.PhomLobbyEventListener = null;
    },
    quickStartBtn() {
        NewAudioManager.playClick();
        cc.Global.showLoading();
        //lưu ý nếu ở zone nào thì phải tạo trước hoặc cấu hình bàn của zone đấy
        //khi có data rồi mới config bàn thì sẽ bị trễ, dễ lỗi
        var customEvent;
        if (Linker.ZONE == 8) {
            //tạo sẵn bàn bida 11 nhưng ẩn nó đi
            cc.log("Mode play 1vs1 quick play activated ...");
            customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_WITH_MODE_1V1_PLAYERS, true);
        } else if (Linker.ZONE == 84) {
            //tạo sẵn bàn bida 14 nhưng ẩn nó đi
            cc.log("Mode play 1vs4 quick play activated ...");
            customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_WITH_MODE_1V4_PLAYERS, true);
        } else if (Linker.ZONE == 86) {
            cc.log("Mode play phom quick play activated ...");
            customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_WITH_MODE_BIDA_PHOM_PLAYERS, true);
            //tạo sẵn bàn bida phỏm nhưng ẩn nó đi
        }
        if(customEvent){
            customEvent.isQuickPlayLobby = true;
            this.node.dispatchEvent(customEvent);
        }
    },
    refeshListTable() {
        NewAudioManager.playClick();
        this.node.getComponent("BillardLobby").refeshListTable();
        this.sortMoney = null;
        this.sortPlayer = null;
        this.sortStatus = null;
        // this.btnSortMoney.rotation = 0;
        // this.btnSortMoney2.rotation = 0;
        // this.btnSortPlayer.rotation = 0;
        // this.btnSortStatus.rotation = 0;
        // this.checkroomToggle.isChecked = false;
    },
    putNodePoolChat() {
        cc.find("Canvas/Loading").active = true;
        // if (this.chat.getChildByName('chat')){
        //     Linker.chatLobby = new cc.NodePool();
        //     Linker.chatLobby.put(this.chat.getChildByName('chat'));
        // }
    },
    backBtnClick() {
        // SceneManager.loadScene('HallScene', function () {
        //     Linker.LoginController.node.getComponent("LoginManager").HallNode.getComponent("HallController").removeEventSocket();
        //     Linker.LoginController.node.getComponent("LoginManager").HallNode.getComponent("HallController").removeEventSocket();
        //     Linker.LoginController.node.getComponent("LoginManager").HallNode.getComponent("HallController").initHallScene();
        //     Linker.LoginController.node.getComponent("LoginManager").HallNode.getComponent("HallController").controlledOnEnable();
        //     Linker.LoginController.node.getComponent("LoginManager").HallNode.getComponent("HallController").addSocketEvent();
        //     Linker.LoginController.node.getComponent("LoginManager").showLayer();
        // });

        this.node.getParent().active = false;

    }
    ,
    taoBanBtn() {
        NewAudioManager.playClick();
        //this.taoBan.active = true;
        var dialogTaoban = cc.find("Canvas/taoban");
        if (!dialogTaoban) {
            var taoban = cc.instantiate(this.taoBanBida);
            taoban.position = cc.v2(0, 0);
            taoban.active = true;
            taoban.zIndex = cc.macro.MAX_ZINDEX - 1;
            cc.find("Canvas").addChild(taoban);
        } else if (dialogTaoban && dialogTaoban.active == false) {
            dialogTaoban.active = true;
        } else if (dialogTaoban && dialogTaoban.active == true) {
            dialogTaoban.active = false;
        }
    },
    chatBtn() {
        NewAudioManager.playClick();
        if (this.chat.active) {
            this.chat.active = false;
        } else {
            this.chat.active = true;
        }
    },
    napBtnClick() {
        NewAudioManager.playClick();
        var dialog = cc.find("Canvas/Shop");
        if (dialog && dialog.active == false) {
            dialog.active = true;
            Linker.ShopDialog.chargeCard.active = true;
            Linker.ShopDialog.iap.active = false;
            Linker.ShopDialog.sms.active = false;
            Linker.ShopDialog.doithuong.active = false;
            Linker.ShopDialog.lichsu.active = false;
            Linker.ShopDialog.chargeCardBtn.getChildByName("check").active = true;
            //Linker.ShopDialog.smsBtn.getChildByName("check").active = false;
            Linker.ShopDialog.iapBtn.getChildByName("check").active = false;
            Linker.ShopDialog.bonusBtn.getChildByName("check").active = false;
            Linker.ShopDialog.historyBtn.getChildByName("check").active = false;
        } else {
            dialog.active = false;
        }
    },
    avatarClick() {
        NewAudioManager.playClick();
        var dialog = cc.find("Canvas/Profile");
        if (!dialog) {
            var Profile = cc.instantiate(this.profilePrefab);
            Profile.position = cc.v2(0, 0);
            Profile.active = true;
            Profile.zIndex = cc.macro.MAX_ZINDEX - 1;
            cc.find("Canvas").addChild(Profile);
        } else if (dialog && dialog.active == false) {
            dialog.active = true;
        } else if (dialog && dialog.active == true) {
            dialog.active = false;
        }
    },
    showRankDialog() {
        NewAudioManager.playClick();
        var dialog = cc.find("Canvas/Rank");
        if (!dialog) {
            var Rank = cc.instantiate(this.rankPrefab);
            Rank.position = cc.v2(0, 0);
            Rank.active = true;
            cc.find("Canvas").addChild(Rank, cc.macro.MAX_ZINDEX);
        } else if (dialog && dialog.active == false) {
            dialog.active = true;
        } else if (dialog && dialog.active == true) {
            dialog.active = false;
        }
    },
    showSettingDialog() {
        NewAudioManager.playClick();
        var dialog = cc.find("Canvas/Setting");
        if (!dialog) {
            var Setting = cc.instantiate(this.settingPrefab);
            Setting.position = cc.v2(0, 0);
            Setting.active = true;
            Setting.zIndex = cc.macro.MAX_ZINDEX - 1;
            cc.find("Canvas").addChild(Setting);
        } else if (dialog && dialog.active == false) {
            dialog.active = true;
        } else if (dialog && dialog.active == true) {
            dialog.active = false;
        }
    },

    sort(event, customEventData) {
        NewAudioManager.playClick();
        if (!customEventData || !Linker.CurrentLobbyTableData || Linker.CurrentLobbyTableData.length == 0) {
            return;
        }
        if (customEventData == 'money') {
            if (!this.sortMoney) {
                Linker.CurrentLobbyTableData.sort(function (a, b) {
                    var keyA = Number(a.firstCashBet),
                        keyB = Number(b.firstCashBet);
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) {
                        return 1;
                    } else if (keyA == keyB) {
                        if (Number(a.tableIndex) > 0) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                    return 0;
                });
                this.sortMoney = true;
                this.btnSortMoney.rotation = 0;
                this.btnSortMoney2.rotation = 0;
            } else {
                Linker.CurrentLobbyTableData.sort(function (a, b) {
                    var keyA = Number(a.firstCashBet),
                        keyB = Number(b.firstCashBet);
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) {
                        return 1;
                    } else if (keyA == keyB) {
                        if (Number(a.tableIndex) > 0) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                    return 0;
                });
                this.sortMoney = false;
                this.btnSortMoney.rotation = 180;
                this.btnSortMoney2.rotation = 180;
            }
        }

        if (customEventData == 'player') {
            if (!this.sortPlayer) {
                Linker.CurrentLobbyTableData.sort(function (a, b) {
                    var keyA = Number(a.tableSize),
                        keyB = Number(b.tableSize);
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) {
                        return 1;
                    } else if (keyA == keyB) {
                        if (Number(a.tableIndex) > 0) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                    return 0;
                });
                this.sortPlayer = true;
                this.btnSortPlayer.rotation = 180;
            } else {
                Linker.CurrentLobbyTableData.sort(function (a, b) {
                    var keyA = Number(a.tableSize),
                        keyB = Number(b.tableSize);
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) {
                        return 1;
                    } else if (keyA == keyB) {
                        if (Number(a.tableIndex) > 0) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                    return 0;
                });
                this.sortPlayer = false;
                this.btnSortPlayer.rotation = 0;
            }
        }


        if (customEventData == 'status') {
            if (!this.sortStatus) {
                Linker.CurrentLobbyTableData.sort(function (a, b) {
                    var keyA = Number(a.status),
                        keyB = Number(b.status);
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) {
                        return 1;
                    } else if (keyA == keyB) {
                        if (Number(a.tableIndex) > 0) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                    return 0;
                });
                this.sortStatus = true;
                this.btnSortStatus.rotation = 180;
            } else {
                Linker.CurrentLobbyTableData.sort(function (a, b) {
                    var keyA = Number(a.status),
                        keyB = Number(b.status);
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) {
                        return 1;
                    } else if (keyA == keyB) {
                        if (Number(a.tableIndex) > 0) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                    return 0;
                });
                this.sortStatus = false;
                this.btnSortStatus.rotation = 0;
            }
        }

        for (var j = 0; j < Linker.CurrentLobbyTableData.length; j++) {
            Linker.CurrentLobbyTableData[j].pos = j + 1;
        }
        Linker.PhomLobbyView.opListTable.refresh(Linker.CurrentLobbyTableData);
        Linker.PhomLobbyView.scrollView.scrollToTop(0.3);
    },

    checkRoomFull(toggle) {
        var tempData = Linker.CurrentLobbyTableData;
        NewAudioManager.playClick();
        if (toggle.isChecked) {
            for (var i = 0; i < tempData.length; i++) {

                if (tempData[i].tableSize == 4) {
                    tempData.splice(i, 1);
                }
            }
            Linker.PhomLobbyView.opListTable.refresh(tempData);
        } else {
            Linker.PhomLobbyController.refeshListTable();
        }
    }
    // update (dt) {},
});
