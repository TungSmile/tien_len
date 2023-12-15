var MauBinhLogic = require('MauBinhLogic');
var newLogic = require('MauBinhLogicNew');
var Linker = require('Linker');
var MauBinhSend = require('MauBinhSend');
var CardUtils = require('CardUtils');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,
    ctor() {
        this.cardOwnerList = [];
        this.positionCard = [];
        this.spriteName = [
            "title_mauthau",
            "title_doi",
            "title_thu",
            "title_samco",
            "title_sanh",
            "title_thung",
            "title_culu",
            "title_tuquy",
            "title_thungphasanh",
            "title_thungphasanhlon"
        ];
        this.myCard = "";
        this.timer = 65;
    },
    properties: {
        cardSprite: cc.SpriteAtlas,
        titleSprite: cc.SpriteAtlas,
        cardOnHandList: cc.Node,
        lstCard: cc.Node,
        itemCard: cc.Prefab,
        txtTren: cc.Node,
        txtGiua: cc.Node,
        txtDuoi: cc.Node,
        btnGame: cc.Node,
        countTime: cc.Label,
        btnBaobinh: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cardOnHandList.children.forEach(item => {
            this.positionCard.push(item.position);
        });
    },
    start() {
        Linker.MauBinhXepBai = this;
    },
    findTouch(position) {
        var index = -1;
        for (let i = 0; i < 13; i++) {
            if (this.lstCard.children[i]) {
                var cardPosition = this.lstCard.children[i].position;
                var d = Math.sqrt(Math.pow(cardPosition.x - position.x, 2) + Math.pow(cardPosition.y - position.y, 2));
                if (d < 100) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    },
    onXepBaiClick() {
        var that = this;
        MauBinhLogic.XepBai(this.cardOwnerList, (lstXepbai) => {
            this.cardOwnerList = lstXepbai;
            that.XepBai();
        });
    },
    XepBai() {
        for (let i = 0; i < this.lstCard.children.length; i++) {
            var item = this.lstCard.children[i];
            var index = this.getNodeIndex(item);
            if (index >= 0) {
                item.position = this.positionCard[index];
            }
        }
    },
    getNodeIndex(node) {
        var index = -1;
        var card = node.getComponent("MauBinhCard");
        if (card) {
            var lstServerValue = MauBinhLogic.getServerValue(this.cardOwnerList);
            index = lstServerValue.indexOf(Number(card.serverValue));
        }
        return index;
    },
    onDoiChiClick() {
        NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.CARD_SLIDE, 1, false, false);
        var lstBauBinh = MauBinhLogic.parseMauBinh(this.cardOwnerList);
        var lst = [
            lstBauBinh[1],
            lstBauBinh[2],
            lstBauBinh[0]
        ];
        var lstNew = [];
        lst.forEach(item => {
            if (item) {
                item.forEach(card => {
                    if (card) {
                        lstNew.push(card);
                    }
                });
            }
        });
        this.updateCard(lstNew);
    },
    onBaoBinh() {
        if (Linker.MauBinhController) {
            Linker.MauBinhController.baoBinh(this.cardOwnerList);
        }
    },
    onSoBaiClick() {
        NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.DANH_BAI, 1, false, false);
        if (Linker.MauBinhController) {
            this.node.destroy();
            Linker.MauBinhXepBai = null;
            Linker.MauBinhController.updateCard(this.cardOwnerList);
        }
    },
    checkMauBinh() {
        this.cardOwnerList = MauBinhLogic.getCardOwnerList(this.lstCard.children);
        this.myCard = MauBinhLogic.getServerValueToString(this.cardOwnerList);
        var lstBauBinh = MauBinhLogic.parseMauBinh(this.cardOwnerList);
        var getTypeMauBinh = MauBinhLogic.getType(lstBauBinh);
        var lstCard = [];
        getTypeMauBinh.forEach(item => {
            item.card.forEach(card => {
                lstCard.push(card);
            });
        });
        this.showLine(lstCard);
        this.txtTren.getComponent(cc.Sprite).spriteFrame = this.titleSprite.getSpriteFrame(this.spriteName[getTypeMauBinh[0].type]);
        this.txtGiua.getComponent(cc.Sprite).spriteFrame = this.titleSprite.getSpriteFrame(this.spriteName[getTypeMauBinh[1].type]);
        this.txtDuoi.getComponent(cc.Sprite).spriteFrame = this.titleSprite.getSpriteFrame(this.spriteName[getTypeMauBinh[2].type]);
        if (MauBinhLogic.soChi(lstBauBinh[2], lstBauBinh[1]) && MauBinhLogic.soChi(lstBauBinh[2], lstBauBinh[0])) {
            this.iconVX(this.txtDuoi, true);
            if (MauBinhLogic.soChi(lstBauBinh[1], lstBauBinh[0])) {
                this.iconVX(this.txtGiua, true);
                this.iconVX(this.txtTren, true);
            } else {
                this.iconVX(this.txtGiua, false);
                this.iconVX(this.txtTren, false);
            }
        } else {
            this.iconVX(this.txtDuoi, false);
            this.iconVX(this.txtGiua, false);
            this.iconVX(this.txtTren, false);
        }
        this.checkBinh();
    },
    checkBinh() {
        var mauBinh = newLogic.checkAnTrang(this.cardOwnerList);
        if (mauBinh) {
            //this.myCard = newLogic.convertLstDanh(mauBinh);
            this.btnBaobinh.active = true;
            //this.cardOwnerList = CardUtils.parseMauBinhCard(this.myCard);
            //this.updateCard(this.cardOwnerList);
        }
    },
    iconVX(node, isTrue) {
        if (isTrue) {
            node.children[0].active = true;
            node.children[1].active = false;
        } else {
            node.children[0].active = false;
            node.children[1].active = true;
        }
    },
    showLine(lstCard) {
        this.lstCard.children.forEach(item => {
            var card = item.getComponent("MauBinhCard");
            if (card) {
                if (lstCard.indexOf(Number(card.serverValue)) >= 0) {
                    card.setSelect(true);
                } else {
                    card.setSelect(false);
                }
            }
        });
    },
    checkTouch(node, position, cb) {
        var index = this.findTouch(position);
        if (index >= 0 && node.getComponent("MauBinhCard").serverValue !== this.lstCard.children[index].getComponent("MauBinhCard").serverValue) {
            var value = node.getComponent("MauBinhCard").serverValue;
            node.getComponent("MauBinhCard").fromServerValue(this.lstCard.children[index].getComponent("MauBinhCard").serverValue);
            this.lstCard.children[index].getComponent("MauBinhCard").fromServerValue(value);
            this.checkMauBinh();
        }
        if (cb) {
            cb();
        }
    },
    updateCard(cardOwnerList, number, isCheckBinh) {
        if (!cardOwnerList || cardOwnerList.length !== this.cardOnHandList.children.length) return;
        this.lstCard.removeAllChildren();
        for (let i = 0; i < this.cardOnHandList.children.length; i++) {
            var item = this.cardOnHandList.children[i];
            var card = cc.instantiate(this.itemCard);
            card.getComponent("MauBinhCard").fromServerValue(cardOwnerList[i].serverValue);
            card.position = item.position;
            this.lstCard.addChild(card);
        }
        this.checkMauBinh();
        if (number && number > 0) {
            this.timer = number;
            this.countTime.string = Math.floor(this.timer) + "";
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
    update(dt) {
        if (this.timer > 0) {
            if (Math.floor(this.timer) != Math.floor(this.timer - dt)) {
                this.countTime.string = Math.floor(this.timer) + "";
                if (this.timer < 10 && Linker.MauBinhController) {
                    NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.XEP_BAI, 1, false, false);
                }
            }
            this.timer -= dt;
        } else {
            this.onSoBaiClick();
        }
    },
});
