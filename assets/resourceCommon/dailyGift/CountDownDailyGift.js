var functionAll = require("functionAll");
var Linker = require("Linker");
var DataAccess = require("DataAccess");

const _30P = 1800000;
const _15P = 900000; 

cc.Class({
    extends: cc.Component,

    properties: {
        btnWatchAds: cc.Node,
        btnBonus: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Linker.CountDownDailyGift = this;
        this.addEventListener();

    },

    onEnable: function() {
        // this.startCountDown();
        // this.dailyGift = functionAll.prototype.getData("dailyGift");
        // var _get = this.dailyGift.get;
        this.btnBonus.getChildByName("txt_time").active = false;
        this.btnBonus.getChildByName("txt").active = false;
        this.btnBonus.getChildByName("block").active = false;
        // this.checkAds(_get);
        functionAll.prototype.sendAdmob(4, 1);
        
    },
    onDisable: function() {
        clearInterval(this.time);
        clearInterval(this.funcCountDown);
        this.removeEventListener();
    },
    start () {

    },

    addEventListener: function() {
        Linker.Event.addEventListener(12015, this.onHandleCountDown, this);
    },
    removeEventListener: function() {
        cc.error("Remove events!");
        Linker.Event.removeEventListener(12015, this.onHandleCountDown, this);
    },

    // update (dt) {},

    startCountDown() {
        this.dailyGift = functionAll.prototype.getData("dailyGift");
        var length = this.dailyGift.gift.length;
        for (var i = 0; i < length; ++i)
        {
            var _gift = this.dailyGift.gift[i];
            var _preGift = this.dailyGift.gift[i - 1];
            if (_gift.status == 0)
            {
                this.countDown(_preGift.nextTime, this.btnWatchAds.getChildByName("txt_countdown"), i);
            }
        }
    },
    stopCountDown: function() {
        clearInterval(this.time);
        clearInterval(this.time);
        clearInterval(this.time);
        clearInterval(this.time);
        clearInterval(this.funcCountDown);
    },
    countDown: function(time, label, index) {
        var x = time - Date.now();
        if (x <= 0)
        {
            if (index)
            {
                label.getComponent("LabelLocalized").textKey = "text_get";
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
        if (hour <= 0 && minutes <= 0 && seconds <= 0)
        {
            return;
        }
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
            cc.error("dem!");
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
            label.active = true;
            if (hour == "00" && minutes == "00" && seconds == "00" || (hour <= 0 && minutes <= 0 && seconds <= 0))
            {
                clearInterval(this.time);
                if (index)
                {
                    var block = label.parent.getChildByName("block");
                    if (block)
                    {
                        block.active = false;
                    }
                    label.getComponent("LabelLocalized").textKey = "text_get";
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
    checkAds: function(bonus) {
        if (bonus.time < Date.now())
        {
            //show nhut nhan
            this.btnBonus.getChildByName("txt_time").active = false;
            this.btnBonus.getChildByName("txt").active = true;
            this.btnBonus.getChildByName("block").active = false;
        }
        else
        {
            //dem chenh lech
            this.countDown(bonus.time, this.btnBonus.getChildByName("txt_time"), null);
            this.btnBonus.getChildByName("txt_time").active = true;
            this.btnBonus.getChildByName("txt").active = false;
            this.btnBonus.getChildByName("block").active = true;
        }
    },

    showFreeCoins: function(message) {
        if (Linker._DailyGift)
        {
            if (Linker._DailyGift.node.active)
            {
                return;
            }
        }
        if (message.data.error == 0)
        {
            
        }
        else if (message.data.error == 99)
        {
            //nhan qua so lan quy dinh hoac chua het thoi gian de nhan tiep
            cc.error(message);
        }
    },
    onHandleCountDown: function(message) {
        var code = message.data.error;
        this.dailyGift = functionAll.prototype.getData("dailyGift");
        switch(code)
        {
            case 0:
                if (message.data.money)
                {
                    this.addMoney(message.data.money);
                }
                break;
            case 4:
                var msg = message.data.msg;    
                this.activeBonus(msg);
                break;
            case 5:
                var msg = message.data.msg;
                this.activeStepMoney(msg);
                break;
        }
    },
    addMoney: function(money) {
        var _get = this.dailyGift.get;
        var _money = +Linker.userData.userRealMoney;
        _money += parseInt(money);
        Linker.userData.userRealMoney = "" + _money;
        DataAccess.Instance.node.emit("update-user-data", Linker.userData);
        this.btnBonus.getChildByName("txt_time").active = true;
        this.btnBonus.getChildByName("txt").active = false;
        this.btnBonus.getChildByName("block").active = true;
        _get.time  = Date.now() + 1800000 + 900000 * (_get.xMoney - 1);
        ++_get.xMoney;
        this.countDown(_get.time, this.btnBonus.getChildByName("txt_time"), null);

        this.dailyGift.get = _get;
        functionAll.prototype.setData("dailyGift", this.dailyGift);
    },
    activeStepMoney: function(msg) {
        var _DailyGift = Linker._DailyGift;
        if (_DailyGift)
        {
            _DailyGift.activeStepMoney(msg);
        }
    },
    activeBonus: function(msg) {
        var length = msg.length;
        if (length == 0)
        {
            this.btnBonus.getChildByName("txt").active = true;
            this.btnBonus.getChildByName("txt_time").active = false;
            this.btnBonus.getChildByName("block").active = false;
            return;
        }
        var _time = msg[length - 1].createdtime;
        var dateTime = this.convertMessageTime(_time);
        _time = new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minutes, dateTime.seconds).getTime();
        var deltaTime = _time + (_30P + _15P * (length - 1)) - Date.now();
        if (deltaTime <= 0)
        {
            this.btnBonus.getChildByName("txt").active = true;
            this.btnBonus.getChildByName("txt_time").active = false;
            this.btnBonus.getChildByName("block").active = false;
        }
        else
        {
            this.btnBonus.getChildByName("txt").active = false;
            this.btnBonus.getChildByName("txt_time").active = true;
            this.btnBonus.getChildByName("block").active = true;
            this.countDownByTimeSteep(deltaTime, this.btnBonus.getChildByName("txt_time"));
        }

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
            cc.error("++");
            var txtTime = (hour < 10 ? "0" + hour : hour) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
            node.getComponent(cc.Label).string = txtTime;
            if (hour == 0 && minutes == 0 && seconds == 0)
            {
                clearInterval(_this.funcCountDown);
                node.parent.getChildByName("txt").active = true;
                node.parent.getChildByName("txt_time").active = false;
                node.parent.getChildByName("block").active = false;
            }
        }, 1000);
    }
});
