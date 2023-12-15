// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Card = require('Card_poker');
cc.Class({
    extends: Card,

    properties: {
        backgroundCard: cc.Sprite,
        selectedCard: cc.Node,
        cardSprite : cc.SpriteAtlas,
    },
    fromPhomCard(pCard) {
        if(pCard && pCard.hasOwnProperty("serverValue")){
            this.serverValue = pCard.serverValue;
            this.rank = pCard.rank;
            this.type = pCard.type;
            this.isTakenCard = false;
            this.isLock = false;
            this.canTouch = false;
            this.isTurned = false;
            this.setType();
        }
    },
    fromRankType(pValue, pType) {
        this.rank = pValue;
        this.type = pType;
        this.isTakenCard = false;
        this.isLock = false;
        this.canTouch = false;
        this.isTurned = false;
        this.setType();
    },
    fromServerValue(serverValue) {
        this._super(serverValue);
        this.isTakenCard = false;
        this.isLock = false;
        this.canTouch = false;
        this.isTurned = false;
        this.setType();
    },
    setTouch(isTouch) {
        this.canTouch = isTouch;
    },
    setLock(isLock) {
        this.isLock = isLock;
    },

    setTurnedCard(isTurned) {
        this.isTurned = isTurned;
    },

    
    showSelectEffect(isShow) {
        this.selectedCard.active = isShow;
    },
    reset() {
        this.showSelectEffect(false);
    }
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

   

    // update (dt) {},
});
