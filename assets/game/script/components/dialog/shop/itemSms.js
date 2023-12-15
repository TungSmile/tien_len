
var Linker = require('Linker');
var Global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
        sms: cc.Label,
        note: cc.RichText,
        btnNap: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {},

    update (dt) {},
    init(data) {
        //this.node.data = data;
        if (data) {
            
            var datas = data.split("|");
            if(datas.length > 0){
                this.note.string = datas[0];
                this.sms.string = datas[1];
            }
        }
    },
    clickBtnNapSMS(event){
      
        let titleNap  = "Vui lòng soạn tin: "+event.target.parent.getChildByName("sms").getComponent(cc.Label).string;
        if (Global.Announcement.AnnouncePrefab && Global.Announcement.GlobalNodePrefab) {
            var gNode = cc.instantiate(Global.Announcement.GlobalNodePrefab);
            var gNodeC = gNode.getComponent("GlobalNode");
            if (gNodeC) {
                Global.Announcement._addChild(gNode);
                gNodeC.alert(titleNap, G.AT.OK_CANCEL, () => {
                    Global.Announcement._removeAllChild();
                    Global.Announcement.AnnounceNode.active = false;
                    
                }, () => {
                    Global.Announcement._removeAllChild();
                    Global.Announcement.AnnounceNode.active = false;
                });
            }
        }
    },
});
