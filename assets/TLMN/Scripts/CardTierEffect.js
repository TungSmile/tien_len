export var CardTierEffect = cc.Class({
    extends: cc.Component,

    properties: {
        rankTitle: cc.Sprite,
        cardContainer: cc.Node,
        cardPrefab: cc.Prefab,
        titleList: [cc.SpriteFrame],
        cardContainerWinType: cc.Node,
        effectNode: cc.Node,
        baConHaiNode: cc.Node,
        toiTrangLabel: cc.Node
    },

    Init(cardData) {
        this.node.active = true;
        this.toiTrangLabel.active = false;
        // this.rankTitle.node.active = false;
        // this.rankTitle.node.parent.active = false;
        // this.effectNode.active = false;
        if (cardData.length == 2) {
            this.rankTitle.spriteFrame = this.titleList[0];
            this.ShowCardAtIndex([1, 2], cardData);
        } else if (cardData.length == 4) {
            this.rankTitle.spriteFrame = this.titleList[1];
            this.ShowCardAtIndex([0, 1, 2, 3], cardData);
        } else if (cardData.length == 6) {
            this.rankTitle.spriteFrame = this.titleList[2];
            this.ShowCardAtIndex([0, 1, 2, 3, 5, 6], cardData);
        } else if (cardData.length == 8) {
            this.rankTitle.spriteFrame = this.titleList[3];
            this.ShowCardAtIndex([0, 1, 2, 3, 4, 5, 6, 7], cardData);
        } else if (cardData.length == 3) {
            this.rankTitle.spriteFrame = this.titleList[5];
            this.Show3ConHai(cardData);
        }
        // var self = this;
        // cc.tween(this.rankTitle.node.parent).delay(0.75).set({scale: 2, active: true}).to(0.5, {scale: 1}).start();
        // cc.tween(this.rankTitle.node).delay(1).set({scale: 2, active: true}).to(0.5, {scale: 1}).call(() => {
        //     self.effectNode.active = true;
        // }).start();
    },

    ShowCardAtIndex(indexes, cardData) {
        this.cardContainer.active = true;
        this.baConHaiNode.active = false;
        this.cardContainerWinType.active = false;
        for (let i = 0, j = 0; i < cardData.length, j < this.cardContainer.children.length; ++j) {
            if (indexes.includes(j)) {
                //this.cardContainer.children[j].active = true;
                this.cardContainer.children[j].getComponent("PhomCard").fromPhomCard(cardData[i]);
                cc.tween(this.cardContainer.children[j]).delay(i * 0.25).set({
                    scale: 2,
                    active: true
                }).to(0.5, {
                    scale: 1
                }).start();
                ++i;
            } else {
                this.cardContainer.children[j].active = false;
            }
        }
        var self = this;
        cc.tween(this.node).delay(3.5).call(target => {
            target.active = false;
            self.cardContainer.children.forEach(item => item.active = false);
        }).start();
    },

    Show3ConHai(cardData) {
        this.baConHaiNode.active = true;
        this.cardContainer.active = false;
        this.cardContainerWinType.active = false;
        for (let i = 0, j = 0; i < cardData.length, j < this.baConHaiNode.children.length; ++j) {
            //this.cardContainer.children[j].active = true;
            this.baConHaiNode.children[j].getComponent("PhomCard").fromPhomCard(cardData[i]);
            cc.tween(this.baConHaiNode.children[j]).delay(i * 0.25).set({
                scale: 2,
                active: true
            }).to(0.5, {
                scale: 1
            }).start();
            ++i;
        }

        var self = this;
        cc.tween(this.node).delay(3.5).call(target => {
            target.active = false;
            self.baConHaiNode.children.forEach(item => item.active = false);
        }).start();
    },

    InitToiTrang(cardList, winType) {
        this.node.active = true;
        this.rankTitle.node.parent.active = true;
        this.rankTitle.spriteFrame = this.titleList[4];
        this.cardContainer.active = false;
        this.cardContainerWinType.active = true;
        for (let i = 0; i < cardList.length; ++i) {
            var card = cc.instantiate(this.cardPrefab);
            card.getComponent("PhomCard").fromPhomCard(cardList[i]);
            this.cardContainerWinType.addChild(card);
        }

        var self = this;
        cc.tween(this.node).delay(3.5).call(target => {
            target.active = false;
            self.cardContainerWinType.removeAllChildren(true);
            self.toiTrangLabel.active = false;
        }).start();

        this.toiTrangLabel.active = true;
        var nameToiTrang = "";
        switch (winType) {
            case 7:
                nameToiTrang = "Tứ Quý";
                break;
            case 8:
                nameToiTrang = "4 Đôi Thông 3 Bích";
                break;
            case 9:
                nameToiTrang = "5 Đôi Thông";
                break;
            case 10:
                nameToiTrang = "6 Đôi";
                break;
            case 11:
                nameToiTrang = "Sảnh Rồng";
                break;
            default:
                nameToiTrang = "";
                break;
        }
        this.toiTrangLabel.getComponent(cc.Label).string = nameToiTrang;
    }
});