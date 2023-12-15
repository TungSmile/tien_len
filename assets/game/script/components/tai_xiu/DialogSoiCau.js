var Global = require('Global');
var Api = require('Api');
var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        pn1: cc.Node,
        pn2: cc.Node,

        pnChartXX: cc.Node,
        pnChartTotal: cc.Node,

        txtIDPhien: cc.Label,
        txtValuePhien: cc.Label,

        prefabSoicauDay: cc.Prefab,
        prefabSoicau: {
            default: [],
            type: cc.Prefab,
        },
        checkbox: {
            default: [],
            type: cc.Toggle
        }
    },

    onLoad() {
        cc.log("Linker.dataSoiCau",Linker.dataSoiCau);
        if(Linker.dataSoiCau){
            var tempArray = Linker.dataSoiCau.array;
                var _Array = tempArray[0];
                var temp_array1 = _Array[0];
                var temp_array2 = tempArray[1];
                var arrResult = tempArray[6];
                
                //kyun: modified:  
                this.initListSoiCau(tempArray, temp_array1, temp_array2);
                //this.initListSoiCau(tempArray, temp_array1, temp_array2, dialogSoiCau);
                //kyun: modified: EOF
                this.initSoiCauDay(arrResult);
        }else{
            Api.get(Global.configPurchase.API_URL+"api-soicau", (data) => {
                if (data) {
                    //cc.log("API SOI CAU", data);
                    var tempArray = data.array;
                    var _Array = tempArray[0];
                    var temp_array1 = _Array[0];
                    var temp_array2 = tempArray[1];
                    var arrResult = tempArray[6];
                    
                    //kyun: modified:  
                    this.initListSoiCau(tempArray, temp_array1, temp_array2);
                    //this.initListSoiCau(tempArray, temp_array1, temp_array2, dialogSoiCau);
                    //kyun: modified: EOF
                    this.initSoiCauDay(arrResult);
                }
            });
        }
    },

    onShowPn1() {
        this.pn1.active = true;
        this.pn2.active = false;
    },

    onShowPn2() {
        this.pn1.active = false;
        this.pn2.active = true;
    },

    onCBLineChoice: function (toggle) {
        this.initSoiCauDay(this.arrResult);
    },

    initSoiCauDay(arrResult) {
        this.arrResult = arrResult;
        var listHistory = [];

        for (var i = 0; i < arrResult.length; i++) {
            var arr = arrResult[i].values.split(',');
            var ketqua = arr.map(Number);
            listHistory.push(ketqua);
        }

        var last = listHistory[listHistory.length - 1];
        var s = this.getTotal(last) <= 10 ? 'xỉu' : 'tài';
        this.txtIDPhien.string = s + ' ' + this.getTotal(last) + "(" + last[0] + '-' + last[1] + '-' + last[2] + ')';
        this.txtValuePhien.string = 'phiên gần đây nhất (#' + arrResult[arrResult.length - 1].id + ")";

        if (cc.director.setClearColor) {
            cc.director.setClearColor(cc.Color.WHITE);
        }

        var tileSize = cc.size(28, 28);
        var arrColor = [cc.color(255, 246, 0), cc.color(192, 0, 255), cc.color(0, 234, 255)];

        this.pnChartXX.removeAllChildren();
        this.pnChartTotal.removeAllChildren();

        var draw = this.pnChartXX.getComponent(cc.Graphics);
        var draw1 = this.pnChartTotal.getComponent(cc.Graphics);

        draw.clear();
        draw1.clear();

        var leng = listHistory.length;
        if (leng <= 0) return;

        var itemFirst = listHistory[0];

        for (var i = 0; i < itemFirst.length; i++) {
            if (!this.checkbox[i].isChecked) {
                continue;
            }
            var valueFirst = itemFirst[i];
            var vFirst = cc.v2(tileSize.width, tileSize.height * valueFirst);

            var node = cc.instantiate(this.prefabSoicauDay);
            node.color = arrColor[i];
            node.setPosition(vFirst);
            this.pnChartXX.addChild(node, 100);
        }

        for (var i = 2; i <= leng; i++) {
            var itemPrev = listHistory[i - 2];
            var itemNext = listHistory[i - 1];

            for (var j = 0; j < itemPrev.length; j++) {
                if (!this.checkbox[j].isChecked) {
                    continue;
                }
                var valuePrev = itemPrev[j];
                var valueNext = itemNext[j];

                var vPrev = cc.v2(tileSize.width * (i - 1), tileSize.height * valuePrev);
                var vNext = cc.v2(tileSize.width * (i - 0), tileSize.height * valueNext);

                this.drawLine(draw, vPrev.x, vPrev.y, vNext.x, vNext.y, arrColor[j]);

                var node = cc.instantiate(this.prefabSoicauDay);
                node.color = arrColor[j];
                node.setPosition(vNext);
                this.pnChartXX.addChild(node, 100);
            }
        }

        var per = tileSize.height / 3;

        var valueFirst = this.getTotal(itemFirst);
        var vFirst = cc.v2(tileSize.width, per * valueFirst);

        this.addDotTotal(valueFirst, vFirst, this.pnChartTotal);
        var color = new cc.Color();
        draw1.strokeColor = color.fromHEX('#ffffff');

        for (var i = 2; i <= leng; i++) {
            var itemPrev = listHistory[i - 2];
            var itemNext = listHistory[i - 1];

            var valuePrev = this.getTotal(itemPrev);
            var valueNext = this.getTotal(itemNext);

            var vPrev = cc.v2(tileSize.width * (i - 1), per * valuePrev);
            var vNext = cc.v2(tileSize.width * (i - 0), per * valueNext);

            this.drawLine(draw1, vPrev.x, vPrev.y, vNext.x, vNext.y);
            this.addDotTotal(valueNext, vNext, this.pnChartTotal);
        }
    },

    getTotal: function (arr) {
        var total = 0;

        for (var i = 0; i < arr.length; i++) {
            total += arr[i];
        }

        return total;
    },

    drawLine: function (graphics, x, y, rx, ry, color) {
        graphics.moveTo(x, y);
        graphics.lineTo(rx, ry);

        if (color != undefined) {
            graphics.strokeColor = color;
        }

        graphics.stroke();
    },

    addDotTotal: function (value, povar, parent) {
        var itemSoicau = null;
        if (value <= 10) {
            itemSoicau = cc.instantiate(this.prefabSoicau[0]);
        }
        else {
            itemSoicau = cc.instantiate(this.prefabSoicau[1]);
        }

        itemSoicau.setPosition(povar);
        parent.addChild(itemSoicau);
        var point = itemSoicau.getChildByName('point').getComponent(cc.Label);
        point.string = value;
    },

    initListSoiCau(tempArray, Array1, Array2) {
        var tileSize = cc.size(30.4, 30);
        var content1 = this.pn1.getChildByName('SoiCau1').getChildByName('content1');
        var content2 = this.pn1.getChildByName('SoiCau2').getChildByName('content2');
        var Array1 = tempArray[0];

        if (Array1) {
            for (var j = 0; j < Array1.length; j++) {
                // cc.log('Array1111111111111111111111111111111',j, Array1[j].length);

                if (Array.isArray(Array1[j])) {
                    for (var k = 0; k < Array1[j].length; k++) {
                        if (k < 6) {
                            cc.log(Array1[j][k]);
                            var itemSoicau = null;
                            if (Array1[j][k].total <= 10) {
                                itemSoicau = cc.instantiate(this.prefabSoicau[0]);
                            }
                            else {
                                itemSoicau = cc.instantiate(this.prefabSoicau[1]);
                            }
                            content1.addChild(itemSoicau);
                            var point = itemSoicau.getChildByName('point').getComponent(cc.Label);
                            point.string = Array1[j][k].total;
                            itemSoicau.setPosition(j * tileSize.width, k * tileSize.height * -1);
                        }

                    }
                }
                else {
                    var objArray = Object.entries(Array1[j]);
                    cc.log(Object.entries(Array1[j]));
                    for (var k = 0; k < objArray.length; k++) {
                        if (k < 6) {
                            var itemSoicau = null;
                            if (objArray[k][1].total <= 10) {
                                itemSoicau = cc.instantiate(this.prefabSoicau[0]);
                            }
                            else {
                                itemSoicau = cc.instantiate(this.prefabSoicau[1]);
                            }
                            content1.addChild(itemSoicau);
                            var point = itemSoicau.getChildByName('point').getComponent(cc.Label);
                            point.string = objArray[k][1].total;
                            itemSoicau.setPosition(j * tileSize.width, k * tileSize.height * -1);
                        }

                    }
                }
            }
        } else {
            cc.log('tempArray1 null');
        }

        if (Array2) {
            for (var i = 0; i < Array2.length; i++) {
                var itemSoicau = null;
                if (Array2[i].result == 0) {
                    itemSoicau = cc.instantiate(this.prefabSoicau[0]);
                }
                else {
                    itemSoicau = cc.instantiate(this.prefabSoicau[1]);
                }
                content2.addChild(itemSoicau);
            }
        } else {
            cc.log('tempArray2 null');
        }

        if (tempArray) {
            cc.log('tttttttttttttttttttttttttt', tempArray[2], tempArray[3], tempArray[4], tempArray[5]);
            var tai_SoiCau = this.pn1.getChildByName('SoiCau1').getChildByName('Tai').getComponent(cc.Label);
            var xiu_SoiCau = this.pn1.getChildByName('SoiCau1').getChildByName('Xiu').getComponent(cc.Label);
            tai_SoiCau.string = tempArray[3];
            xiu_SoiCau.string = tempArray[2];

            var tai_Phien = this.pn1.getChildByName('SoiCau2').getChildByName('Tai').getComponent(cc.Label);
            var xiu_Phien = this.pn1.getChildByName('SoiCau2').getChildByName('Xiu').getComponent(cc.Label);
            tai_Phien.string = tempArray[5];
            xiu_Phien.string = tempArray[4];
        }
    },
    clickButtonDialog(event) {
        event.target.data = this.node.data;
        Global.TaiXiuController.clickButtonDialog(event);
    }

});