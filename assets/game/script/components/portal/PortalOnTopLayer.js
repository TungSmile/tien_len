var Linker = require('Linker');
var soccerConstant = require('soccerConstant');
var Constant = require('Constant');
var Utils = require('Utils');
const { data } = require('../../base/lib/Global');
cc.Class({
    extends: cc.Component,
    properties: {
        dialogAlertPrefab: cc.Prefab,
        copyBtnPrefab: cc.Prefab,
        loadingPrefab: cc.Prefab,
        dailyGift: cc.Prefab,
    },
    onKichHoatTaiKhoan: function () {
        if (Linker.Config.APP_API) {
            var url = Linker.Config.KHTELE;
            if (url.length > 0) {
                cc.sys.openURL(url);
            } else {
                cc.log("Địa chỉ API kích hoạt trống, hoặc không hợp lệ ...");
            }
        } else {
            //this.btnTeleActive.active = true;
            cc.log("Lỗi không thể load API kích hoạt tài khoản ...");
        }
    },
    onMoHopThoaiThongBaoChung: function (event) {
        if (event) {
            if (!this.dialogAlert || (this.dialogAlert && !cc.isValid(this.dialogAlert))) {
                this.dialogAlert = cc.instantiate(this.dialogAlertPrefab);
                this.node.addChild(this.dialogAlert);
                this.setToggleDialog(this.dialogAlert);
            }
            var displayName = Utils.Malicious.getDisplayName(Linker);
            if (displayName) {
                var dialogAlertScript = this.dialogAlert.getComponent("Alert");
                if (dialogAlertScript) {
                    var toggle = this.dialogAlert.getComponent(cc.Toggle);
                    if (toggle) {
                        var msg = event.popup_msg;
                        var type = event.popup_type;
                        var okCallback = event.popup_okCallback;
                        var cancelCallback = event.popup_cancelCallback;
                        dialogAlertScript.setString(msg);
                        dialogAlertScript.setType(type);
                        dialogAlertScript.setCallBack(okCallback, cancelCallback);
                        this.offLayerWithout(toggle);
                    }
                }
            }
        }
    },
    onMoPopupKichHoatTaiKhoan: function () {
        if (!this.dialogAlert || (this.dialogAlert && !cc.isValid(this.dialogAlert))) {
            this.dialogAlert = cc.instantiate(this.dialogAlertPrefab);
            this.node.addChild(this.dialogAlert);
            this.setToggleDialog(this.dialogAlert);
        }
        // var displayName = Utils.Malicious.getDisplayName(Linker);
        var code = Utils.Malicious.getCode(Linker);
        var dialogAlertScript = this.dialogAlert.getComponent("Alert");
        if (dialogAlertScript) {
            var toggle = this.dialogAlert.getComponent(cc.Toggle);
            if (toggle) {
                var msg = "Xác thực bảo mật SĐT qua ứng dụng Telegram nhận thưởng 3.000 Me";
                var type = G.AT.OK_CANCEL_BUTTON;
                var okCallback = this.onKichHoatTaiKhoan.bind(this);
                var cancelCallback = function () { cc.error("Ở lại xíu đã...") };
                var btn = cc.instantiate(this.copyBtnPrefab);
                var btnComponent = btn.getComponent("copyBtn");
                if (btnComponent) {
                    btnComponent.setCopyText(Linker.userData.code);
                }
                if (code) {
                    dialogAlertScript.setCopyViewname({
                        text: "Code: " + code,
                        btn: btn
                    });
                }
                dialogAlertScript.setString(msg);
                dialogAlertScript.setType(type);
                dialogAlertScript.setCallBack(okCallback, cancelCallback);
                this.offLayerWithout(toggle);
            }
        }
    },
    onShowLoading: function () {
        if (!this.dialogLoading || (this.dialogLoading && !cc.isValid(this.dialogLoading))) {
            this.dialogLoading = cc.instantiate(this.loadingPrefab);
            this.node.addChild(this.dialogLoading);
            this.setToggleDialog(this.dialogLoading);
        }
        var toggle = this.dialogLoading.getComponent(cc.Toggle);
        if (toggle) {
            this.unschedule(this.onHideLoading, this);
            this.scheduleOnce(this.onHideLoading, 5);
            this.offLayerWithout(toggle);
        }
    },
    onHideLoading: function () {
        if (!this.dialogLoading || (this.dialogLoading && !cc.isValid(this.dialogLoading))) {
            this.dialogLoading = cc.instantiate(this.loadingPrefab);
            this.node.addChild(this.dialogLoading);
            this.setToggleDialog(this.dialogLoading);
        }
        var toggle = this.dialogLoading.getComponent(cc.Toggle);
        if (toggle) {
            this.offLayer(toggle);
        }
    },
    //config
    setToggleDialog: function (dialog) {
        if (dialog) {
            if (!this.listPopupToggle) {
                this.listPopupToggle = [];
            }
            var toggle = dialog.getComponent(cc.Toggle);
            if (toggle) {
                this.listPopupToggle.push(toggle);
            }
        }
    },
    onClosePopup: function (event) {
        if (event) {
            if (event) {
                if (event.toggle) {
                    this.offLayer(event.toggle);
                }
            }
        }
    },
    offLayer: function (toggle) {
        if (toggle && cc.isValid(toggle)) {
            if (this.listPopupToggle) {
                for (var i = 0; i < this.listPopupToggle.length; i++) {
                    var currentToggle = this.listPopupToggle[i];
                    if (currentToggle && cc.isValid(currentToggle)) {
                        if (currentToggle == toggle) {
                            currentToggle.node.active = false;
                            this.activeCheckMark(currentToggle, false);
                        }
                    }

                }
            }
        }
    },
    offAllLayer: function () {
        if (this.listPopupToggle) {
            for (var i = 0; i < this.listPopupToggle.length; i++) {
                var currentToggle = this.listPopupToggle[i];
                if (currentToggle && cc.isValid(currentToggle)) {
                    if (currentToggle) {
                        currentToggle.node.active = false;
                        this.activeCheckMark(currentToggle, false);
                    }
                }

            }
        }
    },
    offLayerWithout: function (toggle) {
        if (toggle && cc.isValid(toggle)) {
            if (this.listPopupToggle) {
                for (var i = 0; i < this.listPopupToggle.length; i++) {
                    var currentToggle = this.listPopupToggle[i];
                    if (currentToggle && cc.isValid(currentToggle)) {
                        if (currentToggle != toggle) {
                            currentToggle.node.active = false;
                            this.activeCheckMark(currentToggle, false);
                        } else {
                            currentToggle.node.active = true;
                            this.activeCheckMark(currentToggle, true);
                        }
                    }
                }
            }
        }
    },
    activeCheckMark: function (toggle, enable) {
        if (toggle) {
            var checkMark = toggle.checkMark;
            if (checkMark) {
                if (enable) {
                    checkMark.enable = true;
                    toggle.check();

                } else {
                    checkMark.enable = false;
                    toggle.uncheck();
                }
            }
        }
    },

    onMoHopThoaiDailyGift: function (event) {
        if (event) {
            if (!this.dialogDailyGift || (this.dialogDailyGift && !cc.isValid(this.dialogDailyGift))) {
                this.dialogDailyGift = cc.instantiate(this.dailyGift);
                this.node.addChild(this.dialogDailyGift);
                this.setToggleDialog(this.dialogDailyGift);
            }
            var displayName = Utils.Malicious.getDisplayName(Linker);
            if (displayName) {
                var dialogAlertScript = this.dialogDailyGift.getComponent("DailyGift");
                if (dialogAlertScript) {
                    var toggle = this.dialogDailyGift.getComponent(cc.Toggle);
                    if (toggle) {
                        this.offLayerWithout(toggle);
                    }
                }
            }
        }
    },
    onMoHopThoaiXacNhanNhanQua: function (event) {
        if (event && event.data) {
            var data = event.data;
            if (!this.dialogAlert || (this.dialogAlert && !cc.isValid(this.dialogAlert))) {
                this.dialogAlert = cc.instantiate(this.dialogAlertPrefab);
                this.node.addChild(this.dialogAlert);
                this.setToggleDialog(this.dialogAlert);
            }
            // var displayName = Utils.Malicious.getDisplayName(Linker);
            // var code = Utils.Malicious.getCode(Linker);
            var dialogAlertScript = this.dialogAlert.getComponent("Alert");
            if (dialogAlertScript) {
                var toggle = this.dialogAlert.getComponent(cc.Toggle);
                if (toggle) {
                    var msg = data.msg;
                    var type = data.type;
                    var okCallback = data.okCallback;
                    var cancelCallback = data.cancelCallback;
                    dialogAlertScript.setString(msg);
                    dialogAlertScript.setType(type);
                    dialogAlertScript.setCallBack(okCallback, cancelCallback);
                    this.offLayerWithout(toggle);
                }
            }
        }
    },
    // update (dt) {},
});
