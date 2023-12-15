// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Linker = require('Linker');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        nameTable: cc.Label,
        currentPlayer: [cc.Node],
        minBet: cc.Label,
        stt: cc.Label,
        minCash: cc.Label,
        currentSize: cc.Label,
        currentProgress: cc.ProgressBar,
        spriteDisplayStatusTable: cc.Sprite,
        spriteFrameStatusTable: [cc.SpriteFrame]

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        
    },

    start() {

    },
    init(data) {
        this.data = data;
        // cc.log(data);
        if (this.data) {
            this.stt.string = this.data.pos + "";
            
            if(this.data.tableIndex>0){
                this.minBet.string = Utils.Number.format(this.data.firstCashBet) + " (Bàn "+this.data.tableIndex+")";
            }else{
                this.minBet.string = Utils.Number.format(this.data.firstCashBet) + "";
            }
            this.minCash.string = Utils.Number.format(this.data.firstCashBet * 10) + "";

            if (this.data.tableSize != null) {
                // for (var i = 0; i < 4; i++){
                //     if (i <= this.data.tableSize - 1) {
                //         this.currentPlayer[i].getChildByName("active").active = true;
                //     } else {
                //         this.currentPlayer[i].getChildByName("active").active = false;

                //     }
                // }
                this.currentSize.string = this.data.tableSize + "/" + this.data.maxNumberPlayer;
                var percentPlayer = Number(this.data.tableSize) / Number(this.data.maxNumberPlayer);

                this.setColorProcessBar(percentPlayer);
                this.currentProgress.progress = percentPlayer;

                if (this.data.tableSize == 0) {
                    this.nameTable.string = "Trống";
                    this.data.status = 0;// trong
                    this.nameTable.node.color = new cc.Color().fromHEX("#FFFFFF");
                } else {
                    // this.nameTable.string = this.data.tableIndex;
                    if(this.data.isPlaying == 1){
                        if(this.data.tableSize < this.data.maxNumberPlayer){
                            this.data.status = 1; // dang choi
                            this.nameTable.string = "Đang chơi";
                            this.nameTable.node.color = new cc.Color().fromHEX("#FFD600");
                        }else{
                            this.data.status = 3; // day
                            this.nameTable.string = "Đã đầy";
                            this.nameTable.node.color = new cc.Color().fromHEX("#C33939");
                        }
                    }else{
                        if(this.data.tableSize < this.data.maxNumberPlayer){
                            this.data.status = 2; // cho
                            this.nameTable.string = "Đang chờ";
                            this.nameTable.node.color = new cc.Color().fromHEX("#FFFFFF");
                        }else{
                            this.data.status = 3; // day
                            this.nameTable.string = "Đã đầy";
                            this.nameTable.node.color = new cc.Color().fromHEX("#FFD600");
                        }
                    }
                }
            }
            
        }
    },
    tableClick(event) {
        Linker.PhomLobbyController.join(this.data);
    },
    setColorProcessBar: function(percent){
        if (percent == 0) return;
        if(percent > 0 && percent < 0.5){
            this.spriteDisplayStatusTable.getComponent(cc.Sprite).spriteFrame = this.spriteFrameStatusTable[1];
            //light blue
        }else if(percent >= 0.5 && percent < 0.75){
            this.spriteDisplayStatusTable.getComponent(cc.Sprite).spriteFrame = this.spriteFrameStatusTable[0];
            //green
        }else if(percent >= 0.75 && percent < 1.0){
            this.spriteDisplayStatusTable.getComponent(cc.Sprite).spriteFrame = this.spriteFrameStatusTable[2];
            //yellow
        }else{
            this.spriteDisplayStatusTable.getComponent(cc.Sprite).spriteFrame = this.spriteFrameStatusTable[3];
            //red
        }

    }

    // update (dt) {},
});
