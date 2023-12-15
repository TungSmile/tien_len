var text_chat = [
    "Chào cả nhà!",
    "Chào các bạn, cho xin chân nhé!",
    "Xin lỗi! Mình có việc bận. Lúc khác chiến tiếp nhé",
    "Hết ván mình nghỉ, hẹn cả nhà lúc khác nhé",
    "Hiện tại mình không tiện nói chuyện. Các bạn thông cảm",
    "Bài đẹp đúng là chỉ để ngắm!",
    "Ôm eo rồi, đen vãi!",
    "Bị đè mới đau chứ!",
    "Thần tài gõ cửa rồi",
    "Đen vãi, làng nước ơi!",
    "Đánh nhanh nào",
    "Xin lỗi! Đời quá đen",
    "Thần rùa xuất hiện haha",
    "Từ từ rồi khoai sẽ nhừ",
    "Cũng thường thôi bạn hiền",
    "Tưởng thế nào haha",
    "Môn này nó nghiệt lắm bạn hiền",
    "Nhạt mồm, nhạt miệng quá cho chén trà, điếu thuốc nào",
    "Làm bi thuốc lào cho tinh thần tỉnh táo nào",
    "Dân chơi nhìn phát biết ngay!"
]

var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        prefabChat: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.scrollView = this.node.getChildByName("ScrollView");
        this.content = this.scrollView.getChildByName('mask').getChildByName('content');
        cc.log(text_chat);
        //------------------------
        this.ChatEnter = this.node.getChildByName('editbox');
        this.loadChat();
    },

    start () {
        Linker.ChanChatDialog = this;
    },

    closeChatDialog(){
        this.node.active = false;
    },

    btnSendChatMessage(){
        var message = this.ChatEnter.getComponent(cc.EditBox).string;
        if(message != ""){
            SmartfoxClient.getInstance().sendChatMessage(message);
        }
        this.node.active = false;
        Linker.buttonChanChat.active = true;
    },

    // update (dt) {},

    loadChat(){
        var d=0;
        this.content.removeAllChildren();
        for(var i=0; i<13; i++){
            for(var j=0; j<2; j++){
                if(text_chat[d]){
                    // cc.log(text_chat[d]);
                    // var item = this.addPrefabChat(this.prefabChat, i, j);
                    var item = cc.instantiate(this.prefabChat);
                    item.setPosition(j*625, i*-70); 
                    item.mess_chat = text_chat[d];
                    this.content.addChild(item);
                    var text = item.getChildByName('bg').getChildByName('text').getComponent(cc.Label);
                    text.string = text_chat[d];
                    d++;
                }
            }
        }
    },

    clickItemChat(event){
        cc.log(event.target.mess_chat);
        var chatEnter = this.ChatEnter.getComponent(cc.EditBox);
        var mess = event.target.mess_chat;
        chatEnter.string = mess;
    }
});
