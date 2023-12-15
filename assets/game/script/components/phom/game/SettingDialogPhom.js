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
var Utils = require('Utils');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
var PhomSend = require('PhomSend');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        musicToggle: cc.Toggle,
        soundToggle: cc.Node,
        vibrationToggle: cc.Toggle,
        soloToggle: cc.Toggle,
        fourToggle: cc.Toggle,
        isTaiGui: cc.Toggle,
        autoReady : cc.Toggle,
        autoReadyNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //self.node.active = false;
        }, this);
    },

    start() {

    },
    onEnable: function () {
        // this.stopPropagationOnBackdrop = Utils.Node.stopPropagation(this.backdrop);
        this.node.stopAllActions();
        this.node.setScale(0.3);
        this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
        this.userData = Linker.Local.readUserData();
        if(Linker.PhomController.isMaster) {
            this.autoReadyNode.active = false;
        } else {
            this.autoReadyNode.active = true;
        }
        if (this.userData) {
            this.musicToggle.isChecked = this.userData.isMusic;
            this.soundToggle.isChecked = this.userData.isSound;
            this.vibrationToggle.isChecked = this.userData.isVibration;
        }
        if (Linker.PhomController.isTaiGui == 1) {
            this.isTaiGui.isChecked = true;
        } else {
            this.isTaiGui.isChecked = false;
        }
        if (Linker.PhomController.maxCapacity == 2) {
            this.soloToggle.isChecked = true;
        } else {
            this.fourToggle.isChecked = true;
        }
        if (Linker.PhomController.isAutoReady == 1) {
            this.autoReady.isChecked = true;
        } else {
            this.autoReady.isChecked = false;
        }
        if (Linker.PhomController.isMaster) { 
            this.fourToggle.interactable = true;
            this.soloToggle.interactable = true;
            this.isTaiGui.interactable = true;
        } else {
            this.fourToggle.interactable = false;
            this.soloToggle.interactable = false;
            this.isTaiGui.interactable = false;
        }
        this.number = Linker.PhomController.maxCapacity;
        this.isTaiGuiU = Linker.PhomController.isTaiGui;
    },

    onDisable: function () {
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
    },
    closeBtnClick() {
        this.node.active = false;
        if (Linker.PhomController.isMaster) {
            var send = PhomSend.phomSettingRequest(Linker.PhomController.tableId, this.number,
                Linker.PhomController.minMoney, Linker.PhomController.isAn, this.isTaiGuiU
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
        // this.fourToggle.isChecked = false;
        this.number = 2;
    },
    onFour(toggle) {
        // this.soloToggle.isChecked = false;
        this.number = 4;
    },
    onTaiGui(toggle) {
        if (toggle.isChecked) {
            this.isTaiGuiU = 1;
        } else {
            this.isTaiGuiU = 0;
        }
    },
    onAutoReady(toggle) {
        if (toggle.isChecked) {
            Linker.PhomController.isAutoReady = 1;
        } else {
            Linker.PhomController.isAutoReady = 0;
        }
    }

    // update (dt) {},
});
