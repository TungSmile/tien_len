var PhomCard = require('PhomCard');
//var SamCard = require('SamCard');
var PokerCard = require('PokerCard');
var MauBinhCard = require('MauBinhCard');
//var LiengCard = require('LiengCard');
var PhomObj = require('PhomObj');
var PhomConstant = require('PhomConstant');
//var BaCayCard = require('BaCayCard');
var CardUtils = {
    parsePhom(phomString) {
        if (phomString == null || phomString.length == 0 || phomString == "0") {
            return [];
        }
        var listPhom = [];
        var phoms = phomString.split(";");
        phoms.forEach(element => {
            var phom = new PhomObj();
            var listCard = this.parsePhomCard(element);
            phom.cardList = listCard;
            listPhom.push(phom);
        });
        return listPhom;
    },
    parseLiengCard(cardString) {
        if (cardString == null || cardString.length == 0 || cardString == "0") {
            return [];
        }
        var cardList = [];
        var listCardRaw = [];
        listCardRaw = cardString.split("#");
        listCardRaw.forEach(element => {
        var card = new LiengCard();
            card.setServerValue(element);
            cardList.push(card);
        });
        return cardList;
    },
    parsePhomCard(cardString) {
        if (cardString == null || cardString.length == 0 || cardString == "0") {
            return [];
        }
        var cardList = [];
        var listCardRaw = [];
        listCardRaw = cardString.split("#");
        listCardRaw.forEach(element => {
            var card = new PhomCard();
            card.setServerValue(element);
            cardList.push(card);
        });
        return cardList;

    },
    parseSamCard(cardString) {
        // if (cardString == null || cardString.length == 0 || cardString == "0") {
        //     return [];
        // }
        // var cardList = [];
        // var listCardRaw = [];
        // listCardRaw = cardString.split("#");
        // listCardRaw.forEach(element => {
        //     var card = new SamCard();
        //     card.setServerValue(element);
        //     cardList.push(card);
        // });
        // return cardList;
    },
    parseMauBinhCard(cardString) {
        if (cardString == null || cardString.length == 0 || cardString == "0") {
            return [];
        }
        var cardList = [];
        var listCardRaw = [];
        listCardRaw = cardString.split("#");
        listCardRaw.forEach(element => {
            var card = new MauBinhCard();
            card.setServerValue(element);
            cardList.push(card);
        });
        return cardList;

    },
    parseBaCayCard(cardString) {
        // if (cardString == null || cardString.length == 0 || cardString == "0") {
        //     return [];
        // }
        // var cardList = [];
        // var listCardRaw = [];
        // listCardRaw = cardString.split("#");
        // listCardRaw.forEach(element => {
        //     var card = new BaCayCard();
        //     card.setServerValue(element);
        //     cardList.push(card);
        // });
        // return cardList;

    },
    parsePokerCard(cardString) {
        if (cardString == null || cardString.length == 0 || cardString == "0") {
            return [];
        }
        var cardList = [];
        var listCardRaw = [];
        listCardRaw = cardString.split("#");
        listCardRaw.forEach(element => {
        var card = new PokerCard();
            card.setServerValue(element);
            cardList.push(card);
        });
        return cardList;
    },
    buildPhom(listPhom) {
        var phomString = "";
        for (var i = 0; i < listPhom.length; i++) {
            if (i < listPhom.length - 1) {
                phomString = phomString + this.buildPhomCard(listPhom[i]) + ";";
            } else {
                phomString = phomString + this.buildPhomCard(listPhom[i]);
            }
        }
        return phomString;
    },
    buildPhomCard(listCard) {
        var stringCard = "";
        for (var i = 0; i < listCard.length; i++){
            if (i < listCard.length - 1) {
                stringCard = stringCard + listCard[i].serverValue + "#";
            } else {
                stringCard = stringCard + listCard[i].serverValue;
            }
        }
        return stringCard;
    }
}
module.exports = CardUtils;