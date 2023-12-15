//var Global = require('Global');
var i18n = require('i18n');
var NewAudioManager = require("NewAudioManager");
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        btnLayer_OK: cc.Node,
        btnLayer_OKCancel: cc.Node,
        layoutCopyLabel: cc.Node
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
    },
    setString: function (msg) {
        this.label.string = i18n.t(msg);
    },
    setType: function (type) {
        switch (type) {
            case G.AT.OK: {
                this.btnLayer_OKCancel.active = false;
                break;
            }
            case G.AT.OK_CANCEL: {
                this.btnLayer_OK.active = false;
                break;
            }
            case G.AT.OK_CANCEL_BUTTON: {
                this.btnLayer_OK.active = false;
                break;
            }
            default: {
                cc.assert(false);
            }
        }
    },
    setCallBack(okCallback, cancelCallback) {
        this.okCallback = null;
        this.cancelCallback = null;
        if (okCallback && typeof (okCallback) === "function") {
            this.okCallback = okCallback;
        }
        if (cancelCallback && typeof (cancelCallback) === "function") {
            this.cancelCallback = cancelCallback;
        }
    },
    clickOKButton: function () {
        NewAudioManager.playClick();
        if (this.okCallback) {
            this.okCallback();
        }
        this.node.destroy();
    },
    clickCancelButton: function () {
        NewAudioManager.playClick();
        if (this.cancelCallback) {
            this.cancelCallback();
        }
        this.node.destroy();
    },
    setCopyViewname: function (data) {
        if (data) {
            if (data.text && data.btn) {
                var _this = this;
                cc.resources.load("font/system/arialbd", cc.TTFFont, function (err, font) {
                    if (!err) {
                        _this.layoutCopyLabel.active = true;
                        _this.layoutCopyLabel.removeAllChildren(true);
                        //copy user name
                        var nameNode = new cc.Node();
                        nameNode.color = cc.color("#FFF500");
                        var label = nameNode.addComponent(cc.Label);
                        label.cacheMode = cc.Label.CacheMode.NONE;
                        label.lineHeight = 25;
                        label.fontSize = 25;
                        label.font = font;
                        label.string = data.text;
                        _this.layoutCopyLabel.addChild(nameNode);
                        //btn copy
                        if (data.btn && cc.isValid(data.btn)) {
                            label.overflow = cc.Label.Overflow.NONE;
                            _this.layoutCopyLabel.addChild(data.btn);
                        }
                    } else {
                        _this.layoutCopyLabel.removeAllChildren(true);
                        _this.layoutCopyLabel.active = false;
                    }
                })

            }
        }

    },
    hideCopyViewname: function () {
        this.layoutCopyLabel.active = false;
        this.layoutCopyLabel.removeAllChildren(true);
    },
    onBtnCloseClick: function () {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        customEvent.toggle = this.node.getComponent(cc.Toggle);
        this.node.dispatchEvent(customEvent);
        this.node.destroy();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
