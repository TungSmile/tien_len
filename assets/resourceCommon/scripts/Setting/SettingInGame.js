var Linker = require('Linker');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
var LoginCache = require('LoginCache');
var Facebook = require('Facebook');
var LobbySend = require('LobbySend');
var Constant = require('Constant');
var XocDiaSend = require('XocDiaSend');
var Utils = require('Utils');
var NativeBridge = require('NativeBridge');
var SceneManager = require('SceneManager');
var Global = require("Global");
var NodePoolManager = require('NodePoolManager');
var DataAccess = require('DataAccess');
var NewAudioManager = require('NewAudioManager');
var i18n = require('i18n');
var SoccerGalaxySend = require('SoccerGalaxySend');
cc.Class({
    extends: cc.Component,

    properties: {
        contentSettingNode: cc.Node,
        settingSoccerGalaxyItemsPrefab: cc.Prefab,
        settingBillardItemsPrefab: cc.Prefab,
    },
    resetSettingInGame: function () {
        if (this.settingInGame) {
            this.settingInGame.removeFromParent(true);
            this.settingInGame = null;
        }
    },
    initIngameSetting: function () {
        // if (Linker._sceneTag == Constant.TAG.scenes.GAME) {
        //     if (!this.settingInGame || (this.settingInGame && !cc.isValid(this.settingInGame))) {
        //         var settingIngameComponent;
        //         if (Linker.ZONE == Constant.ZONE_ID.BIDA_1VS4 || Linker.ZONE == Constant.ZONE_ID.BIDA_1VS1 || Linker.ZONE == Constant.ZONE_ID.BIDA_PHOM) {
        //             this.settingInGame = cc.instantiate(this.settingBillardItemsPrefab);
        //             settingIngameComponent = this.settingInGame.getComponent("BidaItemSettings");
        //             this.contentSettingNode.addChild(this.settingInGame);
        //         } else if (Linker.ZONE == Constant.ZONE_ID.SOCCER_GALAXY_1VS1) {
        //             this.settingInGame = cc.instantiate(this.settingSoccerGalaxyItemsPrefab);
        //             settingIngameComponent = this.settingInGame.getComponent("SoccerItemSettings");
        //             this.contentSettingNode.addChild(this.settingInGame);
        //         }
        //     }
        // } else {
        //     if (this.settingInGame) {
        //         this.settingInGame.removeFromParent(true);
        //         this.settingInGame = null;
        //     }
        // }
    },
    showSettingInGame: function () {
        if (this.settingInGame && cc.isValid(this.settingInGame)) {
            this.settingInGame.active = true;
        }
    },
    hideSettingInGame: function () {
        if (this.settingInGame && cc.isValid(this.settingInGame)) {
            this.settingInGame.active = false;
        }
    },
    requestSetting: function (event) {
        this.initIngameSetting();
        if (this.settingInGame && cc.isValid(this.settingInGame)) {
            var _settingInGameItem = this.settingInGame.getComponent("SoccerItemSettings");
            if (!_settingInGameItem) {
                cc.error("Bida Setting Request...", event);
                _settingInGameItem = this.settingInGame.getComponent("BidaItemSettings");
            }
            if (_settingInGameItem) {
                _settingInGameItem.requestSettingMode(event);
                _settingInGameItem.updateToggle(event);
            }
        } else {
            //setting ben ngoai ban choi
            if (Linker.ZONE == Constant.ZONE_ID.SOCCER_GALAXY_1VS1) {
                var matchID = 0;
                if (Linker && Linker.CURRENT_TABLE) {
                    matchID = Number(Linker.CURRENT_TABLE.tableId);
                    if (isNaN(matchID) == true) {
                        matchID = 0;
                    }
                }
                var data = {
                    zoneID: Linker.ZONE,
                    matchID: matchID,
                    isFastPlay: 0,
                    ballErrorId: 0,
                    uidChange: Number(Linker.userData.userId),
                    formationId: Linker.SoccerGalaxy.CurrentMapID,
                    style: 0,
                    maxAutoNextTurn: 0,
                    goalNumber: 0,
                    isFormation: true
                };
                if (Utils.Malicious.isValidObj(data)) {
                    var dataSend = SoccerGalaxySend.sendSettingRequest(data);
                    cc.log(dataSend);
                    if (Linker.Socket.isOpen()) {
                        Linker.Socket.send(dataSend);
                    } else {
                        cc.Global.showMessage(i18n.t("message_lost_connection"));
                    }
                }
            }
        }
    },
    configSetting: function (event) {
        this.initIngameSetting();
        if (event) {
            if (event.isMaster && !event.isPlaying) {
                this.showSettingInGame();
                if (this.settingInGame && cc.isValid(this.settingInGame)) {
                    var _settingInGameItem = this.settingInGame.getComponent("SoccerItemSettings");
                    if (!_settingInGameItem) {
                        _settingInGameItem = this.settingInGame.getComponent("BidaItemSettings");
                    }
                    if (_settingInGameItem) {
                        _settingInGameItem.updateToggle(event);
                    }
                }
            } else {
                this.hideSettingInGame();
            }
        }
    }

    // update (dt) {},
});
