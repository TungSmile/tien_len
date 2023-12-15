

const GAME_STATE = cc.Enum({
    GAME_TAI: 0,
    GAME_XIU: 1,
    GAME_NULL: 2,
    GAME_CHECK: 3,
});

module.exports = {
    GAME_STATE: GAME_STATE,
    CHOICE_THE_DOOR: -1,
    LOCK_CHOICE_DOOR: 0,
    ALERT: 0,
    ISNAN: 0,
    isGame: -1,
}