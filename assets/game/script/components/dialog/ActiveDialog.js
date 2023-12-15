var Linker = require('Linker')
var NativeBridge = require("NativeBridge");
var FacebookSDK = require("FacebookSDK");
cc.Class({
    extends:cc.Component,
    properties:{

    },
    onLoad:function(){

    },
    btnOkClick(){
        if (cc.sys.isBrowser) {
            FacebookSDK.smsLogin();
        }
        else {
            NativeBridge.smsLogin();
        }
        this.node.active = false;
    },
    btnCancelClick(){
        this.node.active = false;
    }
})