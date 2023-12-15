var NewAudioManager = require('NewAudioManager');
var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        moneyBonusLabel: cc.Label,
        userNameLabel: cc.Label,
        animationNode: cc.Animation,
        tien: cc.Node,
        animationContainer: cc.Node
    },
    onLoad() {
        this.lstTien=[{x:50,y:70},
            {x:60,y:80},
            {x:70,y:90},
            {x:80,y:100},
            {x:90,y:110},
            {x:100,y:120},
            {x:110,y:130},
            {x:120,y:140},
            {x:130,y:150}]
    },
    start() {

    },
    onEnable: function () {
        NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND_GAME.BIDA.VI.COFFER : NewAudioManager.SOUND_GAME.BIDA.EN.COFFER);
        this.playEffectMoney();
    },
    playEffectMoney() {
        var winSize = cc.winSize;
        this.animationContainer.removeAllChildren();
        for (var i = 0; i < 150; i++) {
            var temp = cc.instantiate(this.tien);
            var index = Math.floor(Math.random() * 9);
            temp.width = this.lstTien[index].x;
            temp.height = this.lstTien[index].y;
            temp.rotation = Math.floor(Math.random() * 360);
            temp.active = true;
            temp.y = Math.floor(winSize.height / 2) + 200;
            temp.x = Math.floor(Math.random() * Math.floor(winSize.width / 2)) * (Math.round(Math.random()) * 2 - 1);
            this.animationContainer.addChild(temp);

            temp.runAction(cc.sequence(cc.delayTime((Math.random() * (1.5000 - 0.120) + 0.120).toFixed(4)), cc.moveTo((Math.random() * (2.5200 - 1.120) + 1.0200).toFixed(4), temp.x, -550), cc.callFunc((temp) => {
                temp.destroy();
            })))
        }
        this.scheduleOnce(function(){
            if (this.animationContainer) {
                this.animationContainer.removeAllChildren();
            }
        }, 3.5);
    },
    hideAnimLayer: function () {
        this.animationNode.stop();
        var seq = cc.sequence(
            cc.scaleTo(0.1, 1.2, 1.2),
            cc.spawn(
                cc.fadeOut(0.2),
                cc.scaleTo(0.2, 0, 0),
            ),
            cc.callFunc(function () {
                this.node.active = false;
            }.bind(this))
        );
        this.node.runAction(seq);
    },
    runAnimation: function () {
        this.resetAttr();
        this.animationNode.play();
        NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND_GAME.BIDA.VI.COFFER : NewAudioManager.SOUND_GAME.BIDA.EN.COFFER);
        var self = this;
        setTimeout(function () {
            self.hideAnimLayer();
        }, 4000);
    },
    resetAttr: function () {
        this.node.active = true;
        this.node.scale = 1;
        this.node.opacity = 255;
        this.node.rotation = 0;
    },
    setUserName: function (username) {
        //this.userNameLabel.string = username;
    },
    setMoneyBonus: function (moneybonus) {
        var customMoney = this.custom_textForm(moneybonus);
        this.moneyBonusLabel.string = customMoney;
    },
    custom_textForm(str) {
        var text = '';
        var j = 0;
        for (var i = str.length - 1; i >= 0; i--) {
            j++;
            text = str[i] + text;
            if (j == 3 && i != 0) {
                text = "." + text;
                j = 0;
            }
        }
        return text;
    },
    // update (dt) {},
});
