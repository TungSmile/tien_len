var NewAudioManager = require("NewAudioManager");
var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        musicToggle: cc.Toggle,
        soundToggle: cc.Toggle,
    },

    onLoad: function () {

    },
    onEnable: function () {
        this.node.stopAllActions();
        this.node.setScale(0.3);
        this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
        this.userData = Linker.Local.readUserData();
        if (this.userData) {
            this.musicToggle.isChecked = this.userData.isMusic;
            this.soundToggle.isChecked = this.userData.isSound;
        }
    }, 
    onMusicBtnClick(toggle) {
        if(toggle.isChecked) {
            NewAudioManager.playBackground(NewAudioManager.sound.background);
            //this.muteSound = !this.muteSound;
        } else{
            NewAudioManager.stopSoundBackground();
            //this.muteSound = !this.muteSound;
        }
        this.userData.isMusic = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
    },
    onSwitchSound() {
        //this.muteSound = !this.muteSound;
        //if ( this.checkSound.active ) {
        //  this.checkSound.active = false;
        //}
        //else {
        //    this.checkSound.active = true;
        //}
        //this.checkSound.active = !this.checkSound.active;
    },

    onBtnConfirm() {
        cc.sys.localStorage.muted_sound = this.muteSound ? "true" : "false";
        cc.sys.localStorage.muted_music = this.muteMusic ? "true" : "false";

        //NewAudioManager.muteSound(this.muteSound);
        //NewAudioManager.muteMusic(this.muteMusic);
        //NewAudioManager.playBackground(NewAudioManager.sound.background);

        this.node.active = false;
    }
});
