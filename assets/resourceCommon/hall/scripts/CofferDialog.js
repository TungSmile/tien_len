var Linker = require('Linker');
var NewAudioManager = require('NewAudioManager');
var Utils = require('Utils');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        thelePrefab: cc.Prefab,
        historyHeading: cc.Prefab,
        itemNoHuGameBaiRowPrefab: cc.Prefab,
        list_spriteFrame: [cc.SpriteFrame],
        btn_guide: cc.Node,
        btn_history: cc.Node,
        mainContent: cc.Node,
        noHuGuide: {
            default: null,
            type: cc.JsonAsset
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },
    onEnable() {
        this.launchSukien();
    },
    initView() {
        this.btn_guide.getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[1];
        this.btn_history.getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[0];
        this.initGuideContent();
    },
    onClickBtn(event) {
        NewAudioManager.playClick();
        switch (event.currentTarget) {
            case this.btn_guide:
                this.btn_guide.getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[1];
                this.btn_history.getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[0];
                this.initGuideContent();
                break;

            case this.btn_history:
                this.btn_guide.getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[0];
                this.btn_history.getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[1];
                this.requestDataHistory();
                break;
            default:
                break;
        }
    },
    initGuideContent() {
        this.guideData = this.noHuGuide.json;
        var content = this.guideData.jackpot.gamebai;
        if (Linker.ZONE == 8 || Linker.ZONE == 84 || Linker.ZONE == 86) {
            content = this.guideData.jackpot.bida;
        } else if (Linker.ZONE == 45) {
            content = this.guideData.jackpot.soccer;
        }
        this.addContent(content);
    },
    addContent: function (data) {
        if (data) {
            this.mainContent.removeAllChildren(true);
            for (var i = 0; i < data.length; i++) {
                var guideLabelNode = new cc.Node();
                guideLabelNode.anchorX = 0;
                guideLabelNode.addComponent(cc.Label);
                guideLabelNode.addComponent(cc.Widget);
                guideLabelNode.width = 750;
                var guideLabel = guideLabelNode.getComponent(cc.Label);
                var guideLabelWidget = guideLabelNode.getComponent(cc.Widget);
                guideLabel.node = guideLabelNode;
                guideLabelWidget.node = guideLabelNode;

                guideLabelWidget.isAlignLeft = true;
                guideLabelWidget.isAlignRight = false;
                guideLabelWidget.left = 20;
                guideLabel.fontSize = data[i].size;
                guideLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;

                guideLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                guideLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;

                guideLabelNode.color = cc.color(data[i].color);
                guideLabel.string = data[i].string;
                this.mainContent.addChild(guideLabelNode);
            }
        }
    },
    initHistoryContent() {
        this.mainContent.removeAllChildren(true);
        var historyHeading = cc.instantiate(this.historyHeading);
        this.mainContent.addChild(historyHeading);
        var arrData = Linker.DataSuKien.nohubai_event.commonlisthu;
        if (arrData.length > 0) {
            //need add 2 line gap heading
            for (var i = 0; i < arrData.length; i++) {
                var hisItem = cc.instantiate(this.itemNoHuGameBaiRowPrefab);
                var hisItemScript = hisItem.getComponent("itemNoHuGameBaiRow");
                var stt = i + 1;
                var taikhoan = arrData[i].viewname;
                var zoneid = 0;
                cc.error("Nhiều game nên cần phải có zone id để hiển thị...", arrData[i]);
                var tengame = Utils.Malicious.getNameGameByZone(arrData[i].hubai_id);
                var phongchoi = arrData[i].room_money;
                // var bobai = arrData[i].noti;
                var phanthuong = arrData[i].money_win;
                var thoigian = arrData[i].createdtime;

                hisItemScript.setAccName(taikhoan);
                hisItemScript.setTime(thoigian);
                hisItemScript.setStt(stt);
                hisItemScript.setGameName(tengame);
                hisItemScript.setRoomId(phongchoi);
                // hisItemScript.setBonusReason(bobai);
                hisItemScript.setTotalBonus(phanthuong)
                hisItemScript.setContentBackgroundType();
                this.mainContent.addChild(hisItem);
            }
        }
    },
    start() {

    },
    launchSukien: function () {
        if (!Linker.DataSuKien || !Linker.DataSuKien.common || !Linker.DataSuKien.common.all_event || !(Linker.DataSuKien.common.all_event.length > 0)) {
            var self = this;
            cc.Global.showLoading();
            this.getDataSukien(function (err, data) {
                cc.Global.hideLoading();
                if (!err) {
                    self.initView();
                }
            });
        } else {
            this.initView();
        }
    },
    getDataSukien: function (cb) {
        if (Linker.Config.APP_API) {
            var sql = Linker.Config.APP_API + "api-the-le-su-kien";
            // var sql = "http://api.vipgame.com:3200/api-the-le-su-kien";
            var self = this;
            this.getData(sql, function (err, data) {
                if (!err) {
                    cc.Global.hideLoading();
                    Linker.DataSuKien.common.all_event = [];
                    Linker.DataSuKien.common.taixiu_event = data.taixiu_duday;
                    Linker.DataSuKien.common.nohubai_event = data.nohu_gamebai;
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            Linker.DataSuKien.common.all_event.push(data[key]);
                        }
                    }
                    cb(err, data);
                } else {
                    cb("Lỗi không thể load data thể lệ từ server ...\n" + sql, null);
                    cc.log("Lỗi không thể load data thể lệ từ server ...\n" + sql);
                    self.onBtnCloseClick();
                }
            });
        } else {
            cb("Lỗi không thể load data thể lệ từ server ...\n" + sql, null);
            cc.log("Lỗi không thể load data thể lệ từ server ...\n" + sql);
        }
    },
    getData(sql, cb) {
        var self = this;
        self.get(sql, (data) => {
            var err = null;
            if (data) {
                cb(err, data);
            } else {
                err = "Lỗi không thể load API sự kiện ...";
                cb(err, { error: 0, msg: err });
            }
        });
    },
    get(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('error', function () { })
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                if (callback) {
                    callback(JSON.parse(response));
                }
            }
        };
        xhr.onerror = function (e) {
            if (callback) {
                callback(null);
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    },
    requestDataHistory: function () {
        // var listhucommon = Linker.Config.APP_API + "list-no-hu";
        var listhucommon = Linker.Config.APP_API + "list-no-hu";
        Linker.DataSuKien.nohubai_event.commonlisthu = null;
        if (Linker && Linker.DataSuKien.nohubai_event.commonlisthu == null) {
            cc.Global.showLoading();
            this.get(listhucommon, (data) => {
                cc.Global.hideLoading();
                if (data) {
                    Linker.DataSuKien.nohubai_event.commonlisthu = data.listNoHu;
                    this.initHistoryContent();
                } else {

                    cc.Global.showMessage("Error, can not get history no hu game bai ...", null);
                }
            });
        } else {
            this.initHistoryContent();
        }
    },
    parseContent(text) {
        var data = text.split("<br>");
        return data;
    },
    onBtnCloseClick: function () {
        NewAudioManager.playClick();
        if (Linker.ZONE != 4 && Linker.ZONE != 5 && Linker.ZONE != 14) {
            var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
            customEvent.toggle = this.node.getComponent(cc.Toggle);
            this.node.dispatchEvent(customEvent);
        } else {
            this.node.active = false;
        }
    }
    // update (dt) {},
});
