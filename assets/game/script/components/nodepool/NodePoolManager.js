var Linker = require('Linker');
var GameConstant = require('GameConstant');
var Utils = require('Utils');
var NodePoolManager = {
    MiniGame: {
        putNodePool() {
            if (cc.find('Canvas/MiniGame')) {
                Linker.NodePool = new cc.NodePool();
                Linker.NodePool.put(cc.find('Canvas/MiniGame'));
            }
        },
        removeOldMiniGame(){
            cc.find("Canvas").children.forEach(function(value, index){
                if(value.name == "MiniGame"){
                    cc.find("Canvas").removeChild(value);
                    cc.log("Removed MiniGame ...");
                }
            });
        },
        getNodePool() {
            if (Linker.Config && !Linker.Config.pmE) {
                return;
            }

            if (Linker.NodePool && Linker.NodePool._pool.length > 0) {
                var mn = Linker.NodePool.get();
                this.removeOldMiniGame();
                var mnq = mn.getChildByName("MinigameQuickIcon");
                cc.find('Canvas').addChild(mn);
                var z = Utils.Malicious.getIndexBeforeThisNodeByName(cc.find('Canvas'), 'DailyGift');
                if (!isNaN(z)) {
                    mnq.zIndex = z;
                }
                if(mnq && !Linker.TaiXiuController){
                    mnq.getComponent("MinigameQuickIcon").initMiniGame();
                }
                if(!Linker.joinedTaiXiu){
                    var testdata = {
                        "r": [{
                            "v": "12004\u0004"
                        }]
                    }
                    Linker.Socket.send(JSON.stringify(testdata)); 
                    Linker.joinedTaiXiu = true;
                }
            } else {
                var that = this;
                cc.resources.load("mini_game/prefab/MiniGame", cc.Prefab, function (completedCount, totalCount, item) {
                }, function (err, prefab) {
                    if (prefab) {
                        var minigame = cc.instantiate(prefab);
                        that.removeOldMiniGame();
                        cc.find('Canvas').addChild(minigame);
                        minigame.zIndex = cc.macro.MAX_ZINDEX - 2;
                        var testdata = {
                            "r": [{
                                "v": "12004\u0004"
                            }]
                        }
                        Linker.Socket.send(JSON.stringify(testdata));
                        Linker.joinedTaiXiu = true;
                        // var loop = setInterval(() => {
                        //     var mn = cc.find("Canvas/MiniGame/Container/Tai_Xiu");
                        //     if (mn) {
                        //         // Linker.isOpenTaiXiu = false;
                        //         // Linker.MiniGame.taiXiuMini.active = false;
                        //         // mn.active = false;
                        //         clearInterval(loop);
                        //     }
                        // }, 100);

                    }
                });
            }
        }
    },
    TopHu: {
        putNodePool() {
            if (Linker.Config && !Linker.Config.pmE) {
                return;
            }

            if (cc.find('Canvas/TopHu')) {
                Linker.TopHu = new cc.NodePool();
                Linker.TopHu.put(cc.find('Canvas/TopHu'));
            }
        },
        removeOldTopHu(){
            cc.find("Canvas").children.forEach(function(value, index){
                if(value.name == "TopHu"){
                    cc.find("Canvas").removeChild(value);
                    cc.log("Removed TopHu ...");
                }
            });
        },
        getNodePool() {
            var notIncludedScene = ["TLMN", "XocDiaScene", "PokerScene", "SamScene", "Phom", "MauBinh", "BaCayScene","BidaGame","SoccerGalaxy"];
            if (Linker.TopHu && Linker.TopHu._pool.length > 0) {
                var t = Linker.TopHu.get();
                this.removeOldTopHu();
                cc.find('Canvas').addChild(t);
                t.position = (Linker.tophuPosition) ? Linker.tophuPosition : GameConstant.NODE_POSITION_DEFAULT.TOPHU_DEFAULT_POS;
                var sceneName = cc.Global.getSceneName();
                if (notIncludedScene.indexOf(sceneName) != -1) {
                    t.active = false;
                }
            } else {
                var that = this;
                cc.resources.load("prefabs/TopHu", cc.Prefab, function (completedCount, totalCount, item) {
                }, function (err, prefab) {
                    if (prefab) {
                        var tophu = cc.instantiate(prefab);
                        var tophuContainer = tophu.getChildByName("TopHuContainer");
                        tophuContainer.getComponent("TopHuController").initTophu();
                        that.removeOldTopHu();
                        cc.find('Canvas').addChild(tophu);
                        var sceneName = cc.Global.getSceneName();
                        if (notIncludedScene.indexOf(sceneName) != -1) {
                            tophu.active = false;
                        }
                        tophu.position = (Linker.tophuPosition) ? Linker.tophuPosition : GameConstant.NODE_POSITION_DEFAULT.TOPHU_DEFAULT_POS;
                    }
                });
            }
        }
    },
    Notification: {
        putNodePool() {
            if (cc.find('Canvas/thongbaoContainer')) {
                Linker.NotificationNP = new cc.NodePool();
                Linker.NotificationNP.put(cc.find('Canvas/thongbaoContainer'));
            }
        },
        getNodePool() {
            if (Linker.NotificationNP) {
                if (Linker.NotificationNP._pool.length > 0) {
                    cc.find('Canvas').addChild(Linker.NotificationNP.get());
                }
            }
        }
    },
    NoHu: {
        putNodePool() {
            if (cc.find('Canvas/NoHuIcon')) {
                Linker.NoHu = new cc.NodePool();
                Linker.NoHu.put(cc.find('Canvas/NoHuIcon'));
            }
        },
        getNodePool() {
            if (Linker.NoHu && Linker.NoHu._pool.length > 0) {
                cc.find('NoHuIcon').addChild(Linker.NoHu.get());
            } else {
                cc.resources.load("commonevent/template/nohu/Prefabs/NoHuIcon", cc.Prefab, function (completedCount, totalCount, item) {
                }, function (err, prefab) {
                    if (prefab) {
                        var nohu = cc.instantiate(prefab);
                        cc.find('Canvas').addChild(nohu);
                        var size = cc.winSize;
                        var nohuContainer = nohu.getChildByName("NoHuContainer");
                        var x = (size.width * 0.81) / 2;
                        var y = (size.height * 0.93) / 2;
                        nohuContainer.position = cc.v2(x, y);
                    }
                });
            }
        }
    }
}
module.exports = NodePoolManager;