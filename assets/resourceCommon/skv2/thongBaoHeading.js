cc.Class({
    extends: cc.Component,

    properties: {
        message: {
            displayName: "message",
            type: cc.Label,
            default: null
        }
    },
    setMessage: function(mes){
        this.message.string = mes;
    }
    // update (dt) {},
});
