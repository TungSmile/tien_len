var Utils = require('Utils');
var Linker = require('Linker');
var Global = require('Global');
var SocketConstant = require('SocketConstant');
var SceneManager = require('SceneManager');
var LoginCache = require('LoginCache');
var CommonSend = require('CommonSend');
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
    
        

     },

    start() {
        
        this.addSocketEvent();
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    addSocketEvent() {
        // Linker.Event.addEventListener(SocketConstant.COMMON.LOGIN, this.onLogin, this);
        // Linker.Event.addEventListener(SocketConstant.COMMON.LOGIN_FB, this.onLoginFb, this);
       
    },
    removeSocketEvent() {
      
        // Linker.Event.removeEventListener(SocketConstant.COMMON.LOGIN, this.onLogin, this);
        // Linker.Event.removeEventListener(SocketConstant.COMMON.LOGIN_FB, this.onLoginFb, this);
       
    },
    onLogin(message) {//dung cho login tu chan back ra
        cc.log('Catched message:',message);
        cc.log('kCurrScene:',cc.Global.kCurrScene);
        cc.log('kPrevScene:',cc.Global.kPrevScene);
        // if ((message && message.messageId == SocketConstant.COMMON.LOGIN && message.status == 1)) {
        //     cc.log("LOGIN_OK", message);
        //     Linker.isLogin = true;
        //     Linker.isFb = false;
        //     Linker.userData = message;
        //     Linker.isOtherLogin = false;
        //     if(cc.Global.kPrevScene=="Phom"){
        //         //SceneManager.loadScene('Phom');
        //         Linker.ZONE = 4;
        //         SceneManager.preloadScene('Phom');
                
        //     }else if(cc.Global.kPrevScene=="SamScene"){
        //         Linker.ZONE = 37;
        //         //SceneManager.loadScene('SamScene');
        //         SceneManager.preloadScene('Phom');
        //     }else if(cc.Global.kPrevScene=="TLMN"){
        //         //SceneManager.loadScene('TLMN');
        //         Linker.ZONE = 5;
        //         SceneManager.preloadScene('Phom');
        //     }else {
        //         cc.find("Loading").active = true;
        //         SceneManager.preloadScene('HallScene');
               
        //     }
        // } else {
        //     //SceneManager.loadScene('LoginScene');
          
        // }
    },
    onLoginFb(message){
        cc.log("onLoginFb");
        cc.log('kCurrScene:',cc.Global.kCurrScene);
        cc.log('kPrevScene:',cc.Global.kPrevScene);
        Linker.isLogin = true;
        Linker.isFb = true;
        Linker.userData = message;
        // if(cc.Global.kPrevScene=="Phom"){
        //     Linker.ZONE = 4;
        //     //SceneManager.loadScene('Phom');
        //     SceneManager.preloadScene('Phom');
        // }else if(cc.Global.kPrevScene=="SamScene"){
        //     Linker.ZONE = 37;
        //     SceneManager.preloadScene('SamScene');
        // }else if(cc.Global.kPrevScene=="TLMN"){
        //     Linker.ZONE = 5;
        //     SceneManager.preloadScene('TLMN');
        // }else {
        //     cc.find("Loading").active = true;
        //     SceneManager.preloadScene('HallScene');
           
        // }
    },
    reconnectBtnClick() {
        // cc.log('kCurrScene:',cc.Global.kCurrScene);
        // cc.log('kPrevScene:',cc.Global.kPrevScene);
        cc.log("autoLoginByWhenPlayGameChan Linker.userData:",Linker.userData);
        Linker.reconnetByInPlayGameCard = cc.Global.kCurrScene;
        Linker.Socket.close();
        if(Linker.isFb && Linker.TOKEN){//dung cho login fb
            Linker.GameManager.prepareGame((isCanLogin) => {
                    var login = CommonSend.loginFb("fb_" + Linker.TOKEN.userId, 1, cc.Global.getDeviceName(), Linker.TOKEN.token, Global.deviceID);
                    Linker.Socket.send(login);
               

            });
        }else{
            Linker.GameManager.prepareGame((isCanLogin) => {
                var cache = LoginCache.get();
                if (Utils.Malicious.getLengthObj(cache) < 2) {
                    cache.username = "";
                    cache.password = "";
                }
                if (cache.username.length > 0 && cache.password.length > 0) {
                    var message = CommonSend.login(cache.username, cache.password, "2", cc.Global.getDeviceName(), Global.deviceID);
                    Linker.Socket.send(message);
                }
            });
        }
    },
    toLoginBtnClick() {
        SceneManager.loadScene('LoginScene');
    }
    // update (dt) {},
});
