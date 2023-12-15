var CardUtils = require('CardUtils');
var PhomCard = require('PhomCard');
var PhomObj = require('PhomObj');
var PhomConstant = require('PhomConstant');
var Linker = require('Linker');
var logicPhom =  require('newLogicPhom');
var PhomLogic = {

    findCard(card, list) {
        if(card){
            for (var i = 0; i < list.length; i++) {
                if (list[i].serverValue == card.serverValue) {
                    return i;
                }
            }
            return -1;
        }
    },
    findPhomByType(listCard, maxLength = 3) {
        var tempCard = listCard.slice(0);
        this.sortCardByType(tempCard)
        var phomResult = [];
        var phomCard = [];
        var listType = this.findListType(tempCard);
        //cc.log(listType);
        for (var i = 0; i < listType.length; i++) {
            for (var j = 0; j < listType[i].length; j++) {
                // //cc.log("rank", listType[i][j].rank);
                if (phomCard.length == 0) {
                    phomCard.push(listType[i][j]);
                }
                ////cc.log("BEFORE", phomCard.length);
                var test = phomCard[phomCard.length - 1];
                if (j < (listType[i].length - 1)) {
                    if ((listType[i][j + 1].rank - test.rank) == 1) {

                        phomCard.push(listType[i][j + 1]);
                        ////cc.log("TRUE", phomCard.length);
                    } else {
                        if (phomCard.length >= maxLength) {
                            phomResult.push(phomCard);
                            phomCard = [];
                        } else {
                            phomCard = [];
                        }
                        ////cc.log("FALSE", phomCard.length);
                    }
                } else {
                    // if (listType[i][j].rank == 13 && phomCard.length >= 2 && listType[i][0].rank == 1 ) {

                    //         phomCard.push(listType[i][0]);

                    // }
                    if (phomCard.length >= maxLength) {
                        phomResult.push(phomCard);
                        phomCard = [];
                    } else {
                        phomCard = [];
                    }
                    ////cc.log("FALSE", phomCard.length);
                }

            }
            phomCard = [];
        }
        //cc.log("PHOM", phomResult)
        return phomResult;

    },
    findListType(listCard) {
        var result = [];
        for (var i = 0; i < 4; i++) {
            result[i] = [];
        }
        for (var j = 0; j < listCard.length; j++) {
            switch (listCard[j].type) {
                case 1: {
                    result[0].push(listCard[j]);
                    break;
                }
                case 2: {
                    result[1].push(listCard[j]);
                    break;
                }
                case 3: {
                    result[2].push(listCard[j]);
                    break;
                }
                case 4: {
                    result[3].push(listCard[j]);
                    break;
                }
            }
        }
        for (var i = 0; i < result.length; i++) {
            this.sortCardByRankIncrease(result[i]);
        }
        return result;
    },
    findPhomByRank(listCard, maxLength = 3) {
        var tempCard = listCard.slice(0);
        this.sortCardByRankIncrease(tempCard)
        var phomResult = [];
        var phomCard = [];
        ////cc.log(tempCard);
        for (var i = 0; i < tempCard.length; i++) {
            if (i < (tempCard.length - 1)) {
                if (phomCard.length == 0) {
                    phomCard.push(tempCard[i]);
                }
                ////cc.log("BEFORE", phomCard.length);
                var test = phomCard[phomCard.length - 1];
                if (test.rank == tempCard[i + 1].rank) {
                    phomCard.push(tempCard[i + 1]);
                    // //cc.log("TRUE",phomCard.length);
                } else {
                    if (phomCard.length >= maxLength) {
                        phomResult.push(phomCard);
                        phomCard = [];
                    } else {
                        phomCard = [];
                    }
                    // //cc.log("FALSE", phomCard.length);
                }
            } else {
                if (phomCard.length >= maxLength) {
                    phomResult.push(phomCard);
                    phomCard = [];
                } else {
                    phomCard = [];
                }
                ////cc.log("FALSE", phomCard.length);
            }

        }
        return phomResult;
    },
    findPairByType(listCard) {
        var tempCard = listCard.slice(0);
        this.sortCardByType(tempCard);
        var listType = this.findListType(tempCard);
        var pairResult = [];

        var singleCard = [];
        for (var i = 0; i < listType.length; i++) {
            var pair = [];
            for (var j = 0; j < listType[i].length; j++) {
                if (pair.length == 0) {
                    pair.push(listType[i][j]);
                }
                if (j < (listType[i].length - 1)) {

                    var test = pair[pair.length - 1];
                    //cc.log("ABS", Math.abs(test.rank - listType[i][j + 1].rank));
                    if (Math.abs(test.rank - listType[i][j + 1].rank) == 1 || Math.abs(test.rank - listType[i][j + 1].rank) == 2) {
                        pair.push(listType[i][j + 1]);
                        if (pair.length == 2) {
                            pairResult.push(pair);
                            pair = [];
                        }
                    } else {
                        if (false) {
                            pairResult.push(pair);
                            pair = [];
                        } else {
                            singleCard.push(pair.pop());
                            pair = [];
                        }


                        // //cc.log("FALSE", phomCard.length);
                    }
                } else {
                    if (pair.length == 2) {
                        pairResult.push(pair);
                        pair = [];
                    } else {
                        singleCard.push(pair.pop());
                        pair = [];
                    }
                }
            }

        }
        //cc.log("SINGLE", singleCard);
        return pairResult;

    },
    findPairByRank(listCard) {
        var tempCard = listCard.slice(0);
        this.sortCardByRankIncrease(tempCard);
        var pairResult = [];
        var pair = [];
        var singleCard = [];
        for (var i = 0; i < tempCard.length; i++) {
            if (i < (tempCard.length - 1)) {
                if (pair.length == 0) {
                    pair.push(tempCard[i]);
                }
                var test = pair[pair.length - 1];
                if (test.rank == tempCard[i + 1].rank) {
                    pair.push(tempCard[i + 1]);
                    // //cc.log("TRUE",phomCard.length);
                } else {
                    if (pair.length == 2) {
                        pairResult.push(pair);
                        pair = [];
                    } else {
                        singleCard.push(tempCard[i + 1]);
                        pair = [];
                    }
                    // //cc.log("FALSE", phomCard.length);
                }
            } else {
                if (pair.length == 2) {
                    pairResult.push(pair);
                    pair = [];
                } else {
                    singleCard.push(tempCard[i + 1]);
                    pair = [];
                }
            }
        }
        return pairResult;
    },
    isPhom(listCard) {

    },
    resetCard(listCard) {

    },
    sortCardByRankIncrease(listCard) {
        var compare = function (lhs, rhs) {
            if (lhs.rank < rhs.rank) {
                return -1;
            } else if (lhs.rank > rhs.rank) {
                return 1;
            } else {
                if (lhs.type < rhs.type) {
                    return -1;
                } else if (lhs.type > rhs.type) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
        listCard.sort(compare);
        return listCard;

    },
    sortCardByRankDecrease(listCard) {
        var compare = function (lhs, rhs) {
            if (lhs.rank > rhs.rank) {
                return -1;
            } else if (lhs.rank < rhs.rank) {
                return 1;
            } else {
                if (lhs.type < rhs.type) {
                    return -1;
                } else if (lhs.type > rhs.type) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
        listCard.sort(compare);
        return listCard;

    },
    sortCardByType(listCard) {
        var compare = function (o1, o2) {
            if (o1.type < o2.type) {

                return -1;
            } else if (o1.type > o2.type) {

                return 1;
            } else {

                if (o1.rank < o2.rank) {

                    return -1;
                } else {

                    return 1;
                }
            }
        }
        listCard.sort(compare);
        return listCard;
    },
    checkEatCard(card, myCard, eatCard, type = 0) {
        //return this.checkEatPhom(myCard, card, listTaken, type);

        //TrungCode
        var listCard = logicPhom.parse_MylstCard(myCard);
        var listAnGa = logicPhom.parse_MylstCard(eatCard);
        var convertCard = Number(card.rank) * 4 + (Number(card.type) -1);
        return logicPhom.checkAnGa(listCard,listAnGa,convertCard);
    },
    findDuplicate(list1, list2) {
        var listCard1 = list1.slice(0);
        var listCard2 = list2.slice(0);
        var result = [];
        //cc.log(list1, list2);
        listCard1.forEach(element => {
            listCard2.forEach((element1) => {
                if (element.serverValue == element1.serverValue) {
                    result.push(element);
                }
            })
        });
        return result;
    },
    getTotalScore(listCard) {
        var sum = 0;
        listCard.forEach((element) => {
            sum = sum + Number(element.rank);
        });
        return sum;
    },
    sort(myCard, eatCard, type = 0) {
        // var checkList = myCard.slice(0);
        // var phomList = [];
        // var pairListType = [];
        // var pairListRank = [];
        // var singleCard = [];
        // var finalCard = [];
        // var finalPhom = [];
        // var finalPair = [];
        // var finalSingleCard = [];
        // phomList = this.final_finalPhom(checkList, eatCard, type).totalPhom;
        // //cc.log(phomList.length);
        // finalPhom = phomList.slice(0);
        // //cc.log("FINAL_PHOM", finalPhom);
        // singleCard = this.getRemainCardAfterPhom(finalPhom, checkList);
        // //cc.log("SINGLE", singleCard);
        // var rand = Math.round(Math.random());
        // if (type == 0) {
        //     pairListRank = this.findPairByRank(singleCard);
        // } else {
        //     pairListRank = this.findPairByType(singleCard);
        // }

        // //cc.log("FINAL_PAIR", pairListRank);
        // var singleCardPairRank = this.getRemainCardAfterPhom(pairListRank, singleCard);
        // //cc.log("SINGLE_PAIR", singleCardPairRank);
        // if (type == 0) {
        //     pairListType = this.findPairByType(singleCardPairRank);

        // } else {
        //     pairListType = this.findPairByRank(singleCardPairRank);

        // }

        // var singleCardPairType = this.getRemainCardAfterPhom(pairListType, singleCardPairRank);
        // //cc.log("SINGLE_PAIR_TYPE", singleCardPairType);
        // this.sortCardByRankIncrease(singleCardPairType);
        // finalPhom.forEach((element) => {
        //     finalCard.push(...element);
        // });
        // pairListRank.forEach((element) => {
        //     finalCard.push(...element);
        // });
        // pairListType.forEach((element) => {
        //     finalCard.push(...element);
        // });
        // finalCard.push(...singleCardPairType);
        // finalCard = this.removeDuplicateListCard(finalCard);
        // //cc.log("FINAl", finalCard, finalCard.length);
        // return finalCard;

        //TrungCode
        var listCard = logicPhom.parse_MylstCard(myCard);
        var listAnGa = logicPhom.parse_MylstCard(eatCard);
        var lstPhom = logicPhom.xepBai(listCard, listAnGa,type);
        var lstConvert = logicPhom.convert_SeverCard(lstPhom);
        return logicPhom.foothold(myCard, lstConvert);
    },
    removePhomDuplicate(finalPhomResult, singleCard, phomA, phomB, isRandom = false) {
        var dupCardList = this.findDuplicate(phomA, phomB);
        if (dupCardList.length > 0) {
            var phom1Score = this.getTotalScore(phomA);
            var phom2Score = this.getTotalScore(phomB);
            var destroyPhom = null;
            if (isRandom) {
                var random_boolean = Math.random() >= 0.5;
                if (random_boolean) {
                    finalPhomResult.push(phomB);
                    destroyPhom = phomA;
                } else {
                    finalPhomResult.push(phomA);
                    destroyPhom = phomB;
                }
            } else {
                if (phom2Score - phom1Score > 0) {
                    finalPhomResult.push(phomB);
                    destroyPhom = phomA;
                } else {
                    finalPhomResult.push(phomA);
                    destroyPhom = phomB;
                }
            }

            destroyPhom.forEach((element) => {
                var count = 0;
                dupCardList.forEach((element1) => {
                    if (element.serverValue != element1.serverValue) {
                        count++;
                    } else {
                        count = 0;
                    }
                });
                if (count == dupCardList.length) {
                    singleCard.push(element);
                };
            })
        } else {
            finalPhomResult.push(phomA);
            finalPhomResult.push(phomB);
        }
    },
    removePairDuplicate(finalPairResult, singleCard, pairA, pairB, isRandom) {
        var dupCardList = this.findDuplicate(pairA, pairB);
        if (dupCardList.length > 0) {
            var phom1Score = this.getTotalScore(pairA);
            var phom2Score = this.getTotalScore(pairB);
            var destroyPhom = null;
            if (isRandom) {
                var random_boolean = Math.random() >= 0.5;
                if (random_boolean) {
                    finalPairResult.push(pairB);
                    destroyPhom = pairA;
                } else {
                    finalPairResult.push(pairA);
                    destroyPhom = pairB;
                }
            } else {
                if (phom2Score - phom1Score > 0) {
                    finalPairResult.push(pairB);
                    destroyPhom = pairA;
                } else {
                    finalPairResult.push(pairA);
                    destroyPhom = pairB;
                }
            }

            destroyPhom.forEach((element) => {
                var count = 0;
                dupCardList.forEach((element1) => {
                    if (element.serverValue != element1.serverValue) {
                        count++;
                    } else {
                        count = 0;
                    }
                });
                if (count == dupCardList.length) {
                    singleCard.push(element);
                };
            })
        } else {
            finalPairResult.push(pairA);
            finalPairResult.push(pairB);
        }
    },
    removeDuplicateListCard(listCard) {
        listCard.forEach((element) => {
            //cc.log("TEST_", element.serverValue);
        });
        var temp = listCard.slice(0);
        var unique = temp
            .map(e => e['serverValue'])

            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) == i && i)

            // eliminate the dead keys & store unique objects
            .filter(e => temp[e]).map(e => temp[e]);

        return unique;

        // var reslut = [];
        // var test = temp[0];
        // reslut.push(test);
        // for (var i = 1; i < temp.length; i++){
        //     if (temp[i].serverValue != test.serverValue) {
        //         reslut.push(temp[i]);
        //         test = temp[i];
        //     }
        // }
        // return result;
    },
    getRemainCardAfterPhom(listPhom, listCard) {
        var reslut = [];
        var listPhomCard = [];
        listPhom.forEach((element) => {
            listPhomCard.push(...element);
        });
        listPhomCard = this.removeDuplicateListCard(listPhomCard);
        listCard.forEach((element) => {
            var count = 0;
            listPhomCard.forEach((element1) => {
                if (element.serverValue != element1.serverValue) {
                    count++;
                } else {
                    count = 0;
                }
            });
            if (count == listPhomCard.length) {
                reslut.push(element);
            };
        })

        return reslut;
    },
    findEatPhom(eatCardList, listCard) {
        var checkList = listCard.slice(0);
        // //cc.log(card, myCard);
        var findPhomByRank = this.findPhomByRank(checkList);
        var findPhomByType = this.findPhomByType(checkList);
        //cc.log("findPhomByRank", findPhomByRank.length);
        //cc.log("findPhomByType", findPhomByType.length);
        var totalPhom = [];
        for (var i = 0; i < findPhomByRank.length; i++) {
            totalPhom.push(findPhomByRank[i]);
        }
        for (var i = 0; i < findPhomByType.length; i++) {
            totalPhom.push(findPhomByType[i]);
        };
        //cc.log("TOTAL_PHOM", totalPhom);
        var finalPhom = [];
        var resultFinal = [];
        eatCardList.forEach((card) => {
            var check = [];
            var checkResult = [];
            var singleCardResult = [];
            for (var i = 0; i < totalPhom.length; i++) {
                if (this.findCard(card, totalPhom[i]) >= 0) {
                    check.push(totalPhom[i]);
                } else {
                    // remainPhom.push(totalPhom[i]);
                }

            };
            if (check.length >= 2) {
                var phom = this.getPhomMax(check);
                if (phom) {
                    finalPhom.push(phom);
                }

            } else {
                finalPhom.push(...check);
            }

        });
        if (finalPhom.length == 0) {
            finalPhom.push(...totalPhom);
        }
        var temp = [];

        for (var i = 0; i < finalPhom.length; i++) {
            if (temp.length == 0) {
                temp.push(finalPhom[i]);
            }
            if (!this.compare(temp[temp.length - 1], finalPhom[i])) {
                temp.push(finalPhom[i]);
                //cc.log("OK");
            } else {
                //cc.log("_OK");
            }
        }
        var singleCard = this.getRemainCardAfterPhom(temp, checkList);
        var remainPhom = [];
        findPhomByRank = this.findPhomByRank(singleCard);
        findPhomByType = this.findPhomByType(singleCard);
        //cc.log("findPhomByRank", findPhomByRank.length);
        //cc.log("findPhomByType", findPhomByType.length);
        for (var i = 0; i < findPhomByRank.length; i++) {
            remainPhom.push(findPhomByRank[i]);
        }
        for (var i = 0; i < findPhomByType.length; i++) {
            remainPhom.push(findPhomByType[i]);
        };
        //cc.log("REMAIN_PHOM", remainPhom);
        // for (var i = 0; i < totalPhom.length; i++) {
        //     var count = 0;
        //     for (var j = 0; j < temp.length; j++){
        //          if (!this.compare(totalPhom[i], temp[j])) {
        //              count++;
        //          } else {
        //              count = 0;
        //          }
        //     }
        //     if (count == temp.length) {
        //         remainPhom.push(totalPhom[i]);
        //     }
        // }
        temp.push(...remainPhom);
        // hanler 4 card split;
        if (temp.length > 1) {
            //cc.log("TEMP", temp);
            finalPhom = [];
            temp.forEach((item, pos) => {
                if (this.isTypeValue(item)) {
                    if (item.length == 4) {
                        temp.forEach((item1, pos1) => {
                            if (pos != pos1) {
                                var result = this.findDuplicate(item, item1);
                                if (result.length == 1) {
                                    var index = this.findCard(result[0], item);
                                    if (index != -1) {

                                        // finalPhom.push(item.slice(index, 1));
                                        //cc.log("ADĐ_", index);
                                        var sli = item.slice(0);
                                        //cc.log("SlIDE", sli.splice(index, 1));
                                        finalPhom.push(sli);
                                    } else {
                                        //cc.log("ERROR", index);
                                    }

                                } else {
                                    finalPhom.push(item);
                                }
                            }
                        })
                    } else {
                        // temp.forEach((item1, pos1) => {
                        //     if (pos != pos1) {
                        //         var result = this.findDuplicate(item, item1);
                        //         if (result.length > 0) {
                        //             if (this.getTotalScore(item) > this.getTotalScore(item1)) {
                        //                 finalPhom.push(item);
                        //             } else {
                        //                 finalPhom.push(item1);
                        //             }

                        //         } else {
                        //             // finalPhom.push(item);
                        //         }
                        //     }
                        // })

                    }
                    //cc.log("BBBBBB");
                } else {
                    //cc.log("AAAAAAA");
                    finalPhom.push(item);
                }
            });
            //cc.log("AAAAAA", finalPhom.length);
            temp = [];

            for (var i = 0; i < finalPhom.length; i++) {
                if (temp.length == 0) {
                    temp.push(finalPhom[i]);
                }
                if (!this.compare(temp[temp.length - 1], finalPhom[i])) {
                    temp.push(finalPhom[i]);

                } else {

                }
            }
            finalPhom = temp.slice(0);
        } else {
            finalPhom = [];
            finalPhom.push(...temp);
            // //cc.log("EMPTY", temp);
        }
        //cc.log("FINAL_PHOM", finalPhom);
        return finalPhom;

    },
    getPhomMax(listPhom) {
        var max = 0;
        var result = null;
        listPhom.forEach((phom, pos) => {
            if (this.getTotalScore(phom) > max) {
                max = this.getTotalScore(phom);
                result = phom;
            }
        })
        return result;
    },
    getPhomMin(listPhom) {
        var max = 10000;
        var result = null;
        listPhom.forEach((phom, pos) => {
            if (this.getTotalScore(phom) < max) {
                max = this.getTotalScore(phom);
                result = phom;
            }
        })
        return result;
    },
    compare(phomA, phomB) {
        if (phomA.length == phomB.length) {
            for (var i = 0; i < phomA.length; i++) {
                if (phomA[i].serverValue != phomB[i].serverValue) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }


    },
    isTypeValue(phom) {
        var rank = phom[0].rank;
        for (var i = 0; i < phom.length; i++) {
            if (phom[i].rank == rank) {

            } else {
                return false;
            }
        }
        return true;
    },
    checkU(pPhomList, pCardList, pDaHaPhomList, numTakenCard) {
        if (pPhomList == null) {

            return null;
        }
        var result = null;
        var tempCard = pCardList.slice(0);
        if (pDaHaPhomList == null || pDaHaPhomList.length < 1) {

            if (pPhomList.length == 3) {

                var card = null;
                tempCard = this.final_getRemainCardAfterPhom(pPhomList, pCardList.slice(0));
                //cc.log("TEMP_CARD", tempCard);
                if (tempCard.length > 0) {

                    card = tempCard[0];
                    if (numTakenCard > 2) {

                        result = {
                            uType: PhomConstant.U_TYPE.U_DEN,
                            card: card
                        };
                    } else {

                        result = {
                            uType: PhomConstant.U_TYPE.U_THUONG,
                            card: card
                        };
                    }
                } else {

                    if (numTakenCard > 2) {

                        result = {
                            uType: PhomConstant.U_TYPE.U_DEN,
                            card: card
                        };
                    } else {

                        result = {
                            uType: PhomConstant.U_TYPE.U_TRON,
                            card: card
                        };
                    }
                }
            } else {

                var total = pCardList.length;
                tempCard = this.getRemainCardAfterPhom(pPhomList, pCardList.slice(0));

                if (total == 10) {

                    if (tempCard.length == 1) {

                        result = {
                            uType: PhomConstant.U_TYPE.U_THUONG,
                            card: tempCard[0]
                        };
                    } else if (tempCard.length == 0) {

                        result = {
                            uType: PhomConstant.U_TYPE.U_TRON,
                            card: null
                        };
                    }
                } else if (total == 9) {

                    if (tempCard.length == 0) {

                        result = {
                            uType: PhomConstant.U_TYPE.U_THUONG,
                            card: null
                        };
                    }
                }
            }
        } else {
            if (pDaHaPhomList.length == 2) {

                var card = null;
                if (pPhomList.length == 1) {

                    tempCard = this.getRemainCardAfterPhom(pPhomList, pCardList.slice(0));
                }
                if (tempCard.length > 0) {

                    card = tempCard[0];
                    if (numTakenCard > 2) {

                        result = {
                            uType: PhomConstant.U_TYPE.U_DEN,
                            card: card
                        };
                    } else {

                        result = {
                            uType: PhomConstant.U_TYPE.U_THUONG,
                            card: card
                        };
                    }
                } else {

                    if (numTakenCard > 2) {

                        result = {
                            uType: PhomConstant.U_TYPE.U_DEN,
                            card: card
                        };
                    } else {

                        result = {
                            uType: PhomConstant.U_TYPE.U_TRON,
                            card: card
                        };
                    }
                }
            }
        }

        return result;
    },
    checkUKhan(pCardList) {
        if (pCardList.length < 9) {

            return false;
        }

        var first;
        var second;
        for (var i = 0, t = pCardList.length; i < t - 1; i++) {

            first = pCardList[i];
            for (var j = i + 1; j < t; j++) {

                second = pCardList[j];
                if (first.rank == second.rank) {
                    return false;
                }

                if (Math.abs(first.rank - second.rank) < 3 && first.type == second.type) {
                    return false;
                }
            }
        }

        return true;
    },
    findLockCard(eatCardList, listCard, type = 0) {
        var checkList = listCard.slice(0);
        // // //cc.log(card, myCard);
        // var findPhomByRank = this.findPhomByRank(checkList);
        // var findPhomByType = this.findPhomByType(checkList);
        // //cc.log("findPhomByRank", findPhomByRank.length);
        // //cc.log("findPhomByType", findPhomByType.length);
        // var totalPhom = [];
        // for (var i = 0; i < findPhomByRank.length; i++) {
        //     totalPhom.push(findPhomByRank[i]);
        // }
        // for (var i = 0; i < findPhomByType.length; i++) {
        //     totalPhom.push(findPhomByType[i]);
        // };
        // //cc.log("TOTAL_PHOM", totalPhom);
        // var finalPhom = [];
        // var resultFinal = [];
        // eatCardList.forEach((card) => {
        //     var check = [];
        //     for (var i = 0; i < totalPhom.length; i++) {
        //         if (this.findCard(card, totalPhom[i]) >= 0) {
        //             check.push(totalPhom[i]);
        //         } else {
        //             // remainPhom.push(totalPhom[i]);
        //         }

        //     };
        //     if (check.length >= 2) {
        //         var phom = this.getPhomMax(check);
        //         if (phom) {
        //             finalPhom.push(phom);
        //         }

        //     } else {
        //         finalPhom.push(...check);
        //     }

        // });
        // if (finalPhom.length == 0) {
        //     finalPhom.push(...totalPhom);
        // }
        // var temp = [];

        // for (var i = 0; i < finalPhom.length; i++) {
        //     if (temp.length == 0) {
        //         temp.push(finalPhom[i]);
        //     }
        //     if (!this.compare(temp[temp.length - 1], finalPhom[i])) {
        //         temp.push(finalPhom[i]);
        //         //cc.log("OK");
        //     } else {
        //         //cc.log("_OK");
        //     }
        // }
        // var lockCard = [];
        // temp.forEach((element) => {
        //     lockCard.push(...element);
        // })
        // return lockCard;
        var totalPhom = this.findHaPhomCard(eatCardList, checkList, type);
        var lockCard = [];
        eatCardList.forEach((card) => {

            for (var i = 0; i < totalPhom.length; i++) {
                if (this.findCard(card, totalPhom[i]) >= 0) {
                    lockCard.push(...totalPhom[i]);
                } else {
                    // remainPhom.push(totalPhom[i]);
                }

            };


        });
        lockCard = this.removeDuplicateListCard(lockCard);
        return lockCard;
    },
    convertToLogic(lst){
        return logicPhom.parse_MylstCard(lst);
    },
    findHaPhomCard(eatCard, myCard, type) {
        //var result = this.final_finalPhom(myCard, eatCard, type).totalPhom;
        //TrungCode
        var result = [];
        var listCard = logicPhom.parse_MylstCard(myCard);
        var listAnGa = logicPhom.parse_MylstCard(eatCard);
        var lstPhom = logicPhom.haPhom(listCard, listAnGa);
        lstPhom.forEach(phom=>{
            var lstConvert = logicPhom.convert_SeverCard(phom);
            result.push(logicPhom.foothold(myCard, lstConvert));
        });
        return result;
    },
    checkDanhBai(myCard,eatCard,oldCard){
        var listCard = logicPhom.parse_MylstCard(myCard);
        var listAnGa = logicPhom.parse_MylstCard(eatCard);
        var convertCard = Number(oldCard.rank) * 4 + (Number(oldCard.type) -1); 
        return logicPhom.checkDanhBai(listCard,listAnGa,convertCard);
    },
    checkU2(eatCard, myCard,newFirstTurn){
        //TrungCode
        var listCard = logicPhom.parse_MylstCard(myCard);
        var listAnGa = logicPhom.parse_MylstCard(eatCard);
        var lstPhom = logicPhom.findPhom(listCard, listAnGa);
        var uData = null;
        if(myCard.length - lstPhom.length < 2){
            // thỏa mãn ù
            var card = null;
            var lstConvert = logicPhom.convert_SeverCard(lstPhom);
            myCard.forEach(item=>{
                if(lstConvert.indexOf(Number(item.serverValue))  < 0){
                    card = item;
                }
            });
            if(listAnGa.length > 2){
                uData = {
                    uType: PhomConstant.U_TYPE.U_DEN,
                    card: card
                }
            }else if(newFirstTurn){
                uData = {
                    uType: PhomConstant.U_TYPE.U_TRON,
                    card: card
                }
            }
            else{
                uData = {
                    uType: PhomConstant.U_TYPE.U_THUONG,
                    card: card
                }
            }
        }
        return uData;
    },
    //////////////
    final_finalPhom(listCard, listTaken, type = 0) {
        var result = this.final_findFirstPhom(listCard, type, listTaken[0]);
        var firstPhom = result.firstPhom;
        var leftCard = result.leftCard;
        var totalPhom = [];

        if (firstPhom == null) {
            // //cc.log("FIRST", result);
            var rs = {
                totalPhom: [],
                leftCard: leftCard,
            };
            return rs;
        }
        var split = this.splitLongRankPhom(firstPhom, leftCard, listCard, listTaken[1]);
        totalPhom.push(...split.phomList);
        leftCard = split.leftCard;
        //cc.log("FIRST", totalPhom, leftCard);

        result = this.final_findFirstPhom(leftCard, type, listTaken[1]);
        var secondPhom = result.firstPhom;
        leftCard = result.leftCard;
        if (secondPhom == null) {
            // //cc.log("SECOND", result);
            var rs = {
                totalPhom: totalPhom,
                leftCard: leftCard,
            };
            return rs;
        }
        split = this.splitLongRankPhom(secondPhom, leftCard, leftCard, listTaken[2]);
        totalPhom.push(...split.phomList);

        leftCard = split.leftCard;
        //cc.log("SECOND", totalPhom, leftCard.length, leftCard);
        result = this.final_findFirstPhom(leftCard, type, listTaken[2]);
        var thirdPhom = result.firstPhom;
        leftCard = result.leftCard;
        //cc.log("SECOND", totalPhom, leftCard.length, leftCard, result);
        if (thirdPhom == null) {
            // //cc.log("THIRD", result);
            var rs = {
                totalPhom: totalPhom,
                leftCard: leftCard,
            }
            return rs;

        }

        // split = this.splitLongRankPhom(thirdPhom, leftCard, leftCard, listTaken[2]);
        totalPhom.push(...split.phomList);
        leftCard = split.leftCard;
        //cc.log("THIRD", totalPhom, leftCard);

        //cc.log("FINAL", totalPhom);
        var rs = {
            totalPhom: totalPhom,
            leftCard: leftCard,
        }
        return rs;
    },
    splitLongRankPhom(phom, leftCard, listCard, nextCardTaken = null) {
        var final = [];

        if (this.isTypeValue(phom)) {

            if (phom.length == 4) {
                if (this.findPairByType(leftCard).length != 0) {
                    for (var i = 0; i < phom.length; i++) {

                        var test = leftCard.slice(0);
                        test.push(phom[i]);
                        var reslut = this.findPhomByType(test);
                        if (reslut.length > 0) {
                            //cc.log("TEST___");
                            var second = reslut[0];
                            //cc.log("SECOND_____PHOM", second, reslut.length, reslut, test);
                            var temp = phom.slice(0);
                            // var split = temp.splice(i, 1);
                            var index = this.findCard(phom[i], temp);
                            if (index != -1) {

                                // finalPhom.push(item.slice(index, 1));
                                //cc.log("ADĐ_", index);
                                var sli = phom.slice(0);
                                //cc.log("SlIDE", sli.splice(index, 1));
                                final.push(sli);
                            }

                            // final.push(split);
                            final.push(second);
                            var leftCard1 = this.final_getRemainCardAfterPhom(final, listCard);
                            //cc.log("PHOM 4", final, phom);
                            var rs = {
                                phomList: final,
                                leftCard: leftCard1,
                            };
                            return rs;
                        }
                        //cc.log("BBBBB");
                    }
                }

                final.push(phom);
                var rs = {
                    phomList: final,
                    leftCard: leftCard,
                };
                return rs;
            } else {
                final.push(phom);
                var rs = {
                    phomList: final,
                    leftCard: leftCard,
                };
                return rs;

            }

        } else {
            return this.splitLongTypePhom(phom, leftCard, listCard, nextCardTaken);
        }
    },
    splitLongTypePhom(phom, leftCard, listCard, nextCardTaken = null) {
        var final = [];
        if (phom.length >= 4) {
            if (this.findPhomByRank(leftCard).length == 0) {
                for (var i = 0; i < phom.length; i++) {

                    var test = leftCard.slice(0);
                    test.push(phom[i]);
                    var reslut = this.findPhomByRank(test);
                    if (reslut.length > 0) {
                        //cc.log("TEST___");
                        var second = reslut[0];
                        var temp = phom.slice(0);
                        // var split = temp.splice(i, 1);
                        var index = this.findCard(phom[i], temp);
                        var singleCard = [];
                        if (index != -1) {

                            // finalPhom.push(item.slice(index, 1));
                            //cc.log("ADĐ_", index);
                            var sli = phom.slice(0);
                            //cc.log("SlIDE", sli.splice(index, 1));
                            // final.push(sli);
                            var phomAfter = this.findPhomByType(sli);
                            if (phomAfter.length > 0) {
                                final.push(second);
                                final.push(phomAfter[0]);
                                var leftCard1 = this.final_getRemainCardAfterPhom(final, listCard);
                                //cc.log("PHOM_______123", final, phom, leftCard.length);
                                if (nextCardTaken != null) {
                                    var checkSecondPhom = this.findPhomByRank(leftCard1);
                                    checkSecondPhom.push(...this.findPhomByType(leftCard1));
                                    if (checkSecondPhom.length == 0) {
                                        final = [];
                                        final.push(phom);
                                        var rs = {
                                            phomList: final,
                                            leftCard: leftCard,
                                        };
                                        return rs;
                                    } else {
                                        
                                        var rs = {
                                            phomList: final,
                                            leftCard: leftCard1,
                                        };
                                        return rs;
                                    }
                                    
                                    



                                } else {
                                     var rs = {
                                         phomList: final,
                                         leftCard: leftCard1,
                                     };
                                     return rs;
                                }
                                

                                
                            } else {
                                if (this.getTotalScore(second) > this.getTotalScore(phom)) {
                                    final.push(second);
                                    var leftCard1 = this.final_getRemainCardAfterPhom(final, listCard);
                                    //cc.log("PHOM 4", final, phom);
                                    var rs = {
                                        phomList: final,
                                        leftCard: leftCard1,
                                    };
                                    return rs;
                                }


                            }
                        }

                        // final.push(split);

                    }
                    //cc.log("BBBBB");
                }
            } else {
                //cc.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                var aa = this.findPhomByRank(leftCard);
                if (aa.length > 0) {
                    for (var i = 0; i < phom.length; i++) {
                        var ll = this.final_getRemainCardAfterPhom(aa[0], leftCard)
                        var test = ll.slice(0);
                        test.push(phom[i]);
                        var reslut = this.findPhomByRank(test);
                        if (reslut.length > 0) {
                            //cc.log("TEST___");
                            var second = reslut[0];
                            var temp = phom.slice(0);
                            // var split = temp.splice(i, 1);
                            var index = this.findCard(phom[i], temp);
                            var singleCard = [];
                            if (index != -1) {

                                // finalPhom.push(item.slice(index, 1));
                                //cc.log("ADĐ_", index);
                                var sli = phom.slice(0);
                                //cc.log("SlIDE", sli.splice(index, 1));
                                // final.push(sli);
                                var phomAfter = this.findPhomByType(sli);
                                if (phomAfter.length > 0) {
                                    final.push(second);
                                    final.push(phomAfter[0]);
                                    final.push(aa[0]);
                                    var leftCard1 = this.final_getRemainCardAfterPhom(final, listCard);
                                    //cc.log("PHOM_______123", final, phom, leftCard.length);
                                    var rs = {
                                        phomList: final,
                                        leftCard: leftCard1,
                                    };
                                    return rs;
                                } else {
                                    final.push(aa[0]);
                                    if (this.getTotalScore(second) > this.getTotalScore(phom)) {
                                        final.push(second);
                                        var leftCard1 = this.final_getRemainCardAfterPhom(final, listCard);
                                        //cc.log("PHOM 4", final, phom);
                                        var rs = {
                                            phomList: final,
                                            leftCard: leftCard1,
                                        };
                                        return rs;
                                    }


                                }
                            }

                            // final.push(split);

                        }
                        //cc.log("BBBBB");
                    }
                }

            }

            final.push(phom);
            var rs = {
                phomList: final,
                leftCard: leftCard,
            };
            return rs;
        } else {
            final.push(phom);
            var rs = {
                phomList: final,
                leftCard: leftCard,
            };
            return rs;

        }
    },
    final_findFirstPhom(listCard, type = 0, eatCard = null) {
        var listCardCheck = listCard.slice(0);
        var findPhomByRank = this.findPhomByRank(listCardCheck);
        var findPhomByType = this.findPhomByType(listCardCheck);
        var totalPhom = [];
        totalPhom.push(...findPhomByRank);
        totalPhom.push(...findPhomByType);
        totalPhom = this.sortPhomByScore(totalPhom);
        // totalPhom.forEach((element, pos) => {
        //     //cc.log("TOTAL_PHOM", pos, this.getTotalScore(element));
        // });
        if (eatCard) {
            var check = [];
            for (var i = 0; i < totalPhom.length; i++) {
                if (this.findCard(eatCard, totalPhom[i]) >= 0) {
                    check.push(totalPhom[i]);
                } else {
                    // remainPhom.push(totalPhom[i]);
                }

            };
            if (check.length >= 2) {
                var phom = check[0];
                if (type == 0) {
                    phom = check[0];
                } else {
                    phom = check[1];
                }

                if (phom) {
                    var firstPhom = phom;
                    var leftCard = this.final_getRemainCardAfterPhom([firstPhom], listCardCheck);
                    var rs = {
                        firstPhom: firstPhom,
                        leftCard: leftCard,
                    }
                    return rs;
                }


            } else {
                if (check.length > 0) {
                    var firstPhom = check[0];
                    var leftCard = this.final_getRemainCardAfterPhom([firstPhom], listCardCheck);
                    var rs = {
                        firstPhom: firstPhom,
                        leftCard: leftCard,
                    }
                    return rs;
                } else {
                    var firstPhom = null;
                    // var leftCard = this.final_getRemainCardAfterPhom([firstPhom], listCardCheck);
                    var rs = {
                        firstPhom: null,
                        leftCard: listCardCheck,
                    }
                    return rs;
                }

            }
        } else {
            if (totalPhom.length >= 1) {
                if (totalPhom.length >= 2) {
                    var firstPhom = totalPhom[0];
                    if (type == 0) {
                        firstPhom = totalPhom[0];
                    } else {
                        firstPhom = totalPhom[1];
                    }
                    var leftCard = this.final_getRemainCardAfterPhom([firstPhom], listCardCheck);
                    var rs = {
                        firstPhom: firstPhom,
                        leftCard: leftCard,
                    }
                    return rs;
                } else {
                    var firstPhom = totalPhom[0];
                    var leftCard = this.final_getRemainCardAfterPhom([firstPhom], listCardCheck);
                    var rs = {
                        firstPhom: firstPhom,
                        leftCard: leftCard,
                    }
                    return rs;
                }

            } else {
                var firstPhom = null;
                var leftCard = listCardCheck;
                var rs = {
                    firstPhom: null,
                    leftCard: leftCard,
                }
                return rs;
            }
        }

    },
    final_getRemainCardAfterPhom(listPhom, listCard) {
        var reslut = [];
        var listPhomCard = [];
        if(Array.isArray(listPhom)){
            if (!Array.isArray(listPhom[0])) {
                listPhomCard = listPhom;
            } else{
                listPhom.forEach((element) => {
                    if (element) {
                        listPhomCard.push(...element);
                    }
                });
            } 
        }
        //cc.log("LIST_PHOM_CARD_BEFORE", listPhomCard.length);
        listPhomCard = this.removeDuplicateListCard(listPhomCard);
        //cc.log("LIST_PHOM_CARD_ORDER", listPhomCard.length);
        listCard.forEach((element) => {
            var count = 0;
            listPhomCard.forEach((element1) => {
                if (element.serverValue != element1.serverValue) {
                    count++;
                } else {
                    count = 0;
                }
            });
            if (count == listPhomCard.length) {
                reslut.push(element);
            };
        })

        return reslut;
    },
    sortPhomByScore(listPhom) {
        var sort = listPhom.slice(0);
        var self = this;
        var compare = function (a, b) {
            if (self.getTotalScore(a) > self.getTotalScore(b)) {
                return -1;
            } else {
                if (self.getTotalScore(a) < self.getTotalScore(b)) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
        sort.sort(compare);
        return sort;
    },
    findPhomByCard(card, listPhom) {
        var reslut = [];
        listPhom.forEach((element) => {
            if (this.findCard(card, element) >= 0) {
                reslut = element;
            }
        })
        return reslut;
    },
    checkEatPhom(listCard, eatCard, listTaken, type) {
        var reslut = this.final_finalPhom(listCard, listTaken, type);
        var phom = reslut.totalPhom;
        var leftCard = reslut.leftCard;
        ////
        var listCard1 = listCard.slice(0);
        listCard1.push(eatCard);
        var phom1 = this.final_finalPhom(listCard1, listTaken, type).totalPhom;
        //cc.log("LIST__", phom1, phom)
        if (phom1.length > phom.length) {

            var eatPhom = this.findPhomByCard(eatCard, phom1);
            //cc.log("EATE", eatPhom);
            if (!this.isEatedPhom(eatPhom, listTaken)) {
                //cc.log("TRUE___");
                return true;
            } else {
                //cc.log("FALSE___");
                return false;
            }

        } else {
            for (var i = 0; i < phom.length; i++) {
                if (!this.isEatedPhom(phom[i], listTaken)) {
                    if (this.isTypeValue(phom[i])) {
                        var temp = [];
                        temp.push(eatCard);
                        temp.push(...phom[i]);
                        if (this.findPhomByRank(temp, phom[i].length + 1).length > 0) {
                            //cc.log("TRUE");
                            return true;
                        } else {
                            temp.push(...leftCard.slice(0));
                            var rs = this.findPhomByType(temp);
                            if (rs.length > 0) {
                                //cc.log("TRUE");
                                if (this.findCard(eatCard, rs[0]) >= 0) {
                                    return true;
                                }

                            }
                        }
                    } else {
                        var temp = [];
                        temp.push(eatCard);
                        temp.push(...phom[i]);
                        //cc.log("PHOM _ I", phom[i]);
                        if (this.findPhomByType(temp, phom[i].length + 1).length > 0) {
                            //cc.log("TRUE");
                            return true;
                        } else {
                            temp.push(...leftCard.slice(0));
                            var rs = this.findPhomByRank(temp);
                            if (rs.length > 0) {
                                //cc.log("TRUE");
                                if (this.findCard(eatCard, rs[0]) >= 0) {
                                    return true;
                                }

                            }
                        }
                    }
                } else {
                    if (!this.isTypeValue(phom[i]) && phom[i].length >= 5) {
                        var temp = [];
                        temp.push(eatCard);
                        temp.push(...phom[i]);
                        //cc.log("PHOM _ I", phom[i]);
                        if (this.findPhomByType(temp, phom[i].length + 1).length > 0) {
                            //cc.log("TRUE");
                            return false;
                        }

                    }
                }

            }
            //cc.log("FALSE");
            return false;
        }
        // var leftCard = reslut.leftCard;
        // leftCard.push(eatCard);
        // var eatPhom = this.final_findFirstPhom(leftCard).firstPhom;
        // if (eatPhom != null) {
        //     //cc.log("TRUE");
        //     return true;
        // } else {
        //     for (var i = 0; i < phom.length; i++) {
        //         if (!this.isEatedPhom(phom[i], listTaken)) {
        //             if (this.isTypeValue(phom[i])) {
        //                 var temp = [];
        //                 temp.push(eatCard);
        //                 temp.push(...phom[i]);
        //                 if (this.findPhomByRank(temp, phom[i].length + 1).length > 0) {
        //                     //cc.log("TRUE");
        //                     return true;
        //                 }
        //             } else {
        //                 var temp = [];
        //                 temp.push(eatCard);
        //                 temp.push(...phom[i]);
        //                 //cc.log("PHOM _ I", phom[i]);
        //                 if (this.findPhomByType(temp, phom[i].length + 1).length > 0) {
        //                     //cc.log("TRUE");
        //                     return true;
        //                 }
        //             }
        //         } else {

        //         }

        //     }
        //     //cc.log("FALSE");
        //     return false;
        // }

    },
    findGuiBai(listCard, listPhom) {
        var listCardNew = [];
        listCard.forEach(item=>{
            listCardNew.push(item);
        });
        var guiCard = [];
        for (var i = 0; i < listCard.length; i++) {
            var card = listCard[i];
            var convertCard = Number(card.rank) * 4 + (Number(card.type) -1);
            for (var j = 0; j < listPhom.length; j++) {
                if (listPhom[j].getPlayerId()) {
                    var phom = listPhom[j];
                    //var test = phom.cardList.slice(0);
                    //cc.log("PHOM_LENGTH", test.length);
                    // test.push(card);
                    // var reslut = this.final_findFirstPhom(test);
                    // if (reslut.firstPhom != null && reslut.leftCard.length == 0) {
                    //     guiCard.push({
                    //         card: card,
                    //         phomIndex: j,
                    //         biGuiPlayer: phom.getPlayerId(),
                    //         phomId: phom.getId(),
                    //     });
                    // }
                    //TrungCode
                    var lst = logicPhom.parse_MylstCard(phom.cardList.slice(0));
                    var check = logicPhom.checkAnGa(lst,[],convertCard);
                    if (check) {
                        var index = listCardNew.indexOf(card);
                        if(index >= 0){
                            listCardNew.splice(index,1);
                        }
                        guiCard.push({
                            card: card,
                            phomIndex: j,
                            biGuiPlayer: phom.getPlayerId(),
                            phomId: phom.getId(),
                        });
                        lst.push(convertCard);
                        // kiểm tra xem sau khi gửi bài xong có gửi tiếp lá nữa vào phỏm dc ko
                        for (var m = 0; m < listCardNew.length; m++) {
                            var card2 = listCardNew[m];
                            var convertCard2 = Number(card2.rank) * 4 + (Number(card2.type) -1);
                            if(convertCard2 != convertCard){
                                var check2 = logicPhom.checkAnGa(lst,[],convertCard2);
                                if(check2){
                                    var index2 = listCardNew.indexOf(card2);
                                    if(index2 >= 0){
                                        listCardNew.splice(index2,1);
                                    }
                                    guiCard.push({
                                        card: card2,
                                        phomIndex: j,
                                        biGuiPlayer: phom.getPlayerId(),
                                        phomId: phom.getId(),
                                    });
                                    break;
                                }
                            }
                            
                        } 
                        break;
                    }
                }

            }
        }
        return guiCard;
    },
    isGuiBai(listCard, listPhom) {
        var reslut = this.findGuiBai(listCard, listPhom);
        if (reslut.length > 0) {
            return true;
        } else {
            return false;
        }
    },
    findGuiBaiByCard(card, listCard, listPhom) {
        var reslut = this.findGuiBai(listCard, listPhom);
        if (reslut.length > 0) {
            for (var i = 0; i < reslut.length; i++) {
                if (card.serverValue == reslut.card.serverValue) {
                    return reslut[i];
                }
            }
            return null;
        } else {
            return null;
        }
    },
    isEatedPhom(phom, listTaken) {
        //cc.log("CHECK_EATE", phom, listTaken);
        for (var i = 0; i < listTaken.length; i++) {
            if (this.findCard(listTaken[i], phom) >= 0) {
                return true;
            }
        }
        return false;
    },
    splitFinalPhom(pPhomList, Mtype = 0) {
        var result = [];
        if (pPhomList != null && pPhomList.length > 0) {

            result = [];
            pPhomList.forEach((phom, pos) => {
                var size = phom.length;
                if (size == 6) {
                    result.push(phom.slice(0, 3));
                    result.add(phom.slice(3, size));
                } else if (size > 6) {
                    if (Mtype == 0) {
                        result.push(phom.slice(0, 3));
                        result.add(phom.slice(3, size));
                    } else if (Mtype == 1) {
                        result.push(phom.slice(0, 4));
                        result.add(phom.slice(4, size));
                    }
                } else {

                    result.push(phom);
                }
            })

        }
        return result;
    }

}
module.exports = PhomLogic;