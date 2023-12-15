// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Linker = require('Linker');
var Utils = require('Utils');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        itemBonus: cc.Prefab,
        bonusContent: cc.Node,
        textNhaMang: cc.Label,
        textMenhGia: cc.Label,
        textPhaiTra: cc.Label,
        listTypeNet: cc.Node,
        listValue: cc.Node,
        // new properties
        itemRewardPrefab: cc.Prefab,
        list_spriteFrame: [cc.SpriteFrame],
        listCard: cc.Node,
        rewardMessagePrefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        Linker.BonusTab = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //self.node.active = false;
        }, this);
        this.addSocketEvent();
        this.currentReward = null;
    },
    onEnable: function () {
        //ngăn chặn việc yêu cầu get data quá nhiều, sẽ lưu vào local storage
        this.resetUi();
        var listBonusExChangeAPI = JSON.parse(cc.sys.localStorage.getItem("LIST_BONUS_EXCHANGE_API"));
        if(listBonusExChangeAPI && listBonusExChangeAPI.apiVersion == Linker.Config.apiVersion){
            //không gọi lên chỉ lấy trong local storage mà thôi
            var listBonus = listBonusExChangeAPI.listBonus;
            // this.createListBonus(listBonus);
            this.initView(listBonus);
        }else{
            //data chưa được gửi về phải lấy lại từ serve
            var test = CommonSend.getListBonus(1);
            Linker.Socket.send(test);
        }        
    },

    onDisable: function () {
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
    },
    closeBtnClick() {
        this.node.active = false;
    },
    start() {
        // this.addSocketEvent();
    },
    addSocketEvent() {
        Linker.Event.addEventListener(400004, this.onGetListBonus, this);
        Linker.Event.addEventListener(400005, this.onBonus, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(400004, this.onGetListBonus, this);
        Linker.Event.removeEventListener(400005, this.onBonus, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onGetListBonus(message) {
        if (message.status == 1) {
            cc.sys.localStorage.removeItem("LIST_BONUS_EXCHANGE_API");
            //ở đây lưu data lại không làm gì hết
            var listBonusExChangeAPI = {
                listBonus: message.bonus,
                apiVersion: Linker.Config.apiVersion
            };
            cc.sys.localStorage.setItem("LIST_BONUS_EXCHANGE_API" , JSON.stringify(listBonusExChangeAPI));
            //thực hiện khởi tạo lần đầu khi chạy app
            // this.createListBonus(message.bonus);
            this.initView(message.bonus);
        }
    },
    onBonus(message) {
        if (message.status == 1) {
            this.resetUi();
            this.doiData = null;
            cc.Global.showMessage(message.message);
        } else {
            cc.Global.showMessage(message.message);
        }
    },
    createListBonus(listBonus) {
        this.listBonus = listBonus;
        cc.log('*** lst bonus', listBonus);
        this.bonusContent.removeAllChildren();
        listBonus.forEach((item, pos) => {
            var history = cc.instantiate(this.itemBonus);
            this.bonusContent.addChild(history);
            history.data = item;
            var script = history.getComponent(require('ItemBonus'));
            if (script) {
                script.init();
            }
        })
    },
    btnDoi(data) {
        this.doiData = data;
        cc.log('***', this.doiData);
        this.textNhaMang.string = this.doiData.name.split(" ")[0];
        this.textMenhGia.string = Utils.Number.format(this.doiData.price);
        this.textPhaiTra.string = Utils.Number.format(this.doiData.price_change);
    },
    xacNhanBtn() {
        if (this.doiData) {

            var test = CommonSend.bonus(this.doiData.itemId);
            Linker.Socket.send(test);
        } else {
            cc.Global.showMessage(i18n.t("Please select a card to change"));
        }

    },
    resetUi() {
        this.textNhaMang.string = "Nhà mạng";
        this.textMenhGia.string = "Mệnh giá";
        this.textPhaiTra.string = "Phải trả";
    },

    typeNetClick() {
        if (this.listTypeNet.active) {
            this.listTypeNet.active = false;
        } else {
            this.listTypeNet.active = true;
        }

    },
    valueClick() {
        if (this.listValue.active) {
            this.listValue.active = false;
        } else {
            this.listValue.active = true;
        }
    },

    itemTypeNetClick(event) {
        switch (event.target.name) {
            case "Viettel": {
                this.typeNet = "viettel";
                this.textNhaMang.color = new cc.Color(0, 0, 0);
                break;
            }
            case "Vinaphone": {
                this.typeNet = "vinaphone";
                this.textNhaMang.color = new cc.Color(0, 0, 0);
                break;
            }
            case "Mobifone": {
                this.typeNet = "mobifone";
                this.textNhaMang.color = new cc.Color(0, 0, 0);
                break;
            }
            case "default": {

                this.typeNet = null;

                this.textNhaMang.color = new cc.Color(99, 99, 99);
            }
        }
        if (this.typeNet) {
            this.textNhaMang.string = event.target.name;
        } else {
            this.textNhaMang.string = "Chọn nhà mạng";
        }

        var check=false;
        if (Number(this.textMenhGia.string)) {
            switch (event.target.name) {
                case "Viettel": {
                    if (this.listBonus) {
                        this.listBonus.forEach(item => {
                            if (item.name.indexOf('VIET') >= 0 && Number(item.price) == Number(this.textMenhGia.string.replace(/\./g, ''))) {
                                this.textPhaiTra.string = Utils.Number.format(item.price_change);
                                this.doiData = item;
                                check=true;
                            }
                        });
                    }
                    break;
                }
                case "Vinaphone": {
                    if (this.listBonus) {
                        this.listBonus.forEach(item => {
                            if (item.name.indexOf('VINA') >= 0 && Number(item.price) == Number(this.textMenhGia.string.replace(/\./g, ''))) {
                                this.textPhaiTra.string = Utils.Number.format(item.price_change);
                                this.doiData = item;
                                check=true;
                            }
                        });
                    }
                    break;
                }
                case "Mobifone": {
                    if (this.listBonus) {
                        this.listBonus.forEach(item => {
                            if (item.name.indexOf('MOBI') >= 0 && Number(item.price) == Number(this.textMenhGia.string.replace(/\./g, ''))) {
                                this.textPhaiTra.string = Utils.Number.format(item.price_change);
                                this.doiData = item;
                                check=true;
                            }
                        });
                    }
                    break;
                }
            }
        }
        if(!check){
            this.doiData=null;
            this.textPhaiTra.string='Phải trả';
        }

        // this.listBonus.forEach(item=>{
        //     cc.log(item.name.indexOf('Mobi'),item.name);
        // });
        this.listTypeNet.active = false;
    },
    itemTypeValueClick(event) {
        cc.log('target value:', event.target.name);
        if (event.target.name !== 'default') {
            this.textMenhGia.string = Utils.Number.format(event.target.name);
        } else {
            this.textMenhGia.string = "Chọn mệnh giá";
        }

        var check=false;
        switch (this.textNhaMang.string) {
            case "Viettel": {
                if (this.listBonus) {
                    this.listBonus.forEach(item => {
                        if (item.name.indexOf('VIET') >= 0 && Number(item.price) == Number(this.textMenhGia.string.replace(/\./g, ''))) {
                            this.textPhaiTra.string = Utils.Number.format(item.price_change);
                            this.doiData = item;
                            check=true;
                        }
                    });
                }
                break;
            }
            case "VIET": {
                if (this.listBonus) {
                    this.listBonus.forEach(item => {
                        if (item.name.indexOf('VIET') >= 0 && Number(item.price) == Number(this.textMenhGia.string.replace(/\./g, ''))) {
                            this.textPhaiTra.string = Utils.Number.format(item.price_change);
                            this.doiData = item;
                            check=true;
                        }
                    });
                }
                break;
            }
            case "Vinaphone": {
                if (this.listBonus) {
                    this.listBonus.forEach(item => {
                        if (item.name.indexOf('VINA') >= 0 && Number(item.price) == Number(this.textMenhGia.string.replace(/\./g, ''))) {
                            this.textPhaiTra.string = Utils.Number.format(item.price_change);
                            this.doiData = item;
                            check=true;
                        }
                    });
                }
                break;
            }
            case "Vina": {
                if (this.listBonus) {
                    this.listBonus.forEach(item => {
                        if (item.name.indexOf('MOBI') >= 0 && Number(item.price) == Number(this.textMenhGia.string.replace(/\./g, ''))) {
                            this.textPhaiTra.string = Utils.Number.format(item.price_change);
                            this.doiData = item;
                            check=true;
                        }
                    });
                }
                break;
            }
            case "Mobifone": {
                if (this.listBonus) {
                    this.listBonus.forEach(item => {
                        if (item.name.indexOf('MOBI') >= 0 && Number(item.price) == Number(this.textMenhGia.string.replace(/\./g, ''))) {
                            this.textPhaiTra.string = Utils.Number.format(item.price_change);
                            this.doiData = item;
                            check=true;
                        }
                    });
                }
                break;
            }
            case "Mobi": {
                if (this.listBonus) {
                    this.listBonus.forEach(item => {
                        if (item.name.indexOf('MOBI') >= 0 && Number(item.price) == Number(this.textMenhGia.string.replace(/\./g, ''))) {
                            this.textPhaiTra.string = Utils.Number.format(item.price_change);
                            this.doiData = item;
                            check=true;
                        }
                    });
                }
                break;
            }
        }
        if(!check){
            this.doiData=null;
            this.textPhaiTra.string='Phải trả';
        }

        this.listValue.active = false;
    },

    //CREATE NEW SCRIPT
    initView(data) {
        this.listCard.removeAllChildren();
        var customData = this.customData(data);
        for (let i = 0; i < customData[0].length; i++) {
            var vtt = cc.instantiate(this.itemRewardPrefab);
            vtt.data = customData[0][i];
            vtt.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[0];
            vtt.getChildByName("card").getComponent(cc.Label).string = this.custom_textForm(customData[0][i].price);
            vtt.getChildByName("money").getComponent(cc.Label).string = this.custom_textForm(customData[0][i].price_change);
            this.listCard.addChild(vtt);
        }

        for (let i = 0; i < customData[1].length; i++) {
            var vina = cc.instantiate(this.itemRewardPrefab);
            vina.data = customData[1][i];
            vina.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[1];
            vina.getChildByName("card").getComponent(cc.Label).string = this.custom_textForm(customData[1][i].price);
            vina.getChildByName("money").getComponent(cc.Label).string = this.custom_textForm(customData[1][i].price_change);
            this.listCard.addChild(vina);
        }

        for (let i = 0; i < customData[2].length; i++) {
            var mobi = cc.instantiate(this.itemRewardPrefab);
            mobi.data = customData[2][i];
            mobi.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[2];
            mobi.getChildByName("card").getComponent(cc.Label).string = this.custom_textForm(customData[2][i].price);
            mobi.getChildByName("money").getComponent(cc.Label).string = this.custom_textForm(customData[2][i].price_change);
            this.listCard.addChild(mobi);
        }
    },

    onClickItemReward(data) {
        this.currentReward = data;
        var rewardMessagePrefab = cc.instantiate(this.rewardMessagePrefab);
        var text = this.checkCardType(data.name) + " " + this.custom_textForm(data.price)
        rewardMessagePrefab.getChildByName("lb").getComponent(cc.Label).string = i18n.t("shop_reward_text", {text: text});
        this.node.addChild(rewardMessagePrefab, cc.macro.MAX_ZINDEX);
    },

    checkCardType(name) {
        if (name.indexOf("Vtt") !== -1) {
            return "Viettel";
        } else if (name.indexOf("Vina") !== -1) {
            return "Vinaphone";
        } else if (name.indexOf("Mobi") !== -1) {
            return "Mobifone";
        }
    },

    onClickAccept() {
        if (this.currentReward) {
            var test = CommonSend.bonus(this.currentReward.itemId);
            Linker.Socket.send(test);
        } else {
            cc.Global.showMessage(i18n.t("Unsuccessful exchange"));
        }
    },

    customData(data) {
        var vttArray = [];
        var vinaArray = [];
        var mobiArray = [];
        for (let i = 0; i < data.length; i++) {
            var name = data[i].name;
            if (name.indexOf("Vtt") !== -1) {
                vttArray.push(data[i]);
            } else if (name.indexOf("Vina") !== -1) {
                vinaArray.push(data[i]);
            } else if (name.indexOf("Mobi") !== -1) {
                mobiArray.push(data[i]);
            }
        }
        return [vttArray, vinaArray, mobiArray];
    },

    custom_textForm(str) {
        var text = '';
        var j = 0;
        for (var i = str.length - 1; i >= 0; i--) {
            j++;
            text = str[i] + text;
            if (j == 3 && i != 0) {
                text = "." + text;
                j = 0;
            }
        }
        return text;
    },
    // update (dt) {},
});