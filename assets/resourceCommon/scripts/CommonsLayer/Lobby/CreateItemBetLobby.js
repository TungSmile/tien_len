var Linker = require("Linker");
var soccerConstant = require("soccerConstant");
var HeadBallConstant = require("HeadBallConstant");
var Utils = require("Utils");
var Constant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        soccerItem: cc.Prefab,
        headballItem: cc.Prefab,
        shootingItem: cc.Prefab,
        phidaoItem: cc.Prefab,
        footballItem: cc.Prefab,
        bidaItem: cc.Prefab,

        lockSpriteFrame: cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:
    ctor() {
        this.canAccess = true;
    },

    onLoad () {
        this.betMoney = "";
    },
    onEnable() {
        this.bet = 0;
    },
    start () {
        cc.Canvas.instance.node.on("scroll-card-touch-end", this.requestMatchMaking, this);
    },

    // update (dt) {},

    initBetItem: function() {
        this.node.removeAllChildren(true);
        let game = null;
        switch (Linker.ZONE)
        {
            case Constant.ZONE_ID.SOCCER_GALAXY_1VS1:
                game = cc.instantiate(this.soccerItem);
                game.active = true;
                game.opacity = 255;
                this.node.addChild(game);
                break;
            case Constant.ZONE_ID.HEAD_BALL_1VS1:
                game = cc.instantiate(this.headballItem);
                game.active = true;
                game.opacity = 255;
                this.node.addChild(game);
                break;
            case Constant.ZONE_ID.BAN_SUNG:
                game = cc.instantiate(this.shootingItem);
                game.active = true;
                game.opacity = 255;
                this.node.addChild(game);
                break;
            case Constant.ZONE_ID.FOOTBALL_1VS1:
                game = cc.instantiate(this.footballItem);
                game.active = true;
                game.opacity = 255;
                this.node.addChild(game);
                break;
            case Constant.ZONE_ID.PHI_DAO:
                game = cc.instantiate(this.phidaoItem);
                game.active = true;
                game.opacity = 255;
                this.node.addChild(game);
                break;
            case Constant.ZONE_ID.BIDA_1VS1:
                game = cc.instantiate(this.bidaItem);
                game.active = true;
                game.opacity = 255;
                this.node.addChild(game);
                break;
            case 47: {
                game = cc.instantiate(this.phiDaoItem);
                game.active = true;
                game.opacity = 255;
                this.node.addChild(game);
                break;
            }
            default:
                break;
        }
    },

    getItemGameBet: function() {
        var children = this.node.children[0];
        if (!children)
        {
            this.initBetItem();
        }
        return this.node.children[0];
    },

    setBetMoney: function(option) {
        var item = this.getItemGameBet();
        this.canAccess = option.canAccess;
        if (item)
        {
            var itemScript = item.getComponent("ItemGameBet");
            if (itemScript)
            {
                if (this.canAccess) {
                    itemScript.setLock(false);
                } else itemScript.setLock();
                this.betMoney = option.label;
                var money = Utils.Malicious.moneyWithFormat(option.label, ".");
                itemScript.setMoney(money);
                itemScript.setNumberPlayerOnline(option.numPlayer);
                itemScript.setPlayerOnline(option.online);
                itemScript.setLevelAccess(option.levelAccess);
            }
        }
    },
    getInitImageBetItem: function() {
        return this.node.parent.getComponent("initImageBetItem");
    },

    setImageSoccer: function() {
        var initImageBetItem = this.getInitImageBetItem();
        var x = 0, y = 0, z = 0;
        for (var i = 0; i < this.node.parent.childrenCount; ++i)
        {
            var element = this.node.parent.children[i].children[0];
            var itemGameBet = element.getComponent("ItemGameBet");
            if (itemGameBet)
            {
                if (x == initImageBetItem.getLengthBackground())
                    x = 0;
                if (y == initImageBetItem.getLengthIcon())
                    y = 0;
                if (z == initImageBetItem.getLengthGameInfo())
                    z = 0;
                itemGameBet.setButtonImg(initImageBetItem.getBackground(x));
                itemGameBet.setIcon(initImageBetItem.getIcon(y));
                itemGameBet.setGameInfo(initImageBetItem.getGameInfoBg(z));
                ++x;
                ++y;
                ++z;
            }
        }
    },

    setBet: function(money) {
        this.bet = money;
    },
    getBetItem: function() {
        return this.bet;
    },

    requestMatchMaking(moneyBet) {
        var message = {
            userId: Linker.userData.userId,
            money: moneyBet,
            zoneID: Linker.ZONE
        }
        cc.Canvas.instance.node.emit("request-match-making", message);
    }
});
