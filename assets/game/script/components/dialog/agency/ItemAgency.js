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
        textStt: cc.Label,
        textId: cc.Label,
        textDisplayName: cc.Label,
        textPhone: cc.Label,
        textAddress: cc.Label,
        iconFb: cc.Node,
        chuyenTienBtn: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    init() {
        var data = this.node.data;
        this.facebook = data.facebook
        if (data) {
            this.textStt.string = data.pos + 1;
            this.textId.string = data.uid;
            this.textDisplayName.string = data.viewname;
            this.textAddress.string = data.address;
            this.textPhone.string = data.phone.split(" - ")[0] + "\n" + data.phone.split(" - ")[1];
        }
    },
    fbBtnClick(event) {
        var url = this.node.data.facebook.trim();
        cc.sys.openURL(url)

        
    },
    chuyenTienBtnClick(event){
        if (Linker.AgencyDialog) {
            Linker.AgencyDialog.chuyenTienBtnClick(this.node.data);
        }
    }
    

    // update (dt) {},
});
