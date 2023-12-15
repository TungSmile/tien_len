var Api = require('Api');
var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        itemMissionPrefab: cc.Prefab,
        content: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onEnable () {
        this.getListMissionApi();
    },

    getListMissionApi () {
        var self = this;
        cc.Global.showLoading();
        Api.get(Linker.Config.APP_API + "MissionUser/myMission/"+Linker.userData.userId, (data) => {
            cc.Global.hideLoading();
            if (data.error == "0") {
                self.createListMission(data.body);
            } else {
                Linker.showMessage(data.message);
            }
        });
    },

    createListMission (data) {
        this.content.removeAllChildren();
        for (var i = 0; i < data.length; i++) {
            if (data[i].received == 1) continue;
            var item = cc.instantiate(this.itemMissionPrefab);
            this.content.addChild(item);
            var itemJs = item.getComponent("itemMission");
            if (itemJs) {
                itemJs.init(data[i]);
            }
        }
    },

    clickBtnClose () {
        this.node.active = false;
    }
    // update (dt) {},
});
