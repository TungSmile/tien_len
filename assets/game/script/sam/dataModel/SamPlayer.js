var SamLogic = require('SamLogic');
var SamCard = require('SamCard');
var Utils = require('Utils');
var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        imagePlayer: cc.Sprite,
        namePlayer: cc.Label,
        moneyPlayer: cc.Label,
        scoreEndGame: cc.Label,
        cardOnHandList: cc.Node,
        turnedCardList: cc.Node,
        itemCard: cc.Prefab,
        profileNode: cc.Node,
        intiveNode: cc.Node,
        readyState: cc.Node,
        timeCount: cc.ProgressBar,
        masterNode: cc.Node,
        hiddenCard: cc.Node,
        listCardEffect: cc.Node,
        win: cc.Node,
        tien: cc.Node,
        score: cc.Node,
        userDialogName: cc.Label,
        userDialogId: cc.Label,
        userDialogAvatar: cc.Sprite,
        userDialogMoney: cc.Label,
        hangContainer: cc.Node,
        playerNumber: 0,
        avatarList:  cc.SpriteAtlas,
        // Chat Feature
        chatToast: cc.Node,
        chatString: cc.Label,
        btnKick: cc.Node,
        maxTimeAuto: {
            readonly: true,
            type: cc.Float,
            default: 9
        },
        timeCounter: 0
    },
    ctor() {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
       // this.doLech=false;
        var v4=cc.v2(500,0);
        var v2=cc.v2(-500,0);
        var v3=cc.v2(0,350);
        var v1=cc.v2(0,-350);
        
        this.Vector=[v1,v2,v3,v4];
    },

    start() {

    },
    onDestroy() {
    },
    reset() {
        this.removeAllCard();
        this.showProfile(false);
        this.showInvite(true);
        this.showCardOnHand(true);
        this.showTurnedCard(true);
        this.show(true);
        this.isReady(false);
        this.showTime(false);
        this.showHiddenCard(false);
        this.showTien(false);
        this.showScore(false);
        this.showWin(false);
    },
    removeAllCard() {
        this.cardOnHandList.removeAllChildren();
        this.turnedCardList.removeAllChildren();
    },
    showProfile(isShow = false, blur) {
        this.profileNode.active = isShow;
        if(blur){
            this.blurPlayer();
        }else{
            this.notBlurPlayer();
        }
    },
    blurPlayer: function(){
        this.profileNode.opacity = 100;
    },
    notBlurPlayer: function(){
        this.profileNode.opacity = 255;
    },
    showInvite(isShow = false) {
        this.intiveNode.active = isShow;
    },
    showCardOnHand(isShow = false) {
        this.cardOnHandList.active = isShow;
    },
    showTurnedCard(isShow = false) {
        this.turnedCardList.active = isShow;
    },
    
   
    show(isShow = false) {
        this.node.active = isShow;
    },
    setProfile() {

    },
    createPlayer(player) {
        this.player = player;
        this.setProfileUi();
        setTimeout(() => {
            if(player.socay && Number(player.socay>0)){
                if(this.hiddenCard.getChildByName('light')){
                    this.hiddenCard.getChildByName('light').getChildByName('socay').getComponent(cc.Label).string=player.socay;
                    this.hiddenCard.getChildByName('light').active=true;
                }
            }
        }, 50);
    },
    setProfileUi() {
        this.namePlayer.string = this.player.viewName;
        if(this.player.avatarId === "no_image.gif"){
            this.player.avatarId = "1";
        }
        this.imagePlayer.spriteFrame = this.avatarList.getSpriteFrame('avatar ('+this.player.avatarId+')');//this.avatarList[(Number(this.player.avatarId)-1).toString()];
        this.moneyPlayer.string = Utils.Number.format(this.player.userMoney);
        this.scoreEndGame.string = "0";
        this.scoreEndGame.node.parent.active = false;
        if (this.player.isMaster == 1) {
            this.masterNode.active = true;
        } else {
            this.masterNode.active = false;
        }

        if (this.player.state == 1) {
            this.readyState.active = true;
        } else {
            this.readyState.active = false;
        }
    },
    onChat(data,isEnCode) {
        if (data.error) {
            console.log(data.error);
            return;
        }
        this.chatToast.active = true;
        if(isEnCode){
            this.chatString.string = Utils.Decoder.decode(data.message);
        }else{
            this.chatString.string= data.message;
        }
       
        
        setTimeout(()=>{
            if(!this.chatToast){
                return;
            }
            this.chatToast.active = false;
        },2000);
        /*
        var item = cc.instantiate(this.pnItemMsg);
        item.parent = this.srcChat.content;

        var txtMsg = item.getComponent(cc.RichText);
        if (data.id === Linker.userData.userId) {
            txtMsg.string = "<color=#20FFE4>" + data.username + ": </c>" + data.message;
        }
        else {
            txtMsg.string = "<color=#61D9CT>" + data.username + ": </c>" + data.message;
        }

        this.srcChat.stopAutoScroll();
        this.srcChat.scrollToBottom(0.0, false);
        */      
        //var avaComp = this.findAvaCompByUID(data.id);
        //if (avaComp) {
        //    avaComp.onChatMessage(data.message);
        //}

    },

    onWinMessage(message) {
        if(!message){
            return;
        }

        if(message == 'Thắng'){
            return;
        }

        setTimeout(()=>{
            if(!this.score){
                return;
            }
            this.score.active = false;
        },5000);

        this.score.active = true;
        var scoreText = this.score.getChildByName("text").getComponent(cc.Label);
        scoreText.string = message;
    },
    showDialogInfo() {
        cc.find('Canvas/PopupUserInfo').active = true;
        this.userDialogId.string = this.player.userId;
        this.userDialogMoney.string = this.player.userMoney;
        this.userDialogName.string = this.player.viewName;
        if(this.player.avatarId === "no_image.gif"){
            this.player.avatarId = "1";
        }
        if(Linker.userData.userId == this.player.userId || !Linker.SamController.isMaster){
            this.btnKick.active=false;
        }else{
            this.btnKick.active=true;
            Linker.SamController.KickID=this.player.userId;
        }
        this.userDialogAvatar.spriteFrame = this.avatarList.getSpriteFrame('avatar ('+this.player.avatarId+')');
    },
    isReady(isReady = false) {
        this.readyState.active = isReady;
    },
    showTime(isShow) {
        var self = this;
        this.timeCount.progress = 1;
        this.timeCount.node.active = isShow;
        if (isShow) {
            this.timeCounter = this.maxTimeAuto;
            this.startCount = true;
        } else {
            this.timeCount.node.stopAllActions();
            this.startCount = false;
        }
        // cc.log("SHOW_TIME");
    },

    setPlayer(player) {
        this.player = player;
    },
    newRound(){
        this.turnedCardList.removeAllChildren();
    },
    addCardAttack(cardData, parent, isTouch = true,indexCorner,doLech) {
 
        if(cardData){
            var that=this;
            var index=0;
            //var Corner=Math.floor((Math.random() * 4));
            cardData.forEach((item)=>{
                var card = cc.instantiate(that.itemCard);
                if(doLech){
                    card.rotation = 5;
                }else{
                    card.rotation = -5;
                }
                
                var script = card.getComponent('SamCard');
                if (script) {
                    script.fromServerValue(item.serverValue);
                    script.reset();
                    script.setTouch(isTouch);
                }
                
                setTimeout(() => {
                    var bgc=card.getChildByName('background');
                    bgc.width = 150;
                    bgc.height = 200;
                    parent.addChild(card);
                    card.runAction(cc.rotateBy(0.2,360)); 
                }, 250);

                //animation
                var cardAni=cc.instantiate(that.itemCard);
                var bg=cardAni.getChildByName('background');
                bg.width = 80;
                bg.height = 120;
                cc.find('Canvas').addChild(cardAni);

                cardAni.position =that.Vector[indexCorner]; // tạo độ hiển thị ban đầu
                cardAni.runAction(cc.rotateBy(0.3,360),cc.removeSelf(true)); 
                cardAni.runAction(cc.sequence([
                cc.moveTo(0.3,index * 50 - parseInt(cardData.length/2) * 50,0),
                cc.callFunc(function(cardAni){
                    cardAni.destroy();
                }, this)
                ]));
                index++;
                
            
            });
        }
    },

    addCard(cardData, parent, isTouch = true, isVertical = false) {
        var card = cc.instantiate(this.itemCard);
        card.width = 107;
        card.height = 144;
        var script = card.getComponent('SamCard');
        if (script) {
            script.fromServerValue(cardData.serverValue);
            script.reset();
            script.setTouch(isTouch);
        }
        if (isVertical) {
            card.x = 0;
        } else {
            card.y = 0;
        }
        parent.addChild(card);

    },

    findCard(card, parent) {
        for (var i = 0; i < parent.children.length; i++) {
            var script = parent.children[i].getComponent(SamCard);
            if (script) {
                if (script.serverValue == card.serverValue) {
                    
                    return i;
                }
            }
        }
        return -1;
    },
    removeCard(serverValue, parent) {
        serverValue.forEach((item)=>{
            var removeIndex = this.findCard(item, parent);
            cc.log(removeIndex);
            if (removeIndex != -1) {
                parent.children[removeIndex].removeFromParent();
            }
        });
    },
    addCardPlayerOwner() {
        this.cardOnHandList.removeAllChildren();
        for (var i = 0; i < this.player.cardOwnerList.length; i++) {
            this.addCard(this.player.cardOwnerList[i], this.cardOnHandList, true, false);
            //console.log('*** card from parent when end game',this.cardOnHandList);
        }
    },
    addTurnedCardList() {
        this.turnedCardList.removeAllChildren();
        for (var i = 0; i < this.player.turnedCardList.length; i++) {
            this.addTurnedCard(this.player.turnedCardList[i], false);
        }
    },


    addTurnedCard(serverValue,index) {
        if(serverValue.length>0 && serverValue){
            var hang = cc.instantiate(this.hangContainer);
            var doLech=this.turnedCardList.getComponent('CardContainer').doLech;
            this.addCardAttack(serverValue, hang, false,index,doLech);
            this.turnedCardList.addChild(hang);
           
            if(doLech){
                hang.x=hang.x+20;
                this.turnedCardList.getComponent('CardContainer').doLech=false;
            }
            else{
                hang.x=hang.x-20;
                this.turnedCardList.getComponent('CardContainer').doLech=true;
            }
            if(this.turnedCardList.childrenCount>3){
                for(var i=0;i<this.turnedCardList.childrenCount-3;i++){
                    this.turnedCardList.removeChild(this.turnedCardList.children[i]);
                }
            }
        }
    },
   


   
    removeOwnerCard(serverValue) {
        this.removeCard(serverValue, this.cardOnHandList);
    },
    showHiddenCard(isShow) {
        this.hiddenCard.active = isShow;
    },
    sortMyCard(typeSort) {
        for (var i = 0; i < this.cardOnHandList.children.length; i++) {
            var script = this.cardOnHandList.children[i].getComponent(SamCard);
            if (script) {
                var serverValue = this.player.cardOwnerList[i].serverValue;
                script.fromServerValue(serverValue);
                script.reset();
                script.setTouch(true);
                script.setLock(false);
            }
        }
        cc.log("LENGTH", this.player.cardOwnerList.length);
       

        this.cardOnHandList.children.forEach((element) => {
            element.y = 0;
        });
        
    },

    update(dt) {
        //update time as tick
        if(this.startCount == true){
            this.timeCounter -= dt;
            if(this.timeCounter <= 0){
                this.timeCount.progress = 0;
                this.timeCounter = this.maxTimeAuto;
                this.timeCount.node.stopAllActions();
                this.startCount = false;
            }else{
                this.timeCount.progress = (this.timeCounter/this.maxTimeAuto);
            }
        }
    },
 
    printData() {
        var data = {};
        data.playerCard = [];
        data.eatCard = [];
        this.player.cardOwnerList.forEach(element => {
            data.playerCard.push(element.serverValue);
        });
       
        cc.log(data);
    },
    grayCardEffect(parent) {
        parent.children.forEach(element => {
            element.getComponent(cc.Button).interactable = false;
            element.getChildByName("background").color = cc.Color.GRAY;
        })
    },
    playWinEffect(winPos, score, money) {
        this.showWin(true);
        //this.grayCardEffect(this.turnedCardList);
        this.addCardPlayerOwner();
            // switch (Number(winPos)) {
            //     case 0: {
            //         if (uType != 0) {
                        
            //         } else {
            //             if (!isMom) {
            //                 this.win.getChildByName("glow2").active = true;
            //                 this.win.getChildByName("nhat").active = true;
            //                 this.setScore(score);
            //             } else {
            //                 this.win.getChildByName("glow2").active = true;
            //                 this.win.getChildByName("xaokhan").active = true;
            //                 this.setScore(score);
            //             }
            //         }
            //         cc.log("NHAT_NHAT");
                    
            //         break;
            //     }
            //     case 1: {
            //          if (uType != 0) {
            //              this.win.getChildByName("glow1").active = true;
            //              this.win.getChildByName("bet").active = true;
            //          } else {
            //              if (!isMom) {
            //                  this.win.getChildByName("glow1").active = true;
            //                  this.win.getChildByName("nhi").active = true;
            //                  this.setScore(score);
            //              } else {
            //                  this.win.getChildByName("glow1").active = true;
            //                  this.win.getChildByName("mom").active = true;
            //                  this.setScore(score);
            //              }
                         
            //          }
                    
            //         break;
            //     }
            //     case 2: {
            //           if (uType != 0) {
            //               this.win.getChildByName("glow1").active = true;
            //               this.win.getChildByName("bet").active = true;
            //           } else {
            //               if (!isMom) {
            //                   this.win.getChildByName("glow1").active = true;
            //                   this.win.getChildByName("ba").active = true;
            //                   this.setScore(score);
            //               } else {
            //                   this.win.getChildByName("glow1").active = true;
            //                   this.win.getChildByName("mom").active = true;
            //                   this.setScore(score);
            //               }
            //           }
            //         break;
            //     }
            //     case 3: {
            //           if (uType != 0) {
            //               this.win.getChildByName("glow1").active = true;
            //               this.win.getChildByName("bet").active = true;
            //           } else {
            //               if (!isMom) {
            //                   this.win.getChildByName("glow1").active = true;
            //                   this.win.getChildByName("bet").active = true;
            //                   this.setScore(score);
            //               } else {
            //                   this.win.getChildByName("glow1").active = true;
            //                   this.win.getChildByName("mom").active = true;
            //                   this.setScore(score);
            //               }
            //           }
            //         break;
            //     }
            // }
        
        this.setMoney(money, false);
    },
    setScore(score) {
        if (score > 0) {
             if (!this.score.active) {
                 this.score.active = true;
             }
             var scoreText = this.score.getChildByName("text").getComponent(cc.Label);
             scoreText.string = score + " Điểm";
        } else {
            this.score.active = false;
        }
       
    },
    setMoney(money , isAnim =  true , isChot = false) {
        if (!this.tien.active) {
            this.tien.active = true;

        }
        if (Number(money) > 0) {
            var moneyText = this.tien.getChildByName("thang").getComponent(cc.Label);
            moneyText.string = "+" + money;
            if (!moneyText.node.active) {
                moneyText.node.active = true;
                
            }
            
            this.textEffect(moneyText.node , isAnim);
            // if (isChot) {
            //     this.playAnChotEffect(moneyText.node);
            // }
           
        } else {
            if (Number(money) < 0) {
                var moneyText = this.tien.getChildByName("thua").getComponent(cc.Label);
                moneyText.string = money;
                if (!moneyText.node.active) {
                    moneyText.node.active = true;

                }

                this.textEffect(moneyText.node, isAnim);
            } else {
                
            }
            
           
        }
        
    },
    textEffect(node, isAnim) {
        var self = this;
        node.stopAllActions();
        var correctPos = cc.v2(0, 30);
        var startPos = cc.v2(0, -100);
        node.position = startPos;
        node.active = true;
        var moveAction = cc.moveTo(0.3, correctPos);
        if (!isAnim) {
            node.runAction(cc.sequence(cc.fadeIn(0), moveAction));
        } else {
            node.runAction(cc.sequence(cc.fadeIn(0), moveAction, cc.delayTime(4), cc.fadeOut(0.1)),cc.callFunc(this.hideChot));
        }
        
    },
    showNodeEffect(node) {
        node.stopAllActions();
        node.setScale(0.3);
        node.runAction(cc.spawn([cc.scaleTo(0.2, 1).easing(cc.easeBackOut()), cc.fadeIn(0.2)]));
    },
    showScore(isShow) {
        if (isShow) {
            this.score.active = true;
        } else {
            this.score.active = false;
        }
    },
    showTien(isShow) {
        this.tien.children.forEach((item) => {
            item.active = false;
        })
        if (isShow) {
            this.tien.active = true;
        } else {
            this.tien.active = false;
        }
    },
    showWin(isShow) {
        if (isShow) {
            this.win.active = true;
        } else {
            this.win.active = false;
        }
        this.node.stopAllActions();
        this.win.children.forEach((item) => {
            item.active = false;
        })
    },
    getViewName() {
        if (this.player) {
            return this.player.viewName;
        }

    },
});
