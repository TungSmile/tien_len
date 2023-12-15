var soccerConstant = require('soccerConstant');
var Linker = require('Linker');
var Utils = require('Utils');
var Constant = require('Constant');
var HeadBallConstant = require("HeadBallConstant");
var FootBallConstant = require("FootBallConstant");
var BiDaConstant = require('BiDaConstant');
cc.Class({
    extends: cc.Component,

    properties: {
        listGameBtnContentNode: cc.Node,
        listTabGameToggle: [cc.Toggle],

        listGameSportPrefab: cc.Prefab,
        listGameBaiPrefab: cc.Prefab,
        listGameSlotPrefab: cc.Prefab,
        listMiniGamePrefab: cc.Prefab,

        listAllGamePrefab: cc.Prefab,
        scrollViewNode: cc.Node

    },
    initListGame: function () {
        this.initListGameTheThao();
        this.initListGameBai();
        this.initListGameSlot();
        this.initListMiniGame();
        this.initListAllGame();
        //kich hoat tab nao truoc tien??
        this.activeTabGame(this.listTabGameToggle[0]);

    },
    activeTabGame: function (toggle) {
        if (toggle) {
            if (toggle.isChecked == true) {
                this.onTabGameToggle(toggle);
            } else {
                toggle.check();
            }
        }
    },
    onActiveTabGameTheThao: function () {
        if (!this.listGameTheThaoTab || (this.listGameTheThaoTab && !cc.isValid(this.listGameTheThaoTab))) {
            this.listGameTheThaoTab = cc.instantiate(this.listGameSportPrefab);
            var listGameTheThaoScript = this.listGameTheThaoTab.getComponent("ListGamelView");
            if (listGameTheThaoScript) {
                listGameTheThaoScript.initListButtonGame();
                this.listGameBtnContentNode.addChild(this.listGameTheThaoTab);
                this.setToggleDialog(this.listGameTheThaoTab);
            }

        }
        var toggle = this.listGameTheThaoTab.getComponent(cc.Toggle);
        if (toggle) {
            this.offLayerWithout(toggle);
        }
    },
    onActiveTabGameBai: function () {
        if (!this.listGameBaiTab || (this.listGameBaiTab && !cc.isValid(this.listGameBaiTab))) {
            this.listGameBaiTab = cc.instantiate(this.listGameBaiPrefab);
            var listGameBaiScript = this.listGameBaiTab.getComponent("ListGamelView");
            if (listGameBaiScript) {
                listGameBaiScript.initListButtonGame();
                this.listGameBtnContentNode.addChild(this.listGameBaiTab);
                this.setToggleDialog(this.listGameBaiTab);
            }
        }
        var toggle = this.listGameBaiTab.getComponent(cc.Toggle);
        if (toggle) {
            this.offLayerWithout(toggle);

        }
    },
    onActiveTabGameSlot: function () {
        if (!this.listGameSlotTab || (this.listGameSlotTab && !cc.isValid(this.listGameSlotTab))) {
            this.listGameSlotTab = cc.instantiate(this.listGameSlotPrefab);
            var listGameSlotScript = this.listGameSlotTab.getComponent("ListGamelView");
            if (listGameSlotScript) {
                listGameSlotScript.initListButtonGame();
                this.listGameBtnContentNode.addChild(this.listGameSlotTab);
                this.setToggleDialog(this.listGameSlotTab);
            }
        }
        var toggle = this.listGameSlotTab.getComponent(cc.Toggle);
        if (toggle) {
            this.offLayerWithout(toggle);
        }
    },
    onActiveTabMiniGame: function () {
        if (!this.listMiniGameTab || (this.listMiniGameTab && !cc.isValid(this.listMiniGameTab))) {
            this.listMiniGameTab = cc.instantiate(this.listMiniGamePrefab);
            var listMiniGameScript = this.listMiniGameTab.getComponent("ListGamelView");
            if (listMiniGameScript) {
                listMiniGameScript.initListButtonGame();
                this.listGameBtnContentNode.addChild(this.listMiniGameTab);
                this.setToggleDialog(this.listMiniGameTab);
            }
        }
        var toggle = this.listMiniGameTab.getComponent(cc.Toggle);
        if (toggle) {
            this.offLayerWithout(toggle);

        }
    },
    onActiveTabAllGame: function () {
        if (!this.listMiniGameTab || (this.listMiniGameTab && !cc.isValid(this.listMiniGameTab))) {
            this.listAllGameTab = cc.instantiate(this.listAllGamePrefab);
            var listAllGameScript = this.listAllGameTab.getComponent("ListGamelView");
            if (listAllGameScript) {
                listAllGameScript.initListButtonGame();
                this.listGameBtnContentNode.addChild(this.listAllGameTab);
                this.setToggleDialog(this.listAllGameTab);
            }
        }
        var toggle = this.listAllGameTab.getComponent(cc.Toggle);
        if (toggle) {
            this.offLayerWithout(toggle);

        }
    },
    initListGameTheThao: function () {
        cc.log("Khoi tao list game the thao");
        this.listGameTheThaoTab = cc.instantiate(this.listGameSportPrefab);
        var listGameTheThaoScript = this.listGameTheThaoTab.getComponent("ListGamelView");
        if (listGameTheThaoScript) {
            listGameTheThaoScript.initListButtonGame();
            this.listGameBtnContentNode.addChild(this.listGameTheThaoTab);
            this.setToggleDialog(this.listGameTheThaoTab);
        }
    },
    initListGameBai: function () {
        cc.log("Khoi tao list game bai");
        this.listGameBaiTab = cc.instantiate(this.listGameBaiPrefab);
        var listGameBaiScript = this.listGameBaiTab.getComponent("ListGamelView");
        if (listGameBaiScript) {
            listGameBaiScript.initListButtonGame();
            this.listGameBtnContentNode.addChild(this.listGameBaiTab);
            this.setToggleDialog(this.listGameBaiTab);
        }
    },
    initListGameSlot: function () {
        cc.log("Khoi tao list game slot");
        this.listGameSlotTab = cc.instantiate(this.listGameSlotPrefab);
        var listGameSlotScript = this.listGameSlotTab.getComponent("ListGamelView");
        if (listGameSlotScript) {
            listGameSlotScript.initListButtonGame();
            this.listGameBtnContentNode.addChild(this.listGameSlotTab);
            this.setToggleDialog(this.listGameSlotTab);
        }
    },
    initListMiniGame: function () {
        cc.log("Khoi tao list game mini");
        this.listMiniGameTab = cc.instantiate(this.listMiniGamePrefab);
        var listMiniGameScript = this.listMiniGameTab.getComponent("ListGamelView");
        if (listMiniGameScript) {
            listMiniGameScript.initListButtonGame();
            this.listGameBtnContentNode.addChild(this.listMiniGameTab);
            this.setToggleDialog(this.listMiniGameTab);
        }
    },
    initListAllGame: function () {
        cc.log("Khoi tao list tat ca game");
        this.listAllGameTab = cc.instantiate(this.listAllGamePrefab);
        var listAllGameScript = this.listAllGameTab.getComponent("ListGamelView");
        if (listAllGameScript) {
            listAllGameScript.initListButtonGame();
            this.listGameBtnContentNode.addChild(this.listAllGameTab);
            this.setToggleDialog(this.listAllGameTab);
        }
    },
    setToggleDialog: function (dialog) {
        if (dialog) {
            if (!this.listPopupToggle) {
                this.listPopupToggle = [];
            }
            var toggle = dialog.getComponent(cc.Toggle);
            if (toggle) {
                this.listPopupToggle.push(toggle);
            }
        }
    },
    getListGameContent: function () {
        return this.listGameBtnContentNode;
    },
    resetListGameContent: function () {
        this.listGameBtnContentNode.removeAllChildren(true);
    },
    onTabGameToggle: function (toggle) {
        if (toggle && toggle.isChecked) {
            if (toggle.node && toggle.node.name) {
                var name = toggle.node.name;
                switch (name) {
                    case "tabTatCaGame":
                        this.onActiveTabAllGame();
                        break;
                    case "tabGameSport":
                        this.onActiveTabGameTheThao();
                        break;
                    case "tabGameSlot":
                        this.onActiveTabGameSlot();
                        break;
                    case "tabGameBai":
                        this.onActiveTabGameBai();
                        break;
                    case "tabMiniGame":
                        this.onActiveTabMiniGame();
                        break;
                    default:
                        break;

                }
            }
        }
    },
    offLayer: function (toggle) {
        if (toggle && cc.isValid(toggle)) {
            if (this.listPopupToggle) {
                for (var i = 0; i < this.listPopupToggle.length; i++) {
                    var currentToggle = this.listPopupToggle[i];
                    if (currentToggle && cc.isValid(currentToggle)) {
                        if (currentToggle == toggle) {
                            currentToggle.node.active = false;
                            this.activeCheckMark(currentToggle, false);
                        }
                    }

                }
            }
        }
    },
    offAllLayer: function () {
        if (this.listPopupToggle) {
            for (var i = 0; i < this.listPopupToggle.length; i++) {
                var currentToggle = this.listPopupToggle[i];
                if (currentToggle && cc.isValid(currentToggle)) {
                    if (currentToggle) {
                        currentToggle.node.active = false;
                        this.activeCheckMark(currentToggle, false);
                    }
                }

            }
        }
    },
    offLayerWithout: function (toggle) {
        if (toggle && cc.isValid(toggle)) {
            if (this.listPopupToggle) {
                for (var i = 0; i < this.listPopupToggle.length; i++) {
                    var currentToggle = this.listPopupToggle[i];
                    if (currentToggle && cc.isValid(currentToggle)) {
                        if (currentToggle != toggle) {
                            currentToggle.node.active = false;
                            this.activeCheckMark(currentToggle, false);
                        } else {
                            currentToggle.node.active = true;
                            this.activeCheckMark(currentToggle, true);
                        }
                    }
                }
            }
        }
    },
    activeCheckMark: function (toggle, enable) {
        if (toggle) {
            var checkMark = toggle.checkMark;
            if (checkMark) {
                if (enable) {
                    checkMark.enable = true;
                    toggle.check();

                } else {
                    checkMark.enable = false;
                    toggle.uncheck();
                }
            }
        }
    }
});
