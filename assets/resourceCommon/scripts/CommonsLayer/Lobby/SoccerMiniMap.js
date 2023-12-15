var soccerConstant = require('soccerConstant');
var Linker = require('Linker');
var Utils = require('Utils');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        miniFormationMap: cc.Node,
        positionDotPrefab: cc.Prefab
    },
    onEnable: function () {
        if (Linker.SoccerGalaxy && Linker.SoccerGalaxy.Maps && Linker.SoccerGalaxy.CurrentMapID && this.miniFormationMap && this.positionDotPrefab) {
            this.getMapData(function (err, data) {
                if (!err) {
                    var map = this.getMap(data);
                    if (map.posLeftLocal && Array.isArray(map.posLeftLocal) && map.posLeftLocal.length > 0) {
                        var posLeftLocal = map.posLeftLocal;
                        var dot;
                        var tmpPos = cc.v2(0, 0);
                        var dotPos = cc.v2(0, 0);
                        this.miniFormationMap.removeAllChildren(true);
                        for (var i = 0; i < posLeftLocal.length; i++) {
                            dot = cc.instantiate(this.positionDotPrefab);
                            tmpPos = cc.v2(posLeftLocal[i].x, posLeftLocal[i].y);
                            dotPos.x = this.miniFormationMap.width * 0.8 * tmpPos.x;
                            dotPos.y = this.miniFormationMap.width * 0.8 * tmpPos.y;
                            dot.position = dotPos;
                            this.miniFormationMap.addChild(dot);
                        }
                    }
                }
            }.bind(this))
        }

    },
    getMapData: function (cb) {
        if (Utils.Malicious.getLengthObj(Linker.SoccerGalaxy.Maps) > 0) {
            if (cb) {
                cb(null, Linker.SoccerGalaxy.Maps);
            }
        } else {
            Utils.Malicious.loadSoccerMapsPositionResource(Linker.SoccerGalaxy.Maps, {}, function (err, maps) {
                if (!err) {
                    Linker.SoccerGalaxy.Maps = maps;
                    //load avatar and money type
                    //khi load xong scene thì trước nhất phải load scene thành công, khi load scene thành công công xong thì gửi yêu cầu join zone
                    if (cb) {
                        cb(null, Linker.SoccerGalaxy.Maps);
                    }
                } else {
                    if (cb) {
                        cb(err, null);
                    }
                }
            }.bind(this));
        }
    },
    getMap: function (maps) {
        if (maps) {
            for (let map in maps) {
                if (maps.hasOwnProperty(map)) {
                    if (maps[map]) {
                        for (let i = 0; i < maps[map].length; i++) {
                            if (Number(maps[map][i].id) == Number(Linker.SoccerGalaxy.CurrentMapID)) {
                                return maps[map][i];
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
});
