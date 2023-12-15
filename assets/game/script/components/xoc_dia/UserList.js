var TQUtil = require('TQUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        scrTable: cc.ScrollView,
        tablesTemp: cc.Node,
        listAvatar:
        {
            default:[],
            type:cc.SpriteFrame
        }
    },

    onLoad: function () {
        this.node.active = false;

    },

    closeView() {
        this.node.active = false;
    },

    showView: function (others) {
        this.node.active = true;
        this.scrTable.content.removeAllChildren();

        // others = [];
        // for (var i = 0; i < 20; i++) {
        //
        //     var user = {};
        //     user.money = 500000;
        //     user.avatar = i + ".png";
        //     user.name = "strUser ddfa";
        //
        //     others.push(user);
        // }

        for (var i = 0; i < others.length; i++) {
            var user = others[i];
            cc.log('player number ',i,' , data is:',user);
            var buttonChild = cc.instantiate(this.tablesTemp);
            buttonChild.active = true;
            buttonChild.parent = this.scrTable.content;

            var txt_money = buttonChild.getChildByName("money").getComponent(cc.Label);
            var numplayer = buttonChild.getChildByName("name").getComponent(cc.Label);
            var ivAvatar = buttonChild.getChildByName("avatar").getComponent(cc.Sprite);

            txt_money.string = TQUtil.addDot(user.money);
            numplayer.string = user.name;
            //load Avatar
            if(user.avatar == "no_image.gif"){
                user.avatar = "1";
            }
            ivAvatar.spriteFrame = this.listAvatar[(Number(user.avatar)-1).toString()];
            //TQUtil.loadAvatar(ivAvatar, user.avatar);
        }

        this.scrTable.scrollToTop(0.0, false);
    },
});
