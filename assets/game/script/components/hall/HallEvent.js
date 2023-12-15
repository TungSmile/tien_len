var Api = require('Api');
var Linker = require('Linker');

cc.Class({
    extends: cc.Component,

    properties: {
        eventPrefab: cc.Prefab,
        sukienDialogV2Prefab: cc.Prefab,
        shopPrefab: cc.Prefab,
        sukienPageView: cc.PageView
    },
    onLoad() {
        Linker.HallEvent = this;
        // this.scheduleEventRun();
        // this.addSocketEvent();
    },
    onDestroy: function () {
        this.removeEventSocket();
    },
    addSocketEvent() {
        Linker.Event.addEventListener(14004, this.initEventHallScene, this);
        //this.initEventHallScene();
    },
    removeEventSocket: function () {
        Linker.Event.removeEventListener(14004, this.initEventHallScene, this);
    },
    initEventHallScene: function () {
        var that = this;
        if (!Linker.HallEventData || Linker.HallEventData.length == 0) {
            var data = cc.sys.localStorage.getItem("list_imags_events");
            if(!data){
                if (Linker.Config && Linker.Config.APP_API) {
                    Api.get(Linker.Config.APP_API + "api-events", (data) => {
                        if(data){
                            cc.sys.localStorage.setItem("list_imags_events", JSON.stringify(data));
                        }else{
                            data = cc.sys.localStorage.getItem("list_imags_events");
                        }
                        cc.log("data");
                        that.renderEventSlider(data);
                    });
                } else {
                    cc.log("Lỗi load sự kiện hall scene ...");
                }
            }else{
                data = JSON.parse(data);
                that.renderEventSlider(data);
            }
            

        } else if (Linker.HallEventData.length > 0) {
            cc.log("da toan tai ",Linker.HallEventData.length);
            //nap lai data
            if(this.sukienPageView && this.sukienPageView.isValid){
                this.sukienPageView.removeAllPages();
                for (var i = 0; i < Linker.HallEventData.length; i++) {
                    var n = new cc.Node();
                    n.on(cc.Node.EventType.TOUCH_END, Linker.HallEvent.eventClick, Linker.HallEvent);
                    var sp = n.addComponent(cc.Sprite);
                    sp.spriteFrame = Linker.HallEventData[i].spriteFrame;
                    if(this.sukienPageView && this.sukienPageView.isValid && this.sukienPageView.node){
                        this.sukienPageView.addPage(n);
                    }
                }
            }
        }

    },
    renderEventSlider(data){
        var that = this;
        if (data) {
            Linker.HallEventDataType = data.array;
            Linker.HallEventData = [];
            if (data.array.length > 1) {
                if(that.sukienPageView && that.sukienPageView.isValid){
                    that.sukienPageView.removeAllPages();
                    data.array.forEach((item, i) => {
                        cc.loader.load(item.img, function (err, tex) {
                            var nSpriteFrame = new cc.SpriteFrame(tex);
                            var n = new cc.Node();
                            n.on(cc.Node.EventType.TOUCH_END, Linker.HallEvent.eventClick, Linker.HallEvent);
                            var sp = n.addComponent(cc.Sprite);
                            sp.spriteFrame = nSpriteFrame;
                            if(that.sukienPageView && that.sukienPageView.isValid){
                                that.sukienPageView.addPage(n);
                                item.spriteFrame = sp.spriteFrame;
                                Linker.HallEventData.push(item);
                            }
                           

                        });
                    });
                }                            
            }
        
        }
    },
    scheduleEventRun: function () {
        var index = 0;
        var that = this;
        var a = setInterval(function () {
            var sceneName;
            var _sceneInfos = cc.game._sceneInfos
            for (var i = 0; i < _sceneInfos.length; i++) {
                if (_sceneInfos[i].uuid == cc.director._scene._id) {
                    sceneName = _sceneInfos[i].url
                    sceneName = sceneName.substring(sceneName.lastIndexOf('/') + 1).match(/[^\.]+/)[0]
                }

            }
            if (sceneName == 'HallScene') {
                if (that.node) {
                    //run slider auto
                    var allPages = that.sukienPageView.getPages();
                    index++;
                    if (index > allPages.length - 1) {
                        index = 0;
                    }
                    that.sukienPageView.scrollToPage(index, 0.5);
                } else {
                    clearInterval(a);
                }
            } else {
                clearInterval(a);
            }
        }, 4000);//run each 4 seconds slide one
    },
    onTouchMove: function (event) {

    },
    onDestroy() {
        cc.systemEvent.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

    },
    start() {

    },

    eventClick() {
        //cc.log("eventClick this.mouseEnter:"+this.mouseEnter);
        if (Linker.isLogin && Linker.HallEventData) {
            if (this.sukienPageView.getPages().length > 0) {
                var currentIndex = this.sukienPageView.getCurrentPageIndex();
                var currentEvent = Linker.HallEventData[currentIndex];
                var type = currentEvent.type;
                switch (type) {
                    case 0: {
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
                        break;
                    }
                    case 1: {
                        var dialog = cc.find("Canvas/Event");
                        if (!dialog) {
                            var Event = cc.instantiate(this.eventPrefab);
                            Event.position = cc.v2(0, 0);
                            Event.active = true;
                            cc.find("Canvas").addChild(Event);
                        } else if (dialog && dialog.active == false) {
                            dialog.active = true;
                        } else if (dialog && dialog.active == true) {
                            dialog.active = false;
                        }
                        break;
                    }
                    case 3: {
                        cc.sys.openURL(currentEvent.url);
                        break;
                    }
                    default: {
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
                }
            } else {
                var dialog = cc.find("Canvas/sukienDialog");
                if (dialog && dialog.x == 2000) {
                    dialog.position = cc.v2(0, 0);
                    dialog.active = true;
                } else {
                    dialog.position = cc.v2(2000, 0);
                    dialog.active = false;
                }
            }
        }


    },

    // update (dt) {},
});