var Linker = require('Linker');
var Global = require("Global");
var bundleUtil = {
   
    bundleRemote: function (bundleName,cb) {
        console.log("bundleBida");
        var that = this;
        //cc.Global.showLoading();
        console.log("bundleRemote ");
        // cc.assetManager.loadBundle('http://tai.chanvuong.net/remote/'+bundleName, function (err, bundle) {
        cc.assetManager.loadBundle('http://192.168.2.247/remote/'+bundleName, function (err, bundle) {
            //cc.Global.hideLoading();
            if (err) {
                return cc.error("aaa" + err);
            }
            console.log('load bundle successfully.');
            
            if (cb) {
                cb(bundle);
            }
            if(bundleName == "bundleResources"){
                cc.bundleResources = bundle;
            };
        });

    },
    bundleBidaStart: function () {
        // Linker.MySdkFirst.txtMessage.string = "Đang vào bida vui lòng chờ ít phút ...";
        var that = this;
        if (cc.sys.isBrowser) {
            console.log("cc.bundleBida");
            if (this.getBundleBida("bundleResources")) {
               
                    this.biDaSplash();
               
            } else {
                console.log("start loadinBundle");
               
                // cc.Global.showLoading();
                cc.assetManager.loadBundle('bundleResources', (err, bundle) => {
                    cc.log("bundleResources succesfuly",bundle);
                    // Linker.MySdkFirst.txtMessage.active = false;
                    // cc.Global.hideLoading();
                    that.biDaSplash();


                });
                
            }
        } else {
            if (this.getBundleBida("bundleResources")) {
                console.log("co bundleResources roi");
                this.biDaSplash();
                // Linker.MySdkFirst.txtMessage.active = false;
            } else {
                console.log("chua co bundleResources");
                this.bundleRemote("bundleResources",(bundle) => {
                        console.log(bundle);
                        that.biDaSplash();
                });
            }
        }
        
    },
    biDaSplash: function () {
        var bundleResources = this.getBundleBida("bundleResources");
        cc.log("bundleResources",bundleResources);
        // Linker.MySdkFirst.txtMessage.active = false;
        cc.audioEngine.stopAll();
        if (bundleResources) {
           
            bundleResources.loadScene('BiDaSplash', function (err, scene) {
                console.log("loading BiDaSplash",scene);
                cc.director.runScene(scene);
                
            });
        } else {
            console.log("loi ri khong co bundle");
        }
    },
    getBundleBida: function (name) {
        return cc.assetManager.getBundle(name);

    }

};


module.exports = bundleUtil;