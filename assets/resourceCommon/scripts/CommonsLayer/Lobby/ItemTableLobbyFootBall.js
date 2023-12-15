var Utils = require('Utils');
var Linker = require('Linker');
var i18n = require('i18n');
var NewAudioManager = require('NewAudioManager');
var soccerConstant = require('soccerConstant');
var DataAccess = require('DataAccess');
var Constant = require('Constant');
var HeadBallConstant = require("HeadBallConstant");
var FootBallConstant = require("FootBallConstant");

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
        btnSitOnTableSprites: [cc.Sprite],
        listAvatarSprites: [cc.Sprite],
        listAvatarSpriteFrames: [cc.SpriteFrame],
        popupThongTinSprite: cc.Sprite,
        popupThongTinSpriteFrames: [cc.SpriteFrame],
    },
    getLabelNode: function () {
        return this.bettingLevelTable;
    },
    getIconSprite: function () {
        return this.iconMoney.getComponent(cc.Sprite);
    },
    onEnable: function () {
        this.hideWatchTable();
        Utils.Malicious.setColorMoney(this.bettingLevelTable);
        this.btnCreate.on(cc.Node.EventType.TOUCH_END, this.onCreateRoom, this);
        this.setCommonSprite();
    },
    setCommonSprite: function (left = null, right = null) {
        var index = 0;
        switch (Linker.ZONE) {
            case FootBallConstant.ZONE_ID.ZONEID_PENALTY:
                index = 0;
                break;
            default:
                break;
        }
        var data = { index: index };
        this.setBackGroundByIndex(data);
        this.setVsSpriteByIndex(data);
        this.setWatchSpriteByIndex(data);
        this.setAvatarDefaultPlayerSitByIndex(data);
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
    setAvatarDefaultPlayerSitByIndex: function (data) {
        if (data) {
            var index = data.index;
            index = parseInt(index);
            if (isNaN(index) == false) {
                if (index >= 0 && index < this.listAvatarSpriteFrames.length) {
                    for (var i = 0; i < this.listAvatarSprites.length; i++) {
                        this.listAvatarSprites[i].spriteFrame = this.listAvatarSpriteFrames[i];  
                    }
                }
            }
        }
    },
    setPlayerWaiting: function (nplayer) {
        var numplayer = Number(nplayer);
        // if(numplayer >= 0){
        // var n = 0;

        for (let i = 0; i < this.avatarBlocks.length; i++) {
            let _sitted = this.avatarBlocks[i].getChildByName("sitted");
            let _sit = this.avatarBlocks[i].getChildByName("btnSit");
            let _avatar = _sitted.getChildByName("avatar").getChildByName("avatar");
            this.avatarBlocks[i].active = true;
            if (numplayer >= 2) {
                // _sitted.active = true;
                _avatar.active = true;
                _sit.active = false;
            } else if (numplayer == 1) {
                // _sitted.active = true;
                _avatar.active = true;
                _sit.active = false;
                numplayer--;
            } else {
                // _sitted.active = false;
                _avatar.active = false;
                _sit.active = true;
                numplayer--;
            }
        }
    },
    showCreateTable: function () {
        //chỉ hiện bg và button create
        // this.itemThongTin.active = false;
        this.backgroundNode.active = true;
        this.btnCreate.active = true;
        //hide avatar
        for (let i = 0; i < this.avatarBlocks.length; i++) {
            this.avatarBlocks[i].active = false;
        }
        this.iconMoney.active = false;
        // this.cuocNode.active = false;
        this.minCashContainer.active = false;
        this.sttContainer.active = false;
        this.watchNode.active = false;
        this.playerTotal.active = false;
        this.iconVs.active = false;

    },
    showMainItem: function () {
        // this.itemThongTin.active = true;
        this.backgroundNode.active = true;
        this.iconMoney.active = true;
        // this.cuocNode.active = true;
        this.minCashContainer.active = false;
        this.sttContainer.active = true;
        //hide avatar
        for (let i = 0; i < this.avatarBlocks.length; i++) {
            this.avatarBlocks[i].active = true;
        }
    },
    hideCreateTable: function () {
        this.btnCreate.active = false;
        // this.cuocNode.active = true;
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
    init: function (data) {
        this.data = data;
        if (this.data) {
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
                this.stt.string = i18n.t("button_title_table") + ":" + this.data.pos + "";
                this.playerTotal.active = false;
                if (Number(this.data.tableSize) >= 3) {
                    this.playerTotal.active = true;
                    this.playerTotal.getComponent(cc.Label).string = "(" + this.data.tableSize + ")";
                }
                if (Number(this.data.tableIndex) > 0) {
                    this.node.getChildByName('Stt').active = true;
                    this.sttTable.getComponent(cc.Label).string = i18n.t("button_title_table") + ":" + this.data.tableIndex;
                    this.minBet.string = Utils.Number.format(this.data.firstCashBet);
                    //&& Number(this.data.isPlaying) == 1
                    if (Number(this.data.tableSize) >= 2) {
                        this.watchNode.active = true;

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
                            this.iconMoney.getComponent(cc.Sprite).spriteFrame = coinFrame;
                        }
                    }
                }.bind(this));
            }
            Utils.Malicious.setColorMoney(this.bettingLevelTable);
        }
    },
    blockTableEvent: function (enable) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_ITEM_BAN_YEU_CAU_BLOCK_SU_KIEN_CLICK, true);
        customEvent.enableBlock = enable;
        this.node.dispatchEvent(customEvent);
    },
    join: function () {
        var tableData = this.data;
        if (tableData) {
            var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_YEU_CAU_TAO_BAN_CHOI, true);
            customEvent.tableData = this.data;
            customEvent.isReconnect = false;
            customEvent.isCreate = false;
            customEvent.isJoin = false;
            if ((Number(tableData.tableSize) > 0 && Number(tableData.tableSize) < Number(tableData.maxNumberPlayer)) || (tableData.tableSize == 0)) {
                if (Linker.ZONE) {
                    if (Number(tableData.firstCashBet) * 6 <= Number(DataAccess.Instance.getCurrentBalance(cc.Global.bidaMoneyType))) {
                        //this.blockTableEvent(true);
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
