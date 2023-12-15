var Constant = require("Constant");
var Linker = require("Linker");
var GroupGame = new cc.Enum(Constant.ZONE_ID);
cc.Class({
    extends: cc.Component,

    properties: {
        groups: {
            type: [GroupGame],
            default: []
        }
    },
    isValidToShow: function () {
        for (var i = 0; i < this.groups.length; i++) {
            if (Number(this.groups[i] == Number(Linker.ZONE))) {
                return true;
            }
        }
        return false;
    },
    onLoad() {
        var sceneName = cc.Global.getSceneName();
        var _isShow = this.isValidToShow();
        if (_isShow && sceneName != "TrangChu") {
            this.node.active = true;
        } else {
            this.node.active = false;
        }
    },

    start() {

    },

    // update (dt) {},
});
