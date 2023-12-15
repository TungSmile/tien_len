var Linker = require('Linker');
var constantSukienDialog = require("constantSukienDialog");

cc.Class({
    extends: cc.Component,

    properties: {
        stt: cc.Label,
        accName: cc.Label,
        gameName: cc.Label,
        roomId: cc.Label,
        bonusReason: cc.Label,
        bonusTotal: cc.Label,
        time: cc.Label,
        bgHeadingFrame: cc.SpriteFrame,
        bgContentFrame: cc.SpriteFrame,
        bgItemSprite: cc.Sprite,
        title: cc.Label
    },
    onLoad() { },

    start() {

    },
    setAccName(name) {
        this.accName.string = name;
        this.name.color = cc.color('#000000');
    },
    setTime(time) {
        this.time.string = time;
        this.time.color = cc.color('#000000');
    },
    setStt(stt) {
        this.stt.string = stt;
        this.stt.color = cc.color('#000000');
    },
    setGameName(gn) {
        this.gameName.string = gn;
        this.gn.color = cc.color('#000000');
    },
    setRoomId(rid) {
        this.roomId.string = rid;
        this.rid.color = cc.color('#000000');
    },
    setBonusReason(bnr) {
        this.bonusReason.string = bnr;
        this.bnr.color = cc.color('#000000');
    },
    setTotalBonus(tbn) {
        this.bonusTotal.string = tbn;
        this.tbn.color = cc.color('#000000');
    },
    setHeadingBackgroundType() {
        this.bgItemSprite.spriteFrame = this.bgHeadingFrame;
    },
    setContentBackgroundType() {
        this.bgItemSprite.spriteFrame = this.bgContentFrame;
    },
    setTitleTab: function(titletxt){
        this.title.string = titletxt;
    },
    requestDisplayLichSuNoHuTodayDateContent: function (data, cb) {
        var listhucommon = Linker.Config.APP_API + "list-no-hu";
        if (Linker && Linker.DataSuKien.nohubai_event.commonlisthu == null) {
            this.get(listhucommon, (data) => {
                if (data) {
                    Linker.DataSuKien.nohubai_event.commonlisthu = data.listNoHu;
                    cb(null, Linker.DataSuKien.nohubai_event.commonlisthu);
                } else {
                    cb("Error, can not get history no hu game bai ...", null);
                }
            });
        } else {
            cb(null, Linker.DataSuKien.nohubai_event.commonlisthu);
        }

    },
    requestDisplayThanhTichNoHuTodayDateContent: function (data, cb) {
        var mylisthu = Linker.Config.APP_API + "list-no-hu?uid=" + Linker.userData.userId;
        if (Linker.DataSuKien.nohubai_event.mylisthu == null) {
            this.get(mylisthu, (data) => {
                if (data) {
                    Linker.DataSuKien.nohubai_event.mylisthu = data.listNoHuMe;
                    cb(null, Linker.DataSuKien.nohubai_event.mylisthu);

                } else {
                    cb("Error, can not get thanh tich no hu game bai ...", null);
                }
            });
        } else {
            cb(null, Linker.DataSuKien.nohubai_event.mylisthu);
        }
    },
    get(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('error', function () { });
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                if (callback) {
                    callback(JSON.parse(response));
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }
    // update (dt) {},
});
