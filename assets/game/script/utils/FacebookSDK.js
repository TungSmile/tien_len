const app_id = '482344175661575';
const app_secret = '5afee7b592a154b159a4b45a4d9bc36f';
const app_secret_ak = '5afee7b592a154b159a4b45a4d9bc36f';
const me_endpoint_base_url = 'https://graph.accountkit.com/v1.1/me';
const token_exchange_base_url = 'https://graph.accountkit.com/v1.1/access_token';
var CommonSend = require('CommonSend');
var Linker = require('Linker');
var i18n = require('i18n');
var FacebookSDK = cc.Class({
    __ctor__: function(AppId, Scope, Callback) {
        //        window.fbAsyncInit = () => {
        //     FB.init({
        //         appId: app_id,
        //         cookie: true,  // enable cookies to allow the server to access the session
        //         xfbml: true,  // parse social plugins on this page
        //         version: 'v3.1'
        //     });
        // };

        // window.AccountKit_OnInteractive = () => {
        //     AccountKit.init({
        //         appId: app_id,
        //         state: app_secret_ak,
        //         version: 'v1.1',
        //         fbAppEventsEnabled: true
        //     });
        // };

        // (function (d, s, id) {
        //     var js, fjs = d.getElementsByTagName(s)[0];
        //     if (d.getElementById(id)) return;
        //     js = d.createElement(s);
        //     js.id = id;
        //     js.src = "//connect.facebook.net/vi_VN/sdk.js";
        //     fjs.parentNode.insertBefore(js, fjs);
        // }(document, 'script', 'facebook-jssdk'));

        // (function (d, s, id) {
        //     var js, fjs = d.getElementsByTagName(s)[0];
        //     if (d.getElementById(id)) return;
        //     js = d.createElement(s);
        //     js.id = id;
        //     js.src = "//sdk.accountkit.com/en_US/sdk.js";
        //     fjs.parentNode.insertBefore(js, fjs);
        // }(document, 'script', 'accountkit-jssdk'));
        
    },
    onPhoneNumber(phone){
        cc.log("vao phone roi"+phone);
        if (phone.length > 0) {
          
            var test1 = CommonSend.updatePhone(phone);
            cc.log(test1);
            Linker.Socket.send(test1);
            cc.Global.showLoading();
        }else{
            Linker.showMessage(i18n.t("Phone number cannot be verified"));
        }
        
    },
    smsLogin() {
        this.addSocketEvent();
        // cc.log("tesst vao day");
        // var scene = cc.find("Canvas/Profile");
        // cc.log(scene);
        // this.onPhoneNumber("+84982854358");

        AccountKit.login('PHONE', {}, this.loginCallback.bind(this));
    },
    
    addSocketEvent() {
        Linker.Event.addEventListener(12014, this.onUpdatePhone, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(12014, this.onUpdatePhone, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onUpdatePhone(message) {
        cc.log("onupdatePHone",message);
        if (message.status == 1) {
           // Linker.userData.displayName = this.textDisplayName;
           Linker.showMessageOption(message,{ duration:6 });
            // if (Linker.UserTab) {
            //     Linker.UserTab.textDisplayName.string = Linker.userData.displayName;
            // }
            // if (Linker.HallView) {
            //     Linker.HallView.updateDisplayName();
            //     this.node.active = false;
            // };
        } else {
            Linker.showMessageOption(message,{ duration:6 });
        }
        cc.Global.hideLoading();
    },
    loginCallback(response) {
        console.log(response);
        var self = this;
        if (response.status === "PARTIALLY_AUTHENTICATED") {
            var code = response.code;
            var csrf = response.state;

            self.onGetInfoAccountKit(code);
        }
        else if (response.status === "NOT_AUTHENTICATED") {
            // handle authentication failure
        }
        else if (response.status === "BAD_PARAMS") {
            // handle bad parameters
        }
    },

    onGetInfoAccountKit(code) {
        cc.log('onGetInfo:',code);
        var self = this;
        var app_access_token = ['AA', app_id, app_secret_ak].join('|');
        var token_exchange_url = token_exchange_base_url +
            '?grant_type=authorization_code' +
            '&code=' + code +
            '&access_token=' + app_access_token;

        var xhr = cc.loader.getXMLHttpRequest();
        cc.log('xhr:',xhr);
        xhr.open("GET", token_exchange_url, true);
        //:__: Worked for native
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                console.log(xhr.responseText);
                var json = JSON.parse(xhr.responseText);
                self.onGetPhoneAccountKit(json.access_token);
            }
        };
        xhr.send();            
        
    },

    onGetPhoneAccountKit(user_access_token) {
        var me_endpoint_url = me_endpoint_base_url +
            '?access_token=' + user_access_token;

        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", me_endpoint_url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                console.log(xhr.responseText);
                var json = JSON.parse(xhr.responseText);

                // var scene = cc.director.getScene().getComponentInChildren("BaseScene");
                // scene.onPhoneNumber(json.phone.number);
                var scene = cc.find("Canvas/Profile");
                // scene.onPhoneNumber(json.phone.number);
                //:__: Using this instead of normal updating with UserTab
                if (json.phone.number.length > 0) {
          
                    var test1 = CommonSend.updatePhone(json.phone.number);
                    cc.log(test1);
                    Linker.Socket.send(test1);
                    cc.Global.hideLoading();
                }else{
                    Linker.showMessage(i18n.t("Phone number cannot be verified"));
                }
            }
        };
        xhr.send();
    },
});

module.exports = new FacebookSDK();