var CARD_HEIGHT = 144;
var CARD_WIDTH = 107;
var SPACE = -35;
var SPACE1 = 25;
var SCALE = 0.6;
var PhomEffect = {
    turnCardEffect(player, card) {

    },
    otherTurnCardEffect(player, card, isAn = false) {
        var listCard = player.listCardEffect;
        var startPos = player.profileNode.parent.convertToWorldSpace(player.profileNode.position);
        // startPos = listCard.convertToNodeSpace(startPos);
        listCard.position = cc.v2(0,0);
        var count = 0;
        var self = this;
        var sizeCard = 1;
       
        var parent = player.turnedCardList;
        var parentPos = parent.convertToWorldSpace(cc.v2(54 + (parent.children.length) * 73, 0));
        parentPos = listCard.convertToNodeSpace(parentPos);
        cc.log("MOVE", startPos, parentPos);
        var delayTime = [];
        var action = [];
        for (var i = 0; i < sizeCard; i++) {
            delayTime.push(i * 0.1);
        }
        for (var i = 0; i < sizeCard; i++) {
            var space = SPACE1;
            if (i == 0) {
                space = 0;
            }
            var action1 = cc.sequence(cc.moveTo(0, startPos), cc.delayTime(delayTime[i]), cc.moveTo(0.2, cc.v2(parentPos.x, parentPos.y)));
            var action2 = cc.sequence(cc.scaleTo(0, SCALE), cc.delayTime(delayTime[i]), cc.scaleTo(0.2, SCALE));
            var seq = cc.spawn(action1, action2);
            action.push(seq);
        }
        for (var i = 0; i < sizeCard; i++) {
            listCard.children[i].runAction(cc.sequence(action[i], cc.callFunc(() => {
                count++;
                if (count == sizeCard) {
                    listCard.position = cc.v2(3000, 0);
                    listCard.children.forEach(element => {
                        element.position = cc.v2(0, 0);
                        element.scale = 0.6;
                    });
                    // player.cardOnHandList.active = true;
                    if (card) {
                        player.addTurnedCard(card, isAn);
                    }
                }
            })));
        }
    },
    bocCardEffect(player, card,callBackHaPhom) { 
        if (card) {
            card.active = false;
        }
        var listCard = player.listCardEffect;
        listCard.position = cc.v2(0, 0);
        var count = 0;
        var self = this;
        var sizeCard = 1;
        var startPos = cc.v2(0, 0);
        var parent = player.cardOnHandList;
        // var parentPos = parent.position;
        var parentPos = parent.convertToWorldSpace(cc.v2(54 + (parent.children.length) * 83, 0));
        parentPos = listCard.convertToNodeSpace(parentPos);
        var delayTime = [];
        var action = [];
        for (var i = 0; i < sizeCard; i++) {
            delayTime.push(i * 0.1);
        }
        for (var i = 0; i < sizeCard; i++) {
            var space = SPACE1;
            if (i == 0) {
                space = 0;
            }
            var action1 = cc.sequence(cc.moveTo(0, cc.v2(0, 0)), cc.delayTime(delayTime[i]), cc.moveTo(0.2, cc.v2(parentPos.x, parentPos.y)));
            var action2 = cc.sequence(cc.scaleTo(0, SCALE), cc.delayTime(delayTime[i]), cc.scaleTo(0.2, 1));
            var seq = cc.spawn(action1, action2);
            action.push(seq);
        }
        for (var i = 0; i < sizeCard; i++) {
            listCard.children[i].runAction(cc.sequence(action[i], cc.callFunc(() => {
                count++;
                if (count == sizeCard) {
                    listCard.position = cc.v2(3000, 0);
                    listCard.children.forEach(element => {
                        element.position = cc.v2(0, 0);
                        element.scale = 0.6;
                    });
                    // player.cardOnHandList.active = true;
                    if (card) {
                        player.addBocCard(card);
                        if(callBackHaPhom){
                            callBackHaPhom();
                        }
                    }
                }
            })));
        }
    },
    otherBocCardEffect(player, card) {
        var listCard = player.listCardEffect;
        listCard.position = cc.v2(0, 0);
        var count = 0;
        var self = this;
        var sizeCard = 1;
        var startPos = cc.v2(0, 0);
        var parent = player.cardOnHandList;
        var parentPos = parent.position;
        var delayTime = [];
        var action = [];
        for (var i = 0; i < sizeCard; i++) {
            delayTime.push(i * 0.1);
        }
        for (var i = 0; i < sizeCard; i++) {
            var space = SPACE1;
            if (i == 0) {
                space = 0;
            }
            var action1 = cc.sequence(cc.moveTo(0, cc.v2(0, 0)), cc.delayTime(delayTime[i]), cc.moveTo(0.2, cc.v2(parentPos.x, parentPos.y)));
            var action2 = cc.sequence(cc.scaleTo(0, SCALE), cc.delayTime(delayTime[i]), cc.scaleTo(0.2, SCALE));
            var seq = cc.spawn(action1, action2);
            action.push(seq);
        }
        for (var i = 0; i < sizeCard; i++) {
            listCard.children[i].runAction(cc.sequence(action[i], cc.callFunc(() => {
                count++;
                if (count == sizeCard) {
                    listCard.position = cc.v2(3000, 0);
                    listCard.children.forEach(element => {
                        element.position = cc.v2(0, 0);
                        element.scale = 0.6;
                    });
                    // player.cardOnHandList.active = true;
                }
            })));
        }
    },
    anCardEffect(card, playerBiAn, playerAn) {

    },
    otherAnCardEffect(card, playerBiAn, playerAn) {

    },
    chiaBaiEffect(player, sizeCard) {
        var listCard = player.listCardEffect;
        listCard.position = cc.v2(0, 0);
        var count = 0;
        var self = this;
        var startPos = cc.v2(0, 0);
        var parent = player.cardOnHandList;
        var parentPos = parent.position;
        var delayTime = [];
        var action = [];
        for (var i = 0; i < sizeCard; i++) {
            delayTime.push(i * 0.1);
        }
        for (var i = 0; i < sizeCard; i++) {
            var space = SPACE1;
            if (i == 0) {
                space = 0;
            }
            var action1 = cc.sequence(cc.moveTo(0, cc.v2(0, 0)), cc.delayTime(delayTime[i]), cc.moveTo(0.125, cc.v2(parentPos.x + CARD_WIDTH / 2 * (i + 1) + space * i, parentPos.y)));
            var action2 = cc.sequence(cc.scaleTo(0, SCALE), cc.delayTime(delayTime[i]), cc.scaleTo(0.125, 1));
            var seq = cc.spawn(action1, action2);
            action.push(seq);
        }
        for (var i = 0; i < sizeCard; i++) {
            listCard.children[i].runAction(cc.sequence(action[i], cc.callFunc(() => {
                count++;
                if (count == sizeCard) {
                    listCard.position = cc.v2(3000, 0);
                    listCard.children.forEach(element => {
                        element.position = cc.v2(0, 0);
                        element.scale = 0.6;
                    });
                    player.cardOnHandList.active = true;
                }
            })));
        }

    },
    otherPlayerChiaBaiEffect(player, sizeCard) {
        var listCard = player.listCardEffect;
        listCard.position = cc.v2(0, 0);
        var count = 0;
        var self = this;
        var startPos = cc.v2(0, 0);
        var parent = player.cardOnHandList;
        var parentPos = parent.position;
        var delayTime = [];
        var action = [];
        for (var i = 0; i < sizeCard; i++) {
            delayTime.push(i * 0.1);
        }
        for (var i = 0; i < sizeCard; i++) {
            var space = SPACE1;
            if (i == 0) {
                space = 0;
            }
            var action1 = cc.sequence(cc.moveTo(0, cc.v2(0, 0)), cc.delayTime(delayTime[i]), cc.moveTo(0.125, cc.v2(parentPos.x, parentPos.y)));
            var action2 = cc.sequence(cc.scaleTo(0, SCALE), cc.delayTime(delayTime[i]), cc.scaleTo(0.1, SCALE));
            var seq = cc.spawn(action1, action2);
            action.push(seq);
        }
        for (var i = 0; i < sizeCard; i++) {
            listCard.children[i].runAction(cc.sequence(action[i], cc.callFunc(() => {
                count++;
                if (count == sizeCard) {
                    listCard.position = cc.v2(3000, 0);
                    listCard.children.forEach(element => {
                        element.position = cc.v2(0, 0);
                        element.scale = 0.6;
                    });

                }
            })));
        }
    },
    guiBaiEffect() {

    },
    otherGuiBaiEffect() {

    },
};
module.exports = PhomEffect
