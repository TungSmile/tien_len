var Linker = require('Linker');
var TaiXiuConstant = require('TaiXiuConstant');
var SocketConstant = require('SocketConstant');
var TaiXiuSend = require('TaiXiuSend');
const i18n = require('../../../../i18n/i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        prefabChat: cc.Prefab,
        scrollView: cc.ScrollView,
        textChat: cc.EditBox
    },
    onEnable: function () {
        // this.stopPropagationOnBackdrop = Utils.Node.stopPropagation(this.backdrop);

      
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.ChatDialog = this;
        // var itemChat = cc.instantiate(Linker.ChatDialog.prefabChat);
        // Linker.ChatDialog.content.addChild(itemChat);
       
        this.count == 0;
        if((cc.sys.isBrowser && cc.sys.isMobile) || cc.sys.isNative){
           this.mobile=true;
        }
        else{
            //this.initChat();
             this.node.stopAllActions();
            this.node.setScale(0.3);
            this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
        }
        
    },

    start () {
        //Linker.Event.addEventListener(SocketConstant.GAME.TAI_XIU.CHAT_TAI_XIU, this.onChatTaiXiu, this);

    },

    // update(dt){
      
    //     // if(this.mobile){
    //     //         this.initChat();
    //     //     this.mobile=false;
    //     // }
       
    // },

    // initChat(){
    //     //add by zep
    //     //setTimeout(function(){
    //         if (Linker.CHAT_MESSAGE) {
    //             // Linker.ChatDialog.content.removeAllChildren();
    //             // var txtChats = "";
    //             // var msgObj = Linker.CHAT_MESSAGE;
    //             // for (var i = 0; i < msgObj.length; i++) {
    //             //     cc.log("chat i:"+i);
    //             //     if(msgObj[i].username != undefined){
    //             //         txtChats = txtChats + '<color=yellow>' + msgObj[i].username + ': ' + '</color>' + '<color=white>' + msgObj[i].messchat + '</color><br/>';
    //             //     }
                    
    //             // }
    //             // var itemChat = cc.instantiate(Linker.ChatDialog.prefabChat);
    //             // Linker.ChatDialog.content.addChild(itemChat);
    //             // itemChat.getChildByName('textchat').getComponent(cc.RichText).string = txtChats;
                
    //         } else {
    //             Linker.CHAT_MESSAGE = [];
    //         }
    //        // this.scrollView.scrollToBottom(0.1);
    //     //},500);
    //     //end by zep
    // },
    onDestroy(){
        Linker.ChatDialog = null;
        //Linker.Event.removeEventListener(SocketConstant.GAME.TAI_XIU.CHAT_TAI_XIU, this.onChatTaiXiu, this);
    },
    onChatTaiXiu(message){
        //kyun : Comment lai vi bo ham listener
        /*
        if (message.listChat&&this.count == 1) {
           this.count ++;
           Linker.ChatDialog.content.removeAllChildren();
            for (var i = 0; i < message.listChat.length; i++) {
                var userChat = message.listChat[i].username;
             var messChat = message.listChat[i].messchat;
                var itemChat = cc.instantiate(Linker.ChatDialog.prefabChat);
                Linker.ChatDialog.content.addChild(itemChat);
                // itemChat.getChildByName('textchat').getComponent(cc.Label).string = userChat + ": " + messChat;
               itemChat.getChildByName('textchat').getComponent(cc.RichText).string = '<color=yellow>' + userChat + ': ' + '</color>' + '<color=white>' + messChat + '</color>';
               Linker.ChatDialog.scrollView.scrollToBottom(0.1);
            }
        } 
        else */
        if (message && message.userName) {
            if(Linker.ChatDialog.content.childrenCount>19){
                for(var i=0;i<Linker.ChatDialog.content.childrenCount-19;i++){
                    Linker.ChatDialog.content.removeChild(Linker.ChatDialog.content.children[i]);
                }
            }
           var itemChat = cc.instantiate(Linker.ChatDialog.prefabChat);
           Linker.ChatDialog.content.addChild(itemChat);
           itemChat.getChildByName('textchat').getComponent(cc.RichText).string = '<color=yellow>' + message.userName + ': ' + '</color>' + '<color=white>' + message.mess + '</color>';
       }
       this.scrollView.scrollToBottom(0.1);
    },
    guiBtn() {
        var editBox = this.textChat;
        var mess = editBox.string;
        if (mess.length > 1) {
            var message = TaiXiuSend.chat(mess);
            Linker.Socket.send(message);
            editBox.string = "";
            
        } else {
            cc.Global.showMessage(i18n.t("No chat content"));
        }
         
    },

    update (dt) {},
});
