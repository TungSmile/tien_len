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
var Constant = require('Constant');
var PACKAGE_NAME = "com.sieuprox.langbagian";
var Global = require("Global");
var NativeBridge = require("NativeBridge");
var TQUtil = require('TQUtil');
var i18n = require('i18n');
var Api = require('Api');
var Utils = require('Utils');
var SceneManager = require('SceneManager');
var AdsSend = require("AdsSend");
var CommonSend = require('CommonSend')
var SdkBoxUtil = require('SdkBoxUtil')
var default_config = '{"name":"authen","host":"s1tlmn.chanthieny.com","api_config":"http://apitlmn.chanthieny.com/api-config","hostchan":"tlmn.chanthieny.com","port":9090,"portchan":9090,"websocket":8888,"version":0,"versionIOS":2,"ip_rs":"tlmn.chanthieny.com","phone":"","pmE":false,"pmEIOS":false,"FACEBOOK_PAGE":"https://www.facebook.com/tienlenhaynhat/","FACEBOOK_GROUP":"https://t.me/tienlenhaynhat","updatenow":false,"a":"","i":"","inapp":true,"invite":"21,105,210","isvideo":true,"isads":true,"issms":0,"APP_API":"http://apitlmn.chanthieny.com/","ISGAMECHAN":0,"isOpenActive":0,"ISAGENCY":1,"ISBAINOHU":1,"TELE_SUPPORT":"","TELE_GROUP":"","ISKETSAT":"","KHTELE":"https://t.me/tienlenhaynhat","KHGMAIL":"kichHoatGmail","istathan":0,"isthuycung":1,"isthinhkinh":0,"islongthan":1,"istlmn":1,"isphom":1,"isbinh":1,"issam":1,"islieng":1,"isbacay":1,"ispoker":1,"isxocdia":1,"isxoso":0,"islarva":1,"apiVersion":2,"ISLOGINDAY":1,"isloginfb":1,"isOpenTour":1,"MESSAGER":"http://facebook.com/tienlenhaynhat","avafb":1,"isMiniPoker":0,"isSlot777":0,"isSlot8Ball":0,"isLuckyShot":1,"isLuckyDay":1,"shareLink":"https://www.facebook.com/sharer/sharer.php?u=http://apitlmn.chanthieny.com/web","lang":"VI","listBundle":[]}';
cc.Class({
    extends: cc.Component,

    properties: {
        manifestUrl: {
            type: cc.Asset,
            default: null,
        },

        txtMessage: cc.Label,
        txtVersion: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        //add by zep
        // if (!cc.sys.isNative ) {
        //     if(location.hostname != "localhost"){
        //         setInterval(function(){
        //         var startTime = performance.now(), check, diff;
        //         for (check = 0; check < 1000; check++){
        //             cc.log(check);
        //             cc.clear();
        //         }
        //         diff = performance.now() - startTime;
        //         if (diff > 200){
        //             cc.log("See me!");
        //             while (true) {eval("debugger")};

        //         }
        //         }, 100);
        //     }
        //   }
        //add by zep
        console.log("cc.sys.os:"+cc.sys.os);
    },
    onLoad: function () {
        Linker.MySdk = this;
        if (this.DialogReconnect) {
            this.DialogReconnect.active = false;
        }
        if (cc.sys.isMobile && typeof sdkbox != "undefined") {
            this.initIAP();
            this.adMobInit();
            // this.googleAnalyticInit();
            this.initOneSignal();
            //this.initFacebook();
            SdkBoxUtil.initSDK();
        }
        this.otherSetting();//add by zep
        // this.txtVersion.string = Linker.versionHotUpdate;
    },
    otherSetting() {//start add by zep 
        // if (cc.sys.isBrowser) {
            this.completeCallback();
            //cc.loader.loadResDir("", this.progressCallback.bind(this), this.completeCallback.bind(this));
        // } else {
        //     this.prepareUpdate(); //TODO hotupdate
        //     //this.completeCallback();
        // }
    },

    completeCallback: function () {
        if (cc.sys.isNative) {

            Global.versionName = NativeBridge.getVersionNative();
            Global.deviceID = NativeBridge.getDeviceIDNative();
        }
        else {
            Global.deviceID = TQUtil.getWebDeviceID();
        }

        var self = this;
        var base = 'http://apitlmn.chanthieny.com/api-config';
        // var base = 'api-config.txt';

        if (cc.sys.isNative || location.hostname === "localhost") {
            // base = 'https://kingbidacom.firebaseapp.com/assets/configSime.json';//goi firebase truoc
            // var base = 'http://api.vipgame.com:3200/api-config';
            //var base = 'http://api.sime.club/api-config';
        }

        var url = base + "?deviceID=" + Global.deviceID + "&version=" + Global.versionName + "&packagename=com.tienlenvip.miennams&os=" + cc.sys.os;
        console.log("urlcfg:" + url);
        // this.get(url, (data) => {//goi tu firebase truoc
        //     // console.log("fibase url:" + data.api_config);
        //     // this.txtMessage.string = i18n.t("loading") + ' 1...';
        //     // if (data.api_config != undefined) {
        //     //     //bat dau get config my server
        //     //     //data.api_config = 'http://api.sime.club/api-config';
        //     //     var my_url = data.api_config + "?deviceID=" + Global.deviceID + "&version=" + Global.versionName + "&packagename=com.king.bida&os=" + cc.sys.os;
        //     //     console.log("my_url:" + my_url);
        //     //     this.get(my_url, (my_data) => {
        //             // this.txtMessage.string = i18n.t("loading") + ' 2...';
        //             // self.parseConfig(my_data);
        //             self.parseConfig(data);
        //     //     });
        //     // } else {
        //     //     this.txtMessage.string = i18n.t('loading default');

        //     //     base = 'http://api.sime.club/api-config';
        //     //     var my_url = base + "?deviceID=" + Global.deviceID + "&version=" + Global.versionName + "&packagename=com.king.bida&os=" + cc.sys.os;
        //     //     console.log("my_url:" + my_url);
        //     //     this.get(my_url, (my_data) => {
        //     //         this.txtMessage.string = i18n.t("loading") + ' ....';
        //     //         self.parseConfig(my_data);
        //     //     });
        //     // }


        // });
        this.parseConfig(default_config);
    },

    get(url, callback) {
        var xhr = new XMLHttpRequest();
        var that = this;
        xhr.addEventListener('error', function () {
            cc.log("get api error****");
            Linker.showMessage(i18n.t("api_request_timeout"));
            var response = cc.sys.localStorage.getItem("tlmn_configHost");
            if (!response) {
                cc.log("ko co config");
                cc.sys.localStorage.setItem("tlmn_configHost", default_config);
                callback(JSON.parse(default_config));
            }
        });
        xhr.addEventListener('ontimeout', function () {
            cc.log("get api error****");
            Linker.showMessage(i18n.t("api_request_timeout"));
            var response = cc.sys.localStorage.getItem("tlmn_configHost");
            if (!response) {
                cc.log("ko co config");
                cc.sys.localStorage.setItem("tlmn_configHost", default_config);
                callback(JSON.parse(default_config));
            }
        });
        xhr.onreadystatechange = function () {
            cc.log("get api xhr.readyState:" + xhr.readyState + " xhr.status:" + xhr.status);
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                if (callback) {
                    callback(JSON.parse(response));
                    cc.sys.localStorage.setItem("tlmn_configHost", response);
                }
                callback(JSON.parse(default_config));
            } else if (xhr.readyState === 4) {
                // var data = cc.sys.localStorage.getItem("faco_configHost");
                // cc.log("get data storage:"+data);
                // if(data){
                //     callback(JSON.parse(data));
                // }else{
                callback(JSON.parse(default_config));
                //}
            }
        };
        xhr.addEventListener('loadend', function () {
            cc.log("loadendapi");
            var response = cc.sys.localStorage.getItem("tlmn_configHost");
            cc.log("response", response);
            if (!response) {
                cc.log("ko co config");
                cc.sys.localStorage.setItem("tlmn_configHost", default_config);
                callback(JSON.parse(default_config));
            } else {
                callback(JSON.parse(response));
            }
        })


        cc.log("get url:" + url);
        xhr.open("GET", url, true);
        xhr.send();


    },
    progressCallback: function (completedCount, totalCount = 1) {
        // this.progress = completedCount / totalCount;
        // //Linker.GameManager.loadingProgressBar
        // Linker.GameManager.loadingProgressBar.fillStart = 0;
        // var precent = isNaN(Math.round(this.progress * 100)) ? "..." : Math.round(this.progress * 100);
        // Linker.GameManager.loadingProgressBar.fillRange = precent;
        // this.txtMessage.string = i18n.t("title_loading", { percent: precent });
    },
    parseConfigSuccess: function () {
        var userData = Linker.Local.readUserData();
        userData.autoLogin = (userData.autoLogin) ? true : false;
        Linker.Local.saveUserData(userData);
        //tu day chung ta se load bunndle cong game hero.
        if (!Linker.isLoadLogin) {
            Linker.isLoadLogin = true;
            // this.betaGame();
            this.releaseGame();
            // cc.director.loadScene('Login', function () {
            // });
        }
    },
    betaGame: function () {
        cc.director.loadScene('Login', function () {
            Linker.GameManager.prepareGame((isCanLogin) => {
                if (isCanLogin) {
                    // var data = CommonSend.sendFastLogin();
                    // Linker.Socket.send(data);
                } else {
                    cc.Global.hideLoading();
                }
            })
        });
    },
    releaseGame: function () {
        // cc.director.loadScene("TrangChu", function () {
        //     NativeBridge.changeOrientationH(true);
        //     Linker.GameManager.prepareGame((isCanLogin) => {
        //         if (isCanLogin) {
        //             // var data = CommonSend.sendFastLogin();
        //             // Linker.Socket.send(data);
        //         } else {
        //             cc.Global.hideLoading();
        //         }
        //     })
        // });
    },
    preloadHallScene: function (start, step, lastProgress, labelpercent, spritepercent, cb) {
        var nameHeroesBallBundle = Constant.BUNDLE.TRANG_CHU.name;
        Utils.Malicious.getGameLoaderBundle(function (err, heroesBallBundle) {
            if (!err) {
                // var scenename = "HeroesBall";
                var scenename = "TrangChu";
                heroesBallBundle.preloadScene(scenename, function (completedCount, totalCount, item) {
                    // cc.director.preloadScene(scenename, function (completedCount, totalCount, item) {
                    if (labelpercent && spritepercent) {
                        var percent = (completedCount / totalCount) / start;
                        if (percent > 1.0) {
                            percent = 1.0;
                        }
                        var progressText = percent * 100;
                        if (percent > lastProgress) {
                            lastProgress = percent;
                            spritepercent.fillRange = percent;
                            progressText = (isNaN(Math.round(progressText)) ? "..." : Math.round(progressText));
                        } else {
                            spritepercent.fillRange = lastProgress;
                            progressText = (isNaN(Math.round(lastProgress * 100)) ? "..." : Math.round(lastProgress * 100));
                        }
                        labelpercent.string = i18n.t("title_loading", { percent: progressText });
                    }
                }.bind(this), function (err, scene) {
                    if (!err) {
                        if (cb) {
                            start -= 1;
                            var data = {
                                lastProgress: lastProgress,
                                start: start
                            }
                            cb(null, data);
                        }
                    } else {
                        cc.error(err);

                        if (cb) {
                            cb(true, null);
                        }
                    }
                    // this.onFinishPreloadScene(err, scene, gameLoaderBundle, scenename);
                }.bind(this));
            } else {
                cc.error(err);

            }
        }.bind(this), nameHeroesBallBundle);
    },
    parseConfig: function (data) {
        Global.configHost = data;
        Linker.Config = data;
        cc.Global.gameConfig = data;
        //* Test test
        // Linker.Config.APP_API = "http://api.vipgame.com:3200/";
        //* End test
        // var parentWidth = null;
        // var offsetX = null;
        // var _isLoadingBi = false;
        // var lastProgress = 0;
        // if (Linker.GameManager.loadingProgressBar && cc.isValid(Linker.GameManager.loadingProgressBar) && parentWidth) {
        //     offsetX = parentWidth - Linker.GameManager.loadingProgressBar.node.width;
        //     _isLoadingBi = true;
        // }
        // if (data.host != undefined) {
        //     cc.log("data.host:" + data.host);
        //     Linker.BASE_SOCKET = data.host ? data.host: "s1tlmn.chanthieny.com";
        //     Linker.BASE_PORT = data.port ? data.port : 9090;
        //     // Linker.BASE_SOCKET = "api.vipgame.com"; //test server
        //     //  Linker.BASE_SOCKET = "161.117.237.107";  //local server
        //     //Linker.BASE_SOCKET = "s1.sime.club";//
        //     // Linker.BASE_PORT = data.port;
        //     // Linker.BASE_SOCKET = "192.168.1.28";
        //      Linker.BASE_SOCKET = "s1tlmn.chanthieny.com";

        // }else{
        //     Linker.BASE_SOCKET = "s1tlmn.chanthieny.com";//
        //     // Linker.BASE_SOCKET = "s1.chanhay.com";
        //     Linker.BASE_PORT = 9090;
        // }
        // Utils.Malicious.getCoinFrame(Linker.MoneyTypeSpriteFrame, function (err, data) {
        //     if (!err) {
        //         Linker.MoneyTypeSpriteFrame = data;
        //         this.preloadScene(function (err, data) { })
        //     }
        // }.bind(this))

        // cc.log("Linker.BASE_SOCKET:" + Linker.BASE_SOCKET);


    },
    preloadScene: function (cb) {
        var lastProgress = 0.05;
        var _this = this;
        //ca login va heroes ball la 100%;
        var totalPreload = 2;//2 scene preload nhung chay 1 scene thoi
        var totalPercent = 100;
        var step = totalPercent / totalPreload;//50%
        var start = totalPreload;
        Linker.GameManager.loadingProgressBar.fillStart = 0;
        Linker.GameManager.loadingProgressBar.fillRange = lastProgress;
        this.preloadHallScene(start, step, lastProgress, Linker.GameManager.txtMessage, Linker.GameManager.loadingProgressBar, function (err, data) {
            if (!err) {
                lastProgress = data.lastProgress;
                start = data.start;
                var _lastProgress = lastProgress;
                // cc.director.preloadScene("TLMN",function(){},function(){});
                // console.log("preload trang chu")
                cc.director.preloadScene("TrangChu", function (completedCount, totalCount, item) {
                    var percent = _lastProgress + ((completedCount / totalCount) * 0.5);
                    if (percent > 1.0) {
                        percent = 1.0;
                    }
                    // di duoc 50% + percent
                    if (percent >= lastProgress) {
                        lastProgress = percent;
                        Linker.GameManager.loadingProgressBar.fillRange = percent;
                        var progressText = percent * 100;
                        progressText = (isNaN(Math.round(progressText)) ? "..." : Math.round(progressText));
                    } else {
                        Linker.GameManager.loadingProgressBar.fillRange = lastProgress;
                        progressText = (isNaN(Math.round(lastProgress * 100)) ? "..." : Math.round(lastProgress * 100));
                    }
                    Linker.GameManager.txtMessage.string = i18n.t("title_loading", { percent: progressText });
                }.bind(this), function (err, scene) {
                    if (!err) {
                        cc.Global.hideLoading();
                        this.parseConfigSuccess();
                    } else {
                        cc.log("Không thể load lại homescene lỗi xảy ra...");
                    }
                }.bind(this));               
            }
        }.bind(this));
    },
    prepareUpdate: function () {
        var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
        this._am = new jsb.AssetsManager(this.manifestUrl.nativeUrl, storagePath);

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(2);
        }

        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            // Resolve md5 url
            var url = this.manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this._am.loadLocalManifest(url);
        }

        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            cc.log('Failed to load local manifest ...');
        }

        this.hotUpdate();
    },

    hotUpdate: function () {
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this));

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                var url = this.manifestUrl.nativeUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this._am.loadLocalManifest(url);
            }

            this._failCount = 0;
            this._updating = true;
            this._am.update();
        }
    },
    updateCb: function (event) {
        var needRestart = false;
        var finish = false;

        cc.log("update callback: " + event.getEventCode());

        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("No local manifest file found, hot update skipped.");
                finish = true;
                break;

            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.progressCallback(event.getPercent());
                break;

            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("Fail to download manifest file, hot update skipped.");
                finish = true;
                break;

            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("Already up to date with the latest remote version.");
                finish = true;
                break;

            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log("Update finished. " + event.getMessage());
                finish = true;

                needRestart = true;
                break;

            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.log("Update failed. " + event.getMessage());
                this._failCount++;
                if (this._failCount < 5) this._am.downloadFailedAssets(); else {
                    cc.log("Reach maximum fail count, exit update process");
                    this._failCount = 0;
                    finish = true;
                }
                break;

            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
                break;

            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                cc.log(event.getMessage());
        }
        cc.log("finish:" + finish);
        if (finish) {
            this._am.setEventCallback(null);
            cc.log("needRestart:" + needRestart);
            var precent = 0.02;
            Linker.GameManager.loadingProgressBar.fillRange = precent;
            Linker.GameManager.txtMessage.string = i18n.t("done_check_version_update");
            if (needRestart) {
                var searchPaths = jsb.fileUtils.getSearchPaths();
                var newPaths = this._am.getLocalManifest().getSearchPaths();
                Array.prototype.unshift.apply(searchPaths, newPaths);
                cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(searchPaths));
                jsb.fileUtils.setSearchPaths(searchPaths);
                if (cc.sys.os == cc.sys.OS_IOS) {
                    this.completeCallback();
                }
                else {
                    cc.game.restart();
                    //this.completeCallback();

                    //cc.director.runScene(new GameScene());
                }

            }
            else {
                this.completeCallback();
            }
        }
    },//end add by zep

    googleAnalyticInit() {
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                sdkbox.PluginGoogleAnalytics.init();
                this.logEvent(PACKAGE_NAME);
            }
        }
    },
    logEvent(event) {
        if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) {
            if (typeof sdkbox !== "undefined") {
                sdkbox.PluginGoogleAnalytics.logScreen(event);
            }
        }
    },
    chartBoostInit() {
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                sdkbox.PluginChartboost.init();
            }
        }
    },
    showChartBoostFull() {
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                sdkbox.PluginChartboost.show("Default");
            }
        }
    },

    adMobInit: function () {
        if (cc.sys.isNative) {
            var self = this;
            if (typeof sdkbox !== "undefined") {
                sdkbox.PluginAdMob.init();
                sdkbox.PluginAdMob.setListener({
                    adViewDidReceiveAd: function (name) {
                        console.log('adViewDidReceiveAd:' + name);
                        var typeAds = 1;
                        if (typeAds == "showInterstitial") {
                            typeAds = 4;
                        } else if (typeAds == "video") {
                            typeAds = 2;
                        } else if (typeAds == "rewarded") {
                            typeAds = 2;
                        }

                        // AdsSend.send(typeAds, 1, 0, 0);


                    },
                    adViewDidFailToReceiveAdWithError: function (name, msg) {
                        console.log('adViewDidFailToReceiveAdWithError:' + name + ':' + msg);

                    },
                    adViewWillPresentScreen: function (name) {
                        console.log('adViewWillPresentScreen:' + name);
                    },
                    adViewDidDismissScreen: function (name) {
                        console.log('adViewDidDismissScreen:' + name);
                    },
                    adViewWillDismissScreen: function (name) {
                        console.log('adViewWillDismissScreen:' + name);
                    },
                    adViewWillLeaveApplication: function (name) {
                        console.log('adViewWillLeaveApplication:' + name);
                    },
                    reward: function (name, currency, amount) {
                        console.log('reward:' + name + ':' + currency + ':' + amount);
                        AdsSend.send(1, 2, currency, amount);
                    }
                });
            }
        }
    },

    cacheInterstitial: function () {
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                sdkbox.PluginAdMob.cache('interstitial');
            }
        }
    },

    showInterstitial: function () {
        console.log("showInterstitial");
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                if (sdkbox.PluginAdMob.isAvailable('interstitial')) {
                    sdkbox.PluginAdMob.show('interstitial');
                } else {
                    this.cacheInterstitial();
                }
            }
        }


    },
    cacheBanner: function () {
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                sdkbox.PluginAdMob.cache('home');
            }
        }
    },

    showBanner: function () {

        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                if (sdkbox.PluginAdMob.isAvailable('home')) {
                    sdkbox.PluginAdMob.show('home');
                }
                else {
                    this.cacheBanner();
                }
            }
        }

    },
    hideBanner: function () {
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                sdkbox.PluginAdMob.hide('home');
            }
        }
    },
    cacheRewarded: function () {
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                sdkbox.PluginAdMob.cache('rewarded');
            }
        }
    },
    showRewarded: function () {
        console.log("showRewarded");
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                cc.Global.showMessage("Đang tìm kiếm QC phù hợp...");
                if (sdkbox.PluginAdMob.isAvailable('rewarded')) {
                    sdkbox.PluginAdMob.show('rewarded');
                } else {
                    this.cacheRewarded();
                }
            }
        }
    },
    cacheAllAds: function () {
        this.cacheBanner();
        this.cacheInterstitial();
        this.cacheRewarded();
    },
    initOneSignal() {
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                sdkbox.PluginOneSignal.init();
                sdkbox.PluginOneSignal.setListener({
                    onSendTag: function (success, key, message) {
                        //cc.log("onSendTag success=%s, key=%s, message=%s", success ? "yes" : "no", key, message);
                    },
                    onGetTags: function (jsonString) {
                        //cc.log("onGetTags tags=%s", jsonString);
                    },
                    onIdsAvailable: function (userId, pushToken) {
                        //cc.log("onIdsAvailable userId=%s, pushToken=%s", userId, pushToken);
                        self.userId = userId;
                        self.item2.setString(userId);
                    },
                    onPostNotification: function (success, message) {
                        //cc.log("onPostNotification success=%s, message=%s", success ? "yes" : "no", message);
                    },
                    onNotification: function (isActive, message, additionalData) {
                        //cc.log("onNotification isActive=%s, message=%s, additionalData=%s", isActive ? "yes" : "no", message, additionalData);
                    }
                });

                sdkbox.PluginOneSignal.setSubscription(true);
                sdkbox.PluginOneSignal.sendTag("packageName", PACKAGE_NAME);
                sdkbox.PluginOneSignal.enableInAppAlertNotification(true);
                sdkbox.PluginOneSignal.promptLocation();
            }
        }
    },
    initIAP() {
        var self = this;
        if (cc.sys.isMobile) {
            if (typeof sdkbox !== "undefined") {
                sdkbox.IAP.init();
                sdkbox.IAP.setDebug(true);
                sdkbox.IAP.setListener({
                    onSuccess: function (product) {
                        //Purchase success
                        self.iapListener(product.name);
                        Linker.Event.dispatchEvent("cashIap", {
                            receipt: product.name
                        });
                    },
                    onFailure: function (product, msg) {
                        //Purchase failed
                        //msg is the error message
                    },
                    onCanceled: function (product) {
                        //Purchase was canceled by user
                    },
                    onRestored: function (product) {
                        //Purchase restored
                        self.iapListener(product.name);
                    },
                    onRestoreComplete(ok, msg) {

                    },
                    onProductRequestSuccess: function (products) {
                        //Returns you the data for all the iap products
                        //You can get each item using following method
                        for (var i = 0; i < products.length; i++) {
                            // loop
                        }
                    },
                    onProductRequestFailure: function (msg) {
                        //When product refresh request fails.
                    }
                });
            }
        }
    },
    iap1() {
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                if (sdkbox.IAP) {
                    sdkbox.IAP.purchase("iap1");
                }
            }
        }


    },
    iap2() {
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                if (sdkbox.IAP) {
                    sdkbox.IAP.purchase("iap2");
                }
            }
        }

    },
    iap3() {
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                if (sdkbox.IAP) {
                    sdkbox.IAP.purchase("iap3");
                }
            }
        }
    },
    iapAll(id) {
        if (cc.sys.isNative) {
            if (typeof sdkbox !== "undefined") {
                if (sdkbox.IAP) {
                    sdkbox.IAP.purchase("iap"+id);
                }
            }
        }
    },
    iapListener(name) {
        switch (name) {

            case "iap1": {
                if (Linker.userData) {
                    Linker.userData.userMoney += 16000;
                    Linker.HallView.updateUserMoney();
                }
                break;
            }
            case "iap2": {
                if (Linker.userData) {
                    Linker.userData.userMoney += 20000;
                    Linker.HallView.updateUserMoney();
                }
                break;
            }
            case "iap3": {
                if (Linker.userData) {
                    Linker.userData.userMoney += 31000;
                    Linker.HallView.updateUserMoney();
                }
                break;
            }
        }
    },
    initFacebook() {
        if (typeof sdkbox === "undefined") {
            //cc.log("sdkbox undefined");
            return true;
        }


    },
    loginFb() {
        if (typeof sdkbox !== "undefined") {
            //sdkbox.PluginFacebook.requestReadPermissions(["public_profile"]);
            cc.log("vao dayloginFb:" + sdkbox.PluginFacebook.isLoggedIn());
            if (sdkbox.PluginFacebook.isLoggedIn()) {
                var token = sdkbox.PluginFacebook.getAccessToken();
                var userId = sdkbox.PluginFacebook.getUserID();
                cc.Global.loginType = LoginType.FB;
                Linker.Event.dispatchEvent("token", {
                    token: token,
                    userId: userId
                });
            } else {
                sdkbox.PluginFacebook.login();
            }
        }
    },
    logoutFb() {
        if (typeof sdkbox !== "undefined") {
            sdkbox.PluginFacebook.logout();
        }
        Linker.isFb = false;


    }
});
