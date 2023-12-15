var Constant = require("Constant");
var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        tag: {
            type: Constant.HEADER_CONTROLLER_TAG,
            default: Constant.HEADER_CONTROLLER_TAG.HOME
        }
    },

    getTag: function () {
        return this.tag;
    },
    
    // update (dt) {},
});
