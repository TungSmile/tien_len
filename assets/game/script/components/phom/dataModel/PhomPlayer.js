// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Player = require('Player');
var CardUtils = require('CardUtils');
var PhomLogic = require('PhomLogic');
var PhomConstant = require('PhomConstant');
var PhomCard = require('PhomCard');
var PhomObj = require('PhomObj');
var Utils = require('Utils');
var Linker = require('Linker');
var Constant = require('Constant');
var TQUtils = require('TQUtil');
var DataAccess = require('DataAccess');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        imagePlayer: cc.Sprite,
        namePlayer: cc.Label,
        moneyPlayer: cc.Label,
        scoreEndGame: cc.Label,
        cardOnHandList: cc.Node,
        takenCardList: cc.Node,
        turnedCardList: cc.Node,
        phomList: cc.Node,
        itemCard: cc.Prefab,
        itemPhom: cc.Prefab,
        profileNode: cc.Node,
        intiveNode: cc.Node,
        readyState: cc.Node,
        timeCount: cc.ProgressBar,
        masterNode: cc.Node,
        hiddenCard: cc.Node,
        listCardEffect: cc.Node,
        win: cc.Node,
        tien: cc.Node,
        score: cc.Node,
        avatarList: {
            type: cc.SpriteFrame,
            default: []
        },
        // Chat Feature
        chatToast: cc.Node,
        chatString: cc.Label,
        btnKick: cc.Node,
        maxTimeAuto: {
            readonly: true,
            type: cc.Float,
            default: 14
        },
        timeCounter: 0,
        profileDialog: cc.Node,
        emojiNode: cc.Animation
    },
    ctor() {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {

    },
    onDestroy() {
    },
    reset() {
        this.removeAllCard();
        this.showProfile(false);
        this.showInvite(true);
        this.showCardOnHand(true);
        this.showTurnedCard(true);
        this.showTakenCard(true);
        this.showPhom(true);
        this.show(true);
        this.isReady(false);
        this.showTime(false);
        this.showHiddenCard(false);
        this.showTien(false);
        this.showScore(false);
        this.showWin(false);
    },
    removeAllCard() {
        this.cardOnHandList.removeAllChildren();
        this.takenCardList.removeAllChildren();
        this.turnedCardList.removeAllChildren();
        this.phomList.removeAllChildren();
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
        this.profileNode.opacity = 100;

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
    setProfile() {

    },
    createPlayer(player) {
        this.player = player;
        this.setProfileUi();
        console.log('player:', player);
    },
    setProfileUi() {
        var name = this.player.viewName;
        if (name.length >= 8) name = name.substring(0, 10) + ".";
        this.namePlayer.string = name;
        if (this.player.avatarId == "no_image.gif") {
            this.player.avatarId = "1";
        }
        this.imagePlayer.spriteFrame = this.avatarList[(Number(this.player.avatarId) - 1).toString()];
        // this.imagePlayer.node.width = 103;
        // this.imagePlayer.node.height = 105;
        //this.moneyPlayer.string = Utils.Number.format(this.player.userMoney);
        this.moneyPlayer.string = TQUtils.abbreviate(this.player.userMoney);
        this.scoreEndGame.string = "0";
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
    onChat(data, isEncode = false) {
        if (data.error) {
            console.log(data.error);
            return;
        }
        if (data.message.includes("Clip") == false) {
            this.chatToast.active = true;
            if (isEncode) {
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
            if (this.chatToast) { // Loi gap khi vua chat xong thoat ra man hinh lobby
                this.chatToast.active = false;
            }

        }, 2000);
        /*
        var item = cc.instantiate(this.pnItemMsg);
        item.parent = this.srcChat.content;

        var txtMsg = item.getComponent(cc.RichText);
        if (data.id == Linker.userData.userId) {
            txtMsg.string = "<color=#20FFE4>" + data.username + ": </c>" + data.message;
        }
        else {
            txtMsg.string = "<color=#61D9CT>" + data.username + ": </c>" + data.message;
        }

        this.srcChat.stopAutoScroll();
        this.srcChat.scrollToBottom(0.0, false);
        */
        //var avaComp = this.findAvaCompByUID(data.id);
        //if (avaComp) {
        //    avaComp.onChatMessage(data.message);
        //}

    },
    showDialogInfo() {
        if (this.player.avatarId == "no_image.gif") {
            this.player.avatarId = "1";
        }
        if (Linker.userData.userId == this.player.userId || !Linker.PhomController.isMaster) {
            //this.btnKick.active = false;
        } else {
            //this.btnKick.active = true;
            Linker.PhomController.KickID = this.player.userId;
        }
        // this.userDialogAvatar.spriteFrame = this.avatarList[(Number(this.player.avatarId) - 1).toString()];
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
    showTime(isShow) {
        var self = this;
        this.timeCount.progress = 1;
        this.timeCount.node.active = isShow;
        this.timeCount.node.stopAllActions();
        if (isShow) {
            this.timeCounter = this.maxTimeAuto;
            this.startCount = true;
            if (this.player.userId == Linker.userData.userId) {
                this.isPlaySound = true;
            }
        } else {
            this.startCount = false;
        }
        // cc.log("SHOW_TIME");
    },
    setPlayer(player) {
        this.player = player;
    },
    addCard(cardData, parent, isTouch = true, isTaken = false, isVertical = false, cb) {
        var card = cc.instantiate(this.itemCard);
        card.width = 110;
        card.height = 160;
        var script = card.getComponent(PhomCard);
        if (script) {
            if (cardData.serverValue) {
                script.fromServerValue(cardData.serverValue);
            }
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

        if (cb) {
            cb();
        }

    },
    addPhom(phomObj, /*type = cc.v2(0.5, 0.5)*/ type = null) {
        var self = this;
        var phom = cc.instantiate(this.itemPhom);
        var script = phom.getComponent(PhomObj);
        if (script) {
            var eatCard = null;
            for (var i = 0; i < this.player.takenCardList.length; i++) {
                if (PhomLogic.findCard(this.player.takenCardList[i], phomObj.cardList) >= 0) {
                    eatCard = this.player.takenCardList[i];
                }
            }

            if (eatCard) {
                script.setTakenCard(eatCard);

            }
            script.fromCardListType(phomObj.cardList, type);
            //script.fromCardListType(phomObj.cardList, null);

        }
        this.phomList.addChild(phom);



    },
    findCard(card, parent) {
        for (var i = 0; i < parent.children.length; i++) {
            var script = parent.children[i].getComponent(PhomCard);
            if (script) {
                if (script.serverValue == card.serverValue) {

                    return i;
                }
            }
        }
        return -1;
    },
    removeCard(serverValue, parent) {
        var removeIndex = this.findCard(serverValue, parent);
        cc.log(removeIndex);
        if (removeIndex != -1) {
            parent.children[removeIndex].removeFromParent();
        }

    },
    addCardPlayerOwner() {
        this.cardOnHandList.removeAllChildren();
        for (var i = 0; i < this.player.cardOwnerList.length; i++) {
            this.addCard(this.player.cardOwnerList[i], this.cardOnHandList, true, false);
        }
    },
    addTurnedCardList(notthiscard) {
        this.turnedCardList.removeAllChildren();
        var isAn = false;

        //tmp duplicate quan bai
        var tmpBaiSeverValue = [];
        for (var i = 0; i < this.player.turnedCardList.length; i++) {
            var cardData = this.player.turnedCardList[i];
            if (notthiscard) {
                isAn = (notthiscard.serverValue != cardData.serverValue) ? true : false;
            } else {
                isAn = true;
            };
            if (tmpBaiSeverValue.indexOf(cardData.serverValue) == -1 && isAn) {
                tmpBaiSeverValue.push(cardData.serverValue);
                this.addTurnedCard(cardData);
            }
        }
    },
    addTakenCardList() {
        var count = this.takenCardList.children.length + 1;
        if (count > this.player.takenCardList.length) {
            count = this.player.takenCardList.length;
        }
        this.takenCardList.removeAllChildren();
        for (var i = 0; i < count; i++) {
            this.addTakenCard(this.player.takenCardList[i]);
        }
    },
    addPhomList() {
        var type;
        switch (this.node.name) {
            case "Player1":
                type = cc.v2(1, 0.5);
                break;
            case "Player4":
                type = cc.v2(0, 0.5);
                break;

            default:
                //type = cc.v2(0.5, 0.5);
                type == null;
                break;
        }
        for (var i = 0; i < this.player.phomList.length; i++) {
            this.addPhom(this.player.phomList[i], type);
        }
    },
    addTurnedCard(cardData) {
        var card = cc.instantiate(this.itemCard);
        card.width = 107;
        card.height = 144;
        var script = card.getComponent("PhomCard");
        if (script) {
            script.fromServerValue(cardData.serverValue);
            script.reset();
            script.setTouch(false);
            script.setTakenCard(false);
            script.setLock(false);
        }
        card.y = 0;
        this.turnedCardList.addChild(card);
    },
    addBocCard(serverValue) {
        this.addCard(serverValue, this.cardOnHandList, true, false);
    },
    addTakenCard(cardData) {
        var card = cc.instantiate(this.itemCard);
        card.width = 107;
        card.height = 144;
        var script = card.getComponent("PhomCard");
        if (script) {
            script.fromServerValue(cardData.serverValue);
            script.reset();
            script.setTouch(false);
            script.setTakenCard(true);
            script.setLock(true);
        }
        card.x = 0;
        this.takenCardList.addChild(card);
    },

    addMyTakenCard(serverValue, cb) {
        this.addCard(serverValue, this.cardOnHandList, true, true, false, cb);
    },
    removeOwnerCard(serverValue) {
        this.removeCard(serverValue, this.cardOnHandList);
    },
    showHiddenCard(isShow) {
        this.hiddenCard.active = isShow;
    },
    sortMyCard(typeSort) {
        for (var i = 0; i < this.cardOnHandList.children.length; i++) {
            var script = this.cardOnHandList.children[i].getComponent(PhomCard);
            if (script) {
                var serverValue = this.player.cardOwnerList[i].serverValue;
                script.fromServerValue(serverValue);
                script.reset();
                script.setTouch(true);
                script.setTakenCard(false);
                script.setLock(false);
            }
        }
        cc.log("LENGTH", this.player.cardOwnerList.length);
        for (var i = 0; i < this.player.takenCardList.length; i++) {
            var index = this.findCard(this.player.takenCardList[i], this.cardOnHandList);
            cc.log("INDEX", index);
            if (index != -1) {

                var script = this.cardOnHandList.children[index].getComponent(PhomCard);
                if (script) {
                    script.setTakenCard(true);
                    script.setLock(true);
                }
            }

        };
        var lockCard = PhomLogic.findLockCard(this.player.takenCardList, this.player.cardOwnerList, typeSort);
        for (var i = 0; i < lockCard.length; i++) {
            var index = this.findCard(lockCard[i], this.cardOnHandList);
            cc.log("INDEX", index);
            if (index != -1) {

                var script = this.cardOnHandList.children[index].getComponent(PhomCard);
                if (script) {
                    // script.setTakenCard(true);
                    script.setLock(true);
                }
            }

        };
        this.cardOnHandList.children.forEach((element) => {
            element.y = 0;
        });

    },

    update(dt) {
        //update time as tick
        if (this.startCount == true) {
            this.timeCounter -= dt;
            if (this.timeCounter <= 0) {
                this.timeCount.progress = 0;
                this.startCount = false;
            } else if (this.timeCounter <= 1) {
                var timeOutNotify = new cc.Event.EventCustom("time-out", this);
                timeOutNotify.detail = this.player;
                this.node.dispatchEvent(timeOutNotify);
            } else {
                this.timeCount.progress = (this.timeCounter / this.maxTimeAuto);
                if (this.timeCount.progress <= 0.2 && this.isPlaySound == true) {
                    NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON.GAN_HET_THOI_GIAN, 1, false, false);
                    this.isPlaySound = false;
                }
            }
        }
    },
    haPhom(listPhom) {
        var lstPhom = [];
        for (var i = 0; i < listPhom.length; i++) {
            for (var j = 0; j < listPhom[i].length; j++) {
                lstPhom.push(listPhom[i][j].serverValue);
            }
        }
        this.cardOnHandList.children.forEach((card) => {
            var PhomCard = card.getComponent("PhomCard");
            if (PhomCard) {
                if (lstPhom.indexOf(PhomCard.serverValue) < 0) {
                    card.y = 0;
                } else {
                    card.y = 20;
                    PhomCard.setLock(true);
                }
            } else {
                card.y = 0;
            }
        });
        this.hideMom();
    },
    guiBai(card) {
        this.cardOnHandList.children.forEach((element) => {
            element.y = 0;
        });

        var index = this.findCard(card, this.cardOnHandList);
        cc.log("INDEX", index);
        if (index != -1) {

            var script = this.cardOnHandList.children[index].getComponent(PhomCard);
            if (script) {
                // script.setTakenCard(true);
                script.setLock(true);
            }
            this.cardOnHandList.children[index].y = 20;
        }
    },
    printData() {
        var data = {};
        data.playerCard = [];
        data.eatCard = [];
        this.player.cardOwnerList.forEach(element => {
            data.playerCard.push(element.serverValue);
        });
        this.player.takenCardList.forEach(element => {
            data.eatCard.push(element.serverValue);
        });
        cc.log(data);
    },
    grayCardEffect(parent) {
        parent.children.forEach(element => {
            element.getComponent(cc.Button).interactable = false;
            element.getChildByName("background").color = cc.Color.GRAY;
        })
    },
    playWinEffect(winPos, uType, score, money, isMom = false) {
        this.showWin(true);
        this.grayCardEffect(this.turnedCardList);
        this.addCardPlayerOwner();
        switch (Number(winPos)) {
            case 0: {
                if (uType != 0) {
                    switch (Number(uType)) {
                        case 2:
                            {
                                this.win.getChildByName("glow2").active = true;
                                this.win.getChildByName("ukhan").active = true;
                                break;
                            }
                        case 3:
                            {
                                this.win.getChildByName("glow2").active = true;
                                this.win.getChildByName("u").active = true;
                                break;
                            }
                        case 11:
                            {
                                this.win.getChildByName("glow2").active = true;
                                this.win.getChildByName("uden").active = true;
                                break;
                            }
                        case 12:
                            {
                                this.win.getChildByName("glow2").active = true;
                                this.win.getChildByName("u").active = true;
                                break;
                            }
                        case 1:
                            {
                                cc.log("U_U_1");
                                this.win.getChildByName("glow2").active = true;
                                this.win.getChildByName("u").active = true;
                                break;
                            }
                    }
                } else {
                    if (!isMom) {
                        this.win.getChildByName("glow2").active = true;
                        this.win.getChildByName("nhat").active = true;
                        this.setScore(score);
                    } else {
                        this.win.getChildByName("glow2").active = true;
                        this.win.getChildByName("xaokhan").active = true;
                        this.setScore(score);
                    }
                }
                cc.log("NHAT_NHAT");

                break;
            }
            case 1: {
                if (uType != 0) {
                    this.win.getChildByName("glow1").active = true;
                    this.win.getChildByName("bet").active = true;
                } else {
                    if (!isMom) {
                        this.win.getChildByName("glow1").active = true;
                        this.win.getChildByName("nhi").active = true;
                        this.setScore(score);
                    } else {
                        this.win.getChildByName("glow1").active = true;
                        this.win.getChildByName("mom").active = true;
                        this.setScore(score);
                    }

                }

                break;
            }
            case 2: {
                if (uType != 0) {
                    this.win.getChildByName("glow1").active = true;
                    this.win.getChildByName("bet").active = true;
                } else {
                    if (!isMom) {
                        this.win.getChildByName("glow1").active = true;
                        this.win.getChildByName("ba").active = true;
                        this.setScore(score);
                    } else {
                        this.win.getChildByName("glow1").active = true;
                        this.win.getChildByName("mom").active = true;
                        this.setScore(score);
                    }
                }
                break;
            }
            case 3: {
                if (uType != 0) {
                    this.win.getChildByName("glow1").active = true;
                    this.win.getChildByName("bet").active = true;
                } else {
                    if (!isMom) {
                        this.win.getChildByName("glow1").active = true;
                        this.win.getChildByName("bet").active = true;
                        this.setScore(score);
                    } else {
                        this.win.getChildByName("glow1").active = true;
                        this.win.getChildByName("mom").active = true;
                        this.setScore(score);
                    }
                }
                break;
            }
        }

        this.setMoney(money, false);
    },
    setScore(score) {
        // if (score > 0) {
        //     if (!this.score.active) {
        //         this.score.active = true;
        //     }
        //     var scoreText = this.score.getChildByName("text").getComponent(cc.Label);
        //     scoreText.string = score;// + " Điểm";
        // } else {
        //     this.score.active = false;
        // }

    },
    setMoney(money, isAnim = true, isChot = false) {
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
            if (isChot) {
                this.playAnChotEffect(moneyText.node);
            }

        } else {
            if (Number(money) < 0) {
                var moneyText = this.tien.getChildByName("thua").getComponent(cc.Label);
                moneyText.string = Utils.Number.format(money);
                if (!moneyText.node.active) {
                    moneyText.node.active = true;

                }

                this.textEffect(moneyText.node, isAnim);
            } else {

            }


        }

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
        } else {
            this.win.active = false;
        }
        this.node.stopAllActions();
        this.win.children.forEach((item) => {
            item.active = false;
        })
    },
    playMomEffect() {
        if (this.player.phomList.length == 0) {
            this.node.runAction(cc.sequence(cc.callFunc(this.showMom, this), cc.delayTime(4), cc.callFunc(this.hideMom, this)));
        }
    },
    playAnChotEffect(node) {
        node.runAction(cc.sequence(cc.callFunc(this.anChot, this), cc.delayTime(4), cc.callFunc(this.hideChot, this)));
    },
    showMom() {
        this.showWin(true);
        this.win.getChildByName("mom").active = true;
    },
    hideMom() {
        this.showWin(false);
        this.win.getChildByName("mom").active = false;
    },
    anChot() {
        this.showWin(true);
        this.win.getChildByName("glow2").active = true;
        this.win.getChildByName("ancaychot").active = true;
    },
    hideChot() {
        this.showWin(false);
        this.win.getChildByName("glow2").active = false;
        this.win.getChildByName("ancaychot").active = false;
    },
    otherBocCardEffect() {
        this.listCardEffect.position = cc.v2(0, 0);
        if (this.listCardEffect && this.listCardEffect.children[0]) {
            var card = this.listCardEffect.children[0];
            card.stopAllActions();
            card.runAction(cc.sequence(cc.moveTo(0.2, this.cardOnHandList.position), cc.callFunc(() => {
                card.position = cc.v2(0, 0);
                this.listCardEffect.position = cc.v2(1500, 0);
            })));
        }
    },

});
