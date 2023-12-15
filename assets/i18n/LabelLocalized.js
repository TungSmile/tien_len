const i18n = require('i18n');
const BiDaConstant = require('BiDaConstant');
const Global = require('../game/script/base/lib/Global');
cc.Class({
    extends: cc.Label,

    properties: {
        textKey: {
            default: 'TEXT_KEY',
            multiline: true,
            tooltip: 'Enter i18n key here',
            notify: function () {
                this.string = this.localizedString;
            }
        },
        localizedString: {
            override: true,
            tooltip: 'Here shows the localized string of Text Key',
            get: function () {
                return i18n.t(this.textKey);
            },
            set: function (value) {
                this.textKey = value;
                if (CC_EDITOR) {
                    cc.warn('Please set label text key in Text Key property.');
                }
            }
        }
    },

    onLoad() {
        this._super();
        if (this.font && cc.isValid(this.font)) {
            this.font = null;
        }
        this.checkFontValid(function (err, data) {
            if (!err) {
                if (BiDaConstant.METHODS.createListenerNode()) {
                    BiDaConstant.METHODS.createListenerNode().on("changeLanguage", this.onChangeLanguage, this);
                }
                if (this.localizedString) {
                    this.string = this.localizedString;
                }
            }
        }.bind(this));
    },
    checkFontValid(cb) {
        if (this.font instanceof cc.TTFFont) {
            cc.log("Font hệ thống không cần thay đổi gì thêm, ...");
            if (cb) {
                cb(null, {});
            }
        } else if (this.font instanceof cc.BitmapFont) {
            cc.warn("Font custom BMFont chuyển hết sang font mặc định, ...");
            if (Global.fontSystem && cc.isValid(Global.fontSystem)) {
                this.font = Global.fontSystem;
                //style label
                this.enableBold = true;
                if (cb) {
                    cb(null, {})
                }
            } else {
                this.changeToFontDefault(function (error, systemFont) {
                    if (!error) {
                        Global.fontSystem = systemFont;
                        this.font = systemFont;
                        //style label
                        this.enableBold = true;
                        if (cb) {
                            cb(null, {})
                        }
                    }
                }.bind(this));
            }

        } else {
            if (cb) {
                cb(null, {});
            }
        }
    },
    changeToFontDefault: function (cb) {
        this.loadResource("fonts/arialbd", cc.TTFFont, function (error, asset) {
            if (!error) {
                if (cb) {
                    cb(null, asset);
                }
            } else {
                cc.error("Lỗi không thể load được resource...");
                cc.error(error);
                if (cb) {
                    cb(error, null);
                }
            }
        })
    },
    loadResource: function (path, type, cb) {
        if (path && type) {
            cc.loader.loadRes(path, type, function (error, asset) {
                if (!error) {
                    if (cb) {
                        cb(null, asset);
                    }
                } else {
                    if (cb) {
                        cb(error, null);
                    }
                }
            })
        }
    },
    onChangeLanguage() {
        this.string = i18n.t(this.textKey);

    }
});
