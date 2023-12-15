var Global = require("Global");
var FacebookSDK = require("FacebookSDK");
var Linker = require("Linker");
window.onPhoneNumber = function (phone) {
    console.log("onPhoneNumber");
    // var scene = cc.director.getScene().getComponentInChildren("BaseScene");
    // scene.onPhoneNumber(phone);
    //cc.log("vao phone roi window.onPhoneNumber: "+phone);
    FacebookSDK.onPhoneNumber(phone);

};
window.onDestroyNative = function (phone) {
    console.log("onDestroyNative");
    // var scene = cc.director.getScene().getComponentInChildren("BaseScene");
    // scene.onPhoneNumber(phone);
    //cc.log("vao phone roi window.onPhoneNumber: "+phone);
    if (Linker && Linker.Socket) {
        console.log("vao dong socket");
        Linker.Socket.close();
    } else {
        console.log("Khong co linker");
    }

};
var NativeBridge = {

    androidActivity: "org/cocos2dx/javascript/AppActivity",

    getDeviceIDNative: function () {
        console.log("getDeviceIDNative");
        var deviceID;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            deviceID = jsb.reflection.callStaticMethod(this.androidActivity, "getDeviceID", "()Ljava/lang/String;");
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            deviceID = jsb.reflection.callStaticMethod("AppController", "getDeviceID");
        }
        console.log("getDeviceIDNative:", deviceID);
        return deviceID;
    },

    getVersionNative: function () {
        var version;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            version = jsb.reflection.callStaticMethod(this.androidActivity, "getVersionName", "()Ljava/lang/String;");
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            version = jsb.reflection.callStaticMethod("AppController", "getVersionName");
        }

        return version;
    },

    smsLogin: function () {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidActivity, "phoneLogin", "()V");
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AppController", "phoneLogin");
        }
    },

    openURL: function (url) {
        if (cc.sys.isBrowser) {
            cc.sys.openURL(url);
        }
        else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidActivity, "openNativeUrl", "(Ljava/lang/String;)V", url);
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AppController", "openNativeUrl:", "http://www.facebook.com/");
        }
    },
    changeOrientationH: function (isH) {
        // cc.warn("js changeOrientationH: " + isH);
        // let w = cc.view.getFrameSize().width;
        // let h = cc.view.getFrameSize().height;

        // if (cc.sys.isNative) {
        //     cc.view.setFrameSize(h, w);
        //     if (cc.sys.os == cc.sys.OS_ANDROID) {
        //         console.log("ios::");
        //         jsb.reflection.callStaticMethod(this.androidActivity, "changeOrientationH", "(Z)V", isH);
        //     } else if (cc.sys.os == cc.sys.OS_IOS) {
        //         console.log("ios:");
        //         jsb.reflection.callStaticMethod('AppController', "changeOrientationH", isH);
        //     }
        // } else {
        //     cc.view.setFrameSize(h, w);
        // }


    }
};

module.exports = NativeBridge;