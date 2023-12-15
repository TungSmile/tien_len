var functionAll = require("functionAll");
var Linker = require("Linker");
var LabelLocalized = require("LabelLocalized");
var DataAccess = require("DataAccess");
var i18n = require('i18n');
const _30P = 1800000;
const _15P = 900000; 

var _DailyGift = cc.Class({
    extends: cc.Component,

    properties: {
        func: functionAll,
        txtMoney: cc.Label,
        txtTitle: cc.Label,
        txtGet: [cc.Label],
        betMoney: [cc.Label],
        txtText: [cc.Label],
        listGift: cc.Node,
        txtClock: cc.Label,
        btnGetNow: [cc.Node],
        btnGet: [cc.Node],
        block: cc.Node,
        txtTime: [cc.Label]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Linker._DailyGift = this;
    },

    onEnable () {
        this.setDefaultGift();
        this.time;
        this.node.opacity = 0;
        cc.tween(this.node).to(0.18, {opacity: 255}).start();
        var CountDownDailyGift = Linker.CountDownDailyGift;
        CountDownDailyGift.stopCountDown();
        for (var i = 0; i < this.btnGetNow.length; ++i)
        {
            var blockInputEvents = this.btnGetNow[i].getChildByName("blockInputEvents");
            if (blockInputEvents)
            {
                blockInputEvents.active = false;
            }
        }
        // this.resetDailyGift();
        var home = cc.find("Canvas/_Home");
        if (home)
        {
            home.opacity = 0;
        }
        var time = this.func.getData("dailyGift").today;
        this.countDown(time, this.txtClock.node, null);
        this.sendResultAdmob(5, 1);
        this.setDefaultTime();
    },
    setDefaultGift () {
        if (this.btnGetNow) {
            for (var i = 0; i < this.btnGetNow.length; i++) {
                if (this.btnGet[i] && this.btnGetNow[i]) {
                    this.btnGet[i].active = false;
                    this.btnGetNow[i].parent.active = false;
                }
            }
            if (this.btnGetNow[0]) this.btnGetNow[0].parent.active = true;
        }
    },
    setDefaultTime () {
        for (var i = 0; i < this.txtTime.length; i++) {
            if (this.txtTime[i]) {
                this.txtTime[i].node.active = false;
            }
        }
        if (this.txtTime[0]) this.txtTime[0].node.active = true;
        this.txtTime[0].string = cc.Global.getCountTimeStringByMillis(180000);
    },
    onDisable () {
        clearInterval(this.time);
        var home = cc.find("Canvas/_Home");
        if (home)
        {
            home.opacity = 255;
            home.getComponent("_Home").updateInfo();
        }
        var CountDownDailyGift = Linker.CountDownDailyGift;
        CountDownDailyGift.onEnable();
        clearInterval(this.countDownFunc);
        clearInterval(this.funcCountDown);
    },
    start () {

    },

    // update (dt) {},
    onGetMoneyShowAds: function (message) {
        if (!this.node.active)
        {
            return;
        }
        if (message.data.error == 0)
        {
            var money = +Linker.userData.userRealMoney;
            money += message.data.quan;
            Linker.userData.userRealMoney = "" + money;
            DataAccess.Instance.node.emit("update-user-data", Linker.userData);
            this.onGetClick(message.data.quan);
            this.showMoney(message.data.quan);
        }
        else if (message.data.error == 9)
        {
            this.showNotification();
        }
    },
    onClose() {
        cc.tween(this.node).to(0.15, {opacity: 0}).start();
        this.scheduleOnce(() => {
            this.node.active = false;
        }, 0.15);
    },
    onShowQC(event) {
        console.log("onShowQC::::");
        var blockInputEvents = event.target.getChildByName("blockInputEvents");
        if (blockInputEvents)
        {
            console.log("onShowQCset Linker::::");
            blockInputEvents.active = true;
            Linker.eventGetMoney = event;
        }
    },
    btnClickVideoAds(event) {
        if(Linker.MySdk){
            cc.Global.showMessage(i18n.t("Finding ADS"));
            this.onShowQC(event);
            Linker.MySdk.showRewarded();
            event.target.active = false;
        }
    },
    onGetClick: function(money) {
        var dailyGift = this.func.getData("dailyGift");
        money = "" + money;
        var node;
        if (dailyGift)
        {
            switch(money)
            {
                case "500":
                    var time = Date.now();
                    dailyGift.gift[0].time = time;
                    dailyGift.gift[0].status = 2;
                    dailyGift.gift[1].status = 0;
                    dailyGift.gift[0].nextTime = time + dailyGift.gift[0].deltaTime;
                    node = this.listGift.children[0];
                    node.getChildByName("shadow").active = true;
                    node.getChildByName("btn").active = false;
                    break;
                case "1000":
                    var time = Date.now();
                    dailyGift.gift[1].time = time;
                    dailyGift.gift[1].status = 2;
                    dailyGift.gift[2].status = 0;
                    dailyGift.gift[1].nextTime = time + dailyGift.gift[1].deltaTime;
                    node = this.listGift.children[1];
                    node.getChildByName("shadow").active = true;
                    node.getChildByName("btn").active = false;
                    break;
                case "2000":
                    var time = Date.now();
                    dailyGift.gift[2].time = time;
                    dailyGift.gift[2].status = 2;
                    dailyGift.gift[3].status = 0;
                    dailyGift.gift[2].nextTime = time + dailyGift.gift[2].deltaTime;
                    node = this.listGift.children[2];
                    node.getChildByName("shadow").active = true;
                    node.getChildByName("btn").active = false;
                    break;
                case "3000":
                    var time = Date.now();
                    dailyGift.gift[3].time = time;
                    dailyGift.gift[3].status = 2;
                    dailyGift.gift[4].status = 0;
                    dailyGift.gift[3].nextTime = time + dailyGift.gift[3].deltaTime;
                    node = this.listGift.children[3];
                    node.getChildByName("shadow").active = true;
                    node.getChildByName("btn").active = false;
                    break;
                case "4000":
                    var time = Date.now();
                    dailyGift.gift[4].time = time;
                    dailyGift.gift[4].status = 2;
                    dailyGift.gift[4].nextTime = time + dailyGift.gift[4].deltaTime;
                    node = this.listGift.children[4];
                    node.getChildByName("shadow").active = true;
                    node.getChildByName("btn").active = false;
                    break;
                default:
                    switch (money)
                    {
                        case "1000":
                            var time1 = Date.now();
                            dailyGift.gift[1].time = time1;
                            dailyGift.gift[1].status = 2;
                            dailyGift.gift[2].status = 0;
                            dailyGift.gift[1].nextTime = time1 + dailyGift.gift[1].deltaTime;
                            node = this.listGift.children[1];
                            node.parent.getChildByName("shadow").active = true;
                            node.parent.getChildByName("btn").active = false;
                            break;
                        case "2000":
                            var time1 = Date.now();
                            dailyGift.gift[2].time = time1;
                            dailyGift.gift[2].status = 2;
                            dailyGift.gift[3].status = 0;
                            dailyGift.gift[2].nextTime = time1 + dailyGift.gift[2].deltaTime;
                            node = this.listGift.children[2];
                            node.parent.getChildByName("shadow").active = true;
                            node.parent.getChildByName("btn").active = false;
                            break;
                        case "3000":
                            var time1 = Date.now();
                            dailyGift.gift[3].time = time1;
                            dailyGift.gift[3].status = 2;
                            dailyGift.gift[4].status = 0;
                            dailyGift.gift[3].nextTime = time1 + dailyGift.gift[3].deltaTime;
                            node = this.listGift.children[3];
                            node.parent.getChildByName("shadow").active = true;
                            node.parent.getChildByName("btn").active = false;
                            break;
                        case "4000":
                            var time1 = Date.now();
                            dailyGift.gift[4].time = time1;
                            dailyGift.gift[4].status = 2;
                            dailyGift.gift[4].nextTime = time1 + dailyGift.gift[4].deltaTime;
                            node = this.listGift.children[4];
                            node.parent.getChildByName("shadow").active = true;
                            node.parent.getChildByName("btn").active = false;
                            break;
                    } 
                    break;
            }
        }
        this.func.setData("dailyGift", dailyGift);
        // this.resetDailyGift();
    },

    resetDailyGift:function() {
        var dailyGift = this.func.getData("dailyGift");
        this.checkNewDay(dailyGift);
        dailyGift = this.func.getData("dailyGift");
        var index;
        //1 la co the nhan, 2 la da nhan, 0 la khong duoc nhan
        for (var i = 0; i < this.listGift.childrenCount; ++i)
        {
            if (dailyGift.gift[i].status == 2)
            {
                this.listGift.children[i].getChildByName("shadow").active = true;
                this.listGift.children[i].getChildByName("btn").active = false;
                // this.listGift.children[i].getChildByName("txtMoney").getComponent(cc.Label).string = setting.language == "en" ? "Finished" : "Đã nhận";

            }
            else if (dailyGift.gift[i].status == 1)
            {
                this.listGift.children[i].getChildByName("shadow").active = false;
                this.listGift.children[i].getChildByName("btn").active = true;
                this.listGift.children[i].getChildByName("btn").getChildByName("btn_get").active = true;
                this.listGift.children[i].getChildByName("btn").getChildByName("txt_countdown").active = false;
                this.listGift.children[i].getChildByName("txtMoney").getComponent(cc.Label).string = "+" + this.func.moneyWithFormat(dailyGift.gift[i].money, ".");
            }
            else if (dailyGift.gift[i].status == 0)
            {
                this.listGift.children[i].getChildByName("shadow").active = false;
                this.listGift.children[i].getChildByName("btn").active = true;
                this.listGift.children[i].getChildByName("btn").getChildByName("btn_get").active = false;
                var txtCountDown = this.listGift.children[i].getChildByName("btn").getChildByName("txt_countdown");
                this.listGift.children[i].getChildByName("txtMoney").getComponent(cc.Label).string = "+" + this.func.moneyWithFormat(dailyGift.gift[i].money, ".");
                txtCountDown.active = true;
                this.countDown(dailyGift.gift[i - 1].nextTime, this.listGift.children[i].getChildByName("btn").getChildByName("txt_countdown"), i);
            }
            else if (dailyGift.gift[i].status == -1)
            {
                this.listGift.children[i].getChildByName("shadow").active = false;
                this.listGift.children[i].getChildByName("btn").active = false;
            }

        }
    },

    countDown: function(time, label, index) {
        var x = time - Date.now();
        if (x <= 0)
        {
            if (index)
            {
                this.showBtnGetMoney(true, index);
            }
            else
            {
                var dailyGift = this.func.getData("dailyGift");
                dailyGift.today += 86400000;
                this.func.setData("dailyGift", dailyGift);
                this.countDown(dailyGift.today, label, null);
            }
        }
        var hour = Math.floor(x / (1000 * 60 * 60));
        var m = x % (1000 * 60 * 60);
        var minutes = Math.floor(m / (1000 * 60));
        var s = m % (1000 * 60);
        var seconds = Math.floor(s / 1000);
        if (!label.parent)
        {
            return;
        }
        label.getComponent(cc.Label).string = (hour < 10 ? "0" + hour : hour) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
        if (hour == "00" && minutes == "00" && seconds == "00")
        {
            return;
        }
        this.time = setInterval(() => {
            var x = time - Date.now();
            var hour = Math.floor(x / (1000 * 60 * 60));
            var m = x % (1000 * 60 * 60);
            var minutes = Math.floor(m / (1000 * 60));
            var s = m % (1000 * 60);
            var seconds = Math.floor(s / 1000);

            if (!label.parent)
            {
                return;
            }
            label.getComponent(cc.Label).string = (hour < 10 ? "0" + hour : hour) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
            if (hour == "00" && minutes == "00" && seconds == "00" || x < 0)
            {
                clearInterval(this.time);
                if (index)
                {
                    this.showBtnGetMoney(true, index);
                }
                else
                {
                    var dailyGift = this.func.getData("dailyGift");
                    dailyGift.today += 86400000;
                    this.func.setData("dailyGift", dailyGift);
                    this.countDown(dailyGift.today, label, null);
                }
            }
        }, 1000);
    },
    showBtnGetMoney: function (isShow, index) {
        this.btnGet[index].active = isShow;
        this.btnGetNow[index].parent.active = !isShow;
    },
    checkNewDay: function (dailyGift) {
        var delta = Date.now() - dailyGift.today;
        if (delta >= 0)
        {
            dailyGift = {
                gift: [
                    {
                        status: 1,
                        time: null,
                        deltaTime: 1800000, //don vi: miliseconds
                        nextTime: null,
                        money: 10000
                    },
                    {
                        status: -1,
                        time: null,
                        deltaTime: 1800000, //don vi: miliseconds
                        nextTime: null,
                        money: 20000
                    },
                    {
                        status: -1,
                        time: null,
                        deltaTime: 1800000, //don vi: miliseconds
                        nextTime: null,
                        money: 50000
                    },
                    {
                        status: -1,
                        time: null,
                        deltaTime: 1800000, //don vi: miliseconds
                        nextTime: null,
                        money: 100000
                    },
                    {
                        status: -1,
                        time: null,
                        deltaTime: 1800000, //don vi: miliseconds
                        nextTime: null,
                        money: 200000
                    },
                ],
                today: dailyGift.today + 86400000,
                consecutiveLogin: {
                    count: 1,
                    date: null,
                    money: 50000
                },
                get: {
                    time: 0,
                    xMoney: 1,
                    money: 2000,
                }
            }
            this.func.setData("dailyGift", dailyGift);
        }
    },
    showNotification() {
        var _this = this;
        this.block.active = true;
        var txtNoti = this.block.getChildByName("img_popup").getChildByName("txt_noti");
        txtNoti.getComponent("LabelLocalized").textKey = "noti1";
        var txtMoney = this.block.getChildByName("img_popup").getChildByName("txt_money");
        txtMoney.active = true;
        setTimeout(() => {
            _this.block.active = false;
        }, 2000)
    },
    sendResultAdmob: function(type = 3, complete = 1) {
        this.func.sendAdmob(type, complete);
        if (type == 3)
        {
            this.func.sendAdmob(5, complete);
        }
    },
    //send de nhan ngay
    send: function() {
        // 4 = 2, 5 = 3
        this.func.sendAdmob(3, 1);
        this.func.sendAdmob(5, 1);
    },
    showMoney:function(money) {
        var _this = this;
        this.block.active = true;
        var txtNoti = this.block.getChildByName("img_popup").getChildByName("txt_noti");
        // txtNoti.getComponent("LabelLocalized").textKey = "get1";
        var txtMoney = this.block.getChildByName("img_popup").getChildByName("txt_money");
        txtMoney.active = true;
        txtMoney.getComponent(cc.Label).string = money;
        setTimeout(() => {
            _this.block.active = false;
        }, 2000)
    },
    activeStepMoney: function(received) {
        var length = this.listGift.childrenCount;
        //Reset lai trang thai ban dau cua DailyGift
        for (var i = 0; i < length; ++i)
        {
            var btnGet = this.listGift.children[i].getChildByName("btn").getChildByName("btn_get");
            // var btnCountDown = this.listGift.children[i].getChildByName("btn").getChildByName("txt_countdown");
            var shadow = this.listGift.children[i].getChildByName("shadow");
            btnGet.active = false;
            // btnCountDown.active = false;
            shadow.active = false;
        }
        //
        for (var i = 0; i < length; ++i)
        {
            if (i < received.length)
            {
                var shadow = this.listGift.children[i].getChildByName("shadow");
                shadow.active = true;
            }
            else
            {
                var btnGet = this.listGift.children[i].getChildByName("btn").getChildByName("btn_get");
                var btnCountDown = this.listGift.children[i].getChildByName("btn").getChildByName("txt_countdown");
                //length = 0 la chua nhan goi qua nao
                if (received.length == 0)
                {
                    btnGet.active = true;
                    break;
                }
                var lengthReceived = received.length;
                var _time = received[lengthReceived - 1].createdtime;
                var dateTime = this.convertMessageTime(_time);
                _time = new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minutes, dateTime.seconds).getTime();
                var deltaTime = _time + _30P - Date.now();
                if (deltaTime <= 0)
                {
                    btnGet.active = true;
                }
                else
                {
                    btnCountDown.active = true;
                    this.countDownByTimeSteep(deltaTime, btnCountDown);
                }
                break;
            }
        }
    },
    //time : miliseconds
    startCountDown: function(time, node) {
        var _this = this;
        node.getComponent(cc.Label).string = cc.Global.getCountTimeStringByMillis(time);
        var delay = Math.floor(time / 1000);
        this.countDownFunc = setInterval(() => {
            time -= 1000;
            node.getComponent(cc.Label).string = cc.Global.getCountTimeStringByMillis(time);
            if (time <= 0)
            {
                clearInterval(_this.countDownFunc);
            }
        }, 1000);
    },
    convertMessageTime: function(str) {
        var temp = str.split("T");
        var date = temp[0].split("-");
        var time = temp[1].split(":");
        return {
            year: date[0],
            month: "" + (+date[1] - 1),
            day: date[2],
            hour: time[0],
            minutes: time[1],
            seconds: time[2]
        } 
    },

    countDownByTimeSteep: function(time, node) {
        // debugger
        var _this = this;
        var delay = time / 1000;

        var _hour = Math.floor(time / (1000 * 60 * 60));
        var _m = time % (1000 * 60 * 60);
        var _minutes = Math.floor(_m / (1000 * 60));
        var _s = _m % (1000 * 60);
        var _seconds = Math.floor(_s / 1000);
        var _txtTime = (_hour < 10 ? "0" + _hour : _hour) + ":" + (_minutes < 10 ? "0" + _minutes : _minutes) + ":" + (_seconds < 10 ? "0" + _seconds : _seconds);
        node.getComponent(cc.Label).string = _txtTime;

        this.funcCountDown = setInterval(() => {
            time -= 1000;
            var hour = Math.floor(time / (1000 * 60 * 60));
            var m = time % (1000 * 60 * 60);
            var minutes = Math.floor(m / (1000 * 60));
            var s = m % (1000 * 60);
            var seconds = Math.floor(s / 1000);
            var txtTime = (hour < 10 ? "0" + hour : hour) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
            node.getComponent(cc.Label).string = txtTime;
            if (hour == 0 && minutes == 0 && seconds == 0)
            {
                clearInterval(_this.funcCountDown);
            }
        }, 1000);
    }
});

module.exports = _DailyGift;
