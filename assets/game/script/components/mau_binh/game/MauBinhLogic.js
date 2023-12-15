var MauBinhLogic = {
    parseMauBinh(cardOwnerList){
        var mauBinh = [];
        if(cardOwnerList.length >= 13){
            mauBinh = [
                [cardOwnerList[10],cardOwnerList[11],cardOwnerList[12]],
                [cardOwnerList[5],cardOwnerList[6],cardOwnerList[7],cardOwnerList[8],cardOwnerList[9]],
                [cardOwnerList[0],cardOwnerList[1],cardOwnerList[2],cardOwnerList[3],cardOwnerList[4]]
            ]
        }
        return mauBinh;
    },
    parseMauBinhNode(lstCard){
        var mauBinh = [];
        if(lstCard.length >= 13){
            mauBinh = [
                [lstCard[10],lstCard[11],lstCard[12]],
                [lstCard[5],lstCard[6],lstCard[7],lstCard[8],lstCard[9]],
                [lstCard[0],lstCard[1],lstCard[2],lstCard[3],lstCard[4]]
            ]
        }
        return mauBinh;
    },
    getCardOwnerList(children){
        var lst = [];
        children.forEach(item => {
            var mauBinhCard = item.getComponent("MauBinhCard");
            if(mauBinhCard && lst.length < 13){
                lst.push(mauBinhCard);
            }
        });
        return lst;
    },
    getType(lstBauBinh){
        var lstType = [];
        lstBauBinh.forEach(mauBinh => {
            var item = this.getMauBinhType(mauBinh);
            lstType.push({
                type: item.typeCard,
                card: this.convertServerValue(item.lstCard)
            });
        });
        return lstType;
    },
    soChi(cardChi1,cardChi2){
        var kiemtra = true;
        var item1 = this.getMauBinhType(cardChi1);
        var item2 = this.getMauBinhType(cardChi2);
        if(item1.typeCard < item2.typeCard){
            kiemtra = false;
        }else if(item1.typeCard == item2.typeCard){
            if(item1.typeCard == 6){
                // trường hợp cù lũ tính theo sám
                var findRank1 = this.findRank(item1.lstCard);
                var findRank2 = this.findRank(item2.lstCard);
                var xam1,xam2;
                findRank1.forEach(item=>{
                    if(item.length == 3){
                        xam1 = item;
                    }
                });
                findRank2.forEach(item=>{
                    if(item.length == 3){
                        xam2 = item;
                    }
                });
                if(xam1 && xam2){
                    if(parseInt(xam1[0]/4) < parseInt(xam2[0]/4)){
                        kiemtra = false;
                    }
                }
            }else if(item1.typeCard == 4){
                var sanhBe1 = this.checkSanhBe(item1.lstCard);
                var sanhBe2 = this.checkSanhBe(item2.lstCard);
                if((sanhBe1 && sanhBe2) || (!sanhBe1 && !sanhBe2)){
                    var mauBinh1 = this.SapXep2(item1.lstCard);
                    var mauBinh2 = this.SapXep2(item2.lstCard);
                    kiemtra = this.soChiByRank(mauBinh1,mauBinh2);
                }else if(sanhBe1){
                    kiemtra = false;
                }
            }else if(item1.typeCard == 0){
                var mauBinh1 = this.SapXep2(this.parseServerValue(cardChi1));
                var mauBinh2 = this.SapXep2(this.parseServerValue(cardChi2));
                kiemtra = this.soChiByRank(mauBinh1,mauBinh2);
            }else{
                var mauBinh1 = this.SapXep2(item1.lstCard);
                var mauBinh2 = this.SapXep2(item2.lstCard);
                kiemtra = this.soChiByRank(mauBinh1,mauBinh2);
            }
        }
        return kiemtra;
    },
    soChiByRank(mauBinh1,mauBinh2){
        var check = true;
        for (let i = 0; i < mauBinh2.length; i++) {
            if(parseInt(mauBinh2[i]/4) > parseInt(mauBinh1[i]/4)){
                check = false;
                break;
            }else if(parseInt(mauBinh2[i]/4) == parseInt(mauBinh1[i]/4)){
                continue;
            }else{
                check = true;
                break;
            }
        }
        return check;
    },
    checkSanhBe(sanh){
        var A = false;
        var K = false;
        sanh.forEach(value=>{
            if(parseInt(value/4) == 14){
                A = true;
            }
        });
        sanh.forEach(value=>{
            if(parseInt(value/4) == 13){
                K = true;
            }
        });
        if(A && !K){
            return true;
        }else{
            return false;
        }
    },
    XepBai(cardOwnerList,cb){
        var lst = this.parseMauBinh(cardOwnerList);
        var lstConvert = [
            lst[2],lst[1],lst[0]
        ];
        var lstXepbai = [];
        lstConvert.forEach(item=>{
            var newItem = this.onSapXep(item);
            newItem.forEach(card=>{
                lstXepbai.push(card);
            });
        });
        if(cb){
            cb(lstXepbai);
        }
    },
    onSapXep(item){
        var kq = [];
        var lst = this.convertServerValue(this.SapXep2(this.parseServerValue(item)));
        lst.forEach(serverValue=>{
            for (let i = 0; i < item.length; i++) {
                if(Number(item[i].serverValue) == serverValue){
                    kq.push(item[i]);
                    break;
                }
            }
        });
        return kq;
    },
    SapXep2(lst){
        var lstNew = [];
        for (let i = lst.length -1; i >= 0; i--) {
            lstNew.push(lst[i]);
        }
        return lstNew;
    },
    getMauBinhType(mauBinh){
        var lstCard = [];
        var typeCard = 0;
        var lst = this.parseServerValue(mauBinh);
        if(mauBinh.length > 3){
            var thung = this.checkThung(lst);
            var sanh = this.checkSanh(lst);
            var findRank = this.findRank(lst);
            if(thung && sanh){
                typeCard = 8; // thùng phá sảnh
                if(lst[lst.length-1] % 4 == 14){
                    typeCard = 9; // thùng phá sảnh lớn
                }
            }else if(findRank.length == 2){
                if(findRank[0].length == 1 || findRank[0].length == 4){
                    typeCard = 7; // tứ quý
                    if(findRank[0].length == 4){
                        lstCard = findRank[0];
                    }else{
                        lstCard = findRank[1];
                    }
                }else{
                    typeCard = 6; // cù lũ
                }
            }else if(thung){
                typeCard = 5; // thùng
            }else if(sanh){
                typeCard = 4; // sảnh
            }else if(findRank.length == 3){
                typeCard = 2; // thú <--> 2 đôi
                findRank.forEach(item=>{
                    if(item.length == 3){
                        typeCard = 3; // sám
                    }
                    if(item.length > 1){
                        item.forEach(value=>{
                            lstCard.push(value);
                        })
                    }
                });
            }else if(findRank.length == 4){
                typeCard = 1; // đôi
                findRank.forEach(item=>{
                    if(item.length > 1){
                        lstCard = item;
                    }
                });
            }
        }else{
            var findRank = this.findRank(lst);
            if(findRank.length == 1){
                typeCard = 3; // sám
                lstCard = findRank[0];
            }else if(findRank.length == 2){
                typeCard = 1; // đôi
                findRank.forEach(item=>{
                    if(item.length > 1){
                        lstCard = item;
                    }
                });
            }
        }
        if(typeCard >= 4 && typeCard != 7){
            lstCard = lst;
        }
        return {typeCard:typeCard,lstCard:lstCard};
    },
    checkSanh(lst){
        var count = 1;
        var rank = parseInt(lst[0] / 4);
        lst.forEach(value=>{
            if(parseInt(value / 4) == rank + 1){
                count++;
                rank++;
            }
        });
        if(count < 5 && parseInt(lst[lst.length-1] / 4) == 14){
            count = 1;
            rank = 1;
            lst.forEach(value=>{
                if(parseInt(value / 4) == rank + 1){
                    count++;
                    rank++;
                }
            });
        }
        return count == 5 ? true : false;
    },
    checkThung(lst){
        var count = 0;
        var type = lst[0] % 4;
        lst.forEach(value=>{
            if(type == value % 4){
                count++;
            }
        });
        return count == 5 ? true : false;
    },
    SapXep(listCard){
        var i = 0;
        while(i < listCard.length){
            var j =  i + 1;
            while( j < listCard.length){
                if(listCard[i] > listCard[j]){
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
    parseServerValue(lstNode){
        var lst = [];
        lstNode.forEach(node=>{
            var cm = node.getComponent("MauBinhCard");
            var rank = Number(cm.rank);
            if(rank == 1) rank = 14;
            //else if(rank == 2) rank = 15;
            var value = rank * 4 + (Number(cm.type) -1);
            lst.push(value);
        });
        return this.SapXep(lst);
    },
    getServerValue(cardOwnerList){
        var lst = [];
        cardOwnerList.forEach(card=>{
            lst.push(Number(card.serverValue));
        });
        return lst;
    },
    getServerValueToString(cardOwnerList){
        var myCard = "";
        cardOwnerList.forEach(card=>{
            if(myCard == "") myCard = card.serverValue;
            else{
                myCard += "#" + card.serverValue;
            }
        });
        return myCard;
    },
    convertServerValue(lst){
        var lstConvert = [];
        lst.forEach(value=>{
            var rank  = parseInt(value/4);
            if(rank == 14) rank = 1;
            //else if(rank == 15) rank = 2;
            var type = value % 4;
            var temp;
            switch(type){
                case 0: temp = 2; break;
                case 1: temp = 1; break;
                case 2: temp = 3; break;
                case 3: temp = 4; break;
            }
            var number = 13 * temp + rank - 13;
            lstConvert.push(number);
        });
        return lstConvert;
    },
    findRank(lst){
        var findRank = [];
        var rank = parseInt(lst[0] / 4);
        var lstRank = [];
        lst.forEach(item =>{
            if(rank < parseInt(item / 4)){
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
};
module.exports = MauBinhLogic;
