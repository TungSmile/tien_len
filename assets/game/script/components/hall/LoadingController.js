// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Linker = require('Linker');
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

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.time = 0;
        this.isLoading = false;
        Linker.loadingController = this;
    },

    start () {
    },

    update(dt) {
        if (this.isLoading) {
            //this.time += dt;
            if (this.time > 4) {
                this.node.active = false;
                //cc.Global.showMessage("Vui lòng thử lại sau");
            } else {
                //cc.log("Loading__");
            } 
        }
        //cc.log("Loading", this.time, this.isLoading);
    },
    hide(){
        if(this.isLoading){
            this.node.active = false;
        }
    },
    show() {
        if(!this.isLoading) {
            this.node.active = true;
        }
    },
    onEnable() {
        this.isLoading = true;
        this.time = 0;
    },
    onDisable() {
        this.time = 0;
        this.isLoading = false;
    }
});
