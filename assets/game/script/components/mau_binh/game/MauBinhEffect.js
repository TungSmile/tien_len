var NewAudioManager = require('NewAudioManager');
var MaubinhEffect = {
    chiaBaiEffect(player,cb){
        player.cardOnHandList.active = true;
        var pos = [];
        var delayTime = [
            0.1,0.2,0.3,
            0.4,0.5,0.6,0.7,0.8,
            0.9,1,1.1,1.2,1.3,
        ];
        var listCard = player.cardOnHandList;
        listCard.children.forEach(element => {
            pos.push(element.position);
        });
        listCard.children.forEach(element => {
            element.x = 0 - player.cardOnHandList.x;
            element.y = 0 - player.cardOnHandList.y;
        });
        for (let i = 0; i < pos.length; i++) {
            listCard.children[i].active = true;
            listCard.children[i].runAction(cc.sequence(cc.delayTime(delayTime[i]),cc.moveTo(0.2,pos[i]),cc.callFunc(()=>{
                NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.CHIA_BAI, 1, false, false);
                if(i == pos.length -1){
                    if(cb){
                        cb();
                    }
                }
            })));
        }
    },
    xepBaiEffect(player){
        if(player.cardOnHandList && player.cardOnHandList.children){
            var listCard = player.cardOnHandList.children;
            player.cardOnHandList.active = true;
            var index1 = this.Random(0,13);
            var index2 = this.Random(0,13);
            if(index1 != index2){
                var card1 = cc.instantiate(listCard[index1]);
                var card2 = cc.instantiate(listCard[index2]);
                listCard[index1].active = false;
                listCard[index2].active = false;
                player.cardOnHandList.addChild(card1);
                player.cardOnHandList.addChild(card2);
                card1.runAction(cc.sequence(cc.moveTo(0.2,listCard[index2].position),cc.callFunc(()=>{
                    card1.destroy();
                    listCard[index2].active = true;
                })));
                card2.runAction(cc.sequence(cc.moveTo(0.2,listCard[index1].position),cc.callFunc(()=>{
                    card2.destroy();
                    listCard[index1].active = true;
                })));
            }
        }
    },
    stopAllEffect(player){
        if(player.cardOnHandList && player.cardOnHandList.children){
            player.cardOnHandList.children.forEach(item=>{
                item.stopAllActions();
            });
        }
    },
    Random(min, max) {
        var rd = Math.floor(Math.random() * (max - min) + min);
        return rd;
    },
}
module.exports = MaubinhEffect;
