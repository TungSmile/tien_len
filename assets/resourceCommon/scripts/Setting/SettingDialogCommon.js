var soccerConstant = require('soccerConstant');
var Linker = require('Linker');
var Utils = require('Utils');
var Constant = require('Constant');
var SoccerGalaxySend = require('SoccerGalaxySend');
var NewAudioManager = require('NewAudioManager');
var i18n = require('i18n');
var BiDaConstant = require('BiDaConstant');
cc.Class({
    extends: cc.Component,

    properties: {
        btnLogOut: cc.Node,
        btnSupport: cc.Node,

        musicBlock: cc.Node,
        soundBlock: cc.Node,
        vibrateBlock: cc.Node,
        acceptInviteBlock: cc.Node,
        tudongSanSangBlock: cc.Node,

        toggleSound: cc.Toggle,
        toggleMusic: cc.Toggle,
        toggleAcceptInvite: cc.Toggle,
        toggleRung: cc.Toggle,
        toggleTudongSanSang: cc.Toggle,
        languagesContainer: cc.Node,
        toggleVietNamese: cc.Toggle,
        toggleEnglish: cc.Toggle,
        listTogleLanguage: [cc.Toggle],

        languagePopup: cc.Node,
        languageScrollView: cc.ScrollView
    },
    onMusicBtnClick(toggle) {
        var userData = Linker.Local.readUserData();
        userData.isMusic = toggle.isChecked;
        Linker.Local.saveUserData(userData);
        if (toggle.isChecked) {
            NewAudioManager.stopSoundBackground();
            NewAudioManager.playBackground(NewAudioManager.getPathMusicByZone().background, 1.0, true, false);
        } else {
            NewAudioManager.stopSoundBackground();
        }
    },
    onSoundBtnClick(toggle) {
        var userData = Linker.Local.readUserData();
        userData.isSound = toggle.isChecked;
        this.toggleSound.node.getChildByName("icon_off").active = !userData.isSound;
        this.toggleSound.node.getChildByName("icon_on").active = userData.isSound;
        Linker.Local.saveUserData(userData);
        if (toggle.isChecked) {
            NewAudioManager.muteSound(false);
        } else {
            NewAudioManager.muteSound(true);
        }
    },

    onVibrationBtnClick(toggle) {
        var userData = Linker.Local.readUserData();
        userData.isVibration = toggle.isChecked;
        toggle.node.getChildByName("icon_off").active = !userData.isVibration;
        toggle.node.getChildByName("icon_on").active = userData.isVibration;
        Linker.Local.saveUserData(userData);       
    },

    onAcceptInviteBtnClick(toggle) {
        var userData = Linker.Local.readUserData();
        userData.isInvite = toggle.isChecked;
        Linker.Local.saveUserData(userData);
    },
    onChangeLanguageClick: function (event) {
        if (event) {
            // if (this.languagesContainer) {
            //     this.enableContainerLanguage(!this.languagesContainer.active);
            // }
            this.languagePopup.active = true;
            this.onOpenLanguagePopup();
        }
    },
    onCloseLanguagePopup: function () {
        this.languagePopup.active = false;
    },
    config: function (event) {
        if (event) {
            this.isPlaying = event.isPlaying ? true : false;
            this.isMaster = event.isMaster ? true : false;

        }
    },
    onTuDongSanSangBtnClick(toggle) {
        var userData = Linker.Local.readUserData();
        userData.isAutoReady = toggle.isChecked;
        Linker.Local.saveUserData(userData);
    },
    onEnable: function () {
        // this.configLogoutButton();
        this.updateInvite();
        var userData = Linker.Local.readUserData();
        this.toggleTudongSanSang.isChecked = userData.isAutoReady;
        if (Linker.ZONE == 15) {
            this.acceptInviteBlock.active = true;
            this.tudongSanSangBlock.active = true;
        } else {
            this.acceptInviteBlock.active = false;
            this.tudongSanSangBlock.active = false;
        }
        this.toggleSound.node.getChildByName("icon_off").active = !userData.isSound;
        this.toggleRung.node.getChildByName("icon_off").active = !userData.isVibration;
        this.toggleRung.node.getChildByName("icon_on").active = userData.isVibration;
    },
    enableContainerLanguage: function (enable) {
        if (this.languagesContainer) {
            this.languagesContainer.active = enable ? true : false;
        }
    },
    onEnglishToggle: function (event) {
        if (event && event.isChecked) {
            i18n.init(BiDaConstant.LANGUAGE.ENGLISH);
            Linker.gameLanguage = BiDaConstant.LANGUAGE.ENGLISH;
            BiDaConstant.METHODS.createListenerNode().emit("changeLanguage");
            cc.sys.localStorage.setItem("languageCode", BiDaConstant.LANGUAGE.ENGLISH);
            NewAudioManager.LoadSound(BiDaConstant.LANGUAGE.ENGLISH);
           // this.enableContainerLanguage(false);
        }

    },

    onVietNameseToggle: function (event) {
        if (event && event.isChecked) {
            i18n.init(BiDaConstant.LANGUAGE.VIETNAMESE);
            Linker.gameLanguage = BiDaConstant.LANGUAGE.VIETNAMESE;
            BiDaConstant.METHODS.createListenerNode().emit("changeLanguage");
            cc.sys.localStorage.setItem("languageCode", BiDaConstant.LANGUAGE.VIETNAMESE);
            NewAudioManager.LoadSound(BiDaConstant.LANGUAGE.VIETNAMESE);
            // this.enableContainerLanguage(false);
        }
    },
    uncheckRemainsToggleWithout: function (toggle) {
        if (this.listTogleLanguage) {
            for (var i = 0; i < this.listTogleLanguage.length; i++) {
                var currentToggle = this.listTogleLanguage[i];
                if (currentToggle) {
                    if (currentToggle != toggle) {
                        currentToggle.uncheck();
                    }
                }
            }
        }
    },

    onLanguageToggleClick: function(event) {
        if (event && event.isChecked) {
            i18n.init(event.checkEvents[0].customEventData);
            Linker.gameLanguage = event.checkEvents[0].customEventData;
            BiDaConstant.METHODS.createListenerNode().emit("changeLanguage");
            cc.sys.localStorage.setItem("languageCode", Linker.gameLanguage);
            NewAudioManager.LoadSound(Linker.gameLanguage);
        }
    },

    activeLanguageChoosed: function () {
        if (this.languagesContainer) {
            for (var i = 0; i < this.languagesContainer.children.length; i++) {
                var lang = this.languagesContainer.children[i];
                var langToggle = lang.getComponent(cc.Toggle);
                if (langToggle) {
                    if (Linker.gameLanguage == BiDaConstant.LANGUAGE.VIETNAMESE) {
                        this.toggleVietNamese.check();
                        this.uncheckRemainsToggleWithout(this.toggleVietNamese);
                    } else if (Linker.gameLanguage == BiDaConstant.LANGUAGE.ENGLISH) {
                        this.toggleEnglish.check();
                        this.uncheckRemainsToggleWithout(this.toggleEnglish);
                    } else {
                        this.toggleEnglish.check();
                        this.uncheckRemainsToggleWithout(this.toggleEnglish);
                    }
                    break;
                }
            }
        }
    },
    updateDevice: function () {
        var userData = Linker.Local.readUserData();
        if (userData) {
            userData.isMusic ? this.toggleMusic.check() : this.toggleMusic.uncheck();
            userData.isSound ? this.toggleSound.check() : this.toggleSound.uncheck();
            userData.isVibration ? this.toggleRung.check() : this.toggleRung.uncheck();
            this.enableContainerLanguage(true);
            this.activeLanguageChoosed();
        }
    },
    updateInvite() {
        var userData = Linker.Local.readUserData();
        if (userData) {
            userData.isInvite ? this.toggleAcceptInvite.check() : this.toggleAcceptInvite.uncheck();
            //fast slow play? ah it will be show event hehe
        }
    },

    onSupportClick(){
        if (Linker.Config) {
            var url = Linker.Config.FACEBOOK_PAGE;
            cc.sys.openURL(url);
        }
    },

    configLogoutButton: function () {
        var sceneName = cc.Global.getSceneName();
        if (sceneName) {
            if (sceneName == "TrangChu") {
                // if (sceneName == "HeroesBall") {
                this.btnLogOut.active = true;
            } else {
                this.btnLogOut.active = false;
            }
        } else {
            this.btnLogOut.active = false;
        }
    },
    onBtnCloseClick: function () {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        customEvent.toggle = this.node.getComponent(cc.Toggle);
        this.node.dispatchEvent(customEvent);
        if (!this.isPlaying && this.isMaster) {
            this.requestSetting();
        }
        this.node.active = false;
    },
    requestSetting: function () {
        var settingInGame = this.node.getComponent("SettingInGame");
        if (settingInGame) {
            settingInGame.requestSetting();
        }
    },
    onLogoutClick: function () {
        // NewAudioManager.playClick();
        // var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_BACK_TO_LOGIN, true);
        // this.node.dispatchEvent(customEvent);
        this.onBtnCloseClick();
        NewAudioManager.playClick();
        NewAudioManager.stopSoundBackground();
        Linker.isLoadLogin = false;
        Linker.showDialogActive = false;
        cc.log("thoat");
        Linker.isLogin = false;
        Linker.Socket.close();
        Linker.isLogOut = true;
        if (Linker.isFb) {
            Linker.MySdk.logoutFb();
            Linker.isFb = false;
        }
        if (Linker.HomeManager && Linker.HomeManager.isValid) {
            Linker.HomeManager.showLayer();
        }
    },

    onOpenLanguagePopup: function () {
        var node = this.languageScrollView.content.children.find(item => item.name == Linker.gameLanguage);
        if (node) {
            if (!node.getComponent(cc.Toggle).isChecked) node.getComponent(cc.Toggle).check();
        }
    }

    // update (dt) {},
});
