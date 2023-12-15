var CardUtils = require('CardUtils');
var SamLogic = {

    findCard(card, list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].serverValue == card.serverValue) {
                return i;
            }
        }
        return -1;

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
                    cc.log("ABS", Math.abs(test.rank - listType[i][j + 1].rank));
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


                        // cc.log("FALSE", phomCard.length);
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
        cc.log("SINGLE", singleCard);
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
                    // cc.log("TRUE",phomCard.length);
                } else {
                    if (pair.length == 2) {
                        pairResult.push(pair);
                        pair = [];
                    } else {
                        singleCard.push(tempCard[i + 1]);
                        pair = [];
                    }
                    // cc.log("FALSE", phomCard.length);
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
    // isPhom(listCard) {

    // },
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
    
    findDuplicate(list1, list2) {
        var listCard1 = list1.slice(0);
        var listCard2 = list2.slice(0);
        var result = [];
        cc.log(list1, list2);
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
        // if (eatCard.length == 0) {
        //     var checkList = myCard.slice(0);
        //     var findPhomByRank = this.findPhomByRank(checkList);
        //     var findPhomByType = this.findPhomByType(checkList);
        //     var phomList = [];
        //     var pairListType = [];
        //     var pairListRank = [];
        //     var singleCard = [];
        //     var finalCard = [];
        //     var finalPhom = [];
        //     var finalPair = [];
        //     var finalSingleCard = [];
        //     for (var i = 0; i < findPhomByRank.length; i++) {
        //         phomList.push(findPhomByRank[i]);
        //     }
        //     for (var i = 0; i < findPhomByType.length; i++) {
        //         phomList.push(findPhomByType[i]);
        //     }
        //     cc.log(phomList.length);
        //     if (phomList.length >= 2) {
        //         for (var i = 0; i < phomList.length; i++) {
        //             if (i < phomList.length - 1) {
        //                 this.removePhomDuplicate(finalPhom, finalSingleCard, phomList[i], phomList[i + 1], isRandom);
        //             } else {

        //             }
        //         }
        //         cc.log("FINAL_PHOM", finalPhom);
        //         singleCard = this.getRemainCardAfterPhom(finalPhom, checkList);
        //         cc.log("SINGLE", singleCard);
        //         pairListRank = this.findPairByRank(singleCard);
        //         cc.log("FINAL_PAIR", pairListRank);
        //         var singleCardPairRank = this.getRemainCardAfterPhom(pairListRank, singleCard);
        //         cc.log("SINGLE_PAIR", singleCardPairRank);
        //         pairListType = this.findPairByType(singleCardPairRank);
        //         var singleCardPairType = this.getRemainCardAfterPhom(pairListType, singleCardPairRank);
        //         cc.log("SINGLE_PAIR_TYPE", singleCardPairType);
        //         finalPhom.forEach((element) => {
        //             finalCard.push(...element);
        //         });
        //         pairListRank.forEach((element) => {
        //             finalCard.push(...element);
        //         });
        //         pairListType.forEach((element) => {
        //             finalCard.push(...element);
        //         });
        //         finalCard.push(...singleCardPairType);
        //         finalCard = this.removeDuplicateListCard(finalCard);
        //         cc.log("FINAl", finalCard, finalCard.length);

        //     } else {
        //         finalPhom = phomList.slice(0);
        //         cc.log("FINAL_PHOM", finalPhom);
        //         singleCard = this.getRemainCardAfterPhom(finalPhom, checkList);
        //         cc.log("SINGLE", singleCard);
        //         pairListRank = this.findPairByRank(singleCard);
        //         cc.log("FINAL_PAIR", pairListRank);
        //         var singleCardPairRank = this.getRemainCardAfterPhom(pairListRank, singleCard);
        //         cc.log("SINGLE_PAIR", singleCardPairRank);
        //         pairListType = this.findPairByType(singleCardPairRank);
        //         var singleCardPairType = this.getRemainCardAfterPhom(pairListType, singleCardPairRank);
        //         cc.log("SINGLE_PAIR_TYPE", singleCardPairType);
        //         finalPhom.forEach((element) => {
        //             finalCard.push(...element);
        //         });
        //         pairListRank.forEach((element) => {
        //             finalCard.push(...element);
        //         });
        //         pairListType.forEach((element) => {
        //             finalCard.push(...element);
        //         });
        //         finalCard.push(...singleCardPairType);
        //         finalCard = this.removeDuplicateListCard(finalCard);
        //         cc.log("FINAl", finalCard, finalCard.length);
        //     }
        //     return finalCard;
        // } else {
        //     if (eatCard.length > 0) {
        //         var checkList = myCard.slice(0);
        //         var findPhomByRank = this.findPhomByRank(checkList);
        //         var findPhomByType = this.findPhomByType(checkList);
        //         var phomList = [];
        //         var pairListType = [];
        //         var pairListRank = [];
        //         var singleCard = [];
        //         var finalCard = [];
        //         var finalPhom = [];
        //         var finalPair = [];
        //         var finalSingleCard = [];
        //         for (var i = 0; i < findPhomByRank.length; i++) {
        //             phomList.push(findPhomByRank[i]);
        //         }
        //         for (var i = 0; i < findPhomByType.length; i++) {
        //             phomList.push(findPhomByType[i]);
        //         }
        //         cc.log(phomList.length);
        //         if (phomList.length >= 2) {
        //             finalPhom = this.findEatPhom(eatCard, myCard);
        //             cc.log("FINAL_PHOM", finalPhom);
        //             singleCard = this.getRemainCardAfterPhom(finalPhom, checkList);
        //             cc.log("SINGLE", singleCard);
        //             pairListRank = this.findPairByRank(singleCard);
        //             cc.log("FINAL_PAIR", pairListRank);
        //             var singleCardPairRank = this.getRemainCardAfterPhom(pairListRank, singleCard);
        //             cc.log("SINGLE_PAIR", singleCardPairRank);
        //             pairListType = this.findPairByType(singleCardPairRank);
        //             var singleCardPairType = this.getRemainCardAfterPhom(pairListType, singleCardPairRank);
        //             cc.log("SINGLE_PAIR_TYPE", singleCardPairType);
        //             finalPhom.forEach((element) => {
        //                 finalCard.push(...element);
        //             });
        //             pairListRank.forEach((element) => {
        //                 finalCard.push(...element);
        //             });
        //             pairListType.forEach((element) => {
        //                 finalCard.push(...element);
        //             });
        //             finalCard.push(...singleCardPairType);
        //             finalCard = this.removeDuplicateListCard(finalCard);
        //             cc.log("FINAl", finalCard, finalCard.length);

        //         } else {
        //             finalPhom = phomList.slice(0);
        //             cc.log("FINAL_PHOM", finalPhom);
        //             singleCard = this.getRemainCardAfterPhom(finalPhom, checkList);
        //             cc.log("SINGLE", singleCard);
        //             pairListRank = this.findPairByRank(singleCard);
        //             cc.log("FINAL_PAIR", pairListRank);
        //             var singleCardPairRank = this.getRemainCardAfterPhom(pairListRank, singleCard);
        //             cc.log("SINGLE_PAIR", singleCardPairRank);
        //             pairListType = this.findPairByType(singleCardPairRank);
        //             var singleCardPairType = this.getRemainCardAfterPhom(pairListType, singleCardPairRank);
        //             cc.log("SINGLE_PAIR_TYPE", singleCardPairType);
        //             finalPhom.forEach((element) => {
        //                 finalCard.push(...element);
        //             });
        //             pairListRank.forEach((element) => {
        //                 finalCard.push(...element);
        //             });
        //             pairListType.forEach((element) => {
        //                 finalCard.push(...element);
        //             });
        //             finalCard.push(...singleCardPairType);
        //             finalCard = this.removeDuplicateListCard(finalCard);
        //             cc.log("FINAl", finalCard, finalCard.length);
        //         }
        //         return finalCard;
        //     }
        // }
        var checkList = myCard.slice(0);
        var phomList = [];
        var pairListType = [];
        var pairListRank = [];
        var singleCard = [];
        var finalCard = [];
        var finalPhom = [];
        var finalPair = [];
        var finalSingleCard = [];
        //phomList = this.final_finalPhom(checkList, eatCard, type).totalPhom;
        cc.log(phomList.length);
        finalPhom = phomList.slice(0);
        cc.log("FINAL_PHOM", finalPhom);
        singleCard = this.getRemainCardAfterPhom(finalPhom, checkList);
        cc.log("SINGLE", singleCard);
        var rand = Math.round(Math.random());
        if (type == 0) {
            pairListRank = this.findPairByRank(singleCard);
        } else {
            pairListRank = this.findPairByType(singleCard);
        }

        cc.log("FINAL_PAIR", pairListRank);
        var singleCardPairRank = this.getRemainCardAfterPhom(pairListRank, singleCard);
        cc.log("SINGLE_PAIR", singleCardPairRank);
        if (type == 0) {
            pairListType = this.findPairByType(singleCardPairRank);

        } else {
            pairListType = this.findPairByRank(singleCardPairRank);

        }

        var singleCardPairType = this.getRemainCardAfterPhom(pairListType, singleCardPairRank);
        cc.log("SINGLE_PAIR_TYPE", singleCardPairType);
        this.sortCardByRankIncrease(singleCardPairType);
        finalPhom.forEach((element) => {
            finalCard.push(...element);
        });
        pairListRank.forEach((element) => {
            finalCard.push(...element);
        });
        pairListType.forEach((element) => {
            finalCard.push(...element);
        });
        finalCard.push(...singleCardPairType);
        finalCard = this.removeDuplicateListCard(finalCard);
        cc.log("FINAl", finalCard, finalCard.length);
        return finalCard;

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
            cc.log("TEST_", element.serverValue);
        });
        var temp = listCard.slice(0);
        var unique = temp
            .map(e => e['serverValue'])

            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)

            // eliminate the dead keys & store unique objects
            .filter(e => temp[e]).map(e => temp[e]);

        return unique;

    },
    
 //--------------------------------------------------------------------------------------------------------------------------------------------------------------
 //-- Logic Duong Nguyen --
 //--------------------------------------------------------------------------------------------------------------------------------------------------------------

    showMeYourLove(listCard,ownerList){
        var result='';
        if(listCard.length==0 && ownerList.length==1){  //Đối phương bỏ lượt và bài mình chỉ còn 1 cây thì show lên
            result=ownerList[0].serverValue;
            ownerList[0].node.y=20;
            ownerList[0].node.getChildByName('background').color= new cc.Color(255,255,255,255);

            return result;
        }
        else if(listCard.length==0 && (this.checkIsIncreaseMyTurn(ownerList) || this.checkIsPairMyTurn(ownerList))){    //đối phương bỏ lượt và bài mình còn lại chỉ có bộ thì show lên
            ownerList.forEach(item=>{
                if(result){
                    result=result+'#'+item.serverValue;
                }else{
                    result=item.serverValue;
                }
                item.node.y=20;
                item.node.getChildByName('background').color= new cc.Color(255,255,255,255);
            });
            return result;
        }else if(listCard.length==0 && this.checkAndGet2Mutil(ownerList)){  //nếu trong bài còn lại chỉ còn 2 và bộ or cây lẻ
            ownerList.forEach(item=>{
                if(item.rank==15){
                    if(result){
                        result=result+'#'+item.serverValue;
                    }else{
                        result=item.serverValue;
                    }
                    item.node.y=20;
                    item.node.getChildByName('background').color= new cc.Color(255,255,255,255);
                }
            });
            return result;
        }

        if(listCard.length==0){
            return;
        }
        if(listCard.length==1){         //đối phương đánh bài lẻ
            if(ownerList.length==2 && listCard[0].rank!=15){
                result=this.checkAndGet2(ownerList);
            } 
            if(!result){
                result=this.showBiggerCard(listCard[0].rank,ownerList); //tìm cây lớn hơn phù hợp nhất
                if(!result){
                    result=this.showBiggerCardFirstValue(listCard[0].rank,ownerList); //nếu ko có cây lớn hơn phù hợp nhất thì lấy cây đầu tiên có thể lấy đc
                }
            }
        }else if(this.checkIsPairMyTurn(listCard)){
            result=this.findPairBigger(listCard[0].rank,listCard.length,ownerList);  //tìm đôi lớn hơn
        }else if(this.checkIsIncreaseMyTurn(listCard)){
            result=this.findIncreaseBigger(listCard[0].rank,listCard.length,ownerList); //tìm sảnh lớn hơn
        }

        return result;
    },

    showMeYourLoveOnTouch(card,listCardOwner,currentTurnCard){
        if(currentTurnCard){
            return;
        }
        var result='';
        var checker=0; 
        /**
         *  0 là bài lẻ
         *  1 là đôi
         *  2 là sảnh
         */

        for(var i=0;i<listCardOwner.length;i++){
            if(listCardOwner[i].serverValue==card.serverValue){
                if(listCardOwner[i+1]){
                    if(listCardOwner[i+1].rank==listCardOwner[i].rank){
                        checker=1;
                        break;
                    }else if(listCardOwner[i+1].rank==listCardOwner[i].rank+1 && listCardOwner[i+2] && listCardOwner[i+2].rank==listCardOwner[i].rank+2){
                        checker=2;
                        break;
                    }
                }else if(listCardOwner[i-1]){
                    if(listCardOwner[i-1].rank==listCardOwner[i].rank){
                        checker=1;
                        break;
                    } 
                }else{
                    checker=0;
                    break;
                }
            }
        }

        if(checker==0){
            result=card.serverValue;
        }else if(checker==1){
            result=this.findPairByRankTouchCard(card.rank,listCardOwner);
        }else if(this.checkIsIncreaseTouchCard(card.serverValue,listCardOwner)){
            result=this.findListIncreaseTouchCard(card.rank,listCardOwner,card);
        }

        
        
        return result;

    },

    /**
     * Trả về quân bài 2 khi bộ bài chỉ còn 2 cây tránh thối
     * @param {*} ownerList 
     */
    checkAndGet2(ownerList){
        var result='';
        var got=false;
        ownerList.forEach(item=>{
            if(item.rank==15 && !got){
                item.node.getChildByName('background').color= new cc.Color(255,255,255,255);
                item.node.y=20;
                result = item.serverValue;
                got=true;
            }
        });
        return result;
    },

    /**
     * Khi bộ bài chỉ còn lại 2 và 1 cây lẻ,1 sảnh or 1 đôi
     * @param {*} ownerList 
     */
    checkAndGet2Mutil(ownerList){
        var lst2=[];
        var lstExist=[];
        ownerList.forEach(item=>{
            if(item.rank==15){
                lst2.push(item);
            }else{
                lstExist.push(item);
            }
        });

        if(lst2.length==0 || lstExist.length==0){
            return false;
        }
        else if(lstExist.length==1){
            return true;
        }
        if(lstExist.length>1){
            lstExist=this.sortCardByRankIncrease(lstExist);
            if(this.checkIsIncreaseMyTurn(lstExist) || this.checkIsPairMyTurn(lstExist)){
                return true;
            }else{
                return false;
            }
        }
    },

    /**
     * tìm đôi khi chạm vào 1 lá
     * @param {*} rank 
     * @param {*} listCard 
     */
    findPairByRankTouchCard(rank,listCard){
        var result='';
        listCard.forEach((item)=>{
            if(item.rank==rank){
                item.node.y=20;
                if(result){
                    result=result+'#'+item.serverValue;
                }
                else{
                    result=item.serverValue;
                }
                item.node.getChildByName('background').color= new cc.Color(255,255,255,255);
            }else{
                item.node.getChildByName('background').color= new cc.Color(140,140,140,255);
                item.node.y=0;
            }
        });
        return result;
    },

    /**
     * Tìm những lá bài lẻ lớn hơn lá bài đối phương đánh
     * @param {*} rank 
     */
    showBiggerCard(rank,ownerList){
        var getFirstCard=false; // lấy lá bài lớn hơn đầu tiên trong một danh sách bài đã sắp xếp
        var result='';
        ownerList.forEach(item=>{
            if(item.rank>rank){
                if(!getFirstCard && !this.checkIsIncreaseTouchCard(item.serverValue,ownerList) && !this.checkIsPairTouchCard(item.rank,ownerList)){
                    item.node.y=20;
                    result=item.serverValue;
                    getFirstCard=true;
                }
                item.node.getChildByName('background').color= new cc.Color(255,255,255,255);
            }
        });
        return result;
    },

    /**
     * TRường hợp nếu tất cả các cây đều nằm trong bộ thì lấy cây lớn hơn đầu tiên lớn hơn
     * @param {*} rank 
     * @param {*} ownerList 
     */
    showBiggerCardFirstValue(rank,ownerList){
        var getFirstCard=false; // lấy lá bài lớn hơn đầu tiên trong một danh sách bài đã sắp xếp
        var result='';
        ownerList.forEach(item=>{
            if(item.rank>rank){
                if(!getFirstCard){
                    item.node.y=20;
                    result=item.serverValue;
                    getFirstCard=true;
                }
            }
        });
        return result;
    },

    /**
     * Tìm đôi lớn hơn đôi đối phương đánh
     * @param {*} rank 
     * @param {*} numberOfCard 
     * @param {*} listCardOwner 
     */
    findPairBigger(rank,numberOfCard,listCardOwner){
        if(listCardOwner && listCardOwner.length<numberOfCard){
            return '';
        }
        var result=[];
        var resultRank= [];

        for(var i=0;i< listCardOwner.length;i++){
            
            if(listCardOwner[i].rank>rank && resultRank.indexOf(listCardOwner[i].rank)<0){
                var pair= [];
                for(var j=0;j<listCardOwner.length;j++){
                    if(listCardOwner[j].rank==listCardOwner[i].rank){
                        pair.push(listCardOwner[j]);
                    }
                }
                if(pair.length>=numberOfCard){
                    result.push(pair);
                    resultRank.push(listCardOwner[i].rank);
                }

            }
        }

        var resultServerValue='';
        var minIndex=resultRank.indexOf(Math.min(...resultRank));
        for(var i=0;i<result.length;i++){
            if(i==minIndex){
                var numberOfCardTemp=0;
                result[i].forEach(item=>{
                    if(numberOfCardTemp<numberOfCard){
                        if(resultServerValue==''){
                            resultServerValue=item.serverValue.toString();
                        }else{
                            resultServerValue=resultServerValue+'#'+item.serverValue;
                        }
                        item.node.y=20;
                        numberOfCardTemp++;
                    }
                    item.node.getChildByName('background').color= new cc.Color(255,255,255,255);
                });
            }
            else{
                result[i].forEach(item=>{
                    item.node.getChildByName('background').color= new cc.Color(255,255,255,255);
                });
            }
        }

        return resultServerValue;
    },

    /**
     * tìm sảnh lớn hơn sảnh mà đối phương đánh
     * @param {*} minRank 
     * @param {*} numberOfCard 
     * @param {*} listCardOwner 
     */
    findIncreaseBigger(minRank,numberOfCard,listCardOwner){
        if(listCardOwner && listCardOwner.length<numberOfCard){
            return '';
        }
        var result=[];
        var resultRank= [];

        for(var i=0;i< listCardOwner.length;i++){
            
            if(listCardOwner[i].rank > minRank && resultRank.indexOf(listCardOwner[i].rank)<0){
                var increase= [];
                increase.push(listCardOwner[i]);
                var tempRank=listCardOwner[i].rank+1;
                for(var j=0,numCard=1;j<listCardOwner.length;j++){
                    if(listCardOwner[j].rank==tempRank && numCard<numberOfCard && tempRank!=15){
                        increase.push(listCardOwner[j]);
                        tempRank++;
                        numCard++;
                    }
                }
                if(increase.length==numberOfCard){
                    result.push(increase);
                    resultRank.push(listCardOwner[i].rank);
                }

            }
        }

        var resultServerValue='';
        var minIndex=resultRank.indexOf(Math.min(...resultRank));
        for(var i=0;i<result.length;i++){
            if(i==minIndex){
                result[i].forEach(item=>{
                    if(resultServerValue==''){
                        resultServerValue=item.serverValue.toString();
                    }else{
                        resultServerValue=resultServerValue+'#'+item.serverValue;
                    }
                    item.node.y=20;
                    item.node.getChildByName('background').color= new cc.Color(255,255,255,255);
                });
            }
            else{
                result[i].forEach(item=>{
                    item.node.getChildByName('background').color= new cc.Color(255,255,255,255);
                });
            }
        }

        return resultServerValue;
    },

    /**
     * Tìm sảnh khi nhấc 1 lá
     * @param {*} rank 
     * @param {*} listCard 
     * @param {*} card 
     */
    findListIncreaseTouchCard(rank,listCard,card){
        var result='';
        listCard.forEach((item)=>{
            if(item.rank==rank+1 || item.serverValue==card.serverValue){
                if(result){
                    result=result+'#'+item.serverValue;
                }else{
                    result=item.serverValue;
                }
                item.node.y=20;
                item.node.getChildByName('background').color= new cc.Color(255,255,255,255);
                if(item.serverValue!=card.serverValue){
                    // if(rank==13){
                    //     rank=0;
                    // }else{
                       // rank=rank+1;
                  //  }
                  if(rank==13){
                    rank=-1000;
                }else{
                    rank++;
                }
                }
            }else {
                item.node.getChildByName('background').color= new cc.Color(140,140,140,255);
                item.node.y=0;
            }
        });
        return result;
    },

    /**
     * Kiểm tra xem quân vừa nhấc có nằm trong sảnh nào hay không?
     * @param {*} rank 
     * @param {*} listCard 
     */
    checkIsIncreaseTouchCard(serverValue,listCardOwner){
        // var temp=0;
        // for(var i=0;i<listCard.length;i++){
        //     if(listCard[i].rank==rank+1){
        //         temp++;
        //         if(rank==13){
        //             rank=-1000;
        //         }else{
        //             rank++;
        //         }
        //     }
        // }
        
        var result=[];

        for(var i=0;i< listCardOwner.length;i++){
            
            if(result.indexOf(listCardOwner[i].serverValue)<0){
                var increase= [];
                increase.push(listCardOwner[i]);
                var tempRank=listCardOwner[i].rank+1;
                for(var j=0;j<listCardOwner.length;j++){
                    if(listCardOwner[j].rank==tempRank && tempRank!=15){
                        increase.push(listCardOwner[j]);
                        tempRank++;
                    }
                }
                if(increase.length>2){
                    increase.forEach(item=>{
                        result.push(item.serverValue);
                    });
                    
                }

            }
        }

        if(result.indexOf(serverValue)>=0){
            return true;
        }
        else{
            return false;
        }

        // if(temp>=2){
        //     return true;
        // }
        // else{
        //     return false;
        // }
    },

    /**
     * Kiểm tra xem quân vừa nhấc có nằm trong đôi nào hay không!
     * @param {*} rank 
     * @param {*} listCard 
     */
    checkIsPairTouchCard(rank,listCard){
        var checked=true;
        for(var i=0;i<listCard.length;i++){
            if(listCard[i].rank==rank){
                checked=false;
            }
        }
        // listCard.forEach(item=>{
        //     if(item.rank==rank){
        //         checked=false;
        //     }
        // });
        return checked;
    },
    /**
     * Kiểm tra bài đối phương đánh có phải là đôi hay không?
     * @param {*} listCard 
     */
    checkIsPairMyTurn(listCard){
        if(listCard && listCard.length==1){
            return false;
        }
        var checked=true;
        for(var i=1;i<listCard.length;i++){
            if(listCard[i].rank!=listCard[0].rank){
                checked=false
                break;
            }
        }
        return checked;
    },

    /**
     * Kiểm tra bài mình đánh là đôi và lớn hơn đôi của đối phương
     * @param {*} listCard 
     * @param {*} listComingCard 
     */
    checkIsPairMyTurnAndBigger(listCard,listComingCard){
        if(!listCard || listCard.length<2 || listCard.length!=listComingCard.length){
            return false;
        }
        var checked=true;
        for(var i=1;i<listCard.length;i++){
            if(listCard[i].rank!=listCard[0].rank){
                checked=false
                break;
            }
        }
        if(listCard[0].rank<=listComingCard[0].rank){
            checked=false;
        }
        return checked;
    },

    /**
     * check xem bài đối phương đánh có phải là sảnh hay không
     * @param {*} listCard 
     */
    checkIsIncreaseMyTurn(listCard){
        if(!listCard || listCard.length<3){
            return false;
        }
        var checked=true;

        var haveK=false;
        var haveAt=false;
        var haveBa=false;
        var haveHai=false;
        listCard.forEach(item=>{
            if(item.rank==13){
                haveK=true;
            }
            if(item.rank==14){
                haveAt=true;
            }
            if(item.rank==15){
                haveHai=true;
            }
            if(item.rank==3){
                haveBa=true;
            }
        });

        if(haveK && haveHai){
            return false;
        }
        if(haveHai){
            listCard.forEach(item=>{
                if(item.rank==14){
                    item.rank=1;
                }else if( item.rank==15){
                    item.rank=2;
                }
            });
            listCard= this.sortCardByRankIncrease(listCard);
        }


        for(var i=1;i<listCard.length;i++){
            if(listCard[i].rank!=listCard[i-1].rank+1){
                checked=false;
                break;
            }
        }

        if(haveHai){
            listCard.forEach(item=>{
                if(item.rank==1){
                    item.rank=14;
                }else if( item.rank==2){
                    item.rank=15;
                }
            });
            listCard= this.sortCardByRankIncrease(listCard);
        }
        return checked;
    },

    /**
     * Kiểm tra bài mình đánh là sảnh và lớn hơn bài đối thủ
     * @param {*} listCard 
     * @param {*} listComingCard 
     */
    checkIsIncreaseMyTurnAndBigger(listCard,listComingCard){
        if(!listCard || listCard.length<3 || listCard.length!=listComingCard.length){
            return false;
        }
        var checked=true;

        var haveK=false;
        var haveHai=false;
        var haveHaiComing=false;
        listCard.forEach(item=>{
            if(item.rank==13){
                haveK=true;
            }
            if(item.rank==15){
                haveHai=true;
            }
        });

        listComingCard.forEach(item=>{
            if(item.rank==15){
                haveHaiComing=true;
            }
        });

        if(haveK && haveHai){
            return false;
        }
        if(haveHai){
            listCard.forEach(item=>{
                if(item.rank==14){
                    item.rank=1;
                }else if( item.rank==15){
                    item.rank=2;
                }
            });
            listCard= this.sortCardByRankIncrease(listCard);
        }
        if(haveHaiComing){
            listComingCard.forEach(item=>{
                if(item.rank==14){
                    item.rank=1;
                }else if( item.rank==15){
                    item.rank=2;
                }
            });
            listComingCard= this.sortCardByRankIncrease(listComingCard);
        }

        for(var i=1;i<listCard.length;i++){
            if(listCard[i].rank!=listCard[i-1].rank+1){
                checked=false;
                break;
            }
        }
        if(listCard[0].rank<=listComingCard[0].rank || listCard[listCard.length-1].rank<=listComingCard[listComingCard.length-1].rank){
            checked=false;
        }

        if(haveHai){
            listCard.forEach(item=>{
                if(item.rank==1){
                    item.rank=14;
                }else if( item.rank==2){
                    item.rank=15;
                }
            });
            listCard= this.sortCardByRankIncrease(listCard);
        }
        if(haveHaiComing){
            listComingCard.forEach(item=>{
                if(item.rank==1){
                    item.rank=14;
                }else if( item.rank==2){
                    item.rank=15;
                }
            });
            listComingCard= this.sortCardByRankIncrease(listComingCard);
        }
        return checked;
    },
    
    /**
     * Kiểm tra xem bài đánh ra có hợp lệ hay không?
     * @param {*} myTurnCard 
     */
    checkLogic(myTurnCard,listComingCard){
        var listCard = this.sortCardByRankIncrease(CardUtils.parseSamCard(myTurnCard));
        if(listComingCard.length==0){   //trường hợp đối phương ko đánh quân nào
            if(listCard.length==1){
                return true;
            }
            else if(!this.checkIsIncreaseMyTurn(listCard) && !this.checkIsPairMyTurn(listCard) && !this.checkDoiThong(listCard)){
                return false;
            }else{
                return true;
            }
        }else{      //trường hợp đối phương đánh quân
            var soQuanHai=0;
            listComingCard.forEach(item=>{
                if(item.rank==15){
                    soQuanHai++;
                }
            });
            if(soQuanHai>0 && soQuanHai<3 && !this.checkIsIncreaseMyTurn(listComingCard)){  //trường hợp có 1 or đôi 2
                //return this.checkDoiThong(listCard,soQuanHai);
                if(!this.checkDoiThong(listCard,soQuanHai) && !this.checkTuQuy(listCard,soQuanHai)){
                    return false;
                }else{
                    return true;
                }

            } else if(soQuanHai>=3){ //trường hợp có hơn đôi 2
                return false;
            }
            else if(soQuanHai==0 || this.checkIsIncreaseMyTurn(listComingCard)){ //trường hợp ko có quân 2 or có nhưng nằm trong dây 1,2,3 or ...
                if(listComingCard.length!=listCard.length){
                    return false;
                }else{
                    if(listComingCard.length==1){
                        if(listCard[0].rank<=listComingCard[0].rank){
                            return false;
                        }else{
                            return true;
                        }
                    }else if (this.checkIsIncreaseMyTurn(listComingCard)){
                        return this.checkIsIncreaseMyTurnAndBigger(listCard,listComingCard);
                    }else if(this.checkIsPairMyTurn(listComingCard)){
                        return this.checkIsPairMyTurnAndBigger(listCard,listComingCard);
                    }else {
                        return true;
                    }
                }
            }
            
        }
    },
  
    checkDoiThong(listCard,soQuanHai){
        return false;
        //Tạm thời server chưa xử lý đc 3 đôi thông nên trả về false
        var checked=true;
        if(listCard.length % 2 ==1){
            return false;
        }

        var resultRank=[];
        for(var i=0;i<listCard.length;i++){
            for(var j=0;j<listCard.length;j++){
                if(listCard[i].rank == listCard[j].rank && listCard[i].serverValue!=listCard[j].serverValue && resultRank.indexOf(listCard[i].rank)<0){
                    resultRank.push(listCard[i].rank);
                }
            }
        }

        resultRank.sort();
        if(resultRank.length<3){
            checked=false;
        }
        for(var i=1;i<resultRank.length;i++){
            if(resultRank[i]!=resultRank[i-1]+1){
                checked=false;
                break;
            }
        }
        if(soQuanHai){
            switch (soQuanHai) {
                case 1:{
                    if(resultRank.length!=3){
                        return false;
                    }
                    break;
                }
                case 2:{
                    if(resultRank.length!=4){
                        return false;
                    }
                    break;
                }
                    
            }
        }
        return checked;
    },

    /**
     * Kiểm tra lượt đánh xem có hơp lệ khi đánh tứ quý chặt 2
     * @param {*} listCard 
     * @param {*} soQuanHai 
     */
    checkTuQuy(listCard,soQuanHai){
        if(!listCard){
            return false;
        }
        if(soQuanHai==1 && listCard.length!=4){
            return false;
        }else if(soQuanHai==2 && listCard.length!=8){
            return false;
        }
        var checked=true;
        if(listCard.length==4){
            for(var i=1;i<listCard.length;i++){
                if(listCard[i].rank!=listCard[0].rank){
                    checked=false
                    break;
                }
            }
        }else if(listCard.length==8){
            listCard=this.sortCardByRankIncrease(listCard);
            for(var i=1;i<4;i++){
                if(listCard[i].rank!=listCard[0].rank){
                    checked=false
                    break;
                }
            }
            for(var i=5;i<8;i++){
                if(listCard[i].rank!=listCard[4].rank){
                    checked=false
                    break;
                }
            }
        }
        
        return checked;
    },

}
module.exports = SamLogic;