var NewAudioManager = require("NewAudioManager");
var Linker = require('Linker');
var Utils = require('Utils');
var CommonSend = require('CommonSend');
var NativeBridge = require("NativeBridge");
var FacebookSDK = require("FacebookSDK");
var Linker = require('Linker');
var DataAccess = require('DataAccess');
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        textUserName: cc.Label,
        textDisplayName: cc.Label,
        // textCurrentMoney: cc.Label,
        // textAddress: cc.Label,
        // textPhone: cc.Label,
        // textEmail: cc.Label,
        // textLevel: cc.Label,
        // textExp: cc.Label,
        // dialogChangeName: cc.Node,
        // dialogChangeAvatar: cc.Node,
        // dialogChangeUserInfo: cc.Node,
        // rateWinLose: cc.Node,
        // userAvatar: cc.Sprite,
        btnTeleActive: cc.Node,
        codeTeleNode: cc.Node,
        // btnEmailActive: cc.Node,
        // btnXacNhanActive: cc.Node,
        // emailActivePrefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // Linker.UserTab = this;
        // this.initUserTab();
    },
    checkActiveStatus: function () {
        cc.log("Linker.Config.APP_API:", Linker.Config.APP_API);
        cc.log("Linker.userData:", Linker.userData);
        if (Linker.userData.isActive == 1 || Linker.userData.isActive == "1" && this.userId == Linker.userData.userId) {
            this.btnTeleActive.active = false;
            this.codeTeleNode.active = false;
        } else {
            this.btnTeleActive.active = true;
            this.codeTeleNode.active = true;
        }
        // if (Linker.Config.APP_API) {
        //     if (Linker.Config.isOpenActive == 1) {
        //         this.activeAllBtn();
        //     } else {
        //         this.deActiveAllBtn();
        //     }
        // } else {
        //     this.deActiveAllBtn();
        // }
    },
    activeAllBtn: function () {
        this.btnTeleActive.active = true;
        // this.btnEmailActive.active = true;
        this.btnXacNhanActive.active = true;
    },
    deActiveAllBtn: function () {
        // this.btnEmailActive.active = false;
        this.btnTeleActive.active = false;
        // this.btnXacNhanActive.active = false;
    },
    activeBtnClick(event) {
        switch (event.target.name) {
            case "btn_tele":
                NewAudioManager.playClick();
                if (Linker.Config.APP_API) {
                    //this.btnTeleActive.active = false;
                    var url = Linker.Config.KHTELE;
                    if (url.length > 0) {
                        cc.sys.openURL(url);
                    } else {
                        cc.log("Địa chỉ API kích hoạt trống, hoặc không hợp lệ ...");
                    }
                } else {
                    //this.btnTeleActive.active = true;
                    cc.log("Lỗi không thể load API kích hoạt tài khoản ...");
                }
                break;
            case "btn_email":
                NewAudioManager.playClick();
                if (Linker.Config.APP_API) {
                    //this.btnEmailActive.active = false;
                    var url = Linker.Config.KHGMAIL;
                    if (url.length > 0) {
                        var dialog = cc.find("Canvas/EmailActive");
                        if (!dialog) {
                            dialog = cc.instantiate(this.emailActivePrefab);
                            dialog.position = cc.v2(0, 0);
                            dialog.active = true;
                            dialog.zIndex = cc.macro.MAX_ZINDEX - 1;
                            cc.find("Canvas").addChild(dialog);
                        } else if (dialog && dialog.active == false) {
                            dialog.active = true;
                        }
                        var dialogscript = dialog.getComponent("EmailActive");
                        dialogscript.config();
                    } else {
                        cc.log("Địa chỉ API kích hoạt trống, hoặc không hợp lệ ...");
                    }
                } else {
                    //this.btnEmailActive.active = true;
                    cc.log("Lỗi không thể load API kích hoạt tài khoản ...");
                }
                break;
            case "btn_xacnhan":
                NewAudioManager.playClick();
                //this.btnXacNhanActive.active = false;
                if (cc.sys.isBrowser) {
                    FacebookSDK.smsLogin();
                }
                else {
                    NativeBridge.smsLogin();
                }
                break;
            default:
                break;
        }
    },
    changeAvatarBtnClick() {
        NewAudioManager.playClick();
        this.dialogChangeAvatar.active = true;
    },
    changeUserInfoBtnClick() {
        NewAudioManager.playClick();
        this.dialogChangeUserInfo.active = true;
    },
    changeDisplayNameBtnClick() {
        NewAudioManager.playClick();
        this.dialogChangeName.active = true;
    },
    onEnable() {
        this.initUserTab();
    },
    initUserTab: function () {
        this.deActiveAllBtn();
        this.checkActiveStatus();
    },
    setUserId: function (id) {
        if (id) {
            id = Number(id);
            this.userId = id;
        }
    },
    requestUserInfo: function () {
        if (this.userId) {
            var test = CommonSend.getUserInfo(this.userId);
            Linker.Socket.send(test);
        }
    },
    start() {
        this.addSocketEvent();
    },
    addSocketEvent() {
        // Linker.Event.addEventListener(12014, this.onUpdatePhone, this);
        // DataAccess.Instance.node.on("update-user-data", this.onGetUserData, this);
    },
    removeSocketEvent() {
        // Linker.Event.removeEventListener(12014, this.onUpdatePhone, this);
        // DataAccess.Instance.node.off("update-user-data", this.onGetUserData, this);
    },
    onUpdatePhone(message) {
        if (Number(this.userId) == Number(Linker.userData.userId)) {
            cc.log("onupdatePHone", message);
            if (message.status == 1) {
                // Linker.userData.displayName = this.textDisplayName;
                cc.Global.showMessageOption(message, { duration: 6 });
                // if (Linker.UserTab) {
                //     Linker.UserTab.textDisplayName.string = Linker.userData.displayName;
                // }
                // if (Linker.HallView) {
                //     Linker.HallView.updateDisplayName();
                //     this.node.active = false;
                // };
            } else {
                cc.Global.showMessageOption(message, { duration: 6 });
            }
            if (cc.find("Loading")) cc.find("Loading").active = false;
        }
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    updateData(message) {
        if (Number(this.userId) == Number(Linker.userData.userId)) {
            if (Linker.userData) {
                //var username = require('LoginCache').get().username;
                this.textUserName.string = message.displayName;
                this.textCurrentMoney.string = Utils.Number.format(message.userMoney);
                this.textDisplayName.string = message.nickName;
                // Linker.Config.isOpenActive = 0; 

                if (Linker.userData.isActive == 1 || Linker.userData.isActive == "1") {
                    this.deActiveAllBtn();
                } else {
                    if (Linker.Config.isOpenActive == 1) {
                        this.activeAllBtn();
                    } else {
                        this.activeAllBtn();
                        this.btnXacNhanActive.active = false;
                        //this.deActiveAllBtn();
                    }

                }
            }
            this.updateAvatar();
            this.updateWinLose(message.history);
            this.textAddress.string = message.address;
            if (message.phoneNumber) {
                var temp = '';
                for (var i = message.phoneNumber.toString().trim().length - 4; i < message.phoneNumber.toString().trim().length; i++) {
                    temp = temp + message.phoneNumber.toString().trim()[i].toString();
                }
                this.textPhone.string = '*******' + temp;
            } else {
                this.textPhone.string = 'Chưa cập nhật';
            }
            if (message.cmt) {
                this.textEmail.string = message.cmt;
            } else {
                this.textEmail.string = 'Chưa cập nhật';
            }
            if (Linker.userData) {
                if (Linker.userData.hasOwnProperty("userExp")) {
                    this.textExp.string = Linker.userData.userExp;
                }
                if (Linker.userData.hasOwnProperty("userLevel")) {
                    this.textLevel.string = Linker.userData.userLevel;
                }

            }
            Linker.userData.email = message.cmt;
        }

    },
    onGetUserData(message) {
        if (message.status == 1) {
            this.updateData(message);
        }
        if (cc.find("Loading")) cc.find("Loading").active = false;
    },
    updateWinLose(history) {
        // history.forEach((element, pos) => {
        //     var ItemRateWin = this.rateWinLose.children[pos].getComponent(require('ItemRateWin'));
        //     if (ItemRateWin) {
        //         ItemRateWin.init(element);
        //     } else {
        //         //cc.log(ItemRateWin);
        //     }
        //     //cc.log("AAA");
        // });
    },
    updateAvatar() {
        if (Number(this.userId) == Number(Linker.userData.userId)) {
            var id = Linker.userData.avatar;
            if (Linker.HallView && Linker.HallView.listAvatar) {
                var spriteFrame = Linker.HallView.listAvatar[Number(id - 1)];
                this.setAvatar(spriteFrame)
            } else if (Linker.PhomLobbyView && Linker.PhomLobbyView.isValid && Linker.PhomLobbyView.listAvatar) {
                var spriteFrame = Linker.PhomLobbyView.listAvatar[Number(id - 1)];
                this.setAvatar(spriteFrame);
            } else if (Linker.listAvatar) {
                this.setAvatar();
            }
        }
    },
    setAvatar: function (spriteFrame) {
        if (spriteFrame) {
            this.userAvatar.spriteFrame = spriteFrame;
        } else {
            this.userAvatar.spriteFrame = Linker.listAvatar[Number(0)];
        }
    },
    copyUserName() {
        NewAudioManager.playClick();
        if (cc.sys.isNative) {
            jsb.copyTextToClipboard(this.textUserName.string);
            cc.Global.showMessage(i18n.t("Đã copy"));
        } else {
            cc.Global.showMessage(i18n.t("Không hỗ trợ trên web"));
        }
    },
    copyViewname() {
        NewAudioManager.playClick();
        if (cc.sys.isNative) {
            jsb.copyTextToClipboard(this.textDisplayName.string);
            cc.Global.showMessage(i18n.t("Đã copy"));
        } else {
            cc.Global.showMessage(i18n.t("Không hỗ trợ trên web"));
        }
    }
    // update (dt) {},
});
