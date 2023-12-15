// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var TLMNConstant = {
    GAME_STATE: cc.Enum({
        WAIT: 0,
        PLAYING: 1,
    }),
    PLAYER_STATE: cc.Enum({
        WAIT: 0,
        READY: 1,
        PLAYING: 2,
    }),
    TYPE: cc.Enum({
        SOLO: 0,
        NORMAL: 1,
    }),
    WIN_TYPE: cc.Enum({
        NHAT: 0,
        NHI: 1,
        BA: 2,
        BET: 3,
    }),
    TYPE_WIN: cc.Enum({
        NORMAL_WIN: 0,
        TOI_TRANG_WIN: 1,
        CHAT_TU_QUY_WIN: -1 
    }),
    CARD_LIST_TYPE: cc.Enum({
        SERIAL : 0,
        VALUE : 1,
        INVALID: 2,
    }),
    ZONEID: 5,
};
module.exports = TLMNConstant;
