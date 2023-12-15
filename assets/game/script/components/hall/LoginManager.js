var Linker = require('Linker');
var LoginCache = require('LoginCache');
var NodePoolManager = require('NodePoolManager');
var GameConstant = require('GameConstant');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,
    properties: {
        HallNode: cc.Node,
        LoginNode: cc.Node,
        SignUpNode: cc.Node,
        LoadingLayer: cc.Node,
        kLoadingDialog: cc.Prefab,

    },
    onLoad: function () {
        this.kLoading = cc.instantiate(this.kLoadingDialog);
        this.LoadingLayer.addChild(this.kLoading);
        this.LoadingLayer.active = false;
        this.showLayer();
    },
    showLayer: function () {
        if (!Linker.isLogin) {
            this.inputUserInfoLoginForm();
            this.showLoginNode();
            this.hideHallNode();
            this.hideMiniGame();
            this.hideTopHu();

        } else {
            // this.inputUserInfoLoginForm();
            this.showHallNode();
            this.hideLoginNode();
            this.showMiniGame();
            this.showTopHu();
        }
    },
    inputUserInfoLoginForm: function () {
        var cache = LoginCache.get();
        if (Utils.Malicious.getLengthObj(cache) < 2) {
            cache.username = "";
            cache.password = "";
        }
        Linker.LoginController.usernameEditBox.string = cache.username;
        Linker.LoginController.passwordEditBox.string = cache.password;
        if (cache.username.length > 0 && cache.password.length > 0) {
            if (!Linker.isOtherLogin && !Linker.logoutSocket) {
                Linker.LoginController.cacheLogin = true;
            }
        }
    },
    showMiniGame: function () {
        if (Linker.MiniGame) {
            var size = cc.winSize;
            var m = cc.find("Canvas/MiniGame");
            var range = {
                x: [size.width * 0.1, size.width * 0.9],
                y: [size.height * 0.1, size.height * 0.9]
            };
            var posx = this.getRandomPosition(range.x[0], range.x[1]);
            var posy = this.getRandomPosition(range.y[0], range.y[1]);
            if (m) {
                m.position = cc.v2(posx, posy);
                m.active = true;
            }

        }
    },
    hideMiniGame: function () {
        var size = cc.winSize;
        if (Linker.MiniGame) {
            var m = cc.find("Canvas/MiniGame");
            if (m) {
                m.position = cc.v2(size.width * 2, size.height * 2);
                m.active = false;
            }
        } else {
            var miniGame = cc.find("Canvas/MiniGame");
            if (miniGame) {
                miniGame.removeFromParent(true);
            }
        }
    },
    getRandomPosition: function (min, max) {
        return Math.random() * (max - min + 1) + min;
    },
    showTopHu: function () {
        if (Linker.TopHuController) {
            var t = Linker.TopHuController;
            var n = t.node;
            var size = cc.winSize;
            var pos = (Linker.tophuPosition) ? Linker.tophuPosition : GameConstant.NODE_POSITION_DEFAULT.TOPHU_DEFAULT_POS;
            if (n) {
                n.position = pos;
            } else {
                if (Linker.TopHuController && Linker.TopHuController.node) {
                    Linker.TopHuController.node.position = pos;
                }
            }

        }
    },
    hideTopHu: function () {
        if (Linker.TopHuController) {
            var t = Linker.TopHuController;
            var n = t.node;
            var size = cc.winSize;
            if (n) {
                n.position = cc.v2(size.width * 2, size.height * 2);
            } else {
                if (Linker.TopHuController && Linker.TopHuController.node) {
                    Linker.TopHuController.node.position = cc.v2(size.width * 2, size.height * 2);
                }
            }
        } else {
            //
            var topHu = cc.find("Canvas/TopHu");
            if (topHu) {
                topHu.removeFromParent(true);
            }
        }
    },
    showHallNode: function () {
        this.HallNode.active = true;
        //nếu là hall scene trường hợp đăng nhập rồi thì chỉ hiện mỗi hall
        this.hideAllExceptHallNode();
    },
    hideHallNode: function () {
        this.HallNode.active = false;
    },
    showLoginNode: function () {
        this.LoginNode.active = true;
        this.SignUpNode.active = false;
        //nếu là log in thì những node sau sẽ được mở và những node khác sẽ bị đóng lại
        this.hideAllExceptLoginNode();
    },
    hideAllExceptHallNode: function () {
        var exceptNameNodes = ["Login"];
        var cvas = cc.find("Canvas");
        for (var i = 0; i < cvas.children.length; i++) {
            var nameChild = cvas.children[i].name;
            if (exceptNameNodes.indexOf(nameChild) != -1) {
                //đã tìm thấy node, tuy nhiên phải ẩn nó đi không cần biết là nó on hay off
                cvas.children[i].active = false;
            }
            //những trường hợp khác để ở trạng thái có sẵn của nó.
        }
    },
    hideAllExceptLoginNode: function () {
        var exceptNameNodes = ["bg", "Main Camera", "Login", "SharedLoginHall", "GlobalNode", "LoginManager", "Loading"];
        var cvas = cc.find("Canvas");
        for (var i = 0; i < cvas.children.length; i++) {
            var nameChild = cvas.children[i].name;
            if (exceptNameNodes.indexOf(nameChild) != -1) {
                //chỉ hiển thị mỗi login node mà thôi
                cvas.children[i].active = true;
            } else {
                //những trường hợp khác ẩn hết
                cvas.children[i].active = false;
            }
        }
    },
    hideLoginNode: function () {
        this.LoginNode.active = false;
    },
    showLoadingLayer: function () {
        this.LoadingLayer.active = true;
    },
    hideLoadingLayer: function () {
        this.LoadingLayer.active = false;
    },
    setStringLoadingLayer: function (str) {
        this.kLoading.getComponent("kLoadingDialog").show(str);
    }
    // start () {

    // }

    // update (dt) {},
});
