var logicGame = {
    parseCardOwnerList(lstNode){
        var lst = [];
        lstNode.forEach(cm=>{
            var rank = Number(cm.rank);
            if(rank == 1) rank = 14;
            var value = rank * 4 + (Number(cm.type) -1);
            lst.push(value);
        });
        return lst;
    },
    checkAnTrang(lst){
        var check = false;
        var maubinh  = this.parseCardOwnerList(lst);
        if(maubinh && maubinh.length == 13){
            var cardOwnerList = this.SapXep(maubinh);
            var listCard = this.rongCuon(cardOwnerList);
            if(listCard.length == 0){
                listCard = this.sanhRong(cardOwnerList);
                if(listCard.length == 0){
                    listCard = this.namDoi1Sam_sauDoi(cardOwnerList);
                }
            }
            if(listCard.length == 13){
                check = true;
            }
            if(!check){
                maubinh  = this.parseCardOwnerList(lst);
                var binh = [
                    [maubinh[0],maubinh[1],maubinh[2],maubinh[3],maubinh[4]],
                    [maubinh[5],maubinh[6],maubinh[7],maubinh[8],maubinh[9]],
                    [maubinh[10],maubinh[11],maubinh[12]]
                ];
                var binh1 = this.SapXep(binh[0]);
                var binh2 = this.SapXep(binh[1]);
                var binh3 = this.SapXep(binh[2]);

                if(this.checkThung(binh1) && this.checkThung(binh2) && this.checkThung(binh3)){
                    check = true;
                }
                if(this.checkSanh(binh1) && this.checkSanh(binh2) && this.checkSanh(binh3)){
                    check = true;
                }
            }
        } 
        return check;
    },
    checkThung(lst){
        var count = 0;
        var type = lst[0] % 4;
        lst.forEach(value=>{
            if(type == value % 4){
                count++;
            }
        });
        return count == lst.length ? true : false;
    },
    checkSanh(lst){
        var count = 1;
        if(lst && lst.length > 0){
            var rank = parseInt(lst[0]/4);
            for (let i = 1; i < lst.length; i++) {
                if(parseInt(lst[i]/4) == rank-1){
                    rank--;
                    count++;
                }else{
                    break;
                }
            }
        }
        if(count < lst.length && parseInt(lst[0]/4) == 14){
            var lstNew = [];
            lst.forEach(value=>{
                if(parseInt(value/4) < 14){
                    lstNew.push(value); 
                }
            });
            lstNew.push(7);// thêm 1 quân át vào bộ bài để check sảnh bé
            count = 1;
            if(lstNew && lstNew.length > 0){
                var rank = parseInt(lstNew[0]/4);
                for (let i = 1; i < lstNew.length; i++) {
                    if(parseInt(lstNew[i]/4) == rank-1){
                        rank--;
                        count++;
                    }else{
                        break;
                    }
                }
            }
        }
        return count == lst.length ? true:false;
    },
    rongCuon(cardOwnerList){
        var anTrang = [];

        if(cardOwnerList && cardOwnerList.length == 13){
            var type = cardOwnerList[0] % 4;
            cardOwnerList.forEach(value=>{
                if(value%4 == type){
                    anTrang.push(value);
                }
            });
        }
        return anTrang.length == 13 ? anTrang : [];
    },
    sanhRong(cardOwnerList){
        var anTrang = [];
        if(cardOwnerList && cardOwnerList.length == 13){
            var rank = parseInt(cardOwnerList[0]/4);
            anTrang.push(cardOwnerList[0]);
            for (let i = 1; i < cardOwnerList.length; i++) {
                if(parseInt(cardOwnerList[i]/4) == rank-1){
                    rank--;
                    anTrang.push(cardOwnerList[i]);
                }else{
                    break;
                }
            }
        }
        return anTrang.length == 13 ? anTrang : [];
    },
    namDoi1Sam_sauDoi(cardOwnerList){
        var anTrang = [];
        if(cardOwnerList && cardOwnerList.length == 13){
            var findRank = this.findRank(cardOwnerList);
            var doi = 0;
            var sam = 0;
            findRank.forEach(item=>{
                if(item.length == 2){
                    doi++;
                }else if(item.length == 3){
                    sam++;
                }
            });
            if((doi == 5 && sam == 1) || doi == 6){
                anTrang = cardOwnerList;
            }
        }
        return anTrang.length == 13 ? anTrang : [];
    },
    baThung(cardOwnerList){
        var anTrang = [];
        if(cardOwnerList && cardOwnerList.length == 13){
            for (let i = 0; i < cardOwnerList.length; i++) {
                var thung1 = this.findThung(cardOwnerList,cardOwnerList[i]);
                if(thung1.length == 5){
                    anTrang = thung1;
                    cardOwnerList = this.spliceCard(thung1,cardOwnerList);
                    break;
                }
            }
            for (let i = 0; i < cardOwnerList.length; i++) {
                var thung2 = this.findThung(cardOwnerList,cardOwnerList[i]);
                if(thung2.length == 5){
                    thung2.forEach(value=>{
                        anTrang.push(value);
                    });
                    cardOwnerList = this.spliceCard(thung2,cardOwnerList);
                    break;
                }
            }
            if(cardOwnerList.length == 3 && this.checkThung(cardOwnerList)){
                cardOwnerList.forEach(value=>{
                    anTrang.push(value);
                });
            }
        }
        return anTrang.length == 13 ? anTrang : [];
    },
    baSanh(cardOwnerList){
        var anTrang = [];
        if(cardOwnerList && cardOwnerList.length > 0){
            for (let i = 0; i < cardOwnerList.length; i++) {
                var sanh1 = this.findSanh(cardOwnerList,cardOwnerList[i]);
                if(sanh1.length == 5){
                    anTrang = sanh1;
                    cardOwnerList = this.spliceCard(sanh1,cardOwnerList);
                    break;
                }
            }
            for (let i = 0; i < cardOwnerList.length; i++) {
                var sanh2 = this.findSanh(cardOwnerList,cardOwnerList[i]);
                if(sanh2.length == 5){
                    sanh2.forEach(value=>{
                        anTrang.push(value);
                    });
                    cardOwnerList = this.spliceCard(sanh2,cardOwnerList);
                    break;
                }
            }
            if(cardOwnerList.length == 3 && this.checkSanh(cardOwnerList)){
                cardOwnerList.forEach(value=>{
                    anTrang.push(value);
                });
            }
        }
        return anTrang.length == 13 ? anTrang : [];
    },
    changeSanh_A(cardOwnerList){
        var lst = [];
        var lstA = [];
        cardOwnerList.forEach(item=>{
            if(item < 56){
                lst.push(item);
            }else{
                lstA.push(item-52); // đổi về sảnh thấp nhất
            }
        });
        lstA.forEach(valueA=>{
            lst.push(valueA);
        });
        return lst;
    },
    findThung(cardOwnerList,value){
        var listCard = [value];
        cardOwnerList.forEach(item=>{
            if(item < value && item%4 == value%4 && listCard.length < 5){
                listCard.push(item);
            }
        });
        return listCard.length == 5 ? listCard: [];
    },
    findSanh(cardOwnerList,value){
        var listCard = [value];
        var rank = parseInt(value/4);
        cardOwnerList.forEach(item=>{
            if(item < value && rank == parseInt(item/4)+1 && listCard.length < 5){
                rank = parseInt(item/4);
                listCard.push(item);
            }
        });
        return listCard.length == 5 ? listCard:[];
    },
    convertLstDanh(lstDanh){
        var myTurnCard = "";
        lstDanh.forEach(value=>{
            var rank  = parseInt(value/4);
            if(rank == 14) rank = 1;
            var type = value % 4;
            var temp;
            switch(type){
                case 0: temp = 2; break;
                case 1: temp = 1; break;
                case 2: temp = 3; break;
                case 3: temp = 4; break;
            }
            var number = 13 * temp + rank - 13;
            if(myTurnCard == "") myTurnCard = number;
            else myTurnCard += "#" + number;
        });
        return myTurnCard;
    },
    spliceCard(lst,listCard){
        var lstNew = [];
        listCard.forEach(item =>{
            if(lst.indexOf(item) < 0){
                lstNew.push(item);
            }
        });
        return lstNew; 
    },
    findByRank(listCard, value){
        var rank = parseInt(value / 4);
        var phom = [];
        listCard.forEach(item => {
            if(parseInt(item / 4) == rank){
                phom.push(item);
            }
        });
        return phom.indexOf(value) > -1 ? phom : [];
    },
    checkThung(lst){
        var count = 0;
        var type = lst[0] % 4;
        lst.forEach(value=>{
            if(type == value % 4){
                count++;
            }
        });
        return count == lst.length ? true : false;
    },
    checkSanh(lst){
        var count = 1;
        if(lst && lst.length > 0){
            var rank = parseInt(lst[0]/4);
            for (let i = 1; i < lst.length; i++) {
                if(parseInt(lst[i]/4) == rank-1){
                    rank--;
                    count++;
                }else{
                    break;
                }
            }
        }
        return count == lst.length ? true:false;
    },
    SapXep(listCard){
        var i = 0;
        while(i < listCard.length){
            var j =  i + 1;
            while( j < listCard.length){
                if(listCard[i] < listCard[j]){
                    var value = listCard[i];
                    listCard[i] = listCard[j];
                    listCard[j] = value;
                }
                j++;
            }
            i++;
        }
        return listCard;
    },
    findRank(listCard){
        var findRank = [];
        var rank = parseInt(listCard[0] / 4);
        var lstRank = [];
        listCard.forEach(item =>{
            if(rank > parseInt(item / 4)){
                findRank.push(lstRank);
                rank = parseInt(item / 4);
                lstRank = [item];
            }else{
                lstRank.push(item);
            }
        });
        findRank.push(lstRank);
        return findRank;
    }
}
module.exports = logicGame;