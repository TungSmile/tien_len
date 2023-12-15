var Linker = require('Linker');

cc.Class({
    extends: cc.Component,
    properties: {
        avatar: cc.Sprite,
        avatarList: {
            default: [],
            type: cc.SpriteFrame
        }
    },
    onLoad: function() {
        Linker.AvatarAllIn = this;
        this.changeAvatar();  
    },
    changeAvatar() {
        if(Linker.userData){
            // change avatar.
            var avatarId = Linker.userData.avatar;
            cc.log('avatarId:',avatarId);
            if (avatarId == "no_image.gif") {
                avatarId = "1";
            }
            if (avatarId) {
                this.avatar.spriteFrame = this.avatarList[Number(avatarId)-1];
            } else {
                this.avatar.spriteFrame = this.avatarList[0];
            }
            Linker.currAvatar = avatarId;            
        } else {
            //Do nothing.
        }
        
    }
})