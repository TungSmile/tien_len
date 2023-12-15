var Constant = require('Constant');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,
    properties: {
        NAME_GAME: {
            type: new cc.Enum(Constant.GAME_NAME),
            default: Constant.GAME_NAME.UNDEFINED
        },
        BUNDLE_NAME: {
            type: new cc.Enum(Constant.BUNDLE_NAME),
            default: Constant.BUNDLE_NAME.UNDEFINED
        },
        ZONE_ID: {
            type: new cc.Enum(Constant.ZONE_ID),
            default: Constant.ZONE_ID.UNDEFINED
        },
        buttonLoadingPrefab: cc.Prefab,
        mapNode: cc.Node
    },
    getNameGameTag: function () {
        return this.NAME_GAME;
    },
    getBundleNameTag: function () {
        return this.BUNDLE_NAME;
    },
    getZoneId: function () {
        return this.ZONE_ID;
    },
    onLoad() {
        this.initButtonLoadingContainer();
        this.setNameButton();
    },
    initButtonLoadingContainer: function () {
        if (!this.loadingButtonContainer || (this.loadingButtonContainer && !cc.isValid(this.loadingButtonContainer))) {
            this.loadingButtonContainer = cc.instantiate(this.buttonLoadingPrefab);
            this.loadingButtonContainer.name = "loadingContainer";
            this.loadingButtonContainer.active = false;
            this.node.addChild(this.loadingButtonContainer);
        }
    },
    getLoadingButtonContainer: function () {
        this.initButtonLoadingContainer();
        return this.loadingButtonContainer;
    },
    start() {
        this.isStarted = true;
        if (this.data) {
            if (this.data.parentButton && cc.isValid(this.data.parentButton)) {
                var container = this.data.parentButton;
                this.getGameButtonPrefab(function (err, gameButtonPrefab) {
                    if (!err) {
                        if (container && cc.isValid(container)) {
                            var gameButton = cc.instantiate(gameButtonPrefab);
                            if (gameButton) {
                                var gameButtonScript = gameButton.getComponent("DreamCityButtonGame");
                                if (gameButtonScript) {
                                    gameButtonScript.setMapNode(this.mapNode);
                                    container.addChild(gameButton);
                                }
                            }
                        }
                    } else {
                        cc.error("Không thể tìm thấy game button prefab để layout vị trí...");
                    }
                }.bind(this));
            }
        }

        //ở đây sẽ check theo name,... rồi khởi tạo prefab button
    },
    getGameButtonPrefab: function (cb) {
        var bundleName = this.getBundleNameByTag(this.BUNDLE_NAME);
        if (bundleName) {
            this.getBundle(function (err, bundle) {
                if (!err) {
                    var pathGameButton = this.getNameGameButton();
                    if (pathGameButton) {
                        // load(paths, type, onProgress, onComplete) {
                        bundle.load(
                            pathGameButton, cc.Prefab,
                            function (completedCount, totalCount, item) {

                            }.bind(this),
                            function (err, prefab) {
                                if (!err) {
                                    if (cb) {
                                        cb(null, prefab);
                                    }
                                } else {
                                    if (cb) {
                                        cb(err, null);
                                    }
                                }
                            }.bind(this))
                    }
                } else {
                    if (cb) {
                        cb(err, null);
                    }
                }
            }.bind(this), bundleName);
        } else {
            cc.error("Không thể get được tên bundle cần tải game button...");
            if (cb) {
                cb(true, null);
            }
        }
    },
    getNameButtonByNameGame: function () {
        if (this.NAME_GAME) {
            switch (this.NAME_GAME) {
                case Constant.GAME_NAME.UNDEFINED:
                    return null;
                case Constant.GAME_NAME.BIDA_8:
                    return "BidaGame";
                case Constant.GAME_NAME.BIDA_TA_LA:
                    return "BidaGame";
                case Constant.GAME_NAME.SOCCER:
                    return "SoccerGame";
                case Constant.GAME_NAME.HEADBALL:
                    return "HeadBallGame";
                case Constant.GAME_NAME.FOOTBALL:
                    return "FootBall3DGame";
                case Constant.GAME_NAME.BAN_SUNG:
                    return "BanSungGame";
                case Constant.GAME_NAME.PHI_DAO:
                    return "PhiDaoGame";
                case Constant.GAME_NAME.POCKER:
                    return "PokerGame";
                case Constant.GAME_NAME.CA_CHEP_HOA_RONG:
                    return "DragonLegend";
                case Constant.GAME_NAME.SLOT_777:
                    return "Slot777Game";
                case Constant.GAME_NAME.BIDA:
                    return "BidaGame";
                case Constant.GAME_NAME.NUOI_CA:
                    return "NuoiCaGame";
                case Constant.GAME_NAME.TAY_DU_KY:
                    return "SlotWuKong";
                case Constant.GAME_NAME.SLOT_CANDY:
                    return "SlotCandy";
                case Constant.GAME_NAME.TLMN:
                    return "TLMNGame";
                default:
                    return null;
            }
        }
        return null;
    },
    setNameButton: function () {
        var name = this.getNameButtonByNameGame();
        if (name) {
            this.node.name = name;
        }
    },
    getNameGameButton: function () {
        switch (this.NAME_GAME) {
            case Constant.GAME_NAME.UNDEFINED:
                return null;
            case Constant.GAME_NAME.BIDA_8:
                return "prefabs/homebuttons/BidaGame";
            case Constant.GAME_NAME.BIDA_TA_LA:
                return "prefabs/homebuttons/BidaGame";
            case Constant.GAME_NAME.SOCCER:
                return "prefabs/homebuttons/SoccerGame";
            case Constant.GAME_NAME.HEADBALL:
                return "prefabs/homebuttons/HeadBallGame";
            case Constant.GAME_NAME.FOOTBALL:
                return "prefabs/homebuttons/FootBall3DGame";
            case Constant.GAME_NAME.BAN_SUNG:
                return "prefabs/homebuttons/BanSungGame";
            case Constant.GAME_NAME.PHI_DAO:
                return "prefabs/homebuttons/PhiDaoGame";
            case Constant.GAME_NAME.POCKER:
                return "prefabs/homebuttons/PokerGame";
            case Constant.GAME_NAME.CA_CHEP_HOA_RONG:
                return "prefabs/homebuttons/DragonLegend";
            case Constant.GAME_NAME.SLOT_777:
                return "prefabs/homebuttons/Slot777Game";
            case Constant.GAME_NAME.BIDA:
                return "prefabs/homebuttons/BidaGame";
            case Constant.GAME_NAME.NUOI_CA:
                return "prefabs/homebuttons/NuoiCaGame";
            case Constant.GAME_NAME.TAY_DU_KY:
                return "prefabs/homebuttons/SlotWuKong";
            case Constant.GAME_NAME.SLOT_CANDY:
                return "prefabs/homebuttons/SlotCandy";
            default:
                return null;
        }
        // "D:\Project\clientv2_gitlocal\assets\TrangChu\prefabs\homebuttons\SoccerGame.prefab"
        // "D:\Project\clientv2_gitlocal\assets\TrangChu\prefabs\homebuttons\Slot777Game.prefab"
        // "D:\Project\clientv2_gitlocal\assets\TrangChu\prefabs\homebuttons\PhiDaoGame.prefab"
        // "D:\Project\clientv2_gitlocal\assets\TrangChu\prefabs\homebuttons\PokerGame.prefab"
        // "D:\Project\clientv2_gitlocal\assets\TrangChu\prefabs\homebuttons\HeadBallGame.prefab"
        // "D:\Project\clientv2_gitlocal\assets\TrangChu\prefabs\homebuttons\DragonLegend.prefab"
        // "D:\Project\clientv2_gitlocal\assets\TrangChu\prefabs\homebuttons\FootBall3DGame.prefab"
        // "D:\Project\clientv2_gitlocal\assets\TrangChu\prefabs\homebuttons\BidaGame.prefab"
        // "D:\Project\clientv2_gitlocal\assets\TrangChu\prefabs\homebuttons\BanSungGame.prefab"
    },
    getBundle: function (cb, bundleName) {
        if (bundleName) {
            Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                if (!err) {
                    if (cb) {
                        cb(null, gameLoaderBundle)
                    }
                } else {
                    cc.error(err);
                    if (cb) {
                        cb(err, null);
                    }
                }
            }.bind(this), bundleName);
        } else {
            if (cb) {
                cb(true, null);
            }
        }
    },
    getBundleNameByTag: function (tag) {
        tag = parseInt(tag);
        if (isNaN(tag) == false) {
            switch (tag) {
                case Constant.BUNDLE_NAME.UNDEFINED:
                    break;
                case Constant.BUNDLE_NAME.BIDA:
                    return Constant.BUNDLE.BIDA.name;
                case Constant.BUNDLE_NAME.SOCCER:
                    return Constant.BUNDLE.SOCCER_GALAXY.name;
                case Constant.BUNDLE_NAME.HEAD_BALL:
                    return Constant.BUNDLE.HEAD_BAL.name;
                case Constant.BUNDLE_NAME.FOOT_BALL:
                    return Constant.BUNDLE.FOOT_BALL.name;
                case Constant.BUNDLE_NAME.BAN_SUNG:
                    // return "TrangChu";
                    return Constant.BUNDLE.BAN_SUNG.name;
                case Constant.BUNDLE_NAME.PHI_DAO:
                    return Constant.BUNDLE.PHI_DAO.name;
                case Constant.BUNDLE_NAME.POCKER:
                    return Constant.BUNDLE.POCKER.name;
                case Constant.BUNDLE_NAME.CA_CHEP_HOA_RONG:
                    return Constant.BUNDLE.CA_CHEP_HOA_RONG.name;
                case Constant.BUNDLE_NAME.SLOT_777:
                    return Constant.BUNDLE.MINI_SLOT.name;
                case Constant.BUNDLE_NAME.TRANG_CHU:
                    return Constant.BUNDLE.TRANG_CHU.name;
                case Constant.BUNDLE_NAME.HEROES_BALL:
                    return Constant.BUNDLE.HEROES_BALL.name;
                case Constant.BUNDLE_NAME.TLMN:
                    return Constant.BUNDLE.TLMN.name;
                case Constant.BUNDLE_NAME.PHOM:
                    return Constant.BUNDLE.PHOM.name;
                case Constant.BUNDLE_NAME.MAUBINH:
                    return Constant.BUNDLE.MAUBINH.name;
                case Constant.BUNDLE_NAME.TAY_DU_KY:
                    // return "TrangChu";
                    return Constant.BUNDLE.TAY_DU_KY.name;
                case Constant.BUNDLE_NAME.TAI_XIU:
                    return Constant.BUNDLE.TAI_XIU.name;
                case Constant.BUNDLE_NAME.MINI_POKER:
                    return Constant.BUNDLE.MINI_POKER.name;
                case Constant.BUNDLE_NAME.MINI_SLOT:
                    return Constant.BUNDLE.MINI_SLOT.name;
                case Constant.BUNDLE_NAME.NUOI_CA:
                    // return "TrangChu";
                    return Constant.BUNDLE.NUOI_CA.name;
                case Constant.BUNDLE_NAME.SLOT_CANDY:
                    // return "TrangChu";
                    return Constant.BUNDLE.SLOT_CANDY.name;

                default: break;
            }
        }
        return null;
    },
    init: function (data) {
        if (data) {
            this.data = data;
        } else {
            this.data = null;
        }
    }
    // update (dt) {},
});
