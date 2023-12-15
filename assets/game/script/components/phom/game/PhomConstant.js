var PhomConstant = {
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
    U_TYPE: {
        U_KHAN: 2,
        U_GUI: 3,
        U_DEN:11,
        U_TAI: 12,
        U_THUONG: 1,
        U_TRON: 1,
        KHONG_U: 0
        
    },
    WIN_TYPE: cc.Enum({
        NHAT: 0,
        NHI: 1,
        BA: 2,
        BET: 3,
    }),
    CARD_LIST_TYPE: cc.Enum({
        SERIAL : 0,
        VALUE : 1,
        INVALID: 2,
    }),
    ZONEID: 4
};
module.exports = PhomConstant;
