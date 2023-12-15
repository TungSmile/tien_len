var Linker = require('Linker');
var Global = require('Global');
var LoginCache = require('LoginCache');
var BiDaConstant = require('BiDaConstant');
var CommonSend = require('CommonSend');
var Utils = require('Utils');
var i18n = require('i18n');
var Api = require('Api');
var Md5 = require('Md5');
var DataAccess = require('DataAccess');
var NewAudioManager = require("NewAudioManager");
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,
    properties: {
        avatarAtlas: cc.SpriteAtlas,
        countryAtlas: cc.SpriteAtlas,
        avatarNode: cc.Node,
        userAvatarLevel: cc.Node,
        btnCloseNode: cc.Node,
        btnChangeAvatar: [cc.Node],
        btnChangePass: cc.Node,
        btnHistory: cc.Node,
        btnTele: cc.Node,
        dialogChangeAvatar: cc.Node,
        // labelMoneyNode: cc.Node,
        labelRealMoneyNode: cc.Node,
        labelUserNameNode: cc.Node,
        labelLoginNameNode: cc.Node,
        labelExpNode: cc.Node,
        labelUserID: cc.Node,
        labelUserIDLeft: cc.Node,
        labelUserLevel: cc.Node,
        lableUserExp: cc.Node,
        userExpProgress: cc.Sprite,
        labelPhoneNumber: cc.Node,
        labelEmail: cc.Node,
        labelCity: cc.Node,
        labelAddress: cc.Node,
        labelSex: cc.Node,
        countryNode: cc.Node,

        editBoxNode: cc.Node,
        checkBoxSex: cc.Node,
        btnEditEmail: cc.Node,
        btnEditAddress: cc.Node,
        btnEditCity: cc.Node,
        btnEditSex: cc.Node,
        changeInfoNode: cc.Node,
        toggleGirlNode: cc.Node,
        toggleBoyNode: cc.Node,
        changePasswordNode: cc.Node,
        titleChange: cc.Label,
        idBlockNode: cc.Node,
        btnLabelCopy1: cc.Label,
        btnLabelCopy2: cc.Label,

        matchHistoryNode: cc.Node,
        contentSkillInfo: cc.Node,
        title: cc.Node,
        circleExpPrefab: cc.Prefab,
        userNameLeft: cc.Node,
        teleActiveContainer: cc.Node,
        historyChangePwsContainer: cc.Node,
        toggleBidaSkill: cc.Toggle,
        toggleFootBallSkill: cc.Toggle,
        toggelSoccerGalaxySkill: cc.Toggle,
        toggleHeadBallSkill: cc.Toggle,
        addFriendButtonContainer: cc.Node,
        btnAddFriendNode: cc.Node,
        itemHistoryPlayPrefab: cc.Prefab,
        contentHistory: cc.Node,
        codeLabel: cc.Label,
        levelLabel: cc.Label
    },
    onLoad() {
        this.addCustomEventListener();
        this.addEventListener();
    },
    onDestroy: function () {
        this.removeEventListener();
    },
    addEventListener: function () {
        Linker.Event.addEventListener(73, this.onCheckFriend, this);
        Linker.Event.addEventListener(1204, this.onAddFriend, this);
    },
    removeEventListener() {
        Linker.Event.removeEventListener(73, this.onCheckFriend, this);
        Linker.Event.removeEventListener(1204, this.onAddFriend, this);
    },
    onCheckFriend: function (message) {
        if (message && message.status == 1) {
            if (message.isFriend) {
                this.btnAddFriendNode.userId = 0;
                this.activeAddFriendButton(false);
            } else {
                this.activeAddFriendButton(true);
            }
        }
    },
    onAddFriend: function (message) {
        if (message) {
            this.activeAddFriendButton(false);
            var mess = message.data;
            cc.Global.showMessage(mess);
            if (Number(message.status) == 1) {
                //truong hop gui ket ban thanh cong
                cc.log(message.data);
            } else {
                //truong hop da gui ket ban roi
                cc.log(message.data);
            }
        }
    },
    onEnable: function () {
        // this.requestDataUser();
        // this.initUserUI();
        this.activeAddFriendButton(false);
        this.onChangeAvatar();
        this.dataUserOther = null;
        this.toggleGirlNode.on("toggle", this.handleToggleGirl, this);
        this.toggleBoyNode.on("toggle", this.handleToggleBoy, this);
        this.initChangeInfo();
        // if (Linker.gameLanguage == "en") {
        //     this.title.getComponent("LabelLocalized").fontSize = 25;
        // }
        // else {
        //     this.title.getComponent("LabelLocalized").fontSize = 20;
        // }
    },
    setUserId: function (id) {
        if (id) {
            id = Number(id);
            this.userId = id;
            var userTab = this.node.getComponent("UserTab");
            if (userTab) {
                userTab.setUserId(id);
            }
        }
    },
    requestUserInfo: function (event) {
        if (event) {
            var userId = Number(event.userId);
            if (userId) {
                this.setUserId(userId);
                var userTab = this.node.getComponent("UserTab");
                if (userTab) {
                    userTab.requestUserInfo();
                }
            }
            if (event.isFriendZoneClick) {
                this.isFriendZoneClick = event.isFriendZoneClick;
                this.isFriendZoneTab = event.isFriendZoneTab;
                this.isFindFriendTab = event.isFindFriendTab;
            } else {
                this.isFriendZoneClick = false;
                this.isFriendZoneTab = false;
                this.isFindFriendTab = false;
            }
        }
    },
    requestDataUser: function (id) {
        // var test = CommonSend.getUserInfo(id);
        // Linker.Socket.send(test);
        DataAccess.Instance.requestUserData(id);
    },

    onDisable: function () {
        this.changePasswordNode.active = false;
        this.changeInfoNode.active = false;
        this.matchHistoryNode.active = false;
        this.dialogChangeAvatar.active = false;
    },
    setCloseButtonHavior: function (data) {
        if (data) {
            this.isFriendZoneTab = data.isFriendZoneTab;
            this.isFindFriendTab = data.isFindFriendTab;
        }
    },
    onGetUserData: function (message) {
        cc.Global.hideLoading();
        this.dataUser = message;
        cc.log(message);
        if (message) {
            if (!this.dataUserOther) {
                // this.updateWinlose(message);
                this.initUserInfo(message);
                this.updateHistoryPlay(message.history);
            }
            if (message.userId) {
                this.checkUserId(message.userId);
                this.sendCheckIsFriendRequest(message.userId);
            }
        }
    },
    onBtnAddFriendClick: function (event) {
        if (event) {
            var target = event.target;
            if (target.userId) {
                var send = CommonSend.addAFriend(target.userId);
                if (send) {
                    Linker.Socket.send(send);
                }
            }
            this.btnAddFriendNode.userId = 0;
        }
        // addFriendButtonContainer
    },
    updateHistoryPlay: function (data) {
        if (data) {
            this.contentHistory.removeAllChildren();
            for (var i = 0; i < data.length; i++) {
                var item = cc.instantiate(this.itemHistoryPlayPrefab);
                var itemJs = item.getComponent("itemHistoryPlay");
                if (itemJs && data[i].zoneId == Constant.ZONE_ID.TLMN) {
                    itemJs.gameLabel.string = this.getNameByZoneId(data[i].zoneId);
                    itemJs.winLabel.string = data[i].win;
                    itemJs.loseLabel.string = data[i].lose;
                    itemJs.totalLabel.string = data[i].totalplay;
                    this.contentHistory.addChild(item);
                }
            }
        }
    },
    getNameByZoneId: function (zoneId) {
        switch (zoneId) {
            case "5":
                return "TLMN";

            case "4":
                return "Phỏm";

            case "15":
                return "Poker";

            case "14":
                return "Mậu Binh";

            case "8":
                return "Bida 8 Ball";

            case "86":
                return "Bida Phỏm";

            case "45":
                return "Soccer Fingers";

            case "46":
                return "Head Kick";

            case "48":
                return "Jefir Survival";

            case "44":
                return "Football 3D";

            case "47":
                return "Knife";
            default:
                return "...";
        }
    },
    checkUserId: function (id) {
        var check = true;
        if (Linker.userData && Linker.userData.userId != id) {
            check = false;
        }
        if (check) {
            this.activeBtnChangeAvatar(true);
            this.activeTeleContainer(true);
            this.activeHisChangePass(true);

        } else {
            this.activeBtnChangeAvatar(false);
            this.activeTeleContainer(false);
            this.activeHisChangePass(false);
        }
        this.btnChangePass.active = check;
        this.btnHistory.active = check;
        // this.btnTele.getChildByName("lb").getComponent(cc.Label).string = i18n.t("active_account");
        // this.btnLabelCopy1.string = i18n.t("copy");
        // this.btnLabelCopy2.string = i18n.t("copy");
        this.idBlockNode.active = check;
        this.labelLoginNameNode.parent.active = check;
        this.labelEmail.parent.active = check;
        this.labelPhoneNumber.parent.active = check;
        this.labelAddress.parent.active = check;
        this.labelCity.parent.active = check;
        this.labelSex.parent.active = check;
        this.userNameLeft.parent.active = !check;
        // this.labelMoneyNode.parent.active = check;
        this.labelRealMoneyNode.parent.active = check;
    },
    activeBtnChangeAvatar: function (en) {
        for (var i = 0; i < this.btnChangeAvatar.length; i++) {
            this.btnChangeAvatar[i].active = (en) ? true : false;
        }
    },
    activeAddFriendButton: function (en) {
        this.addFriendButtonContainer.active = (en) ? true : false;
    },
    activeTeleContainer: function (en) {
        // this.teleActiveContainer.active = (en) ? true : false;
        this.teleActiveContainer.active = false;
    },
    activeHisChangePass: function (en) {
        this.historyChangePwsContainer.active = (en) ? true : false;
    },
    sendCheckIsFriendRequest: function (userId) {
        userId = Number(userId);
        if (isNaN(userId) == false && userId != 0 && userId != Linker.userData.userId) {
            var userId = parseInt(userId);
            if (isNaN(userId) == false) {
                this.btnAddFriendNode.userId = userId;
                var send = CommonSend.checkUserIsFriendByUID({ userId: userId });
                Linker.Socket.send(send);
            } else {
                this.btnAddFriendNode.userId = 0;
            }
        } else {
            this.btnAddFriendNode.userId = 0;
        }
    },
    changeAvatarBtnClick() {
        NewAudioManager.playClick();
        this.dialogChangeAvatar.active = true;
    },
    getHistoryById: function (listZone) {
        if (listZone) {
            var historyArr = [];
            if (this._tmpHistory) {
                for (var i = 0; i < this._tmpHistory.length; i++) {
                    var zoneIdGame = Number(this._tmpHistory[i].zoneId);
                    if (listZone.indexOf(zoneIdGame) != -1) {
                        historyArr.push(this._tmpHistory[i]);
                    }
                }
            }
            return historyArr;
        }
        return [];
    },
    addSkillContent: function (listSkills) {
        if (listSkills && Array.isArray(listSkills) && listSkills.length > 0) {
            this.contentSkillInfo.removeAllChildren(true);
            for (var i = 0; i < listSkills.length; i++) {
                var skillInfoCircle = cc.instantiate(this.circleExpPrefab);
                var skillInfoCircleScript = skillInfoCircle.getComponent("CircleExpUser");
                this.contentSkillInfo.addChild(skillInfoCircle);
                if (skillInfoCircleScript) {
                    var zoneIdGame = Number(listSkills[i].zoneId);
                    if (this.isOpenGame(zoneIdGame)) {
                        skillInfoCircleScript.setInfoGame(listSkills[i]);
                    } else {
                        skillInfoCircle.destroy();
                    }
                }
            }
        }
    },
    onSkillBoardCheck: function (toggle) {
        if (toggle) {
            this.contentSkillInfo.removeAllChildren(true);
            var bidaHistory = this.getHistoryById([8, 84, 86]);
            var soccerGalaxyHistory = this.getHistoryById([45]);;
            var headBallHistory = this.getHistoryById([46]);
            var footBallHistory = this.getHistoryById([44]);
            var name = toggle.node.name;
            if (name) {
                switch (name) {
                    case "btnSoccerGalaxy":
                        this.addSkillContent(soccerGalaxyHistory);
                        break;
                    case "btnHeadBall":
                        this.addSkillContent(headBallHistory);
                        break;
                    case "btnBida":
                        this.addSkillContent(bidaHistory);
                        break;
                    case "btnFootball":
                        this.addSkillContent(footBallHistory);
                        break;
                    default:
                        break;
                }
            }
            if (bidaHistory && Array.isArray(bidaHistory) && bidaHistory.length > 0) {

            }
        }
    },
    updateWinlose(data) {
        var history = data.history;

        if (history) {
            this._tmpHistory = history;
            this.contentSkillInfo.removeAllChildren(true);
            this.toggleBidaSkill.check();
        }
    },
    isOpenGame: function (zoneId) {
        //check trong linker.config neu is11, is14, isphom, 
        if (zoneId) {
            //tam thoi de true
            return true;
        }
        return false;
    },
    initUserInfo: function (message) {
        this.setUserName(message.displayName);
        this.setUserId(message.userId);
        this.setUserIDLabel(message.userId);
        // sthis.setUserMoney(message.userMoney);
        this.setUserRealMoney(message.userRealMoney);
        this.setLoginName(message.viewname);
        this.setUserExp(message.userExp);
        // this.setUserLevel(message.userExp);
        this.setLevelLabel(message.userExp);
        this.setUserExpPercent(message.userExp);
        this.setAddress(message.address);
        this.setPhoneNumber(message.phoneNumber);
        this.setEmail(message.email);
        this.setCity(message.cityId);
        this.setSex(message.sex);
        this.setAvatarAsId(message.avatar);
        this.setCountryId(message.countryId);
        this.setCode(message.code);
    },
    setCode: function (code) {
        if (code && code !== "null") {
            this.codeLabel.string = code;
        } else {
            this.codeLabel.string = "";
        }
    },
    copyCode() {
        NewAudioManager.playClick();
        if (this.codeLabel.string == "") {
            cc.Global.showMessage(i18n.t("No code exists"));
            return;
        }
        if (cc.sys.isNative) {
            jsb.copyTextToClipboard(this.codeLabel.string);
            cc.Global.showMessage(i18n.t("Đã copy"));
        } else {
            cc.Global.showMessage(i18n.t("Không hỗ trợ trên web"));
        }
    },
    initChangeInfo: function () {
        this.editBoxNode.getComponent(cc.EditBox).string = "";
        this.changeInfoNode.active = false;
        this.editBoxNode.active = false;
        this.checkBoxSex.active = false;
        this.changePasswordNode.active = false;
    },
    setLoginName: function (name) {
        this.labelLoginNameNode.getComponent(cc.Label).string = !!name ? name : i18n.t("title_not_yet_update");
    },

    addCustomEventListener: function () {
        this.btnCloseNode.on(cc.Node.EventType.TOUCH_END, this.onPanelUserClick, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.CHANGE_AVATAR, this.onChangeAvatar, this);
        DataAccess.Instance.node.on("update-user-data", this.onGetUserData, this);
    },

    handleToggleGirl(toggle) {
        NewAudioManager.playClick();
        var checkBoy = this.toggleBoyNode.getComponent(cc.Toggle);
        if (toggle) {
            checkBoy.isChecked = false;
            this.valueEdit = "sex=Nu";
            cc.log(this.valueEdit);
        }
    },

    handleToggleBoy(toggle) {
        NewAudioManager.playClick();
        var checkGirl = this.toggleGirlNode.getComponent(cc.Toggle);
        if (toggle) {
            checkGirl.isChecked = false;
            this.valueEdit = "sex=Nam";
            cc.log(this.valueEdit);
        }
    },

    closeChangeInfoNode() {
        NewAudioManager.playClick();
        this.initChangeInfo();
    },

    clickBtnChangePass() {
        NewAudioManager.playClick();
        this.changePasswordNode.active = true;
    },

    clickBtnEdit: function (event) {
        NewAudioManager.playClick();
        const target = event.currentTarget;
        this.changeInfoNode.active = true;
        if (target == this.btnEditAddress) {
            this.titleChange.string = i18n.t("title_change_address");
            this.editBoxNode.getComponent(cc.EditBox).string = this.dataUser.address != "null" ? this.dataUser.address : "";
            this.keyEdit = "address=";
            this.editBoxNode.active = true;
            this.checkBoxSex.active = false;
        } else if (target == this.btnEditCity) {
            this.titleChange.string = i18n.t("title_change_city");
            this.editBoxNode.getComponent(cc.EditBox).string = this.dataUser.cityId != "null" ? this.dataUser.cityId : "";
            this.keyEdit = "city=";
            this.editBoxNode.active = true;
            this.checkBoxSex.active = false;
        } else if (target == this.btnEditEmail) {
            this.titleChange.string = i18n.t("title_change_email");
            this.editBoxNode.getComponent(cc.EditBox).string = this.dataUser.email != "null" ? this.dataUser.email : "";
            this.keyEdit = "email=";
            this.editBoxNode.active = true;
            this.checkBoxSex.active = false;
        } else if (target == this.btnEditSex) {
            this.titleChange.string = i18n.t("title_change_sex");
            // this.editBoxNode.getComponent(cc.EditBox).string = this.dataUser.sex;
            this.checkBoxSex.active = true;
            this.editBoxNode.active = false;

            var ischeckGirl = this.toggleGirlNode.getComponent(cc.Toggle);
            var ischeckBoy = this.toggleBoyNode.getComponent(cc.Toggle);
            if (this.dataUser.sex == 0) {
                ischeckGirl.isChecked = true;
                ischeckBoy.isChecked = false;
            } else if (this.dataUser.sex == 1) {
                ischeckGirl.isChecked = false;
                ischeckBoy.isChecked = true;
            }
            if (ischeckGirl.isChecked) {
                this.valueEdit = "sex=Nu";
            }
            if (ischeckBoy.isChecked) {
                this.valueEdit = "sex=Nam";
            }
        }
    },

    onEditBoxTextChanged: function (editbox) {
        this.valueEdit = this.keyEdit + editbox;
    },

    clickBtnUpdate() {
        NewAudioManager.playClick();
        var cache = LoginCache.get();
        var password = Md5(cache.password);
        var username = cache.username;
        var data = `pass=${password}&username=${username}&avatar=${avatar}&${this.valueEdit}`;
        var url = Linker.Config.APP_API + "/ApiUserInfo/updateUserInfo";
        cc.log(data);
        Api.postNoJson(url, data, (result) => {
            cc.log(result);
            if (result.error == 1) {
                this.changeInfoNode.active = false;
                cc.Global.showMessage(result.msg);
                this.requestDataUser();
            } else {
                cc.Global.showMessage(result.msg);
            }
        });

    },

    getSex(id) {
        if (id == 0) return i18n.t("title_girl");
        else if (id == 1) return i18n.t("title_boy");
        else return null;
    },


    setUserName: function (name) {
        //right
        var _name = !!name ? name : i18n.t("title_not_yet_update");
        this.labelUserNameNode.getComponent(cc.Label).string = _name;
        this.userNameLeft.getComponent(cc.Label).string = _name;
    },
    setAddress: function (add) {
        //right
        this.labelAddress.getComponent(cc.Label).string = !!add ? add : i18n.t("title_not_yet_update");
    },
    setSex: function (sex) {
        //right
        var checkGirl = this.toggleGirlNode.getComponent(cc.Toggle);
        var checkBoy = this.toggleBoyNode.getComponent(cc.Toggle);
        sex == 0 ? checkGirl.isChecked = true : checkGirl.isChecked = false;
        sex == 1 ? checkBoy.isChecked = true : checkBoy.isChecked = false;
        this.labelSex.getComponent(cc.Label).string = !!this.getSex(sex) ? this.getSex(sex) : i18n.t("title_not_yet_update");
    },
    setPhoneNumber: function (number) {
        //right
        this.labelPhoneNumber.getComponent(cc.Label).string = !!number ? number : i18n.t("title_not_yet_update");
    },
    setEmail: function (email) {
        //right
        this.labelEmail.getComponent(cc.Label).string = !!email ? email : i18n.t("title_not_yet_update");
    },
    setCity: function (city) {
        //right
        this.labelCity.getComponent(cc.Label).string = !!city && city != "null" ? city : i18n.t("title_not_yet_update");
    },
    // setUserMoney: function (money) {
    //     money = parseInt(money);
    //     if (isNaN(money) == false) {
    //         money = Utils.Malicious.moneyWithFormat(money, ".");
    //         // money = Utils.Number.abbreviate(money);
    //         this.labelMoneyNode.getComponent(cc.Label).string = !!money ? money : 0;
    //     }

    // },
    setUserRealMoney: function (money) {
        money = parseInt(money);
        if (isNaN(money) == false) {
            money = Utils.Malicious.moneyWithFormat(money, ".");
            // money = Utils.Number.abbreviate(money);
            this.labelRealMoneyNode.getComponent(cc.Label).string = !!money ? money : 0;
        }

    },
    setUserExp: function (exp) {
        this.labelExpNode.getComponent(cc.Label).string = !!exp ? exp : i18n.t("title_not_yet_update");
    },
    setUserIDLabel: function (id) {
        this.labelUserID.getComponent(cc.Label).string = !!id ? id : i18n.t("title_not_yet_update");
        this.labelUserIDLeft.getComponent(cc.Label).string = !!id ? "ID: " + id : i18n.t("title_not_yet_update");
    },
    setLevelLabel: function (exp) {
        var exp = parseInt(exp);
        if (!isNaN(exp)) {
            var data = Utils.Malicious.getLevelByExp(exp);
            this.levelLabel.string = data.level;
        }
    },
    setUserLevel: function (exp) {
        var exp = parseInt(exp);
        if (!isNaN(exp)) {
            // this.userAvatarLevel.active = true;
            var spriteLevel = this.userAvatarLevel.getComponent(cc.Sprite);
            spriteLevel.fillCenter = 0;
            spriteLevel.fillCenter = cc.v2(0.5, 0.5)
            var levelObj = Utils.Malicious.getLevelRankingByExp(exp);
            var level = levelObj.level;
            var maxRank = levelObj.maxRank;
            var percentLevel = level * 100 / maxRank;
            var fillRange = percentLevel / 100;
            spriteLevel.fillRange = fillRange;//0 -1
            var keyLevelText = "userdata_level_" + level;
            this.labelUserLevel.getComponent(cc.Label).string = i18n.t(keyLevelText);
        } else {
            this.labelUserLevel.getComponent(cc.Label).string = i18n.t("userdata_level_1");
        }
    },
    setUserExpPercent: function (exp) {
        var exp = parseInt(exp);
        var lable = this.lableUserExp.getComponent(cc.Label);
        if (lable && this.userExpProgress) {
            if (!isNaN(exp)) {
                // this.userAvatarLevel.active = true;
                var spriteLevel = this.userAvatarLevel.getComponent(cc.Sprite);
                spriteLevel.fillCenter = 0;
                spriteLevel.fillCenter = cc.v2(0.5, 0.5)
                var data = Utils.Malicious.getLevelByExp(exp);
                var maxExp = data.maxExp;
                var percentLevel = exp * 100 / maxExp;
                var fillRange = percentLevel / 100;
                spriteLevel.fillRange = fillRange;//0 -1
                this.userExpProgress.fillRange = fillRange;//0 -1
                lable.string = exp + "/" + maxExp;
            } else {
                lable.string = "0/0";
            }
        }

    },
    onPanelUserClick: function (event) {
        var target = event.currentTarget;
        if (target) {
            if (target == this.btnCloseNode) {
                this.onBtnCloseClick();
                if (this.isFriendZoneTab) {
                    // var customEvent = new cc.Event.EventCustom(Constant.POPUP_EVENT.FRIEND_ZONE.OPEN, true);
                    // this.node.dispatchEvent(customEvent);
                    var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_MO_POPUP_BAN_BE, true);
                    this.node.dispatchEvent(customEvent);
                    //mo tab friend zone
                    if (this.isFindFriendTab) {
                        //mo friend zone va mo tab find friend
                        var customEvent = new cc.Event.EventCustom(Constant.POPUP_EVENT.FRIEND_ZONE.FIND_FRIEND_TAB.OPEN, true);
                        this.node.dispatchEvent(customEvent);
                    }
                }
                this.isFriendZoneTab = false;
                this.isFindFriendTab = false;
                this.node.active = false;

            }
            cc.log("Whoa", event);
        }
    },
    onChangeAvatar: function () {
        this.userId = Number(this.userId);
        if (this.userId && this.userId == Number(Linker.userData.userId)) {
            this.setAvatarAsId(Linker.userData.avatar);
        }
    },
    setAvatarAsId: function (id) {
        if (isNaN(id)) {
            id = 1;
        }
        id = Number(id);
        var frame = this.avatarAtlas.getSpriteFrame("avatar (" + id + ")");
        if (!frame) {
            frame = this.avatarAtlas.getSpriteFrame("avatar (1)");
        }
        if (Linker.avatarFbFrame) {
            frame = Linker.avatarFbFrame;
        }
        this.avatarNode.getComponent(cc.Sprite).spriteFrame = frame;
    },
    setCountryId: function (id) {
        if (!id) {
            id = "w";
        }
        var frame = this.countryAtlas.getSpriteFrame(id);
        if (!frame) {
            frame = this.countryAtlas.getSpriteFrame("w");
        }
        this.countryNode.getComponent(cc.Sprite).spriteFrame = frame;
    },
    clickMatchHistory() {
        NewAudioManager.playClick();
        this.matchHistoryNode.active = true;
        this.node.getChildByName("infoPanel").active = false;
    },
    onBtnCloseClick: function () {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        customEvent.toggle = this.node.getComponent(cc.Toggle);
        customEvent.isFriendZoneClick = this.isFriendZoneClick;
        customEvent.isFriendZoneTab = this.isFriendZoneTab;
        customEvent.isFindFriendTab = this.isFindFriendTab;
        this.node.dispatchEvent(customEvent);
        this.isFriendZoneClick = false;
        this.isFriendZoneTab = false;
        this.isFindFriendTab = false;
        this.node.active = false;
    },

    SendGift(event, customEventData) {
        this.onPanelUserClick({ currentTarget: this.btnCloseNode });
        Linker.TLMNController.player0.profileNode.active ? Linker.TLMNController.player0.SendGiftTo(this.targetPlayer, customEventData) :
            Linker.TLMNController.player4.SendGiftTo(this.targetPlayer, customEventData);

        var chatString = "13001, " + Linker.userData.userId + ", " + this.targetPlayer.player.userId + ", " + customEventData;
        var str = Constant.CMD.CHAT +
            Constant.SEPERATOR.N4 + Linker.CURRENT_TABLE.tableId +
            Constant.SEPERATOR.ELEMENT + chatString +
            Constant.SEPERATOR.ELEMENT + 0;

        cc.Canvas.instance.node.emit(1300, data);
        var data = this.sendChatPrivate(str);
        Linker.Socket.send(data);
    },

    sendChatPrivate(str) {
        var data = { r: [] };
        data.r.push({ v: str });
        return JSON.stringify(data);
    },
    // update (dt) {},
});
