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

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        
    },

    start() {

    },
    init(data) {
        this.data = data;
        if (this.data) {
            
            this.minBet.string = this.data.firstCashBet;
            if (this.data.tableSize != null) {
                for (var i = 0; i < 4; i++){
                    if (i <= this.data.tableSize - 1) {
                        this.currentPlayer[i].getChildByName("active").active = true;
                    } else {
                        this.currentPlayer[i].getChildByName("active").active = false;

                    }
                }
                if (this.data.tableSize == 0) {
                    this.nameTable.string = "Trống";
                    this.data.status = 0;// trong
                } else {
                    this.nameTable.string = this.data.tableIndex;
                    if(this.data.isPlaying == 1){
                        if(this.data.tableSize < this.data.maxNumberPlayer){
                            this.data.status = 1; // dang choi
                        }else{
                            this.data.status = 3; // day
                        }
                    }else{
                        if(this.data.tableSize < this.data.maxNumberPlayer){
                            this.data.status = 2; // cho
                        }else{
                            this.data.status = 3; // day
                        }
                    }
                }
            }
            
        }
    },
    tableClick(event) {
        Linker.PhomLobbyController.join(this.data);
    }

    // update (dt) {},
});
