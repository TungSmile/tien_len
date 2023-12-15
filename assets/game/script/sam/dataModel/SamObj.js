// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var PhomCard = require('PhomCard');
cc.Class({
    extends: cc.Component,

    properties: {
        phomContainer: cc.Node,
        cardPrefab: cc.Prefab,
    },
    ctor: function () {
        this.cardList = [];
        this.type;
        this.takenCard;
        this.playerId;
        this.id;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        
    },
    

    start() {

    },
    fromCardListType(cardList, type) {
        this.cardList = cardList;
        this.type = type;
        this.phomContainer.setAnchorPoint(this.type);
        this.createPhom();
    },
    fromPhomObj(phomObj) {
        this.cardList = phomObj.cardList;
        this.type = phomObj.cardList;
        this.playerId = phomObj.playerId;
        this.id = phomObj.id;
        this.createPhom();
    },
    getCardList() {
        return this.cardList;
    },
    setCardList(cardList) {
        this.cardList = cardList;
    },
    getMinCard() {
        return this.cardList[0]
    },
    getMaxCard() {
        return this.cardList[this.cardList.length -1]
    },
    getType() {
        return this.type;
    },
    setType(type) {
        this.type = type;
    },
    getTakenCard() {
        return this.takenCard;
    },
    setTakenCard(takenCard) {
        this.takenCard = takenCard;
    },
    getPlayerId() {
        return this.playerId;
    },
    setPlayerId(playerId) {
        this.playerId = playerId;
    },
    getId() {
        return this.id;
    },
    setId(id) {
        this.id = id;
    },
    createPhom() {
        this.phomContainer.removeAllChildren();
        for (var i = 0; i < this.cardList.length; i++) {
            if (this.takenCard && this.takenCard.serverValue == this.cardList[i].serverValue) {
                this.addCard(this.cardList[i], this.phomContainer, false, true, false);
            } else {
                this.addCard(this.cardList[i], this.phomContainer, false, false, false);
            }
            
        }

    },
    addCard(cardData, parent, isTouch = true, isTaken = false, isVertical = false) {
        var card = cc.instantiate(this.cardPrefab);
        card.width = 107;
        card.height = 144;
        var script = card.getComponent(PhomCard);
        if (script) {
            script.fromServerValue(cardData.serverValue);
            script.reset();
            script.setTouch(isTouch);
            script.setTakenCard(isTaken);
            if (isTaken == true) {
                script.setLock(true);

            } else {
                script.setLock(false);
            }
        }
        if (isVertical) {
            card.x = 0;
        } else {
            card.y = 0;
        }
        parent.addChild(card);

    },

    // update (dt) {},
});
