var Linker = require("Linker");
var Utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {
        player: [cc.Node],
        avatar: [cc.Sprite],
        namePlayer: [cc.Label],
        moneyPlayer: [cc.Label],
        notification: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Linker.MatchMakingScript = this;
        this.avatar[1].spriteFrame = null;
        this.namePlayer[1].string = "";
        this.moneyPlayer[1].string = "";
    },

    start () {
        this.setInfoLeft();
    },

    // update (dt) {},

    setInfoLeft() {
        this.namePlayer[0].string = Linker.userData.displayName;
        this.moneyPlayer[0].string = Utils.Malicious.moneyWithFormat(Linker.userData.userMoney, ".");
    },
    setInfoRight(message) {
        this.namePlayer[1].string = message.player.viewName;
        this.moneyPlayer[1].string = Utils.Malicious.moneyWithFormat(message.player.userMoney, ".");
    },
    setInfoPlayer(message) {
        for (var i = 0; i < message.listPlayer.length; ++i)
        {
            var player = message.listPlayer[i];
            if (player.viewName == Linker.userData.displayName)
            {
                this.namePlayer[0].string = player.viewName;
                this.moneyPlayer[0].string = Utils.Malicious.moneyWithFormat(player.userMoney);
            }
            else
            {
                this.namePlayer[1].string = player.viewName;
                this.moneyPlayer[1].string = Utils.Malicious.moneyWithFormat(player.userMoney);
            }
        }
    },

    setContentNotification(text) {
        this.notification.string = text;
    },

    startGame() {
        Linker.GAME.opacity = 255;
        var portalView = Linker.PortalController.getPortalViewComponent();
        portalView.showGameLayer(true);
        if (this.node)
            this.node.destroy();
    }
});
