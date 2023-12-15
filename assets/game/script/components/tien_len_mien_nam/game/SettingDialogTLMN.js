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
var TLMNSend = require('TLMNSend');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        musicToggle: cc.Toggle,
        soundToggle: cc.Node,
        vibrationToggle: cc.Toggle,
        soloToggle: cc.Toggle,
        fourToggle: cc.Toggle,
        autoReady : cc.Toggle,
        hiddenCard: cc.Toggle
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //self.node.active = false;
        }, this);
    },

    start() {
        Linker.SettingDialogTLMN = this;
    },
    onEnable: function () {
        // this.stopPropagationOnBackdrop = Utils.Node.stopPropagation(this.backdrop);
        this.node.stopAllActions();
        this.node.setScale(0.3);
        this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
        this.userData = Linker.Local.readUserData();
        console.log("this.userData.isSound    " + this.userData.isSound);
        if (this.userData) {
            // this.musicToggle.isChecked = this.userData.isMusic;
            this.soundToggle.isChecked = this.userData.isSound;
            this.vibrationToggle.isChecked = this.userData.isVibration;
        }
        if (Linker.TLMNController.maxCapacity == 2) {
            this.soloToggle.isChecked = true;
        } else {
            this.fourToggle.isChecked = true;
        }
        if (Linker.TLMNController.isAutoReady == 1) {
            this.autoReady.isChecked = true;
        } else {
            this.autoReady.isChecked = false;
        }
        // if (Linker.TLMNController.isHiddenCard == 1) {
        //     this.hiddenCard.isChecked = true;
        // } else {
        //     this.hiddenCard.isChecked = false;
        // }
        if (Linker.TLMNController.isMaster) { 
            this.fourToggle.interactable = true;
            this.soloToggle.interactable = true;
        } else {
            this.fourToggle.interactable = false;
            this.soloToggle.interactable = false;
        }
        this.number = Linker.TLMNController.maxCapacity;  
        this.soundToggle.getChildByName("background").active = !this.userData.isSound;    
        this.soundToggle.getChildByName("on").active = this.userData.isSound;   
    },

    onDisable: function () {
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
    },
    closeBtnClick() {
        this.node.active = false;
        if (Linker.TLMNController.isMaster) {
            var send = TLMNSend.DemLaSettingRequest(Linker.TLMNController.tableId, this.number,
                Linker.TLMNController.minMoney, Linker.TLMNController.isHiddenCard
            );
            Linker.Socket.send(send);
        }
        
    },
    onMusicBtnClick(toggle) {
        this.userData.isMusic = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
        if(toggle.isChecked) {
            // NewAudioManager.playBackground(NewAudioManager.sound.background);
           toggle.node.getChildByName("background").active = false;
        } else{
            toggle.node.getChildByName("background").active = true;
            NewAudioManager.stopSoundBackground();
        }
    },
    onSoundBtnClick(toggle) {
        console.log("onSoundBtnClick   " + toggle.isChecked);
        this.userData.isSound = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
        toggle.node.getChildByName("background").active = !toggle.isChecked;
        if (toggle.isChecked) {
            NewAudioManager.muteSound(false);
        } else {
            NewAudioManager.muteSound(true);
        }
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
    onAutoReady(toggle) {
        if (toggle.isChecked) {
            Linker.TLMNController.isAutoReady = 1;
        } else {
            Linker.TLMNController.isAutoReady = 0;
        }
    },
    onHiddenCard(toggle){
        if(toggle.isChecked){
            Linker.TLMNController.isHiddenCard = 1;
        }else {
            Linker.TLMNController.isHiddenCard = 0;
        }        
    },
    setToggleSetting( isAutoReady, isHideCard){
        // this.soloToggle.isChecked = isSolo;
        // this.fourToggle.isChecked = isFour;
        this.autoReady.isChecked = isAutoReady;
        // this.hiddenCard.isChecked = isHideCard;
    }

    // update (dt) {},
});
