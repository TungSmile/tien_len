var constantSukienDialog = require("constantSukienDialog");
var Linker = require('Linker');
var Utils = require('Utils');
var Global = require("Global");
var i18n = require("i18n");
var NewAudioManager = require("NewAudioManager");
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        listBtnSukien: cc.Node,
        listBtnTabSukien: cc.Node,
        headingSukienContainer: cc.Node,
        mainContent: cc.Node,
        thelePrefab: cc.Prefab,
        btnSuKienPrefab: cc.Prefab,
        btnTabSukienPrefab: cc.Prefab,
        headingSukienPrefab: cc.Prefab,
        currentGameId: 90,
        currentTabId: 0,
        itemNhanQuaRowPrefab: cc.Prefab,
        itemVinhDanhRowPrefab: cc.Prefab,
        itemNoHuGameBaiRowPrefab: cc.Prefab,
        loadingLayerPrefab: cc.Prefab,
        gap: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.addCustomListenerEvent();
        this.getDataSukien(function (err, data) { });
        this.launchSukien();
        //step 1: config popup
        //step 2: run popup
    },
    onEnable: function () {
        // this.init();
    },
    init: function () {
        this.mainContent.removeAllChildren(true);
    },
    configPopup: function (data) {
        this.currentGameId = data.data.currentGameId;
        this.currentTabId = data.data.currentTabId;
    },
    launchSukien: function () {
        if (Linker.DataSuKien && Linker.DataSuKien.common && Linker.DataSuKien.common.all_event && Linker.DataSuKien.common.all_event.length > 0) {
            this.activeFirstTime();
            this.runSukienNow({});
        } else {
            var self = this;
            cc.Global.showLoading();
            this.getDataSukien(function (err, data) {
                cc.Global.hideLoading();
                if (!err) {
                    self.activeFirstTime();
                    self.runSukienNow(data);
                }
            });
        }
    },
    runSukienNow: function (data) {
        var mdata = Linker.DataSuKien.common.all_event;
        this.initListButtonLeft({ data: mdata });
        this.initTopButton({ data: [{ tabid: 0 }, { tabid: 1 }, { tabid: 2 }, { tabid: 3 }, { tabid: 4 }] });
        this.showPopupAsGameId();
    },
    getDataSukien: function (cb) {
        if (Linker.Config.APP_API) {
            var sql = Linker.Config.APP_API + "api-the-le-su-kien";
            // var sql = "http://api.vipgame.com:3200/" + "api-the-le-su-kien";
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
    activeFirstTime: function () {
        if (Linker.DataSuKien) {
            var events = Linker.DataSuKien.common.all_event;
            for (let i = 0; i < events.length; i++) {
                if (events[i].isOpen == 1) {
                    this.configPopup({
                        data: {
                            currentGameId: events[i].gameid,
                            currentTabId: 0
                        }
                    });
                    return;
                }
            }
        }
    },
    showPopupAsGameId: function () {
        switch (this.currentGameId) {
            case constantSukienDialog.taiXiuID:
                this.callEventTaiXiu();
                break;
            case constantSukienDialog.gameBaiID:
                this.callEventGameBai();
                break;
            case constantSukienDialog.taThanID:
                this.callTaThanEvent();
                break;
            case constantSukienDialog.thuyCungID:
                this.callThuyCungEvent();
                break;
            case constantSukienDialog.thinhKinhID:
                this.callThinhKinhEvent();
                break;
            case constantSukienDialog.longThanID:
                this.callLongThanEvent();
                break;
            default:
                this.callAnonymousEvent();
                break;

        }
    },
    addCustomListenerEvent: function () {
        this.node.on("EVENT_TAI_XIU", this.callEventTaiXiu, this);
        this.node.on("EVENT_GAME_BAI", this.callEventGameBai, this);
        this.node.on("EVENT_TA_THAN", this.callTaThanEvent, this);
        this.node.on("EVENT_THINH_KINH", this.callThinhKinhEvent, this);
        this.node.on("EVENT_THUY_CUNG", this.callThuyCungEvent, this);
        this.node.on("EVENT_LONG_THAN", this.callLongThanEvent, this);
        this.node.on("EVENT_LUCKY_DAY", this.callLuckyDayEvent, this);
        this.node.on("EVENT_ANONYMOUS", this.callAnonymousEvent, this);

        this.node.on("EVENT_THELE_TAB", this.callEventThele, this);
        this.node.on("EVENT_VINH_DANH_TAB", this.callEventVinhDanh, this);
        this.node.on("EVENT_HOM_QUA_TAB", this.callEvenHomQua, this);
        this.node.on("EVENT_LICH_SU_TAB", this.callEventLichSu, this);
        this.node.on("EVENT_THANH_TICH_TAB", this.callEventThanhTich, this);

        this.node.on("EVENT_DROP_DOWN_HOMQUA_TAI_XIU_ITEM", this.callEventSelectAnItemHomQuaTX, this);
        this.node.on("EVENT_DROP_DOWN_VINHDANH_TAI_XIU_ITEM", this.callEventSelectAnItemVinhDanhTX, this);

        this.node.on("EVENT_ADD_HOMQUA_TAI_XIU_CONTENT", this.callEventAddHomQuaTaiXiu, this);
        this.node.on("EVENT_ADD_VINHDANH_TAI_XIU_CONTENT", this.callEventAddVinhDanhTaiXiu, this);

        this.node.on("EVENT_ADD_LICH_SU_NO_HU_BAI_CONTENT", this.callEventAddLichSuNoHuGameBai, this);
        this.node.on("EVENT_ADD_THANH_TICH_NO_HU_BAI_CONTENT", this.callEventAddThanhTichNoHuGameBai, this);
    },
    callEventAddLichSuNoHuGameBai: function (event) {
        this.mainContent.removeAllChildren(true);
        var arrData = Linker.DataSuKien.nohubai_event.commonlisthu;
        if (arrData.length > 0) {
            //need add 2 line gap heading
            for (var i = 0; i < 2; i++) {
                var g = cc.instantiate(this.gap);
                this.mainContent.addChild(g);
            };
            for (var i = 0; i < arrData.length; i++) {
                var hisItem = cc.instantiate(this.itemNoHuGameBaiRowPrefab);
                var hisItemScript = hisItem.getComponent("itemNoHuGameBaiRow");
                var stt = i + 1;
                var taikhoan = arrData[i].viewname;
                var tengame = this.getNameGameBaiById(arrData[i].hubai_id);
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
    callEventAddThanhTichNoHuGameBai: function (event) {
        this.mainContent.removeAllChildren(true);
        var arrData = Linker.DataSuKien.nohubai_event.mylisthu;
        if (arrData.length > 0) {
            //need add 2 line gap heading
            for (var i = 0; i < 2; i++) {
                var g = cc.instantiate(this.gap);
                this.mainContent.addChild(g);
            };
            for (var i = 0; i < arrData.length; i++) {
                var hisItem = cc.instantiate(this.itemNoHuGameBaiRowPrefab);
                var hisItemScript = hisItem.getComponent("itemNoHuGameBaiRow");
                var stt = i + 1;
                var taikhoan = arrData[i].viewname;
                var tengame = this.getNameGameBaiById(arrData[i].hubai_id);
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
    getNameGameBaiById: function (id) {
        var name = "Tên game không hợp lệ";
        var cardGameType = {
            maubinhType: 14,
            tlmnType: 5,
            phomType: 4,
            samType: 37,
            xocdiaType: 10,
            bacayType: 11,
            liengType: 9,
            pokerType: 15
        };
        switch (id) {
            case cardGameType.maubinhType:
                name = "Mậu Binh";
                break;
            case cardGameType.tlmnType:
                name = "TLMN";
                break;
            case cardGameType.phomType:
                name = "Phỏm";
                break;
            case cardGameType.samType:
                name = "Sâm";
                break;
            case cardGameType.xocdiaType:
                name = "Xóc Đĩa";
                break;
            case cardGameType.bacayType:
                name = "Ba Cây";
                break;
            case cardGameType.liengType:
                name = "Liêng";
                break;
            case cardGameType.pokerType:
                name = "Poker";
                break;
            default:
                break;

        }
        return name;
    },
    callEventAddHomQuaTaiXiu: function (event) {
        this.mainContent.removeAllChildren(true);
        if (Linker.DataSuKien.taixiu_event.homqua.curent_data.data.data.length > 0) {
            //need add 2 line gap heading
            for (var i = 0; i < 2; i++) {
                var g = cc.instantiate(this.gap);
                this.mainContent.addChild(g);
            };
            for (var i = 0; i < Linker.DataSuKien.taixiu_event.homqua.curent_data.data.data.length; i++) {
                var data = Linker.DataSuKien.taixiu_event.homqua.curent_data.data.data[i];
                var item = cc.instantiate(this.itemNhanQuaRowPrefab);
                var itemc = item.getComponent("itemNhanQuaTaiXiuRow");
                itemc.setSTT(i + 1);
                itemc.setName(data.viewname);
                itemc.setDayThang(data.daythang);
                itemc.setDayThua(data.daythua);
                var giaithuongSplit = this.custom_textForm(data.giaithuong.toString());
                itemc.setGiaiThuong(giaithuongSplit);
                if (data.isgift == 0) {
                    //chưa nhận quà
                    itemc.setLinkRedirectNhanQua(Linker.DataSuKien.taixiu_event.homqua.curent_data.linkNhanQua);
                    itemc.showBtnNhanQua();
                    itemc.hideTextDaNhan();
                } else if (data.isgift == 1) {
                    //đang xử lý
                    itemc.hideButtonNhanQua();
                    itemc.setChoDuyenColor();
                    itemc.showTextDaNhan("Chờ Duyệt");
                } else if (data.isgift == 10) {
                    //đã nhận quà
                    itemc.hideButtonNhanQua();
                    itemc.setDaNhanColor();
                    itemc.showTextDaNhan("Đã Nhận");
                } else {
                    //lỗi
                    itemc.hideButtonNhanQua();
                    itemc.showTextDaNhan("");
                }
                this.mainContent.addChild(item);
            };
        }
    },
    callEventAddVinhDanhTaiXiu: function (event) {
        this.mainContent.removeAllChildren(true);
        if (Linker.DataSuKien.taixiu_event.vinhdanh.curent_data.data.data.length > 0) {
            //need add 2 line gap heading
            for (var i = 0; i < 2; i++) {
                var g = cc.instantiate(this.gap);
                this.mainContent.addChild(g);
            };
            var myData = Linker.DataSuKien.taixiu_event.vinhdanh.curent_data.data;
            for (var i = 0; i < Linker.DataSuKien.taixiu_event.vinhdanh.curent_data.data.data.length; i++) {
                var data = Linker.DataSuKien.taixiu_event.vinhdanh.curent_data.data.data[i];
                var item = cc.instantiate(this.itemVinhDanhRowPrefab);
                var itemc = item.getComponent("itemVinhDanhTaiXiuRow");
                itemc.setSTT(i + 1);
                itemc.setName(data.viewname);
                var day = data.daythang || data.daythua;
                itemc.setDay(day);
                var giaithuongSplit = this.custom_textForm(data.giaithuong.toString());
                var tongDatSplit = this.custom_textForm(data.totalbet.toString());
                itemc.setGiaiThuong(giaithuongSplit);
                if (data.uid == Linker.userData.userId && myData.myGift > 0) {
                    if (data.isgift == 0) {
                        //chưa nhận quà
                        itemc.setLinkRedirectNhanQua(Linker.DataSuKien.taixiu_event.vinhdanh.curent_data.linkNhanQua);
                        itemc.showBtnNhanQua();
                        itemc.hideTextDaNhan();
                    } else if (data.isgift == 1) {
                        //đang chờ duyệt
                        itemc.hideButtonNhanQua();
                        itemc.setChoDuyenColor();
                        itemc.showTextDaNhan("Chờ Duyệt");
                    } else if (data.isgift == 10) {
                        //đã nhận quà
                        itemc.hideButtonNhanQua();
                        itemc.setDaNhanColor();
                        itemc.showTextDaNhan("Đã Nhận");
                    } else {
                        //lỗi
                        itemc.hideButtonNhanQua();
                        itemc.showTextDaNhan("");
                    }
                } else {
                    itemc.hideTextDaNhan();
                    itemc.hideButtonNhanQua();
                }
                itemc.setTongDat(tongDatSplit);
                this.mainContent.addChild(item);
            };
            var heading = this.headingSukienContainer.getChildByName("headingSuKienDialog");
            var vinhDanhHeadingScript = heading.getChildByName("vinhdanhTaiXiuHeading").getComponent("vinhdanhTaiXiuHeading");
            vinhDanhHeadingScript.callEventAddDayLevel(myData.mydaytx, myData.mylevel);
        }
    },
    custom_textForm(str) {
        var text = '';
        var j = 0;
        for (var i = str.length - 1; i >= 0; i--) {
            j++;
            text = str[i] + text;
            if (j == 3 && i != 0) {
                text = "." + text;
                j = 0;
            }
        }
        return text;
    },
    callEventSelectAnItemHomQuaTX: function (event) {
        //yeu cau thay doi noi dung cua main content =)
        var tgs = event.target.getComponent("drpDownTaiXiuItem");
        var url = tgs.url;
        var title = event.target.getChildByName("dropDownItemText").getComponent(cc.Label).string;
        var data = this.checkHomQuaEventList(url);
        if (data.isExist == false) {
            this.showLoadingLayer("Vui lòng chờ trong giây lát ...");
            var self = this;
            this.getData(url, function (err, data) {
                self.hideLoadingLayer();
                if (!err) {
                    var obj = {
                        url: url,
                        title: title,
                        data: data,
                        linkNhanQua: tgs.urlNhanQua
                    };
                    var insideData = self.checkHomQuaEventList(url);
                    if (insideData.isExist == false) {
                        Linker.DataSuKien.taixiu_event.homqua.date_data.push(obj);
                        Linker.DataSuKien.taixiu_event.homqua.curent_data = obj;
                    } else {
                        Linker.DataSuKien.taixiu_event.homqua.curent_data = insideData;
                    }
                    self.callEventAddHomQuaTaiXiu();
                } else {
                    cc.log("Không thể load được sự kiện hòm quà ...");
                }
            });
        } else {
            Linker.DataSuKien.taixiu_event.homqua.curent_data = data;
            this.callEventAddHomQuaTaiXiu();
        }
    },
    callEventSelectAnItemVinhDanhTX: function (event) {
        //yeu cau thay doi noi dung cua main content =)
        var tgs = event.target.getComponent("drpDownTaiXiuItem");
        var url = tgs.url;
        var title = event.target.getChildByName("dropDownItemText").getComponent(cc.Label).string;
        var data = this.checkVinhDanhEventList(url);

        if (data.isExist == false) {
            this.showLoadingLayer("Vui lòng chờ trong giây lát ...");
            var self = this;
            this.getData(url, function (err, data) {
                self.hideLoadingLayer();
                if (!err) {
                    var obj = {
                        url: url,
                        title: title,
                        data: data,
                        linkNhanQua: tgs.urlNhanQua
                    };
                    var insideData = self.checkVinhDanhEventList(url);
                    if (insideData.isExist == false) {
                        Linker.DataSuKien.taixiu_event.vinhdanh.date_data.push(obj);
                        Linker.DataSuKien.taixiu_event.vinhdanh.curent_data = obj;
                    } else {
                        Linker.DataSuKien.taixiu_event.vinhdanh.curent_data = insideData;
                    }
                    self.callEventAddVinhDanhTaiXiu();
                } else {
                    cc.log("Không thể load được sự kiện vinh danh ...");
                }

            });
        } else {
            Linker.DataSuKien.taixiu_event.vinhdanh.curent_data = data;
            this.callEventAddVinhDanhTaiXiu();
        }
    },
    checkVinhDanhEventList: function (url) {
        var obj = {
            isExist: false,
            data: {}
        };
        if (Linker.DataSuKien.taixiu_event.vinhdanh.date_data == null) {
            Linker.DataSuKien.taixiu_event.vinhdanh.date_data = [];
        }
        var dateDataVinhDanh = Linker.DataSuKien.taixiu_event.vinhdanh.date_data;
        if (dateDataVinhDanh.length > 0) {
            for (var i = 0; i < dateDataVinhDanh.length; i++) {
                if (url == dateDataVinhDanh[i].url) {
                    obj.isExist = true;
                    obj.data = dateDataVinhDanh[i].data;
                    break;
                }
            };
        }
        return obj;
    },
    checkHomQuaEventList: function (url) {
        var obj = {
            isExist: false,
            data: {}
        };
        if (Linker.DataSuKien.taixiu_event.homqua.date_data == null) {
            Linker.DataSuKien.taixiu_event.homqua.date_data = [];
        }
        var dateDataHomQua = Linker.DataSuKien.taixiu_event.homqua.date_data;
        if (dateDataHomQua.length > 0) {
            for (var i = 0; i < dateDataHomQua.length; i++) {
                if (url == dateDataHomQua[i].url) {
                    obj.isExist = true;
                    obj.data = dateDataHomQua[i].data;
                    break;
                }
            };
        }
        return obj;
    },
    callEventThele: function (event) {
        // Utils.Malicious.playSound(null, "click");
        if (this.currentTabId != constantSukienDialog.theletabID || this.mainContent.getChildren().length == 0) {
            this.currentTabId = constantSukienDialog.theletabID;
            this.activeButtonLeft();
            this.activeButtonTop();
            this.setContentTheLe();
        }

    },
    callEventVinhDanh: function (event) {
        // Utils.Malicious.playSound(null, "click");
        if (this.currentTabId != constantSukienDialog.vinhdanhtabID || this.mainContent.getChildren().length == 0) {
            this.currentTabId = constantSukienDialog.vinhdanhtabID;
            this.activeButtonLeft();
            this.activeButtonTop();

            if (this.currentGameId == constantSukienDialog.taiXiuID) {
                this.setContentVinhDanh();
            } else {
                this.headingSukienContainer.removeAllChildren(true);
                this.mainContent.removeAllChildren(true);
            }
        }

    },
    showTabButton: function (id) {
        var children = this.listBtnTabSukien.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var childs = child.getComponent("btn_tabsukien");
            if (childs.idevent == id) {
                child.active = true;
                break;
            }
        }
    },
    hideTabButton: function (id) {
        var children = this.listBtnTabSukien.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var childs = child.getComponent("btn_tabsukien");
            if (childs.idevent == id) {
                child.active = false;
                break;
            }
        }
    },
    callEvenHomQua: function (event) {
        // Utils.Malicious.playSound(null, "click");
        if (this.currentTabId != constantSukienDialog.homquatabID || this.mainContent.getChildren().length == 0) {
            this.currentTabId = constantSukienDialog.homquatabID;
            this.activeButtonLeft();
            this.activeButtonTop();
            if (this.currentGameId == constantSukienDialog.taiXiuID) {
                this.setContentHomQua();

            } else {
                this.headingSukienContainer.removeAllChildren(true);
                this.mainContent.removeAllChildren(true);
            }
        }

    },
    callEventLichSu: function (event) {
        // Utils.Malicious.playSound(null, "click");
        if (this.currentTabId != constantSukienDialog.lichsutabID || this.mainContent.getChildren().length == 0) {
            this.currentTabId = constantSukienDialog.lichsutabID;
            this.activeButtonLeft();
            this.activeButtonTop();
            this.setContentLichSu();
        }
    },
    callEventThanhTich: function (event) {
        // Utils.Malicious.playSound(null, "click");
        if (this.currentTabId != constantSukienDialog.thanhtichtabID || this.mainContent.getChildren().length == 0) {
            this.currentTabId = constantSukienDialog.thanhtichtabID;
            this.activeButtonLeft();
            this.activeButtonTop();
            this.setContentThanhTich();
        }
    },
    callEventTaiXiu: function (event) {
        // Utils.Malicious.playSound(null, "click");
        //active moi mot button tai xiu thoi, con nhung cai khac khong active
        if (this.currentGameId != constantSukienDialog.taiXiuID || this.mainContent.getChildren().length == 0) {
            this.currentGameId = constantSukienDialog.taiXiuID;
            this.activeButtonLeft();
            this.activeButtonTop();
            this.showTabButton(constantSukienDialog.homquatabID);
            this.showTabButton(constantSukienDialog.vinhdanhtabID);
            this.hideTabButton(constantSukienDialog.lichsutabID);
            this.hideTabButton(constantSukienDialog.thanhtichtabID);
            this.setContentDisplayAsTabId();
        }
    },
    callEventGameBai: function (event) {
        // Utils.Malicious.playSound(null, "click");
        if (this.currentGameId != constantSukienDialog.gameBaiID || this.mainContent.getChildren().length == 0) {
            this.currentGameId = constantSukienDialog.gameBaiID;
            this.activeButtonLeft();
            this.activeButtonTop();
            this.showTabButton(constantSukienDialog.lichsutabID);
            this.showTabButton(constantSukienDialog.thanhtichtabID);
            this.hideTabButton(constantSukienDialog.homquatabID);
            this.hideTabButton(constantSukienDialog.vinhdanhtabID);
            this.setContentDisplayAsTabId();
        }
    },
    callTaThanEvent: function (event) {
        // Utils.Malicious.playSound(null, "click");
        if (this.currentGameId != constantSukienDialog.taThanID || this.mainContent.getChildren().length == 0) {
            this.currentGameId = constantSukienDialog.taThanID;
            this.activeButtonLeft();
            this.activeButtonTop();
            this.hideTabButton(constantSukienDialog.vinhdanhtabID);
            this.hideTabButton(constantSukienDialog.homquatabID);
            this.hideTabButton(constantSukienDialog.lichsutabID);
            this.hideTabButton(constantSukienDialog.thanhtichtabID);

            this.setContentDisplayAsTabId();
        }
    },
    callThinhKinhEvent: function (event) {
        // Utils.Malicious.playSound(null, "click");
        if (this.currentGameId != constantSukienDialog.thinhKinhID || this.mainContent.getChildren().length == 0) {
            this.currentGameId = constantSukienDialog.thinhKinhID;
            this.activeButtonLeft();
            this.activeButtonTop();
            this.hideTabButton(constantSukienDialog.vinhdanhtabID);
            this.hideTabButton(constantSukienDialog.homquatabID);
            this.hideTabButton(constantSukienDialog.lichsutabID);
            this.hideTabButton(constantSukienDialog.thanhtichtabID);
            this.setContentDisplayAsTabId();
        }
    },
    callThuyCungEvent: function (event) {
        // Utils.Malicious.playSound(null, "click");
        if (this.currentGameId != constantSukienDialog.thuyCungID || this.mainContent.getChildren().length == 0) {
            this.currentGameId = constantSukienDialog.thuyCungID;
            this.activeButtonLeft();
            this.activeButtonTop();
            this.hideTabButton(constantSukienDialog.vinhdanhtabID);
            this.hideTabButton(constantSukienDialog.homquatabID);
            this.hideTabButton(constantSukienDialog.lichsutabID);
            this.hideTabButton(constantSukienDialog.thanhtichtabID);
            this.setContentDisplayAsTabId();
        }
    },
    callLongThanEvent: function (event) {
        // Utils.Malicious.playSound(null, "click");
        if (this.currentGameId != constantSukienDialog.longThanID || this.mainContent.getChildren().length == 0) {
            this.currentGameId = constantSukienDialog.longThanID;
            this.activeButtonLeft();
            this.activeButtonTop();
            this.hideTabButton(constantSukienDialog.vinhdanhtabID);
            this.hideTabButton(constantSukienDialog.homquatabID);
            this.hideTabButton(constantSukienDialog.lichsutabID);
            this.hideTabButton(constantSukienDialog.thanhtichtabID);
            this.setContentDisplayAsTabId();
        }


    },
    callLuckyDayEvent: function (event) {
        // Utils.Malicious.playSound(null, "click");
        if (this.currentGameId != constantSukienDialog.luckyDayID || this.mainContent.getChildren().length == 0) {
            this.currentGameId = constantSukienDialog.luckyDayID;
            this.activeButtonLeft();
            this.activeButtonTop();
            this.hideTabButton(constantSukienDialog.vinhdanhtabID);
            this.hideTabButton(constantSukienDialog.homquatabID);
            this.hideTabButton(constantSukienDialog.lichsutabID);
            this.hideTabButton(constantSukienDialog.thanhtichtabID);
            this.setContentDisplayAsTabId();
        }
    },
    callAnonymousEvent: function (event) {
        // Utils.Malicious.playSound(null, "click");
        if (this.currentGameId != constantSukienDialog.anonymousID || this.mainContent.getChildren().length == 0) {
            this.currentGameId = this.getIdEventCurent();
            if (event && event.idevent) {
                var idevent = Number(event.idevent);
                if (isNaN(idevent) == false) {
                    this.currentGameId = idevent;
                }
            }
            this.activeButtonLeft();
            this.activeButtonTop();
            this.hideTabButton(constantSukienDialog.vinhdanhtabID);
            this.hideTabButton(constantSukienDialog.homquatabID);
            this.hideTabButton(constantSukienDialog.lichsutabID);
            this.hideTabButton(constantSukienDialog.thanhtichtabID);
            this.setContentDisplayAsTabId();
        }
    },
    activeButtonLeft: function () {
        var children = this.listBtnSukien.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var childs = child.getComponent("btn_itemsukien");
            if (childs.idevent == this.currentGameId) {
                childs.changetoOnStatus();
            } else {
                childs.changetoOffStatus();
            }
        }
    },
    activeButtonTop: function () {
        var children = this.listBtnTabSukien.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var childs = child.getComponent("btn_tabsukien");
            if (childs.idevent == this.currentTabId) {
                childs.changetoOnStatus();
            } else {
                childs.changetoOffStatus();
            }
        }
    },
    getIdEventCurent: function () {
        this.listBtnSukien.sortAllChildren();
        for (let i = 0; i < this.listBtnSukien.children.length; i++) {
            var bt = this.listBtnSukien.children[i];
            if (bt && cc.isValid(bt)) {
                var bts = bt.getComponent("btn_itemsukien");
                if (bts) {
                    var id = bts.getIDEvent();
                    if (isNaN(id) == false) {
                        return id;
                    }
                }
            }
        }
        return null;
    },
    initListButtonLeft: function (data) {
        this.listBtnSukien.removeAllChildren(true);
        for (var i = 0; i < data.data.length; i++) {
            //nếu data.gameid == 1 thì show, còn không thi thôi
            if (data.data[i].isOpen == 1) {
                var bt = cc.instantiate(this.btnSuKienPrefab);
                if (bt) {
                    var bts = bt.getComponent("btn_itemsukien");
                    bts.setIDEvent(data.data[i].gameid);
                    bts.setFrameAsGameID(i18n.t(data.data[i].tensukien));
                    bts.changetoOnStatus();
                    bts.configDispatchEvent();
                    this.listBtnSukien.addChild(bt);
                }

            }
            if (!data.data.gameid) {
                if (bt) {
                    // bts = this.bt.getComponent("gameid: 1");
                }
            }
            // if (data.data[i].isOpen == 1) {
            //     var bt = cc.instantiate(this.btnSuKienPrefab);
            //     var bts = bt.getComponent("btn_itemsukien");
            //     bts.setIDEvent(data.data[i].gameid);
            //     bts.setFrameAsGameID(i18n.t(data.data[i].tensukien));
            //     bts.changetoOnStatus();
            //     bts.configDispatchEvent();
            //     this.listBtnSukien.addChild(bt);
            // }
        }
    },
    initTopButton: function (data) {
        this.listBtnTabSukien.removeAllChildren(true);
        for (var i = 0; i < data.data.length; i++) {
            var bt = cc.instantiate(this.btnTabSukienPrefab);
            var bts = bt.getComponent("btn_tabsukien");
            bts.setIDEvent(data.data[i].tabid);
            bts.setFrameAsGameID();
            bts.changetoOnStatus();
            bts.configDispatchEvent();
            this.listBtnTabSukien.addChild(bt);
        }
    },
    setContentDisplayAsTabId: function () {
        switch (this.currentTabId) {
            case constantSukienDialog.theletabID:
                this.setContentTheLe();
                break;
            case constantSukienDialog.vinhdanhtabID:
                if (this.currentGameId == constantSukienDialog.taiXiuID) {
                    this.setContentVinhDanh();
                } else {
                    this.headingSukienContainer.removeAllChildren(true);
                    this.mainContent.removeAllChildren(true);
                    this.currentTabId = constantSukienDialog.theletabID;
                    this.activeButtonTop();
                    this.setContentDisplayAsTabId();

                }
                break;
            case constantSukienDialog.lichsutabID:
                if (this.currentGameId == constantSukienDialog.gameBaiID) {
                    this.setContentLichSu();
                } else {
                    this.headingSukienContainer.removeAllChildren(true);
                    this.mainContent.removeAllChildren(true);
                    this.currentTabId = constantSukienDialog.theletabID;
                    this.activeButtonTop();
                    this.setContentDisplayAsTabId();
                }
                break;
            case constantSukienDialog.thanhtichtabID:
                if (this.currentGameId == constantSukienDialog.gameBaiID) {
                    this.setContentThanhTich();
                } else {
                    this.headingSukienContainer.removeAllChildren(true);
                    this.mainContent.removeAllChildren(true);
                    this.currentTabId = constantSukienDialog.theletabID;
                    this.activeButtonTop();
                    this.setContentDisplayAsTabId();
                }
                break;
            case constantSukienDialog.homquatabID:
                if (this.currentGameId == constantSukienDialog.taiXiuID) {
                    this.setContentHomQua();
                } else {
                    this.headingSukienContainer.removeAllChildren(true);
                    this.mainContent.removeAllChildren(true);
                    this.currentTabId = constantSukienDialog.theletabID;
                    this.activeButtonTop();
                    this.setContentDisplayAsTabId();
                }
                break;
            default:
                this.currentTabId = constantSukienDialog.theletabID;;
                break;
        }
    },

    setContentTheLe: function () {
        this.headingSukienContainer.removeAllChildren(true);
        this.mainContent.removeAllChildren(true);

        var headingSukien = cc.instantiate(this.headingSukienPrefab);
        headingSukien.active = true;
        var headingSukiens = headingSukien.getComponent("headingSuKienDialog");
        this.headingSukienContainer.addChild(headingSukien);
        var isOpen = this.getIsOpenSukien();

        if (isOpen) {
            headingSukien.active = false;
            var thelecontentData = this.getTheLeGame();
            var thele = cc.instantiate(this.thelePrefab);
            var theles = thele.getComponent("thelecontentSukien");
            theles.setThoigianDetail(thelecontentData.thoigianapdung);
            theles.setTheLeDetail(thelecontentData.thele);
            theles.setGiaiThuongDetail(thelecontentData.giathuong);
            theles.setTenSuKien(thelecontentData.tensukien);
            theles.setDoiTuongThamGia(thelecontentData.doituongthamgia);
            this.mainContent.addChild(thele);
            //
        } else {
            var data = { mess: "Sự kiện chưa được mở ..." };
            headingSukiens.onMessagePopupSukienHeading(data);
            //tạm thời fix cứng
        }
    },
    getTheLeGame: function () {
        var data = {};
        if (Linker.DataSuKien && Linker.DataSuKien.common && Linker.DataSuKien.common.all_event && Linker.DataSuKien.common.all_event.length > 0) {
            for (var i = 0; i < Linker.DataSuKien.common.all_event.length; i++) {
                if (Linker.DataSuKien.common.all_event[i].gameid == this.currentGameId) {
                    data = Linker.DataSuKien.common.all_event[i];
                    break;
                }
            }
        } else {
            var self = this;
            this.getDataSukien(function (err, data) {
                if (!err) {
                    self.runSukienNow(data);
                } else {
                    cc.log("Không thể load được sự thể lệ ...");
                }

            });
        }
        return data;
    },
    getIsOpenSukien() {
        var isOpen = false;
        if (Linker.DataSuKien && Linker.DataSuKien.common && Linker.DataSuKien.common.all_event && Linker.DataSuKien.common.all_event.length > 0) {
            for (var i = 0; i < Linker.DataSuKien.common.all_event.length; i++) {
                if (Linker.DataSuKien.common.all_event[i].gameid == this.currentGameId && Linker.DataSuKien.common.all_event[i].isOpen == 1) {
                    isOpen = true;
                    break;
                } else {
                    isOpen = false;
                }
            }
        } else {
            var self = this;
            this.getDataSukien(function (err, data) {
                if (!err) {
                    self.runSukienNow(data);
                } else {
                    cc.log("Không thể mở sự kiện ...");
                }

            });
        }
        return isOpen;
    },
    setContentHomQua: function () {
        this.headingSukienContainer.removeAllChildren(true);
        var headingSukien = cc.instantiate(this.headingSukienPrefab);
        headingSukien.active = true;
        var headingSukiens = headingSukien.getComponent("headingSuKienDialog");
        this.headingSukienContainer.addChild(headingSukien);
        var isOpen = this.getIsOpenSukien();
        if (isOpen) {
            var data = { mess: "Đang mở tab hòm quà ..." };
            headingSukiens.onHomQuaTaiXiuSukienHeading(data);
            //do la dang o tab hom qua nen phai config heading nhe

        } else {
            var data = { mess: "Sự kiện chưa được mở ..." };
            headingSukiens.onMessagePopupSukienHeading(data);
        }
    },
    setContentVinhDanh: function () {
        this.headingSukienContainer.removeAllChildren(true);
        var headingSukien = cc.instantiate(this.headingSukienPrefab);
        headingSukien.active = true;
        var headingSukiens = headingSukien.getComponent("headingSuKienDialog");
        this.headingSukienContainer.addChild(headingSukien);
        var isOpen = this.getIsOpenSukien();
        if (isOpen) {
            var data = { mess: "Đang mở tab vinh danh ..." };
            headingSukiens.onVinhDanhTaiXiuSukienHeading(data);
        } else {
            var data = { mess: "Sự kiện chưa được mở ..." };
            headingSukiens.onMessagePopupSukienHeading(data);
        }
    },
    setContentLichSu: function () {
        this.headingSukienContainer.removeAllChildren(true);
        var headingSukien = cc.instantiate(this.headingSukienPrefab);
        headingSukien.active = true;
        var headingSukiens = headingSukien.getComponent("headingSuKienDialog");
        this.headingSukienContainer.addChild(headingSukien);
        var isOpen = this.getIsOpenSukien();
        if (isOpen) {
            var data = { mess: "Đang mở tab lịch sử ..." };
            headingSukiens.onLichSuNoHuBaiSukienHeading(data);
        } else {
            var data = { mess: "Sự kiện chưa được mở ..." };
            headingSukiens.onMessagePopupSukienHeading(data);
        }
    },
    setContentThanhTich: function () {
        this.headingSukienContainer.removeAllChildren(true);
        var headingSukien = cc.instantiate(this.headingSukienPrefab);
        headingSukien.active = true;
        var headingSukiens = headingSukien.getComponent("headingSuKienDialog");
        this.headingSukienContainer.addChild(headingSukien);
        var isOpen = this.getIsOpenSukien();
        if (isOpen) {
            var data = { mess: "Đang mở tab thành tích ..." };
            headingSukiens.onThanhTichNoHuBaiSukienHeading(data);
        } else {
            var data = { mess: "Sự kiện chưa được mở ..." };
            headingSukiens.onMessagePopupSukienHeading(data);
        }

    },
    start() {

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
    showLoadingLayer: function (mess) {
        if (!this.loadingLayer || !this.loadingLayer.isValid) {
            this.loadingLayer = cc.instantiate(this.loadingLayerPrefab);
            this.loadingLayer.position = cc.v2(0, 0);
            this.loadingLayer.active = true;
            var loadingJS = this.loadingLayer.getComponent("ChanLoadingDialog");
            if (loadingJS) {
                loadingJS.show(mess);
            } else {
                // cc.Global.showMessage(mess);
            }
            cc.find("Canvas").addChild(this.loadingLayer);
            this.loadingLayer.zIndex = Utils.Malicious.getMaxZindex();

        } else if (this.loadingLayer && this.loadingLayer.isValid && this.loadingLayer.active == false) {
            this.loadingLayer.active = true;
            var loadingJS = this.loadingLayer.getComponent("ChanLoadingDialog");
            if (loadingJS) {
                loadingJS.show(mess);
            } else {
                // cc.Global.showMessage(mess);
            }
            this.loadingLayer.zIndex = Utils.Malicious.getMaxZindex();
        }
        if (this.loadingLayer.active == true) {
            var self = this;
            setTimeout(function () {
                if (self.loadingLayer && self.loadingLayer.isValid) {
                    if (self.loadingLayer.active) {
                        self.loadingLayer.active = false;
                    }
                } else {
                    cc.log("Lỗi xảy ra, không thể khởi tạo loading layer ...");
                }
            }, 6000);
        }

    },
    hideLoadingLayer: function () {
        if (!this.loadingLayer || !this.loadingLayer.isValid) {
            this.loadingLayer = cc.instantiate(this.loadingLayerPrefab);
            this.loadingLayer.position = cc.v2(0, 0);
            this.loadingLayer.active = false;
            cc.find("Canvas").addChild(this.loadingLayer);
            this.loadingLayer.zIndex = Utils.Malicious.getMaxZindex();
        } else if (this.loadingLayer && this.loadingLayer.isValid && this.loadingLayer.active == true) {
            this.loadingLayer.active = false;
            this.loadingLayer.zIndex = Utils.Malicious.getMaxZindex();
        }
    },

    hideLoading: function () {
        var childs = cc.find('Canvas').children;
        for (let i = 0; i < childs.length; i++) {
            if (childs[i].name == "LoadingDialog") {
                childs[i].destroy();
            }
        }
    },
    onBtnCloseClick: function () {
        NewAudioManager.playClick();
        this.node.active = false;
        // NewAudioManager.playClick();
        // var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        // customEvent.toggle = this.node.getComponent(cc.Toggle);
        // this.node.dispatchEvent(customEvent);
    }

    // update (dt) {},
});
