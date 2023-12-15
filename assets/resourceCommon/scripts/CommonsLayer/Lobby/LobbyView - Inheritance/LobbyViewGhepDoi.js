import {LobbyView} from "../LobbyView";

cc.Class({
    extends: LobbyView,

    properties: {
        ghepDoiPrefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:
    ctor: function() {

    },
    getMatching: function(){
        if(this.commonContainerTopBottom && cc.isValid(this.commonContainerTopBottom)){
            return this.commonContainerTopBottom.getChildByName("GhepDoi");
        }
        return null;
    },
    showMatchMaking(isShow, data) {
        var match = this.getMatching();
        if (match) {
            match.active = isShow;
        } else {
            match = cc.instantiate(this.ghepDoiPrefab);
            this.commonContainerTopBottom.addChild(match);
            match.active = isShow;
        }
        match.getComponent("GhepDoi").init(data);
    },
    ghepDoiSuccess() {
        var match = this.getMatching();
        if (match) {
            match.destroy();
        }
    }
});
