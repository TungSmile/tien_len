// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var CommonSend = require('CommonSend')
var Linker = require('Linker');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        itemBackground: cc.Prefab,
        thumbListBg: cc.SpriteAtlas,
        containerItem: cc.Node,
        dataBack: cc.JsonAsset
    },

    onEnable() {
        this.addSocketEvent();
        // Đã load data 1 trang home rồi nên lấy ra load lên list thôi
        // Nếu không có thì load lại
        // Load lại không có thì dùng list background mặc định
        if (Linker.listTheme) {
            this.renderListBackground(Linker.listTheme);
        } else {
            // Gửi requset lấy danh sách background
            var dataSend = CommonSend.sendActionTheme(Linker.userData.userId, Constant.ACTION_THEME.GET_DATA_THEME, 0);
            if (dataSend) {
                Linker.Socket.send(dataSend);
            }
        }
    },

    caseAction(response) {
        if (response.status == 1) {
            this.onListBackgroundResponse(response);
            switch (response.action) {
                case Constant.ACTION_THEME.GET_DATA_THEME:
                    break;
                case Constant.ACTION_THEME.PAY_THEME:
                    this.updateMoneyPay(response.realMoney);
                    this.getThemeSelected(response.listBackground);
                    break;
                case Constant.ACTION_THEME.SELECT_THEME:
                    this.getThemeSelected(response.listBackground);
                    break;
            }
        } else {
            if (response.error) {
                var customEvent = new cc.Event.EventCustom('ERR_THEME', true);
                customEvent.err_key = response.error;
                this.node.dispatchEvent(customEvent);
            }
        }
    },
    getThemeSelected(listBackground) {
        var theme = null;
        if (listBackground) {
            listBackground.forEach(element => {
                if (element.isUse) {
                    theme = element;
                }
            });
        }
        if (theme != null) {
            var customEvent = new cc.Event.EventCustom('UPDATE_THEME', true);
            customEvent.theme = theme;
            this.node.dispatchEvent(customEvent);
        }
    },
    updateMoneyPay(money) {
        Linker.userData.userRealMoney = money;
        this.node.dispatchEvent(new cc.Event.EventCustom('UPDATE_REAL_MONEY', true));
    },
    onListBackgroundResponse(response) {
        if (response.listBackground && response.listBackground.length > 0 && response.listBackground != null) {
            Linker.listTheme = response.listBackground;
            this.containerItem.removeAllChildren();
            response.listBackground.forEach(el => {
                let itemComponent = cc.instantiate(this.itemBackground);
                if (itemComponent) {
                    let itemComponentScript = itemComponent.getComponent('ItemBackground');
                    if (itemComponentScript) {
                        itemComponentScript.renderBackground(el);
                    }
                }
                this.containerItem.addChild(itemComponent);
            });
        }else{
            var listBackgroundBackup = this.dataBack.json.listBackgound;
            if(listBackgroundBackup){
                this.renderListBackground(listBackgroundBackup);
            }
            
        }
    },
    renderListBackground(listBackground = []) {
        if (listBackground && listBackground != null && listBackground.length > 0) {
            this.containerItem.removeAllChildren();
            listBackground.forEach(el => {
                let itemComponent = cc.instantiate(this.itemBackground);
                if (itemComponent) {
                    let itemComponentScript = itemComponent.getComponent('ItemBackground');
                    if (itemComponentScript) {
                        itemComponentScript.renderBackground(el);
                    }
                }
                this.containerItem.addChild(itemComponent);
            });
        }
    },

    onDestroy() {
        this.removeSocketEvent();
    },
    disableNode: function () {
        this.removeSocketEvent();
        this.node.active = !this.node.active;
    },
    addSocketEvent() {
        Linker.Event.addEventListener(19721, this.caseAction, this);
    },
    removeSocketEvent() {
        Linker.Event.addEventListener(19721, this.caseAction, this);
    },
});
