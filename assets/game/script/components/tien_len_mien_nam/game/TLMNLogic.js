var CardUtils = require('CardUtils');
var PhomCard = require('PhomCard');
var PhomObj = require('PhomObj');
var PhomConstant = require('PhomConstant');
var Linker = require('Linker');
var Utils = require('Utils');
var TLMNLogic = {
    //sắp xếp theo thứ tự từ chất thấp đến chất cao
    suits: ["♠", "♣", "♦", "♥"],
    ranks: ["3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2"],
    colors: ["Black", "Red"],
    SortType: cc.Enum({
        Doi: 0,
        Sanh: 1
    }),
    removeOwnerCard(card, list) {
        var pos = [];
        for (var i = 0; i < card.length; i++) {
            for (var j = 0; j < list.length; j++) {
                if (list[j].serverValue == card[i].serverValue) {
                    list.splice(j, 1);
                    pos.push(j);
                }
            }
        }
        return pos;

        // for (var i = 0; i < list.length; i++) {
        //     if (list[i].serverValue == card.serverValue) {
        //         return i;
        //     }
        // }
        // return -1;

    },

    findCard(card, list) {
        var pos = [];
        for (var i = 0; i < card.length; i++) {
            for (var j = 0; j < list.length; j++) {
                if (list[j].serverValue == card[i].serverValue) {
                    pos.push(j);
                }
            }
        }
        return pos;

        // for (var i = 0; i < list.length; i++) {
        //     if (list[i].serverValue == card.serverValue) {
        //         return i;
        //     }
        // }
        // return -1;

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
        return list;
    },

    sort2(list) {
        for (var i = 0; i < list.length; i++) {
            for (var j = i + 1; j < list.length; j++) {
                if (list[j].getComponent("PhomCard").rank < list[i].getComponent("PhomCard").rank) {
                    var temp = list[j];
                    list[j] = list[i];
                    list[i] = temp;
                }
            }
        }
        return list;
    },

    checkTuQuy(listCard) {
        if (listCard.length == 4) {
            for (var i = 1; i < listCard.length; i++) {
                if (listCard[i].rank != listCard[i - 1].rank) {
                    cc.log("NO TUQUY");
                    return false;
                }
            }
            cc.log("YES TUQUY")
            return true;
        } else {
            cc.log("NO TUQUY");
            return false;
        }
    },
    checkTuQuy2(listCard) {
        var result = [];
        for (let i = 0; i < listCard.length - 3; ++i) {
            if (listCard[i].rank == listCard[i + 1].rank && listCard[i].rank == listCard[i + 2].rank && listCard[i].rank == listCard[i + 3].rank) {
                result.push(listCard[i], listCard[i + 1], listCard[i + 2], listCard[i + 3]);
            }
        }
        return result;
    },
    checkDoiHeo(listCard) {
        if (listCard.length == 2) {
            if (listCard[0].rank == 2 && listCard[1].rank == 2) {
                return true;
            } else return false;
        }
        return false;
    },

    checkHeo(listCard) {
        var exclude = [];
        for (let i = 0; i < listCard.length; i++) {
            if (listCard[i].getComponent("PhomCard").rank == 2) {
                listCard[i].getChildByName("background").getChildByName('bg_black').active = false;
                exclude.push(i);
            } else {
                listCard[i].getChildByName("background").getChildByName('bg_black').active = true;
            }
        }
        return exclude;
    },
    checkDoi(listCard) {
        if (listCard.length == 2) {
            if (listCard[0].rank == listCard[1].rank) {
                return true;
            } else return false;
        }
        return false;
    },
    checkSanh(listCard) {
        if (listCard.length >= 3) {
            if (listCard[0].rank == 1 && listCard[listCard.length - 2].rank == 12 && listCard[listCard.length - 1].rank == 13) {
                return true;
            }
            for (var i = 0; i < listCard.length; i++) {
                if (i < listCard.length - 1) {
                    if (listCard[i].rank == listCard[i+1].rank) {
                        return false;
                    }
                    if (listCard[i].rank + 1 !== listCard[i+1].rank) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    },
    checkBaCon(listCard) {
        if (listCard.length == 3) {
            if (listCard[0].rank == listCard[1].rank && listCard[0].rank == listCard[2].rank && listCard[1].rank == listCard[2].rank) {
                return true;
            } else return false;
        }
        return false;
    },
    checkBaConHeo(listCard) {
        if (listCard.length == 3) {
            if (listCard[0].rank == 2 && listCard[1].rank == 2 && listCard[2].rank == 2) {
                return true;
            } else return false;
        }
        return false;
    },
    check3DoiThong(listCard) {
        var list = this.sort(listCard);
        if (list.length == 6) {
            for (var i = 0; i < list.length - 1; i += 2) {
                if (list[i].rank != list[i + 1].rank) {
                    cc.log("NO 3DOITHONG");
                    return false;
                }
            }
            cc.log("YES 3DOITHONG");
            return true;
        } else {
            cc.log("NO 3DOITHONG");
            return false;
        }
    },

    check3DoiThong2(listCard, exclude = []) {
        if (listCard.length >= 6) {
            for (let i = 0; i < listCard.length;) {
                if (!exclude.includes(i)) {
                    if (listCard[i].getComponent("PhomCard").rank == listCard[i + 1].getComponent("PhomCard").rank) {
                        if ((listCard[i + 2].getComponent("PhomCard").rank == listCard[i + 3].getComponent("PhomCard").rank)
                            && (listCard[i].getComponent("PhomCard").rank == listCard[i + 2].getComponent("PhomCard").rank - 1)) {
                            if ((listCard[i + 4].getComponent("PhomCard").rank == listCard[i + 5].getComponent("PhomCard").rank)
                                && (listCard[i + 2].getComponent("PhomCard").rank == listCard[i + 4].getComponent("PhomCard").rank - 1)) {
                                for (let j = 0; j < 6; j++) {
                                    listCard[i + j].getChildByName("background").getChildByName('bg_black').active = false;
                                    exclude.push(i + j);
                                }
                                i += 6;
                                continue;
                            } else {
                                i += 3;
                                continue;
                            }
                        } else {
                            i += 2;
                            continue;
                        }
                    } else {
                        i += 1;
                        continue;
                    }
                } else {
                    i += 1;
                    continue;
                }
            }
        }
        return exclude;
    },
    check4DoiThong(listCard) {
        var list = this.sort(listCard);
        if (list.length == 8) {
            for (var i = 0; i < list.length - 1; i += 2) {
                if (list[i].rank != list[i + 1].rank) {
                    cc.log("NO 4DOITHONG");
                    return false;
                }
            }
            cc.log("YES 4DOITHONG");
            return true;
        } else {
            cc.log("NO 4DOITHONG");
            return false;
        }
    },
    check5DoiThong(listCard) {
        var list = this.sort(listCard);
        if (list.length == 10) {
            for (var i = 0; i < list.length - 1; i += 2) {
                if (list[i].rank != list[i + 1].rank) {
                    cc.log("NO 5DOITHONG");
                    return false;
                }
            }
            cc.log("YES 5DOITHONG");
            return true;
        } else {
            cc.log("NO 5DOITHONG");
            return false;
        }
    },
    check6DoiThong(listCard) {
        var list = this.sort(listCard);
        if (list.length == 12) {
            for (var i = 0; i < list.length - 1; i += 2) {
                if (list[i].rank != list[i + 1].rank) {
                    cc.log("NO 6DOITHONG");
                    return false;
                }
            }
            cc.log("YES 6DOITHONG");
            return true;
        } else {
            cc.log("NO 6DOITHONG");
            return false;
        }
    },

    onCheckTurnSuggestion(listCardBefore, listCardOnHand) {
        /*
            type 1: coc
            type 2: doi
            type 3: 3 thang
            type 4: tu quy
            type 5: 3 doi thong
            type 6: 4 doi thong
            type 7: 5 doi thong
            type 8: sanh
        */
        var type;
        if (listCardBefore.length == 1) {
            type = 1;
        } else if (listCardBefore.length == 2) {
            type = 2;
        } else if (listCardBefore.length == 3 && listCardBefore[0].rank == listCardBefore[1].rank) {
            type = 3;
        } else if (TLMNLogic.checkTuQuy(listCardBefore)) type = 4;
        else if (TLMNLogic.check3DoiThong(listCardBefore)) type = 5;
        else if (TLMNLogic.check4DoiThong(listCardBefore)) type = 6;
        else if (TLMNLogic.check5DoiThong(listCardBefore)) type = 7;
        else if (listCardBefore.length >= 3) {
            type = 8;
            this.maxLength = listCardBefore.length;
        }

        return type;
        // return TLMNLogic.onTurnSuggestion(type, listCardBefore, listCardOnHand);

        // return type;

    },

    onTurnSuggestion(type, cardOnTable, cardOnHand) {
        var listCard = [];
        cc.log("type check: ", type);
        switch (type) {
            case 1: {
                for (var i = 0; i < cardOnHand.length; i++) {
                    if (cardOnHand[i].rank == 1) {
                        if (cardOnTable[0].rank != 2) {
                            if (cardOnHand[i].rank == cardOnTable[0].rank) {
                                if (cardOnHand[i].type > cardOnTable[0].type) listCard.push(cardOnHand[i]);
                            } else listCard.push(cardOnHand[i]);
                        } else if (cardOnTable[0].rank == 2) {

                        }
                    } else if (cardOnHand[i].rank == 2) {
                        if (cardOnTable[0].rank == 2) {
                            if (cardOnHand[i].type > cardOnTable[0].type) {
                                listCard.push(cardOnHand[i]);
                            }
                        } else listCard.push(cardOnHand[i]);
                    } else if (cardOnHand[i].rank != 1 && cardOnHand[i].rank != 2) {
                        if (cardOnTable[0].rank != 1 && cardOnTable[0].rank != 2) {
                            if (cardOnHand[i].rank > cardOnTable[0].rank) {
                                listCard.push(cardOnHand[i]);
                            } else if (cardOnHand[i].rank == cardOnTable[0].rank) {
                                if (cardOnHand[i].type > cardOnTable[0].type) {
                                    listCard.push(cardOnHand[i]);
                                }
                            }
                        }
                    }
                    // if(cardOnHand[i].rank > cardOnTable[0].rank || 
                    //     cardOnHand[i].rank == cardOnTable[0].rank && cardOnHand[i].type > cardOnTable[0].type){
                    //         listCard.push(cardOnHand[i]);
                    //         cc.log("YES");
                    //     }
                }
                break;
            }
            case 2:
            case 3:
            case 8: {
                return cardOnHand;
            }

        }
        return listCard;
    },

    checkOneTurnCard(cardOnHand, cardSuggestion) {
        for (var i = 0; i < cardOnHand.length; i++) {
            cardOnHand[i].getChildByName("background").getChildByName('bg_black').active = true;
        }
        for (var i = 0; i < cardOnHand.length; i++) {
            // var kt = 1;
            for (var j = 0; j < cardSuggestion.length; j++) {
                if (cardOnHand[i].getComponent("PhomCard").rank == cardSuggestion[j].rank &&
                    cardOnHand[i].getComponent("PhomCard").type == cardSuggestion[j].type) {
                    cardOnHand[i].getChildByName("background").getChildByName('bg_black').active = false;
                }
            }
            //     if(kt == 1){
            //         cardOnHand[j].getChildByName('background').getChildByName('bg_black').active = true;
            //     }
        }
    },

    checkDoubleTurnCard(cardOnHand, cardSuggestion, cardOnTable) {
        for (var i = 0; i < cardOnHand.length; i++) {
            cardOnHand[i].getChildByName("background").getChildByName('bg_black').active = true;
        }
        for (var i = 0; i < cardOnHand.length; i++) {
            for (var j = i + 1; j < cardOnHand.length; j++) {
                if (cardOnHand[i].getComponent("PhomCard").rank == cardOnHand[j].getComponent("PhomCard").rank) {
                    if (cardOnHand[i].getComponent("PhomCard").rank == 1) {
                        if (cardOnTable[0].rank != 1 && cardOnTable[0].rank != 2) {
                            cardOnHand[i].getChildByName("background").getChildByName('bg_black').active = false;
                            cardOnHand[j].getChildByName("background").getChildByName('bg_black').active = false;
                        } else if (cardOnTable[0].rank == 1) {
                            var cardMax1 = TLMNLogic.searchMax1(cardOnHand[i], cardOnHand[j]);
                            var cardMax2 = TLMNLogic.searchMax2(cardOnTable[0], cardOnTable[1]);
                            if (cardMax1.getComponent("PhomCard").type > cardMax2.type) {
                                cardOnHand[i].getChildByName("background").getChildByName('bg_black').active = false;
                                cardOnHand[j].getChildByName("background").getChildByName('bg_black').active = false;
                            }
                        }
                    } else if (cardOnHand[i].getComponent("PhomCard").rank == 2) {
                        if (cardOnTable[0].rank != 2) {
                            cardOnHand[i].getChildByName("background").getChildByName('bg_black').active = false;
                            cardOnHand[j].getChildByName("background").getChildByName('bg_black').active = false;
                        } else if (cardOnTable[0].rank == 2) {
                            var cardMax1 = TLMNLogic.searchMax1(cardOnHand[i], cardOnHand[j]);
                            var cardMax2 = TLMNLogic.searchMax2(cardOnTable[0], cardOnTable[1]);
                            if (cardMax1.getComponent("PhomCard").type > cardMax2.type) {
                                cardOnHand[i].getChildByName("background").getChildByName('bg_black').active = false;
                                cardOnHand[j].getChildByName("background").getChildByName('bg_black').active = false;
                            }
                        }
                    } else if (cardOnHand[i].getComponent("PhomCard").rank > cardOnTable[0].rank) {
                        cc.log("YES");
                        cardOnHand[i].getChildByName("background").getChildByName('bg_black').active = false;
                        cardOnHand[j].getChildByName("background").getChildByName('bg_black').active = false;
                    } else if (cardOnHand[i].getComponent("PhomCard").rank == cardOnTable[0].rank) {
                        var cardMax1 = TLMNLogic.searchMax1(cardOnHand[i], cardOnHand[j]);
                        var cardMax2 = TLMNLogic.searchMax2(cardOnTable[0], cardOnTable[1]);
                        if (cardMax1.getComponent("PhomCard").type > cardMax2.type) {
                            cardOnHand[i].getChildByName("background").getChildByName('bg_black').active = false;
                            cardOnHand[j].getChildByName("background").getChildByName('bg_black').active = false;
                        }
                    }
                }
            }
        }
    },

    checkThreeTurnCard(cardOnHand, cardSuggestion, cardOnTable) {
        for (var i = 0; i < cardOnHand.length; i++) {
            cardOnHand[i].getChildByName("background").getChildByName('bg_black').active = true;
        }
        var d = 1;
        var listCard = [];
        listCard.push(cardOnHand[0]);
        var d = [];
        for (var i = 0; i < 100; i++) {
            d[i] = 0;
        }
        for (var i = 0; i < cardOnHand.length; i++) {
            d[Number(cardOnHand[i].getComponent("PhomCard").rank)]++;
        }

        for (var i = 0; i < 100; i++) {
            if (d[i] == 3 || d[i] == 4) {
                if (cardOnTable[0].rank == 1) {
                    if (i == 2) {
                        for (var j = 0; j < cardOnHand.length; j++) {
                            if (cardOnHand[j].getComponent("PhomCard").rank == i) {
                                cardOnHand[j].getChildByName("background").getChildByName('bg_black').active = false;
                            }
                        }
                    }
                } else if (cardOnTable[0].rank != 1 && cardOnTable[0].rank != 2) {
                    if (i > cardOnTable[0].rank) {
                        for (var j = 0; j < cardOnHand.length; j++) {
                            if (cardOnHand[j].getComponent("PhomCard").rank == i) {
                                cardOnHand[j].getChildByName("background").getChildByName('bg_black').active = false;
                            }
                        }
                    } else if (i == 1) {
                        for (var j = 0; j < cardOnHand.length; j++) {
                            if (cardOnHand[j].getComponent("PhomCard").rank == i) {
                                cardOnHand[j].getChildByName("background").getChildByName('bg_black').active = false;
                            }
                        }
                    }
                }

            }
        }
    },

    checkSanhTurnCard(cardOnHand, cardSuggestion, cardOnTable) {
        for (var i = 0; i < cardOnHand.length; i++) {
            cardOnHand[i].getChildByName("background").getChildByName('bg_black').active = true;
        }
        var clength = cardOnTable.length;
        var cmin = cardOnTable[0].rank;
        var cmax = cardOnTable[cardOnTable.length - 1].rank;
        var cmaxType = cardOnTable[cardOnTable.length - 1].type;
        var listCard = [];
        var d = 0;

        TLMNLogic.findSanh(clength, cardOnHand);

        for (var i = 0; i < cardOnHand.length; i++) {
            // var i = 0;
            // var vt = 0;
            // while(i<cardOnHand.length){
            if (cardOnHand[i].getComponent("PhomCard").rank >= cmin || cardOnHand[i].getComponent("PhomCard").rank == 1) {
                if (listCard.length == 0) {
                    listCard.push(cardOnHand[i]);
                    // vt = i;
                    d++;
                    // i++;
                } else {
                    cc.log("CARD ON HAND: ", cardOnHand[i].getComponent("PhomCard").rank - cardOnHand[i - 1].getComponent("PhomCard").rank);
                    if (cardOnHand[i].getComponent("PhomCard").rank - cardOnHand[i - 1].getComponent("PhomCard").rank == 1) {
                        if (d == clength) {
                            if (cardOnHand[i].getComponent("PhomCard").type > cmaxType) {
                                listCard.push(cardOnHand[i]);
                                d++;
                                // i++;
                            } else {
                                listCard.splice(0, 1);
                                d--;
                                // i = vt+1;
                                listCard = [];
                            }
                        } else {
                            listCard.push(cardOnHand[i]);
                            d++;
                            // i++;
                        }
                        cc.log("YES");
                    } else if (cardOnHand[i].getComponent("PhomCard").rank - cardOnHand[i - 1].getComponent("PhomCard").rank == -12) {

                        if (d == clength) {
                            if (cardOnHand[i].getComponent("PhomCard").type > cmaxType) {
                                listCard.push(cardOnHand[i]);
                                d++;
                                // i++;
                            } else {
                                listCard.splice(0, 1);
                                d--;
                                // i = vt+1;
                                listCard = [];
                            }
                        } else {
                            listCard.push(cardOnHand[i]);
                            d++;
                            // i++;
                        }
                        cc.log("YES_2 ", cardOnHand[i - 1].getComponent("PhomCard").rank - cardOnHand[i].getComponent("PhomCard").rank);
                    } else if (cardOnHand[i].getComponent("PhomCard").rank - cardOnHand[i - 1].getComponent("PhomCard").rank == 0) {
                        listCard.push(cardOnHand[i]);
                        // i++;
                        cc.log("YES_1");
                    } else if (cardOnHand[i].getComponent("PhomCard").rank - cardOnHand[i - 1].getComponent("PhomCard").rank > 1) {
                        d = 0;
                        // i++;
                        listCard = [];
                        listCard.push(cardOnHand[i]);
                    }
                }

                cc.log("LIST CARD CHECK: ", listCard);
            } else {
                // i++;
            }
            cc.log("D = ", d);
            if (d >= clength) {
                cc.log("D=====333333333");
                // for(var j=0; j<listCard.length; j++){
                //     listCard[j].getChildByName("background").getChildByName('bg_black').active = false;
                // }
                for (var k = 0; k < cardOnHand.length; k++) {
                    for (var j = 0; j < listCard.length; j++) {
                        if (cardOnHand[k].getComponent("PhomCard").rank == listCard[j].getComponent("PhomCard").rank &&
                            cardOnHand[k].getComponent("PhomCard").type == listCard[j].getComponent("PhomCard").type) {
                            cardOnHand[k].getChildByName("background").getChildByName('bg_black').active = false;
                        }
                    }
                }
            }
        }

        // for(var i=0; i<cardOnHand.length; i++){
        //     for(var j=0; j<listCard.length; j++){
        //         if(cardOnHand[i].getComponent("PhomCard").rank == listCard[j].getComponent("PhomCard").rank &&
        //         cardOnHand[i].getComponent("PhomCard").type == listCard[j].getComponent("PhomCard").type){
        //             cardOnHand[i].getChildByName("background").getChildByName('bg_black').active = false;
        //         }
        //     }
        // }
    },
    findSanh(clength, cardOnHand) {
        var arr = [];
        for (var i = 0; i < cardOnHand.length; i++) {
            var list = [];
            var d = 0;
            for (var j = i; j < cardOnHand.length; j++) {
                if (d == clength) {
                    arr.push(list);
                    break;
                }
                if (j == i) {
                    list.push(cardOnHand[j].getComponent("PhomCard").rank);
                    d++;
                } else {
                    if (cardOnHand[j].getComponent("PhomCard").rank - cardOnHand[j - 1].getComponent("PhomCard").rank == 1) {
                        list.push(cardOnHand[j].getComponent("PhomCard").rank);
                        d++;
                    }
                    if (cardOnHand[j].getComponent("PhomCard").rank - cardOnHand[j - 1].getComponent("PhomCard").rank == -12) {
                        list.push(cardOnHand[j].getComponent("PhomCard").rank);
                        d++;
                    } else if (cardOnHand[j].getComponent("PhomCard").rank - cardOnHand[j - 1].getComponent("PhomCard").rank == 0) {
                        list.push(cardOnHand[j].getComponent("PhomCard").rank);
                    } else if (cardOnHand[j].getComponent("PhomCard").rank - cardOnHand[j - 1].getComponent("PhomCard").rank > 1) {
                        break;
                    }
                }
            }
        }

        cc.log("FIND SANH: ", arr);
    },

    searchMax1(card1, card2) {
        if (card1.getComponent("PhomCard").type > card2.getComponent("PhomCard").type) return card1;
        return card2;
    },
    searchMax2(card1, card2) {
        if (card1.type > card2.type) return card1;
        return card2;
    },

    SortCard: function (type, cardList) {
        this.sort(cardList);
        var tempCardList = [];
        if (type == this.SortType.Doi) {
            tempCardList = this.SortCardByPair(cardList);
        } else if (type == this.SortType.Sanh) {
            tempCardList = this.SortCardByFlush(cardList);
        }
        return tempCardList;
    },

    SortCardByPair(cardList) {
        var list = [];
        var listNotPair = [];
        for (let i = 0; i < cardList.length;) {
            var newCardList = cardList.slice(i + 1, cardList.length);
            var destination = cardList[i].rank;
            var index = newCardList.findIndex(crr => crr.rank == destination);
            if (index >= 0) {
                list.push(cardList[i], newCardList[index]);
                i += 2;
                continue;
            } else {
                listNotPair.push(cardList[i]);
                i++;
                continue;
            }
        }
        return list.concat(listNotPair);
    },
    SortCardByFlush(cardList) {
        if (cardList) {
            var _dataSortArr = [];
            var _unSorted = [];
            var _dataCardObj = {};
            for (var i = 0; i < cardList.length; i++) {
                var rank = Number(cardList[i].rank);//rank sẽ là từ 3,4,5,6,7,8,9,10,11,12,13,1,2
                var suit = cardList[i].type;//hiện tại game mình sẽ có suit 1, 2, 3, 4 tương ứng tép, bích, rô, cơ
                var value = this.getIndexBySuitAndValue(rank, suit);
                if (value) {
                    value.card = cardList[i];
                    value._rank = (value._rank == 1) ? 14 : value._rank;//A
                    value._rank = (value._rank == 2) ? 15 : value._rank;//2
                    _dataSortArr.push(value);
                    _unSorted.push(value);
                    if (!_dataCardObj.hasOwnProperty(value.value)) {
                        _dataCardObj[value.value] = {}
                    }
                    _dataCardObj[value.value] = cardList[i];
                }
            }

            if (_unSorted.length == cardList.length) {
                var sortAscend = function (_unSorted) {
                    //quick sort = 1,1,2,3,4,5,5,6,6,7,8
                    var _sorted = _unSorted.sort(function (a, b) {
                        return a._rank > b._rank ? 1 : a._rank < b._rank ? -1 : 0;
                    });
                    if (_sorted) {
                        var _sortObj = {}
                        for (var j = 0; j < _sorted.length; j++) {
                            if (!_sortObj.hasOwnProperty(_sorted[j]._rank)) {
                                _sortObj[_sorted[j]._rank] = [];
                            }
                            if (_sortObj.hasOwnProperty(_sorted[j]._rank)) {
                                _sortObj[_sorted[j]._rank].push(_sorted[j]);
                            }
                        }
                        var _indexObj = [];
                        for (var key in _sortObj) {
                            if (_sortObj.hasOwnProperty(key)) {
                                _indexObj.push({ group: Number(key), elements: _sortObj[key] });
                            }
                        }
                        //sap xep chat bai
                        for (var o = 0; o < _indexObj.length; o++) {
                            _indexObj[o].elements = _indexObj[o].elements.sort(function (a, b) {
                                return a.value - b.value;
                            });
                        }
                        var asending = [_indexObj[0]];
                        for (var l = 1; l < _indexObj.length; l++) {
                            var _v = _indexObj[l].group;
                            if (_v - asending[asending.length - 1].group == 1) {
                                asending.push(_indexObj[l]);
                            } else if (_v - asending[asending.length - 1].group > 1) {
                                asending.push("|", _indexObj[l]);
                            }
                        }
                        asending.push("|");
                        var gasending = [];
                        var chunk = 0;
                        for (var m = 0; m < asending.length; m++) {
                            if (asending[m] == "|") {
                                gasending.push(asending.slice(chunk, m));
                                chunk = m + 1;
                            }
                        }
                        var validGroups = [];
                        if (gasending.length > 0 && gasending[0].length > 0) {
                            for (var n = 0; n < gasending.length; n++) {
                                if (gasending[n].length > 2) {
                                    validGroups.push(gasending[n]);
                                    gasending.splice(n, 1);
                                }
                            }
                        }
                        return { validGroups: validGroups, gasending: gasending };
                    }
                }
                var _stopSort = false;
                var _finalOdds = [];
                var _finalGroups = [];
                while (!_stopSort) {
                    var sortData = sortAscend(_unSorted);
                    var _gasending = sortData.gasending;
                    var _validGroups = sortData.validGroups;
                    var p = 0;
                    var x = 0;
                    var y = 0;
                    for (p = 0; p < _gasending.length; p++) {
                        if (_gasending[p]) {
                            for (x = 0; x < _gasending[p].length; x++) {
                                if (_gasending[p][x]) {
                                    if (_gasending[p][x].hasOwnProperty("elements")) {
                                        _finalOdds.push(_gasending[p][x].elements);
                                    }
                                }
                            }
                        }
                    }
                    p = 0;
                    x = 0;
                    y = 0;
                    for (p = 0; p < _validGroups.length; p++) {
                        if (_validGroups[p]) {
                            for (x = 0; x < _validGroups[p].length; x++) {
                                if (_validGroups[p][x]) {
                                    if (_validGroups[p][x].hasOwnProperty("elements")) {
                                        _finalGroups.push(_validGroups[p][x].elements[0]);
                                        _validGroups[p][x].elements.splice(0, 1);
                                    }
                                }
                            }
                        }
                    }
                    p = 0;
                    x = 0;
                    y = 0;
                    var _validGroupsTmp = [];
                    for (p = 0; p < _validGroups.length; p++) {
                        if (_validGroups[p]) {
                            for (x = 0; x < _validGroups[p].length; x++) {

                                if (_validGroups[p][x]) {
                                    if (_validGroups[p][x].hasOwnProperty("elements")) {
                                        for (y = 0; y < _validGroups[p][x].elements.length; y++) {
                                            _validGroupsTmp.push(_validGroups[p][x].elements[y]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (_validGroupsTmp.length > 0) {
                        _unSorted = _validGroupsTmp;
                        _stopSort = false;
                    } else {
                        _stopSort = true;
                    }
                }
                _finalOdds = _finalOdds.sort(function (a, b) {
                    return b.length - a.length;
                });
                var f = 0;
                for (f; f < _finalOdds.length; f++) {
                    _finalOdds[f] = _finalOdds[f].sort(function (a, b) {
                        return a.value - b.value;
                    })
                }
                _finalOdds = Utils.Malicious.flattern(_finalOdds);
                var _rTmp = Utils.Malicious.flattern([_finalGroups, _finalOdds]);
                var _result = [];
                var _tailArrs = [];
                f = 0;
                for (f; f < _rTmp.length; f++) {
                    if (_rTmp[f]._rank == 15) {
                        _tailArrs.push(_rTmp[f])
                    } else {
                        _result.push(_rTmp[f].card);
                    }
                }
                _tailArrs = _tailArrs.sort(function (a, b) {
                    return b.value - a.value;
                });
                var _tails = [];
                f = 0;
                for (f; f < _tailArrs.length; f++) {
                    _tails.push(_tailArrs[f].card);
                }
                _result = Utils.Malicious.flattern([_result, _tails]);
                if (_result.length == cardList.length) {
                    return _result;
                }
            }
        }
        return this.sort(cardList);
    },

    createDecks: function () {
        //hàm tạo bộ bài để test game deck.sss
        cc.error("Creating card deck...");
        for (var i = 0; i < this.ranks.length; i++) {
            for (var j = 0; j < this.suits.length; j++) {
                var _v = this.suits[j] + this.ranks[i];
                var _c = this.suits.length * i + j;
                cc.error("View: " + _v + ", Value: " + _c);
            }
        }
    },
    getIndexBySuitAndValue: function (value, suit) {
        suit = Number(suit);
        value = Number(value);
        if (suit && value && isNaN(value) == false && isNaN(suit) == false) {

            var _Esuits = [1, 2, 3, 4];
            var _Evalues = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2];
            var _indexOfSuit = _Esuits.indexOf(suit);
            var _indexOfValues = _Evalues.indexOf(value);
            if (_indexOfSuit != -1 && _indexOfValues != -1) {
                var _v = this.ranks[_indexOfValues] + this.suits[_indexOfSuit];
                var _c = this.suits.length * _indexOfValues + _indexOfSuit;
                _c = Number(parseInt(_c));
                if (isNaN(_c) == false) {
                    return {
                        value: _c,
                        suit: this.suits[_indexOfSuit],
                        rank: this.ranks[_indexOfValues],
                        _rank: value == 1 ? 14 : value,
                        _type: suit
                    };
                }
            }
        }
        return null;
    }

}
module.exports = TLMNLogic;