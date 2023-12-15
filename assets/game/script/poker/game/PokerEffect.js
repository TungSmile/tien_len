var CARD_HEIGHT = 144;
var CARD_WIDTH = 107;
var SPACE = -35;
var SPACE1 = 25;
var SCALE = 0.6;
var Linker = require('Linker');
var Utils = require('Utils');
var PokerEffect = {

    chiaBaiEffect(listPlayerNode, tempCardAnimation) {
        Array.prototype.diff = function (a) {
            return this.filter(function (i) {
                return a.indexOf(i) < 0;
            });
        };

        // this.listPlayerNode=[];
        // this.listPlayerNode.push(this.player1,this.player2,this.player3,this.player4,this.player5,this.player6,this.player7,this.player8,this.player9);

        var lstTemp = [];

        var stt = [4, 3, 2, 1, 9, 8, 7, 6, 5];
        var stt2 = [4, 3, 2, 1, 9, 8, 7, 6, 5];
        listPlayerNode.forEach(item => {
            var index = stt.indexOf(item.playerNumber);
            if (index > -1) {
                stt.splice(index, 1);
            }
        });

        stt2 = stt2.diff(stt);
        for (var i = 0; i < stt2.length; i++) {
            for (var j = 0; j < stt2.length; j++) {
                if (listPlayerNode[j].playerNumber == stt2[i]) {
                    lstTemp.push(listPlayerNode[j]);
                }
            }
        }

        var delayTime = [];
        for (var i = 0; i < listPlayerNode.length * 2; i++) {
            delayTime.push(i * 0.3);
        }
        var lech = 0;
        for (var i = 0, j = 0; i < listPlayerNode.length * 2; i++, j++) {
            var cardAni = cc.instantiate(tempCardAnimation);

            //cc.find('Canvas/Animation').addChild(cardAni);
            Linker.PokerController.animationNode.addChild(cardAni);
            if (i == listPlayerNode.length) {
                j = 0;
                lech = 15;
            }
            cardAni.runAction(cc.sequence(cc.delayTime(delayTime[i]), cc.rotateBy(0.3, 720)));
            cardAni.runAction(cc.sequence(cc.delayTime(delayTime[i]), cc.moveTo(0.3, lstTemp[j].node.getChildByName('card_face_down').x + lech, lstTemp[j].node.getChildByName('card_face_down').y), cc.callFunc(function (cardAni) {
                //cardAni.destroy();
                cardAni.stopAllActions();
                cardAni.rotation = 0;
            }, this)));
        }

    },


    chiaBaiChungEffect(cardContainer, listCard, tempCard, tempCardAnimation) {
        cardContainer.active = true;
        var childNum = cardContainer.getChildren().length;
        if (childNum == 5) {
            cardContainer.removeAllChildren();
        }
        listCard.forEach(item => {
            var card = cc.instantiate(tempCard);
            card.active = false;
            card.getChildByName('normalCard').active = true;
            var script = card.getComponent('PokerCard');
            if (script) {
                script.fromServerValue(item.serverValue);
                script.reset();
            }
            cardContainer.addChild(card);
        });

        this.lst2 = cardContainer.getChildren();
        var delayTime = [];
        for (var i = 0; i < listCard.length; i++) {
            delayTime.push(i * 0.3);
        }
        for (var i = 0, j = 0; i < listCard.length; i++, j = j + 94) {
            var cardAni = cc.instantiate(tempCard);
            var bg = cardAni.getChildByName('background');
            bg.height = 110;
            bg.width = 85;
            cardAni.scale = 0.6;
            cardAni.position = tempCardAnimation.position;
            Linker.PokerController.animationNode.addChild(cardAni);
            if (childNum == 3) {
                j = 282;
            } else if (childNum == 4) {
                j = 376;
            }
            cardAni.runAction(cc.sequence(cc.delayTime(delayTime[i]), cc.scaleTo(0.5, 1)));
            cardAni.runAction(cc.sequence(cc.delayTime(delayTime[i]), cc.moveTo(0.5, cardContainer.x + 33 + j, cardContainer.y), cc.fadeOut(.17), cc.callFunc(function (cardAni) {
                cardAni.destroy();
                for (var i = 0; i < this.lst2.length; i++) {
                    if (!this.lst2[i].active) {
                        this.lst2[i].active = true;
                        break;
                    }
                }
            }, this)));
        }
    },

    chiaBaiChungEffectSpeed(cardContainer, listCard, tempCard, tempCardAnimation) {
        cardContainer.active = true;
        var childNum = cardContainer.getChildren().length;
        if (childNum == 5) {
            cardContainer.removeAllChildren();
        }
        listCard.forEach(item => {
            var card = cc.instantiate(tempCard);
            card.active = false;
            card.getChildByName('normalCard').active = true;
            var script = card.getComponent('PokerCard');
            if (script) {
                script.fromServerValue(item.serverValue);
                script.reset();
            }
            cardContainer.addChild(card);
        });

        this.lst2 = cardContainer.getChildren();
        var delayTime = [];
        for (var i = 0; i < listCard.length; i++) {
            delayTime.push(i * 0.2);
        }
        for (var i = 0, j = 0; i < listCard.length; i++, j = j + 94) {
            var cardAni = cc.instantiate(tempCard);
            var bg = cardAni.getChildByName('background');
            bg.height = 110;
            bg.width = 85;
            cardAni.scale = 0.6;
            cardAni.position = tempCardAnimation.position;
            Linker.PokerController.animationNode.addChild(cardAni);
            if (childNum == 3) {
                j = 282;
            } else if (childNum == 4) {
                j = 376;
            }
            cardAni.runAction(cc.sequence(cc.delayTime(delayTime[i]), cc.scaleTo(0.3, 1)));
            cardAni.runAction(cc.sequence(cc.delayTime(delayTime[i]), cc.moveTo(0.3, cardContainer.x + 33 + j, cardContainer.y), cc.fadeOut(.17), cc.callFunc(function (cardAni) {
                cardAni.destroy();
                for (var i = 0; i < this.lst2.length; i++) {
                    if (!this.lst2[i].active) {
                        this.lst2[i].active = true;
                        break;
                    }
                }
            }, this)));
        }
    },


    showWin(player, winType) {
        var name = '';
        if (Number(winType) == -1) {
            name = 'tuhai';
        } else if (Number(winType) == 1) {
            name = 'antrang';
        } else {
            name = 'thang';
        }
        player.win.active = true;
        player.win.getChildByName(name).active = true;
        player.win.getChildByName('glow2').active = true;
        player.win.getChildren().forEach(item => {
            if (item.name !== 'glow2' && item.name !== name) {
                item.active = false;
            }
        });
        setTimeout(() => {
            //player.win.active=false;
            player.win.getChildByName(name).active = false;
            player.win.getChildByName('glow2').active = false;
        }, 5000);
    },
    showLose(player) {
        player.win.active = true;
        player.win.getChildByName('thua').active = true;
        player.win.getChildren().forEach(item => {
            if (item.name !== 'thua') {
                item.active = false;
            }
        });
        setTimeout(() => {
            //player.win.active=false;
            player.win.getChildByName('thua').active = false;

        }, 5000);
    },
    // showPoint(player,point){
    //     player.tien.active=true;
    //     if(Number(point)>0){
    //         player.tien.getChildByName('thang').active=true;
    //         player.tien.getChildByName('thang').getComponent(cc.Label).string='+'+point;
    //         setTimeout(() => {
    //             player.tien.active=false;
    //             player.tien.getChildByName('thang').active=false;

    //         }, 5000);
    //     }else{
    //         player.tien.getChildByName('thua').active=true;
    //         player.tien.getChildByName('thua').getComponent(cc.Label).string=point;
    //         setTimeout(() => {
    //             player.tien.active=false;
    //             player.tien.getChildByName('thua').active=false;

    //         }, 5000);
    //     }
    // },

    // showTo(player,tiento) {
    //     if (!player || !player.win) {
    //         return;
    //     }
    //     player.win.active = true;
    //     player.win.getChildByName('to').active = true;
    //     player.win.getChildByName('to').getChildByName('textTien').getComponent(cc.Label).string=tiento;
    //     player.win.getChildren().forEach(item => {
    //         if (item.name !== 'to') {
    //             item.active = false;
    //         }
    //     });
    //     setTimeout(() => {
    //         if (!player || !player.win) {
    //             return;
    //         }
    //         player.win.getChildByName('to').active = false;

    //     }, 3000);
    // },

    showTheo(player, tientheo, type, tongtien) {
        if (!player || !player.win) {
            return;
        }

        player.win.getChildByName('theo').getChildByName('textTienAdd').active = true;
        player.win.active = true;
        player.win.getChildByName('theo').active = true;
        if (type == 1) {
            player.win.getChildByName('theo').getChildByName('ic_to').active = true;
            player.win.getChildByName('theo').getChildByName('ic_theo').active = false;
        } else {
            player.win.getChildByName('theo').getChildByName('ic_theo').active = true;
            player.win.getChildByName('theo').getChildByName('ic_to').active = false;
        }
        player.win.getChildByName('theo').getChildByName('textTien').getComponent(cc.Label).string = Utils.Number.format(tongtien);
        player.win.getChildByName('theo').getChildByName('textTienAdd').getComponent(cc.Label).string = '+' + Utils.Number.format(tientheo);
        player.win.getChildren().forEach(item => {
            if (item.name !== 'theo') {
                item.active = false;
            }
        });
        setTimeout(() => {
            if (!player || !player.win) {
                return;
            }
            player.win.getChildByName('theo').getChildByName('textTienAdd').active = false;

        }, 3000);
    },

    showMoneyAtStart(player, tientheo) {
        if (!player || !player.win) {
            return;
        }
        player.win.getChildByName('theo').active = true;
        player.win.getChildByName('theo').getChildByName('textTien').getComponent(cc.Label).string = Utils.Number.format(tientheo);
        player.win.getChildByName('theo').getChildByName('textTienAdd').active = false;
        player.win.active = true;
        player.win.getChildByName('theo').getChildByName('ic_theo').active = false;
        player.win.getChildByName('theo').getChildByName('ic_to').active = true;
    },

    showXem(player) {
        if (!player || !player.win) {
            return;
        }
        player.win.active = true;
        player.win.getChildByName('xem').active = true;
        player.win.getChildren().forEach(item => {
            if (item.name !== 'xem' && item.name !== 'theo') {
                item.active = false;
            }
        });
        setTimeout(() => {
            if (!player || !player.win) {
                return;
            }
            player.win.getChildByName('xem').active = false;

        }, 3000);
    },

    showUp(player) {
        if (!player || !player.win) {
            return;
        }
        player.win.active = true;
        player.win.getChildByName('up').active = true;
        player.win.getChildren().forEach(item => {
            if (item.name !== 'up' && item.name !== 'theo') {
                item.active = false;
            }
        });
        // setTimeout(() => {
        //     if (!player || !player.win) {
        //         return;
        //     }
        //     player.win.getChildByName('up').active = false;

        // }, 3000);
    },

    showXalang(player) {
        if (!player || !player.win) {
            return;
        }
        player.win.active = true;
        player.win.getChildByName('xalang').active = true;
        player.win.getChildren().forEach(item => {
            if (item.name !== 'xalang' && item.name !== 'theo') {
                item.active = false;
            }
        });
        setTimeout(() => {
            if (!player || !player.win) {
                return;
            }
            player.win.getChildByName('xalang').active = false;

        }, 3000);
    },

    showPoint(k, player,getPocker) {
        if (!player || !player.win) {
            return;
        }
        player.win.getChildren().forEach(item => {
            item.active = false;
        });
        player.win.active = true;
        var time=5000;
        if(getPocker){
            time=1000;
        }
        switch (Number(k)) {
            case 1:
                player.win.getChildByName('mauthau').active = true;
                setTimeout(() => {
                    if (!player || !player.win) {
                        return;
                    }
                    player.win.getChildByName('mauthau').active = false;
                }, time);
                break;
            case 2:
                player.win.getChildByName('doi').active = true;
                setTimeout(() => {
                    if (!player || !player.win) {
                        return;
                    }
                    player.win.getChildByName('doi').active = false;
                }, time);
                break;
            case 3:
                player.win.getChildByName('thu').active = true;
                setTimeout(() => {
                    if (!player || !player.win) {
                        return;
                    }
                    player.win.getChildByName('thu').active = false;
                }, time);
                break;
            case 4:
                player.win.getChildByName('samco').active = true;
                setTimeout(() => {
                    if (!player || !player.win) {
                        return;
                    }
                    player.win.getChildByName('samco').active = false;
                }, time);
                break;
            case 5:
                player.win.getChildByName('sanh').active = true;
                setTimeout(() => {
                    if (!player || !player.win) {
                        return;
                    }
                    player.win.getChildByName('sanh').active = false;
                }, time);
                break;
            case 6:
                player.win.getChildByName('sanh').active = true;
                setTimeout(() => {
                    if (!player || !player.win) {
                        return;
                    }
                    player.win.getChildByName('sanh').active = false;
                }, time);
                break;
            case 7:
                player.win.getChildByName('thung').active = true;
                setTimeout(() => {
                    if (!player || !player.win) {
                        return;
                    }
                    player.win.getChildByName('thung').active = false;
                }, time);
                break;
            case 8:
                player.win.getChildByName('culu').active = true;
                setTimeout(() => {
                    if (!player || !player.win) {
                        return;
                    }
                    player.win.getChildByName('culu').active = false;
                }, time);
                break;
            case 9:
                player.win.getChildByName('tuquy').active = true;
                setTimeout(() => {
                    if (!player || !player.win) {
                        return;
                    }
                    player.win.getChildByName('tuquy').active = false;
                }, time);
                break;
            case 10:
                // by Son
                player.win.getChildByName('thungphasanh').active = true;
                setTimeout(() => {
                    if (!player || !player.win) {
                        return;
                    }
                    player.win.getChildByName('thungphasanh').active = false;
                }, time);
                break;
            case 11:
                player.win.getChildByName('thungphasanh').active = true;
                setTimeout(() => {
                    if (!player || !player.win) {
                        return;
                    }
                    player.win.getChildByName('thungphasanh').active = false;
                }, time);
                break;

        }

        player.win.getChildByName('theo').active = true;
        if(!getPocker){
            setTimeout(() => {
                if (!player || !player.win) {
                    return;
                }
                player.win.getChildByName('theo').active = false;
            }, 5000);
        }
        
        

    }

};
module.exports = PokerEffect