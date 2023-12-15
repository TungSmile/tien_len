var NewAudioManager = require('NewAudioManager');
var Linker = require('Linker');
var i18n = require('i18n');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        chargeCard: cc.Node,
        iap: cc.Node,
        sms: cc.Node,
        doithuong: cc.Node,
        lichsu: cc.Node,
        momo: cc.Node,
        googleplay: cc.Node,
        chargeCardBtn: cc.Node,
        iapBtn: cc.Node,
        smsBtn: cc.Node,
        bonusBtn: cc.Node,
        historyBtn: cc.Node,
        btnNapthe: cc.Node,
        btnDoiThuong: cc.Node,
        btnChuyenKhoan: cc.Node,
        btnMoMo: cc.Node,
        btnGooglePlay: cc.Node,
        chuyenKhoanPrefab: cc.Prefab,
        mainContent: cc.Node,
        leftNode: cc.Node,
        title: cc.Label,
        popupNapThe: cc.Prefab,
        list_titleFrame: [cc.SpriteFrame],
        list_btnFrame: [cc.SpriteFrame],
        // LIFE-CYCLE CALLBACKS:
        _isShowChuyenKhoanNode: false,
        isShowChuyenKhoanNode: {
            get: function () {
                return this._isShowChuyenKhoanNode ? true : false;
            },
            set: function (isShow) {
                isShow = isShow ? true : false;
                this._isShowChuyenKhoanNode = isShow;
                if (!this.chuyenKhoanContent) return;
                this.chuyenKhoanContent.active = isShow;
            }
        }
    },
    chuyenKhoanContent: null,
    initChuyenkhoan() {
        if (!this.chuyenKhoanContent || (this.chuyenKhoanContent && !cc.isValid(this.chuyenKhoanContent))) {
            this.chuyenKhoanContent = cc.instantiate(this.chuyenKhoanPrefab);
            this.mainContent.addChild(this.chuyenKhoanContent);
            this.isShowChuyenKhoanNode = false;
        }
    },
    onCloseChuyenKhoan() {
        this.isShowChuyenKhoanNode = false;
    },
    onLoad() {
        var self = this;
        Linker.ShopDialog = this;
        this.initChuyenkhoan();
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //self.node.active = false;
        }, this);
        // kyun: Inactive button
        if (!Linker.CONFIG_DATA) {
            Linker.CONFIG_DATA = cc.sys.localStorage.getItem("CONFIG_DATA");
        }
        this.node.on("EVENT_NAP_NHANH_FACOI", this.callEventNapNgay, this);
    },

    start() {

    },
    checkExist: function (name) {
        for (var i = 0; i < this.mainContent.children.length; i++) {
            if (this.mainContent.children[i].name == name) {
                return true;
            }
        }
        return false;
    },
    callEventNapNgay: function (data) {
        this.topBtnClick(data.napthe);
    },
    onEnable: function () {
        // this.stopPropagationOnBackdrop = Utils.Node.stopPropagation(this.backdrop);
        // this.node.stopAllActions();
        // this.node.setScale(0.3);
        // this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
        this.topBtnClick({
            target: {
                name: "btn_googleplay"
            }
        })
        // if (Linker.ShopType == 0) {
        //     // this.title.string = i18n.t("title_freecoin");
        //     this.title.string = i18n.t("title_shop");
        //     this.chargeCard.active = true;
        //     this.iap.active = false;
        //     this.sms.active = false;
        //     this.doithuong.active = false;
        //     this.lichsu.active = false;
        //     this.chuyenKhoanContent.active = false;
        //     this.googleplay.active = false;

        //     this.chargeCardBtn.active = true;
        //     // this.smsBtn.active = true;
        //     this.iapBtn.active = true;
        //     this.btnMoMo.active = true;
        //     this.bonusBtn.active = false;
        //     this.historyBtn.active = false;
        //     this.btnChuyenKhoan.active = false;
        //     this.btnGooglePlay.active = true;
        // } else {
        //     this.title.string = i18n.t("title_shop");
        //     this.chargeCard.active = false;
        //     this.iap.active = false;
        //     this.sms.active = false;
        //     this.doithuong.active = true;
        //     this.lichsu.active = false;
        //     this.chuyenKhoanContent.active = false;
        //     this.googleplay.active = false;

        //     this.btnMoMo.active = false;
        //     this.chargeCardBtn.active = false;
        //     this.smsBtn.active = false;
        //     this.iapBtn.active = false;
        //     this.bonusBtn.active = true;
        //     this.historyBtn.active = true;
        //     this.btnChuyenKhoan.active = true;
        //     this.btnGooglePlay.active = false;
        // }
       
        console.log("Linker.Config.pmE:",Linker.Config.pmE);
        this.checkConfig();
        // this.showContent();
        // this.checkConfigCard();
    },

    checkConfigCard(){
        if(Linker.Config){
            if(Linker.Config.pmE){
                this.btnNapthe.active = true;
            }else{
                this.btnNapthe.active = false;
            }
        }
    },

    checkConfig() {
        if (Linker.CONFIG_DATA) {
            // if (Linker.CONFIG_DATA.ISSHOP >= 1 && Linker.ShopType !== 0) {
            //     this.btnDoiThuong.active = true;
            //     if(Linker.CONFIG_DATA.ISSHOP == 2 && cc.sys.os == cc.sys.OS_ANDROID){
            //         this.btnDoiThuong.active = false;
            //     }else if(Linker.CONFIG_DATA.ISSHOP == 3 && cc.sys.os == cc.sys.OS_IOS){
            //         this.btnDoiThuong.active = false;
            //     } 
            // } else {
            //     this.btnDoiThuong.active = false;
            // }

            // if (Linker.CONFIG_DATA.ISCARD == 1 && Linker.ShopType == 0) {
            //     this.btnNapthe.active = true;
            // } else {
            //     this.btnNapthe.active = false;
            // }

            // if (Linker.Config.ISSMS == 1 && Linker.ShopType == 0) {
            //     // this.smsBtn.active = true;
            // } else {
            //     this.smsBtn.active = false;
            // }
            // //active chuyen tien
            // this.btnChuyenKhoan.active = false;
            // this.chuyenKhoanContent.active = false;

            // if(Linker.Config.ISAGENCY == 1 && Linker.ShopType !== 0){
            //     this.btnChuyenKhoan.active = true;
            // }

            // Linker.Config.isMoMo = 0;
            // if (Linker.Config.isMoMo == 1 && Linker.ShopType == 0) {
            //     this.btnMoMo.active = true;
            // } else {
            //     this.btnMoMo.active = false;
            // }

            // this.btnGooglePlay.active = (Linker.Config.pmE == 1) ? true : false;
        }
        if (Linker.version >= Linker.Config.version || !Linker.Config.pmE) {
            this.btnDoiThuong.active = false;
            this.btnNapthe.active = false;
            this.smsBtn.active = false;
            this.btnChuyenKhoan.active = false;
            this.btnMoMo.active = false;
        }
    },

    showContent() {
        this.resetBtnLeft();
        var leftChilds = this.leftNode.children;
        for (let i = 0; i < leftChilds.length; i++) {
            if (leftChilds[i].active == true) {
                this.activeContent(leftChilds[i]);
                return;
            }
        }
    },

    resetBtnLeft() {
        var leftChilds = this.leftNode.children;
        for (let i = 0; i < leftChilds.length; i++) {
            if (leftChilds[i].active == true) {
                leftChilds[i].getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
            }
        }
    },

    activeContent(btn) {
        var content = this.mainContent.children;
        switch (btn) {
            case this.chargeCardBtn:
                this.chargeCardBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                for (let i = 0; i < content.length; i++) {
                    if (content[i] == this.chargeCard) {
                        content[i].active = true;
                    } else {
                        content[i].active = false;
                    }
                }
                break;

            case this.smsBtn:
                this.smsBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                for (let i = 0; i < content.length; i++) {
                    if (content[i] == this.sms) {
                        content[i].active = true;
                    } else {
                        content[i].active = false;
                    }
                }
                break;

            case this.iapBtn:
                this.iapBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                for (let i = 0; i < content.length; i++) {
                    if (content[i] == this.iap) {
                        content[i].active = true;
                    } else {
                        content[i].active = false;
                    }
                }
                break;

            case this.bonusBtn:
                this.bonusBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                for (let i = 0; i < content.length; i++) {
                    if (content[i] == this.doithuong) {
                        content[i].active = true;
                    } else {
                        content[i].active = false;
                    }
                }
                break;

            case this.historyBtn:
                this.historyBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                for (let i = 0; i < content.length; i++) {
                    if (content[i] == this.lichsu) {
                        content[i].active = true;
                    } else {
                        content[i].active = false;
                    }
                }
                break;

            case this.btnChuyenKhoan:
                this.chargeCardBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                for (let i = 0; i < content.length; i++) {
                    if (content[i] == this.chuyenKhoanContent) {
                        content[i].active = true;
                    } else {
                        content[i].active = false;
                    }
                }
                break;
            case this.btnMoMo: {
                this.btnMoMo.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                for (let i = 0; i < content.length; i++) {
                    if (content[i] == this.momo) {
                        content[i].active = true;
                    } else {
                        content[i].active = false;
                    }
                }
                break;
            }
            case this.btnGooglePlay: {
                this.btnGooglePlay.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                for (let i = 0; i < content.length; i++) {
                    if (content[i] == this.googleplay) {
                        content[i].active = true;
                    } else {
                        content[i].active = false;
                    }
                }
                break;
            }
            default:
                break;
        }
    },

    onDisable: function () {
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
    },
    closeBtnClick() {
        NewAudioManager.playClick();
        this.node.active = false;
        this.isShowChuyenKhoanNode = false;
    },
    topBtnClick(event) {
        NewAudioManager.playClick();
        switch (event.target.name) {
            case "btn_napthe": {
                this.chargeCard.active = true;
                this.iap.active = false;
                this.sms.active = false;
                this.doithuong.active = false;
                this.isShowChuyenKhoanNode = false;
                this.lichsu.active = false;
                this.momo.active = false;
                this.googleplay.active = false;

                this.btnGooglePlay.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.btnMoMo.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.chargeCardBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                this.smsBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.iapBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.bonusBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.historyBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.btnChuyenKhoan.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];

                break;
            }
            case "btn_sms": {
                this.chargeCard.active = false;
                this.iap.active = false;
                this.sms.active = true;
                this.doithuong.active = false;
                this.lichsu.active = false;
                this.isShowChuyenKhoanNode = false;
                this.momo.active = false;
                this.googleplay.active = false;

                this.btnGooglePlay.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.btnMoMo.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.chargeCardBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.smsBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                this.iapBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.bonusBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.historyBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.btnChuyenKhoan.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];

                break;
            }
            case "btn_iap": {
                this.chargeCard.active = false;
                this.iap.active = true;
                this.sms.active = false;
                this.doithuong.active = false;
                this.isShowChuyenKhoanNode = false;
                this.lichsu.active = false;
                this.momo.active = false;
                this.googleplay.active = false;

                this.btnGooglePlay.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.btnMoMo.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.chargeCardBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.smsBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.iapBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                this.bonusBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.historyBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.btnChuyenKhoan.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                break;
            }
            case "btn_doithuong": {
                this.chargeCard.active = false;
                this.iap.active = false;
                this.sms.active = false;
                this.doithuong.active = true;
                this.isShowChuyenKhoanNode = false;
                this.lichsu.active = false;
                this.momo.active = false;
                this.googleplay.active = false;

                this.btnGooglePlay.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.btnMoMo.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.chargeCardBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.smsBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.iapBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.bonusBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                this.historyBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.btnChuyenKhoan.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                break;
            }
            case "btn_lichsu": {
                this.chargeCard.active = false;
                this.iap.active = false;
                this.sms.active = false;
                this.doithuong.active = false;
                this.isShowChuyenKhoanNode = false;
                this.lichsu.active = true;
                this.momo.active = false;
                this.googleplay.active = false;

                this.btnGooglePlay.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.chargeCardBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.smsBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.iapBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.bonusBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.historyBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                this.btnChuyenKhoan.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.btnMoMo.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                break;
            }
            case "btn_chuyenkhoan": {
                this.title.string = i18n.t("shop_button_transfer");
                this.chargeCard.active = false;
                this.iap.active = false;
                this.sms.active = false;
                this.doithuong.active = false;
                this.isShowChuyenKhoanNode = true;
                this.lichsu.active = false;
                this.momo.active = false;
                this.googleplay.active = false;

                this.btnGooglePlay.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.chargeCardBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.smsBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.iapBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.bonusBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.historyBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.btnChuyenKhoan.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                this.btnMoMo.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                break;
            }
            case "btn_momo": {
                this.chargeCard.active = false;
                this.iap.active = false;
                this.sms.active = false;
                this.doithuong.active = false;
                this.lichsu.active = false;
                this.isShowChuyenKhoanNode = false;
                this.momo.active = true;
                this.googleplay.active = false;

                this.btnGooglePlay.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.btnMoMo.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                this.chargeCardBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.smsBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.iapBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.bonusBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.historyBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.btnChuyenKhoan.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                break
            }
            case "btn_googleplay": {
                this.title.string = i18n.t("title_shop");
                this.chargeCard.active = false;
                this.iap.active = false;
                this.sms.active = false;
                this.doithuong.active = false;
                this.lichsu.active = false;
                this.isShowChuyenKhoanNode = false;
                this.momo.active = false;
                this.googleplay.active = true;

                this.btnGooglePlay.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[1];
                this.btnMoMo.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.chargeCardBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.smsBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.iapBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.bonusBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.historyBtn.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                this.btnChuyenKhoan.getComponent(cc.Sprite).spriteFrame = this.list_btnFrame[0];
                break
            }
        }
    },

    showPopupNapThe(){
        let canvas = cc.find('Canvas');
        if (canvas) {
            let homePortal = canvas.getChildByName('HomePortal');
            if (homePortal) {
                let homeMap = homePortal.getChildByName('HomeMap');
                if (homeMap) {
                    let nodeNapThe = homeMap.getChildByName('PopupNapThe');
                    let nodeShop = homeMap.getChildByName('Shop');
                    if (nodeNapThe) {
                        nodeNapThe.active = !nodeNapThe.active;
                        nodeShop.active = false;
                    }else {
                        nodeNapThe = cc.instantiate(this.popupNapThe);
                        homeMap.addChild(nodeNapThe);
                        nodeShop.active = false;
                    }
                }
            }
        }
    },


    onBtnCloseClick: function () {
        console.log("onBtnCloseClick   Shop Dialog");
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        customEvent.toggle = this.node.getComponent(cc.Toggle);
        this.node.dispatchEvent(customEvent);
        this.node.active = false;
    }
    // update (dt) {},
});
