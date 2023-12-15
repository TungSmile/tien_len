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
        listRate: cc.Node,
        itemRate: cc.Prefab,
        itemValue: cc.Prefab,
        itemTypeNet: cc.Prefab,
        listTypeNet: cc.Node,
        listValue: cc.Node,
        scrollRate: cc.ScrollView,
        scrollTypeNet: cc.ScrollView,
        scrollValue: cc.ScrollView,
        seriInput: cc.EditBox,
        pinInput: cc.EditBox,
        textTypeNet: cc.Label,
        textValue: cc.Label,
        seriInputContainer: cc.Node,
        pinInputContainer: cc.Node,
        textNhaMang: cc.Node,
        textMenhGia: cc.Node,
        list_spriteFrame: [cc.SpriteFrame],
        typeCard: cc.Node,
        btnViettel: cc.Node,
        btnVina: cc.Node,
        btnMobi: cc.Node,
        quan: cc.Node,
        xu: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.resetAllField();
        this.node.on("EVENT_NAP_NHANH_FACOI", this.callEventNapNgay, this);
        this.addSocketEvent();

        var typeCardChilds = this.typeCard.children;
        for (var i = 0; i < typeCardChilds.length; i++) {
            if (i !== 0) {
                typeCardChilds[i].getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[0];
                typeCardChilds[i].opacity = 150;
            } else {
                typeCardChilds[i].getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[1];
                typeCardChilds[i].opacity = 255;
            }
        }
        this.typeNet = "viettel";

        this.typeMoney = 2; // 1 la xu, 2 la quan
        if (this.typeMoney == 2) {
            this.quan.getChildByName('check').active = true;
            this.xu.getChildByName('check').active = false;
        } else {
            this.quan.getChildByName('check').active = false;
            this.xu.getChildByName('check').active = true;
        }
    },
    callEventNapNgay: function(data){
        this.itemTypeNetClick(data.nhamang);
        this.itemTypeValueClick(data.menhgia);
        this.seriInput.string = data.serial;
        this.seriInput.placeholder = this.seriInput.string;
        this.pinInput.string = data.mathe;
        this.pinInput.placeholder = this.pinInput.string;
    },
    onEnable() {
        this.initTyGia();
    },
    initTyGia() {
        //ngăn chặn việc yêu cầu get data quá nhiều, sẽ lưu vào local storage
        var listTheAPI = JSON.parse(cc.sys.localStorage.getItem("LIST_THE_API"));
        if(listTheAPI && listTheAPI.apiVersion == Linker.Config.apiVersion){
            //không gọi lên chỉ lấy trong local storage mà thôi
            var listThe = listTheAPI.listThe;
            this.createListRateCard(listThe);
        }else{
            //data chưa được gửi về phải lấy lại từ serve
            var test = CommonSend.getListCard();
            Linker.Socket.send(test);
        }
    },
    start() {
       
    },
    addSocketEvent() {
        Linker.Event.addEventListener(1506, this.onGetListCard, this);
        Linker.Event.addEventListener(4000, this.onChargeCard, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(4000, this.onChargeCard, this);
        Linker.Event.removeEventListener(1506, this.onGetListCard, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onCheckBox(event) {
        switch (event.currentTarget) {
            case this.quan:
                this.typeMoney = 2;
                this.quan.getChildByName('check').active = true;
                this.xu.getChildByName('check').active = false;
                this.initTyGia();
                break;

            case this.xu:
                this.typeMoney = 1;
                this.quan.getChildByName('check').active = false;
                this.xu.getChildByName('check').active = true;
                this.initTyGia();
                break;
            default:
                break;
        }
    },
    onClickTypeCard(event) {
        switch (event.currentTarget) {
            case this.btnViettel:
                this.typeNet = "viettel";
                break;
            
            case this.btnVina:
                this.typeNet = "vinaphone";
                break;
            
            case this.btnMobi:
                this.typeNet = "mobifone";
                break;
        
            default:
                this.typeNet = null;
                break;
        }
        var typeCardChilds = this.typeCard.children;
        for (var i = 0; i < typeCardChilds.length; i++) {
            if (typeCardChilds[i].name !== event.target.name) {
                typeCardChilds[i].getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[0];
                typeCardChilds[i].opacity = 150;
            } else {
                typeCardChilds[i].getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[1];
                typeCardChilds[i].opacity = 255;
            }
        }
    },
    onChargeCard(message) {
        if (message.status == 1) {
            cc.Global.showMessage(i18n.t("Recharge successfully"));
        } else {
            cc.Global.showMessage(message.error)
        }
        if(this.typeNet){
            this.textTypeNet.string = this.typeNet;
        } else {
            this.textTypeNet.string = "Chọn nhà mạng";
        }
        

        if(this.textMoney){
            this.textValue.string = Utils.Number.format(this.textMoney);
            this.textMoney = this.textMoney;
            //this.textMenhGia.color = new cc.Color(0, 0, 0);
        } else {
            this.textValue.string = i18n.t("shop_editbox_placeholder_value");
            this.textMenhGia.color = cc.color("#FFFFFF");
            this.textMoney = null;
        }

        if(cc.find("Loading")) cc.find("Loading").active = false;
    },
    onGetListCard(message) {
        if (message.status == 1) {
            cc.sys.localStorage.removeItem("LIST_THE_API");
            //ở đây lưu data lại không làm gì hết
            var listTheAPI = {
                listThe: message.listRate,
                apiVersion: Linker.Config.apiVersion
            };
            cc.sys.localStorage.setItem("LIST_THE_API" , JSON.stringify(listTheAPI));
            //thực hiện khởi tạo lần đầu khi chạy app
            this.createListRateCard(message.listRate);
        }
    },
    createListRateCard(listRate) {
        this.listRate.removeAllChildren();
        if (listRate) {
            listRate.forEach((element ,pos)=> {
                var rate = cc.instantiate(this.itemRate);
                this.listRate.addChild(rate);
                var ItemRate = rate.getComponent(require('ItemRate'));
                if (ItemRate) {
                    ItemRate.init(element, this.typeMoney);
                }
            });
        }
        this.scrollRate.scrollToTop(0);
    },
    xacNhanBtnClick() { //gui xac nhan nap
        var seri = this.seriInput.string;
        var pin = this.pinInput.string;
        if (seri.length > 0 && pin.length > 0 && this.typeNet && this.textMoney) {
            if(cc.find("Loading")) cc.find("Loading").active = true;
            var test = CommonSend.chargeCard(this.typeNet, seri, pin,this.textMoney, this.typeMoney);
            Linker.Socket.send(test);
            this.resetAllField();
        } else {
            cc.Global.showMessage(i18n.t("card_seri_empty"));
            this.resetAllField();
        }
        //cc.log(seri, pin, this.typeNet);
    },
    typeNetClick() {
        if (this.listTypeNet.active) {
            this.listTypeNet.active = false;
            this.seriInputContainer.active = true;
            this.pinInputContainer.active = true;
        } else {
            this.listTypeNet.active = true;
            this.seriInputContainer.active = false;
            this.pinInputContainer.active = false;
        }
        
    },
    valueClick() {
        if (this.listValue.active) {
            this.listValue.active = false;
            this.seriInputContainer.active = true;
            this.pinInputContainer.active = true;
        } else {
            this.listValue.active = true;
            this.seriInputContainer.active = false;
            this.pinInputContainer.active = false;
        }
    },
    itemTypeNetClick(event) {
        this.resetAllField();
        switch (event.target.name) {
            case "Viettel": {
                this.typeNet = "viettel";
                //this.textNhaMang.color = new cc.Color(0, 0, 0);
                break;
            }
            case "Vinaphone": {
                this.typeNet = "vinaphone";
                //this.textNhaMang.color = new cc.Color(0, 0, 0);
                break;
            }
            case "Mobifone": {
                this.typeNet = "mobifone";
                //this.textNhaMang.color = new cc.Color(0, 0, 0);
                break;
            }
            case "default": {

                this.typeNet = null;

                this.textNhaMang.color = cc.color("#FFFFFF");
            }
        }
        if(this.typeNet){
            this.textTypeNet.string = event.target.name;
        } else {
            this.textTypeNet.string = i18n.t("shop_editbox_placeholder_value");
        }
        this.listTypeNet.active = false;
        this.seriInputContainer.active = true;
        this.pinInputContainer.active = true;

    },
    itemTypeValueClick(event) {
        cc.log('target value:',event.target.name);
        if(event.target.name !== 'default'){
            this.textValue.string = Utils.Number.format(event.target.name);
            this.textMoney = event.target.name;
            this.textMenhGia.color = cc.color("#FFFFFF");
            //this.textMenhGia.color = new cc.Color(0, 0, 0);
        } else {
            this.textValue.string = i18n.t("shop_editbox_placeholder_value");
            this.textMenhGia.color = cc.color("#FFFFFF");
            this.textMoney = null;
        }
        
        this.listValue.active = false;
        this.seriInputContainer.active = true;
        this.pinInputContainer.active = true;
    },
    resetAllField: function(){
        this.pinInput.placeholder = i18n.t("shop_editbox_placeholder_code");
        this.pinInput.string = "";
        this.seriInput.placeholder = i18n.t("shop_editbox_placeholder_seri");
        this.seriInput.string = "";
        this.textTypeNet.string = "Chọn nhà mạng";
        this.textValue.string = i18n.t("shop_editbox_placeholder_value");
        this.textMenhGia.color = cc.color("#FFFFFF");
        this.typeNet = null;
        this.textMoney = null;
    }
    // update (dt) {},
});
