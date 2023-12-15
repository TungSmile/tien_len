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
        Linker.LineCuaAn = this;
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
    },

    activeLine: function (lineIndex, listColumn, callback) {
        var self = this;
        var node = lineIndex ? this.lineList[lineIndex] : this.lineList[1];
        if(node){
            node.active = true;
            node.stopAllActions();
            node.opacity = 255;
            node.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.1, 200), cc.fadeTo(0.1, 255))));
            node.runAction(cc.sequence(cc.delayTime(1.2), cc.callFunc(function () {
                Linker.LineCuaAn.stopEffectItemWinLine(lineIndex, listColumn);
                node.stopAllActions();
                node.active = false;
                if (callback) {
                    callback();
                }

            })));
            Linker.LineCuaAn.playEffectItemWinLine(lineIndex, listColumn);
        }
       
    },

    activeLineQuick: function (lineIndex, listColumn, callback) {
        var self = this;
        var node = this.lineList[lineIndex];
        node.active = true;
        node.stopAllActions();
        node.opacity = 255;
        node.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.1, 200), cc.fadeTo(0.1, 255))));
        node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
            Linker.LineCuaAn.stopEffectItemWinLine(lineIndex, listColumn);
            node.stopAllActions();
            node.active = false;
            if (callback) {
                callback();
            }

        })));
        Linker.LineCuaAn.playEffectItemWinLine(lineIndex, listColumn);
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
    },

    resetAllLine: function () {
        for (var i = 0; i < this.lineList.length; i += 1) {
            this.disableLine(i);
        }
    },

    playEffectItemWinLine(lineIndex, listColumn) {
        var temp = Linker.LineCuaAn.WIN[lineIndex];
        //cc.log(temp);
        var length = temp.length;
        for (var i = 0; i < length; i++) {
            listColumn[i].itemList[temp[i]].playEffect();
        }
    },
    stopEffectItemWinLine(lineIndex, listColumn) {
        var temp = Linker.LineCuaAn.WIN[lineIndex];
        var length = temp.length;
        for (var i = 0; i < length; i++) {
            listColumn[i].itemList[temp[i]].stopEffect();
        }
    },

});