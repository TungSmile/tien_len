var Linker = require('Linker');
var Socket = require('Socket');
var LoginCache = require('LoginCache');
var Utils = require('Utils');
var NodePoolManager = require('NodePoolManager');
var SceneManager = require('SceneManager');
var NewAudioManager = require('NewAudioManager');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
cc.Class({
    extends: cc.Component,

    properties: {
        profilePrefab: cc.Prefab,
        eventPrefab: cc.Prefab,
        agencyPrefab: cc.Prefab,
        guidePrefab: cc.Prefab,
        rankPrefab: cc.Prefab,
        shopPrefab: cc.Prefab,
        CatKetPrefab: cc.Prefab,
        spineVqmm: cc.Node,
        sukienDialogV2Prefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.phomLoading.active = false;
        // this.samLoading.active = false;
        // this.pokerLoading.active = false;
        // // this.chanLoading.active = false;
        // this.tlmnLoading.active = false;
        // this.rongvangLoading.active = false;
        // this.thuycungLoading.active = false;
        // this.taydukyLoading.active = false;
        // this.longthanLoading.active = false;
        // this.maubinhLoading.active = false;
        // this.bacayLoading.active = false;

        // this.switchGame.getComponent(cc.Sprite).spriteFrame=this.lstSpriteWitchGame[0];
        // this.gameBai.active=true;
        // this.gameSlot.active=false;

        // SceneManager.preloadScene('LobbyScene');
        // if(Linker.configPurchase.ISGAMECHAN==0){
        //     this.chanLoading.parent.getChildByName('khung copy').active=true;
        //     this.chanLoading.parent.parent.getChildByName('btn_chan').getComponent(cc.Button).interactable=false;
        // }else{
        //     this.chanLoading.parent.getChildByName('khung copy').active=false;
        //     this.chanLoading.parent.parent.getChildByName('btn_chan').getComponent(cc.Button).interactable=true;
        // }

        // =true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
    },

    start() {
         
    },
    backHandlerBtn: function (event) {
        if (event.keyCode == cc.macro.KEY.back || event.keyCode == cc.macro.KEY.backspace) {
            if(Linker.isLogin){
                this.btnActionLogout();
            }else{
                G.alert("Bạn có chắc chắn muốn thoát ứng dụng.", G.AT.OK_CANCEL, () => {
                   
                    cc.game.end();
                }, () => {
                    cc.log("choi tiep");
                });
            }
            
        }

    },

    onEnable() {
        
    },
    onDestroy() {
        //cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
    },
    onButtonClick(event) {
        NewAudioManager.playClick();

        if (Linker.isPreloadingAtHall) {
            cc.Global.showMessage('Đang nhận dữ liệu từ Server!');
            return;
        }
        switch (event.target.name) {
            case "btn_quaylai": {
                if (Linker.PhomLobbyEventListener) {
                    var lobbyPrefab = Linker.PhomLobbyEventListener.node.getParent();
                }
                if (lobbyPrefab && lobbyPrefab.active) {
                    Linker.PhomLobbyEventListener.backBtnClick();
                } else {
                    this.btnActionLogout();
                }
                break;  
            }
            case "btn_event_home": {
                var data = event.target.data
                if (data) {
                    if (data.type == 0) {
                        cc.sys.openURL(data.url);
                    }
                }
                break;
            }
            case "btn_sukien": {
                var dialog = cc.find("Canvas/sukienDialogV2");
                if (!dialog) {
                    var sk = cc.instantiate(this.sukienDialogV2Prefab);
                    sk.position = cc.v2(0, 0);
                    sk.active = true;
                    sk.zIndex = cc.macro.MAX_ZINDEX - 1;
                    cc.find("Canvas").addChild(sk);
                    var sks = sk.getComponent("sukienDialogV2");
                    sks.configPopup({data: {
                        currentGameId: 90,
                        currentTabId: 0
                    }});
                    sks.launchSukien();

                } else if (dialog && dialog.active == false) {
                    dialog.active = true;
                    var sks = dialog.getComponent("sukienDialogV2");
                    sks.configPopup({data: {
                        currentGameId: 90,
                        currentTabId: 0
                    }});
                    sks.launchSukien();
                } else if (dialog && dialog.active == true) {
                    dialog.active = false;
                }
                break;
            }
            case "btn_ketsat": {
                var dialog = cc.find("Canvas/KetSat");
                if (!dialog) {
                    var KetSat = cc.instantiate(this.CatKetPrefab);
                    KetSat.position = cc.v2(0, 0);
                    //KetSat.zIndex = cc.macro.MAX_ZINDEX - 1;
                    KetSat.active = true;
                    cc.find("Canvas").addChild(KetSat, cc.macro.MAX_ZINDEX);
                } else if (dialog && dialog.active == false) {
                    dialog.active = true;
                } else if (dialog && dialog.active == true) {
                    dialog.active = false;
                }
                break;
            }
            case "btn_caidat": {
                var dialog = cc.find("Canvas/Setting");
                if (dialog && dialog.active == false) {
                    dialog.active = true;
                } else {
                    dialog.active = false;
                }
                dialog.zIndex = cc.macro.MAX_ZINDEX;
                break;
            }
            case "btn_giftcode": {
                var dialog = cc.find("Canvas/GiftCode");
                if (dialog && dialog.active == false) {
                    dialog.active = true;
                } else {
                    dialog.active = false;
                }
                dialog.zIndex = cc.macro.MAX_ZINDEX;
                break;
            }
            case "btn_homthu": {
                //get list mail
                var test1 = CommonSend.getListMail(1);
                Linker.Socket.send(test1);
                var dialog = cc.find("Canvas/Message");
                if (dialog && dialog.active == false) {
                    dialog.active = true;
                   
                } else {
                    dialog.active = false;
                    Linker.ListMail.MessageDialog.hideLisMessage();
                }
                dialog.zIndex = cc.macro.MAX_ZINDEX;
                break;
            }
            case "btn_dialog": {
                var dialog = cc.find("Canvas/Hall/bottomContainer/popup_dialog");
                if (dialog && dialog.active == false) {
                    dialog.active = true;
                } else {
                    dialog.active = false;
                }
                dialog.zIndex = cc.macro.MAX_ZINDEX;
                break;
            }
            case "btn_huongdan": {
                var dialog = cc.find("Canvas/Guide");
                if (!dialog) {
                    var Guide = cc.instantiate(this.guidePrefab);
                    Guide.position = cc.v2(0, 0);
                    Guide.active = true;
                    cc.find("Canvas").addChild(Guide, cc.macro.MAX_ZINDEX);
                } else if (dialog && dialog.active == false) {
                    dialog.active = true;
                } else if (dialog && dialog.active == true) {
                    dialog.active = false;
                }
                break;
            }
            case "btn_xephang": {
                var dialog = cc.find("Canvas/Rank");
                if (!dialog) {
                    var Rank = cc.instantiate(this.rankPrefab);
                    Rank.position = cc.v2(0, 0);
                    Rank.active = true;
                    cc.find("Canvas").addChild(Rank, cc.macro.MAX_ZINDEX);
                } else if (dialog && dialog.active == false) {
                    dialog.active = true;
                } else if (dialog && dialog.active == true) {
                    dialog.active = false;
                }
                break;
            }
            case "btn_daily": {
                var dialog = cc.find("Canvas/Agency");
                if (!dialog) {
                    var Agency = cc.instantiate(this.agencyPrefab);
                    Agency.position = cc.v2(0, 0);
                    Agency.active = true;
                    cc.find("Canvas").addChild(Agency);
                } else if (dialog && dialog.active == false) {
                    dialog.active = true;
                } else if (dialog && dialog.active == true) {
                    dialog.active = false;
                }
                dialog.zIndex = cc.macro.MAX_ZINDEX;
                break;
            }
            case "btn_cuahang": {
                var dialog = cc.find("Canvas/Shop");
                if (!dialog) {
                    var Shop = cc.instantiate(this.shopPrefab);
                    Shop.position = cc.v2(0, 0);
                    Shop.active = true;
                    cc.find("Canvas").addChild(Shop);
                    Linker.ShopDialog.chargeCard.active = false;
                    Linker.ShopDialog.iap.active = true;
                    Linker.ShopDialog.sms.active = false;
                    Linker.ShopDialog.doithuong.active = false;
                    Linker.ShopDialog.lichsu.active = false;
                    Linker.ShopDialog.chargeCardBtn.getChildByName("check").active = false;
                    //Linker.ShopDialog.smsBtn.getChildByName("check").active = false;
                    Linker.ShopDialog.iapBtn.getChildByName("check").active = true;
                    Linker.ShopDialog.bonusBtn.getChildByName("check").active = false;
                    Linker.ShopDialog.historyBtn.getChildByName("check").active = false;
                } else if (dialog && dialog.active == false) {
                    dialog.active = true;
                    Linker.ShopDialog.chargeCard.active = false;
                    Linker.ShopDialog.iap.active = true;
                    Linker.ShopDialog.sms.active = false;
                    Linker.ShopDialog.doithuong.active = false;
                    Linker.ShopDialog.lichsu.active = false;
                    Linker.ShopDialog.chargeCardBtn.getChildByName("check").active = false;
                    //Linker.ShopDialog.smsBtn.getChildByName("check").active = false;
                    Linker.ShopDialog.iapBtn.getChildByName("check").active = true;
                    Linker.ShopDialog.bonusBtn.getChildByName("check").active = false;
                    Linker.ShopDialog.historyBtn.getChildByName("check").active = false;
                } else {
                    dialog.active = false;
                }
                dialog.zIndex = cc.macro.MAX_ZINDEX;
                break;
            }
            case "btn_nap": {
                var dialog = cc.find("Canvas/Shop");                
                if (!dialog) {
                    var Shop = cc.instantiate(this.shopPrefab);
                    Shop.position = cc.v2(0, 0);
                    Shop.active = true;
                    cc.find("Canvas").addChild(Shop, cc.macro.MAX_ZINDEX - 1);
                    if (Linker.CONFIG_DATA.ISCARD == 1) {
                        Linker.ShopDialog.chargeCard.active = true;
                        Linker.ShopDialog.iap.active = false;
                        Linker.ShopDialog.chargeCardBtn.getChildByName("check").active = true;
                        Linker.ShopDialog.iapBtn.getChildByName("check").active = false;
                    } else {
                        Linker.ShopDialog.chargeCard.active = false;
                        Linker.ShopDialog.iap.active = true;
                        Linker.ShopDialog.chargeCardBtn.getChildByName("check").active = false;
                        Linker.ShopDialog.iapBtn.getChildByName("check").active = true;
                    }
                    Linker.ShopDialog.sms.active = false;
                    Linker.ShopDialog.doithuong.active = false;
                    Linker.ShopDialog.lichsu.active = false;
                    //Linker.ShopDialog.smsBtn.getChildByName("check").active = false;
                    Linker.ShopDialog.bonusBtn.getChildByName("check").active = false;
                    Linker.ShopDialog.historyBtn.getChildByName("check").active = false;
                } else if (dialog && dialog.active == false) {
                    dialog.active = true;
                    if (Linker.CONFIG_DATA.ISCARD == 1) {
                        Linker.ShopDialog.chargeCard.active = true;
                        Linker.ShopDialog.iap.active = false;
                        Linker.ShopDialog.chargeCardBtn.getChildByName("check").active = true;
                        Linker.ShopDialog.iapBtn.getChildByName("check").active = false;
                    } else {
                        Linker.ShopDialog.chargeCard.active = false;
                        Linker.ShopDialog.iap.active = true;
                        Linker.ShopDialog.chargeCardBtn.getChildByName("check").active = false;
                        Linker.ShopDialog.iapBtn.getChildByName("check").active = true;
                    }
                    Linker.ShopDialog.sms.active = false;
                    Linker.ShopDialog.doithuong.active = false;
                    Linker.ShopDialog.lichsu.active = false;
                    //Linker.ShopDialog.smsBtn.getChildByName("check").active = false;
                    Linker.ShopDialog.bonusBtn.getChildByName("check").active = false;
                    Linker.ShopDialog.historyBtn.getChildByName("check").active = false;
                } else {
                    dialog.active = false;
                }
                break;
            }
            case "avatar": {
                var dialog = cc.find("Canvas/Profile");
                if (!dialog) {
                    var Profile = cc.instantiate(this.profilePrefab);
                    Profile.position = cc.v2(0, 0);
                    Profile.active = true;
                    Profile.zIndex = cc.macro.MAX_ZINDEX - 1;
                    cc.find("Canvas").addChild(Profile);
                } else if (dialog && dialog.active == false) {
                    dialog.active = true;
                } else if (dialog && dialog.active == true) {
                    dialog.active = false;
                }
                break;
            }
            case "btn_facebook": {
                if (Linker.Config) {
                    var url = Linker.Config.FACEBOOK_PAGE;
                    cc.sys.openURL(url);
                }
                break;
            }
            case "btn_facebook_group": {
                if (Linker.Config) {
                    var url = Linker.Config.FACEBOOK_GROUP;
                    cc.sys.openURL(url);
                }
                break;
            }
            case "btn_support": {
                if (Linker.Config) {
                    var url = Linker.Config.TELE_SUPPORT;
                    cc.sys.openURL(url);
                }
                break;
            }
            case "btn_grouptele": {
                if (Linker.Config) {
                    var url = Linker.Config.TELE_GROUP;
                    cc.sys.openURL(url);
                }
                break;
            }
            case "btn_hotline": {
                cc.sys.openURL("tel:"+Linker.Config.phone);
                break;
            }
            case "btn_hotro": {
                var dialog = cc.find("Canvas/Hall/bottomContainer/content/btn_hotro/popup_hotro");
                if (dialog && dialog.active == false) {
                    dialog.active = true;
                } else {
                    dialog.active = false;
                }
                dialog.zIndex = cc.macro.MAX_ZINDEX;
                break;
            }
            case "btn_vqmm": {
                // if (!Linker.MiniGame.vqmm.active) {
                //     this.spineVqmm.runAction(cc.sequence(cc.moveTo(0.3, this.spineVqmm.x, this.spineVqmm.y - 200), cc.callFunc(function (node) {
                //         node.active = false;
                //     })));
                //     cc.find('Canvas/bg').active = true;
                //     Linker.MiniGame.vqmm.active = true;
                //     Linker.MiniGame.vqmm.zIndex = cc.macro.MAX_ZINDEX - 1;
                //     Linker.MiniGame.vqmm.position = cc.v2(0, -1000);
                //     Linker.MiniGame.vqmm.runAction(cc.sequence(cc.delayTime(0.3), cc.moveTo(0.3, cc.v2(0, -305))));
                //     Linker.MiniGame.vqmm.getComponent('MovableObject').turnOff();
                // }
                if(!Linker.MiniGame.vqmm.active){
                    Linker.MiniGame.vqmm.getComponent('MovableObject').turnOn();
                    Linker.MiniGame.vqmm.active = true;
                    Linker.MiniGame.vqmm.zIndex = cc.macro.MAX_ZINDEX - 1;
                    Linker.MiniGame.vqmm.position = cc.v2(0, 0);
                }
                break;
            }
        }

    },
    btnActionLogout(){
        var that = this;

        G.alert("Bạn có chắc chắn muốn đăng xuất？", G.AT.OK_CANCEL, () => {
            Linker.Socket.close();
            Linker.isLogin = false;

            if (Linker.isFb) {
                Linker.MySdk.logoutFb();
                Linker.isFb = false;
            }
            Linker.Event.removeEventListenerByName(SocketConstant.GAME.TAI_XIU.JOIN_TAI_XIU);
            Linker.Event.removeEventListenerByName(SocketConstant.GAME.TAI_XIU.UPDATE_TAI_XIU);
            Linker.Event.removeEventListenerByName(SocketConstant.GAME.TAI_XIU.BET_TAI_XIU);
            Linker.Event.removeEventListenerByName(SocketConstant.GAME.TAI_XIU.PHIEN_TX_STATE);
            Linker.Event.removeEventListenerByName(SocketConstant.GAME.TAI_XIU.CHAT_TAI_XIU);
            Linker.Event.removeEventListenerByName(SocketConstant.GAME.MINIPOKER.SPIN);
            Linker.Event.removeEventListenerByName(SocketConstant.GAME.MINIPOKER.INFO);
            Linker.TopHuController = null;
            //remove tophu
            var s = cc.director.getScene();
            var tophu = cc.find("Canvas/TopHu");
            if(tophu) {
                tophu.removeFromParent(true);
                Linker.TopHuController = null;
            }
            var mini = s.getChildByName("Canvas").getChildByName("MiniGame");
            if(mini){
                mini.removeFromParent(true);
                Linker.MiniGame = null;
            }
            that.node.getComponent("HallController").loginManagerment.getComponent("LoginManager").showLayer();
            that.node.getComponent("HallController").removeEventSocket();
            Linker.LoginController.initLogin();
            
        }, () => {
            cc.log("choi tiep");

        });
    }
});

//