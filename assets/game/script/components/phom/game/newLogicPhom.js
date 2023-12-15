var logicPhom = {
    spliceCard(lst, listCard) {
        var lstNew = [];
        listCard.forEach(item => {
            if (lst.indexOf(item) < 0) {
                lstNew.push(item);
            }
        });
        return lstNew;
    },
    findByRank(listCard, value) {
        var rank = parseInt(value / 4);
        var phom = [];
        listCard.forEach(item => {
            if (parseInt(item / 4) == rank) {
                phom.push(item);
            }
        });
        return phom.indexOf(value) > -1 ? phom : [];
    },
    findByChain(listCard, value) {
        var phom = [];
        var lst = [];
        listCard.forEach(card => {
            if (card % 4 == value % 4) {
                // mảng cùng chất
                lst.push(card);
            }
        });
        // tìm rank nhỏ nhất mà value có
        var rank = parseInt(value / 4);
        for (let i = lst.length - 1; i >= 0; i--) {
            if (parseInt(lst[i] / 4) == rank - 1) {
                rank--;
            }
        }
        lst.forEach(item => {
            if (parseInt(item / 4) == rank) {
                if (rank == parseInt(value / 4)) {
                    if (item == value) {
                        phom.push(item);
                        rank++;
                    }
                } else {
                    phom.push(item);
                    rank++;
                }
            }
        });
        return phom.indexOf(value) > -1 ? phom : [];
    },
    checkPhom(phom, value) {
        var check = true;
        for (let i = 0; i < phom.length; i++) {
            if (phom[i] < value) {
                check = false;
                break;
            }
        }
        return check;
    },
    findNew(phom, lstCard) {
        // kiểm tra xem nếu mất lá có giá trị value thì phỏm còn là phỏm ko, trả về phỏm mới đó
        var phomNew = [];
        phom.forEach(item => {
            if (lstCard.indexOf(item) < 0) {
                phomNew.push(item);
            }
        });
        if (phomNew.length >= 3) {
            if (phom[1] - phom[0] == 4) {
                // xét phỏm cùng chất (tìm ra 1 phỏm theo chất từ phỏm mất đi 1 lá value)            
                var maxPoint = 0;
                var list = [];
                phomNew.forEach(item => {
                    var lst = this.findByChain(phomNew, item);
                    var point = this.getPoint(lst);
                    if (lst.length >= 3 && point > maxPoint) {
                        list = lst;
                        maxPoint = point;
                    }
                });
                phomNew = list;
                // cuối cùng sẽ có 1 phỏm có số điểm lớn nhất
            }
        } else {
            phomNew = [];
        }
        return phomNew;
    },
    getPoint(lst) {
        var point = 0;
        lst.forEach(value => {
            point += parseInt(value / 4);
        });
        return point;
    },
    getArr(listCard) {
        var arr = {
            phomRank: [],
            phomChain: []
        };
        listCard.forEach(value => {
            // lấy ra các phỏm còn lại mà ko chứa các lá ăn gà nữa
            var findByRank = this.findByRank(listCard, value); // phỏm theo giá trị
            var findByChain = this.findByChain(listCard, value); // phỏm theo chất
            if (findByRank.length > 2 && this.checkPhom(findByRank, value)) {
                arr.phomRank.push(findByRank);
            }
            if (findByChain.length > 2 && this.checkPhom(findByChain, value)) {
                arr.phomChain.push(findByChain);
            }
        });
        return arr;
    },
    chekcLaAnGa(lst, listAnGa) {
        // hàm kiểm tra chứa 1 lá ăn gà (chứa 1 lá là true)
        var check = false;
        for (let i = 0; i < lst.length; i++) {
            if (listAnGa.indexOf(lst[i]) > -1) {
                check = true;
                break;
            }
        }
        return check;
    },
    chekcLaAnGaAll(lst, listAnGa) {
        // hàm kiểm tra chứa tất cả lá ăn gà (chứa hết lá ăn gà mới là true)
        var check = true;
        for (let i = 0; i < listAnGa.length; i++) {
            if (lst.indexOf(listAnGa[i]) < 0) {
                check = false;
                break;
            }
        }
        return check;
    },
    pushPhom(arr, value, phom, listAnGa) {
        if (arr[value].length > 0) {
            var phom1 = this.findNew(arr[value][0], [value]);
            if (phom1.length >= 3) {
                arr[value][0] = phom;
                arr[phom1[0]].push(phom1);
            } else {
                var phom2 = this.findNew(phom, [value]);
                if (phom2.length >= 3) {
                    arr[phom2[0]].push(phom2);
                } else {
                    var check1 = this.chekcLaAnGa(arr[value][0], listAnGa);
                    var check2 = this.chekcLaAnGa(phom, listAnGa);
                    // cả 2 phỏm đều ko thể bỏ đi lá value -> chọn 1 trong 2 phỏm
                    if (!check1 && check2) {
                        arr[value][0] = phom;
                    } else if ((check1 && check2) || (!check1 && !check2)) {
                        // cả 2 đều chứa lá ăn gà -> lấy phỏm có điểm cao hơn
                        if (this.getPoint(arr[value][0]) < this.getPoint(phom)) {
                            arr[value][0] = phom;
                        }
                    }
                }
            }
        } else {
            arr[value].push(phom);
        }
    },
    findPhom(listCard, listAnGa) {
        listCard = this.SapXep(listCard); // sắp xếp theo thứ tự từ nhỏ đến lớn 
        var arr = [];
        while (arr.length < 56) {
            arr.push([]);
        }
        listCard.forEach(value => {
            // lấy ra các phỏm còn lại mà ko chứa các lá ăn gà nữa
            var findByRank = this.findByRank(listCard, value); // phỏm theo giá trị
            var findByChain = this.findByChain(listCard, value); // phỏm theo chất
            if (findByRank.length > 2 && this.checkPhom(findByRank, value)) {
                this.pushPhom(arr, value, findByRank, listAnGa);
            }
            if (findByChain.length > 2 && this.checkPhom(findByChain, value)) {
                this.pushPhom(arr, value, findByChain, listAnGa);
            }
        });
        // đã lấy được mảng các phỏm tối ưu (ưu tiên lá ăn gà và phỏm có point lớn nhất trong bộ bài)

        var lstPhom = [];
        var card = [];
        var lst = {};
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].length > 0) {
                arr[i][0].forEach(value => {
                    if (lstPhom.indexOf(value) > -1) {
                        lst[value] += "," + i;
                        card.push(value);
                    } else {
                        lst[value] = i;
                        lstPhom.push(value);
                    }
                });
            }
        }
        // xử lý các phỏm có các lá dùng chung
        card.forEach(value => {
            var chan = lst[value].split(','); // chán :))
            var oki = false;
            var tt = [];
            for (let j = 0; j < chan.length; j++) {
                var index = parseInt(chan[j]);
                if (arr[index].length > 0) {
                    var phom = this.findNew(arr[index][0], [value]);
                    if (phom.length >= 3) {
                        // mất lá mà vẫn thỏa mãn là phỏm
                        arr[index][0] = phom;
                        oki = true;
                        break;
                    } else {
                        // lưu lại thông tin để so sánh về sau
                        if (this.chekcLaAnGa(arr[index][0], listAnGa)) {
                            // nếu chứa lá ăn gà cộng thêm 10000 điểm
                            tt.push({ index: index, point: this.getPoint(arr[index][0]) + 10000 });
                        } else {
                            tt.push({ index: index, point: this.getPoint(arr[index][0]) });
                        }
                    }
                } else {
                    cc.log("Đã bị xóa trước đó rồi!!");
                }
            }
            if (!oki) {
                //not OKI
                var index = 0;
                var minPoint = 100000;
                for (let k = 0; k < tt.length; k++) {
                    if (minPoint > tt[k].point) {
                        minPoint = tt[k].point;
                        index = tt[k].index;
                    }
                }
                arr[index] = [];
            }
        });
        lstPhom = [];
        arr.forEach(phom => {
            phom.forEach(item => {
                item.forEach(value => {
                    lstPhom.push(value);
                });
            });
        });
        var lstPhomRank = [];
        var lstPhomChain = [];
        // kiểm tra lần cuối để tránh lấy thiếu phỏm trong quá trình lấy phỏm tối ưu
        var lastCheck = this.getArr(listCard);
        lastCheck.phomRank.forEach(phom => {
            lstPhom = this.addPhom(lstPhom, phom);
            phom.forEach(value => {
                lstPhomRank.push(value);
            });
        });
        lastCheck.phomChain.forEach(phom => {
            lstPhom = this.addPhom(lstPhom, phom);
            lstPhomRank = this.addPhom(lstPhomRank, phom);
            phom.forEach(value => {
                lstPhomChain.push(value);
            });
        });
        lastCheck.phomRank.forEach(phom => {
            lstPhomChain = this.addPhom(lstPhomChain, phom);
        });
        if (this.chekcLaAnGaAll(lstPhomRank, listAnGa) && this.getPoint(lstPhomRank) > this.getPoint(lstPhom)) {
            lstPhom = lstPhomRank;
        }
        if (this.chekcLaAnGaAll(lstPhomChain, listAnGa) && this.getPoint(lstPhomChain) > this.getPoint(lstPhom)) {
            lstPhom = lstPhomChain;
        }
        return lstPhom;
    },
    addPhom(lstPhom, phom) {
        var card = [];
        phom.forEach(value => {
            if (lstPhom.indexOf(value) > -1) {
                card.push(value);
            }
        });
        if (card.length > 0) {
            var phomNew = this.findNew(phom, card);
            if (phomNew.length >= 3) {
                phomNew.forEach(value => {
                    lstPhom.push(value);
                });
            }
        } else {
            phom.forEach(value => {
                lstPhom.push(value);
            });
        }
        return lstPhom;
    },
    xepBai(listCard, listAnGa, sortType) {
        var lstPhom = this.findPhom(listCard, listAnGa); // Đã là phỏm
        var lst = this.spliceCard(lstPhom, listCard); // loại bỏ các phỏm ra khỏi các lá bài lẻ cần sắp xếp // danh sách chỉ còn các cạ và các quân bài lẻ
        if (sortType == 0) {
            lst = this.findRank(lst);
        } else {
            lst = this.SapXep(lst);
        }
        return lstPhom.concat(lst);
    },
    SapXep(listCard) {
        var i = 0;
        while (i < listCard.length) {
            var j = i + 1;
            while (j < listCard.length) {
                if (listCard[i] > listCard[j]) {
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
    findRank(listCard) {
        // sắp xếp theo giá trị quân bài
        var lst = [];
        var lstRankLe = [];
        if (listCard.length > 0) {
            var rank = parseInt(listCard[0] / 4);
            var lstRank = [];
            listCard.forEach(item => {
                if (rank < parseInt(item / 4)) {
                    if (lstRank.length > 1) {
                        lstRank.forEach(value => {
                            lst.push(value);
                        })
                    } else {
                        lstRankLe.push(lstRank[0]);
                    }
                    rank = parseInt(item / 4);
                    lstRank = [item];
                } else {
                    lstRank.push(item);
                }
            });
            if (lstRank.length > 1) {
                lstRank.forEach(value => {
                    lst.push(value);
                })
            } else {
                lstRankLe.push(lstRank[0]);
            }
        }
        lstRankLe = this.SapXep(lstRankLe);
        lstRankLe = this.findChain2(lstRankLe); // tìm 1 lần nữa theo chất
        return lst.concat(lstRankLe);
    },
    findRank2(listCard) {
        // sắp xếp theo giá trị quân bài
        var lst = [];
        var lstRankLe = [];
        if (listCard.length > 0) {
            var rank = parseInt(listCard[0] / 4);
            var lstRank = [];
            listCard.forEach(item => {
                if (rank < parseInt(item / 4)) {
                    if (lstRank.length > 1) {
                        lstRank.forEach(value => {
                            lst.push(value);
                        })
                    } else {
                        lstRankLe.push(lstRank[0]);
                    }
                    rank = parseInt(item / 4);
                    lstRank = [item];
                } else {
                    lstRank.push(item);
                }
            });
            if (lstRank.length > 1) {
                lstRank.forEach(value => {
                    lst.push(value);
                });
            } else {
                lstRankLe.push(lstRank[0]);
            }
        }
        return lst.concat(lstRankLe);
    },
    findChain(listCard) {
        // sắp xếp theo chất
        var lstCard = [[], [], [], []];
        listCard.forEach(item => {
            if (item) {
                switch (parseInt(item % 4)) {
                    case 0: lstCard[0].push(item); break;
                    case 1: lstCard[1].push(item); break;
                    case 2: lstCard[2].push(item); break;
                    case 3: lstCard[3].push(item); break;
                }
            }
        });
        var lst = [];
        var lstChainLe = [];
        lstCard.forEach(item => {
            if (item.length > 0) {
                for (let i = 0; i < item.length; i++) {
                    if ((i > 0 && (item[i] - item[i - 1] == 4 || item[i] - item[i - 1] == 8)) || (i < item.length - 1 && (item[i + 1] - item[i] == 4 || item[i + 1] - item[i] == 8))) {
                        // kiểm tra lá trước và lá sau lá này
                        lst.push(item[i]);
                    } else {
                        lstChainLe.push(item[i]);
                    }
                }
            }
        });
        lstChainLe = this.SapXep(lstChainLe);
        lstChainLe = this.findRank2(lstChainLe); // tìm 1 lần nữa theo rank
        return lst.concat(lstChainLe);
    },
    findChain2(listCard) {
        // sắp xếp theo chất
        var lstCard = [[], [], [], []];
        listCard.forEach(item => {
            if (item) {
                switch (parseInt(item % 4)) {
                    case 0: lstCard[0].push(item); break;
                    case 1: lstCard[1].push(item); break;
                    case 2: lstCard[2].push(item); break;
                    case 3: lstCard[3].push(item); break;
                }
            }
        });
        var lst = [];
        var lstChainLe = [];
        lstCard.forEach(item => {
            if (item.length > 0) {
                for (let i = 0; i < item.length; i++) {
                    if ((i > 0 && (item[i] - item[i - 1] == 4 || item[i] - item[i - 1] == 8)) || (i < item.length - 1 && (item[i + 1] - item[i] == 4 || item[i + 1] - item[i] == 8))) {
                        // kiểm tra lá trước và lá sau lá này
                        lst.push(item[i]);
                    } else {
                        lstChainLe.push(item[i]);
                    }
                }
            }
        });
        return lst.concat(lstChainLe);
    },
    checkAnGa(listCard, listAnGa, newCard) {
        var listCardNew = [newCard];
        var listAnGaNew = [newCard];
        listCard.forEach(value => {
            listCardNew.push(value);
        });
        listAnGa.forEach(value => {
            if (listCard.indexOf(value) >= 0) {
                listAnGaNew.push(value);
            }
        });
        var lstPhom = this.findPhom(listCardNew, listAnGaNew);
        var check = this.countLaAnGa(lstPhom, listAnGaNew) == listAnGaNew.length ? true : false;
        if (check) {
            var phom = this.getPhom(lstPhom, listAnGaNew);
            phom.forEach(item => {
                if (this.countLaAnGa(item, listAnGaNew) > 1) {
                    check = false;
                }
            });
        }
        return check;
    },
    checkDanhBai(listCard, listAnGa, oldCard) {
        var listCardNew = [];
        var listAnGaNew = [];
        listCard.forEach(value => {
            if (value !== oldCard) {
                listCardNew.push(value);
            }
        });
        listAnGa.forEach(value => {
            if (listCard.indexOf(value) >= 0) {
                listAnGaNew.push(value);
            }
        });
        var lstPhom = this.findPhom(listCardNew, listAnGaNew);
        var check = this.countLaAnGa(lstPhom, listAnGaNew) == listAnGaNew.length ? true : false;
        return check;
    },
    getPhom(lstPhom, listAnGa) {
        lstPhom = this.SapXep(lstPhom);
        var phom = [];
        var card = []; // lá có thể dùng chung
        var phomRank = [];
        var phomChain = [];
        lstPhom.forEach(value => {
            // lấy ra các phỏm còn lại mà ko chứa các lá ăn gà nữa
            var findByRank = this.findByRank(lstPhom, value); // phỏm theo giá trị
            var findByChain = this.findByChain(lstPhom, value); // phỏm theo chất
            if (findByRank.length > 2 && findByChain.length > 2) {
                card.push(value);
            }
            if (findByRank.length > 2 && this.checkPhom(findByRank, value)) {
                phom.push(findByRank);
                phomRank.push(findByRank);
            }
            if (findByChain.length > 2 && this.checkPhom(findByChain, value)) {
                phom.push(findByChain);
                phomChain.push(findByChain);
            }
        });
        var checkRank = [];
        var checkChain = [];
        if (phomRank.length == 0) {
            phomChain.forEach(item => {
                checkChain.push(item);
            });
            if (checkChain.length >= listAnGa.length) {
                return checkChain;
            }
        } else if (phomChain.length == 0) {
            phomRank.forEach(item => {
                checkRank.push(item);
            });
            if (checkRank.length >= listAnGa.length) {
                return checkRank;
            }
        } else {
            var lengthRank = 0;
            phomRank.forEach(item => {
                checkRank.push(item);
                lengthRank += item.length;
            });
            if (lengthRank == lstPhom.length && checkRank.length >= listAnGa.length) {
                return checkRank;
            } else {
                var lengthChain = 0;
                phomChain.forEach(item => {
                    checkChain.push(item);
                    lengthChain += item.length;
                });
                if (lengthChain == lstPhom.length && checkChain.length >= listAnGa.length) {
                    return checkChain;
                } else if (lengthChain + lengthRank == lstPhom.length && phom.length >= listAnGa.length) {
                    return phom;
                }
            }
        }
        card.forEach(value => {
            // 1 lá sẽ dc dùng chung bởi tối đa 2 phỏm
            if (listAnGa.indexOf(value) > -1) {
                // vừa dùng chung vừa là lá ăn gà
                var index = null;
                for (let i = 0; i < phom.length; i++) {
                    if (phom[i].indexOf(value) > -1) {
                        if (index == null) {
                            index = i; // vị trí phỏm 1
                        } else {
                            if (this.countLaAnGa(phom[index], listAnGa) > 1) {
                                var findNew = this.findNew(phom[index], [value]);
                                if (findNew.length > 2) {
                                    phom[index] = findNew;
                                    break;
                                }
                            } else {
                                var findNew = this.findNew(phom[i], [value]);
                                if (findNew.length > 2) {
                                    phom[i] = findNew;
                                    break;
                                } else {
                                    findNew = this.findNew(phom[index], [value]);
                                    if (findNew.length > 2) {
                                        phom[index] = findNew;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                for (let i = 0; i < phom.length; i++) {
                    if (phom[i].indexOf(value) > -1) {
                        var findNew = this.findNew(phom[i], [value]);
                        if (findNew.length > 2) {
                            phom[i] = findNew;
                            break;
                        }
                    }
                }
            }
        });
        var phomNew = [];
        for (let j = 0; j < phom.length; j++) {
            if (this.countLaAnGa(phom[j], listAnGa) == 2 && listAnGa.length == 2) {
                // thằng phỏm ngu này chứa 2 lá ăn gà
                if (phom[j].length > 5) {
                    // còn có thể cứu được này
                    phom[j] = this.SapXep(phom[j]);
                    var index0 = phom[j].indexOf(listAnGa[0]);
                    var index1 = phom[j].indexOf(listAnGa[1]);
                    if ((index0 < 3 && index1 >= 3) || (index0 >= 3 && index1 < 3)) {
                        // chúng khác phỏm khi tách ra
                        while (phom[j].length > 5) {
                            var lst = [];
                            while (lst.length < 3) {
                                // chia đều ra 3 lá
                                lst.push(phom[j][0]);
                                phom[j].splice(0, 1);
                            }
                            phomNew.push(lst);
                        }
                    }
                }
            } else {
                // cái này đúng cho khi chứa 0,1,3 lá ăn gà trong phỏm
                phom[j] = this.SapXep(phom[j]);
                while (phom[j].length > 5) {
                    var lst = [];
                    while (lst.length < 3) {
                        // chia đều ra 3 lá
                        lst.push(phom[j][0]);
                        phom[j].splice(0, 1);
                    }
                    phomNew.push(lst);
                }
            }
            phomNew.push(phom[j]);
        }
        return phomNew;
    },
    countLaAnGa(phom, listAnGa) {
        var count = 0;
        phom.forEach(value => {
            if (listAnGa.indexOf(value) > -1) {
                count++;
            }
        });
        return count;
    },
    computerDanhBai(listCard, listAnGa) {
        var card = null;
        var lstPhom = this.findPhom(listCard, listAnGa);
        if (lstPhom.length < 9) {
            var lst = this.spliceCard(lstPhom, listCard);
            // danh sách này chắc chắc ko chứa lá ăn gà (vì đã loại bỏ các phỏm ra rồi);
            // chọn 1 lá trong để đánh lst thôi
            card = this.findLaLe(lst);
        }
        return card;
    },

    findLaLe(lst) {
        if (lst.length > 0) {
            var card = lst[lst.length - 1]; // lá nhỏ nhất bộ lẻ
            var lstRankLe = [];
            var rank = parseInt(lst[0] / 4);
            var lstRank = [];
            lst.forEach(item => {
                if (rank < parseInt(item / 4)) {
                    if (lstRank.length < 2) {
                        lstRankLe.push(lstRank[0]);
                    }
                    rank = parseInt(item / 4);
                    lstRank = [item];
                } else {
                    lstRank.push(item);
                }
            });
            if (lstRank.length < 2) {
                lstRankLe.push(lstRank[0]);
            }

            lstRankLe = this.SapXep(lstRankLe);
            var lstCard = [[], [], [], []];
            lstRankLe.forEach(item => {
                if (item) {
                    switch (parseInt(item % 4)) {
                        case 0: lstCard[0].push(item); break;
                        case 1: lstCard[1].push(item); break;
                        case 2: lstCard[2].push(item); break;
                        case 3: lstCard[3].push(item); break;
                    }

                }
            });
            var lstChainLe = [];
            lstCard.forEach(item => {
                if (item.length > 0) {
                    for (let i = 0; i < item.length; i++) {
                        if ((i > 0 && (item[i] - item[i - 1] == 4 || item[i] - item[i - 1] == 8)) || (i < item.length - 1 && (item[i + 1] - item[i] == 4 || item[i + 1] - item[i] == 8))) {
                            // kiểm tra lá trước và lá sau lá này
                        } else {
                            lstChainLe.push(item[i]);
                        }
                    }
                }
            });
            if (lstChainLe.length > 0) {
                card = lstChainLe[0];
                lstChainLe.forEach(value => {
                    if (card < value) card = value;
                });
            }
            return card;
        } else {
            return null;
        }
    },
    haPhom(listCard, listAnGa) {
        var lstPhom = this.findPhom(listCard, listAnGa);
        var phom = this.getPhom(lstPhom, listAnGa);
        return phom;
    },
    parse_MylstCard(lstCom) {
        var lst = [];
        lstCom.forEach(com => {
            var value = Number(com.rank) * 4 + (Number(com.type) - 1);
            lst.push(value);
        });
        return lst;
    },
    convert_SeverCard(lst) {
        var lstConvert = [];
        lst.forEach(value => {
            var rank = parseInt(value / 4);
            var type = value % 4;
            var temp;
            switch (type) {
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
    foothold(cardOwnerList, lstConvert) {
        var lst = [];
        lstConvert.forEach(value => {
            var phomCard = null;
            for (let i = 0; i < cardOwnerList.length; i++) {
                if (Number(cardOwnerList[i].serverValue) == value) {
                    phomCard = cardOwnerList[i];
                    break;
                }
            }
            if (phomCard) {
                lst.push(phomCard);
            }
        });
        return lst;
    },
}

module.exports = logicPhom;