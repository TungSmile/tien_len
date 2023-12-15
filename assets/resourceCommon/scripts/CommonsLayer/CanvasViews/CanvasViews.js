var Utils = require('Utils');
var Linker = require('Linker');
var Constant = require('Constant');
var Global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },
    onLoad() {
        this.node.on(Constant.GAME_COMMONS_EVENT.REQUEST_CANVAS_ENABLE_CHILD_BY_NAME, this.onEnableByChildName, this);

    },
    onEnableByChildName: function (event) {
        if (event) {
            if (event.nameChild) {
                var nameChild = event.nameChild;
                var child = cc.find("Canvas/" + nameChild);
                if (child) {
                    child.active = event.enableChild ? event.enableChild : false;
                }
            }
        }
    },
    start() {

    },

    // update (dt) {},
});
