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
var DataAccess = require('DataAccess');
export var LobbyView = cc.Class({
    extends: cc.Component,

    properties: {
        lobbyZoneTableContainer: cc.Node,
        lobbyTopContainer: cc.Node,
        lobbyLeftContainer: cc.Node,
        lobbyRightContainer: cc.Node,
        lobbyListTableContainer: cc.Node, //layout contains list table with bet (table 1, 2, 3)
        lobbyListBetContainer: cc.Node, //layout contains list bet (100, 1000, 2000)
        lobbyLogoZoneContainer: cc.Node,
        listLogoZone: [cc.SpriteFrame],
        lobbyItemBetPrefab: cc.Prefab,
        lobbyItemBan1vs1Prefab: cc.Prefab,
        lobbyItemBan1vs1BidaPrefab: cc.Prefab,
        lobbyItemBan1vs4BidaPrefab: cc.Prefab,
        blockerLobbyClick: cc.Node,
        commonContainerTopBottom: cc.Node,
        conmonTopBotLayerPrefab: cc.Prefab,
        blockLobbyEventContainer: cc.Node,
        logoGameBai: cc.Sprite,
        betScrollView: cc.ScrollView
    },
    updateUIListBet: function () {
        // for (var i = 0; i < this.lobbyListBetContainer.children.length; i++) {
        //     var buttonBet = this.lobbyListBetContainer.children[i];
        //     var buttonBetScript = buttonBet.getComponent("ItemBetLobby");
        //     if (buttonBetScript) {
        //         var lableBetNode = buttonBetScript.getLabelNode();
        //         if (lableBetNode) {
        //             Utils.Malicious.setColorMoney(lableBetNode);
        //         }
        //         var spriteCoinBet = buttonBetScript.getIconSprite();
        //         if (spriteCoinBet) {
        //             Utils.Malicious.getCoinFrame(Linker.MoneyTypeSpriteFrame, function (err, data) {
        //                 if (!err) {
        //                     Linker.MoneyTypeSpriteFrame = data;
        //                     var coinFrame = (Number(cc.Global.moneyType) == 1) ? Linker.MoneyTypeSpriteFrame.Quan : Linker.MoneyTypeSpriteFrame.Xu;
        //                     if (coinFrame) {
        //                         spriteCoinBet.spriteFrame = coinFrame;
        //                     }
        //                 }
        //             });
        //         }
        //     }
        // }
    },
    updateUIListTable: function () {
        for (var i = 0; i < this.lobbyListTableContainer.children.length; i++) {
            var buttonTable = this.lobbyListTableContainer.children[i];
            var buttonTableScript = buttonTable.getComponent("ItemTableLobby");
            if (!buttonTableScript) {
                buttonTableScript = buttonTable.getComponent("item1vs1BidaTable");
            }
            if (!buttonTableScript) {
                buttonTableScript = buttonTable.getComponent("item1vs4BidaTable");
            }
            if (buttonTableScript) {
                var lableTableNode = buttonTableScript.getLabelNode();
                if (lableTableNode) {
                    Utils.Malicious.setColorMoney(lableTableNode);
                }
                var spriteCoinTable = buttonTableScript.getIconSprite();
                if (spriteCoinTable) {
                    Utils.Malicious.getCoinFrame(Linker.MoneyTypeSpriteFrame, function (err, data) {
                        if (!err) {
                            Linker.MoneyTypeSpriteFrame = data;
                            var coinFrame = (Number(cc.Global.moneyType) == 1) ? Linker.MoneyTypeSpriteFrame.Quan : Linker.MoneyTypeSpriteFrame.Xu;
                            if (coinFrame) {
                                spriteCoinTable.spriteFrame = coinFrame;
                            }
                        }
                    });
                }
            }
        }
    },
    onUpdateMoneyType: function () {
        this.updateUIListBet();
        this.updateUIListTable();
    },
    onDisable() {
        var ghepDoi = this.commonContainerTopBottom.getChildByName("GhepDoi");
        if (ghepDoi) {
            ghepDoi.destroy(true);
        }
    },
    firstConfigLobby: function (data) {
        Linker._sceneTag = Constant.TAG.scenes.LOBBY;
        if (Linker.ZONE != 4 && Linker.ZONE != 14) {
            var _lobbyEnable = this.getLobbyEnable();
            if (_lobbyEnable) {
                _lobbyEnable.showSportGame();
            }
            var index = this.getIndexZoneLogo();
            this.setLogoZoneByIndex(index);
            this.clearAllContentListTable();
            this.clearAllContentListBetMoney();
            //this.clearAllContainerBottomTopCommons();
            this.configLobbyDistpatcher();
            this.createPoolNodeManager();
        } else {
            this.HandleGameBaiLobby();
        }
        this.createBottomTopCommons();

        if (this.data.isReconnect) {
            this.activeBlockLobby({
                enableBlock: true
            });
            console.log('--22');
            this.requestDataJoinZone();
            // gui yeu cau join tableId
            var matchId = Number(this.data.matchId);
            if (matchId) {
                var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_YEU_CAU_TAO_BAN_CHOI, true);
                customEvent.tableData = {
                    matchId: matchId
                };
                customEvent.isReconnect = true;
                customEvent.isCreate = false;
                customEvent.isJoin = false;
                this.node.dispatchEvent(customEvent);
            }
            this.data.isReconnect = false;
        } else if (this.data.isJoin) {
            this.activeBlockLobby({
                enableBlock: true
            });
            console.log('--23');
            this.requestDataJoinZone();
            var matchId = Number(this.data.matchId);
            if (matchId) {
                if (this.data.zoneId) {
                    Linker.ZONE = this.data.zoneId;
                }
                var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_YEU_CAU_TAO_BAN_CHOI, true);
                customEvent.tableData = {
                    matchId: matchId
                };
                customEvent.isReconnect = false;
                customEvent.isCreate = false;
                customEvent.isJoin = true;
                customEvent.userInviteId = this.data.userInviteId ? this.data.userInviteId : null;
                this.node.dispatchEvent(customEvent);
            }
        } else {
            // set logo zone soccer
            this.activeBlockLobby({
                enableBlock: false
            });
            // console.log('--24');
            //this.requestDataJoinZone();
        }
    },
    start() {
        this.isStarted = true;
        if (this.data) {
            this.firstConfigLobby(this.data);
        }
        NewAudioManager.PlayWelcomeGame();
        NewAudioManager.stopSoundBackground();
        NewAudioManager.playBackground(NewAudioManager.getPathMusicByZone().background, 0.4, true, true);

        this.sortMoney = null;
        this.sortPlayer = null;
        this.sortStatus = null;
    },
    activeBlockLobby: function (event) {
        this.scheduleOnce(function () {
            DataAccess.Instance.updateData();
        }, 0.2);

        if (event) {
            if (event.enableBlock) {
                this.blockItemTable();
            } else {
                this.unBlockItemTable();
            }
        } else {
            this.blockItemTable();
        }
    },
    unBlockItemTable: function () {
        this.blockerLobbyClick.active = false;
        this.blockLobbyEventContainer.active = false;
        var _lobbyGameBaiView = this.getLobbyGameBaiView();
        if (_lobbyGameBaiView) {
            _lobbyGameBaiView.unBlockItemTable();
        }
    },
    blockItemTable: function () {
        this.blockerLobbyClick.active = true;
        this.blockLobbyEventContainer.active = true;
        var _lobbyGameBaiView = this.getLobbyGameBaiView();
        if (_lobbyGameBaiView) {
            _lobbyGameBaiView.blockItemTable();
        }
    },
    filterRooms: function (firstCashBet, data) {
        cc.Global.hideLoading();
        this.removeSafeItemBanLobbyNodePool(this.lobbyListTableContainer);
        var tableZindex = 5;
        var data = firstCashBet != -1 ? !!Linker.tableData && Linker.tableData.filter(item => data == 0 ? 
            item.firstCashBet <= firstCashBet : item.firstCashBet > firstCashBet) : Linker.tableData;
        if (data && Array.isArray(data)) {
            data = Utils.Malicious.flattern([
                [this.getDataRoomCreate()], data
            ]);
            for (let i = 0; i < data.length; i++) {
                var itemTable = this.getItemBan();
                if (itemTable && cc.isValid(itemTable)) {
                    this.lobbyListTableContainer.addChild(itemTable);
                    itemTable.active = true;
                    var itemTableJS = itemTable.getComponent("ItemTableLobby");
                    if (!itemTableJS) {
                        itemTableJS = itemTable.getComponent("item1vs1BidaTable");
                    }
                    if (!itemTableJS) {
                        itemTableJS = itemTable.getComponent("item1vs4BidaTable");
                    }
                    if (!itemTableJS) {
                        itemTableJS = itemTable.getComponent("ItemTableLobbyFootBall");
                    }
                    if (itemTableJS) {
                        itemTable.zIndex = tableZindex;
                        itemTableJS.init(data[i]);
                        tableZindex += 10;
                    }
                }
            }
        }
        this.lobbyListTableContainer.sortAllChildren();
    },
    getListBetMoney: function (dataRooms) {
        var listBetMoney = [];
        listBetMoney.push(-1);
        if (Array.isArray(dataRooms) && dataRooms.length > 0) {
            for (let i = 0; i < dataRooms.length; i++) {
                var currentBetMoney = Number(dataRooms[i].firstCashBet);
                if (listBetMoney.indexOf(currentBetMoney) == -1) {
                    listBetMoney.push(currentBetMoney);
                }
            }
        }
        return listBetMoney
    },
    filterBets: function (dataRooms, listBet) {


        this.lobbyListBetContainer.getComponent("ChonBanController").onClickButton(null,0);
        // cc.Global.hideLoading();
        // this.removeSafeItemBetLobbyNodePool(this.lobbyListBetContainer);
        // var tableZindex = 5;
        // var listBetMoney = listBet;
        // if (Array.isArray(dataRooms) && dataRooms.length > 0) {
        //     // if (Linker.ZONE == 15 || Linker.ZONE == 5) listBetMoney = this.getListBetMoney(dataRooms);
        //     if (listBetMoney && listBetMoney.length > 0) {
        //         let i = 0;
        //         var startIndex = listBetMoney.length;
        //         // this.lobbyListBetContainer.removeAllChildren();
        //         let j = 0;
        //         for (i; i < listBetMoney.length; i++) {
        //             var _itemData = listBetMoney[i];
        //             var currentBetMoney = Number(listBetMoney[i].minBet ? listBetMoney[i].minBet : listBetMoney[i]);
        //             var node = null;
        //             node = this.getItemBet();
        //             this.lobbyListBetContainer.addChild(node);

        //             if (node && cc.isValid(node)) {
        //                 var betSettingItemScript = node.getComponent("ItemBetLobby"); // xxx
        //                 if (betSettingItemScript || (Linker.ZONE == 15)) {
        //                     if (betSettingItemScript) {
        //                         currentBetMoney != -1 ? node.active = true : node.active = false;
        //                         if (j > 3) {
        //                             j = 0;
        //                         }
        //                         betSettingItemScript.updateCell({
        //                             label: currentBetMoney,
        //                             indexSprite: j,
                                    
        //                         });
        //                         j++;
        //                         if (Linker.Lobby.CurrentBetting == currentBetMoney) {
        //                             betSettingItemScript.onToggleButtonClick({});
        //                         } else {
        //                             betSettingItemScript.toggle.uncheck();
        //                         }
        //                         node.zIndex = tableZindex;
        //                         tableZindex += 10;
        //                     } else {
        //                         betSettingItemScript = node.getComponent("ItemBetLobbyFootBall");
        //                         node.active = true;
        //                         betSettingItemScript.updateCell({
        //                             label: currentBetMoney
        //                         });
        //                         if (Linker.Lobby.CurrentBetting == currentBetMoney) {
        //                             betSettingItemScript.onToggleButtonClick({});
        //                         } else {
        //                             betSettingItemScript.toggle.uncheck();
        //                         }
        //                         node.zIndex = tableZindex;
        //                         tableZindex += 10;
        //                     }
        //                 }
        //                 else {
        //                     // debugger
        //                     // betSettingItemScript = node.getComponent("CreateItemBetLobby");
        //                     // if (betSettingItemScript) {
        //                     //     currentBetMoney != -1 ? node.active = true : node.active = false;
        //                     //     var numPlayerInBetZone = this.calculateNumberPlayer(dataRooms, currentBetMoney);
        //                     //     betSettingItemScript.setBetMoney({
        //                     //         label: currentBetMoney,
        //                     //         numPlayer: numPlayerInBetZone,
        //                     //         canAccess: listBetMoney[i].canAccess,
        //                     //         levelAccess: listBetMoney[i].levelAccess,
        //                     //         online: listBetMoney[i].online
        //                     //     });
        //                     // }
        //                     node.active = true;
        //                     node.zIndex = startIndex;
        //                     startIndex++;
        //                     betSettingItemScript = node.getComponent("itemLobbyScrollContainer");
        //                     if (betSettingItemScript) {
        //                         if (_itemData) {
        //                             _itemData.bgSpfIndex = i;
        //                             _itemData.betMoney = currentBetMoney;
        //                             betSettingItemScript.init(_itemData);
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //         this.addHeadTail();
        //         if (Linker.ZONE != 15 && Linker.ZONE != 5) {
        //             if (this.betScrollView) {
        //                 // var offset = this.betScrollView.getScrollOffset();
        //                 // this.betScrollView.scrollToOffset(cc.v2(0, offset.y), 1.0);
        //                 // this.betScrollView.scrollToPercentHorizontal(0.3, 0);
        //                 this.scrollHToItemByIndex(this.betScrollView, this.getCurrentItemLobbyActive());
        //             }
        //         } else {
        //             this.scrollToActiveBet();
        //         }
        //     }
        // }
        // this.lobbyListBetContainer.sortAllChildren();
    },
    addHeadTail: function () {
        if (Linker.ZONE != 15 && Linker.ZONE != 5) {
            if (this.lobbyListBetContainer && this.lobbyListBetContainer.children.length > 1) {
                var head = this.lobbyListBetContainer.children[0];
                var tail = this.lobbyListBetContainer.children[this.lobbyListBetContainer.children.length - 1];
                if (head && tail && cc.isValid(head) && cc.isValid(tail)) {
                    var headTailData = [];
                    var headTailNode = [tail, head];
                    for (var i = 0; i < headTailNode.length; i++) {
                        var item = headTailNode[i];
                        if (item) {
                            var itemScript = item.getComponent("itemLobbyScrollContainer");
                            if (itemScript) {
                                var data = itemScript.getData();
                                if (data) {
                                    headTailData.push(data);
                                }
                            }
                        }
                    }
                    if (headTailData.length == headTailNode.length) {
                        var zIndexTH = [headTailNode[headTailData.length - 1].zIndex - 10, headTailNode[0].zIndex + 10];
                        if (zIndexTH.length == headTailData.length) {
                            for (var i = 0; i < headTailData.length; i++) {
                                var node = this.getItemBet();
                                if (node && !node.parent) {
                                    var nodeScript = node.getComponent("itemLobbyScrollContainer");
                                    if (nodeScript) {
                                        nodeScript.init(headTailData[i]);
                                        node.zIndex = zIndexTH[i];
                                        this.lobbyListBetContainer.addChild(node);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    },
    scrollHToItemByIndex: function (scrollView, dataItem) {
        if (dataItem) {
            //scroll về vị trí đầu tiên của view box
            //đảm bảo content có anchor point là 0.5 nhé về chiều h
            var index = Number(dataItem.index);
            if (isNaN(index) == true) {
                index = 1;
            }
            if (scrollView) {
                var content = scrollView.content;
                var layout = content.getComponent(cc.Layout);
                if (layout && content) {
                    layout.updateLayout();
                    if (index >= 0 && index <= content.children.length - 1) {
                        // bắt buộc content phải nằm trong view box;
                        var widthContent = content.width;
                        var item;
                        if (!dataItem.item) {
                            item = scrollView.content.children[index];
                        } else {
                            item = dataItem.item;
                        }
                        if (item) {
                            var itemPos = item.parent.convertToWorldSpaceAR(item.position);
                            var offsetX = item.width;

                            var contentPosition = content.parent.convertToWorldSpaceAR(content.position);
                            var limitXMin = contentPosition.x - widthContent * 0.5;
                            var limiXMax = contentPosition.x + widthContent * 0.5;
                            var limitRange = Math.abs(limiXMax - limitXMin);
                            var gap = Math.abs(itemPos.x - limitXMin);
                            gap = gap + offsetX * 0.5;
                            var percent = (gap * 100 / limitRange);
                            percent = percent / 100;
                            if (percent <= 0) {
                                percent = 0;
                            } else if (percent >= 1) {
                                percent = 1;
                            }
                            scrollView.scrollToPercentHorizontal(percent, 0);
                            //trong trường hợp này chỉ lấy x vì theo horizontal
                        }
                    }
                }

            }
        }

    },
    getCurrentItemLobbyActive: function () {
        if (this.betScrollView) {
            if (Linker && Linker.Lobby && Linker.Lobby.CurrentBetting) {
                var currentBetMoney = Number(Linker.Lobby.CurrentBetting);
                if (isNaN(currentBetMoney) == false) {
                    var content = this.betScrollView.content;
                    if (content) {
                        for (var i = 0; i < content.children.length; i++) {
                            var betItem = content.children[i];
                            if (betItem) {
                                var betJs = betItem.getComponent("itemLobbyScrollContainer");
                                if (betJs) {
                                    var moneyBet = betJs.getBetMoney();
                                    if (moneyBet == currentBetMoney) {
                                        return { index: i, item: betItem };
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return { index: 3, item: null };
    },
    scrollToActiveBet() {
        if (this.betScrollView) {
            var betList = this.lobbyListBetContainer.children;
            for (var i = 0; i < betList.length; i++) {
                var betJs = betList[i].getComponent("ItemBetLobby");
                if (betJs && betJs.betMoney == Number(Linker.Lobby.CurrentBetting)) {
                    var percent = (i + 1) / betList.length;
                    percent = (percent == 0.1 || percent == 0.2) ? 0 : percent;
                    this.betScrollView.scrollTo(cc.v2(percent, 0), 0.1);
                    break;
                }
            }
        }
    },
    calculateNumberPlayer(roomData, betMoney) {
        if (Array.isArray(roomData)) {
            var listRoomSameBet = roomData.filter(item => item.firstCashBet == betMoney);
            var totalPlayer = 0;
            listRoomSameBet.forEach(item => {
                totalPlayer += Number(item.tableSize);
            });
            return totalPlayer;
        }
        return 0;
    },
    getDataRoomCreate: function () {
        return {
            firstCashBet: 500,
            isPlaying: 1,
            matchId: 0,
            maxNumberPlayer: "5",
            name: "",
            phongId: "78550",
            pos: 1,
            tableIndex: "1",
            tableSize: "2",
            isCreate: true
        }
    },
    removeSafeItemBanLobbyNodePool: function (node) {
        if (node && cc.isValid(node)) {
            if (this._lobbyNodePool && this._lobbyNodePool.hasOwnProperty("_itemBan")) {
                for (var i = node.children.length - 1; i >= 0; i--) {
                    var child = node.children[0];
                    if (child && cc.isValid(child)) {
                        var componentItem11 = child.getComponent("ItemTableLobby");
                        if (!componentItem11) {
                            componentItem11 = child.getComponent("item1vs1BidaTable");
                        }
                        if (!componentItem11) {
                            componentItem11 = child.getComponent("item1vs4BidaTable");
                        }
                        if (componentItem11) {
                            this._lobbyNodePool._itemBan._ban.put(child);
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
    removeSafeItemBetLobbyNodePool: function (node) {
        if (node && cc.isValid(node)) {
            if (this._lobbyNodePool && this._lobbyNodePool.hasOwnProperty("_itemBet")) {
                for (var i = node.children.length - 1; i >= 0; i--) {
                    var child = node.children[0];
                    if (child && cc.isValid(child)) {
                        var componentItem = child.getComponent("ItemBetLobby");
                        child.active = false;
                        if (componentItem) {
                            componentItem.toggle.uncheck();
                            componentItem.updateCell({
                                label: 0
                            });
                            this._lobbyNodePool._itemBet.put(child);
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
    createPoolNodeManager: function () {
        if (!this._lobbyNodePool) {
            this._lobbyNodePool = {};
            if (Linker && Linker.ZONE != 5) {
                // khởi tạo số lượng itemBet tùy chọn
                var initItemBetCount = 10;
                var initItemBanCount = 10;
                this.createNodePoolItemBet(initItemBetCount);
                this.createNodePoolItemBan(initItemBanCount);
            } else {

            }
        }
    },
    createBottomTopCommons: function () {
        this.commonContainerTopBottom.removeAllChildren(true);
        var commonTopBottomLayer = cc.instantiate(this.conmonTopBotLayerPrefab);
        this.commonContainerTopBottom.addChild(commonTopBottomLayer);
    },
    createNodePoolItemBan: function (total) {
        this._lobbyNodePool._itemBan = {};
        this._lobbyNodePool._itemBan._ban = new cc.NodePool();
        var lobbyItemBan = this.lobbyItemBan1vs1Prefab;
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            lobbyItemBan = this.lobbyItemBan1vs1BidaPrefab;
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            lobbyItemBan = this.lobbyItemBan1vs4BidaPrefab;
        }
        this.initNodeWithNodePool(this._lobbyNodePool._itemBan._ban, total, lobbyItemBan);
    },
    createNodePoolItemBet: function (total) {
        // lobby sẽ có 2 prefab được khởi tạo nhiều lần: 1. item bet(500, 1000, 1000,...) 2. item bàn.
        this._lobbyNodePool._itemBet = new cc.NodePool();
        var customData = {
            initData: {
                betMoney: 0
            },
            nameScript: "ItemBetLobby"
        }
        this.initNodeWithNodePool(this._lobbyNodePool._itemBet, total, this.lobbyItemBetPrefab, customData);

    },
    getItemBan: function () {
        if (this._lobbyNodePool) {
            if (this._lobbyNodePool.hasOwnProperty("_itemBan") && Utils.Malicious.getLengthObj(this._lobbyNodePool._itemBan) > 0) {
                if (this._lobbyNodePool && this._lobbyNodePool.hasOwnProperty("_itemBan")) {
                    var item = null;
                    var nodePool = this._lobbyNodePool._itemBan._ban;
                    if (nodePool && nodePool.size() > 0) {
                        item = nodePool.get();
                    } else {
                        nodePool.put(cc.instantiate(this.lobbyItemBan1vs1Prefab));
                        this._lobbyNodePool._itemBan._ban = nodePool;
                        item = nodePool.get();
                    }
                    if (item) {
                        return item;
                    }
                }
                return null;
            } else {
                var initItemBanCount = 10;
                this.createNodePoolItemBan(initItemBanCount);
                return this.getItemBan();
            }
        } else {
            this.createPoolNodeManager();
            return this.getItemBan();
        }
    },
    getItemBet: function () {
        if (this._lobbyNodePool) {
            if (this._lobbyNodePool.hasOwnProperty("_itemBet") && Utils.Malicious.getLengthObj(this._lobbyNodePool._itemBet) > 0) {
                var item = null;
                if (this._lobbyNodePool._itemBet.size() > 0) {
                    item = this._lobbyNodePool._itemBet.get();
                } else {
                    this._lobbyNodePool._itemBet.put(cc.instantiate(this.lobbyItemBetPrefab));
                    item = this._lobbyNodePool._itemBet.get();
                }
                if (item) {
                    var itemScript = item.getComponent("ItemBetLobby");
                    if (!itemScript) {
                        itemScript = item.getComponent("ItemBetLobbyFootBall");
                    }
                    if (!itemScript) {
                        itemScript = item.getComponent("CreateItemBetLobby");
                    }
                    if (!itemScript) {
                        itemScript = item.getComponent("itemLobbyScrollContainer");
                    }
                    if (itemScript) {
                        if (Linker.ZONE == 15 || Linker.ZONE == 5) {
                            itemScript.toggle.uncheck();
                            return item;
                        }
                        else {
                            return item;
                        }
                    }
                }
            } else {
                var initItemBetCount = 10;
                this.createNodePoolItemBet(initItemBetCount);
                return this.getItemBet();
            }
        } else {
            this.createPoolNodeManager();
            return this.getItemBet();
        }
        return null;
    },
    initNodeWithNodePool: function (pool, num, prefab, customData) {
        for (let i = 0; i < num; i++) {
            let item = cc.instantiate(prefab);
            if (customData) {
                let itemScript = item.getComponent(customData.nameScript);
                if (itemScript) {
                    itemScript.init(customData.initData);
                }
            }
            pool.put(item);
        }
    },
    configLobbyDistpatcher: function () {
        if (!this.lobbyDispatcher) {
            this.lobbyDispatcher = this.node.addComponent("LobbyDispatchEvent");
        }
    },
    requestDataJoinZone: function () {
        console.log('--5');
        this.configLobbyDistpatcher();
        this.lobbyDispatcher.requestDataJoinZone();
    },
    clearAllContentListTable: function () {
        this.lobbyListTableContainer.removeAllChildren(true);
    },
    clearAllContentListBetMoney: function () {
        this.commonContainerTopBottom.removeAllChildren(true);
    },
    clearAllContainerBottomTopCommons: function () {
        this.lobbyListBetContainer.removeAllChildren(true);
    },
    getIndexZoneLogo: function () {
        var index;
        if (Linker.ZONE == soccerConstant.ZONE_ID.ZONE_1VS1) {
            index = 0;
        } else if (Linker.ZONE == HeadBallConstant.ZONE_ID.LOBBY) {
            index = 1;
        } else if (Linker.ZONE == FootBallConstant.ZONE_ID.ZONEID_PENALTY) {
            index = 2;
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            index = 3;
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            index = 4;
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            index = 5;
        } else if (Linker.ZONE == TLMNConstant.ZONEID) {
            index = 0;
        } else if (Linker.ZONE == PhomConstant.ZONEID) {
            index = 1;
        }
        return index;
    },
    init: function (data) {
        if (data) {
            this.data = data;
        }
        if (this.data && this.isStarted) {
            this.firstConfigLobby(this.data);
        }
    },
    setLogoZoneByIndex: function (index = 0) {
        if (Linker.ZONE == FootBallConstant.ZONE_ID.ZONEID_PENALTY) {
            this.lobbyLogoZoneContainer.active = false;
            return;
        }
        else {
            this.lobbyLogoZoneContainer.active = true;
            var frame = this.listLogoZone[0];
            index = parseInt(index);

            if (index > 0 && index < this.listLogoZone.length) {
                frame = this.listLogoZone[index];
            }
            if (frame) {
                this.lobbyLogoZoneContainer.removeAllChildren(true);
                var logoZone = new cc.Node();
                var logoSprite = logoZone.addComponent(cc.Sprite);
                var logoButton = logoZone.addComponent(cc.Button);
                logoButton.transition = cc.Button.Transition.SCALE;
                logoButton.duration = 0.1;
                logoButton.zoomScale = 1.01;
                logoSprite.spriteFrame = frame;
                this.lobbyLogoZoneContainer.addChild(logoZone);
            }
        }
    },
    getLobbyGameBaiView: function () {
        return this.node.getComponent("LobbyGameBaiView");
    },
    getLobbyEnable: function () {
        return this.node.getComponent("LobbyEnable");
    },
    InitGameBaiRooms: function (data) {
        var _lobbyGameBaiView = this.getLobbyGameBaiView();
        if (_lobbyGameBaiView) {
            _lobbyGameBaiView.InitGameBaiRooms(data);
        }
    },
    HandleGameBaiLobby() {
        var _lobbyGameBaiView = this.getLobbyGameBaiView();
        var _lobbyEnable = this.getLobbyEnable();
        if (_lobbyGameBaiView && _lobbyEnable) {
            //an hien lobby
            _lobbyEnable.showCardGame();
            //set logo
            var logoFrame = null;
            switch (Linker.ZONE) {
                case 4: {
                    logoFrame = this.listLogoZone[7];
                    break;
                }
                case 5: {
                    logoFrame = this.listLogoZone[6];
                    break;
                }
                case 14: {
                    logoFrame = this.listLogoZone[8];
                    break;
                }
                default:
                    break;
            }
            //setlogo
            if (logoFrame) {
                _lobbyGameBaiView.setLogoLobbyGameBai(logoFrame);
            }
        }

        // this.lobbyLeftContainer.getChildByName("LeftForSportGames").active = false;
        // this.lobbyLeftContainer.getChildByName("LeftForCardGames").active = true;
        // this.lobbyTopContainer.getChildByName("LobbyTop").active = false;
        // this.lobbyZoneTableContainer.getChildByName("ZoneForCardGames").active = true;
        // this.lobbyZoneTableContainer.getChildByName("LobbyZone").active = false;
        // switch (Linker.ZONE) {
        //     case 4: {
        //         this.logoGameBai.spriteFrame = this.listLogoZone[7];
        //         break;
        //     }
        //     case 5: {
        //         this.logoGameBai.spriteFrame = this.listLogoZone[6];
        //         break;
        //     }
        //     case 14: {
        //         this.logoGameBai.spriteFrame = this.listLogoZone[8];
        //         break;
        //     }
        //     default:
        //         break;
        // }
    },
    update(dt) {

    },

    setImageGame: function (script) {
        switch (Linker.ZONE) {
            case Constant.ZONE_ID.SOCCER_GALAXY_1VS1:
                script.setImageSoccer();
                break;
            case Constant.ZONE_ID.HEAD_BALL_1VS1:
                script.setImageSoccer();
                break;
            case Constant.ZONE_ID.BAN_SUNG:
                script.setImageSoccer();
                break;
            case Constant.ZONE_ID.PHI_DAO:
                script.setImageSoccer();
                break;
            case Constant.ZONE_ID.FOOTBALL_1VS1:
            case Constant.ZONE_ID.BIDA_1VS1:
                script.setImageSoccer();
                break;
        }
    }
});