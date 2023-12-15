var soccerConstant = {
    MATPPATH_FREE: [
        { id: 1, name: "Moon", type: "022_1", path: "prefabs/soccerMaps/soccerMapPlayer1_022_1_Moon" },
        { id: 2, name: "Wede", type: "221", path: "prefabs/soccerMaps/soccerMapPlayer1_221_Wede" },
        { id: 3, name: "Pentagon", type: "230_2", path: "prefabs/soccerMaps/soccerMapPlayer1_230_2_Pentagon" },
        { id: 4, name: "Target", type: "031", path: "prefabs/soccerMaps/soccerMapPlayer1_031_Target" },
        { id: 5, name: "Vendelta", type: "022_3", path: "prefabs/soccerMaps/soccerMapPlayer1_022_3_Vendelta" },
        { id: 6, name: "Lifeline", type: "220", path: "prefabs/soccerMaps/soccerMapPlayer1_220_Lifeline" },
        { id: 7, name: "Fangs", type: "022_2", path: "prefabs/soccerMaps/soccerMapPlayer1_022_2_Fangs" },
        { id: 8, name: "Wave", type: "230", path: "prefabs/soccerMaps/soccerMapPlayer1_230_Wave" },
        { id: 9, name: "Eagle", type: "211", path: "prefabs/soccerMaps/soccerMapPlayer1_211_Eagle" },
        { id: 10, name: "Diamond", type: "202", path: "prefabs/soccerMaps/soccerMapPlayer1_202_Diamond" }
    ],
    PLAYER_TYPE: {
        PLAYER_LEFT: 1,
        PLAYER_RIGHT: 2,
        PLAYER_BOTH: 3
    },
    MATCH_TYPE: {
        PLAY_5VS5: "5-5"
    },
    ZINDEX: {
        HINT_FX: 50,
        BALL: 100,
        PLAYER: 150,
        ARROW_CIRCLE_FX: 200
    },
    GAME_CUSTOM_EVENT: {
        //GAME
        YEU_CAU_TAT_ANIMATION_NHAC_TURN: "SG_GCE_GAME_1",
        YEU_CAU_BAT_ANIMATION_NHAC_TURN: "SG_GCE_GAME_2",
        YEU_CAU_TAT_ANIMATION_PICKER_CIRCLE: "SG_GCE_GAME_3",
        YEU_CAU_BAT_ANIMATION_PICKER_CIRCLE: "SG_GCE_GAME_4",
        YEU_CAU_MO_SU_KIEN_TOUCH_DE_NGUOI_CHOI_DANH: "SG_GCE_GAME_5",
        YEU_CAU_KHOA_SU_KIEN_TOUCH_DE_NGUOI_CHOI_KHAC_DANH: "SG_GCE_GAME_6",
        YEU_CAU_ROI_BAN: "SG_GCE_GAME_7",
        YEU_CAU_GAME_PARTROL_LANG_NGHE_TAT_CA_OBJECT_STOP_DE_GUI_KET_QUA: "SG_GCE_GAME_9",
        YEU_CAU_GUI_GOC_SHOOT_BONG_VA_DO_LON_CUA_LUC: "SG_GCE_GAME_10",
        YEU_CAU_CAC_PLAYER_KHAC_HUY_BO_DRAG_TOUCH: "SG_GCE_GAME_11",
        YEU_CAU_GUI_DO_LON_CUA_LUC_VA_THUC_HIEN_SHOOT_BONG: "SG_GCE_GAME_12",
        YEU_CAU_MO_PANEL_NHUNG_NGUOI_CHOI_DANG_XEM: "SG_GCE_GAME_13",
        GUI_KET_QUA_KET_THUC_TURN_NORMAL: "SG_GCE_GAME_14",
        GUI_KET_QUA_KET_THUC_TURN_AUTO: "SG_GCE_GAME_15",
        YEU_CAU_SET_KET_QUA_KET_THUC_TURN: "SG_GCE_GAME_16",
        YEU_CAU_CHAY_HIEU_UNG_MY_GOAL: "SG_GCE_GAME_17",
        YEU_CAU_KIEM_TRA_VA_SUA_LAI_CAC_VI_TRI_PLAYER_TREN_BAN_CHOI: "SG_GCE_GAME_18",
        YEU_CAU_KIEM_TRA_VA_SUA_LAI_CAC_VI_TRI_BALL_TREN_BAN_CHOI: "SG_GCE_GAME_19",
        BALL_IN_GOAL: "SG_GCE_GAME_20",
        RESET_BALL_IN_GOAL: "SG_GCE_GAME_21",
        YEU_CAU_THAY_NGUOI_CHOI_MOI: "SG_GCE_GAME_22",
        END_GAME_ANIMATION_FINISH: "SG_GCE_GAME_23",
        END_GAME_ANIMATION_START: "SG_GCE_GAME_24",
        UPDATE_TRANG_THAI_CHU_PHONG: "SG_GCE_GAME_25",
        YEU_CAU_SET_KET_QUA_KET_THUC_AUTO_TURN: "SG_GCE_GAME_26",
        YEU_CAU_SAP_SEP_LAI_VI_TRI_NGUOI_CHOI_TREN_BAN: "SG_GCE_GAME_27",
        //PLAYER INFO EVENT
        PLAYER_INFO: {
            UPDATE_THONG_TIN_KHAC: "SG_GCE_GAME_28",
            RESET_PLAYER_INFO: "SG_GCE_GAME_29",
            UPDATE_TRANG_THAI_CHU_PHONG: "SG_GCE_GAME_30",
            ACTIVE_CHU_PHONG: "SG_GCE_GAME_31",
            SET_COIN_FRAME: "SG_GCE_GAME_32",
            UPDATE_MONEY_UN_FORMAT: "SG_GCE_GAME_33",
            UPDATE_STATUS_PLAYING: "SG_GCE_GAME_34",
            SET_CURRENT_POSITIONS: "SG_GCE_GAME_35",
            SET_PLAYER_SCORE: "SG_GCE_GAME_36",
            SET_PLAYER_TYPE: "SG_GCE_GAME_37",
            SET_PLAYER_NAME: "SG_GCE_GAME_38",
            SET_PLAYER_MONEY: "SG_GCE_GAME_39",
            SET_PLAYER_AVATAR_FRAME: "SG_GCE_GAME_40",
            SET_PLAYER_USER_ID: "SG_GCE_GAME_41",
            SET_PLAYER_READY: "SG_GCE_GAME_42",
            SET_PLAYER_COUNTER_TIMER: "SG_GCE_GAME_43",
            SET_PLAYER_INFO: "SG_GCE_GAME_45",
            SET_PLAYER_COUNTER_TIMER_PROGRESS: "SG_GCE_GAME_46"
        }
    },
    GAME_TURN_INFO_VALUE: {
        YEU_CAU_CHAY_LAI_HIEU_UNG_NHAC_TURN_CHO_OPPONENT: 7777
    },
    GAME_STATE: {
        WAIT: 0,
        PLAYING: 1
    },
    LOGO_ZONE_LOBBY_TYPE: {
        ZONE_1VS1: 12
    },
    ZONE_ID: {
        ZONE_1VS1: 45
    },
    TABLE_STATUS: {
        XOAY_GAY: 1,
        SHOOT_BONG: 2,
        GUI_KET_QUA: 3,
        TU_DONG_GUI_KET_QUA: 4,
        BONG_VAO_GOAL: 5,
        BOT_END_TURN: 6
    },
    PHYSIC_TAGS: {
        BALL: 10,
        PLAYER: 20,
        GOAL_LEFT: 30,
        GOAL_RIGHT: 40
    },
    OFFSET: {
        BALL: {
            x: 0,
            y: -46.396
        },
        MAX_ARROW_SIZE: {
            WIDTH: 89,
            HEIGHT: 0
        }
    }
};
module.exports = soccerConstant;
