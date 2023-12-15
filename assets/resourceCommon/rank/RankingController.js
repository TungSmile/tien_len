var SdkBoxUtil = require('SdkBoxUtil');
var Linker = require("Linker");
var FacebookSDK = require('FacebookSDK');


cc.Class({
    extends: cc.Component,

    properties: {


        txtReward: cc.Node,

        btnLoginFB: cc.Node,
        
        lblName: cc.Label,
    },

    onEnable() {
        Linker.ranking.Component = this;

        let checkFirstLogin = JSON.parse(cc.sys.localStorage.getItem('isFirstTimeLogin'));

        if(!checkFirstLogin) {
            checkFirstLogin = false;
            cc.sys.localStorage.setItem('isFirstTimeLogin',JSON.stringify(checkFirstLogin));

        }
        if (checkFirstLogin== false) {
            this.txtReward.active =true;
        }else if (checkFirstLogin===true){
            this.txtReward.active=false;
        }
        this.processUserInfo();
    },
    processUserInfo() {
        let userInfo = JSON.parse(cc.sys.localStorage.getItem('userInfo'));
        if (userInfo) {
            if (userInfo.userId) {
                this.btnLoginFB.active = false;
                this.lblName.node.active = true;
                this.lblName.string = userInfo.userId;
            }
        } else {
            this.btnLoginFB.active = true;
        }
    },
    onClickBtnSignFB() {
        SdkBoxUtil.loginFb();
    },
    onClickBtnSignGoogle() {
        SdkBoxUtil.googleLogin();
    },
    onClickShareFB(){
        SdkBoxUtil.btnShareFB();
    },
    onCloseClick: function () {
        this.node.active = !this.node.active;
    },
    btnShowRank(){
        SdkBoxUtil.showLeaderboard();
    }
})