var Linker = require('Linker');
var Utils = require('Utils');
var Global = require("Global");
cc.Class({
    extends: cc.Component,
    properties: {

    },
    getPlayerRandomAvatarNode: function (cb) {
        var _this = this;
        if (this.TestSwitchPlayerPrefab) {
            if (cb) {
                _this.addRandomPlayerAvatar(this.TestSwitchPlayerPrefab);
                cb(null, this.TestSwitchPlayerPrefab);
            }
        } else {
            var bidaBundle = Constant.BUNDLE.BIDA.name;
            Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                if (!err) {
                    gameLoaderBundle.load("prefabs/Popup/TestSwitchPlayer", cc.Prefab, function (err, prefab) {
                        if (!err) {
                            _this.TestSwitchPlayerPrefab = prefab;
                            if (cb) {
                                _this.addRandomPlayerAvatar(_this.TestSwitchPlayerPrefab);
                                cb(null, _this.TestSwitchPlayerPrefab);
                            }
                        } else {
                            cc.error(err);
                            if (cb) {
                                cb(err, null);
                            }
                        }
                    });
                }
            }.bind(this), bidaBundle);
        }

    },
    addRandomPlayerAvatar: function (prefab) {
        var parent = this.node.parent;
        Utils.Malicious.removeNodeByNameFromParent("TestSwitchPlayer", parent);
        this.playerRandomChooseAvatar = cc.instantiate(prefab);
        this.playerRandomChooseAvatar.active = true;
        this.playerRandomChooseAvatar.opacity = 0;
        parent.addChild(this.playerRandomChooseAvatar);

    },
    onClickReconnect(event) {
        this.node.active = false;
        if (Linker.MySdk) {
            Linker.MySdk.completeCallback();
        }
    },
    onClickPlayOffline(event) {
        Global.Announcement._showLoading();
        this.node.active = false;
        this.node.opacity = 0;
        var _this = this;
        cc.log("van chay vao day ma haha");
        if (this.playerRandomChooseAvatar) {
            this.runPopup();
        } else {
            this.getPlayerRandomAvatarNode(function (err, data) {
                if (!err) {
                    _this.runPopup();
                    cc.log('vao day', data)
                } else {
                    cc.error("loi roi")
                }
            })
        }
    },
    runPopup: function () {
        Utils.Malicious.setMaxZindex(this.playerRandomChooseAvatar.parent, this.playerRandomChooseAvatar);
        //run
        var linhTinhComponent = this.playerRandomChooseAvatar.getComponent("LinhTinh");
        if (linhTinhComponent) {
            this.playerRandomChooseAvatar.active = true;
            this.playerRandomChooseAvatar.opacity = 0;
            linhTinhComponent.isLoadOfflineGame = false;
            if (linhTinhComponent.isLoadedBefore) {
                linhTinhComponent.loadStartNow = true;
            }
            linhTinhComponent.runRandomPlayerAvatar();
        }
    }
});
