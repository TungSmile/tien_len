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
var TaiXiuConstant = require('TaiXiuConstant');
var Utils = require('Utils');
var TQUtil = require('TQUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        gameState: TaiXiuConstant.GAME_STATE.GAME_NULL,
        gamemain: cc.Node,
        circle: cc.Node,
        sumCoinTai: 0,
        sumCoinXiu: 0
        // list_phien_TX: cc.Node,
        // prefab_tai: cc.Prefab,
        // prefab_xiu: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },
    onEnable: function () {
        if(!Linker.TaiXiuView || Linker.TaiXiuView.isValid == false){
            this.initValue();
        }
        //var list_phien_TX = Linker.TaiXiuController.list_phien_TX;

        //if(list_phien_TX.children.length>14) {
        //var extendValue = list_phien_TX.children.length - 13;
        //for ( var i = 0;i < extendValue;i++) {
        //list_phien_TX.children[i].destroy();
        //}
        //}
    },
    initValue() {
        Linker.TaiXiuView = this;

        this.number_tai_label = Linker.TaiXiuController.number_tai_label;
        this.number_xiu_label = Linker.TaiXiuController.number_xiu_label;
        this.coin_tai_label = Linker.TaiXiuController.coin_tai_label;
        this.coin_xiu_label = Linker.TaiXiuController.coin_xiu_label;
        this.sum_coin_tai_label = Linker.TaiXiuController.sum_coin_tai_label;
        this.sum_coin_xiu_label = Linker.TaiXiuController.sum_coin_xiu_label;
        this.my_coin_tai_label = Linker.TaiXiuController.my_coin_tai_label;
        this.my_coin_xiu_label = Linker.TaiXiuController.my_coin_xiu_label;


        this.person_tai = Linker.TaiXiuController.person_tai;
        this.person_xiu = Linker.TaiXiuController.person_xiu;
        this.coin_tai = Linker.TaiXiuController.coin_tai;
        this.coin_xiu = Linker.TaiXiuController.coin_xiu;
        this.sum_coin_tai = Linker.TaiXiuController.sum_coin_tai;
        this.sum_coin_xiu = Linker.TaiXiuController.sum_coin_xiu;
        this.my_coin_tai = Linker.TaiXiuController.my_coin_tai;
        this.my_coin_xiu = Linker.TaiXiuController.my_coin_xiu;

        this.totalMatch = Linker.TaiXiuController.totalMatch;
        this.timeLabel = Linker.TaiXiuController.timeLabel;
        this.time = Linker.TaiXiuController.time;
        this.fire = Linker.TaiXiuController.fire;
        this.lac = Linker.TaiXiuController.lac;
        this.dang_can_cua = Linker.TaiXiuController.dang_can_cua;
        this.nan = Linker.TaiXiuController.nan;
        //speed
        this.speed0 = 1;
        this.speed1 = 1;
        this.speed2 = 1;
        this.speed3 = 1;
        this.speed4 = 1;
        this.speed5 = 1;
        this.speed6 = 1;
    },
    remove_XucXac() {
        var n1 = this.circle.getChildByName('xuc_xac').getChildByName('n1');
        var n2 = this.circle.getChildByName('xuc_xac').getChildByName('n2');
        var n3 = this.circle.getChildByName('xuc_xac').getChildByName('n3');
        n1.removeAllChildren();
        n2.removeAllChildren();
        n3.removeAllChildren();
    },

    resetTextForm() {
        this.person_tai.string = 0;
        this.person_xiu.string = 0;
        this.coin_tai.string = 'Đặt';
        this.coin_xiu.string = 'Đặt';
        this.sum_coin_tai.string = '...';
        this.sum_coin_xiu.string = '...';
        this.my_coin_tai.string = '...';
        this.my_coin_xiu.string = '...';

    },

    //update total match
    updateTotalMatch(str) {
        this.totalMatch.id = str;
        this.totalMatch.string = '#' + str;
    },

    //update label text
    update_Person_Tai(value) {
        this.person_tai.string = value;
    },
    update_Person_Xiu(value) {
        this.person_xiu.string = value;
    },
    update_Coin_Tai(value) {
        this.coin_tai.string = value;
    },
    update_Coin_xiu(value) {
        this.coin_xiu.string = value;
    },
    update_Sum_Coin_Tai(value) {
        value = parseInt(value.replace(/\./g, ''));
        this.animateValue(this.sum_coin_tai, this.sumCoinTai, value, 0.2);
        this.sumCoinTai = value;
    },
    update_Sum_Coin_Xiu(value) {
        value = parseInt(value.replace(/\./g, ''));
        this.animateValue(this.sum_coin_xiu, this.sumCoinXiu, value, 0.2);
        this.sumCoinXiu = value;

    },
    animateValue(label, start, end, duration) {

        label.value = end;
        duration = duration * 1000;

        var range = end - start;
        // no timer shorter than 50ms (not really visible any way)
        var minTimer = 50;
        // calc step time to show all interediate values
        var stepTime = Math.abs(Math.floor(duration / range));

        // never go below minTimer
        stepTime = Math.max(stepTime, minTimer);

        // get current time and calculate desired end time
        var startTime = new Date().getTime();
        var endTime = startTime + duration;
        var timer;

        function run() {
            if (Linker.TaiXiuController) {
                var now = new Date().getTime();
                var remaining = Math.max((endTime - now) / duration, 0);
                var value = Math.round(end - (remaining * range));
                if (label && label.isValid) {

                    label.string = TQUtil.addDot(value);
                }else{
                    clearInterval(timer);
                }
                if (value == end) {
                    clearInterval(timer);
                }
            } else {
                clearInterval(timer);
            }
        }
        timer = setInterval(run, stepTime);
        run();
    },
    update_My_Coin_Tai(value) {

        value = value.replace(/\ /g, '');
        value = value.replace(/\./g, '');
        value = Utils.Number.format(value);
        this.my_coin_tai.string = value;
    },
    update_My_Coin_Xiu(value) {
        
        value = value.replace(/\ /g, '');
        value = value.replace(/\./g, '');
        value = Utils.Number.format(value);
        this.my_coin_xiu.string = value;
    },

    update_list_phienTX() {
        cc.log("update list phien")
        for (var i = 0; i < 14; i++) {
            var temp = cc.instantiate(this.prefab_tai);
            this.list_phien_TX.addChild(temp);
        }
    },

    //label timer
    update_Time(value) {
        if (this.time) {
            this.time.string = value;
        }
    },
    hide_TimeLabel() {
        this.timeLabel.active = false;
    },
    show_TimeLabel() {
        this.timeLabel.active = true;
    },

    //action rotate fire
    hide_Fire_Rotate() {
        this.fire.active = false;
    },
    show_Fire_Rotate() {
        this.fire.active = true;
    },

    //
    hide_Effect_Tai(ef1, ef2) {
        ef1.active = false;
        ef2.active = false;
    },
    show_Effect_Tai(ef1, ef2) {
        ef1.active = true;
        // ef2.active = true;
    },
    hide_Effect_Xiu(ef1, ef2) {
        ef1.active = false;
        // ef2.active = false;
    },
    show_Effect_Xiu(ef1, ef2) {
        ef1.active = true;
        ef2.active = true;
    },
    setScale_Effect(eff) {
        var seq = cc.repeatForever(
            cc.sequence(
                cc.scaleTo(1, 0.5),
                cc.scaleTo(1, 1.1)
            )
        );
        eff.runAction(seq);
    },
    unsetScale_Effect(eff) {
        eff.stopAllActions();
        eff.setScale(1, 1);
    },

    //rotate effect
    rotate_Effect(node, time, rotate) {
        var seq = cc.repeatForever(
            cc.rotateBy(time, rotate)
        );
        node.runAction(seq);
    },

    //lac xuc xac
    lac_Xuc_Xac() {
        if (this.lac != undefined) {
            this.lac.active = true;
            this.lac.getComponent(cc.Animation).play('lac');
        }
    },
    pause_lac_Xuc_Xac() {
        if (this.lac != undefined) {
            this.lac.active = false;
        }
    },
    resetCoinTai: function(){
        this.sumCoinTai = 0;
    },
    resetCoinXiu: function(){
        this.sumCoinXiu = 0;
    },
    //action Dang Can Cua
    run_Action_DangCanCua() {
        if (TaiXiuConstant.ISNAN == 1) {
            // this.nan.active = true;
        }
        var self = this;
        self.dang_can_cua.active = true;
        var boxpoint = self.dang_can_cua.getChildByName('boxpoint');
        boxpoint.children[0].y += self.speed0;
        if (boxpoint.children[0].y >= 45) self.speed0 = -1; else if (boxpoint.children[0].y <= 0) self.speed0 = 1;
        boxpoint.children[1].y += self.speed1;
        if (boxpoint.children[1].y >= 45) self.speed1 = -1; else if (boxpoint.children[1].y <= 0) self.speed1 = 1;
        boxpoint.children[2].y += self.speed2;
        if (boxpoint.children[2].y >= 45) self.speed2 = -1; else if (boxpoint.children[2].y <= 0) self.speed2 = 1;
        boxpoint.children[3].y += self.speed3;
        if (boxpoint.children[3].y >= 45) self.speed3 = -1; else if (boxpoint.children[3].y <= 0) self.speed3 = 1;
        boxpoint.children[4].y += self.speed4;
        if (boxpoint.children[4].y >= 45) self.speed4 = -1; else if (boxpoint.children[4].y <= 0) self.speed4 = 1;
        boxpoint.children[5].y += self.speed5;
        if (boxpoint.children[5].y >= 45) self.speed5 = -1; else if (boxpoint.children[5].y <= 0) self.speed5 = 1;
        boxpoint.children[6].y += self.speed6;
        if (boxpoint.children[6].y >= 45) self.speed6 = -1; else if (boxpoint.children[6].y <= 0) self.speed6 = 1;
    },
    pause_Action_DangCanCua() {
        this.dang_can_cua.active = false;
        // this.nan.active = false;
    },

    runNanXucXac() {
        this.nan.active = true;
    },
    pauseNanXucXac() {
        this.nan.active = false;
        this.nan.setPosition(-25.299, -16.518);
    },
    onDestroy: function () {
        // if(Linker.TaiXiuView) Linker.TaiXiuView = null;
    }

    // update (dt) {},
});
