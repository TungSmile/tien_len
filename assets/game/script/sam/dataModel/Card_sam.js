var Card = require('Card_sam');
cc.Class({
    extends: cc.Component,

    properties: {
    },
    fromRankType(rank, type) {
        this.rank = rank;
        this.type = type;
        if (this.rank == 12) {

            this.serverValue = (type) * 13 + 1;
        } else {

            this.serverValue = (type) * 13 + this.rank + 2;
        }
        this.i = 0;
        this.j = 0;
    },
    fromServerValue(serverValue) {
        this.setServerValue(serverValue);
        this.i = 0;
        this.j = 0;
    },

    start() {

    },
    setServerValue(serverValue) {
        this.serverValue = serverValue;
        this.rank  = parseInt((serverValue - 1) % 13 + 1);
        if(this.rank==1){
            this.rank=14;
        }else if(this.rank==2){
            this.rank=15;
        }
        var temp = parseInt((serverValue - 1) / 13 + 1);
        //cc.log(temp);
        switch (temp) {
            case 1:
                this.type = 2;
                break;

            case 2:
                this.type = 1;
                break;

            case 3:
                this.type = 3;
                break;

            case 4:
                this.type = 4;
                break;
            default:
                break;
        }
        if (Number(this.serverValue) < 0) {
            this.rank = -1;
            this.type = -1;
            this.serverValue = -1;
        }
    },
    copy(card) {
        this.serverValue = card.serverValue;
        this.rank = card.rank;
        this.type = card.type;
    },
    clone() {
        var clone = new Card();
        clone.serverValue = this.serverValue;
        clone.rank = this.rank;
        clone.type = this.type;
        clone.i = this.i;
        clone.j = this.j;
        return clone;
    },
    setType() {
        var name = "card_face_down";
        if (this.type != -1 && this.rank != -1 && this.serverValue != -1) {
            if(this.rank==14){
                name = 1 + "";
            }else if(this.rank==15){
                name = 2 + "";
            }else{
                name = this.rank + "";
            }
            
            switch (this.type) {
                case 1: {
                    name = name + "b";
                    break;
                }
                case 2: {
                    name = name + "t";
                    break;
                }
                case 3: {
                    name = name + "r";
                    break;
                }
                case 4: {
                    name = name + "c";
                    break;
                }
            }
        } else {

        }
        this.backgroundCard.spriteFrame = this.cardSprite.getSpriteFrame(name);
    },
    

    // update (dt) {},
});
