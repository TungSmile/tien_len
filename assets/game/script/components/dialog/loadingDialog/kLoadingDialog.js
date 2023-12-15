var Linker = require('Linker');
cc.Class({
    extends: cc.Component,
    properties:{
        label: cc.Label,
    },
    onLoad: function() {
        Linker.kLoadingDialog = this;
        
    },
    onEnable: function() {
        var timeOut = 0;
        cc.Global.kCurrScene = cc.Global.getSceneName();
        // if(cc.Global.kCurrScene == 'HallScene' && Linker.isLogin == false){
        //     timeOut = 0;
        // }
        setTimeout(()=>{
            if(Linker.kLoadingDialog.node){
                if(Linker.kLoadingDialog.node.active){
                    Linker.kLoadingDialog.node.active = false;
                    //cc.Global.showMessage('Thao tác quá nhanh.Vui lòng thử lại.');
                }
            }
        },timeOut);
    },
    onDisable: function() {
        
    },
    show:function(str) {
        this.label.string = str;
        this.node.active = true;
    },
    hide: function() {
        this.node.active = false;
    }
})