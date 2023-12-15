var Linker = require('Linker');
var constantSukienDialog = require("constantSukienDialog");

cc.Class({
    extends: cc.Component,

    properties: {
        parrentNode: cc.Node,
        filterCatalogPrefab: cc.Prefab,
        filterContainer: cc.Node,
        dayCuaBanLabel: cc.Label,
        hangCuaBanLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },
    start() {

    },
    callEventAddDayLevel: function(myday, myhang){
        this.dayCuaBanLabel.string = myday;
        this.hangCuaBanLabel.string = myhang;
    },
    addFilterCatalog: function (data) {
        this.filterContainer.removeAllChildren(true);
        this.filterCatalog = cc.instantiate(this.filterCatalogPrefab);
        this.filterContainer.addChild(this.filterCatalog);

    },
    configFilterCatalog: function (data) {
        var filterCatalogScript = this.filterCatalog.getComponent("filterCatalog");
        var totalDataVinhDanh = this.getPreviousVinhDanhDate(3);
        filterCatalogScript.addDropDownItem({ data: totalDataVinhDanh, id: constantSukienDialog.vinhdanhtabID });
        filterCatalogScript.hideScrollView();
        filterCatalogScript.setTextButtonSelect(totalDataVinhDanh[0].btnText);

    },
    requestDisplayTodayDateContent: function (data, cb) {
        Linker.DataSuKien.taixiu_event.vinhdanh.date_data = null;
        if (Linker && Linker.DataSuKien.taixiu_event.vinhdanh.curent_data == null) {
            var date = this.getToday();
            var sql = Linker.Config.APP_API + "api-tai-xiu-du-day?uid=" +
                Linker.userData.userId +
                "&historyDate=" +
                date.y +
                "-" +
                date.m +
                "-" +
                date.d +
                "&day=daythang";
            var sqlNhanQua = Linker.Config.APP_API + "api-tai-xiu-du-day/nhanqua?uid=" +
                Linker.userData.userId +
                "&historyDate=" +
                date.y +
                "-" +
                date.m +
                "-" +
                date.d +
                "&day=daythang";
            var self = this;
            this.getData(sql, function (err, data) {
                var t = "Ngày " + date.today + " dây Thắng";
                var obj = { url: sql, title: t, data: data, linkNhanQua: sqlNhanQua };
                Linker.DataSuKien.taixiu_event.vinhdanh.today_data = obj;
                Linker.DataSuKien.taixiu_event.vinhdanh.curent_data = obj;
                cb(null, Linker.DataSuKien.taixiu_event.vinhdanh.curent_data);
            });
        } else {
            cb(null, Linker.DataSuKien.taixiu_event.vinhdanh.curent_data);
        }

    },
    getToday() {
        var today = new Date();
        var dd = String(today.getDate());
        var mm = String(today.getMonth() + 1);
        var yyyy = String(today.getFullYear());
        today = dd + "/" + mm + "/" + yyyy;
        return {
            d: dd,
            m: mm,
            y: yyyy,
            today: today
        }

    },
    getPreviousVinhDanhDate(numberDate) {
        var totalDateData = [];
        for (let i = 0; i < numberDate; i++) {
            var customDate = this.getPreViousDay(i);
            var dayThang = {
                btnText: "Ngày " + customDate.previousday + " dây Thắng",
                url: Linker.Config.APP_API + "api-tai-xiu-du-day?uid=" + Linker.userData.userId + "&historyDate=" + customDate.y + "-" + customDate.m + "-" + customDate.d + "&day=daythang",
                urlNhanQua: Linker.Config.APP_API + "api-tai-xiu-du-day/nhanqua?uid=" + Linker.userData.userId + "&historyDate=" + customDate.y + "-" + customDate.m + "-" + customDate.d + "&day=daythang"
            };
            var dayThua = {
                btnText: "Ngày " + customDate.previousday + " dây Thua",
                url: Linker.Config.APP_API + "api-tai-xiu-du-day?uid=" + Linker.userData.userId + "&historyDate=" + customDate.y + "-" + customDate.m + "-" + customDate.d + "&day=daythua",
                urlNhanQua: Linker.Config.APP_API + "api-tai-xiu-du-day/nhanqua?uid=" + Linker.userData.userId + "&historyDate=" + customDate.y + "-" + customDate.m + "-" + customDate.d + "&day=daythua"
            };
            totalDateData.push(dayThang, dayThua);
        }
        return totalDateData;

    },

    getPreviousHomQuaDate(numberDate) {
        var totalDateData = [];
        for (let i = 0; i < numberDate; i++) {
            var customDate = this.getPreViousDay(i);
            var dayThang = {
                btnText: "Ngày " + customDate.previousday + " dây Thắng",
                url: Linker.Config.APP_API + "api-tai-xiu-du-day/history?uid=" + Linker.userData.userId + "&historyDate=" + customDate.y + "-" + customDate.m + "-" + customDate.d + "&day=daythang",
                urlNhanQua: Linker.Config.APP_API + "api-tai-xiu-du-day/nhanqua?uid=" + Linker.userData.userId + "&historyDate=" + customDate.y + "-" + customDate.m + "-" + customDate.d + "&day=daythang"
            };
            var dayThua = {
                btnText: "Ngày " + customDate.previousday + " dây Thua",
                url: Linker.Config.APP_API + "api-tai-xiu-du-day/history?uid=" + Linker.userData.userId + "&historyDate=" + customDate.y + "-" + customDate.m + "-" + customDate.d + "&day=daythua",
                urlNhanQua: Linker.Config.APP_API + "api-tai-xiu-du-day/nhanqua?uid=" + Linker.userData.userId + "&historyDate=" + customDate.y + "-" + customDate.m + "-" + customDate.d + "&day=daythua"
            };
            totalDateData.push(dayThang, dayThua);
        }
        return totalDateData;

    },
    getPreViousDay(days) {
        var previousDay = new Date();
        previousDay.setDate(previousDay.getDate() - days);
        var dd = String(previousDay.getDate());
        var mm = String(previousDay.getMonth() + 1);
        var yyyy = String(previousDay.getFullYear());
        previousDay = dd + "/" + mm + "/" + yyyy;
        return {
            d: dd,
            m: mm,
            y: yyyy,
            previousday: previousDay
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
                cb(err, data);
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
        xhr.open("GET", url, true);
        xhr.send();

    }
    // update (dt) {},
});
