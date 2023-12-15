// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        nodeNhaMang:{
            default: null,
            type: cc.Node
        },

        nodeMenhGia: {
            default: null,
            type: cc.Node
        },

        scrollMenhGia: cc.Node,
        scrollNhaMang:cc.Node
    },
    
    onLoad() {
        this.nodeNhaMang.on(cc.Node.EventType.TOUCH_START, (event)=> {
            this.scrollNhaMang.active = !this.scrollNhaMang.active;  
        });
        this.nodeMenhGia.on(cc.Node.EventType.TOUCH_START, (event)=>{
            this.scrollMenhGia.active = !this.scrollMenhGia.active;
        });
    },

});
