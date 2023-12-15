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
var PokerSend = require('PokerSend');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        musicToggle: cc.Toggle,
        soundToggle: cc.Toggle,
        vibrationToggle: cc.Toggle,
        soloToggle: cc.Toggle,
        fourToggle: cc.Toggle,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
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
        if (this.userData) {
            this.musicToggle.isChecked = this.userData.isMusic;
            this.soundToggle.isChecked = this.userData.isSound;
            this.vibrationToggle.isChecked = this.userData.isVibration;
        }
        if (Linker.PokerController.maxCapacity == 5) {
            this.soloToggle.isChecked = true;
        } else {
            this.fourToggle.isChecked = true;
        }
       
        if (Linker.PokerController.isMaster) { 
            this.fourToggle.interactable = true;
            this.soloToggle.interactable = true;
        } else {
            this.fourToggle.interactable = false;
            this.soloToggle.interactable = false;
        }
        this.number = Linker.PokerController.maxCapacity;
    },

    onDisable: function () {
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
    },
    closeBtnClick() {
        this.node.active = false;
        if (Linker.PokerController.isMaster) {
            var send = PokerSend.pokerSettingRequest(Linker.PokerController.tableId, this.number,
                Linker.PokerController.minMoney
            );
            Linker.Socket.send(send);
        }
        
    },
    onMusicBtnClick(toggle) {
        this.userData.isMusic = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
        if(toggle.isChecked) {
            // NewAudioManager.playBackground(NewAudioManager.sound.background);
            toggle.node.getChildByName("icon").active = false;
        } else{
            toggle.node.getChildByName("icon").active = true;
            NewAudioManager.stopSoundBackground();
        }
    },
    onSoundBtnClick(toggle) {
        this.userData.isSound = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
        toggle.node.getChildByName("icon").active = (toggle.isChecked) ? false : true;
    },
    onVibrationBtnClick(toggle) {
        this.userData.isVibration = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
    },
    onSolo(toggle) {
        this.number = 5;
    },
    onFour(toggle) {
        this.number = 9;
    },
   

    // update (dt) {},
});
