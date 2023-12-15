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
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        chagePassDialog: cc.Node,
        musicToggle: cc.Toggle,
        soundToggle: cc.Toggle,
        vibrationToggle: cc.Toggle,
        inviteToggle: cc.Toggle
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
        if (this.userData) {
            console.log("User data sucess")
            this.musicToggle.isChecked = this.userData.isMusic;
            this.soundToggle.isChecked = this.userData.isSound;
            this.vibrationToggle.isChecked = this.userData.isVibration;
            this.inviteToggle.isChecked = this.userData.isInvite;
        }
    },

    onDisable: function () {
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
    },
    closeBtnClick() {
        this.node.active = false;
    },
    changePassBtnClick() {
        this.chagePassDialog.active = true;
    },
    onMusicBtnClick(toggle) {
        this.userData.isMusic = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
        if (toggle.isChecked) {
            NewAudioManager.stopSoundBackground();
            NewAudioManager.playBackground(NewAudioManager.SOUND_GAME.COMMON.BACKGROUND, 1.0, true, false);
        } else {
            NewAudioManager.stopSoundBackground();
        }
    },
    onSoundBtnClick(toggle) {
        this.userData.isSound = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
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
    onInviteBtnClick(toggle) {
        this.userData.isInvite = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
    }

    // update (dt) {},
});
