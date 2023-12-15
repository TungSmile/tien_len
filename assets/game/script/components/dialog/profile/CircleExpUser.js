// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        nameGameLabel: cc.Label,
        circleSpritePercent: cc.Sprite,
        winLable: cc.Label,
        loseLabel: cc.Label,
        expLabel: cc.Label,
        totalLabel: cc.Label,
        expLabel: cc.Label,
        percentLabel: cc.Label
    },
    onLoad() {
        this.listGameName = {
            84: "1vs4",
            86: "Card",
            8: "1vs1",
            45: "1vs1"
        }
    },

    setInfoGame: function (data) {
        if (data) {
            var exp = Number(data.exp);
            var lose = Number(data.lose);
            var win = Number(data.win);
            var totalplay = Number(data.totalplay);
            var zoneId = data.zoneId.toString();
            if (this.listGameName && this.listGameName.hasOwnProperty(zoneId)) {
                var percent = 0;
                if (isNaN(totalplay) == false && totalplay > 0) {
                    percent = win / totalplay;
                    if (isNaN(percent)) {
                        percent = 0;
                    }
                }
                this.winLable.string = win;
                this.loseLabel.string = lose;
                this.totalLabel.string = totalplay;
                this.expLabel.string = exp;
                this.nameGameLabel.string = this.listGameName[zoneId];
                this.percentLabel.string = Math.round(percent * 100) + "%";
                this.circleSpritePercent.fillCenter = cc.v2(0.5, 0.5);
                this.circleSpritePercent.fillStart = 0;
                this.circleSpritePercent.fillRange = percent;
            }
        }
    }

    // update (dt) {},
});
