var soccerConstant = require('soccerConstant');
var Utils = require('Utils');
var Linker = require('Linker');
var Constant = require('Constant');
var HeadBallConstant = require("HeadBallConstant");
var FootBallConstant = require("FootBallConstant");
var BiDaConstant = require('BiDaConstant');
var TLMNConstant = require('TLMNConstant');
var PhomConstant = require('PhomConstant');
var NewAudioManager = require('NewAudioManager');
var OptimizeList = require('OptimizeList');
cc.Class({
    extends: cc.Component,

    properties: {
        LeftForSportGames: cc.Node,
        LeftForCardGames: cc.Node,
        LobbyTop: cc.Node,
        ZoneForCardGames: cc.Node,
        LobbyZone: cc.Node,
    },
    showCardGame: function () {
        this.LeftForSportGames.active = false;
        this.LeftForCardGames.active = true;
        this.LobbyTop.active = false;
        this.ZoneForCardGames.active = true;
        this.LobbyZone.active = false;
    },
    showSportGame: function () {
        this.LeftForCardGames.active = false;
        this.LeftForSportGames.active = true;
        this.LobbyTop.active = true;
        this.ZoneForCardGames.active = false;
        this.LobbyZone.active = true;
    }
    // update (dt) {},
});