var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
var Constant = require('Constant');
var CommonSend = require('CommonSend');
var GameEvent = {
    commonEvent: function (thisObj) {
        //xy ly khi thoat app.
        if (cc.sys.isBrowser) {
            window.onbeforeunload = function () {
                console.log("onbeforeunload");
                if (Linker && Linker.Socket) {
                    Linker.Socket.close();
                }
            };
        }
        var that = this;
        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("cc.game.EVENT_HIDE");
            that.hideGame(thisObj);
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("cc.game.EVENT_SHOW");
            that.showGame(thisObj);
        });

        //end xu ly khi thoat app
    },
    hideGame: function (thisObj) {
        //console.log("vao request hideGame");
        Linker.isHiddenGame = true;
        if (Linker.ZONE == 14 && Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.tableId.length > 0) {
            if (Linker.MauBinhController) {
                Linker.MauBinhController.callBackHidden = setTimeout(() => {
                    if (Linker.isHiddenGame) {
                        if (Linker.MauBinhController && !Linker.MauBinhController.isLeaveTable) {
                            Linker.MauBinhController.leaveTableRequest();
                        } else {
                            console.log("ko co maubinh ctr");
                        }
                    }
                }, (60 * 1000));
                if (Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.tableId.length > 0) {
                    console.log("send status");
                    var dataSend = CommonSend.sendAppStatus(Linker.ZONE, Linker.CURRENT_TABLE.tableId, 1);
                    Linker.Socket.send(dataSend);
                }

            }


        }
    },
    showGame: function (thisObj) {
        Linker.isHiddenGame = false;
        if ( Linker.MauBinhController) {
            if (Linker.MauBinhController.callbackHidden) {
                Linker.MauBinhController.callbackHidden = null;
            }
            if (Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.tableId.length > 0) {
                console.log("send status showGame");
                var dataSend =  CommonSend.sendAppStatus(Linker.ZONE, Linker.CURRENT_TABLE.tableId, 2);
                Linker.Socket.send(dataSend);
            }
        }

    },
};
module.exports = GameEvent;