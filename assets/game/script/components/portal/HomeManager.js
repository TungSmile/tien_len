var Linker = require('Linker');
var Utils = require('Utils');
var LoginCache = require('LoginCache');
const DataAccess = require('../../network/base/DataAccess');
var CommonSend = require('CommonSend');
cc.Class({
    extends: cc.Component,

    properties: {
        LoginNode: cc.Node,
    },

    onLoad () {
        Linker.HomeManager = this;
       
        this.LoginNode.zIndex = 999;
        Linker.HomeManager.HomePortal = cc.find("Canvas/HomePortal");
        Linker.HomeManager.TLMNPortal = cc.find("Canvas/TLMNPortal");
        Linker.HomeManager.Login = cc.find("Canvas/Login");
        Linker.HomeManager.GamePlay = cc.find("Canvas/TLMNPortal/TLMNPortalView/TLMNGame");
        this.showLayer();
    },

    start () {

    },
    activeLobby(){
        console.log("activeLobby----");
        Linker.HomeManager.Login.active = false;
        Linker.HomeManager.HomePortal.active = false;
        Linker.HomeManager.TLMNPortal.active = true;
        
    },
    activeHome(){
        Linker.HomeManager.Login.active = false;
        Linker.HomeManager.HomePortal.active = true;
        Linker.HomeManager.TLMNPortal.active = false;
    },
    activeLogin(){
        
        Linker.HomeManager.Login.active = true;
        Linker.HomeManager.HomePortal.active = false;
        Linker.HomeManager.TLMNPortal.active = false;
    },
    hideGamePlay(){
        console.log("hideGamePlay----");
        if(Linker.HomeManager.GamePlay){
            Linker.HomeManager.GamePlay.active = false;
        }
    },
   
    showLayer: function () {
        console.log("Linker.isLogin"+Linker.isLogin);
        if (!Linker.isLogin) {
            // Linker.GameManager.autoLoginByWhenPlayGameChan();
            
            // this.showLoginNode();
            // var data = CommonSend.sendFastLogin();
            // console.log("data"+data);
            // Linker.Socket.send(data);
            Linker.HomeManager.activeLogin();
        } else {
            // this.hideLoginNode();
            Linker.HomeManager.activeHome();
        }
        this.checkButtonHome();
    },

    showLoginNode: function () {
        this.LoginNode.active = true;
        this.hideAllExceptNode();
    },

    hideLoginNode: function () {
        this.LoginNode.active = false;
    },

    checkButtonHome: function () {
        DataAccess.Instance.updateData();
        // var headerFooterNode = this.HomeTopBottomNode.getChildByName("HeaderFooterHomeLobby");
        // if (headerFooterNode) {
        //     var headerFooterJs = headerFooterNode.getComponent("HeaderFooterHomeLobby");
        //     if (headerFooterJs && headerFooterJs.isValid) {
        //         headerFooterJs.checkButtonHome();
        //     }
        // }
    },

    hideAllExceptNode: function () {
        // // hide game
        // var exceptNameNodes = ["Login","HomePortal","Bg","Main Camera","Game Camera"];
        // var childs = cc.find("Canvas").children;
        // for (var i = 0; i < childs.length; i++) {
        //     var nameChild = childs[i].name;
        //     if (exceptNameNodes.indexOf(nameChild) == -1) {
        //         childs[i].active = false;
        //     }
        // }

        // //hide dialog
        // var dialogs = this.HomeDialogNode.children;
        // if (dialogs) {
        //     for (var i = 0; i < dialogs.length; i++) {
        //         dialogs[i].active = false;
        //     }
        // }
    },

    checkShowDialog: function () {
        // var viewJs = this.HomeViewNode.getComponent("PortalHeroView");
        // if (viewJs && viewJs.isValid) {
        //     viewJs.checkShowDialog();
        // }
    },

    isActiveLogin: function () {
        var currScene = cc.director.getScene().name;
        if (this && this.isValid && this.LoginNode && this.LoginNode.active && currScene == "TrangChu") {
            return true;
        }
        return false;
    }

    // update (dt) {},
});
