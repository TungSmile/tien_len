var Mask = require("Mask");
var Global = require("Global");

var PopupFactory = {

    vPopups: [],
    overlay: null,

    openPopup: function (path, data, callback, dataCB) {
        let self = this;
        let parent = cc.director.getScene().getComponentInChildren('XocDiaScene').popupNode;

        let noPopup = this.vPopups.length;

        if (noPopup === 0 && !this.overlay) {
            this.overlay = new Mask();
        }

        if (noPopup === 3) {
            return;
        }

        this.loadComp(path, function (node) {

            let compNew = node.getComponent("PopupInvite");
            if (noPopup > 0) {
                if (compNew) {
                    return;
                }
            }

            if (noPopup >= 0) {
                self.overlay.parent = parent;
            }

            node.parent = parent;
            self.vPopups.push(node);

            let comp = node.getComponent(cc.Component);
            comp.onOpen(data);

            //alert popup
            if (callback != undefined) {
                comp.setCallback(callback, dataCB);
            }
        });
    },

    closePopup: function (popup) {
        let noPopup = this.vPopups.length;
        if (0 === noPopup) return;

        var targetPopup;
        var parent = cc.director.getScene().getComponentInChildren('XocDiaScene').popupNode;

        // Passed popup was opened
        for (var i = 0; i < noPopup; i++) {
            targetPopup = this.vPopups[i];
            if (targetPopup === popup) {
                parent.removeChild(popup);
                this.vPopups.splice(i, 1);
                break;
            }
        }

        if (0 === this.vPopups.length) {
            this.overlay.parent = null;
        }
    },

    closeAllPopups: function () {
        var popup;
        var noPopup = this.vPopups.length;

        if (0 === noPopup) return;

        for (var i = noPopup - 1; i >= 0; i--) {
            popup = this.vPopups[i].getComponent(cc.Component);
            popup.closePopup();
        }
    },

    loadComp: function (url, cb) {
        var self = this;

        cc.resources.load(url, function (err, prefab) {
            var node = cc.instantiate(prefab);
            node.setPosition(cc.v2(0, 0));

            cb.call(self, node);
        });
    }
};

PopupFactory.Popup = {
    ALERT: "prefabs/PopupView",
    PURCHASE: "prefabs/PopupPurchase",
    TABLELIST: "prefabs/TableList",
    CHANGE_NAME: "prefabs/PopupChangeName",
    SETTING: "prefabs/PopupSetting",
    USERINFO: "prefabs/PopupUserInfo",
    HISTORY: "prefabs/PopupLog",
    GIFTCODE: "prefabs/PopupGiftCode",
    LISTAVATAR: "prefabs/PopupAvatars",
    GUIDE: "prefabs/PopupGuide",
    MAIL: "prefabs/PopupMail",
};

PopupFactory.AlertType = {
    NORMAL: 0,
    HIDE_CLOSE: 1,
    HIDE_OK: 2
};

module.exports = PopupFactory;
