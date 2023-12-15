// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var Linker = require('Linker');
var Utils = require('Utils');
var GameConstant = require('GameConstant');
var i18n = require('i18n');

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
        this.textLixi.string = i18n.t("tdk_title_text_lixi", { n: number });
        this.textUserMoney.string = 0;
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
        if (Linker.TayDuKyController.numberLiXi > 0) {
            Linker.TayDuKyController.lixiBtnClick(event);
            //cc.log("KKKK");
        } else {
            this.node.active = false;
            Linker.TayDuKyView.updateUserMoneyIngame();
            if (Linker.TayDuKyController.isAutoSpin) {
                Linker.TayDuKyController.spinBtnClick();
            }
        }
       
    },
    lixiAutoBtnCLick() {
        if (Linker.TayDuKyController.numberLiXi > 0) {
            Linker.TayDuKyController.lixiAutoBtnClick();
            //cc.log("KKKK");
        } else if (this.node) {
            this.node.active = false;
            Linker.TayDuKyView.updateUserMoneyIngame();
            Linker.LixiHandler.auto_click = false;
            if (Linker.TayDuKyController.isAutoSpin) {
                Linker.TayDuKyController.spinBtnClick();
            }
        }
    },

    choiNhanhBtnClick() {
        this.lixiAutoBtnCLick();

    }

    // update (dt) {},
});
