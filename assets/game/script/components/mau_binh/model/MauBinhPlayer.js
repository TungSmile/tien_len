var NewAudioManager = require('NewAudioManager');
var Player = require('Player');
var PhomCard = require('PhomCard');
var PhomObj = require('PhomObj');
var Utils = require('Utils');
var Linker = require('Linker');
var Constant = require('Constant');
var TQUtils = require('TQUtil');
var DataAccess = require('DataAccess');
cc.Class({
    extends: cc.Component,
    ctor() {
        this.spriteNameTT = [
            "title_binhlung",
            "title_mauthau",
            "title_doi",
            "title_thu",
            "title_samco",
            "title_sanh",
            "title_thung",
            "title_tuquy",
            "title_culu",
            "title_thungphasanh",
            "title_thungphasanhlon",
        ];
        this.positionCard = [];
    },
    properties: {
        imagePlayer: cc.Sprite,
        namePlayer: cc.Label,
        moneyPlayer: cc.Label,
        cardOnHandList: cc.Node,
        profileNode: cc.Node,
        intiveNode: cc.Node,
        readyState: cc.Node,
        timeCount: cc.ProgressBar,
        masterNode: cc.Node,
        win: cc.Node,
        tien: cc.Node,
        avatarList: cc.SpriteAtlas,
        chatToast: cc.Node,
        chatString: cc.Label,
        cardSprite: cc.SpriteAtlas,
        titleSprite: cc.SpriteAtlas,
        showBinh: cc.Node,
        soChiNode: cc.Node,
        sitNode: cc.Node,
        xepBaiPrefab: cc.Prefab,
        xepbaiNode: cc.Node,
        profileDialog: cc.Node,
        emojiNode: cc.Animation
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {},
    isSitNode(isShow = false) {
        this.sitNode.active = isShow;
        if (isShow) {
            this.intiveNode.active = false;
        }
    },
    hideNode(isHide = false) {
        this.node.active = !isHide;
    },
    start() {
        this.positionShowbinh = this.showBinh.position;
        this.cardOnHandList.children.forEach(item => {
            this.positionCard.push(item.position);
        });
        this.xepbaiNode.position = this.cardOnHandList.position;
    },
    onDestroy() {},
    getNameBySeverType(type) {
        var name = "binhlung";
        switch (Number(type)) {
            case 0:
                name = "binhlung";
                break;
            case 1:
                name = "mauthau";
                break;
            case 2:
                name = "doi";
                break;
            case 3:
                name = "thu";
                break;
            case 4:
                name = "xamco";
                break;
            case 5:
                name = "sanh";
                break;
            case 6:
                name = "sanh";
                break; // sảnh có át
            case 7:
                name = "thung";
                break;
            case 8:
                name = "culu";
                break;
            case 9:
                name = "tuquy_1";
                break;
            case 10:
                name = "tpsanh";
                break;
            case 11:
                name = "tpsanh";
                break;
        }
        return name;
    },
    getAnTrang(type) {
        var name = "win";
        switch (Number(type)) {
            case -1:
                name = "binhlung";
                break;
            case 7:
                name = "3sanh";
                break;
            case 8:
                name = "3thung";
                break;
            case 9:
                name = "6doi";
                break;
            case 10:
                name = "5doi1xam";
                break;
            case 11:
                name = "sanhrong";
                break;
            case 12:
                name = "sanhrongdonghoa";
                break;
            default:
                name = "win";
                break;
        }
        return name;
    },
    showBinhEffect(caseType, type, index) {
        if (Number(caseType) == 0) {
            this.showBinh.active = true;
            this.showBinh.getComponent(cc.Sprite).spriteFrame = this.titleSprite.getSpriteFrame(this.getNameBySeverType(type));
            var ani = this.showBinh.getComponent(cc.Animation);
            if (ani) {
                ani.play();
            }
            if (Number(type) != -1) {
                if (index == 1) {
                    this.showBinh.y = this.positionShowbinh.y;
                } else if (index == 2) {
                    this.showBinh.y = this.positionShowbinh.y + 50;
                } else if (index == 3) {
                    this.showBinh.y = this.positionShowbinh.y + 100;
                    this.showBinh.x = this.positionShowbinh.x - 40;
                }
            } else {
                this.showBinh.position = this.profileNode.position;
            }
        } else {
            this.showAnTrang(caseType);
        }
    },
    isXepBai(isXep = false) {
        if (isXep) {
            var xepbai = cc.instantiate(this.xepBaiPrefab);
            this.cardOnHandList.active = false;
            this.xepbaiNode.addChild(xepbai);
            this.showBinh.active = false;
        } else {
            this.xepbaiNode.removeAllChildren();
        }
    },
    isXepXong(isXep = false) {
        if (isXep) {
            this.showBinh.active = true;
            this.cardOnHandList.active = true;
            this.showBinh.getComponent(cc.Sprite).spriteFrame = this.titleSprite.getSpriteFrame("xepxong");
        } else {
            this.showBinh.active = false;
        }
    },
    createMauBinh() {
        var mauBinh = cc.instantiate(this.mauBinh);
        var that = this;
        if (mauBinh.getComponent("MauBinhList")) {
            mauBinh.getComponent("MauBinhList").createMauBinh([], (MauBinhList) => {
                that.player.mauBinhList = MauBinhList;
                mauBinh.getComponent("MauBinhList").showCard(MauBinhList);
            });
            this.cardOnHandList.addChild(mauBinh);
        }
    },
    reset(isPlayGame = true) {
        this.showProfile(false);
        this.isReady(false);
        this.showTime(false);
        this.showCardOnHand(false);
        // this.showTime(false);
        this.showTien(false);
        // this.showScore(false);
        this.showWin(false);
        this.resetCardonHard();
        if (!isPlayGame) {
            this.showSit(true);
            this.intiveNode.active = false;
        } else {
            this.showSit(false);
        }

        this.showBinh.active = false; //add by zep
        this.soChiNode.active = false;
    },
    showSit(isShow = false) {
        this.sitNode.active = isShow;
        if (isShow) {
            this.sitNode.runAction(cc.repeatForever(cc.sequence(cc.moveTo(0.5, this.profileNode.x, this.profileNode.y + 10), cc.delayTime(0.7), cc.moveTo(0.5, this.profileNode.x, this.profileNode.y - 10))));
        } else {
            this.sitNode.stopAllActions();
        }

    },
    showProfile(isShow = false, blur) {
        this.profileNode.active = isShow;
        this.intiveNode.active = !isShow;
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
    showCardOnHand(isShow = false) {
        this.cardOnHandList.active = isShow;
    },
    setProfile() {

    },
    resetCardonHard() {
        if (this.positionShowbinh) {
            this.showBinh.position = this.positionShowbinh;
        }
        for (let i = 0; i < this.cardOnHandList.children.length; i++) {
            var item = this.cardOnHandList.children[i];
            if (item) {
                item.stopAllActions();
                if (i > 12) {
                    item.destroy();
                } else {
                    var spriteFrame = this.cardSprite.getSpriteFrame("card_face_down");
                    item.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    if (this.positionCard[i]) {
                        item.position = this.positionCard[i];
                    }
                }
            }
        }
        this.isXepBai(false);
    },
    createPlayer(player) {
        this.player = player;
        this.showSit(false);
        this.setProfileUi();
    },
    setProfileUi() {
        var name = this.player.viewName;
        if(name.length >=8) name = name.substring(0, 10) + ".";
        this.namePlayer.string = name;
        if (this.player.avatarId == "no_image.gif") {
            this.player.avatarId = "1";
        }
        this.imagePlayer.spriteFrame = this.avatarList.getSpriteFrame('avatar (' + this.player.avatarId + ')');
        this.imagePlayer.node.width = 103;
        this.imagePlayer.node.height = 105;
        //this.moneyPlayer.string = Utils.Number.format(this.player.userMoney);
        this.moneyPlayer.string = TQUtils.abbreviate(this.player.userMoney);
        if (this.player.isMaster == 1) {
            this.masterNode.active = true;
        } else {
            this.masterNode.active = false;
        }

        // if (this.player.state == 1) {
        //     this.readyState.active = true;
        // } else {
        //     this.readyState.active = false;
        // }
        this.readyState.active = false;

    },
    showAnTrang(caseType) {
        this.showWin(true);
        var name = this.getAnTrang(caseType);
        var node = this.win.getChildByName(name);
        if (node) {
            node.active = true;
            if (Number(caseType) != -1) {
                this.win.getChildByName("glow2").active = true;
            }
        }
    },
    soChiEffect(player, cardIndex) {
        this.cardOnHandList.active = true;
        if (Number(player.caseType) != 0) {
            var that = this;
            if (player.cardDataList.length == 13) {
                this.updateCard(player.cardDataList, () => {
                    that.cardOnHandList.active = true;
                    that.cardOnHandList.children.forEach(item => {
                        item.active = true;
                    });
                    for (let i = 0; i < that.cardOnHandList.children.length; i++) {
                        var item = that.cardOnHandList.children[i];
                        if (item) {
                            if (i < 13) {
                                item.active = true;
                            } else {
                                item.destroy();
                            }
                        }
                    }
                });
            }
        } else if (Number(cardIndex) != -1) {
            this.setActive(cardIndex, player.cardDataList);
        }
        this.showBinhEffect(player.caseType, player.chiType, cardIndex);
    },
    getChildrenShow(lstIndex) {
        var lst = [];
        for (let i = 0; i < this.cardOnHandList.children.length; i++) {
            var card = this.cardOnHandList.children[i];
            if (lstIndex.indexOf(i) < 0) {
                card.active = false;
            } else {
                card.active = true;
                card.scaleX = 0;
                lst.push(card);
            }
        }
        return lst;
    },
    setActive(cardIndex, lstCard) {
        var lstIndex = [];
        if (cardIndex == 1) {
            lstIndex = [8, 9, 10, 11, 12];
        } else if (cardIndex == 2) {
            lstIndex = [3, 4, 5, 6, 7];
        } else if (cardIndex == 3) {
            lstIndex = [0, 1, 2];
        }
        var lst = this.getChildrenShow(lstIndex);
        if (lst.length == lstCard.length) {
            for (let i = 0; i < lst.length; i++) {
                var name = this.getNameType(lstCard[i]);
                var spriteFrame = this.cardSprite.getSpriteFrame(name);
                lst[i].getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
        }
        this.runActionShow(0, lst);
    },
    runActionShow(index, chi) {
        if (chi[index] && index < 13) {
            if (Linker.MauBinhController) {
                NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.CHIA_BAI, 1, false, false);
                cc.error("Chia bai chia bai ae", NewAudioManager.SOUND_GAME.MAUBINH.COMMON.CHIA_BAI)
            }
            chi[index].runAction(cc.sequence(
                cc.scaleTo(0.1, 1, 1.2),
                cc.callFunc(() => {
                    index++;
                    this.runActionShow(index, chi);
                }),
                cc.scaleTo(0.1, 1, 1)
            ))
        }
    },
    onChat(data, isEncode = false) {
        if (data.error) {
            console.log(data.error);
            return;
        }
        if (data.message.includes("Clip") == false) {
            this.chatToast.active = true;
            if (!isEncode) {
                this.chatString.string = (data.message);
            } else {
                this.chatString.string = Utils.Decoder.decode(data.message);
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
    },
    showDialogInfo() {
        if (this.player.avatarId == "no_image.gif") {
            this.player.avatarId = "1";
        }

        DataAccess.Instance.requestUserData(this.player.userId);
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
        if (isShow) {
            this.timeCount.node.stopAllActions();
            this.startCount = true;
            this.timeCount.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.016), cc.callFunc(() => {
                // cc.log("AAAAA");
                if (self.timeCount.progress > 0.0008333333) {
                    self.timeCount.progress = self.timeCount.progress - 0.0007;
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
    addCard(cardData, parent, isTouch = true, isTaken = false, isVertical = false, cb) {
        var card = cc.instantiate(this.itemCard);
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

        if (cb) {
            cb();
        }

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


    update(dt) {
        // if (this.timeCount.progress > 0.05);
    },

    printData() {

    },
    grayCardEffect(parent) {
        parent.children.forEach(element => {
            element.getComponent(cc.Button).interactable = false;
            element.getChildByName("background").color = cc.Color.GRAY;
        })
    },
    playWinEffect() {

    },
    soSamHamEffect(anChi, isBatSapLang) {
        this.showWin(true);
        if (isBatSapLang == 1) {
            this.win.getChildByName("thangsaplang").active = true;
            this.win.getChildByName("glow2").active = true;
        } else if (isBatSapLang == -1) {
            this.win.getChildByName("thuasaplang").active = true;
        } else {
            if (Number(anChi) > 0) {
                this.win.getChildByName("thangsapham").active = true;
                this.win.getChildByName("glow1").active = true;
            } else if (Number(anChi) < 0) {
                this.win.getChildByName("thuasapham").active = true;
            }
        }
    },
    showAnChi(anChi) {
        if (!this.soChiNode.active) {
            this.soChiNode.active = true;
        }
        var text = null;
        if (Number(anChi) > 0) {
            text = this.soChiNode.getChildByName("thang").getComponent(cc.Label);
            text.string = "+" + anChi + " Chi";
            if (!text.node.active) {
                text.node.active = true;
            }
        } else if (Number(anChi) < 0) {
            text = this.soChiNode.getChildByName("thua").getComponent(cc.Label);
            text.string = anChi + " Chi";
            if (!text.node.active) {
                text.node.active = true;
            }
        }
        if (text) {
            text.node.runAction(cc.sequence(cc.delayTime(4), cc.callFunc(() => {
                text.node.active = false;
            })));
        }
    },
    setMoney(money, anChi, cb) {
        if (!this.tien.active) {
            this.tien.active = true;
        }
        if (Number(money) > 0) {
            var moneyText = this.tien.getChildByName("thang").getComponent(cc.Label);
            var thuaText = this.tien.getChildByName("thua");
            moneyText.string = "+" + Utils.Number.format(money);
            if (!moneyText.node.active) {
                thuaText.active = false;
                moneyText.node.active = true;
            }
            this.textEffect(moneyText.node);
        } else if (Number(money) < 0) {
            var moneyText = this.tien.getChildByName("thua").getComponent(cc.Label);
            var thangText = this.tien.getChildByName("thang");
            moneyText.string = Utils.Number.format(money);
            if (!moneyText.node.active) {
                thangText.active = false;
                moneyText.node.active = true;
            }
            this.textEffect(moneyText.node);
        }
        //Linker.userData.userMoney = message.resultMoney;

        this.showAnChi(anChi);
        if (cb) {
            cb();
        }
    },
    textEffect(node) {
        node.stopAllActions();
        node.active = true;
        node.runAction(cc.sequence(cc.delayTime(4), cc.callFunc(() => {
            node.active = false;
            this.showWin(false);
        })));
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
    showTien(isShow = false) {
        this.tien.children.forEach((item) => {
            item.active = false;
        })
        this.tien.active = isShow;
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
    updateCard(cardOwnerList, cb) {
        if (!cardOwnerList) {
            cardOwnerList = this.player.cardOwnerList;
        }
        var name = [];
        cardOwnerList.forEach(item => {
            var nameType = this.getNameType(item);
            name.push(nameType);
        });
        if (name.length == 13) {
            var convertName = [
                name[10], name[11], name[12],
                name[5], name[6], name[7], name[8], name[9],
                name[0], name[1], name[2], name[3], name[4],
            ];
            if (cardOwnerList && cardOwnerList.length == 13) {
                for (let i = 0; i < this.cardOnHandList.children.length; i++) {
                    var item = this.cardOnHandList.children[i];
                    var spriteFrame = this.cardSprite.getSpriteFrame(convertName[i]);
                    item.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            }
        }
        if (cb) {
            cb();
        }
    },
    getNameType(card) {
        var name = "card_face_down";
        name = card.rank + "";
        switch (Number(card.type)) {
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
        return name;
    },
});