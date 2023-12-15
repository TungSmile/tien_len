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
var MauBinhSend = require('MauBinhSend');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        musicToggle: cc.Toggle,
        soundToggle: cc.Toggle,
        vibrationToggle: cc.Toggle,
        soloToggle: cc.Toggle,
        fourToggle: cc.Toggle
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
        }, this);
    },

    start () {
    },
    onEnable: function () {
        this.node.stopAllActions();
        this.node.setScale(0.3);
        this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
        this.userData = Linker.Local.readUserData();
        if (this.userData) {
            this.musicToggle.isChecked = this.userData.isMusic;
            this.soundToggle.isChecked = this.userData.isSound;
            this.vibrationToggle.isChecked = this.userData.isVibration;
        }
        if (Linker.MauBinhController.maxCapacity == 2) {
            this.soloToggle.isChecked = true;
        } else {
            this.fourToggle.isChecked = true;
        }
        if (Linker.MauBinhController.isMaster) { 
            this.fourToggle.interactable = true;
            this.soloToggle.interactable = true;
        } else {
            this.fourToggle.interactable = false;
            this.soloToggle.interactable = false;
        }
        this.number = Linker.MauBinhController.maxCapacity;
    },

    onDisable: function () {
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
    },
    closeBtnClick() {
        this.node.active = false;
        if (Linker.MauBinhController.isMaster) {
            var send = MauBinhSend.mbSettingRequest(Linker.MauBinhController.tableId, this.number,
                Linker.MauBinhController.minMoney
            );
            Linker.Socket.send(send);
        }
        
    },
    onMusicBtnClick(toggle) {
        this.userData.isMusic = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
        // if(toggle.isChecked) {
        //     NewAudioManager.playBackground(NewAudioManager.sound.background);
        // } else{
        //     NewAudioManager.stopSoundBackground();
        // }
    },
    onSoundBtnClick(toggle) {
        this.userData.isSound = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
    },
    onVibrationBtnClick(toggle) {
        this.userData.isVibration = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
    },
    onSolo(toggle) {
        this.number = 2;
    },
    onFour(toggle) {
        this.number = 4;
    },
    // update (dt) {},
});
