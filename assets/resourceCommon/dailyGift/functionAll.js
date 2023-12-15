var Constant = require("Constant");
var Linker = require("Linker");
var SdkBoxUtil = require('SdkBoxUtil');
//1 la co the nhan, 2 la da nhan, 0 la khong duoc nhan
var dailyGift = {
    gift: [
        {
            status: 1,
            time: null,
            deltaTime: 1800000, //don vi: miliseconds
            nextTime: null,
            money: 500,
            isActive: true
        },
        {
            status: -1,
            time: null,
            deltaTime: 1800000, //don vi: miliseconds
            nextTime: null,
            money: 1000,
            isActive: false
        },
        {
            status: -1,
            time: null,
            deltaTime: 1800000, //don vi: miliseconds
            nextTime: null,
            money: 2000,
            isActive: false
        },
        {
            status: -1,
            time: null,
            deltaTime: 1800000, //don vi: miliseconds
            nextTime: null,
            money: 3000,
            isActive: false
        },
        {
            status: -1,
            time: null,
            deltaTime: 1800000, //don vi: miliseconds
            nextTime: null,
            money: 5000,
            isActive: false
        },
    ],
    today: null,
    consecutiveLogin: {
        count: 1,
        date: null,
        money: 100000
    },
    get: {
        time: 0,
        xMoney: 1,
        money: 2000,
    }
}


var functionAll = cc.Class({
    extends: cc.Component,
    ctor(){
        this.coinsMode = null;
    },
    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.left = true;
    },

    onEnable () {
        this.createDailyGift();
    },
    onDisable () {
    },
    addTotal(bool) {
    },
    getTotal() {
        return this.total;
    },
    isWin(bool) {
        if (bool)
        {
            ++this.win;
        }
    },
    getWin() {
        return this.win;
    },
    setMoney(money) {
        this.Money = money;
        var tableGame2 = this.getData("tableGame2");
        tableGame2.computer3.Money = this.Money;
        this.callSubmitCore()
        this.setData("tableGame2", tableGame2);
    },
    getMoney() {
        return this.Money;
    },
    start () {
    },
    setData(key, value){
        if (key == "tableGame2" && "undefined" != typeof (sdkbox))
        {
            //this.moneyCurrent = value.computer3.Money;
        }
        // lưu dữ liệu
        cc.sys.localStorage.setItem([key],JSON.stringify(value));
    },
    getData( key){
        // lấy dữ liệu
       return JSON.parse(cc.sys.localStorage.getItem([key]));
    },
    removeData(key) {
        cc.sys.localStorage.removeItem(key);
    },
    createDailyGift() {
        var dailyGift1 = this.getData("dailyGift");
        if (dailyGift1)
        {
            return dailyGift1;
        }
        else
        {
            var cur = new Date().toString().split(" ");
            cur[4] = "00:00:00";
            cur = cur.join(" ");
            dailyGift.today = new Date(cur).getTime() + 86400000;
            dailyGift.consecutiveLogin.date = new Date(cur).getTime();
            dailyGift.get.time = Date.now();
            this.setData("dailyGift", dailyGift);
            return dailyGift;
        }
    },
    setReport(type){
        var report = this.getData("report");
        report[type] += 1;
        this.setData("report",report);
    },
    updateSetting(setting){
        this.setData("setting",setting);
    },
    moneyWithFormat: function (money, formatter) {
        if (!money) {
            return "";
        }
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, formatter)
    },
    // update (dt) {},

    callSubmitCore() {
        // var node = cc.find("Canvas/_Home");
        // if (!node)
        // {
        //     node = cc.find("Canvas/_GameController");
        // }
        // var pluginSdkboxPlay = node.getComponent("PluginSdkboxPlay");
        // if (pluginSdkboxPlay)
        // {
        //     pluginSdkboxPlay.submitCore(this.moneyCurrent);
        // }
        //SdkBoxUtil.submitCore(this.moneyCurrent);
    },
    btnShowLeaderboard() {
        SdkBoxUtil.showLeaderboard();
    },
    sendRequest(str) {
        var data = {r: []};
        data.r.push({v: str});
        this.send(JSON.stringify(data));
    },
    send(message) {
        Linker.Socket.send(message);
    },
    sendAdmob(type, comeplete) {
        // 1 la diem danh hang ngay
        // 2 la get now
        // 3 la get bonus
        var str = Constant.CMD.ADMOB +
            Constant.SEPERATOR.N4 + type +
            Constant.SEPERATOR.ELEMENT + comeplete;

        this.sendRequest(str);
    },
});

// module.exports = new functionAll();
