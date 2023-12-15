var Utils = require('Utils');
var Linker = require('Linker');
var i18n = require('i18n');
var NewAudioManager = require('NewAudioManager');
var soccerConstant = require('soccerConstant');
var DataAccess = require('DataAccess');
var Constant = require('Constant');
var HeadBallConstant = require("HeadBallConstant");
var CommonSend = require('CommonSend');
cc.Class({
    extends: cc.Component,

    properties: {
        avatarBlocks: [cc.Node],//left and right
        bettingLevelTable: cc.Node,
        minCashNode: cc.Node,
        sttTable: cc.Node,
        btnSitOnTable: [cc.Node],
        btnCreate: cc.Node,
        iconMoney: cc.Node,
        watchNode: cc.Node,
        backgroundNode: cc.Node,
        playerTotal: cc.Node,
        cuocNode: cc.Node,
        minCashContainer: cc.Node,
        sttContainer: cc.Node,
        iconVs: cc.Node,
        itemThongTin: cc.Node,
        backgroundSprite: cc.Sprite,
        listBackgroundSpriteFrames: [cc.SpriteFrame],
        vsSprite: cc.Sprite,
        listVsSpriteFrames: [cc.SpriteFrame],
        watchSprite: cc.Sprite,
        listWatchSpriteFrames: [cc.SpriteFrame],
        createSprite: cc.Sprite,
        listCreateSpriteFrames: [cc.SpriteFrame],
        btnSitOnTableSprites: [cc.Sprite],
        listAvatarSprites: [cc.Sprite],
        listAvatarSpriteFrames: [cc.SpriteFrame],
        listAvatarBgSprites: [cc.Sprite],
        listAvatarBgSpriteFrames: [cc.SpriteFrame],
        popupThongTinSprite: cc.Sprite,
        popupThongTinSpriteFrames: [cc.SpriteFrame],
        lisDecorationAvatarSprite: [cc.Sprite],
        listDecorationAvatarSpriteFrames: [cc.SpriteFrame],
        listFramePokerTable: [cc.SpriteFrame],
        listFrameTLMNTable: [cc.SpriteFrame],

    },
    getLabelNode: function () {
        return this.bettingLevelTable;
    },
    getIconSprite: function () {
        if (this.iconMoney && cc.isValid(this.iconMoney)) {
            return this.iconMoney.getComponent(cc.Sprite);
        }
        return null;
    },
    onEnable: function () {
        this.hideWatchTable();
        Utils.Malicious.setColorMoney(this.bettingLevelTable);
        this.btnCreate.on(cc.Node.EventType.TOUCH_END, this.onCreateRoom, this);
        this.setCommonSprite();
    },
    setCommonSprite: function () {
        var index = 0;
        switch (Linker.ZONE) {
            case soccerConstant.ZONE_ID.ZONE_1VS1:
                index = 0;
                break;
            case HeadBallConstant.ZONE_ID.LOBBY:
                index = 1;
                break;
            default:
                break;
        }
        var data = { index: index };
        // this.setBackGroundByIndex(data);
        this.setVsSpriteByIndex(data);
        this.setWatchSpriteByIndex(data);
        this.setCreateSpriteByIndex(data);
        this.setListBtnSitSpriteByIndex(data);
        this.setAvatarDefaultPlayerSitByIndex(data);
        // this.setAvatarBgDefaultByIndex(data);
        this.setAvatarDecorationDefaultByIndex(data);
        this.setPopupThongTinBanByIndex(data);
    },
    setPopupThongTinBanByIndex: function (data) {
        if (data) {
            var index = data.index;
            index = parseInt(index);
            if (isNaN(index) == false) {
                if (index >= 0 && index < this.popupThongTinSpriteFrames.length) {
                    this.popupThongTinSprite.spriteFrame = this.popupThongTinSpriteFrames[index];
                }
            }
        }
    },
    setBackGroundByIndex: function (data) {
        if (data) {
            var index = data.index;
            index = parseInt(index);
            if (isNaN(index) == false) {
                if (index >= 0 && index < this.listBackgroundSpriteFrames.length) {
                    this.backgroundSprite.spriteFrame = this.listBackgroundSpriteFrames[index];
                }
            }
        }
    },
    setVsSpriteByIndex: function (data) {
        if (data) {
            var index = data.index;
            index = parseInt(index);
            if (isNaN(index) == false) {
                if (index >= 0 && index < this.listVsSpriteFrames.length) {
                    this.vsSprite.spriteFrame = this.listVsSpriteFrames[index];
                }
            }
        }
    },
    setWatchSpriteByIndex: function (data) {
        if (data) {
            var index = data.index;
            index = parseInt(index);
            if (isNaN(index) == false) {
                if (index >= 0 && index < this.listWatchSpriteFrames.length) {
                    this.watchSprite.spriteFrame = this.listWatchSpriteFrames[index];
                }
            }
        }
    },
    setCreateSpriteByIndex: function (data) {
        if (data) {
            var index = data.index;
            index = parseInt(index);
            if (isNaN(index) == false) {
                if (index >= 0 && index < this.listCreateSpriteFrames.length) {
                    this.createSprite.spriteFrame = this.listCreateSpriteFrames[index];
                }
            }
        }
    },
    setListBtnSitSpriteByIndex: function (data) {
        if (data) {
            var index = data.index;
            // index = parseInt(index);
            index = 0;
            cc.log(index);

            if (isNaN(index) == false) {
                if (index >= 0 && index < this.listCreateSpriteFrames.length) {
                    for (var i = 0; i < this.btnSitOnTableSprites.length; i++) {
                        this.btnSitOnTableSprites[i].spriteFrame = this.listCreateSpriteFrames[index];
                    }
                }
            }
        }
    },
    setAvatarDefaultPlayerSitByIndex: function (data) {
        if (data) {
            var index = data.index;
            index = parseInt(index);
            if (isNaN(index) == false) {
                if (index >= 0 && index < this.listAvatarSpriteFrames.length) {
                    for (var i = 0; i < this.listAvatarSprites.length; i++) {
                        this.listAvatarSprites[i].spriteFrame = this.listAvatarSpriteFrames[index];
                    }
                }
            }
        }
    },
    setAvatarBgDefaultByIndex: function (data) {
        if (data) {
            var index = data.index;
            index = parseInt(index);
            if (isNaN(index) == false) {
                if (index >= 0 && index < this.listAvatarBgSpriteFrames.length) {
                    for (var i = 0; i < this.listAvatarBgSprites.length; i++) {
                        this.listAvatarBgSprites[i].spriteFrame = this.listAvatarBgSpriteFrames[index];
                    }
                }
            }
        }
    },
    setAvatarDecorationDefaultByIndex: function (data) {
        if (data) {
            var index = data.index;
            index = parseInt(index);
            if (isNaN(index) == false) {
                if (index >= 0 && index < this.listDecorationAvatarSpriteFrames.length) {
                    for (var i = 0; i < this.lisDecorationAvatarSprite.length; i++) {
                        this.lisDecorationAvatarSprite[i].spriteFrame = this.listDecorationAvatarSpriteFrames[index];
                    }
                }
            }
        }
    },
    setPlayerWaiting: function (nplayer) {
        var numplayer = Number(nplayer);
        // if(numplayer >= 0){
        // var n = 0;

        for (var i = 0; i < this.avatarBlocks.length; i++) {
            var _sitted = this.avatarBlocks[i].getChildByName("sitted");
            var _sit = this.avatarBlocks[i].getChildByName("btnSit");
            this.avatarBlocks[i].active = true;
            if (numplayer >= 2) {
                _sitted.active = true;
                _sit.active = false;
                if (i == numplayer - 1) {
                    break;
                }
            } else if (numplayer == 1) {
                _sitted.active = true;
                _sit.active = false;
                numplayer--;
            } else {
                _sitted.active = false;
                _sit.active = true;
                numplayer--;
            }
        }
    },
    showCreateTable: function () {
        //chỉ hiện bg và button create
        this.itemThongTin.active = false;
        this.backgroundNode.active = true;
        this.btnCreate.active = true;
        if (Linker.ZONE == Constant.ZONE_ID.POKER) {
            this.backgroundSprite.spriteFrame = this.listFramePokerTable[0];
        } else if (Linker.ZONE == Constant.ZONE_ID.TLMN) {
            this.backgroundSprite.spriteFrame = this.listFrameTLMNTable[1];
        }
        //hide avatar
        for (let i = 0; i < this.avatarBlocks.length; i++) {
            this.avatarBlocks[i].active = false;
            this.avatarBlocks[i].getChildByName("sitted").active = false;
        }
        this.iconMoney.active = false;
        this.cuocNode.active = false;
        this.minCashContainer.active = false;
        this.sttContainer.active = false;
        this.watchNode.active = false;
        this.playerTotal.active = false;
        this.iconVs.active = false;

    },
    showMainItem: function () {
        this.itemThongTin.active = true;
        this.backgroundNode.active = true;
        this.iconMoney.active = true;
        this.cuocNode.active = true;
        this.minCashContainer.active = false;
        this.sttContainer.active = true;
        //hide avatar
        for (let i = 0; i < this.avatarBlocks.length; i++) {
            this.avatarBlocks[i].active = true;
            this.avatarBlocks[i].getChildByName("sitted").active = false;
        }
    },
    hideCreateTable: function () {
        this.btnCreate.active = false;
        this.cuocNode.active = true;
    },
    hideWatchTable: function () {
        this.watchNode.active = false;
    },
    addCustomEventListener: function () {
        for (let i = 0; i < this.btnSitOnTable.length; i++) {
            this.btnSitOnTable[i].on(cc.Node.EventType.TOUCH_END, this.join, this);
        }
    },
    // reuse: function () {
    //     for (let i = 0; i < this.btnSitOnTable.length; i++) {
    //         this.btnSitOnTable[i].on(cc.Node.EventType.TOUCH_END, this.join.bind(this), this.node);
    //     }
    //     this.btnCreate.on(cc.Node.EventType.TOUCH_END, this.onCreateRoom.bind(this), this.node);
    // },
    setBackgroundTable: function (maxNumberPlayer) {
        var playerPositionArray = [];
        switch (Linker.ZONE) {
            case Constant.ZONE_ID.POKER:
                if (maxNumberPlayer == 5) {
                    this.backgroundSprite.spriteFrame = this.listFramePokerTable[1];
                    playerPositionArray = [cc.v2(-10, 42), cc.v2(74, 40), cc.v2(127, 54), cc.v2(-131, 54), cc.v2(-41, 141)];
                } else {
                    this.backgroundSprite.spriteFrame = this.listFramePokerTable[0];
                }
                break;
            case Constant.ZONE_ID.TLMN:
                if (maxNumberPlayer == 2) {
                    this.backgroundSprite.spriteFrame = this.listFrameTLMNTable[0];
                    playerPositionArray = [cc.v2(119.514, 33.608), cc.v2(79.731, 146.225)];
                } else {
                    this.backgroundSprite.spriteFrame = this.listFrameTLMNTable[1];
                    playerPositionArray = [cc.v2(53.468, 33.608), cc.v2(136.463, 45.462), cc.v2(-50.668, 151.305), cc.v2(-10.871, 154.692)];
                }
                break;
            default:
                break;
        }
        for (var i = 0; i < playerPositionArray.length; i++) {
            this.avatarBlocks[i].getChildByName("sitted").position = playerPositionArray[i];
        }
    },
    init: function (data) {
        if (this && cc.isValid(this)) {
            this.data = data;
            if (this.data && this.bettingLevelTable && this.sttTable && this.minCashNode && this.playerTotal) {
                if (this.data.isCreate) {
                    this.showCreateTable();
                } else {
                    this.iconVs.active = true;
                    this.hideCreateTable();
                    this.showMainItem();
                    this.addCustomEventListener();
                    this.data = data;
                    this.minBet = this.bettingLevelTable.getComponent(cc.Label);
                    this.stt = this.sttTable.getComponent(cc.Label);
                    this.minCash = this.minCashNode.getComponent(cc.Label);
                    this.totalLable = this.playerTotal.getComponent(cc.Label);
                    this.playerTotal.active = false;
                    if (this.stt && this.minBet && this.minCash && this.totalLable) {
                        // this.stt.string = i18n.t("button_title_table") + ":" + this.data.pos + "";
                        this.stt.string = this.data.pos + "";
                        if (Number(this.data.tableSize) >= 1) {
                            this.playerTotal.active = true;
                            this.totalLable.string = "(" + this.data.tableSize + ")";
                        }
                        if (Number(this.data.tableIndex) > 0) {
                            this.node.getChildByName('Stt').active = true;
                            this.stt.string = this.data.tableIndex;
                            this.minBet.string = Utils.Number.format(this.data.firstCashBet);
                            //&& Number(this.data.isPlaying) == 1
                            if (Number(this.data.tableSize) >= 2) {
                                // this.watchNode.active = true;

                            } else {
                                this.watchNode.active = false;
                            }
                        } else {
                            this.minBet.string = Utils.Number.format(this.data.firstCashBet) + "";
                            this.node.getChildByName('Stt').active = false;
                        }
                        this.minCash.string = "Min: " + Utils.Number.format(this.data.firstCashBet * 10) + "";
                        if (this.data.tableSize != null) {
                            // cc.log("this.data.tableSize", this.data.tableSize);
                            // this.currentSize.string = this.data.tableSize + "/" + this.data.maxNumberPlayer;
                            // this.currentProgress.progress = Number(this.data.tableSize) / Number(this.data.maxNumberPlayer);
                            this.setBackgroundTable(this.data.maxNumberPlayer);
                            this.setPlayerWaiting(this.data.tableSize);
                            // if (this.data.tableSize == 0) {
                            //     // this.nameTable.string = "Trống";
                            //     this.data.status = 0;// trong
                            //     this.setPlayerWaiting(this.data.tableSize);
                            // } else {
                            //     if (this.data.isPlaying == 1) {
                            //         if (this.data.tableSize < this.data.maxNumberPlayer) {
                            //             this.data.status = 1; // dang choi
                            //             this.setPlayerWaiting(this.data.tableSize);

                            //         } else {
                            //             this.data.status = 3; // day
                            //             this.setPlayerWaiting(0);
                            //         }
                            //     } else {
                            //         if (this.data.tableSize < this.data.maxNumberPlayer) {
                            //             this.data.status = 2; // cho
                            //             this.setPlayerWaiting(this.data.tableSize);
                            //         } else {
                            //             this.data.status = 3; // day
                            //             this.setPlayerWaiting(0);
                            //         }
                            //     }
                            // }
                        }
                        Utils.Malicious.getCoinFrame(Linker.MoneyTypeSpriteFrame, function (err, data) {
                            if (!err) {
                                Linker.MoneyTypeSpriteFrame = data;
                                var coinFrame = (Number(cc.Global.moneyType) == 1) ? Linker.MoneyTypeSpriteFrame.Quan : Linker.MoneyTypeSpriteFrame.Xu;
                                if (coinFrame) {
                                    var iconMoneySprite = this.getIconSprite();
                                    if (iconMoneySprite) {
                                        iconMoneySprite.spriteFrame = coinFrame;
                                    }
                                }
                            }
                        }.bind(this));
                    }

                }
                Utils.Malicious.setColorMoney(this.bettingLevelTable);
            }
        }
    },
    blockTableEvent: function (enable) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_ITEM_BAN_YEU_CAU_BLOCK_SU_KIEN_CLICK, true);
        customEvent.enableBlock = enable;
        this.node.dispatchEvent(customEvent);
    },
    join: function () {
        //check truong hop k co firstCashBet
        if (this.data && !this.data.firstCashBet && Linker.ZONE) {
            console.log('--2');
            var sendData = CommonSend.joinZone(Linker.ZONE, 0);
            Linker.Socket.send(sendData);
            cc.Global.showMessage(i18n.t("Có lỗi xảy ra, vui lòng thử lại sau"));
            return;
        }
        var tableData = this.data;
        if (tableData) {
            var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_YEU_CAU_TAO_BAN_CHOI, true);
            customEvent.tableData = this.data;
            customEvent.isReconnect = false;
            customEvent.isCreate = false;
            customEvent.isJoin = false;
            if ((Number(tableData.tableSize) > 0 && Number(tableData.tableSize) < Number(tableData.maxNumberPlayer)) || (tableData.tableSize == 0)) {
                if (Linker.ZONE) {
                    if (Number(tableData.firstCashBet) * 1 <= Number(DataAccess.Instance.getCurrentBalance(cc.Global.bidaMoneyType))) {
                        this.blockTableEvent(true);
                        if (tableData.tableSize == 0) {
                            customEvent.isCreate = true;
                        } else {
                            customEvent.isJoin = true;
                        }
                        cc.log("customEvent: " + customEvent);
                        this.node.dispatchEvent(customEvent);
                    } else {
                        this.blockTableEvent(false);
                        cc.Global.showMessage(i18n.t("Bạn không đủ tiền để vào phòng"));
                    }
                }
            } else {
                cc.Global.showMessage(i18n.t("Bàn đã đầy. Vui lòng chọn bàn khác"));
            }
        }
    },
    onCreateRoom: function () {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.CREATE_TABLE_ADD_ROOM, true);
        this.node.dispatchEvent(customEvent);
    }
    // update (dt) {},
});
