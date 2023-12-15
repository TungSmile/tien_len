var soccerConstant = require('soccerConstant');
var Utils = require('Utils');
var Linker = require('Linker');
var Constant = require('Constant');
var HeadBallConstant = require("HeadBallConstant");
var FootBallConstant = require("FootBallConstant");
var BiDaConstant = require('BiDaConstant');
var TLMNConstant = require('TLMNConstant');
var PhomConstant = require('PhomConstant');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        lobbyListTableContainer: cc.Node, //layout contains list table with bet (table 1, 2, 3)
        logoGameBai: cc.Sprite,
        lobbyItemGameBai: cc.Prefab,
        blockEventItemTable: cc.Node,
        scrollViewListBet: cc.ScrollView
    },
    onLoad: function () {

    },
    onClickNext: function () {
        if (this.scrollViewListBet) {
            var moveDeltaX = this.getMovingOffset({ anchor: cc.v2(1, 0) });
            this.moveScrollViewListBetByStep(moveDeltaX);
        }
    },
    moveScrollViewListBetByStep: function (moveDeltaX) {
        if (isNaN(moveDeltaX) == false) {
            var stepFactor = 20;//20%
            var step = (stepFactor * Math.abs(moveDeltaX)) / 100;
            step = moveDeltaX < 0 ? -step : step;
            var moveDelta = cc.v2(step, 0);
            var timeInSecond = 0.2;
            this.scrollViewListBet._startAutoScroll(moveDelta, timeInSecond, false)
        }
    },
    getMovingOffset: function (data) {
        if (data) {
            var anchor = data.anchor;
            var applyToHorizontal = true;
            var scrollSize = this.scrollViewListBet._view.getContentSize();
            var contentSize = this.scrollViewListBet.content.getContentSize();
            var bottomDeta = this.scrollViewListBet._getContentBottomBoundary() - this.scrollViewListBet._bottomBoundary;
            bottomDeta = -bottomDeta;
            var leftDeta = this.scrollViewListBet._getContentLeftBoundary() - this.scrollViewListBet._leftBoundary;
            leftDeta = -leftDeta;
            var moveDelta = cc.v2(0, 0);
            var totalScrollDelta = 0;
            if (applyToHorizontal) {
                totalScrollDelta = contentSize.width - scrollSize.width;
                moveDelta.x = leftDeta - totalScrollDelta * anchor.x;
            }
            return moveDelta.x;
        }
        return null;
    },
    onClickPre: function () {
        if (this.scrollViewListBet) {
            var moveDeltaX = this.getMovingOffset({ anchor: cc.v2(0, 0) });
            cc.error("Moving left now..." + moveDeltaX);
            this.moveScrollViewListBetByStep(moveDeltaX);
        }
    },
    unBlockItemTable: function () {
        this.blockEventItemTable.active = false;
    },
    blockItemTable: function () {
        this.blockEventItemTable.active = true;
    },
    createPoolNodeManager: function () {
        if (!this.roomCardGamePool) {
            this.roomCardGamePool = new cc.NodePool();
            var initQ = 20;
            // khởi tạo số lượng itemBet tùy chọn
            this.initNodeWithNodePool(this.roomCardGamePool, initQ, this.lobbyItemGameBai);
        }
    },
    initNodeWithNodePool: function (pool, num, prefab, customData) {
        for (let i = 0; i < num; i++) {
            let item = cc.instantiate(prefab);
            item.active = false;
            item.opacity = 0;
            if (customData) {
                let itemScript = item.getComponent("itemRoomCardGames");
                if (itemScript) {
                    itemScript.Init(customData);
                }
            }
            pool.put(item);
        }
    },
    setLogoLobbyGameBai: function (frame) {
        if (frame && cc.isValid(frame)) {
            this.logoGameBai.spriteFrame = frame;
        }
    },
    removeSafeItemBanLobbyNodePool: function (node) {
        if (node && cc.isValid(node)) {
            if (this.roomCardGamePool) {
                for (var i = node.children.length - 1; i >= 0; i--) {
                    var child = node.children[0];
                    if (child && cc.isValid(child)) {
                        var componentItem = child.getComponent("itemRoomCardGames");
                        if (componentItem) {
                            child.active = false;
                            child.opacity = 0;
                            this.roomCardGamePool.put(child);
                        } else {
                            child.destroy();
                        }
                    }
                }
            } else {
                node.removeAllChildren(true);
            }
            Utils.Malicious.hideAllChildren(node);
        }
    },
    InitGameBaiRooms(data) {
        if (data) {
            cc.Global.hideLoading();
            if (!this.roomCardGamePool) {
                this.createPoolNodeManager();
            }
            this.removeSafeItemBanLobbyNodePool(this.lobbyListTableContainer);
            for (var i = 0; i < data.length; i++) {
                if (data[i]) {
                    var itemRoom = this.roomCardGamePool.get();
                    if (!itemRoom) {
                        this.roomCardGamePool.put(cc.instantiate(this.lobbyItemGameBai));
                        itemRoom = this.roomCardGamePool.get();
                    }
                    if (itemRoom) {

                        var _itemRoomCardGames = itemRoom.getComponent("itemRoomCardGames");
                        if (_itemRoomCardGames) {
                            this.lobbyListTableContainer.addChild(itemRoom);
                            _itemRoomCardGames.Init(data[i]);
                            itemRoom.active = true;
                            itemRoom.opacity = 255;
                        }

                    }
                }

            };
            this.CurrentLobbyGameBaiData = data;
        }
    },

    SortListTableFormatMoney(event) {
        event.target.angle += 180;
        if (!this.sortMoney) {
            this.CurrentLobbyGameBaiData.sort(function (a, b) {
                var keyA = Number(a.firstCashBet),
                    keyB = Number(b.firstCashBet);
                if (keyA > keyB) return -1;
                if (keyA < keyB) {
                    return 1;
                } else if (keyA == keyB) {
                    if (Number(a.tableIndex) > 0) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
                return 0;
            });
            this.sortMoney = true;
        } else {
            this.CurrentLobbyGameBaiData.sort(function (a, b) {
                var keyA = Number(a.firstCashBet),
                    keyB = Number(b.firstCashBet);
                if (keyA < keyB) return -1;
                if (keyA > keyB) {
                    return 1;
                } else if (keyA == keyB) {
                    if (Number(a.tableIndex) > 0) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
                return 0;
            });
            this.sortMoney = false;
        }
        for (let i = 0; i < this.CurrentLobbyGameBaiData.length; ++i) {
            this.CurrentLobbyGameBaiData[i].pos = i + 1;
        }
        this.InitGameBaiRooms(this.CurrentLobbyGameBaiData);
    },

    SortListTableFormatPlayer(event) {
        event.target.angle += 180;
        if (!this.sortPlayer) {
            this.CurrentLobbyGameBaiData.sort(function (a, b) {
                var keyA = Number(a.tableSize),
                    keyB = Number(b.tableSize);
                if (keyA > keyB) return -1;
                if (keyA < keyB) {
                    return 1;
                } else if (keyA == keyB) {
                    if (Number(a.tableIndex) > 0) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
                return 0;
            });
            this.sortPlayer = true;
        } else {
            this.CurrentLobbyGameBaiData.sort(function (a, b) {
                var keyA = Number(a.tableSize),
                    keyB = Number(b.tableSize);
                if (keyA < keyB) return -1;
                if (keyA > keyB) {
                    return 1;
                } else if (keyA == keyB) {
                    if (Number(a.tableIndex) > 0) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
                return 0;
            });
            this.sortPlayer = false;
        }
        for (let i = 0; i < this.CurrentLobbyGameBaiData.length; ++i) {
            this.CurrentLobbyGameBaiData[i].pos = i + 1;
        }
        this.InitGameBaiRooms(this.CurrentLobbyGameBaiData);
    },

    SortListTableFormatStatus(event) {
        event.target.angle += 180;
        if (!this.sortStatus) {
            this.CurrentLobbyGameBaiData.sort(function (a, b) {
                var keyA = Number(a.status),
                    keyB = Number(b.status);
                if (keyA > keyB) return -1;
                if (keyA < keyB) {
                    return 1;
                } else if (keyA == keyB) {
                    if (Number(a.tableIndex) > 0) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
                return 0;
            });
            this.sortStatus = true;
        } else {
            this.CurrentLobbyGameBaiData.sort(function (a, b) {
                var keyA = Number(a.status),
                    keyB = Number(b.status);
                if (keyA < keyB) return -1;
                if (keyA > keyB) {
                    return 1;
                } else if (keyA == keyB) {
                    if (Number(a.tableIndex) > 0) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
                return 0;
            });
            this.sortStatus = false;
        }
        for (let i = 0; i < this.CurrentLobbyGameBaiData.length; ++i) {
            this.CurrentLobbyGameBaiData[i].pos = i + 1;
        }
        this.InitGameBaiRooms(this.CurrentLobbyGameBaiData);
    }
});