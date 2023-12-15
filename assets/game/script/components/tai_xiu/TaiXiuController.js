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
var TaiXiuConstant = require('TaiXiuConstant');
var SocketConstant = require('SocketConstant');
var TaiXiuSend = require('TaiXiuSend');
var Utils = require('Utils');
var Api = require('Api');
var Global = require('Global');
var DataAccess = require('DataAccess');

var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        gameState: TaiXiuConstant.GAME_STATE.GAME_NULL,
        gamemain: {
            default: null,
            type: cc.Node,
        },
        datCuoc: {
            type: cc.Node,
            displayName: "datCuoc",
            default: null
        },
        mucCuoc: {
            type: cc.Node,
            displayName: "mucCuoc",
            default: null
        },
        anotherNumber: {
            type: cc.Node,
            displayName: "anotherNumber",
            default: null
        },
        lac: {
            type: cc.Node,
            displayName: "lac",
            default: null
        },
        dang_can_cua: {
            type: cc.Node,
            displayName: "dang_can_cua",
            default: null
        },
        fire: {
            type: cc.Node,
            displayName: "fire",
            default: null
        },
        number_xiu_label: {
            type: cc.Label,
            displayName: "number_xiu_label",
            default: null
        },
        number_tai_label: {
            type: cc.Label,
            displayName: "number_tai_label",
            default: null
        },
        coin_tai_label: {
            type: cc.Label,
            displayName: "coin_tai_label",
            default: null
        },
        coin_xiu_label: {
            type: cc.Label,
            displayName: "coin_xiu_label",
            default: null
        },
        sum_coin_tai_label: {
            type: cc.Label,
            displayName: "sum_coin_tai_label",
            default: null
        },
        sum_coin_xiu_label: {
            type: cc.Label,
            displayName: "sum_coin_xiu_label",
            default: null
        },
        my_coin_tai_label: {
            type: cc.Label,
            displayName: "my_coin_tai_label",
            default: null
        },
        my_coin_xiu_label: {
            type: cc.Label,
            displayName: "my_coin_xiu_label",
            default: null
        },
        countDownBG: {
            type: cc.Label,
            displayName: "countDownBG",
            default: null
        },
        totalMatch: {
            type: cc.Label,
            displayName: "totalMatch",
            default: null
        },
        light_effect: {
            type: cc.Node,
            displayName: "light_effect",
            default: null
        },
        effect1_tai: {
            type: cc.Node,
            displayName: "effect1_tai",
            default: null
        },
        effect2_tai: {
            type: cc.Node,
            displayName: "effect2_tai",
            default: null
        },
        effect1_xiu: {
            type: cc.Node,
            displayName: "effect1_xiu",
            default: null
        },
        effect2_xiu: {
            type: cc.Node,
            displayName: "effect2_xiu",
            default: null
        },
        text_tai: {
            type: cc.Node,
            displayName: "text_tai",
            default: null
        },
        text_xiu: {
            type: cc.Node,
            displayName: "text_xiu",
            default: null
        },
        valueTai: {
            type: cc.Node,
            displayName: "valueTai",
            default: null
        },
        valueXiu: {
            type: cc.Node,
            displayName: "valueXiu",
            default: null
        },
        timeLabel: {
            type: cc.Node,
            displayName: "timeLabel",
            default: null
        },
        dialogLuatChoi: {
            type: cc.Node,
            displayName: "dialogLuatChoi",
            default: null
        },
        time: {
            type: cc.Label,
            displayName: "time",
            default: null
        },
        nan: {
            type: cc.Node,
            displayName: "nan",
            default: null
        },
        windowChat: {
            default: null,
            type: cc.Node,
        },
        xucxac: {
            default: [],
            type: cc.Prefab,
        },
        item: {
            default: null,
            type: cc.Prefab,
        },
        prefabRank: {
            default: [],
            type: cc.Prefab,
        },
        prefabSoicau: {
            default: [],
            type: cc.Prefab,
        },
        prefabDialogRank: cc.Prefab,
        prefabDialogHistory: cc.Prefab,
        prefabDialogSoiCau: cc.Prefab,
        prefabDialogHistoryPhien: cc.Prefab,

        prefabPhienTX: cc.Prefab,
        prefabHistory: cc.Prefab,
        prefabChat: cc.Prefab,
        prefabAlert: cc.Prefab,
        prefabLoading: cc.Prefab,
        content: cc.Node,
        circle: cc.Node,
        list_phien_TX: cc.Node,
        prefab_tai: cc.Prefab,
        prefab_xiu: cc.Prefab,
        scrollView: cc.ScrollView,
        alert: cc.Node,
        btnNanToggle: cc.Toggle,
        seqWin: cc.Label,
        seqLose: cc.Label,

        xuc_xac: cc.Node,
        bgTai: cc.Node,
        bgXiu: cc.Node,
        maxDisplayPhien: 20,
        bgTimeResetRound: cc.Node,
        sukienDialogV2Prefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initTaiXiuController();
    },
    initTaiXiuController: function () {
        Linker.TaiXiuController = this;
        Linker.TaiXiuController.initValue();
        Linker.TaiXiuController.getComponent("TaiXiuView").initValue();
        if (Linker.CHAT_MESSAGE) {
            Linker.CHAT_MESSAGE = [];
        } else {
            Linker.CHAT_MESSAGE = [];
        }
        Linker.TaiXiuController.count = 0;
        // For tai xiu chat 5s
        Linker.TaiXiuController.timeCount = 0;
        Linker.TaiXiuController.bgTai.active = false;
        Linker.TaiXiuController.bgXiu.active = false;
    },
    initValue() {
        this.initList_MucCuoc();
        this.person_tai = this.number_tai_label;
        this.person_xiu = this.number_xiu_label;
        this.coin_tai = this.coin_tai_label;
        this.coin_xiu = this.coin_xiu_label;
        this.sum_coin_tai = this.sum_coin_tai_label;
        this.sum_coin_xiu = this.sum_coin_xiu_label;
        this.my_coin_tai = this.my_coin_tai_label;
        this.my_coin_xiu = this.my_coin_xiu_label;
        this.labelCountDown = this.countDownBG;

        Linker.TaiXiuController.valueTai.getComponent(cc.Label).string = "";
        Linker.TaiXiuController.valueXiu.getComponent(cc.Label).string = "";
        this.valueTai.active = false;
        this.valueXiu.active = false;
        this.lastTime = 0 * 1000 + Date.now();
        this.isStartGame = false;

        this.money = 0;
        this.door = -1;

        this.resetTextForms();

        this.btnNanToggle.isChecked = TaiXiuConstant.ISNAN;
        this.scrollView.scrollToBottom(0.1);

        this.choiedDoor = -1;
        Linker.addLastPhien = 0;
    },

    start() {
        cc.log("taixiu onstart");
        this.addSocketEvent();
        // var testdata = { "r": [{ "v": "12004\u0004" }] }
        // Linker.Socket.send(JSON.stringify(testdata));
        //2019-07-04 16:03 :__: Something goes here
        //cc.log("Linker.TaiXiuController.gameState:",Linker.TaiXiuController.gameState);
        // if(Linker.listPhienTX && this.list_phien_TX.children.length <=0){
        //     if(Linker.TaiXiuController.gameState == 2){
        //         Linker.TaiXiuView.run_Action_DangCanCua();
        //     }
        //     var arr_temp = Linker.listPhienTX ;
        //     Linker.listPhienTX = arr_temp;
        //     //cc.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAA cache', arr_temp);
        //     this.list_phien_TX.removeAllChildren();
        //     for(var i=0; i<13; i++){
        //         var arr = arr_temp[i].split(':');
        //         Linker.TaiXiuController.init_list_phienTX(arr[0], arr[1]);
        //     }
        //     Linker.TaiXiuController.startActionsListPhien();
        //     Linker.loadedTaiXiu = true;
        //     //update chat khi mat
        //     // cc.log("Linker.TaiXiuController.content",Linker.TaiXiuController.content);
        //     // cc.log("Linker.CHAT_MESSAGE",Linker.CHAT_MESSAGE);
        //     if(Linker.TaiXiuController.content.children.length <=0 && Linker.CHAT_MESSAGE){
        //     // Linker.CHAT_MESSAGE.push(...message.listChat);
        //     // Linker.TaiXiuController.content.removeAllChildren();
        //     var message = Linker.CHAT_MESSAGE;
        //     for(var i=0; i<Linker.CHAT_MESSAGE.length; i++){
        //         if(message[i].messageId != undefined){
        //             var userChat  = message[i].userName;
        //             var messChat = message[i].mess;
        //         }else{
        //             var userChat  = message[i].username;
        //             var messChat = message[i].messchat;
        //         }

        //         var itemChat = cc.instantiate(Linker.TaiXiuController.prefabChat);
        //         Linker.TaiXiuController.content.addChild(itemChat);
        //         // itemChat.getChildByName('textchat').getComponent(cc.Label).string = userChat + ": " + messChat;
        //         itemChat.getChildByName('textchat').getComponent(cc.RichText).string = '<color=yellow>' + userChat +': ' + '</color>' + '<color=white>' + messChat + '</color>';
        //         setTimeout(()=>{
        //             if(Linker.TaiXiuController.scrollView){
        //                 Linker.TaiXiuController.scrollView.scrollToBottom(0.1);
        //             }

        //         },100);

        //     }
        //     }

        // }

    },

    update(dt) {
        if(Linker.TaiXiuController){
            this._updateTaiXiu();
        }
    },

    _updateTaiXiu: function () {
        // this._updateTaiXiuTimeLeft();
        this.nowTime = this.lastTime - Date.now();
        if (this.nowTime > 0) {
            this.time.string = Math.round(this.nowTime / 1000) + "";
            this.setEffectTime(this.time.string);
        }
        // else {
        //     //this.allowBetting = false;
        //     this.time.string = "Cân cửa";
        // }
        this.updateControlledByMiniGame();
    },

    setEffectTime: function (time) {
        if (isNaN(time) == false && this.currTimeLabel !== Number(time) && Number(time) >= 0 && Number(time) <= 9) {
            this.currTimeLabel = Number(time);
            this.timeLabel.stopAllActions();
            this.timeLabel.setScale(2);
            this.timeLabel.runAction(cc.scaleTo(0.8, 1));
        } else if (Number(time) >= 10) {
            this.timeLabel.setScale(1);
        }
    },

    updateControlledByMiniGame: function () {
        var self = this;
        if (self.gameState == TaiXiuConstant.GAME_STATE.GAME_CHECK) {
            Linker.TaiXiuView.run_Action_DangCanCua();
        }
        this.timeCount++;
        if (TaiXiuConstant.ALERT == 1) {
            if (this.alert.children[0]) {
                this.alert.children[0].x -= 4;
                if (this.alert.children[0].x < -3 * this.alert.children[0].width) {
                    this.alert.removeChild(this.alert.children[0]);
                }
            }
        }
        this._updateAnimationDatCuoc();
        this._updateTimer();
    },
    resetTextForms() {
        this.person_tai.string = 0;
        this.person_xiu.string = 0;
        this.coin_tai.string = 'Đặt';
        this.coin_xiu.string = 'Đặt';
        this.sum_coin_tai.string = '...';
        this.sum_coin_xiu.string = '...';
        this.my_coin_tai.string = '...';
        this.my_coin_xiu.string = '...';
    },
    // random(min, max){
    //     return Math.floor(min + Math.random() * (max + 1 - min));
    // },


    // click event dat tien cuoc
    clickItemMucCuoc(event) {
        NewAudioManager.playClick();
        // cc.log(event.target);
        var self = this;
        if (TaiXiuConstant.LOCK_CHOICE_DOOR == 1) {
            var item = event.target;
            if (TaiXiuConstant.CHOICE_THE_DOOR != -1) {
                if (self.money > 1000000000) {
                    return;
                }
                var coin = 0;
                // self.money = 0;
                var text = item.getChildByName('text').getComponent(cc.Label).string;
                coin = self.checkClick_Item(text);
                //cc.log('click', coin);
                // if(self.money){
                self.money += coin;
                if (TaiXiuConstant.CHOICE_THE_DOOR == 0) {
                    if (self.money) {
                        var str = "";
                        str = str + self.money;
                        str = self.custom_textForm(str);
                        //cc.log('str', str);
                        self.update_Coin_Xius(str);
                    }
                }
                if (TaiXiuConstant.CHOICE_THE_DOOR == 1) {
                    if (self.money) {
                        var str = "";
                        str = str + self.money;
                        str = self.custom_textForm(str);
                        //cc.log('str', str);
                        self.update_Coin_Tais(str);
                    }

                }
                // }
            }
            else if (TaiXiuConstant.LOCK_CHOICE_DOOR == 0) {
                //cc.log('Dang trong thoi gian cho van moi, ko duoc dat cuoc');
            }
        }
    },

    clickItemSoKhac(event) {
        NewAudioManager.playClick();
        //cc.log('*** event new',event);
        var self = this;
        if (TaiXiuConstant.LOCK_CHOICE_DOOR == 1) {
            var item = event.target;
            if (TaiXiuConstant.CHOICE_THE_DOOR != -1) {
                if (item.name != 'del') {
                    if (self.money > 1000000000) {
                        return;
                    }
                    var coin = item.name;
                    self.money = Number(self.money.toString() + coin.toString());
                }
                else {
                    var temp = self.money.toString().replace(/.$/, "");
                    if (temp !== '') {
                        self.money = Number(temp);
                    } else {
                        self.money = '0';
                    }

                }

                if (TaiXiuConstant.CHOICE_THE_DOOR == 0) {
                    if (self.money) {
                        var str = "";
                        str = str + self.money;
                        str = self.custom_textForm(str);
                        //cc.log('str', str);
                        self.update_Coin_Xius(str);
                    }
                }
                if (TaiXiuConstant.CHOICE_THE_DOOR == 1) {
                    if (self.money) {
                        var str = "";
                        str = str + self.money;
                        str = self.custom_textForm(str);
                        //cc.log('str', str);
                        self.update_Coin_Tais(str);
                    }

                }
                // }
            }
            else if (TaiXiuConstant.LOCK_CHOICE_DOOR == 0) {
                //cc.log('Dang trong thoi gian cho van moi, ko duoc dat cuoc');
            }
        }
    },
    update_Coin_Tais(value) {
        this.coin_tai.string = value;
    },
    update_Coin_Xius(value) {
        this.coin_xiu.string = value;
    },
    checkClick_Item(text) {
        var self = this;
        if (text == "1K") return 1000;
        else if (text == "5K") return 5000;
        else if (text == "10K") return 10000;
        else if (text == "50K") return 50000;
        else if (text == "100K") return 100000;
        else if (text == "500K") return 500000;
        else if (text == "1M") return 1000000;
        else if (text == "10M") return 10000000;
    },

    _updateAnimationDatCuoc() {
        // var datCuoc = this.datCuoc;
        // if (datCuoc.active && datCuoc.y > -334) {
        //     datCuoc.y = datCuoc.y - 15;
        // }
    },

    click_to_DatCua_Tai() {
        NewAudioManager.playClick();
        if (TaiXiuConstant.LOCK_CHOICE_DOOR == 1) {

            if (this.choiedDoor == -1 || this.choiedDoor == 1) {
                this.anotherNumber.active = false;
                var datCuoc = this.datCuoc;
                datCuoc.active = true;
                // datCuoc.x = 0;
                // datCuoc.y = -200;



                if (TaiXiuConstant.CHOICE_THE_DOOR == 0) {
                    var str = 'Đặt';
                    this.update_Coin_Xius(str);
                    this.money = 0;
                }
                if (this.coin_tai.string == 'Đặt') {
                    var s = '---';
                    this.update_Coin_Tais(s)
                }
                TaiXiuConstant.CHOICE_THE_DOOR = 1;
                this.door = 1;

            }
            else {
                //cc.log("Bạn đã đặt cửa Xỉu, không thể đặt cửa Tài");
            }
        }
        else if (TaiXiuConstant.LOCK_CHOICE_DOOR == 0) {
            //cc.log('Dang trong thoi gian cho van moi, ko duoc dat cua');
        }

    },
    click_to_DatCua_Xiu() {
        NewAudioManager.playClick();
        if (TaiXiuConstant.LOCK_CHOICE_DOOR == 1) {

            if (this.choiedDoor == -1 || this.choiedDoor == 0) {
                this.anotherNumber.active = false;
                var datCuoc = this.datCuoc;
                datCuoc.active = true;
                // datCuoc.x = 0;
                // datCuoc.y = -200;
                if (TaiXiuConstant.CHOICE_THE_DOOR == 1) {
                    var str = 'Đặt';
                    this.update_Coin_Tais(str);
                    this.money = 0;
                }
                if (this.coin_xiu.string == 'Đặt') {
                    var s = '---';
                    this.update_Coin_Xius(s)
                }
                TaiXiuConstant.CHOICE_THE_DOOR = 0;
                this.door = 0;

            }
            else {
                //cc.log("Bạn đã đặt cửa Tài, không thể đặt cửa Xỉu");
            }

        }
        else if (TaiXiuConstant.LOCK_CHOICE_DOOR == 0) {
            //cc.log('Dang trong thoi gian cho van moi, ko duoc dat cua');
        }
    },
    // custom_textForm(str) {
    //     var str = str.replace(/-/g, "");
    //     str = str.replace(/,/g, "");

    //     var text = '';
    //     var j = 0;
    //     for (var i = str.length - 1; i >= 0; i--) {
    //         j++;
    //         text = str[i] + text;
    //         if (j == 3 && i != 0) {
    //             text = "," + text;
    //             j = 0;
    //         }
    //     }
    //     return text;
    // },
    custom_textForm(str) {
        var self = this;
        var text = '';
        var j = 0;

        if (str) {
            var l = str.length;
            for (var i = l - 1; i >= 0; i--) {
                j++;
                text = str[i] + text;
                if (j == 3 && i != 0) {
                    text = "." + text;
                    j = 0;
                }
            }
        }
        return text;
    },


    btnTatTayClick() {
        NewAudioManager.playClick();
        if (TaiXiuConstant.LOCK_CHOICE_DOOR == 1) {
            if (TaiXiuConstant.CHOICE_THE_DOOR != -1) {
                this.money = Number(Linker.userData.userRealMoney);
                if (TaiXiuConstant.CHOICE_THE_DOOR == 0) {
                    var str = "";
                    str = str + this.money;
                    str = this.custom_textForm(str);
                    //cc.log('str', str);
                    this.update_Coin_Xius(str);
                }
                else if (TaiXiuConstant.CHOICE_THE_DOOR == 1) {
                    var str = "";
                    str = str + this.money;
                    str = this.custom_textForm(str);
                    //cc.log('str', str);
                    this.update_Coin_Tais(str);
                }
            }
        }
    },
    btnCuocClick() {
        NewAudioManager.playClick();
        // if(this.isVanMoi){
        if (this.choiedDoor == -1 || this.choiedDoor == TaiXiuConstant.CHOICE_THE_DOOR) {
            if (TaiXiuConstant.LOCK_CHOICE_DOOR == 1) {
                if (this.money != 0) {
                    var message = TaiXiuSend.datcuoc(this.money, this.door);
                    Linker.Socket.send(message);
                }
                else {
                    //cc.log('Chưa chon cua or chon muc tien cuoc');
                }
                if (TaiXiuConstant.CHOICE_THE_DOOR == 0) {
                    this.money = 0;
                    this.coin_xiu.string = '0';
                    this.choiedDoor = 0;
                }
                else if (TaiXiuConstant.CHOICE_THE_DOOR == 1) {
                    this.money = 0;
                    this.coin_tai.string = '0';
                    this.choiedDoor = 1;
                }
            }
            else if (TaiXiuConstant.LOCK_CHOICE_DOOR == 0) {
                //cc.log('Dang trong thoi gian cho van moi, ko duoc dat cua');
            }

        }
        // }   
        else {

        }
    },
    btnHuyBoClick() {
        NewAudioManager.playClick();
        if (TaiXiuConstant.CHOICE_THE_DOOR == 0) {
            this.coin_xiu.string = '---';
            this.money = 0;
        }
        else if (TaiXiuConstant.CHOICE_THE_DOOR == 1) {
            this.coin_tai.string = '---';
            this.money = 0;
        }
        this.datCuoc.active = false;
    },

    btnSoKhacClick() {
        NewAudioManager.playClick();
        this.datCuoc.active = false;
        if (TaiXiuConstant.CHOICE_THE_DOOR == 0) {
            this.coin_xiu.string = '---';
            this.money = 0;
        }
        else if (TaiXiuConstant.CHOICE_THE_DOOR == 1) {
            this.coin_tai.string = '---';
            this.money = 0;
        }
        this.anotherNumber.active = true;

    },

    btnBackToCuoc() {
        NewAudioManager.playClick();
        var numMoney = Number(this.money);
        if (numMoney != 0) {
            if (TaiXiuConstant.CHOICE_THE_DOOR == 0) {
                this.coin_xiu.string = '---';
                this.money = 0;
            }
            else if (TaiXiuConstant.CHOICE_THE_DOOR == 1) {
                this.coin_tai.string = '---';
                this.money = 0;
            }
            return;
        }
        this.anotherNumber.active = false;

        this.datCuoc.active = true;
    },
    btnLightClick() {

    },


    btnHelpClick() {
        NewAudioManager.playClick();
        var datCuoc = this.datCuoc;
        datCuoc.active = false;
        this.anotherNumber.active = false;
        this.showDialogLuatChoi();
    },
    btnCloseLuatChoi() {
        NewAudioManager.playClick();
        var datCuoc = this.datCuoc;
        datCuoc.active = false;
        this.anotherNumber.active = false;
        this.hideDialogLuatChoi();
    },
    showDialogLuatChoi() {
        NewAudioManager.playClick();
        var datCuoc = this.datCuoc;
        datCuoc.active = false;
        this.anotherNumber.active = false;
        if (this.dialogHistory) {
            this.dialogLuatChoi.emit('fade-in');
        }
        // this.dialogLuatChoi.setPosition(this.canvas.convertToNodeSpaceAR(this.canvas.convertToWorldSpace(cc.v2(134, -17))));
    },
    hideDialogLuatChoi() {
        NewAudioManager.playClick();
        if (this.dialogHistory) {
            this.dialogLuatChoi.emit('fade-out');
        }
    },

    //API LICH SU PHIEN
    clickBtnLichSuPhien(event) {
        NewAudioManager.playClick();
        cc.Global.showLoading();
        var datCuoc = this.datCuoc;
        datCuoc.active = false;
        this.anotherNumber.active = false;
        var that = this;
        //cc.log("ID PHIEN: ", event.target.idPhien);
        Api.get(Global.configPurchase.API_URL + "api-tx-phien?phien=" + event.target.idPhien, (data) => {
            cc.director.getScene().getChildByName('Canvas').removeChild(that.blackLoadingScreen);
            cc.Global.hideLoading();
            if (data) {
                //cc.log("API LICH SU PHIEN", data);
                var tempArray = data.array;
                //cc.log("API LICH SU PHIEN", tempArray);

                var dialogHistoryPhien = cc.instantiate(this.prefabDialogHistoryPhien);
                dialogHistoryPhien.phienID = tempArray.id;
                dialogHistoryPhien.setPosition(0, 0);
                dialogHistoryPhien.zIndex = cc.macro.MAX_ZINDEX - 1;
                this.initLichSuPhien(tempArray, dialogHistoryPhien);
                cc.director.getScene().getChildByName('Canvas').addChild(dialogHistoryPhien);
            }
        });
    },
    initLichSuPhien(tempArray, dialog) {
        var info = dialog.getChildByName('contentPhien').getChildByName('info');
        var head = dialog.getChildByName('contentPhien').getChildByName('head');
        var bottom = dialog.getChildByName('contentPhien').getChildByName('bottom');

        //add to info
        var IDPhien = info.getChildByName('IDPhien').getComponent(cc.Label);
        var time = info.getChildByName('Time').getComponent(cc.Label);
        IDPhien.string = 'Phiên ' + '#' + tempArray.id;
        time.string = '(' + tempArray.time + ')';

        //add to head
        var pointTai = head.getChildByName('point_left').getComponent(cc.Label);
        var pointXiu = head.getChildByName('point_right').getComponent(cc.Label);

        var nodeXucxac = head.getChildByName('xucxac');
        nodeXucxac.removeAllChildren();

        var ketqua = tempArray.values;
        ketqua = ketqua.split(',');

        nodeXucxac.addChild(cc.instantiate(this.xucxac[Number(ketqua[0]) - 1]));
        nodeXucxac.addChild(cc.instantiate(this.xucxac[Number(ketqua[1]) - 1]));
        nodeXucxac.addChild(cc.instantiate(this.xucxac[Number(ketqua[2]) - 1]));

        var x = Number(ketqua[0]) + Number(ketqua[1]) + Number(ketqua[2]);
        if (x <= 10) {
            pointXiu.string = x;
            pointTai.string = '';
        }
        else {
            pointXiu.string = '';
            pointTai.string = x;
        }

        //add to bottom
        var tai = bottom.getChildByName('Tai').getComponent(cc.RichText);
        var xiu = bottom.getChildByName('Xiu').getComponent(cc.RichText);
        tai.string = '<color=white>' + tempArray.taihoan + '/' + '</color>' + '<color=yellow>' + tempArray.taidat + '</color>';
        xiu.string = '<color=white>' + tempArray.xiuhoan + '/' + '</color>' + '<color=yellow>' + tempArray.xiudat + '</color>';

        //add to Phien
        var phienTai = dialog.getChildByName('contentPhien').getChildByName('PhienTai');
        var phienXiu = dialog.getChildByName('contentPhien').getChildByName('PhienXiu');
        var scrollViewTai = phienTai.getChildByName('ScrollView');
        var scrollViewXiu = phienXiu.getChildByName('ScrollView');
        var contentTai = scrollViewTai.getChildByName('view').getChildByName('content');
        var contentXiu = scrollViewXiu.getChildByName('view').getChildByName('content');
        contentTai.removeAllChildren();
        contentXiu.removeAllChildren();
        // var logxiu = tempArray.logxius.split('')

        // cc.log('logtais', tempArray.logtais);

        var objXiu = JSON.parse(tempArray.logxius);
        var objTai = JSON.parse(tempArray.logtais);
        var arrLogXius = objXiu.array;
        var arrLogTais = objTai.array;


        // cc.log('logxius 11111', obj.array);
        if (arrLogXius) {
            for (var i = 0; i < arrLogXius.length; i++) {
                var itemPhien = cc.instantiate(this.prefabPhienTX);
                var thoigian = itemPhien.getChildByName('time').getComponent(cc.Label);
                var taikhoan = itemPhien.getChildByName('username').getComponent(cc.Label);
                var hoan = itemPhien.getChildByName('hoan').getComponent(cc.Label);
                var cuoc = itemPhien.getChildByName('cuoc').getComponent(cc.Label);

                thoigian.string = arrLogXius[i].time;
                taikhoan.string = arrLogXius[i].name;
                hoan.string = arrLogXius[i].moneyHoan;
                cuoc.string = arrLogXius[i].money;

                contentXiu.addChild(itemPhien);
            }
        }
        if (arrLogTais) {
            for (var j = 0; j < arrLogTais.length; j++) {
                var itemPhien = cc.instantiate(this.prefabPhienTX);
                var thoigian = itemPhien.getChildByName('time').getComponent(cc.Label);
                var taikhoan = itemPhien.getChildByName('username').getComponent(cc.Label);
                var hoan = itemPhien.getChildByName('hoan').getComponent(cc.Label);
                var cuoc = itemPhien.getChildByName('cuoc').getComponent(cc.Label);

                thoigian.string = arrLogTais[j].time;
                taikhoan.string = arrLogTais[j].name;
                hoan.string = arrLogTais[j].moneyHoan;
                cuoc.string = arrLogTais[j].money;

                contentTai.addChild(itemPhien);
            }
        }

    },
    clickNextToPhien() {
        NewAudioManager.playClick();
       
        var that = this;
        var dialog = cc.director.getScene().getChildByName('Canvas').getChildByName('DialogHistoryPhien');
        if(dialog.phienID >= Number(Linker.TaiXiuController.totalMatch.id)-1 ){
            Linker.showMessage('Chưa có phiên tiếp theo.');
            return;
        }
        if (dialog.phienID) {
            cc.Global.showLoading();
            //get API
            Api.get(Global.configPurchase.API_URL + "api-tx-phien?phien=" + (dialog.phienID + 1), (data) => {
                cc.Global.hideLoading();
                cc.director.getScene().getChildByName('Canvas').removeChild(that.blackLoadingScreen);
                if (data) {
                    //cc.log("API LICH SU PHIEN", data);
                    var tempArray = data.array;
                    //cc.log("API LICH SU PHIEN", tempArray);
                    dialog.phienID = tempArray.id;
                    this.initLichSuPhien(tempArray, dialog);
                }
                else {
                    //cc.log('Phien next to NULL');
                }
            });
        }
    },
    clickBackToPhien() {
        NewAudioManager.playClick();
        
        var that = this;
        var dialog = cc.director.getScene().getChildByName('Canvas').getChildByName('DialogHistoryPhien');
        if (dialog.phienID) {
            cc.Global.showLoading();
            //get API
            Api.get(Global.configPurchase.API_URL + "api-tx-phien?phien=" + (dialog.phienID - 1), (data) => {
                cc.Global.hideLoading();
                cc.director.getScene().getChildByName('Canvas').removeChild(that.blackLoadingScreen);
                if (data) {
                    //cc.log("API LICH SU PHIEN", data);
                    var tempArray = data.array;
                    //cc.log("API LICH SU PHIEN", tempArray);
                    dialog.phienID = tempArray.id;
                    this.initLichSuPhien(tempArray, dialog);
                }
                else {
                    //cc.log('Phien back to NULL');
                }
            });
        }
    },
    callLoadingScreen: function () {
        this.blackLoadingScreen = cc.instantiate(this.prefabLoading);
        // this.blackLoadingScreen.getComponent("kLoadingDialog").show("Đang tải dữ liệu, vui lòng đợi trong giây lát ...");
        this.blackLoadingScreen.zIndex = cc.macro.MAX_ZINDEX;
        this.blackLoadingScreen.setPosition(0, 0);
        cc.director.getScene().getChildByName('Canvas').addChild(this.blackLoadingScreen);
    },
    //API LICH SU DAT CUOC USER
    btnHistoryClick() {
        NewAudioManager.playClick();
        cc.Global.showLoading();
        var that = this;
        var datCuoc = this.datCuoc;
        datCuoc.active = false;
        this.anotherNumber.active = false;
        Api.get(Global.configPurchase.API_URL + "api-tx-my-fire?userId=" + Linker.userData.userId, (data) => {
            cc.Global.hideLoading();
            cc.director.getScene().getChildByName('Canvas').removeChild(that.blackLoadingScreen);
            if (data) {
                //cc.log("API LICH SU USER", data);
                var tempArray = data.array;
                var dialogHistory = cc.instantiate(that.prefabDialogHistory);
                dialogHistory.setPosition(0, 0);
                dialogHistory.zIndex = cc.macro.MAX_ZINDEX - 1;
                that.initLichSuDatCuoc(tempArray, dialogHistory);
                cc.director.getScene().getChildByName('Canvas').addChild(dialogHistory);
            }
        });
    },
    initLichSuDatCuoc(tempArray, dialog) {
        var historyScrollView = dialog.getChildByName('HistoryView');
        var content = historyScrollView.getChildByName('mask').getChildByName('content');
        for (var i = 0; i < tempArray.length; i++) {
            var itemHistory = cc.instantiate(this.prefabHistory);
            content.addChild(itemHistory);
            var IDPhien = itemHistory.getChildByName('IDPhien').getComponent(cc.Label);
            var day = itemHistory.getChildByName('day').getComponent(cc.Label);
            var time = itemHistory.getChildByName('day').getChildByName('time').getComponent(cc.Label);
            var mota = itemHistory.getChildByName('mota').getComponent(cc.Label);
            var money = itemHistory.getChildByName('money').getComponent(cc.Label);
            IDPhien.string = tempArray[i].phien;
            var thoigian = tempArray[i].time.split(' ');
            day.string = thoigian[0];
            time.string = thoigian[1];
            mota.string = tempArray[i].description;
            money.string = tempArray[i].money;
        }

        var historyScrollViews = dialog.getChildByName('HistoryView').getComponent(cc.ScrollView);
        historyScrollViews.scrollToTop(0.1);
    },

    btnSoiCauClick() {
        NewAudioManager.playClick();
        cc.Global.showLoading();
        var that = this;
        var datCuoc = this.datCuoc;
        datCuoc.active = false;
        this.anotherNumber.active = false;
        Api.get(Global.configPurchase.API_URL + "api-soicau", (data) => {
            cc.Global.hideLoading();
            if (data) {
                Linker.dataSoiCau = data;
                //cc.log("*** API SOI CAU", data);
                var tempArray = data.array;
                var _Array = tempArray[0];
                var temp_array1 = _Array[0];
                var temp_array2 = tempArray[1];

                var dialogSoiCau = cc.instantiate(this.prefabDialogSoiCau);
                dialogSoiCau.setPosition(0, 0);
                dialogSoiCau.zIndex = cc.macro.MAX_ZINDEX - 1;
                //kyun: modified:  
                //Linker.DialogSoiCau.initListSoiCau(tempArray, temp_array1, temp_array2);
                //this.initListSoiCau(tempArray, temp_array1, temp_array2, dialogSoiCau);
                //kyun: modified: EOF
                cc.director.getScene().getChildByName('Canvas').removeChild(that.blackLoadingScreen);
                cc.director.getScene().getChildByName('Canvas').addChild(dialogSoiCau);
            }
        });
    },

    initListSoiCau(tempArray, Array1, Array2, dialog) {
        //kyun: modified: 
        var content1 = dialog.getChildByName('part1').getChildByName('SoiCau1').getChildByName('content1');
        var content2 = dialog.getChildByName('part2').getChildByName('SoiCau2').getChildByName('content2');
        //kyun: modified: EOF
        var Array1 = tempArray[0];

        if (Array1) {

            // var i = 0;
            for (var j = 0; j < Array1.length; j++) {
                // cc.log('Array1111111111111111111111111111111',j, Array1[j].length);

                if (Array.isArray(Array1[j])) {
                    for (var k = 0; k < Array1[j].length; k++) {
                        if (k < 6) {
                            //cc.log(Array1[j][k]);
                            var itemSoicau = null;
                            if (Array1[j][k].total <= 10) {
                                itemSoicau = cc.instantiate(this.prefabSoicau[0]);
                            }
                            else {
                                itemSoicau = cc.instantiate(this.prefabSoicau[1]);
                            }
                            content1.addChild(itemSoicau);
                            var point = itemSoicau.getChildByName('point').getComponent(cc.Label);
                            point.string = Array1[j][k].total;
                            itemSoicau.setPosition(j * 45, k * -37);
                        }

                    }
                }
                else {
                    // cc.log("Object: ", Array1[j]);
                    var objArray = Object.entries(Array1[j]);
                    //cc.log(Object.entries(Array1[j]));
                    for (var k = 0; k < objArray.length; k++) {
                        if (k < 6) {
                            var itemSoicau = null;
                            if (objArray[k][1].total <= 10) {
                                itemSoicau = cc.instantiate(this.prefabSoicau[0]);
                            }
                            else {
                                itemSoicau = cc.instantiate(this.prefabSoicau[1]);
                            }
                            content1.addChild(itemSoicau);
                            var point = itemSoicau.getChildByName('point').getComponent(cc.Label);
                            point.string = objArray[k][1].total;
                            itemSoicau.setPosition(j * 45, k * -37);
                        }

                    }
                }


            }


            // while(i>=0){
            //     if(Array1[i]){
            //         var itemSoicau = null;
            //         if(Array1[i].total <= 10){
            //             itemSoicau = cc.instantiate(this.prefabSoicau[0]);
            //         }
            //         else {
            //             itemSoicau = cc.instantiate(this.prefabSoicau[1]);
            //         }
            //         content1.addChild(itemSoicau);
            //         var point = itemSoicau.getChildByName('point').getComponent(cc.Label);
            //         point.string = Array1[i].result;
            //         i ++;
            //     }
            //     else if(i==1) i++;
            //     else{
            //         break;
            //     }
            // }
        } else {
            //cc.log('tempArray1 null');
        }

        if (Array2) {
            // var content2 = this.gamemain.getChildByName('DialogSoiCau').getChildByName('SoiCau2').getChildByName('content2');
            for (var i = 0; i < Array2.length; i++) {
                var itemSoicau = null;
                if (Array2[i].result == 0) {
                    itemSoicau = cc.instantiate(this.prefabSoicau[0]);
                }
                else {
                    itemSoicau = cc.instantiate(this.prefabSoicau[1]);
                }
                content2.addChild(itemSoicau);
            }
        } else {
            //cc.log('tempArray2 null');
        }

        if (tempArray) {
            //cc.log('tttttttttttttttttttttttttt',tempArray[2], tempArray[3], tempArray[4],tempArray[5]);
            var tai_SoiCau = dialog.getChildByName('SoiCau1').getChildByName('Tai').getComponent(cc.Label);
            var xiu_SoiCau = dialog.getChildByName('SoiCau1').getChildByName('Xiu').getComponent(cc.Label);
            tai_SoiCau.string = tempArray[3];
            xiu_SoiCau.string = tempArray[2];

            var tai_Phien = dialog.getChildByName('SoiCau2').getChildByName('Tai').getComponent(cc.Label);;
            var xiu_Phien = dialog.getChildByName('SoiCau2').getChildByName('Xiu').getComponent(cc.Label);
            tai_Phien.string = tempArray[5];
            xiu_Phien.string = tempArray[4];
        }
    },

    // API TOP CAO THU (RANK)
    btnRankClick() {
        NewAudioManager.playClick();
        cc.Global.showLoading();
        var that = this;
        var datCuoc = this.datCuoc;
        datCuoc.active = false;
        this.anotherNumber.active = false;
        cc.log("Global.configPurchase", Global.configPurchase);
        Api.get(Global.configPurchase.API_URL + "api-tx-get-top", (data) => {
            cc.Global.hideLoading();
            if (data) {
                //cc.log("API GET TOP TAI XIU", data);
                var tempArray = data.array;
                // cc.log('RANK: ', tempArray);

                var dialogRank = cc.instantiate(this.prefabDialogRank);
                dialogRank.setPosition(0, 0);
                dialogRank.zIndex = cc.macro.MAX_ZINDEX - 1;
                this.initRankCaoThu(tempArray, dialogRank);
                cc.director.getScene().getChildByName('Canvas').removeChild(that.blackLoadingScreen);
                cc.director.getScene().getChildByName('Canvas').addChild(dialogRank);
            }
        });
    },
    initRankCaoThu(tempArray, dialog) {
        var rankScrollView = dialog.getChildByName('RankView');
        var content = rankScrollView.getChildByName('mask').getChildByName('content');
        for (var i = 0; i < tempArray.length; i++) {
            var itemRank = null;
            if (i <= 2) {
                itemRank = cc.instantiate(this.prefabRank[i]);
            }
            else {
                itemRank = cc.instantiate(this.prefabRank[3]);
                var sprite = itemRank.getChildByName('rank');
                var rankLabel = sprite.getChildByName('rankLabel').getComponent(cc.Label);
                rankLabel.string = i + 1;
            }
            content.addChild(itemRank);
            var sprite = itemRank.getChildByName('rank');
            var userName = itemRank.getChildByName('userName').getComponent(cc.Label);
            var userMoney = itemRank.getChildByName('userMoney').getComponent(cc.Label);
            userName.string = tempArray[i].viewname;
            userMoney.string = tempArray[i].moneytotal;
        }
        var rankScrollViews = dialog.getChildByName('RankView').getComponent(cc.ScrollView);
        rankScrollViews.scrollToTop(0.1);
    },
    clickButtonDialog(event) {
        NewAudioManager.playClick();
        var datCuoc = this.datCuoc;
        datCuoc.active = false;
        this.anotherNumber.active = false;
        //cc.log('click close dialog', event.target.name);
        var dialog = null;
        if (event.target.name == 'btnCloseRank') {
            dialog = cc.director.getScene().getChildByName('Canvas').getChildByName('DialogRank');
        }
        else if (event.target.name == 'btnCloseHistory') {
            dialog = cc.director.getScene().getChildByName('Canvas').getChildByName('DialogHistory');
        }
        else if (event.target.name == 'btnCloseSoiCau') {
            dialog = cc.director.getScene().getChildByName('Canvas').getChildByName('DialogSoiCau');
        }
        else if (event.target.name == 'btnCloseHistoryPhien') {
            dialog = cc.director.getScene().getChildByName('Canvas').getChildByName('DialogHistoryPhien');
        }
        if (dialog != null) {
            dialog.destroy();
        }

        if (event.target.name == 'btnNext') {
            this.clickNextToPhien();
        }
        if (event.target.name == 'btnBack') {
            this.clickBackToPhien();
        }

    },

    btnWindowChatClick() {
        NewAudioManager.playClick();
        // var btn = this.gamemain.getChildByName('menu-button').getChildByName('btnWindowChat');
        // btn.active = false;
        if (!this.windowChat.active) {
            this.windowChat.active = true;
        } else {
            this.windowChat.active = false;
        }
    },
    btnCloseChatClick() {
        NewAudioManager.playClick();
        // var btn = this.gamemain.getChildByName('menu-button').getChildByName('btnWindowChat');
        // btn.active = true;
        this.windowChat.active = false;
    },

    NanToggle(toggle) {
        NewAudioManager.playClick();
        if (toggle.isChecked) {
            TaiXiuConstant.ISNAN = 1;
        }
        else {
            TaiXiuConstant.ISNAN = 0;
        }
    },

    //close game
    btnCloseClick() {
        NewAudioManager.playClick();
        // cc.director.loadScene('HallScene');
        Linker.isOpenTaiXiu = false;
        if (TaiXiuConstant.CHOICE_THE_DOOR == 0) {
            this.coin_xiu.string = '---';
            this.money = 0;
        }
        else if (TaiXiuConstant.CHOICE_THE_DOOR == 1) {
            this.coin_tai.string = '---';
            this.money = 0;
        }
        var datCuoc = this.datCuoc;
        datCuoc.active = false;
        this.anotherNumber.active = false;
        this.node.active = false;
    },

    btnSendMessageClick() {
        NewAudioManager.playClick();
        var editBox = this.windowChat.getChildByName('text').getComponent(cc.EditBox);
        var mess = editBox.string;

        if (this.timeCount >= 300) {
            this.timeCount = 0;
            if (mess.length > 1) {
                var message = TaiXiuSend.chat(mess);
                Linker.Socket.send(message);
                this.windowChat.getChildByName('text').getComponent(cc.EditBox).string = "";

            } else {
                Linker.showMessage('Không có nội dung chat');
            }
        } else {
            Linker.showMessage('Bạn chat quá nhanh.Vui lòng thử lại')
        }

    },
    btnShowSuKienTaiXiu() {
        var dialog = cc.find("Canvas/sukienDialogV2");
        if (!dialog) {
            var sk = cc.instantiate(this.sukienDialogV2Prefab);
            sk.position = cc.v2(0, 0);
            sk.active = true;
            sk.zIndex = cc.macro.MAX_ZINDEX - 1;
            cc.find("Canvas").addChild(sk);
            var sks = sk.getComponent("sukienDialogV2");
            sks.configPopup({
                data: {
                    currentGameId: 90,
                    currentTabId: 0
                }
            });
            sks.launchSukien();
            this.btnCloseClick();
        } else if (dialog && dialog.active == false) {
            dialog.active = true;
            var sks = dialog.getComponent("sukienDialogV2");
            sks.configPopup({
                data: {
                    currentGameId: 90,
                    currentTabId: 0
                }
            });
            sks.launchSukien();
            this.btnCloseClick();
        } else if (dialog && dialog.active == true) {
            dialog.active = false;
        }

    },
    addSocketEvent() {
        Linker.Event.addEventListener(SocketConstant.GAME.TAI_XIU.JOIN_TAI_XIU, this.onJoinTaiXiu, this);
        Linker.Event.addEventListener(SocketConstant.GAME.TAI_XIU.UPDATE_TAI_XIU, this.onUpdateTaiXiu, this);
        Linker.Event.addEventListener(SocketConstant.GAME.TAI_XIU.BET_TAI_XIU, this.onBetTaiXiu, this);
        Linker.Event.addEventListener(SocketConstant.GAME.TAI_XIU.PHIEN_TX_STATE, this.onPhienTXState, this);
        Linker.Event.addEventListener(SocketConstant.GAME.TAI_XIU.CHAT_TAI_XIU, this.onChatTaiXiu, this);
    },

    //update timer
    _updateTimer() {

        this.nowTime = this.lastTime - Date.now();
        if (this.nowTime > 0) {
            Linker.TaiXiuView.update_Time(Math.round(this.nowTime / 1000));
        } else {
            //this.allowBetting = false;
        }

    },

    onJoinTaiXiu(message) {
        //cc.log("JOIN_TAI_XIU", message);

    },
    hiddenTimer: function () {
        if (this.countDownBG != undefined) {
            this.countDownBG.node.active = false;
            this.bgTimeResetRound.active =false;
        }
        clearInterval(this.readyInterval);

    },

    runTimerCount: function (time) {
        clearInterval(this.readyInterval);
        if (time == 0) {
            this.hiddenTimer();
            return;
        }

        this.timeReady = time;
        this.countDownBG.node.active = true;
        this.bgTimeResetRound.active =true;
        this.labelCountDown.string = this.timeReady.toString();

        this.readyInterval = setInterval(this.onTimerCount.bind(this), 1000);
    },
    onTimerCount: function (dt) {
        if (this.timeReady == 0) {
            this.hiddenTimer();
        }
        else {
            this.timeReady--;
            if (this.timeReady !== null && this.labelCountDown !== null) {
                this.labelCountDown.string = this.timeReady + "";
            }

        }
    },
    onUpdateTaiXiu(message) {
        if (Linker.TaiXiuController && Linker.TaiXiuController.dang_can_cua && Linker.TaiXiuController.dang_can_cua.isValid) {
            Linker.TaiXiuController.dang_can_cua.active = false;
            Linker.TaiXiuController.lac.active = false;
            Linker.TaiXiuController.xuc_xac.active = false;
            if (message.state) {
                this.lastTime = Number(message.timeOut) * 1000 + Date.now();
                if (message.timeOut == 0) {
                    Linker.TaiXiuView.hide_TimeLabel();
                }

                if (message.state == 2 || message.state == 3 || message.state == 4) {
                    // Linker.TaiXiuController.timeLabel.active = false;
                    Linker.TaiXiuController.dang_can_cua.active = false;
                    Linker.TaiXiuController.lac.active = false;
                    cc.log("message.ketqua:",message.ketqua);
                    if (message.ketqua) {
                        var temp = message.ketqua.split('#');
                        var kq1 = temp[0];
                        var kq2 = temp[1];
                        var kq3 = temp[2];
                        Linker.TaiXiuController.xuc_xac.active = true;
                        Linker.TaiXiuController.init_Xucxac(kq1, kq2, kq3);
                    }
                    Linker.TaiXiuController.timeLabel.active = false;
                    if (message.timeOut > 0) {
                        Linker.TaiXiuController.runTimerCount(message.timeOut);
                    } 
                }
                if (message.state == 5) {
                    //cc.log('STATE1111111111111111111111111111111');
                    TaiXiuConstant.LOCK_CHOICE_DOOR = 0;
                    Linker.TaiXiuController.gameState = TaiXiuConstant.GAME_STATE.GAME_CHECK;
                    Linker.TaiXiuController.timeLabel.active = false;
                    Linker.TaiXiuController.dang_can_cua.active = true;
                    Linker.TaiXiuController.lac.active = false;
                    Linker.TaiXiuController.xuc_xac.active = false;
                }

                if (message.state == 1) {
                    //cc.log('STATE1111111111111111111111111111111');
                    Linker.TaiXiuController.isStartGame = true;

                    Linker.TaiXiuController.gameState = TaiXiuConstant.GAME_STATE.GAME_NULL;
                    TaiXiuConstant.LOCK_CHOICE_DOOR = 1;
                    Linker.TaiXiuController.timeLabel.active = true;
                    Linker.TaiXiuController.dang_can_cua.active = false;
                    Linker.TaiXiuController.lac.active = false;
                    Linker.TaiXiuController.xuc_xac.active = false;
                }
                if (message.state == 1 && message.timeOut == 0) {
                    TaiXiuConstant.LOCK_CHOICE_DOOR = 0;
                    Linker.TaiXiuController.timeLabel.active = false;
                    Linker.TaiXiuController.xuc_xac.active = false;
                    Linker.TaiXiuController.gameState = TaiXiuConstant.GAME_STATE.GAME_CHECK;
                }

            }
            if (message.listPhienTX && Linker.TaiXiuView) {
                //kyun:
                Linker.TaiXiuView.updateTotalMatch(message.totalMatch);
                var arr_temp = message.listPhienTX.split('#');
                Linker.listPhienTX = arr_temp;
                if (Linker.TaiXiuController.list_phien_TX) {
                    Linker.TaiXiuController.list_phien_TX.removeAllChildren();
                }
                //nvm length phien tra ve phai la lon hon hoac bang 20
                for (var i = 0; i < Linker.listPhienTX.length; i++) {
                    var arr = arr_temp[i].split(':');
                    Linker.TaiXiuController.init_list_phienTX(arr[0], arr[1]);
                }
                
                Linker.TaiXiuController.startActionsListPhien();
                Linker.loadedTaiXiu = true;

            }

            if (message.timeOut) {
                // Linker.TaiXiuView.update_Time(message.timeOut);
                // Linker.TaiXiuController.timeRemain = message.timeOut;
                if (message.timeOut == 1 && message.state == 1) {
                    // Linker.TaiXiuView.hide_TimeLabel();
                    // Linker.TaiXiuView.lac_Xuc_Xac();
                    TaiXiuConstant.LOCK_CHOICE_DOOR = 0;

                }
                if (Linker.TaiXiuView && Linker.TaiXiuView.isValid) {
                    if (message.timeOut > 1 && message.timeOut <= 60) {
                        // Linker.TaiXiuView.show_TimeLabel();
                        // Linker.TaiXiuView.remove_XucXac();
                        Linker.TaiXiuView.hide_Effect_Tai(Linker.TaiXiuController.effect1_tai, Linker.TaiXiuController.effect2_tai);
                        Linker.TaiXiuView.hide_Effect_Xiu(Linker.TaiXiuController.effect1_xiu, Linker.TaiXiuController.effect2_xiu);
                        Linker.TaiXiuView.unsetScale_Effect(Linker.TaiXiuController.text_tai);
                        Linker.TaiXiuView.unsetScale_Effect(Linker.TaiXiuController.text_xiu);

                        // Linker.TaiXiuController.gameState = TaiXiuConstant.GAME_STATE.GAME_NULL;
                        // Linker.TaiXiuView.pause_Action_DangCanCua();
                    }
                    if (message.timeOut > 10 && message.timeOut < 60) {
                        Linker.TaiXiuView.hide_Fire_Rotate();
                        Linker.TaiXiuView.rotate_Effect(Linker.TaiXiuController.fire, 2, 360);
                        Linker.TaiXiuView.rotate_Effect(Linker.TaiXiuController.light_effect, 2, -360);
                    }
                    else if (message.timeOut >= 5 && message.timeOut <= 10) {
                        Linker.TaiXiuView.show_Fire_Rotate();
                        Linker.TaiXiuView.rotate_Effect(Linker.TaiXiuController.fire, 2, 360);
                    }
                    else if (message.timeOut < 5) {

                        Linker.TaiXiuView.rotate_Effect(Linker.TaiXiuController.fire, 0.5, 360);
                        Linker.TaiXiuView.rotate_Effect(Linker.TaiXiuController.light_effect, 0.5, -360);
                    }
                }
            }
            else {
                //cc.log('null')
            }

            if (message) {
                if (Linker.TaiXiuView && Linker.TaiXiuView.isValid) {
                    if (message.personTai) {
                        Linker.TaiXiuView.update_Person_Tai(message.personTai);
                    }
                    if (message.personXiu) {
                        Linker.TaiXiuView.update_Person_Xiu(message.personXiu);
                    }
                    if (message.sumCoinTai) {
                        message.sumCoinTai = Linker.TaiXiuController.custom_textForm(message.sumCoinTai);
                        Linker.TaiXiuView.update_Sum_Coin_Tai(message.sumCoinTai);
                    }
                    if (message.sumCoinXiu) {
                        message.sumCoinXiu = Linker.TaiXiuController.custom_textForm(message.sumCoinXiu);
                        Linker.TaiXiuView.update_Sum_Coin_Xiu(message.sumCoinXiu);
                    }
                }
                cc.log("message.join",message.join);
                if(message.join){
                    Linker.TaiXiuController.seqWin.string = message.seqWin;
                    Linker.TaiXiuController.seqLose.string = message.seqLose;
                }

            }
        }
    },
    onBetTaiXiu(message) {
        //cc.log("BET_TAI_XIU", message);
        if (message && message.status == 1) {
            cc.log("ON_BET", message);
            if (message.mess) {
                // var itemAlert = cc.instantiate(Linker.TaiXiuController.prefabAlert);
                // Linker.TaiXiuController.alert.addChild(itemAlert);
                // itemAlert.getComponent(cc.Label).string = message.mess;
                // TaiXiuConstant.ALERT = 1;
                Linker.showMessage(message.mess);
                Linker.userData.userRealMoney = Number(message.userMoney);

                this.updateMoneyGame();
                console.log("message.myTotalTai:", message.myTotalTai);
                // message.myTotalTai = Linker.TaiXiuController.custom_textForm(message.totalTai);
                Linker.TaiXiuView.update_My_Coin_Tai(message.myTotalTai);
                // message.myTotalXiu = Linker.TaiXiuController.custom_textForm(message.totalXiu);

                Linker.TaiXiuView.update_My_Coin_Xiu(message.myTotalXiu);

                if (Number(message.myTotalXiu) == 0) {
                    Linker.TaiXiuController.bgXiu.active = true;
                    Linker.TaiXiuController.bgTai.active = false;
                } else {
                    Linker.TaiXiuController.bgXiu.active = false;
                    Linker.TaiXiuController.bgTai.active = true;
                }

            }
        } else {
            // var itemAlert = cc.instantiate(Linker.TaiXiuController.prefabAlert);
            // Linker.TaiXiuController.alert.addChild(itemAlert);
            // itemAlert.getComponent(cc.Label).string = message.mess;
            // TaiXiuConstant.ALERT = 1;
            Linker.showMessage(message.mess);
            if (this.my_coin_tai.string == '...' && this.my_coin_xiu.string == '...') {
                this.choiedDoor = -1;
            }  
        }
    },
    onPhienTXState(message) {
        //cc.log("*** PHIEN_TX_STATE", message);  
        if (!Linker.TaiXiuController) {
            return;
        }
        Linker.TaiXiuController.dang_can_cua.active = false;
        if (message) {
            if (message.kq1 && message.kq2 && message.kq3) {
                Linker.TaiXiuController.init_Xucxac(message.kq1, message.kq2, message.kq3);
                // Linker.TaiXiuController.xuc_xac.active = true;
            }
            if (message.phienTXstate) {
                if (message.phienTXstate == 5) {
                    Linker.TaiXiuController.isStartGame = false;
                    // Linker.TaiXiuView.pause_lac_Xuc_Xac();
                    Linker.TaiXiuController.gameState = TaiXiuConstant.GAME_STATE.GAME_CHECK;
                    Linker.TaiXiuView.hide_TimeLabel();

                    //can cua 2 ben bang nhau tam thoi
                    var maxTaiXiuValue = message.totalTai;
                    if(message.totalXiu > maxTaiXiuValue){
                        maxTaiXiuValue = message.totalXiu;
                    }
                    Linker.TaiXiuController.sum_coin_tai.string = Linker.TaiXiuController.custom_textForm(maxTaiXiuValue);
                    Linker.TaiXiuController.sum_coin_xiu.string = Linker.TaiXiuController.custom_textForm(maxTaiXiuValue);

                    // var do_xuc_xac = function(){
                    //     // Linker.TaiXiuController.init_Xucxac(message.kq1, message.kq2, message.kq3);
                    //     Linker.TaiXiuController.xuc_xac.active = true;
                    //     Linker.TaiXiuController.gameState = TaiXiuConstant.GAME_STATE.GAME_NULL;
                    //     Linker.TaiXiuView.pause_Action_DangCanCua();
                    //     Linker.TaiXiuView.hide_Fire_Rotate();
                    //     Linker.TaiXiuView.rotate_Effect(Linker.TaiXiuController.light_effect, 2, -360);
                    //     Linker.TaiXiuController.gameState = Linker.TaiXiuController.checkGame_Tai_Xiu(message.kq1, message.kq2, message.kq3);

                    // if(Linker.TaiXiuController.gameState == TaiXiuConstant.GAME_STATE.GAME_TAI){
                    //     TaiXiuConstant.isGame = 1;
                    //     Linker.TaiXiuView.show_Effect_Tai(Linker.TaiXiuController.effect1_tai, Linker.TaiXiuController.effect2_tai);
                    //     Linker.TaiXiuView.rotate_Effect(Linker.TaiXiuController.effect1_tai, 5, -360);
                    //     Linker.TaiXiuView.rotate_Effect(Linker.TaiXiuController.effect2_tai, 5, 360);
                    //     Linker.TaiXiuView.setScale_Effect(Linker.TaiXiuController.text_tai);
                    //     Linker.TaiXiuController.valueTai.getComponent(cc.Label).string = Linker.TaiXiuController.totalValue;
                    //     Linker.TaiXiuController.valueTai.active = true;
                    //     Linker.TaiXiuController.valueXiu.active = false;
                    // }
                    // else if(Linker.TaiXiuController.gameState == TaiXiuConstant.GAME_STATE.GAME_XIU){
                    //     TaiXiuConstant.isGame = 0;
                    //     Linker.TaiXiuView.show_Effect_Tai(Linker.TaiXiuController.effect1_xiu, Linker.TaiXiuController.effect2_xiu);
                    //     Linker.TaiXiuView.rotate_Effect(Linker.TaiXiuController.effect1_xiu, 5, -360);
                    //     Linker.TaiXiuView.rotate_Effect(Linker.TaiXiuController.effect2_xiu, 5, 360);
                    //     Linker.TaiXiuView.setScale_Effect(Linker.TaiXiuController.text_xiu);
                    //     Linker.TaiXiuController.valueXiu.getComponent(cc.Label).string = Linker.TaiXiuController.totalValue;
                    //     Linker.TaiXiuController.valueTai.active = false;
                    //     Linker.TaiXiuController.valueXiu.active = true;
                    // }

                    // var phien_id =  Linker.TaiXiuController.totalMatch.id;
                    // Linker.TaiXiuController.updateListPhienTX(Number(phien_id));
                    // }
                    // var reset_text = function(){
                    //     Linker.TaiXiuView.resetTextForm();
                    // }
                    // Linker.TaiXiuController.gamemain.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(do_xuc_xac), cc.delayTime(8), cc.callFunc(reset_text)));
                }
                if (message.phienTXstate == 2) {
                    Linker.TaiXiuController.gameState = TaiXiuConstant.GAME_STATE.GAME_NULL;
                    Linker.TaiXiuController.bgXiu.active = false;
                    Linker.TaiXiuController.bgTai.active = false;
                    Linker.TaiXiuView.pause_Action_DangCanCua();
                    Linker.TaiXiuController.runTimerCount(15);
                    var lac_xuc_xac = function () {
                        if(Linker.TaiXiuController && Linker.TaiXiuView){
                            Linker.TaiXiuView.lac_Xuc_Xac();
                        }else{
                            console.log("Can't run lac xuc xac effect ...");
                        }
                    }
                    var tra_kq = function () {
                        if(Linker.TaiXiuController && Linker.TaiXiuView){
                            Linker.TaiXiuController.xuc_xac.active = true;
                            Linker.TaiXiuView.pause_lac_Xuc_Xac();
                            Linker.TaiXiuView.hide_Fire_Rotate();
                        }else{
                            console.log("Can't run tra ket qua effect ...");
                        }
                    }
                    var nan = function () {
                        if(Linker.TaiXiuController && Linker.TaiXiuView){
                            if (TaiXiuConstant.ISNAN == 1) {
                                Linker.TaiXiuView.runNanXucXac();
                            }
                            else {
                                Linker.TaiXiuController.gameState = Linker.TaiXiuController.checkGame_Tai_Xiu(message.kq1, message.kq2, message.kq3);
                                Linker.TaiXiuController.checkRunEffectGame();
                                Linker.TaiXiuView.pauseNanXucXac();
                                Linker.TaiXiuController.add_list_phienTX(Linker.TaiXiuController.totalValue, Linker.TaiXiuController.totalMatch.id);
                            }
                        }else{
                            console.log("Can't run nan effect ...");
                        }
                    }
                    var hide_nan = function () {
                        if(Linker.TaiXiuController && Linker.TaiXiuController.isValid == true){
                            Linker.TaiXiuController.gameState = Linker.TaiXiuController.checkGame_Tai_Xiu(message.kq1, message.kq2, message.kq3);
                            Linker.TaiXiuView.pauseNanXucXac();
                            Linker.TaiXiuController.checkRunEffectGame();
                            if (TaiXiuConstant.ISNAN == 1) {
                                Linker.TaiXiuController.add_list_phienTX(Linker.TaiXiuController.totalValue, Linker.TaiXiuController.totalMatch.id);
                            }
    
                            var phien_id = Linker.TaiXiuController.totalMatch.id;
                            if (Linker.addLastPhien = 0) {
                                Linker.TaiXiuController.updateListPhienTX(Number(phien_id));
                                cc.log('PhienTaiXiu s2');
                                Linker.addLastPhien = 1;
                            }
                        }else{
                            console.log("Can't hide nan effect ...");
                        }
                    }
                    var seq = cc.sequence(cc.callFunc(lac_xuc_xac), cc.delayTime(1.2), cc.callFunc(nan), cc.callFunc(tra_kq), cc.delayTime(5), cc.callFunc(hide_nan));
                    Linker.TaiXiuController.circle.runAction(seq);
                } else if (message.phienTXstate == 3) {
                    Linker.TaiXiuController.seqWin.string = message.seqWin;
                    Linker.TaiXiuController.seqLose.string = message.seqLose;
                }
            }

            if (message.phienTXstate) {
                if (Number(message.phienTXstate) != 1) {
                    TaiXiuConstant.LOCK_CHOICE_DOOR = 0;
                }
                else if (Number(message.phienTXstate) == 1) {
                    TaiXiuConstant.LOCK_CHOICE_DOOR = 1;
                }
            }

            if (message.totalMatch && message.phienTXstate == 1) {
                // Linker.TaiXiuController.updateListPhienTX(Number(message.totalMatch)-1);
                Linker.TaiXiuView.resetTextForm();
                Linker.TaiXiuView.updateTotalMatch(message.totalMatch);
                Linker.TaiXiuController.gameState == TaiXiuConstant.GAME_STATE.GAME_CHECK;
                Linker.TaiXiuView.pause_Action_DangCanCua();
                Linker.TaiXiuController.dang_can_cua.active = false;
                Linker.TaiXiuView.update_Time(60);
                Linker.TaiXiuView.resetCoinXiu();
                Linker.TaiXiuView.resetCoinTai();
                Linker.TaiXiuView.show_TimeLabel();
                Linker.TaiXiuView.remove_XucXac();
                TaiXiuConstant.CHOICE_THE_DOOR = -1;
                TaiXiuConstant.LOCK_CHOICE_DOOR = 1;
                Linker.TaiXiuController.door = -1;
                Linker.TaiXiuController.money = 0;
                Linker.TaiXiuController.valueTai.active = false;
                Linker.TaiXiuController.valueXiu.active = false;
                Linker.TaiXiuController.valueTai.getComponent(cc.Label).string = "";
                Linker.TaiXiuController.valueXiu.getComponent(cc.Label).string = "";

                Linker.TaiXiuController.choiedDoor = -1;
                Linker.addLastPhien = 0;
            }

            if (message.money) {
                if (Number(message.money) > 0) {
                    Linker.userData.userRealMoney = message.money;
                    this.updateMoneyGame();
                }
            }
        }

    },
    onChatTaiXiu(message) {
        cc.log("CHAT_TAI_XIU", message);
        if (message.listChat && Linker.TaiXiuController.count == 0) {
            Linker.TaiXiuController.count++;
            Linker.CHAT_MESSAGE.push(...message.listChat);
            //cc.log("Linker.CHAT_MESSAGE",Linker.CHAT_MESSAGE);
            Linker.TaiXiuController.content.removeAllChildren();
            for (var i = 0; i < message.listChat.length; i++) {
                var userChat = message.listChat[i].username;
                var messChat = message.listChat[i].messchat;
                var itemChat = cc.instantiate(Linker.TaiXiuController.prefabChat);
                itemChat.getComponent(cc.Label).string = userChat + ": " + messChat;
                itemChat.getChildByName('userchat').getComponent(cc.Label).string = userChat + ': ';
                Linker.TaiXiuController.content.addChild(itemChat);
                
                setTimeout(() => {
                    if (Linker.TaiXiuController.scrollView) {
                        Linker.TaiXiuController.scrollView.scrollToBottom(0.1);
                    }

                }, 100);

            }
        }
        else if (message && !this.isDuplicateChat(message)) {
            Linker.CHAT_MESSAGE.push(message);
            var itemChat = cc.instantiate(Linker.TaiXiuController.prefabChat);
            // itemChat.getChildByName('textchat').getComponent(cc.Label).string = message.userName + ": " + message.mess;
            if (message.mess) {
                itemChat.getComponent(cc.Label).string = message.userName + ": " + Utils.Decoder.decode(message.mess);
                itemChat.getChildByName('userchat').getComponent(cc.Label).string = message.userName + ': ';
                Linker.TaiXiuController.content.addChild(itemChat);
                
            }
            if (Linker.ChatDialog) {
                Linker.ChatDialog.onChatTaiXiu(message);
            }
            setTimeout(() => {
                if (Linker.TaiXiuController.scrollView) {
                    Linker.TaiXiuController.scrollView.scrollToBottom(0.1);
                }
            }, 100);
        }
    },
    isDuplicateChat: function (message) {
        var linkerMess = Linker.CHAT_MESSAGE;
        for (var i = 0; i < linkerMess.length; i++) {
            var mess = message.mess;
            var messageId = message.messageId;
            var status = message.status;
            var userName = message.userName;
            if (linkerMess[i].mess == mess &&
                linkerMess[i].messageId == messageId &&
                linkerMess[i].status == status &&
                linkerMess[i].userName == userName) {
                return true;
            }
        }
        return false;
    },
    checkRunEffectGame() {
        if (Linker.TaiXiuController.gameState == TaiXiuConstant.GAME_STATE.GAME_TAI) {
            TaiXiuConstant.isGame = 1;
            Linker.TaiXiuView.show_Effect_Tai(Linker.TaiXiuController.effect1_tai, Linker.TaiXiuController.effect2_tai);
            Linker.TaiXiuView.rotate_Effect(Linker.TaiXiuController.effect1_tai, 5, -360);
            Linker.TaiXiuView.rotate_Effect(Linker.TaiXiuController.effect2_tai, 5, 360);
            Linker.TaiXiuView.setScale_Effect(Linker.TaiXiuController.text_tai);
            Linker.TaiXiuController.valueTai.getComponent(cc.Label).string = this.totalValue;
            Linker.TaiXiuController.valueTai.active = true;
            Linker.TaiXiuController.valueXiu.active = false;
        }
        else if (Linker.TaiXiuController.gameState == TaiXiuConstant.GAME_STATE.GAME_XIU) {
            TaiXiuConstant.isGame = 0;
            Linker.TaiXiuView.show_Effect_Tai(Linker.TaiXiuController.effect1_xiu, this.effect2_xiu);
            Linker.TaiXiuView.rotate_Effect(Linker.TaiXiuController.effect1_xiu, 5, -360);
            Linker.TaiXiuView.rotate_Effect(Linker.TaiXiuController.effect2_xiu, 5, 360);
            Linker.TaiXiuView.setScale_Effect(Linker.TaiXiuController.text_xiu);
            Linker.TaiXiuController.valueXiu.getComponent(cc.Label).string = Linker.TaiXiuController.totalValue;
            Linker.TaiXiuController.valueTai.active = false;
            Linker.TaiXiuController.valueXiu.active = true;
        }
    },
    convertToMArray: function (oneD, M) {
        var mDA = [];
        while (oneD.length > 0) {
            mDA.push(oneD.splice(0, M));
        }
        return mDA;
    },
    initList_MucCuoc() {
        var muccuoc = Linker.TaiXiuController.mucCuoc;
        var mucCuocArray = [];
        for (var i = 0; i < 8; i++) {
            var item = cc.instantiate(Linker.TaiXiuController.item);
            muccuoc.addChild(item);
            var label = item.getChildByName('text').getComponent(cc.Label);
            if (i == 0) {
                label.string = "1K";
            } else if (i == 1) {
                label.string = "5K";
            } else if (i == 2) {
                label.string = "10K";
            } else if (i == 3) {
                label.string = "50K";
            } else if (i == 4) {
                label.string = "100K";
            } else if (i == 5) {
                label.string = "500K";
            } else if (i == 6) {
                label.string = "1M";
            } else if (i == 7) {
                label.string = "10M";
            }
            mucCuocArray.push(item);
        }
        // Total muc cuoc button tren mot dong;

        var muccuocPerRows = 8;
        Linker.TaiXiuController.resortMucCuocButtonPosition(Linker.TaiXiuController.convertToMArray(mucCuocArray, muccuocPerRows));
    },
    resortMucCuocButtonPosition: function (muccuocArr) {
        var originX = 90;
        for (var i = 0; i < muccuocArr.length; i++) {
            for (var j = 0; j < muccuocArr[i].length; j++) {
                var x = originX + j * 85;
                var y = -i * 93;
                muccuocArr[i][j].setPosition(cc.v2(x, y));
            }
        }
    },
    checkGame_Tai_Xiu(x1, x2, x3) {
        var p1 = Linker.TaiXiuController.check_Point_XucXac(x1);
        var p2 = Linker.TaiXiuController.check_Point_XucXac(x2);
        var p3 = Linker.TaiXiuController.check_Point_XucXac(x3);
        var check = p1 + p2 + p3;
        Linker.TaiXiuController.totalValue = check;
        if (check > 10) {
            return TaiXiuConstant.GAME_STATE.GAME_TAI;
        }
        else {
            return TaiXiuConstant.GAME_STATE.GAME_XIU;
        }
    },
    check_Point_XucXac(x) {
        if (x == 1) return 1;
        else if (x == 2) return 2;
        else if (x == 3) return 3;
        else if (x == 4) return 4;
        else if (x == 5) return 5;
        else if (x == 6) return 6;
    },

    init_Xucxac(x1, x2, x3) {
        var n1 = this.circle.getChildByName('xuc_xac').getChildByName('n1');
        var n2 = this.circle.getChildByName('xuc_xac').getChildByName('n2');
        var n3 = this.circle.getChildByName('xuc_xac').getChildByName('n3');

        Linker.TaiXiuController.add_xucxac(n1, Linker.TaiXiuController.xucxac[x1 - 1]);
        Linker.TaiXiuController.add_xucxac(n2, Linker.TaiXiuController.xucxac[x2 - 1]);
        Linker.TaiXiuController.add_xucxac(n3, Linker.TaiXiuController.xucxac[x3 - 1]);

        // self.xuc_xac.active = false;
    },
    add_xucxac(node, xucxac) {
        var temp = cc.instantiate(xucxac);
        node.addChild(temp);
        temp.setPosition(0, 0);
    },


    updateListPhienTX(id) {
        if (Linker.TaiXiuController.list_phien_TX.children[Linker.TaiXiuController.list_phien_TX.children.length - 1] != undefined) {
            Linker.TaiXiuController.list_phien_TX.children[Linker.TaiXiuController.list_phien_TX.children.length - 1].stopAllActions();
            Linker.TaiXiuController.list_phien_TX.children[Linker.TaiXiuController.list_phien_TX.children.length - 1].setPosition(0, 0);
        }

        if (TaiXiuConstant.isGame == 1) {
            if (Linker.TaiXiuController.list_phien_TX.children != undefined) {
                Linker.TaiXiuController.list_phien_TX.children[0].destroy();
            }
            var temp = cc.instantiate(Linker.TaiXiuController.prefab_tai);
            temp.idPhien = id;
            Linker.TaiXiuController.list_phien_TX.addChild(temp);
        }
        else if (TaiXiuConstant.isGame == 0) {
            if (Linker.TaiXiuController.list_phien_TX.children != undefined) {
                Linker.TaiXiuController.list_phien_TX.children[0].destroy();
            }
            var temp = cc.instantiate(Linker.TaiXiuController.prefab_xiu);
            temp.idPhien = id;
            Linker.TaiXiuController.list_phien_TX.addChild(temp);
        }

        var seq = cc.repeatForever(
            cc.sequence(
                cc.moveTo(0.6, cc.v2(0, 30)),
                cc.moveTo(0.6, cc.v2(0, 0))
            )
        );
        Linker.TaiXiuController.limitListPhien();
        temp.runAction(seq);
    },
    limitListPhien: function () {
        // Check case: list phien length > 20. cut it out.
        var outLength = Linker.TaiXiuController.list_phien_TX.children.length;
        if (outLength > 20) {
            var destroyChildNum = outLength - 20;

            for (var i = 0; i < destroyChildNum; i++) {
                if (Linker.TaiXiuController.list_phien_TX.children != undefined) {
                    Linker.TaiXiuController.list_phien_TX.children[i].destroy();
                }
            }
        }
    },
    init_list_phienTX(x, id) {
        if (Linker.TaiXiuController.check_num(x) == 1) {
            var temp = cc.instantiate(Linker.TaiXiuController.prefab_tai);
            temp.idPhien = id;
            Linker.TaiXiuController.list_phien_TX.addChild(temp);
        }
        else {
            var temp = cc.instantiate(Linker.TaiXiuController.prefab_xiu);
            temp.idPhien = id;
            Linker.TaiXiuController.list_phien_TX.addChild(temp);
        }
        Linker.TaiXiuController.limitListPhien();
    },

    add_list_phienTX(x, id) {
        if (Linker.TaiXiuController && Linker.TaiXiuController.list_phien_TX && Linker.listPhienTX) {
            var lst = Linker.TaiXiuController.list_phien_TX.getChildren();
            for (var i = 0; i < lst.length; i++) {
                if (id == lst[i].idPhien) {
                    return;
                }
            }
            if (lst.length > Linker.listPhienTX.length) {
                for (var i = 0; i < lst.length - Linker.listPhienTX.length; i++) {
                    Linker.TaiXiuController.list_phien_TX.removeChild(Linker.TaiXiuController.list_phien_TX.children[i]);
                }
            }
            Linker.TaiXiuController.list_phien_TX.getChildren().forEach(item => {
                item.stopAllActions();
                item.y = 0;
            });
            if (Linker.TaiXiuController.check_num(x) == 1) {
                var temp = cc.instantiate(Linker.TaiXiuController.prefab_tai);
                temp.idPhien = id;
                Linker.TaiXiuController.list_phien_TX.addChild(temp);
            }
            else {
                var temp = cc.instantiate(Linker.TaiXiuController.prefab_xiu);
                temp.idPhien = id;
                Linker.TaiXiuController.list_phien_TX.addChild(temp);
            }
            Linker.TaiXiuController.limitListPhien();
            Linker.TaiXiuController.startActionsListPhien();
        }

    },
    startActionsListPhien() {
        var seq = cc.repeatForever(
            cc.sequence(
                cc.moveTo(0.6, cc.v2(0, 30)),
                cc.moveTo(0.6, cc.v2(0, 0))
            )
        );
        Linker.TaiXiuController.list_phien_TX.children[Linker.TaiXiuController.list_phien_TX.children.length - 1].runAction(seq);
    },

    check_num(x) {
        if (Number(x) <= 10) {
            return 0;
        }
        return 1;
    },
    updateMoneyGame() {
        // DataAccess.Instance.updateData(); 
        DataAccess.Instance.node.emit("update-user-data", Linker.userData);   
    },
    onDestroy() {
        if (Linker.TaiXiuController) {
            Linker.TaiXiuController.removeAllTaxiuListener();
            // Linker.TaiXiuController = null;
        }
    },
    onEnable: function(){
        if(!Linker.TaiXiuController || Linker.TaiXiuController.isValid == false){
            this.initTaiXiuController();
        }
    },
    removeAllTaxiuListener: function () {
        Linker.Event.removeEventListener(SocketConstant.GAME.TAI_XIU.JOIN_TAI_XIU, this.onJoinTaiXiu, this);
        Linker.Event.removeEventListener(SocketConstant.GAME.TAI_XIU.UPDATE_TAI_XIU, this.onUpdateTaiXiu, this);
        Linker.Event.removeEventListener(SocketConstant.GAME.TAI_XIU.BET_TAI_XIU, this.onBetTaiXiu, this);
        Linker.Event.removeEventListener(SocketConstant.GAME.TAI_XIU.PHIEN_TX_STATE, this.onPhienTXState, this);
        Linker.Event.removeEventListener(SocketConstant.GAME.TAI_XIU.CHAT_TAI_XIU, this.onChatTaiXiu, this);
    }
});
