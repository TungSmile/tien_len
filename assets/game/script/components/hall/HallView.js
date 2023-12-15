
var Linker = require('Linker');
var Utils = require('Utils');
var NewAudioManager = require('NewAudioManager');
var TQUtil = require('TQUtil');
var GameConstant = require('GameConstant');

cc.Class({
    extends: cc.Component,

    properties: {
        btnNap: cc.Node,
        btnDongTien: cc.Node,
        bottomContainer: cc.Node,
        topContainer: cc.Node,
        textDisplayName: cc.Label,
        textExp: cc.Label,
        textLevel: cc.Label,
        textUserId: cc.Label,
        textUserMoney: cc.Label,
        textUnReadMail: cc.Label,
        textUnReadEvent: cc.Label,
        userAvatar: cc.Sprite,
        textHuVang: cc.Label,
        btnHuVang: cc.Node,
        btnFacebook: cc.Node,
        btnFacebookGroup: cc.Node,
        btnTele: cc.Node,
        btnTeleSup: cc.Node,
        btnKetSat: cc.Node,
        listAvatar: [cc.SpriteFrame],
        sharedHall: cc.Node,
        isSlotFirstRunAnimation: false,
        countMail: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {    
        this.node.on("ACTIVE_ALL_PROPERIES", function () { this.node.active = true; }.bind(this));
        this.listenerGlobalNode = cc.Canvas.instance.node;
        Linker.listAvatar = this.listAvatar;   
    },
    start() {
        this.updateAvatar();
    },
    onLoadHallView: function () {
        Linker.HallView = this;
        if (Linker.Config) {

            //if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
            if (!Linker.Config.pmE) {
                this.btnNap.active = false;
                this.btnDongTien.active = false;
            }
            if (Linker.version <= Linker.Config.version) {
                this.btnNap.active = true;
                this.btnDongTien.active = true;
            } else {
                this.btnNap.active = false;
                this.btnDongTien.active = false;
            }


            //}
            if (cc.sys.os == cc.sys.OS_IOS) {
                if (!Linker.Config.pmEIOS) {
                    this.btnNap.active = false;
                    this.btnDongTien.active = false;
                } else {
                    if (Linker.versionIOS <= Linker.Config.versionIOS) {
                        this.btnNap.active = true;
                        this.btnDongTien.active = true;
                    } else {
                        this.btnNap.active = false;
                        this.btnDongTien.active = false;
                    }
                }
            }


        }
      
        if (Linker.Config) {
            if (Linker.Config.ISAGENCY != undefined) {
                if (Number(Linker.Config.ISAGENCY)) {
                    this.btnDongTien.active = true;
                } else {
                    this.btnDongTien.active = false;
                }
            }
            if (Linker.Config.FACEBOOK_PAGE) {
                this.btnFacebook.active = true;
            } else {
                this.btnFacebook.active = false;
            }

            if (Linker.Config.FACEBOOK_GROUP) {
                this.btnFacebookGroup.active = true;
            } else {
                this.btnFacebookGroup.active = false;
            }
            if (Linker.Config.TELE_SUPPORT) {
                this.btnTeleSup.active = true;
            } else {
                this.btnTeleSup.active = false;
            }
            if (Linker.Config.TELE_GROUP) {
                this.btnTele.active = true;
            } else {
                this.btnTele.active = false;
            }
            cc.log("Linker.configPurchase.ISKETSAT", Linker.Config.ISKETSAT);
            if (Linker.Config.ISKETSAT) {
                this.btnKetSat.active = true;
            } else {
                this.btnKetSat.active = false;
            }
        }
        this.clock = 0;
        this.btnNap.active = true;
        this.btnDongTien.active = false;
        var tophu = cc.find("Canvas/TopHu");
        if (tophu) {
            tophu.active = true;
        }
    },
    initInfoHallView(userData){
        this.textExp.string = 'Exp: ' + userData.userExp;
        this.textLevel.string = 'VIP:' + userData.userLevel;
        this.textUserId.string = "ID: " + userData.userId + "";
        this.textUserMoney.string = Utils.Number.format(userData.userMoney) + "";
        this.textDisplayName.string = userData.displayName + "";
        this.textUnReadEvent.string = userData.userLevel + "";
        this.textUnReadMail.string = userData.checkMail + "";
        if (this.custom_textForm(String(cc.Global.cofferMoney)) == '0') {
            this.btnHuVang.active = false;
        } else {
            this.textHuVang.string = this.custom_textForm(String(cc.Global.cofferMoney));
            this.btnHuVang.active = false;
        }
        
        //kyun: play background music + Fix music background mute when Local Storage is off 
        this.musicData = Linker.Local.readUserData();
        if (this.musicData) {
            if (this.musicData.isMusic) {
                NewAudioManager.playBackground(NewAudioManager.sound.background);
            }
            if (this.musicData.isSound) {
                NewAudioManager.muteSound(false);
            } else {
                NewAudioManager.muteSound(true);
            }
        } else {
            NewAudioManager.playBackground(NewAudioManager.sound.background);
        }
    },
    initInfoMailNoti(){
        if(Linker.countReadMail){
            var countmail = Linker.countReadMail;
            if(countmail > 0){
                this.countMail.active = true;
                var lblCountMail = this.countMail.getChildByName('txtCountMail').getComponent(cc.Label);
                lblCountMail.string = countmail;
            }else{
                this.countMail.active = false;
            }
        }
        
       
        
    },


    updateEventHome(listEvent) {
        listEvent.forEach((element, pos) => {
            var UrlImage = Linker.HallView.listEventHome.children[pos].getComponent(require('UrlImage'));
            if (UrlImage) {
                UrlImage.loadImage(element.img);
                UrlImage.node.data = element;
            }
        });
    },
    showBottom() {
        this.bottomContainer.active = true;
    },
    hideBottom() {
        this.bottomContainer.active = false;
    },
    showTop() {
        this.topContainer.active = true;
    },
    hideTop() {
        this.topContainer.active = false;
    },
    showChangeNameDialog() {
        cc.log("Change Name");
        var dialog = cc.find("Canvas/ChangeName");
        //fix bị mất button xác nhận khi reconnect
        var dialogjs = dialog.getComponent("ChangeDisplayNameDialog");
        dialogjs.buttonXacNhan.active = true;
        
        if (!dialog.active) {
            dialog.active = true;            
        }
    },
    updateUserMoney() {
        Linker.HallView.textUserMoney.string = Utils.Number.format(Linker.userData.userMoney) + "";
    },

    updateDisplayName() {
        this.textDisplayName.string = Linker.userData.displayName + "";
    },
    updateAvatar() {
        var id = Linker.userData.avatar;
        var sprite = this.listAvatar[Number(id) - 1];
        if (sprite) {
            this.userAvatar.spriteFrame = sprite; 
        } else {
            this.userAvatar.spriteFrame = this.listAvatar[Number(0)];
        }
    },
    onDestroy() {
        Linker.HallView = null;
    },


    custom_textForm(str) {
        var text = '';
        var j = 0;
        for (var i = str.length - 1; i >= 0; i--) {
            j++;
            text = str[i] + text;
            if (j == 3 && i != 0) {
                text = "." + text;
                j = 0;
            }
        }
        return text;
    },
    update(dt) {

        if (this.clock > 1) {
            this.clock = 0;
            this.updateUserMoney();
        }
    }
});
