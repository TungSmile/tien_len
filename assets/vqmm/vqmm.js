var Linker = require('Linker');
var Global = require('Global');
var Constant = require('Constant');
var vqmmSend = require('vqmmSend');
var Api = require('Api');
var Utils=require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        txtPrize1: cc.Label,
        txtPrize2: cc.Label,
        txtPrize3: cc.Label,
        txtPrize4: cc.Label,
        txtPrize5: cc.Label,
        txtPrize6: cc.Label,
        txtPrize7: cc.Label,
        txtPrize8: cc.Label,
        background: cc.Sprite,
        txtTimes: cc.Label,
    },
    onLoad() {
        Linker.VQMM=this;
        this.addSocketEvent();
        this.targetSpin = this.node.getChildByName('background');
        var obj = 'userId=' + Linker.userData.userId;
        try {
            Api.postNoJson(Global.configPurchase.API_URL + "vqmn-count", obj, (data) => {
                if (data) {
                    
                    this.txtTimes.string = data.count;
                } else {
                    Linker.showMessage('Đã xảy ra lỗi, Vui lòng thử lại sau');
                }
            })
        } catch (error) {

        }
    
        this.onSetValuePrize();
        this.rotationLst = [90, 120, 150, 180, 210, 240,30,60];
    },
    addSocketEvent() {
        Linker.Event.addEventListener(80, this.onSendPlay, this);
    },

    onEnable() {

    },
    onSetValuePrize() {
        if(Linker.configPurchase && Linker.configPurchase.VQMN){
            var lst=Linker.configPurchase.VQMN.split(',');
            console.log('*** lst vqmm',lst);
            this.lstMoney=lst;
            if(lst.length==8){
                this.txtPrize1.string = Utils.Number.abbreviate(lst[1]);
                this.txtPrize2.string = Utils.Number.abbreviate(lst[2]);
                this.txtPrize3.string = Utils.Number.abbreviate(lst[3]);
                this.txtPrize4.string = Utils.Number.abbreviate(lst[4]);
                this.txtPrize5.string = Utils.Number.abbreviate(lst[5]);
                this.txtPrize6.string = Utils.Number.abbreviate(lst[6]);
                this.txtPrize7.string = Utils.Number.abbreviate(lst[7]);
                this.txtPrize8.string = Utils.Number.abbreviate(lst[8]);
            }
        }
    },
    onBtnPlay() {
        //  this.txtTimes.string=5;
        if (!this.isPlaying) {
            this.isPlaying=true;
            var arraySend = {

            }
            var sendData = {

            }
            arraySend.r = [];
            var str = 80;
            sendData.v = str;
            arraySend.r.push(sendData);
            Linker.Socket.send(JSON.stringify(arraySend));
            setTimeout(() => {
                Linker.VQMM.isPlaying=false;
            }, 4000);
        } else {
            Linker.showMessage('Hãy đợi quay xong nhé!');
        }
    },
    onSendPlay(data) {

        if (data == undefined) {
            Linker.showMessage('Đã xảy ra lỗi, Vui lòng thử lại sau');

        } else {
            if(data.status==1){
                var dataTemp=data.data.split('');
                var index=0;
                // dataTemp[1]=1000;
                if(this.lstMoney && this.lstMoney.length>0){
                    this.lstMoney.forEach((item,i)=>{
                        if(item==dataTemp[1]){
                            index=i;
                        }
                    });
                }

                var valueRotation = this.rotationLst[index];
                this.targetSpin.rotation=0;
                this.targetSpin.runAction(cc.sequence(
                    cc.rotateBy(1, 360 * 2 + valueRotation),
                    cc.callFunc(() => {
                        Linker.showMessage(dataTemp[0]);
                        if(Linker.VQMM && dataTemp && dataTemp.length>=2){
                            Linker.VQMM.txtTimes.string=dataTemp[2];
                            Linker.VQMM.isPlaying=false;
                        }
                        if(Linker.MiniGame && dataTemp && dataTemp.length>=2){
                            if(Number(dataTemp[2])>0){
                                Linker.MiniGame.countVqmm.active=true;
                                Linker.MiniGame.countVqmm.getComponent(cc.Label).string = dataTemp[2];
                            }else{
                                Linker.MiniGame.countVqmm.active=false;
                            }
                        }
                    })
                ))
               
            }else{
                var dataTemp=data.data.split('');
                Linker.showMessage(dataTemp[0]);
                this.isPlaying=false;
            }
           
            // Do something and reset.
        }
    },


    onBtnClose() {
        
        if(this.node.position.x==0 && Math.floor(this.node.position.y)> -308 && Math.floor(this.node.position.y)< -303){
            var sceneName = cc.Global.getSceneName();
            if(sceneName=='HallScene'){
                var spine=cc.find('Canvas/Hall/bottomContainer/content/btn_daily copy');
                if(spine){
                    spine.active=true;
                    cc.find('Canvas/bg').active=false;
                    spine.runAction(cc.sequence(cc.delayTime(0.3),cc.moveTo(0.3,spine.x,spine.y+200)));
                    this.node.runAction(cc.sequence(cc.moveTo(0.3,cc.v2(0, -1000)),cc.callFunc(function (node) {
                        node.active = false;
                    })));
                }
            }
        }else{
            this.node.active = false;
        }
    },
    onDestroy() {
        Linker.Event.removeEventListener(14004, this.onSetValuePrize, this);
    }
});