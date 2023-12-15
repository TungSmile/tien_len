var Linker = require('Linker');
var Utils = require('Utils');
var Global = require('Global');
var CommonSend = require('CommonSend');
var NewAudioManager = require("NewAudioManager");
var Constant = require('Constant');
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        day1Node: cc.Node,
        day1Toggle: cc.Toggle,
        day1HeadingSprite: cc.Sprite,

        day2Node: cc.Node,
        day2Toggle: cc.Toggle,
        day2HeadingSprite: cc.Sprite,

        day3Node: cc.Node,
        day3Toggle: cc.Toggle,
        day3HeadingSprite: cc.Sprite,

        day4Node: cc.Node,
        day4Toggle: cc.Toggle,
        day4HeadingSprite: cc.Sprite,

        day5Node: cc.Node,
        day5Toggle: cc.Toggle,
        day5HeadingSprite: cc.Sprite,

        day6Node: cc.Node,
        day6Toggle: cc.Toggle,
        day6HeadingSprite: cc.Sprite,

        day7Node: cc.Node,
        day7Toggle: cc.Toggle,
        day7HeadingSprite: cc.Sprite,

        btnHeadingOffSpriteFrame: cc.SpriteFrame,
        btnHeadingOnSpriteFrame: cc.SpriteFrame,
        greetingText: cc.Label,

        totalMoneyLevelBonus: cc.Label,
        totalMoneyFriendBonus: cc.Label,
        totalMoneyDatesBonus: cc.Label,
        totalBonus: cc.Label,

        lockBonusFriendNode: cc.Node,
        lockBonusLevelNode: cc.Node,
        lockBonusDateNode: cc.Node,

        watchVideoNode: cc.Node
    },
    onLoad() {
        this.node.active = false;
        this.watchVideoNode.active = false;
        this.addSocketEvent();
        this.setGreeting();
        if (Linker.userData.username) {
            var _this = this;
            this.getDailyGift(Linker.userData.username, Linker.userData.userId, function (err, data) {
                if (data.error >= 1) {
                    _this.configDailyGiftPopup(data.data);
                } else {
                    var msg = (Linker.gameLanguage == "vi") ? data.msg : "No data found, or account is not eligible for Lucky Day";
                    Linker.showMessage(msg);
                    _this.onClosePopup();
                }
            });
            this.removeSocketEvent();
        } else {
            this.getUserInfo();
        }
    },
    getUserInfo: function () {
        var test = CommonSend.getUserInfo(Linker.userData.userId);
        Linker.Socket.send(test);
    },
    start() {

    },
    onGetUserData: function (data) {
        if (Number(data.status) >= 1) {
            Linker.userData.username = data.displayName;
            var _this = this;
            this.getDailyGift(Linker.userData.username, Linker.userData.userId, function (err, data) {
                if (data.error >= 1) {
                    _this.configDailyGiftPopup(data.data);
                } else {
                    var msg = (Linker.gameLanguage == "vi") ? data.msg : "No data found, or account is not eligible for Lucky Day";
                    Linker.showMessage(msg);
                    _this.onClosePopup();
                }
            })
        }
    },
    configDailyGiftPopup: function (data) {
        if (data.hasOwnProperty("countDay") &&
            data.hasOwnProperty("moneyLevel") &&
            data.hasOwnProperty("moneyFriend") &&
            data.hasOwnProperty("totalBonus")) {
            this.node.active = true;
            this.activeDayAvailable(data.countDay);
            this.setMoneyBonusDate(data.totalBonus);
            this.setMoneyBounusLevel(data.moneyLevel);
            this.setMoneyBounusFriend(data.moneyFriend);
            this.setTotalBonus(data.totalBonus);
        }
    },
    setMoneyBonusDate: function (money) {
        if (money < 0) {
            this.totalMoneyDatesBonus.enabled = false;
            this.lockBonusDateNode.active = false;
        } else {
            this.totalMoneyDatesBonus.enabled = true;
            this.lockBonusDateNode.active = false;
            this.totalMoneyDatesBonus.string = Utils.Malicious.moneyWithFormat(money, '.');
        }

    },
    setMoneyBounusLevel: function (money) {
        if (money < 0) {
            this.lockBonusLevelNode.active = true;
            this.totalMoneyLevelBonus.enabled = false;
        } else {
            this.lockBonusLevelNode.active = false;
            this.totalMoneyLevelBonus.enabled = true;
            this.totalMoneyLevelBonus.string = Utils.Malicious.moneyWithFormat(money, '.');
        }

    },
    setMoneyBounusFriend: function (money) {
        if (money < 0) {
            this.lockBonusFriendNode.active = true;
            this.totalMoneyFriendBonus.enabled = false;
        } else {
            this.lockBonusFriendNode.active = false;
            this.totalMoneyFriendBonus.enabled = true;
            this.totalMoneyFriendBonus.string = Utils.Malicious.moneyWithFormat(money, '.');
        }

    },
    setTotalBonus: function (money) {
        this.totalBonus.string = Utils.Malicious.moneyWithFormat(money, '.');
    },
    activeDayAvailable: function (dates) {
        //unset
        for (var j = 0; j < 7; j++) {
            this.offToggle(this["day" + (j + 1) + "Toggle"]);
        }
        //set
        for (var i = 0; i < dates; i++) {
            this.onToggle(this["day" + (i + 1) + "Toggle"]);
        }
    },
    getDailyGift: function (username, userid, cb) {
        var url = Linker.Config.APP_API + "/api-login-day";
        // var url = "http://api.vipgame.com:3200" + "/api-login-day";
        var obj = '?uid=' + userid + "&username=" + username;
        this.postData(url, obj, function (err, data) {
            var err = null;
            if (!err) {
                if (cb) {
                    cb(null, data);
                }
            } else {
                if (cb) {
                    cb(true, null);
                }
                console.error("Lỗi không thể load data thể lệ từ server ...\n" + url);
            }
        });
    },
    onUpdatePhone: function (data) {

    },
    addSocketEvent() {
        Linker.Event.addEventListener(121001, this.onGetUserData, this);
        Linker.Event.addEventListener(12014, this.onUpdatePhone, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(121001, this.onGetUserData, this);
        Linker.Event.removeEventListener(12014, this.onUpdatePhone, this);
    },
    setGreeting: function (n) {
        if (n) {
            this.greetingText.string = n;
        } else {
            var name = Linker.userData.displayName.toString();
            this.greetingText.string = name;
        }
    },
    postData(url, obj, cb) {
        var self = this;
        self.postNoJson(url, obj, (data) => {
            var err = null;
            if (data) {
                cb(err, data);
            } else {
                err = "Lỗi không thể load API sự kiện ...";
                cb(err, data);
            }
        });
    },
    getSiteStatus: function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', url);
        xhr.onreadystatechange = function (e) {
            xhr.onreadystatechange = null;
            if (callback) {
                callback({ status: xhr.status, statusText: xhr.statusText });
            }
        };
        xhr.send();
    },
    post(url, data, callback) {
        this.getSiteStatus(url, function (statusObj) {
            if (statusObj) {
                if (statusObj.status) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", url, true);
                    // xhr.setRequestHeader("Content-type", "application/json");
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                            var json = JSON.parse(xhr.responseText);
                            if (callback) {
                                callback(json);
                            }
                        }
                    };
                    xhr.send(JSON.stringify(data));
                    cc.log("URL", url, "SENT", data);
                } else {
                    var statusText = (statusObj.status) ? statusObj.statusText : "net::ERR_NAME_NOT_RESOLVED";
                    cc.Global.showMessage(statusText);
                }
            }
        });

    },
    postNoJson(url, data, callback) {
        this.getSiteStatus(url, function (statusObj) {
            if (statusObj) {
                if (statusObj.status) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", url, true);
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    // xhr.setRequestHeader("Content-type", "application/json");
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                            var json = JSON.parse(xhr.responseText);
                            cc.log(xhr.responseText);
                            if (callback) {
                                callback(json);
                            }

                        } else {
                            //cc.log("ERROR")
                        }
                    }
                    // xhr.send(JSON.stringify(data));
                    xhr.send(data);
                    console.log("URL", url, "SENT", data);
                } else {
                    var statusText = (statusObj.status) ? statusObj.statusText : "net::ERR_NAME_NOT_RESOLVED";
                    cc.Global.showMessage(statusText);
                }
            }
        });
    },
    onToggle: function (toggle) {
        this.setHeadingDate(toggle);
    },
    offToggle: function (toggle) {
        this.unsetHeadingDate(toggle);
    },
    setHeadingDate: function (toggle) {
        toggle.isChecked = true;
        var headingSprite = this.getHeadingSpriteByToggle(toggle);
        if (headingSprite) {
            for (var i = 0; i < 7; i++) {
                var name = "day" + (i + 1) + "HeadingSprite";
                if (this[name] == headingSprite) {
                    this[name].spriteFrame = this.btnHeadingOnSpriteFrame;
                }
            }
        }
    },
    unsetHeadingDate: function (toggle) {
        toggle.isChecked = false;
        var headingSprite = this.getHeadingSpriteByToggle(toggle);
        if (headingSprite) {
            for (var i = 0; i < 7; i++) {
                var name = "day" + (i + 1) + "HeadingSprite";
                if (this[name] == headingSprite) {
                    this[name].spriteFrame = this.btnHeadingOffSpriteFrame;
                }
            }
        }
    },
    getHeadingSpriteByToggle: function (toggle) {
        switch (toggle) {
            case this.day1Toggle:
                return this.day1HeadingSprite;

            case this.day2Toggle:
                return this.day2HeadingSprite;

            case this.day3Toggle:
                return this.day3HeadingSprite;

            case this.day4Toggle:
                return this.day4HeadingSprite;

            case this.day5Toggle:
                return this.day5HeadingSprite;

            case this.day6Toggle:
                return this.day6HeadingSprite;

            case this.day7Toggle:
                return this.day7HeadingSprite;

            default:
                return null;
        }
    },
    onClosePopup: function () {
        if (Linker && Linker.Config) {
            Linker.Config.ISLOGINDAY = 0;
        }
        this.removeSocketEvent();
        this.node.destroy();
    },
    onClickNhanQua: function () {
        var url = Linker.Config.APP_API + "/api-login-day/process-bonus";
        // var url = "http://api.vipgame.com:3200/" + "api-login-day/process-bonus";
        var obj = '?uid=' + Linker.userData.userId + "&username=" + Linker.userData.username;
        var _this = this;
        var msg = i18n.t("message_confirm_receive_gift");
        var type = G.AT.OK_CANCEL;
        var okCallback = function () {
            this.postData(url, obj, function (err, data) {
                var err = null;
                if (!err) {
                    if (data.error >= 1) {
                        //xu ly khi nhan su kien thanh cong
                        cc.Global.showMessage(data.msg);
                    } else {
                        cc.Global.showMessage(data.msg);
                    }
                } else {
                    console.error("Lỗi không thể load data thể lệ từ server LuckyDay ...\n" + url);
                }
            });
        }.bind(this);
        var cancelCallback = function () { cc.error("Ở lại xíu đã...") };
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_HOP_THOAI_XAC_NHAN_NHAN_QUA, true);
        customEvent.data = {
            msg: msg,
            type: type,
            okCallback: okCallback,
            cancelCallback: cancelCallback
        }
        this.node.dispatchEvent(customEvent);
        // G.alert("Bạn có chắc chắn nhận phần quà này?", G.AT.OK_CANCEL, () => {
        //     _this.postData(url, obj, function (err, data) {
        //         var err = null;
        //         if (!err) {
        //             if (data.error >= 1) {
        //                 //xu ly khi nhan su kien thanh cong
        //                 Linker.showMessage(data.msg);
        //             } else {
        //                 Linker.showMessage(data.msg);
        //             }
        //         } else {
        //             console.error("Lỗi không thể load data thể lệ từ server LuckyDay ...\n" + url);
        //         }
        //     });
        // });
    },
    start() {

    },
    initAPILink: function () {
        // http://api.vipgame.com:3200/api-login-day;
        this.apiGetDailyGiftInfo = "";
        // http://api.vipgame.com:3200/api-login-day/process-bonus"
        this.apiGetDailyGiftReceive = "";
    }
    // update (dt) {},
});
