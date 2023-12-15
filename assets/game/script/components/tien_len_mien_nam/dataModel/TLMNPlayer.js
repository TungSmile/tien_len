// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Linker = require('Linker');
var TLMNConstant = require('TLMNConstant');
var Utils = require('Utils');
var TQUtils = require('TQUtil');
var CommonSend = require('CommonSend');
var TLMNLogic = require('TLMNLogic');
var DataAccess = require('DataAccess');
var ProfileDialog = require('ProfileDialog');
var NewAudioManager = require('NewAudioManager');
var Constant = require('Constant');

var posCard = [-50, -25, 0, 25, 50];

cc.Class({
    extends: cc.Component,

    properties: {
        cardOnTable: cc.Node,
        imagePlayer: cc.Sprite,
        namePlayer: cc.Label,
        moneyPlayer: cc.Label,
        scoreEndGame: cc.Label,
        cardOnHandList: cc.Node,
        turnedCardList: cc.Node,
        listCardEnd: cc.Node,
        itemCard: cc.Prefab,
        profileNode: cc.Node,
        intiveNode: cc.Node,
        readyState: cc.Node,
        timeCount: cc.ProgressBar,
        masterNode: cc.Node,
        hiddenCard: cc.Node,
        listCardEffect: cc.Node,
        win: cc.Node,
        tien: cc.Node,
        hang: cc.Node,
        avatarList: {
            type: cc.SpriteFrame,
            default: []
        },
        // Chat Feature
        chatToast: cc.Node,
        chatString: cc.Label,
        totalCard: cc.Label,
        nodeTotalCard: cc.Node,
        avatarList: cc.SpriteAtlas,
        btnKick: cc.Node,
        maxTimeAuto: {
            readonly: true,
            type: cc.Float,
            default: 9
        },
        timeCounter: 0,
        emojiNode: cc.Animation,
        turnEffect: cc.Node,
        timeSprite: [cc.SpriteFrame],
        textLevel: cc.Label,
        tailNode: cc.Node,
        profileDialog: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.preX = -1;
        this.preY = -1;


    },

    start() {

    },

    update(dt) {
        //update time as tick
        if (this.startCount == true) {
            this.timeCounter -= dt;
            if (this.timeCounter <= 0) {
                this.timeCount.progress = 0;
                this.timeCount.node.stopAllActions();
                this.startCount = false;
            } else {
                this.timeCount.progress = (this.timeCounter / this.maxTimeAuto);
                var tailProgress = 1 - this.timeCount.progress;
                this.tailNode.angle = -1 * (tailProgress * 360);
                if (this.timeCount.progress <= 0.2 && this.isPlaySound == true) {
                    NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON.GAN_HET_THOI_GIAN, 1, false, false);
                    this.isPlaySound = false;
                }

                // if (this.timeCount.progress > 0.8) {
                //     this.timeCount.node.getComponent(cc.Sprite).spriteFrame = this.timeSprite[0];
                // } else if (this.timeCount.progress > 0.5 && this.timeCount.progress <= 0.8) {
                //     this.timeCount.node.getComponent(cc.Sprite).spriteFrame = this.timeSprite[1];
                // } else if (this.timeCount.progress <= 0.5) {
                //     this.timeCount.node.getComponent(cc.Sprite).spriteFrame = this.timeSprite[2];
                // }
            }
        }
    },

    reset() {
        this.removeAllCard();
        this.showProfile(false);
        this.showInvite(true);
        this.showCardOnHand(true);
        this.showTurnedCard(true);
        // this.showTakenCard(true);
        // this.showPhom(true);
        this.show(true);
        this.isReady(false);
        this.showTime(false);
        this.showHiddenCard(false);
        this.showTien(false);
        // this.showScore(false);
        this.showWin(false);
        this.listCardEnd.removeAllChildren();
    },
    removeAllCard() {
        this.cardOnHandList.removeAllChildren();
        // this.takenCardList.removeAllChildren();
        this.turnedCardList.removeAllChildren();
        // this.phomList.removeAllChildren();
    },
    removeOwnerCard(serverValueList) {
        for (var i = 0; i < this.cardOnHandList.children.length; i++) {
            // cc.log("PrePos: ", this.cardOnHandList.children[i].getPosition());
            // cc.log("LastPos: ", this.cardOnHandList.parent.parent.convertToNodeSpaceAR(this.cardOnHandList.parent.parent.convertToWorldSpace(this.cardOnHandList.children[i].getPosition())));
        }
        this.removeCard(serverValueList, this.cardOnHandList);
    },
    findCard(card, parent) {
        for (var i = 0; i < parent.children.length; i++) {
            var script = parent.children[i].getComponent('PhomCard');
            if (script) {
                if (script.serverValue == card.serverValue) {

                    return i;
                }
            }
        }
        return -1;
    },
    removeCard(serverValueList, parent) {
        for (var i = 0; i < serverValueList.length; i++) {
            var removeIndex = this.findCard(serverValueList[i], parent);
            cc.log(removeIndex);
            if (removeIndex != -1) {
                parent.children[removeIndex].removeFromParent();
            }
        }
        // var removeIndex = this.findCard(serverValue, parent);
        // cc.log(removeIndex);
        // if (removeIndex != -1) {
        //     parent.children[removeIndex].removeFromParent();
        // }

    },
    showProfile(isShow = false, blur) {
        this.profileNode.active = isShow;
        if (blur) {
            this.blurPlayer();
        } else {
            this.notBlurPlayer();
        }
    },
    blurPlayer: function () {
        this.profileNode.opacity = 255;
    },
    notBlurPlayer: function () {
        this.profileNode.opacity = 255;
    },
    showInvite(isShow = false) {
        this.intiveNode.active = isShow;
    },
    showCardOnHand(isShow = false) {
        this.cardOnHandList.active = isShow;
    },
    showTurnedCard(isShow = false) {
        this.turnedCardList.active = isShow;
    },
    showTakenCard(isShow = false) {
        this.takenCardList.active = isShow;
    },
    showPhom(isShow = false) {
        this.phomList.active = isShow;
    },
    show(isShow = false) {
        this.node.active = isShow;
    },
    // showTotalCard(isShow){
    //     this.node.getChildByName('totalCard').active = isShow;
    // },

    createPlayer(player) {
        this.player = player;
        this.setProfileUi();
        if (player.socay) {
            this.setTotalCard(player.socay);
        }
        this.textLevel.string = player.level;
    },
    setProfileUi() {
        var name = this.player.viewName;
        if (name.length >= 8) name = name.substring(0, 10) + ".";
        this.namePlayer.string = name;
        //this.moneyPlayer.string = Utils.Number.format(this.player.userMoney);
        this.moneyPlayer.string = TQUtils.abbreviate(this.player.userMoney);
        
        this.scoreEndGame.string = "0";
        //        this.totalCard.string = "";
        if (this.player.avatarId == "no_image.gif") {
            this.player.avatarId = "1";
        }       
        this.imagePlayer.spriteFrame = this.avatarList.getSpriteFrame('avatar (' + this.player.avatarId + ')'); //this.avatarList[(Number(this.player.avatarId)-1).toString()];
        this.scoreEndGame.node.parent.active = false;
        if (this.player.isMaster == 1) {
            this.masterNode.active = true;
        } else {
            this.masterNode.active = false;
        }

        if (this.player.state == 1 && this.player.isMaster != 1) {
            this.readyState.active = true;
        } else {
            this.readyState.active = false;
        }
    },
    setTotalCard(value) {
        this.totalCard.string = value;
    },
    resetTotalCard() {
        this.totalCard.string = "";
    },

    showNodeTotalCard(isShow) {
        this.nodeTotalCard.active = isShow;
    },

    showTotalCard(isShow) {
        cc.log("IS SHOW TOTAL CARD: ", isShow);
        this.totalCard.node.active = isShow;
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
    getViewName() {
        if (this.player) {
            return this.player.viewName;
        }
    },

    isReady(isReady = false) {
        this.readyState.active = isReady;
    },

    showBoLuot(isBoLuot = true) {
        cc.log("DA BO LUOT");
        var self = this;
        if (isBoLuot) {
            this.win.active = true;
            this.win.getChildByName('boluot').zIndex = 1000;
            this.win.getChildByName('boluot').active = true;
            this.win.getChildByName('boluot').getComponent(cc.Animation).play();
            this.imagePlayer.node.opacity = 155;
            cc.log(this.win.getChildByName('boluot'));
        } else {
            this.win.active = false;
            this.win.getChildByName('boluot').active = false;
            this.win.getChildByName('boluot').getComponent(cc.Animation).stop();
            this.imagePlayer.node.opacity = 255;
        }

        // var callFun = cc.callFunc(function () {
        //     self.win.getChildByName('boluot').active = false;
        // })
        //this.win.runAction(cc.sequence(cc.delayTime(0.5), callFun));
    },

    showTime(isShow) {
        var self = this;
        this.timeCount.progress = 1;
        this.timeCount.node.active = isShow;
        this.tailNode.active = isShow;
        if (isShow) {
            this.timeCounter = this.maxTimeAuto;
            this.startCount = true;
            if (this.player.userId == Linker.userData.userId) {
                this.isPlaySound = true;
            }
        } else {
            this.timeCount.node.stopAllActions();
            this.startCount = false;
        }
        // cc.log("SHOW_TIME");
    },
    setPlayer(player) {
        this.player = player;
    },

    random(min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    },
    randPos() {
        var rand = this.random(0, 100);
        if (rand < 20) rand = posCard[0];
        else if (rand >= 20 && rand < 40) rand = posCard[1];
        else if (rand >= 40 && rand < 60) rand = posCard[2];
        else if (rand >= 60 && rand < 80) rand = posCard[3];
        else if (rand >= 80 && rand < 100) rand = posCard[4];
        // else if(rand>=100 && rand<120) rand = posCard[5];
        // else if(rand>=120 && rand<140) rand = posCard[6];
        return rand;
    },
    sort(list) {
        for (var i = 0; i < list.length; i++) {
            for (var j = i + 1; j < list.length; j++) {
                if (list[j].rank < list[i].rank) {
                    var temp = list[j];
                    list[j] = list[i];
                    list[i] = temp;
                }
            }
        }
        if (list[0].rank == 1) {
            var listTmp = [];
            for (var j = 1; j < list.length; j++) {
                listTmp.push(list[j]);
            }
            listTmp.push(list[0]);
            return listTmp;
        }
        return list;
    },
    addCardDanh(cardData, parent, containerCard, isTouch = true, isTaken = false, isVertical = false) {
        cc.log('LIST CARD DATA: ', cardData);
        cardData = this.sort(cardData);
        for (var i = 0; i < cardData.length; i++) {
            var card = cc.instantiate(this.itemCard);
            card.width = 107;
            card.height = 144;
            var script = card.getComponent('PhomCard');
            if (script) {
                script.fromServerValue(cardData[i].serverValue);
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
            containerCard.addChild(card);
        }

        var x = this.randPos();
        var y = this.randPos();
        if (this.cardOnTable.children.length == 0) containerCard.setPosition(0, 0);
        else containerCard.setPosition(x, y);
        if (this.cardOnTable.children.length != 0) {
            for (var i = 0; i < this.cardOnTable.children.length; i++) {
                for (var j = 0; j < this.cardOnTable.children[i].children.length; j++) {
                    this.cardOnTable.children[i].children[j].getChildByName('background').color = cc.Color.GRAY;
                }
            }
        }
        parent.addChild(containerCard);
        cc.log("CARD ON TABLE: ", this.cardOnTable);
    },

    AddCardDanh2(cardData, parent, containerCard, isTouch = true, isTaken = false, isVertical = false) {
        cc.log('LIST CARD DATA: ', cardData);
        var dataCard = this.sort(cardData);

        for (var i = 0; i < dataCard.length; i++) {
            var card = cc.instantiate(this.itemCard);
            card.width = 107;
            card.height = 144;
            var script = card.getComponent('PhomCard');
            if (script) {
                script.fromServerValue(dataCard[i].serverValue);
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
            containerCard.addChild(card);
        }

        var x = this.randPos();
        var y = this.randPos();
        if (this.cardOnTable.children.length == 0) containerCard.setPosition(0, 0);
        //else containerCard.setPosition(x, y);

        cc.tween(containerCard).to(0.1, {
            position: cc.v2(x, y)
        }, {
            easing: "smooth"
        }).call(() => {
            containerCard.children.forEach((card, index) => {
                card.getComponent("PhomCard").PlaceOnTable(card.position, index * 0.05);
            })
        }).start();

        if (this.cardOnTable.children.length != 0) {
            for (var i = 0; i < this.cardOnTable.children.length; i++) {
                for (var j = 0; j < this.cardOnTable.children[i].children.length; j++) {
                    this.cardOnTable.children[i].children[j].getChildByName('background').color = cc.Color.GRAY;
                }
            }
        }

        parent.addChild(containerCard);
        cc.log("CARD ON TABLE: ", this.cardOnTable);
    },
    addCardDanhMe(cardData, parent, containerCard, pos, isTouch = true, isTaken = false, isVertical = false) {
        cc.log('LIST CARD DATA: ', cardData);
        cardData = this.sort(cardData);
        var lengthList = cardData.length;
        for (var i = 0; i < cardData.length; i++) {
            var card = cc.instantiate(this.itemCard);
            card.width = 115;
            card.height = 168;
            var script = card.getComponent('PhomCard');
            if (script) {
                script.fromServerValue(cardData[i].serverValue);
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
            containerCard.addChild(card);
        }

        var x;
        var y;
        do {
            x = this.randPos();
            y = this.randPos();
        } while (x == this.preX && y == this.preY);

        if (this.cardOnTable.children.length == 0) {
            x = 0;
            y = 0;
        }
        this.preX = x;
        this.preY = y;
        var _move = cc.moveTo(0.2, cc.v2(x, y));

        if (pos != null) {
            containerCard.setPosition(this.cardOnHandList.parent.parent.convertToNodeSpaceAR(this.cardOnHandList.parent.convertToWorldSpace(this.cardOnHandList.children[pos].getPosition())));
        } else containerCard.setPosition(0, 0);
        // containerCard.setPosition(this.cardOnHandList.parent.parent.convertToNodeSpaceAR(this.cardOnHandList.parent.convertToWorldSpace(this.cardOnHandList.children[pos].getPosition())));
        containerCard.runAction(_move);
        // if(this.cardOnTable.children.length == 0) containerCard.setPosition(0, 0);
        // else containerCard.setPosition(x, y);
        if (this.cardOnTable.children.length != 0) {
            for (var i = 0; i < this.cardOnTable.children.length; i++) {
                for (var j = 0; j < this.cardOnTable.children[i].children.length; j++) {
                    this.cardOnTable.children[i].children[j].getChildByName('background').color = cc.Color.GRAY;
                }
            }
        }
        parent.addChild(containerCard);
        cc.log("CARD ON TABLE: ", this.cardOnTable);
    },

    AddCardDanhMe2(cardData, parent, containerCard, pos, isTouch = true, isTaken = false, isVertical = false) {
        var dataCard = this.sort(cardData);
        for (var i = 0; i < dataCard.length; i++) {
            var card = cc.instantiate(this.itemCard);
            card.width = 110;
            card.height = 160;
            var script = card.getComponent('PhomCard');
            if (script) {
                script.fromServerValue(dataCard[i].serverValue);
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
            containerCard.addChild(card);
        }

        var x;
        var y;
        do {
            x = this.randPos();
            y = this.randPos();
        } while (x == this.preX && y == this.preY);

        if (this.cardOnTable.children.length == 0) {
            x = 0;
            y = 0;
        }

        this.preX = x;
        this.preY = y;

        if (pos != null) {
            containerCard.setPosition(this.cardOnHandList.parent.parent.convertToNodeSpaceAR(this.cardOnHandList.parent.convertToWorldSpace(this.cardOnHandList.children[pos].getPosition())));
        } else containerCard.setPosition(0, 0);

        //containerCard.setPosition(x, y);
        cc.tween(containerCard).to(0.1, {
            position: cc.v2(x, y)
        }, {
            easing: "smooth"
        }).call(() => {
            containerCard.children.forEach((card, index) => {
                card.getComponent("PhomCard").PlaceOnTable(card.position, index * 0.1);
            })
        }).start();


        if (this.cardOnTable.children.length != 0) {
            for (var i = 0; i < this.cardOnTable.children.length; i++) {
                for (var j = 0; j < this.cardOnTable.children[i].children.length; j++) {
                    this.cardOnTable.children[i].children[j].getChildByName('background').color = cc.Color.GRAY;
                }
            }
        }

        parent.addChild(containerCard);
        cc.log("CARD ON TABLE: ", this.cardOnTable);
    },

    addCard(cardData, parent, isTouch = true, isTaken = false, isVertical = false) {
        cc.log('CARD DATA: ', cardData);
        var card = cc.instantiate(this.itemCard);
        // card.
        if (parent == this.listCardEnd) {
            card.width = 80;
            card.height = 105;
        } else {
            card.width = 117;
            card.height = 167;
        }
        var script = card.getComponent('PhomCard');
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

        card.setPosition(0, 0);
        if (parent.getComponent(cc.Layout)) parent.addChild(card);
        else {
            var crrIndex = parent.children.length;
            parent.addChild(card);
            card.x = crrIndex * 45;
        }
        cc.log("CARD ON TABLE: ", this.cardOnTable);
    },

    addLastTurnCard(serverValue, containerCard, isTouch, isTaken, isVertical) {
        var cardData = serverValue;
        cc.log('LIST CARD DATA: ', cardData);
        cardData = this.sort(cardData);
        for (var i = 0; i < cardData.length; i++) {
            var card = cc.instantiate(this.itemCard);
            card.width = 107;
            card.height = 144;
            var script = card.getComponent('PhomCard');
            if (script) {
                script.fromServerValue(cardData[i].serverValue);
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
            containerCard.addChild(card);
        }

        // var x = this.randPos();
        // var y = this.randPos();
        // if(this.cardOnTable.children.length == 0) containerCard.setPosition(0, 0);
        containerCard.setPosition(0, 0);
        if (this.cardOnTable.children.length != 0) {
            for (var i = 0; i < this.cardOnTable.children.length; i++) {
                for (var j = 0; j < this.cardOnTable.children[i].children.length; j++) {
                    this.cardOnTable.children[i].children[j].getChildByName('background').color = cc.Color.GRAY;
                }
            }
        }
        this.cardOnTable.addChild(containerCard);
        cc.log("CARD ON TABLE: ", this.cardOnTable);
    },

    addTurnedCard(serverValue, containerCard, isTaken = false) {
        this.AddCardDanh2(serverValue, this.cardOnTable, containerCard, false, isTaken);
    },
    addTurnedCardMe(serverValue, containerCard, pos, isTaken = false) {
        this.AddCardDanhMe2(serverValue, this.cardOnTable, containerCard, pos, false, isTaken);
    },
    addCardPlayerOwner() {
        this.cardOnHandList.removeAllChildren();
        for (var i = 0; i < this.player.cardOwnerList.length; i++) {
            this.addCard(this.player.cardOwnerList[i], this.cardOnHandList, true, false);
        }

        //set index card

    },
    addCardPlayerOwner2(cardOwnerList, player) {
        if (this.player) {
            this.player.cardOwnerList = cardOwnerList;
        } else {
            this.player = player;
            this.player.cardOwnerList = cardOwnerList;
        }
        this.cardOnHandList.removeAllChildren();
        //this.cardOnHandList.active = true;
        for (var i = 0; i < cardOwnerList.length; i++) {
            this.addCard(cardOwnerList[i], this.cardOnHandList, true, false);
        }
    },
    showListCardEnd() {
        cc.log("TEST SHOW CARD END: ", this.player.cardList);
        this.listCardEnd.removeAllChildren();

        for (var i = 0; i < this.player.cardList.length; i++) {
            if (this.player.cardList[i].rank > 0) {
                this.addCard(this.player.cardList[i], this.listCardEnd, true, false);
            }
        }

        var exclude = TLMNLogic.checkHeo(this.listCardEnd.children);
        //TLMNLogic.check3DoiThong2(this.listCardEnd.children, exclude);
    },

    showHiddenCard(isShow) {
        this.hiddenCard.active = isShow;
    },


    grayCardEffect(parent) {
        parent.children.forEach(element => {
            element.getComponent(cc.Button).interactable = false;
            element.getChildByName("background").color = cc.Color.GRAY;
        })
    },
    playWinEffect(player, winType, money) {
        var self = this;
        this.showWin(true);
        this.showTien(true);
        if (winType == TLMNConstant.TYPE_WIN.NORMAL) {
            var thang = self.win.getChildByName("thang");
            thang.active = true;
            if (thang.getComponent(cc.Animation)) {
                thang.getComponent(cc.Animation).play();
            }
            var seq = cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(0.3, 0.6),
                    cc.scaleTo(0.3, 1)
                )
            )
            //thang.runAction(seq);


            if (Number(money) > 0) {
                var addCoin = self.tien.getChildByName("thang");
                var addCoinLb = addCoin.getComponent(cc.Label);
                addCoinLb.string = "+" + Utils.Number.format(money);
                addCoin.active = true;
            } else {
                var addCoin = self.tien.getChildByName("thua");
                var addCoinLb = addCoin.getComponent(cc.Label);
                addCoinLb.string = Utils.Number.format(money);
                addCoin.active = true;
            }

        } else if (Number(winType) > 0) {
            var toitrang = self.win.getChildByName("toitrang");
            if (Number(winType) == 7) {
                toitrang = self.win.getChildByName("tuquy");
            }
            if (Number(winType) == 8) {
                toitrang = self.win.getChildByName("bondoithong");
            }
            if (Number(winType) == 9) {
                toitrang = self.win.getChildByName("namdoithong");
            }
            if (Number(winType) == 10) {
                toitrang = self.win.getChildByName("saudoithong");
            }
            if (Number(winType) == 11) {
                toitrang = self.win.getChildByName("sanhrong");
            }

            toitrang.active = true;
            var seq = cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(0.3, 0.6),
                    cc.scaleTo(0.3, 1)
                )
            )
            toitrang.runAction(seq);

            if (Number(money) > 0) {
                var addCoin = self.tien.getChildByName("thang");
                var addCoinLb = addCoin.getComponent(cc.Label);
                addCoinLb.string = "+" + Utils.Number.format(money);
                addCoin.active = true;
            } else {
                var addCoin = self.tien.getChildByName("thua");
                var addCoinLb = addCoin.getComponent(cc.Label);
                addCoinLb.string = Utils.Number.format(money);
                addCoin.active = true;
            }
        }
        if (winType == TLMNConstant.TYPE_WIN.CHAT_TU_QUY_WIN) {
            var thang = self.win.getChildByName("thang");
            thang.active = true;
            var seq = cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(0.3, 0.6),
                    cc.scaleTo(0.3, 1)
                )
            )
            thang.runAction(seq);

            if (Number(money) > 0) {
                var addCoin = self.tien.getChildByName("thang");
                var addCoinLb = addCoin.getComponent(cc.Label);
                addCoinLb.string = "+" + Utils.Number.format(money);
                addCoin.active = true;
            } else {
                var addCoin = self.tien.getChildByName("thua");
                var addCoinLb = addCoin.getComponent(cc.Label);
                addCoinLb.string = Utils.Number.format(money);
                addCoin.active = true;
            }
        }
        // this.setMoney(money, false);
    },
    playLoseEffect(player, winType, money) {
        var self = this;
        this.showWin(true);
        this.showTien(true);
        if (winType == TLMNConstant.TYPE_WIN.NORMAL) {
            var thua = self.win.getChildByName("thua");
            thua.active = true;
            var seq = cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(0.3, 0.6),
                    cc.scaleTo(0.3, 1)
                )
            )
            //thua.runAction(seq);

            if (Number(money) > 0) {
                var addCoin = self.tien.getChildByName("thang");
                var addCoinLb = addCoin.getComponent(cc.Label);
                addCoinLb.string = "+" + Utils.Number.format(money);
                addCoin.active = true;
            } else {
                var addCoin = self.tien.getChildByName("thua");
                var addCoinLb = addCoin.getComponent(cc.Label);
                addCoinLb.string = Utils.Number.format(money);
                addCoin.active = true;
            }
        } else if (winType == TLMNConstant.TYPE_WIN.TOI_TRANG_WIN) {
            var cong = self.win.getChildByName("cong");
            cong.active = true;
            var seq = cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(0.3, 0.6),
                    cc.scaleTo(0.3, 1)
                )
            )
            cong.runAction(seq);

            if (Number(money) > 0) {
                var addCoin = self.tien.getChildByName("thang");
                var addCoinLb = addCoin.getComponent(cc.Label);
                addCoinLb.string = "+" + Utils.Number.format(money);
                addCoin.active = true;
            } else {
                var addCoin = self.tien.getChildByName("thua");
                var addCoinLb = addCoin.getComponent(cc.Label);
                addCoinLb.string = Utils.Number.format(money);
                addCoin.active = true;
            }
        } else if (winType == TLMNConstant.TYPE_WIN.CHAT_TU_QUY_WIN) {
            var thua = self.win.getChildByName("thua");
            thua.active = true;
            var seq = cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(0.3, 0.6),
                    cc.scaleTo(0.3, 1)
                )
            )
            thua.runAction(seq);

            if (Number(money) > 0) {
                var addCoin = self.tien.getChildByName("thang");
                var addCoinLb = addCoin.getComponent(cc.Label);
                addCoinLb.string = "+" + Utils.Number.format(money);
                addCoin.active = true;
            } else {
                var addCoin = self.tien.getChildByName("thua");
                var addCoinLb = addCoin.getComponent(cc.Label);
                addCoinLb.string = Utils.Number.format(money);
                addCoin.active = true;
            }
        }
    },

    showMoneyFighten(money) {
        var self = this;
        this.showTien(true);
        var addCoin = self.tien.getChildByName("thang");
        var addCoinLb = addCoin.getComponent(cc.Label);
        addCoinLb.string = "+" + Utils.Number.format(money);
        addCoin.active = true;

        var hide = function () {
            addCoin.active = false;
            // this.showTien(false);
        }

        this.tien.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(hide)));
    },
    showMoneyBeFighten(money) {
        var self = this;
        this.showTien(true);
        var subCoin = self.tien.getChildByName("thua");
        var subCoinLb = subCoin.getComponent(cc.Label);
        subCoinLb.string = "-" + Utils.Number.format(money);
        subCoin.active = true;

        var hide = function () {
            subCoin.active = false;
            // this.showTien(false);
        }

        this.tien.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(hide)));
    },

    showEffectCong(money) {
        this.showWin(true);
        this.showTien(true);
        var self = this;
        var cong = self.win.getChildByName("cong");
        cong.active = true;
        var seq = cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.3, 0.6),
                cc.scaleTo(0.3, 1)
            )
        )
        cong.runAction(seq);

        var subCoin = self.tien.getChildByName("thua");
        var subCoinLb = subCoin.getComponent(cc.Label);
        subCoinLb.string = Utils.Number.format(money);
        subCoin.active = true;
    },
    showEffectToiTrang() {

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
    setMoney(money, isAnim = true, isChot = false) {
        // if (!this.tien.active) {
        //     this.tien.active = true;

        // }
        // if (Number(money) > 0) {
        //     var moneyText = this.tien.getChildByName("thang").getComponent(cc.Label);
        //     moneyText.string = "+" + Utils.Number.format(money);
        //     if (!moneyText.node.active) {
        //         moneyText.node.active = true;

        //     }

        //     this.textEffect(moneyText.node , isAnim);
        //     if (isChot) {
        //         this.playAnChotEffect(moneyText.node);
        //     }

        // } else {
        //     if (Number(money) < 0) {
        //         var moneyText = this.tien.getChildByName("thua").getComponent(cc.Label);
        //         moneyText.string = Utils.Number.format(money);
        //         if (!moneyText.node.active) {
        //             moneyText.node.active = true;

        //         }

        //         this.textEffect(moneyText.node, isAnim);
        //     } else {

        //     }


        // }

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
    // showScore(isShow) {
    //     if (isShow) {
    //         this.score.active = true;
    //     } else {
    //         this.score.active = false;
    //     }
    // },
    showTien(isShow) {
        this.tien.children.forEach((item) => {
            item.active = false;
        })
        if (isShow) {
            this.tien.active = true;
            var curPos = this.tien.position;
            cc.tween(this.tien).by(2.5, {
                y: 100
            }, {
                easing: "fade"
            }).call(target => {
                target.active = false;
                target.position = curPos;
            }).start();
        } else {
            this.tien.active = false;
        }
    },
    showWin(isShow) {
        if (isShow) {
            this.win.active = true;
            this.cardOnHandList.removeAllChildren();
        } else {
            this.win.active = false;
        }
        this.node.stopAllActions();
        this.win.children.forEach((item) => {
            item.active = false;
        })
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


    SendGiftTo(player, idGift) {
        var giftScript = Linker.TLMNController.GetGiftById(idGift);
        if (giftScript) {
            var self = this;
            var gift = cc.instantiate(giftScript.node);
            //this.node.addChild(gift);
            gift.active = true;
            cc.Canvas.instance.node.addChild(gift);
            gift.position = this.profileNode.position;
            if ( /*idGift == 0*/ true) {
                cc.tween(gift).bezierTo(1, this.profileNode.position, this.node.position, player.profileNode.position)
                    .call((target) => {
                        target.getComponent("Gift").RunAnimation();
                        //target.destroy();
                    }).start();
            } else {
                cc.tween(gift).parallel(
                    cc.tween(gift).bezierTo(1, this.profileNode.position, this.node.position, player.profileNode.position),
                    cc.tween(gift).to(1, {
                        angle: 360
                    }, {
                        easing: "smooth"
                    })
                ).call((target) => {
                    target.getComponent("Gift").RunAnimation();
                    //target.destroy();
                }).start();
            }
        }
    },

    RunTurnEffect() {
        this.turnEffect.active = true;
        cc.tween(this.turnEffect).set({
            angle: 0
        }).to(1.25, {
            angle: 720
        }, {
            easing: "circOut"
        }).call(target => {
            target.active = false;
        }).start();
    },

    XepBaiClick(event) {
        NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON.MO_BAI, 1, false, false);
        this.countClick >= 0 ? this.countClick++ : this.countClick = 0;
        var cardList = [];
        cardList = TLMNLogic.SortCard(this.countClick % 2, this.player.cardOwnerList);
        for (let i = 0; i < this.cardOnHandList.children.length; i++) {
            var script = this.cardOnHandList.children[i].getComponent("PhomCard");
            if (script) {
                script.fromServerValue(cardList[i].serverValue);
                script.reset();
                script.setTouch(true);
                script.setTakenCard(false);
                script.setLock(false);
            }
        }
    },
});