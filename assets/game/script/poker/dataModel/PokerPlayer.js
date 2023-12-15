var PokerLogic = require('PokerLogic');
var PokerCard = require('PokerCard');
var Utils = require('Utils');
var Linker = require('Linker');
var DataAccess = require('DataAccess');
cc.Class({
    extends: cc.Component,

    properties: {
        imagePlayer: cc.Sprite,
        namePlayer: cc.Label,
        moneyPlayer: cc.Label,
        cardOnHandList: cc.Node,
        itemCard: cc.Prefab,
        profileNode: cc.Node,
        intiveNode: cc.Node,
        timeCount: cc.ProgressBar,
        masterNode: cc.Node,
        hiddenCard: cc.Node,
        win: cc.Node,
        tien: cc.Node,
        score: cc.Node,
        userDialogName: cc.Label,
        userDialogId: cc.Label,
        userDialogAvatar: cc.Sprite,
        userDialogMoney: cc.Label,
        playerNumber: 0,
        avatarList: cc.SpriteAtlas,
        sitButton: cc.Node,
        itemChip: cc.Prefab,
        pokerAtlas: cc.SpriteAtlas,
        // Chat Feature
        chatToast: cc.Node,
        chatString: cc.Label,
        btnKick: cc.Node,
        profileDialog: cc.Node,
        emojiNode: cc.Animation
    },
    ctor() {

    },


    onLoad() {
        // this.sitButton.runAction(cc.repeatForever(cc.sequence(cc.moveTo(0.5, this.sitButton.x, this.sitButton.y + 10), cc.delayTime(0.7), cc.moveTo(0.5, this.sitButton.x, this.sitButton.y - 10))));
    },


    reset() {
        this.removeAllCard();
        this.showProfile(false);
        this.showInvite(true);
        this.showSit(false);
        this.showCardOnHand(true);
        //this.showTurnedCard(true);
        //this.show(true);
        this.showTime(false);
        this.showHiddenCard(false);
        this.showTien(false);
        this.showScore(false);
        this.showWin(false);
    },
    resetShowSit() {
        this.removeAllCard();
        this.showProfile(false);
        this.showInvite(false);
        this.showSit(true);
        this.showCardOnHand(true);
        //this.showTurnedCard(true);
        //this.show(true);
        this.showTime(false);
        this.showHiddenCard(false);
        this.showTien(false);
        this.showScore(false);
        this.showWin(false);
    },
    removeAllCard() {
        this.cardOnHandList.removeAllChildren();
        //this.turnedCardList.removeAllChildren();
    },
    showProfile(isShow = false) {
        this.profileNode.active = isShow;
    },
    showSit(isShow = false) {
        this.sitButton.active = isShow;
        this.sitButton.stopAllActions();
        if (isShow) {
            this.sitButton.runAction(cc.repeatForever(cc.sequence(cc.moveTo(0.5, this.sitButton.x, this.sitButton.y + 10), cc.delayTime(0.7), cc.moveTo(0.5, this.sitButton.x, this.sitButton.y - 10))));
        }

    },
    showInvite(isShow = false) {
        this.intiveNode.active = isShow;
    },
    showCardOnHand(isShow = false) {
        this.cardOnHandList.active = isShow;
    },
    // showTurnedCard(isShow = false) {
    //     this.turnedCardList.active = isShow;
    // },


    show(isShow = false) {
        this.node.active = isShow;
    },
    setProfile() {

    },
    createPlayer(player) {
        this.player = player;
        this.setProfileUi();
    },
    setProfileUi() {
        var name = this.player.viewName;
        if (name && name.length >= 8) name = name.substring(0, 8) + ".";
        this.namePlayer.string = name;
        if (this.player.avatarId === "no_image.gif") {
            this.player.avatarId = "1";
        }
        this.imagePlayer.spriteFrame = this.avatarList.getSpriteFrame('avatar (' + this.player.avatarId + ')'); //this.avatarList[(Number(this.player.avatarId)-1).toString()];
        this.moneyPlayer.string = Utils.Number.format(this.player.userMoney);
        // if (this.player.isMaster == 1) {
        //     this.masterNode.active = true;
        // } else {
        //     this.masterNode.active = false;
        // }
    },
    onChat(data, isEnCode) {
        if (data.error) {
            console.log(data.error);
            return;
        }
        if (data.message.includes("Clip") == false) {
            this.chatToast.active = true;
            if (isEnCode) {
                this.chatString.string = Utils.Decoder.decode(data.message);
            } else {
                this.chatString.string = data.message;
            }
        } else {
            var clip = cc.Global.findClip(data.message);
            this.emojiNode.node.active = true;
            this.emojiNode.addClip(clip, "default");
            this.emojiNode.play("default");
            var self = this;
            setTimeout(() => {
                self.emojiNode.node.active = false;
            }, 2000);
        }

        setTimeout(() => {
            if (!this.chatToast) {
                return;
            }
            this.chatToast.active = false;
        }, 2000);
    },

    onWinMessage(message) {
        if (!message) {
            return;
        }

        if (message == 'Thắng') {
            return;
        }

        setTimeout(() => {
            this.score.active = false;
        }, 5000);

        this.score.active = true;
        var scoreText = this.score.getChildByName("text").getComponent(cc.Label);
        scoreText.string = message;
    },
    showDialogInfo() {
        if (this.player.avatarId == "no_image.gif") {
            this.player.avatarId = "1";
        }
        var callback = function (message) {
            if (message.status == 1) {
                cc.js.addon(this.player, message);
            }
        }
        // Linker.Event.addEventListener(121001, callback, this);
        // Linker.Socket.send(CommonSend.getUserInfo(this.player.userId));
        DataAccess.Instance.requestUserData(this.player.userId);
        this.profileDialog.getComponent("ProfileDialog").targetPlayer = this;
        this.profileDialog.active = true;
    },

    showTime(isShow) {
        var self = this;
        this.timeCount.progress = 1;
        this.timeCount.node.active = isShow;
        if (isShow) {
            this.timeCount.node.stopAllActions();
            this.startCount = true;
            this.timeCount.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.016), cc.callFunc(() => {
                // cc.log("AAAAA");
                if (self.timeCount.progress > 0.0008333333) {
                    self.timeCount.progress = self.timeCount.progress - 0.0009;
                } else {
                    this.timeCount.node.stopAllActions();
                }
            }))));
        } else {
            this.timeCount.node.stopAllActions();
            this.startCount = false;
        }
        // cc.log("SHOW_TIME");
    },

    setPlayer(player) {
        this.player = player;
    },


    addCard(cardData, parent, isTouch = true, isVertical = false) {
        var card = cc.instantiate(this.itemCard);
        var bg = card.getChildByName('background');
        bg.width = 95;
        bg.height = 130;
        var script = card.getComponent('PokerCard');
        if (script) {
            script.fromServerValue(cardData.serverValue);
            script.reset();
            script.setTouch(isTouch);
        }
        if (isVertical) {
            card.x = 0;
        } else {
            card.y = 0;
        }
        parent.addChild(card);

    },

    findCard(card, parent) {
        for (var i = 0; i < parent.children.length; i++) {
            var script = parent.children[i].getComponent(PokerCard);
            if (script) {
                if (script.serverValue == card.serverValue) {

                    return i;
                }
            }
        }
        return -1;
    },
    removeCard(serverValue, parent) {
        serverValue.forEach((item) => {
            var removeIndex = this.findCard(item, parent);
            cc.log(removeIndex);
            if (removeIndex != -1) {
                parent.children[removeIndex].removeFromParent();
            }
        });
    },
    addCardPlayerOwner() {
        this.cardOnHandList.removeAllChildren();
        for (var i = 0; i < this.player.cardOwnerList.length; i++) {
            this.addCard(this.player.cardOwnerList[i], this.cardOnHandList, true, false);
            //console.log('*** card from parent when end game',this.cardOnHandList);
        }
    },
    addTurnedCardList() {
        this.turnedCardList.removeAllChildren();
        for (var i = 0; i < this.player.turnedCardList.length; i++) {
            this.addTurnedCard(this.player.turnedCardList[i], false);
        }
    },


    addTurnedCard(serverValue, index) {
        if (serverValue.length > 0 && serverValue) {
            var hang = cc.instantiate(this.hangContainer);
            var doLech = this.turnedCardList.getComponent('CardContainer').doLech;
            this.addCardAttack(serverValue, hang, false, index, doLech);
            this.turnedCardList.addChild(hang);

            if (doLech) {
                hang.x = hang.x + 20;
                this.turnedCardList.getComponent('CardContainer').doLech = false;
            } else {
                hang.x = hang.x - 20;
                this.turnedCardList.getComponent('CardContainer').doLech = true;
            }
            if (this.turnedCardList.childrenCount > 3) {
                for (var i = 0; i < this.turnedCardList.childrenCount - 3; i++) {
                    this.turnedCardList.removeChild(this.turnedCardList.children[i]);
                }
            }
        }
    },




    removeOwnerCard(serverValue) {
        this.removeCard(serverValue, this.cardOnHandList);
    },
    showHiddenCard(isShow) {
        this.hiddenCard.active = isShow;
    },
    sortMyCard(typeSort) {
        for (var i = 0; i < this.cardOnHandList.children.length; i++) {
            var script = this.cardOnHandList.children[i].getComponent(PokerCard);
            if (script) {
                var serverValue = this.player.cardOwnerList[i].serverValue;
                script.fromServerValue(serverValue);
                script.reset();
                script.setTouch(true);
                script.setLock(false);
            }
        }
        cc.log("LENGTH", this.player.cardOwnerList.length);


        this.cardOnHandList.children.forEach((element) => {
            element.y = 0;
        });

    },


    printData() {
        var data = {};
        data.playerCard = [];
        data.eatCard = [];
        this.player.cardOwnerList.forEach(element => {
            data.playerCard.push(element.serverValue);
        });

        cc.log(data);
    },
    grayCardEffect(parent) {
        parent.children.forEach(element => {
            element.getComponent(cc.Button).interactable = false;
            element.getChildByName("background").color = cc.Color.GRAY;
        })
    },
    playWinEffect(winPos, score, money) {
        //this.showWin(true);
        this.addCardPlayerOwner();
        this.setMoney(money, false);
    },
    setScore(score) {
        if (score > 0) {
            if (!this.score.active) {
                this.score.active = true;
            }
            var scoreText = this.score.getChildByName("text").getComponent(cc.Label);
            scoreText.string = score + " Điểm";
        } else {
            this.score.active = false;
        }

    },
    setMoney(money, isAnim = true) {
        if (!this.tien.active) {
            this.tien.active = true;

        }
        if (Number(money) > 0) {
            var moneyText = this.tien.getChildByName("thang").getComponent(cc.Label);
            moneyText.string = "+" + Utils.Number.format(money);
            if (!moneyText.node.active) {
                moneyText.node.active = true;

            }

            this.textEffect(moneyText.node, isAnim);

        } else {
            if (Number(money) < 0) {
                var moneyText = this.tien.getChildByName("thua").getComponent(cc.Label);
                moneyText.string = Utils.Number.format(money);
                if (!moneyText.node.active) {
                    moneyText.node.active = true;

                }

                this.textEffect(moneyText.node, isAnim);
            }

        }
        setTimeout(() => {
            if (!this.tien) {
                return;
            }
            this.tien.active = false;
        }, 5000);

    },
    textEffect(node, isAnim) {
        var self = this;
        node.stopAllActions();
        var correctPos = cc.v2(0, 30);
        var startPos = cc.v2(0, -100);
        node.position = startPos;
        node.active = true;
        var moveAction = cc.moveTo(0.3, correctPos);
        if (!isAnim) {
            node.runAction(cc.sequence(cc.fadeIn(0), moveAction));
        } else {
            node.runAction(cc.sequence(cc.fadeIn(0), moveAction, cc.delayTime(4), cc.fadeOut(0.1)), cc.callFunc(this.hideChot));
        }

    },
    showNodeEffect(node) {
        node.stopAllActions();
        node.setScale(0.3);
        node.runAction(cc.spawn([cc.scaleTo(0.2, 1).easing(cc.easeBackOut()), cc.fadeIn(0.2)]));
    },
    showScore(isShow) {
        if (isShow) {
            this.score.active = true;
        } else {
            this.score.active = false;
        }
    },
    showTien(isShow) {
        this.tien.children.forEach((item) => {
            item.active = false;
        })
        if (isShow) {
            this.tien.active = true;
        } else {
            this.tien.active = false;
        }
    },
    showWin(isShow) {
        if (isShow) {
            this.win.active = true;
        } else {
            this.win.active = false;
        }
        this.node.stopAllActions();
        this.win.children.forEach((item) => {
            item.active = false;
        })
    },

    banChip() {
        //var position=cc.find('Canvas/Poker/gameTable/totalMoney/bg/xx11').position;
        var delayTime = [];
        for (var i = 0; i < 15; i++) {
            delayTime.push(i * 0.1);
        }
        for (var i = 0; i < 15; i++) {
            var chip = cc.instantiate(this.itemChip);
            chip.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('icon_dt_nho' + (Math.floor(Math.random() * 5) + 1).toString());
            chip.position = this.hiddenCard.position;
            chip.x = chip.x + Math.floor(Math.random() * 35);
            chip.y = chip.y - 20 + Math.floor(Math.random() * 35);

            cc.find('Canvas').addChild(chip);
            chip.runAction(cc.sequence(cc.delayTime(delayTime[i]), cc.rotateBy(0.2, 720)));
            chip.runAction(cc.sequence(cc.delayTime(delayTime[i]), cc.moveTo(0.2, -56, 135), cc.callFunc(function (chip) {
                chip.destroy();
                chip.stopAllActions();
            }, this)));
        }

    },
    getViewName() {
        if (this.player) {
            return this.player.viewName;
        }

    },

});