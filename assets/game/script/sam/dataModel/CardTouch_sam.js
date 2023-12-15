var Linker = require('Linker');
var SamCard = require('SamCard');
cc.Class({
    extends: cc.Component,

    properties: {
    },


    start () {

    },
    touchEvent(event) {
        var card = this.node.getComponent(SamCard);
        var allCard=[];
        this.node.parent.getChildren().forEach(item => {
            allCard.push(item.getComponent(SamCard));
        });
        setTimeout(() => {
            if (card) {
                if (card.canTouch) {
                    if (Linker.SamController) {
                        Linker.SamController.samCardTouchEvent(card,allCard);
                    } else {
                        cc.log("No Handler");
                    }
                   
                    
                } else {
                    cc.log("Card can't Touch");
                }            
            }
        }, 50);
    }

    // update (dt) {},
});
