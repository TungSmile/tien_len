var Linker = require('Linker');


cc.Class({
    extends: cc.Component,

    properties: {
        lineList: {
            default: [],
            type: cc.Node
        }
    },

    onLoad: function () {
        Linker.TayDuKyLineCuaAn = this;
        this.WIN = [
            [23, 23, 23, 23, 23],
            [24, 24, 24, 24, 24],
            [22, 22, 22, 22, 22],
            [23, 23, 24, 23, 23],
            [23, 23, 22, 23, 23],
            [24, 24, 23, 24, 24],
            [22, 22, 23, 22, 22],
            [24, 22, 24, 22, 24],
            [22, 24, 22, 24, 22],
            [23, 24, 22, 24, 23],
            [22, 23, 24, 23, 22],
            [24, 23, 22, 23, 24],
            [23, 22, 23, 24, 23],
            [23, 24, 23, 22, 23],
            [22, 23, 23, 23, 22],
            [24, 23, 23, 23, 24],
            [23, 22, 22, 22, 23],
            [23, 24, 24, 24, 23],
            [22, 22, 23, 24, 24],
            [24, 24, 23, 22, 22],

        ];
        for (var i = 0; i < this.lineList.length; i += 1) {
            this.disableLine(i);
        }
        Linker.lineList = this.lineList;
    },

    activeLine: function (lineIndex, listColumn, lineWin, callback) {
        var self = this;

        lineWin.forEach(function (index) {
            if (self.checkValidLine(index, self.lineList)) {
                if (Linker.lineList[index - 1].getParent()) {
                    Linker.lineList[index - 1].getParent().getChildByName('line_dong').active = true;
                }
            }

        });
        var node = this.lineList[lineIndex];
        node.active = true;
        node.stopAllActions();
        node.opacity = 255;
        node.getChildByName('Line').color= new cc.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 255);
        node.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.15, 150), cc.fadeTo(0.15, 255))));
        node.runAction(cc.sequence(cc.delayTime(1.2), cc.callFunc(function () {
            Linker.TayDuKyLineCuaAn.stopEffectItemWinLine(lineIndex, listColumn);
            node.stopAllActions();
            node.active = false;
            if (callback) {
                callback();
            }

        })));
        Linker.TayDuKyLineCuaAn.playEffectItemWinLine(lineIndex, listColumn);
    },

    activeLineQuick: function (lineIndex, listColumn, lineWin, callback) {
        var self = this;

        lineWin.forEach(function (index) {
            if (self.checkValidLine(index, self.lineList)) {
                Linker.lineList[index - 1].getParent().getChildByName('line_dong').active = true;

            }
        });
        var node = this.lineList[lineIndex];
        node.active = true;
        node.stopAllActions();
        node.opacity = 255;
        node.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.1, 150), cc.fadeTo(0.1, 255))));
        node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
            Linker.TayDuKyLineCuaAn.stopEffectItemWinLine(lineIndex, listColumn);
            node.stopAllActions();
            node.active = false;
            if (callback) {
                callback();
            }

        })));
        Linker.TayDuKyLineCuaAn.playEffectItemWinLine(lineIndex, listColumn);
    },

    checkValidLine: function (index, target) {
        return (parseInt(index) > 0 && parseInt(index) <= target.length) ? true : false;
    },

    activeLineWithDelay: function (lineIndex, delay, callback) {
        this.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function () {
            this.activeLine(lineIndex, callback);
        }.bind(this))));
    },

    disableLine: function (lineIndex) {
        var node = this.lineList[lineIndex];
        node.stopAllActions();
        node.active = false;
        node.getParent().getChildByName('line_dong').active = false;
    },

    resetAllLine: function () {
        for (var i = 0; i < this.lineList.length; i += 1) {
            this.disableLine(i);
        }
    },

    playEffectItemWinLine(lineIndex, listColumn) {
        var temp = Linker.TayDuKyLineCuaAn.WIN[lineIndex];
        //cc.log(temp);
        var length = temp.length;
        for (var i = 0; i < length; i++) {
            listColumn[i].itemList[temp[i]].playEffectNew();
        }
    },
    stopEffectItemWinLine(lineIndex, listColumn) {
        var temp = Linker.TayDuKyLineCuaAn.WIN[lineIndex];
        var length = temp.length;
        for (var i = 0; i < length; i++) {
            listColumn[i].itemList[temp[i]].stopEffect();
        }
    },

});