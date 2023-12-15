var Utils = require("Utils");
var Linker = require("Linker");
var Api = require('Api');
var NewAudioManager = require("NewAudioManager");
var DataAccess = require('DataAccess');
cc.Class({
    extends: cc.Component,

    properties: {
        itemMissionPrefab: cc.Prefab,
        content: cc.Node,
        foodAtlas: cc.SpriteAtlas,
    },

    onLoad() {
        Linker.Mission = this;
        this.loadAtlas();
    },

    start() {

    },

    onEnable() {
        this.node.emit('fade-in');
        // this.animationShow();
        this.getListMissionApi();
    },

    loadAtlas: function () {
        cc.Global.foodFrames = (this.foodAtlas) ? this.foodAtlas.getSpriteFrames() : [];
    },

    animationShow() {
        this.node.stopAllActions();
        this.node.setScale(0.3);
        this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
    },

    getListMissionApi() {
        var self = this;
        cc.Global.showLoading();
        Api.get(Linker.Config.APP_API + "MissionUser/myMission/" + Linker.userData.userId, (data) => {
            cc.Global.hideLoading();
            if (data.error == "0") {
                self.createListMission(data.body);
            } else {
                Linker.showMessage(data.message);
            }
        });
    },

    createListMission(data) {
        this.content.removeAllChildren();
        for (var i = 0; i < data.length; i++) {
            var zoneId = data[i].zoneId;
            if (Number(zoneId) == 5) {
                if (data[i].received == 1) continue;
                var item = cc.instantiate(this.itemMissionPrefab);
                this.content.addChild(item);
                var itemJs = item.getComponent("itemMission");
                if (itemJs) {
                    itemJs.init(data[i]);
                }
            } 
        }   
    },

    sendApiCompleteMission(itemMissionJs) {
        NewAudioManager.playClick();
        var data = {
            "uid": Linker.userData.userId,
            "missionId": itemMissionJs.missionId
        }
        cc.Global.showLoading();
        Api.post(Linker.Config.APP_API + "MissionUser/receivingGifts", data, (data) => {
            cc.Global.hideLoading();
            if (data.error == 0) {
                itemMissionJs.activeFinish();
                DataAccess.Instance.requestUserData(Linker.userData.userId);
            }
            Linker.showMessage(data.message);
        });
    },

    onButtonClose() {
        this.node.active = false;
    }

    // update (dt) {},
});