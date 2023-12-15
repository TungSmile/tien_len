var i18n = require('i18n');
var Linker = require('Linker');
var Utils = require('Utils');
var GameConstant = require('GameConstant');

cc.Class({
    extends: cc.Component,

    properties: {
        textLixi: cc.Label,
        textUserMoney: cc.Label,
        winDialog: cc.Node,
        lixiContainer: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.node.active = false;
        Linker.LiXiDialog = this;
        var self = this;
        this.winDialog.on(cc.Node.EventType.TOUCH_START, () => {
            self.winDialog.active = false;
        });

    },

    start () {

    },
    updateView(number) {
        this.textLixi.string = i18n.t("you_have") + " " + number + " " + i18n.t("times_to_open_bonus");
        this.textUserMoney.string = Utils.Number.format(Linker.userData.userMoney);
        this.resetLiXi();
        var self = this;
        Linker.LixiHandler.auto_click = true;
        Linker.LiXiDialog.winDialog.active = false;
        setTimeout(function () {
            if(Linker.LixiHandler.auto_click){
                self.lixiAutoBtnCLick();
            }
        }, GameConstant.LIXI.TIME_DEALY_OPEN_LIXI);
    },
    resetLiXi: function () {
        this.lixiContainer.children.forEach(element => {
            element.getComponent(cc.Button).interactable = true;
            element.getChildByName("check2").active = false;
        });
    },
    onDisable() {
        //this.node.emit('fade-out');
    },
    onEnable() {
        this.node.position = cc.v2(0, 0);
    },
    lixiBtnCLick(event) {
        if (Linker.TaThanController.numberLiXi > 0) {
            Linker.TaThanController.lixiBtnClick(event);
            //cc.log("KKKK");
        } else {
            this.node.active = false;
            Linker.TaThanView.updateUserMoneyIngame();
            if (Linker.TaThanController.isAutoSpin) {
                Linker.TaThanController.spinBtnClick();
            }
        }
       
    },
    lixiAutoBtnCLick() {
        if (Linker.TaThanController.numberLiXi > 0) {
            Linker.TaThanController.lixiAutoBtnClick();
            //cc.log("KKKK");
        } else {
            this.node.active = false;
            Linker.TaThanView.updateUserMoneyIngame();
            Linker.LixiHandler.auto_click = false;
            if (Linker.TaThanController.isAutoSpin) {
                Linker.TaThanController.spinBtnClick();
            }
        }
    },
    choiNhanhBtnClick() {
        this.lixiAutoBtnCLick();
    }

    // update (dt) {},
});
