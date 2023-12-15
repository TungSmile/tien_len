var Utils = require('Utils');
var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var NewAudioManager = require('NewAudioManager');
var Constant = require('Constant');
var DataAccess = require('DataAccess');

cc.Class({
    extends: cc.Component,

    properties: {
        textSTT: cc.Label,
        textTienCuoc: cc.Label,
        textSoNguoiChoi: cc.Label,
        textToiThieu: cc.Label,
        textTrangThai: cc.Label,
        spriteNguoiChoi: cc.Sprite,

        spriteNgChoiLayout: cc.SpriteFrame,
        spriteNgChoiMiddle: cc.SpriteFrame,
        container: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    resetUI: function () {
        this.textSTT.string = "";
        this.textSoNguoiChoi.string = "";
        this.textTrangThai.string = "";
        this.textTienCuoc.string = "";
        this.textToiThieu.string = "";
        this.spriteNguoiChoi.fillRange = 0;
    },
    Init(data) {
        this.resetUI();
        if (data) {
            this.container.active = true;
            this.node.active = true;
            this.data = data;
            this.textSTT.string = data.pos;
            this.textSoNguoiChoi.string = data.tableSize + "/" + data.maxNumberPlayer;
            if (data.isPlaying == 0) {
                if (data.tableSize == 0) {
                    this.textTrangThai.string = "Trống";
                    this.data.status = 0;
                    this.textTrangThai.node.color = new cc.Color(255, 255, 255);
                } else if (data.tableSize > 0 && data.tableSize < data.maxNumberPlayer) {
                    this.textTrangThai.string = "Đang chờ";
                    this.data.status = 2;
                    this.textTrangThai.node.color = new cc.Color(255, 214, 0);
                } else {
                    this.textTrangThai.string = "Đầy";
                    this.data.status = 3;
                    this.textTrangThai.node.color = new cc.Color(255, 0, 0);
                }
            } else {
                this.textTrangThai.string = "Đang chơi";
                this.data.status = 1;
                this.textTrangThai.node.color = new cc.Color(0, 255, 0);
            }

            this.spriteNguoiChoi.fillRange = data.tableSize / data.maxNumberPlayer;
            this.textTienCuoc.string = Utils.Number.format(this.data.firstCashBet);
            if(Linker.ZONE == Constant.ZONE_ID.PHOM){
                this.textToiThieu.string = Utils.Number.format((data.firstCashBet) * 4);
            }else{
                this.textToiThieu.string = Utils.Number.format((data.firstCashBet) * 10);
            }
           
            this.node.on(cc.Node.EventType.TOUCH_END, this.join, this);
        } else {
            this.container.active = false;
            this.node.active = false;
        }
    },

    join: function () {
        cc.error("Yêu cầu tạo bàn ngay bây giờ...");
        NewAudioManager.playClick();
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

    blockTableEvent: function (enable) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_ITEM_BAN_YEU_CAU_BLOCK_SU_KIEN_CLICK, true);
        customEvent.enableBlock = enable;
        this.node.dispatchEvent(customEvent);
    },
});
