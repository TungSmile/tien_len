var Global = require('Global');
var BasePopup = require('BasePopup');
var Constant = require('Constant');
var XocDiaSend = require('XocDiaSend');
var Linker = require('Linker');

cc.Class({
    extends: BasePopup,

    properties: {
        scrTable: cc.ScrollView,
        tablesTemp: cc.Node,

        spriteFrame: {
            type: cc.SpriteFrame,
            default: []
        }
    },

    onLoad: function () {
        this._super();

        Linker.Event.addEventListener(Constant.CMD.NEW_ENTER_ZONE, this.onEnterZone, this);
    },

    onOpen(data) {
        this._super();

        var str = Constant.CMD.NEW_ENTER_ZONE +
            Constant.SEPERATOR.N4 + 10 +
            Constant.SEPERATOR.ELEMENT + 0;

        XocDiaSend.sendRequest(str);

        this.matchID = data.matchID;
        this.node.active = true;
    },

    onEnterZone(data) {
        if (data.error) {
            cc.log(data.error);
            return;
        }

        this.scrTable.content.removeAllChildren();

        var tableList = data.tableList;

        for (var i = 0; i < tableList.length; i++) {
            var table = tableList[i];
            var buttonChild = cc.instantiate(this.tablesTemp);
            buttonChild.active = true;
            buttonChild.parent = this.scrTable.content;

            var bg = buttonChild.getComponent(cc.Sprite);
            bg.spriteFrame = this.spriteFrame[i % 2];

            var stt = buttonChild.getChildByName("txt_stt").getComponent(cc.Label);
            var txt_money = buttonChild.getChildByName("txt_money").getComponent(cc.Label);
            var numplayer = buttonChild.getChildByName("txt_numplayer").getComponent(cc.Label);

            stt.string = table.index;
            txt_money.string = table.min;
            numplayer.string = table.current + "/" + table.max;

            buttonChild.on(cc.Node.EventType.TOUCH_END, this.onBtnRoom.bind(this, table));
        }

        this.scrTable.scrollToTop(0.0, false);
    },

    closeView() {
        this.closePopup();
    },

    onBtnRoom(table) {
        cc.log(table);

        if (this.matchID == table.tableId) {
            cc.director.getScene().showToast("Bạn đang chơi ở bàn này rồi!!!");
            return;
        }

        this.closePopup();

        var str = Constant.CMD.MATCH_CANCEL +
            Constant.SEPERATOR.N4 + this.matchID;

        XocDiaSend.sendRequest(str);

        Global.data.table = table;
    }
});
