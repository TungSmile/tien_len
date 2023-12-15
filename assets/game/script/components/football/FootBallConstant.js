var FootBallConstant = {
    TYPE_WIN: cc.Enum({
        NORMAL_WIN: 0
    }),
    GAME_STATE: cc.Enum({
        WAIT: 0,
        PLAYING: 1,
    }),
    BET: {
        BET_SETTING_VALUE: "bet-setting-value"
    },
    // TABLE_STATUS: {
    //     MOVING_CUE: 0,
    //     UPDATE_GOC_BAN_BI: 1,
    //     END_DRAGGING_CUE: 2,
    //     SETTING_RESULT_TURN: 3,
    //     AUTO_NEXT_TURN: 4,
    //     UPDATE_ROT_POS_SERVER_CHECK: 5,
    //     RECOVER_BALL_POSITION_RECONNECT: 6,
    //     DRAGGING_CUE_BOX: 8888,
    //     WHITE_BALL_IN_A_HOLE: 8889,
    //     REPOSITION_WHITE_BALL: 8890,
    //     DRAG_WHITE_BALL_TO_SHOOT: 8891,
    //     WHITE_BALL_ANGLE_ADJUST: 8892,
    //     UPDATE_BALL_LIST_ON_TABLE_SERVER_CHECK: 8893,
    //     BOT_YEU_CAU_LAY_TOA_DO_BI_TREN_BAN: 8894,
    //     SETTING_RESULT_TURN_BOT: 8895,
    //     BOT_YEU_CAU_GOC_DE_THUC_HIEN_LUOT_DANH_AUTO_NORMAL_TURN: 8896,
    //     CLIENT_RECONNECT_LAI_BAN_CHOI: 8897
    // },
    METHODS: {
        createListenerNode: function () {
            return cc.find("Canvas");
        }
    },
    // ZINDEX: {
    //     lineZOrder: 198,
    //     ball: 199,
    //     cueZOrder: 200,
    //     circleZOrder: 201,
    //     whiteCollisionLineOrder: 202,
    //     ballCollisionLineOrder: 203
    // },
    TAG: {
        // whiteBall: "0",
        // one: "1",
        // two: "2",
        // three: "3",
        // four: "4",
        // five: "5",
        // six: "6",
        // seven: "7",
        // eight: "8",
        // nine: "9",
        // ten: "10",
        // eleven: "11",
        // twelve: '12',
        // thirteen: '13',
        // fourteen: '14',
        // fifteen: '15',
        // border: '100',
        // hole: '200',
        // cueCheck: "250",
        // lineCheck: '300',
        // circleCheck: '350',
        // whiteCollisionLine: '400',
        // ballCollisionLine: '450',
        scenes: {
            LOGIN: 0,
            HOME: 1,
            LOBBY: 2,
            GAME: 3
        }
    },

    RAYCAST_CONFIG: {
        GET_CUE_CHECK_BORDER_WIDTH: function () {
            return cc.winSize.width;
        },

    },
    COLOR_TAG: {
        OPPONENT: 7777,
        ME: 8888,
        WHITE_BALL: 9999
    },
    SOUND_GAME: {
        ball: 1,
        cue: 2,
        pocket: 3,
        fineTurning: 4,
        back: 5
    },
    PHYSICS: {
        TABLE: {
            PHYSIC: {
                borderDensity: 100000000000,
                borderRestiution: 0.7,
                borderFriction: 0
            }
        },
        BALLS: {
            PHYSIC: {
                ballDensity: 1,
                ballRestiution: 0.95,
                whiteBallFiction: 0.05,
                ballFriction: 0,
            },
            RIGID: {
                increaseVelocityTime: 1,
                ballLinearDamping: 0.7,
                ballLinearIncreaseMultiple: 0.7,
                ballLinearIncreaseDoubleMultiple: 1,
                ballDampingValue: 3000 * 3000,
                ballDoubleDampingValue: 1500 * 1500,
                ballAngularDamping: 100,
                ballRollingRate: 10,

                lineSpeedRatio: 100,  //--直线瞬间力量系数
                lineForceRatio: 5,  //--直线击打力量系数，越大力量越大
                rotateForceRatio: 5000,  //--高低干力量系数，越大旋转越激烈
                leftRightForceRatio: 200, //300  //--左右塞的力量系数
                prickForceRatio: 10,  //--扎杆的旋转强度，越大旋转越强烈(弧线球)

                // lineSpeedRatio : 13,
                // lineForceRatio : 3000,
                // rotateForceRatio : 5000,
                // leftRightForceRatio : 150,
                // prickForceRatio : 100,

                ballVelocityLimit: 4

            }
        }
    },
    UI: {
        TYPE_BACK_GROUND: {
            COMMON: 0,//index list background
            TABLE: 1,//index list background,
            LUCKY_SHOT: 1
        },
        OPEN: "OPEN"
    },
    PLAY_MODE: {
        OFFLINE: 0,
        ONLINE: 1
    },
    LOGIN_EVENT: {
        LOGINED_SUCCESS: "LOGINED_SUCCESS",
        LOGOUTED_SUCCESS: "LOGOUTED_SUCCESS",
        CONFIG_HOME_LOGIN: "CONFIG_HOME_LOGIN"
    },
    BUTTON_EVENT: {
        PLAY_OFFLINE_CLICK: "PLAY_OFFLINE_CLICK",
    },
    POPUP_EVENT: {
        CUE_STORE: {
            OPEN: "OPEN_CUE_STORE",
            CLOSE: "CLOSE_CUE_STORE",
            SEND_CUEID: "SEND_CUEID"
        },
        RANK_RECHARSE: {
            OPEN: "OPEN_RANK_RECHARSE",
            CLOSE: "CLOSE_RANK_RECHARSE"
        },
        LIST_CUE: {
            OPEN: "OPEN_LIST_CUE",
            CLOSE: "CLOSE_LIST_CUE"
        },
        SETTING: {
            OPEN: "OPEN_SETTING_POPUP",
            CLOSE: "CLOSE_SETTING_POPUP"
        },
        USER_INFO: {
            OPEN: "OPEN_USER_INFO",
            CLOSE: "CLOSE_USER_INFO"
        },
        XU_STORE: {
            OPEN: "OPEN_XU_STORE",
            CLOSE: "CLOSE_XU_STORE"
        },
        XU_FREE_STORE: {
            OPEN: "OPEN_XU_FREE",
            CLOSE: "CLOSE_XU_FREE"
        },
        GIFT_CODE: {
            OPEN: "OPEN_GIFT_CODE",
            CLOSE: "CLOSE_GIFT_CODE"
        },
        GUIDE: {
            OPEN: "OPEN_GUIDE",
            CLOSE: "CLOSE_GUIDE"
        },
        MESSAGE: {
            OPEN: "OPEN_MESSAGE",
            CLOSE: "CLOSE_MESSAGE"
        },
        FRIEND_ZONE: {
            OPEN: "OPEN_FRIEND_ZONE",
            CLOSE: "CLOSE_FRIEND_ZONE",
            CLOSED: "ClOSED_FRIEND_ZONE",
            FIND_FRIEND_TAB: {
                OPEN: "OPEN_FIND_FRIEND_TAB"
            },
            INVITE_FRIEND_TAB: {
                OPEN: "OPEN_INVITE_FRIEND_TAB"
            }
        },
        EVENT: {
            OPEN: "OPEN_EVENT",
            CLOSE: "CLOSE_EVENT"
        },
        CHAT: {
            OPEN: "OPEN_CHAT",
            CLOSE: "CLOSE_CHAT",
        },
        CHAT_PRIVATE: {
            OPEN: "OPEN_CHAT",
            CLOSE: "CLOSE_CHAT",
            COUNT: "COUNT_CHAT"
        },
        PANEL_MENU: {
            OPEN: "OPEN_PANEL_MENU",
            CLOSE: "CLOSE_PANEL_MENU"
        },
        PANEL_PLAYER_VIEW: {
            OPEN: "OPEN_PANEL_PLAYER_VIEW",
            CLOSE: "CLOSE_PANEL_PLAYER_VIEW"
        },
        VQMM: {
            OPEN: "OPEN_VQMM",
            CLOSE: "CLOSE_VQMM"
        },
        SIGN_IN: {
            OPEN: "OPEN_SIGN-IN",
            CLOSE: "CLOSE_SIGN-IN"
        },
        SIGN_UP: {
            OPEN: "OPEN_SIGN-UP",
            CLOSE: "CLOSE_SIGN-UP"
        },
        INVITE_SEND: {
            OPEN: "OPEN_INVITE_SEND",
            CLOSE: "CLOSE_INVITE_SEND"
        },
        INVITE_SEND_PLAY_WITH_FRIEND: {
            OPEN: "OPEN_INVITE_SEND_PLAY_WITH_FRIEND",
            CLOSE: "CLOSE_INVITE_SEND_PLAY_WITH_FRIEND"
        },
        DAILY_GIFT: {
            OEPN: "OEPN_DAILY_GIFT",
            CLOSE: "CLOSE_DAILY_GIFT"
        },
        LEADERBOARD: {
            OPEN: "OPEN_LEADERBOARD",
            CLOSE: "CLOSE_LEADERBOARD"
        },
        MINIGAME: {
            OPEN: "OPEN_MINIGAME",
            CLOSE: "CLOSE_MINIGAME"
        },
        MINI_PORKER: {
            OPEN: "OPEN_MINI_PORKER",
            CLOSE: "CLOSE_MINI_PORKER"
        },
        MINI_SLOT: {
            OPEN: "OPEN_MINI_SLOT",
            CLOSE: "CLOSE_MINI_SLOT"
        },
        LARVA: {
            OPEN: "OPEN_LARVA",
            CLOSE: "CLOSE_LARVA"
        },
    },
    GAME_COMMONS_EVENT: {
        SET_USER_NAME: "SET_USER_NAME",
        SET_USER_MONEY: "SET_USER_MONEY",
        SET_USER_LEVEL: "SET_USER_LEVEL",
        SET_USER_EXP: "SET_USER_EXP",
        SET_USER_ID: "SET_USER_ID",
        SET_USER_AVATAR_AS_ID: "SET_USER_AVATAR_AS_ID",
        SET_USER_AVATAR_AS_FRAME: "SET_USER_AVATAR_AS_FRAME",
        BACK_TO_HOME_GAME: "BACK_TO_HOME_GAME",
        CHANGE_AVATAR: "CHANGE_AVATAR",
        CHANGE_DISPLAY_NAME: "CHANGE_DISPLAY_NAME",
        OPEN_HOME_MID: "OPEN_HOME_MID",
        CREATE_TABLE_1V1_PLAYERS: "CREATE_TABLE_1V1_PLAYERS",
        CREATE_TABLE_1V4_PLAYERS: "CREATE_TABLE_1V4_PLAYERS",
        OFFLINE_TIME_OUT: "OFFLINE_TIME_OUT",
        SHOW_GAME_LAYER: "SHOW_GAME_LAYER",
        HIDE_GAME_LAYER: "HIDE_GAME_LAYER",
        SHOW_HOME_LAYER: "SHOW_HOME_LAYER",
        SHOW_LOGIN_LAYER: "SHOW_LOGIN_LAYER",
        SHOW_LOBBY_LAYER: "SHOW_LOBBY_LAYER",
        DA_KHOI_TAO_XONG_BAN_CHOI: "DA_KHOI_TAO_XONG_BAN_CHOI",
        YEU_CAU_KHOI_TAO_WORLD_VAT_LY: "YEU_CAU_KHOI_TAO_WORLD_VAT_LY"
    },
    GAME_LOBBY_EVENT: {
        REQUEST_LOBBY_FOR_ZONE_ID_TYPE: "REQUEST_LOBBY_FOR_ZONE_ID_TYPE",
        REQUEST_JOIN_TABLE_WITH_TABLE_DATA: "REQUEST_JOIN_TABLE_WITH_TABLE_DATA",
        CREATE_TABLE_UI_WITH_MODE_1V4_PLAYERS: "CREATE_TABLE_UI_WITH_MODE_1V4_PLAYERS",
        CREATE_TABLE_UI_WITH_MODE_1V1_PLAYERS: "CREATE_TABLE_UI_WITH_MODE_1V1_PLAYERS",
        CREATE_TABLE_UI_WITH_MODE_LUCKYSHOT_PLAYERS: "CREATE_TABLE_UI_WITH_MODE_LUCKYSHOT_PLAYERS",
        CREATE_TABLE_UI_WITH_MODE_BIDA_PHOM_PLAYERS: "CREATE_TABLE_UI_WITH_MODE_BIDA_PHOM_PLAYERS",
        CREATE_TABLE_UI_PLAY_WITH_FRIEND: "CREATE_TABLE_UI_PLAY_WITH_FRIEND",
        CREATE_TABLE_ADD_ROOM: "CREATE_TABLE_ADD_ROOM"

    },
    GAME_TABLE_EVENT: {
        BALL_IN_HOLE_FINISH_ANIMATION: "BALL_IN_HOLE_FINISH_ANIMATION",
        REQUEST_LEAVE_TABLE: "REQUEST_LEAVE_TABLE",
        DANG_XAC_LAP_VI_TRI_VA_GOC_QUAY: "DANG_XAC_LAP_VI_TRI_VA_GOC_QUAY",
        DANG_XAC_LAP_LUC_BAN_BI: "DANG_XAC_LAP_LUC_BAN_BI",
        XAC_LAP_VI_TRI_GOC_BAN: "XAC_LAP_VI_TRI_GOC_BAN",
        GUI_THONG_TIN_LUC_BAN_LEN_CHO_NGUOI_DUNG_KHAC: "GUI_THONG_TIN_LUC_BAN_LEN_CHO_NGUOI_DUNG_KHAC",
        CHO_PHEP_GUI_DATA_LEN_SERVER: "CHO_PHEP_GUI_DATA_LEN_SERVER",
        CHO_PHEP_GUI_DATA_LEN_SERVER_CHECK: "CHO_PHEP_GUI_DATA_LEN_SERVER_CHECK",
        CHO_PHEP_NGUOI_DUNG_CLICK_CHUOT: "CHO_PHEP_NGUOI_DUNG_CLICK_CHUOT",
        NGAT_KHONG_CHO_NGUOI_DUNG_CLICK_CHUOT: "NGAT_KHONG_CHO_NGUOI_DUNG_CLICK_CHUOT",
        DANG_XAC_LAP_LUC_DANH_CUA_GAY: "DANG_XAC_LAP_LUC_DANH_CUA_GAY",
        SET_USER_TURN_ID: "SET_USER_TURN_ID",
        WBALL_FAIL: "WBALL_FAIL",
        CAP_NHAT_VI_TRI_VA_GOC_QUAY_CUA_GAY_TU_SERVER_GUI_XUONG: "CAP_NHAT_VI_TRI_VA_GOC_QUAY_CUA_GAY_TU_SERVER_GUI_XUONG",
        DANG_XAC_LAP_LUC_DANH_CUA_NGUOI_CHOI_KHAC: "DANG_XAC_LAP_LUC_DANH_CUA_NGUOI_CHOI_KHAC",
        GUI_YEU_CAU_AUTO_NEXT_TURN_LEN_SERVER: "GUI_YEU_CAU_AUTO_NEXT_TURN_LEN_SERVER",
        
        //FootBall
        SEND_TURN_PLAYER: "SEND_TURN_PLAYER",
    },
    ZONE_ID: {
        ZONEID_1VS1: 8,
        ZONEID_1VS4: 84,
        ZONEID_THACH_DAU: 85,
        ZONEID_SHOOTING_RACE: 44,
        ZONEID_PENALTY: 44,
        ZONEID_BIDA_LUCKY_SHOT: 87
    },
    // GAME: {
    //     STATUS: {
    //         BALL_ERROR: {
    //             KHONG_XAC_DINH: 0,
    //             LUOT_DANH_HOP_LE: 1,
    //             BI_CAI_ROI_XONG_LO: -1,
    //             BI_ROI_XUONG_LO_KHONG_PHAI_CUA_MINH: -4,
    //             BI_SO_8_ROI_XUONG_LO_NHUNG_CHUA_HET_BI_CUA_MINH: -5,
    //             BI_SO_8_ROI_XUONG_LO_NHUNG_KHONG_HOP_LE: -3,
    //             BI_MUC_TIEU_KHONG_CHAM_BAT_CU_BI_NAO_CA: -8,
    //             BI_MUC_TIEU_DA_CHAM_VAO_MOT_BI_NAO_DO: 1
    //         }
    //     },
    //     CONFIG: {
    //         THOI_GIAN_CHO_KHI_BOI_DANH_BI: 3,//cho 3 giay moi cho danh tiep
    //         THOI_GIAN_CHO_KHI_BI_8_ROI_XUONG: 10,
    //         THOI_GIAN_CHO_BAT_DAU_TRAN_1_VS_4: 10,
    //         THOI_GIAN_CHO_BAT_DAU_TRAN_1_VS_1: 10,

    //     }

    // },
    LANGUAGE: {
        VIETNAMESE: "vi",
        ENGLISH: "en",
        RUSSIAN: "ru",
        CHINESE: "zh",
    },
    PHYSIC_TAGS: {
        WALL: 0,
        BALL: 1,
        HOLE: 2
    },
    FRIEND_ZONE: {
        // status 0 lay tat , status: 1 bạn bè, 2 những lời mời kết bạn, 3 list friend online
        GET_TAT_CA_NGUOI_CHOI_LA_BAN_BE_KET_CA_LOI_MOI: 0,
        GET_TAT_CA_LA_BAN_BE: 1,
        GET_TAT_CA_LOI_MOI_KET_BAN: 2,
        GET_TAT_CA_BAN_BE_DANG_ON_LINE: 3
    },
    MONEY_TYPE: {
        XU: 0,
        QUAN: 1
    },

    LUCKY_SHOT_TYPE: {
        TRIAL: 0,
        MAX_WIN: 1,
        RESPONSE_RESULT: 2,
        TYPE_PLAY_CHECK_ROUND: 1,
        TYPE_PLAY_RESULT: 2
    },

    LUCKY_SHOT_EVENT: {
        SEND_COORD_BI: "SEND_COORD_BI",
        SEND_RESULT: "SEND_RESULT"
    },

    LUCKY_SHOT_TAG: {
        ROUND_1: 10,
        ROUND_2: 11,
        ROUND_3: 12,
        ROUND_4: 13,
        ROUND_5: 14
    },
    SOUND_PATH: {
        SOUND_VI: "bida/sound/sound_vi",
        SOUND_EN: "bida/sound/sound_en"
    },
    RANK_TYPE: {
        MONEY: 1,
        TOTAL_WIN: 2,
        EXPERIENT: 3,
        TOTAL_PLAY: 4
    }
};


//FootBall

FootBallConstant.AMOUNT_TARGET = 5;

FootBallConstant.PENALTY = {
    ZONE: 0,
    GOALIE: {
        ID: 1,
        POSITION: cc.v3(33.624, 0, 0),
        CAMERA: {
            POSITION: cc.v3(),
            ANGLES: cc.v3()
        }
    },
    PLAYER: {
        ID: 2,
        POSITION: cc.v3(),
        CAMERA: {
            POSITION: cc.v3(12.994, 3.195, 0),
            ANGLES: cc.v3(0, -90, 0)
        }
    },

    BALL: {
        POSITION: cc.v3(18.899, 0.204, 0)
    },

    CONVERT_ID: function (id) {
        var position = null;
        switch (id)
        {
            case FootBallConstant.PENALTY.GOALIE.ID:
                position = FootBallConstant.PENALTY.GOALIE.BALL.POSITION;
                break;
            case FootBallConstant.PENALTY.PLAYER.ID:
                position = FootBallConstant.PENALTY.PLAYER.BALL.POSITION;
                break;
        }
        return position;
    }
}

FootBallConstant.LEG = {
    LEFT: {
        LEFT: cc.v3(800, 800, -800),
        CENTER: cc.v3(220, 800, -800),
        RIGHT: cc.v3(-200, 800, -800)
    },
    RIGHT: {
        LEFT: cc.v3(-800, 800, -800),
        CENTER: cc.v3(-200, 800, -800),
        RIGHT: cc.v3(200, 800, -800)
    }
};

FootBallConstant.LOCATION_BALL = {
    POS_0: {
        ID: 0,
        BALL: {
            x: 18.899,
            y: 0.204,
            z: 0
        },
        CAMERA_PLAYER: {
            ANGLES: cc.v3(-3, -85, 0),
            POSITION: cc.v3(15.889, 1.5, 1.105)
        },
        PLAYER: {
            ANGLES: cc.v3(0, 90, 0),
            //POSITION: cc.v3(16.798, 0, -0.609)
            POSITION: cc.v3(15.019, 0, -1.495)
        },
        GOALIE: {
            ANGLES: cc.v3(0, -90, 0),
            POSITION: cc.v3(33.019, 0, 0)
        },
        CAMERA_GOALIE: {
            ANGLES: cc.v3(0, 115, 0),
            POSITION: cc.v3(38.367, 2.878, -4.225)
        }
    },
    POS_1: {
        ID: 1,
        BALL: {
            x: 18.899,
            y: 0.204,
            z: 4
        },
        CAMERA_PLAYER: {
            ANGLES: cc.v3(0, -92.91, 0),
            POSITION: cc.v3(14.556, 1.751, 2.542)
        },
        PLAYER: {
            ANGLES: cc.v3(0, 100, 0),
            POSITION: cc.v3(16.391, 0, 4.242)
        },
        GOALIE: {
            ANGLES: cc.v3(0, -80, 0),
            POSITION: cc.v3(32.599, 0, 0)
        },
        CAMERA_GOALIE: {
            ANGLES: cc.v3(0, 90, 0),
            POSITION: cc.v3(38.367, 3.357, 0)
        }
    },
    POS_2: {
        ID: 2,
        BALL: {
            x: 18.899,
            y: 0.204,
            z: 8
        },
        CAMERA_PLAYER: {
            ANGLES: cc.v3(-5, -95, 0),
            POSITION: cc.v3(14.404, 2.716, 5.56)
        },
        PLAYER: {
            ANGLES: cc.v3(0, 100, 0),
            POSITION: cc.v3(17.047, 0, 7.956)
        },
        GOALIE: {
            ANGLES: cc.v3(0, -75, 0),
            POSITION: cc.v3(33.019, 0, 0)
        },
        CAMERA_GOALIE: {
            ANGLES: cc.v3(0, 96, 0),
            POSITION: cc.v3(38.367, 2.878, 0.799)
        }
    },
    POS_3: {
        ID: 3,
        BALL: {
            x: 18.899,
            y: 0.204,
            z: -4
        },
        CAMERA_PLAYER: {
            ANGLES: cc.v3(0, -95, 0),
            POSITION: cc.v3(14.556, 1.751, -2.542)
        },
        PLAYER: {
            ANGLES: cc.v3(0, 90, 0),
            POSITION: cc.v3(17.206, 0, -4.357)
        },
        GOALIE: {
            ANGLES: cc.v3(0, -105, 0),
            POSITION: cc.v3(33.019, 0, 0)
        },
        CAMERA_GOALIE: {
            ANGLES: cc.v3(0, 85, 0),
            POSITION: cc.v3(38.367, 2.878, -0.671)
        }
    },
    POS_4: {
        ID: 4,
        BALL: {
            x: 18.899,
            y: 0.204,
            z: -8
        },
        CAMERA_PLAYER: {
            ANGLES: cc.v3(0, -85, 0),
            POSITION: cc.v3(14.103, 2.428, -4.407)
        },
        PLAYER: {
            ANGLES: cc.v3(0, 90, 0),
            POSITION: cc.v3(16.985, 0, -8.309)
        },
        GOALIE: {
            ANGLES: cc.v3(0, -120, 0),
            POSITION: cc.v3(33.019, 0, 0)
        },
        CAMERA_GOALIE: {
            ANGLES: cc.v3(0, 65, 0),
            POSITION: cc.v3(38.367  , 2.878, 4.225)
        }
    },
};

FootBallConstant.COLLIDER_TARGET = {
    CENTER: 1,
    NON_CENTER: 0
}
FootBallConstant.TIME_BREAK = 0.3;

FootBallConstant.TIME_ANIMATION = {
    //1-7 la animation thu mon
    //8-9 la animation cauthu

    //Note: De so thap phan se bi tu dong lam tron
    //Goc duoi ben phai
    ACTION_1: {
        TIME_BEGIN: 0,
        TIME: 200
    },
    //Goc duoi ben trai
    ACTION_2: {
        TIME_BEGIN: 320,
        TIME: 200
    },
    //Cheo ben phai
    ACTION_3: {
        TIME_BEGIN: 1240,
        TIME: 240
    },
    //Cheo ben trai
    ACTION_4: {
        TIME_BEGIN: 1570,
        TIME: 240
    },
    //Nhay thang bat
    ACTION_5: {
        TIME_BEGIN: 1870,
        TIME: 200
    },
    //Nghi
    ACTION_6: {
        TIME_BEGIN: 2100,
        TIME: 430
    },
    // //Animation cau thu
    // ACTION_8: {
    //     TIME_BEGIN: 0,
    //     TIME: 1.8
    // },
    // ACTION_9: {
    //     TIME_BEGIN: 15,
    //     TIME: 15
    // },

    //Idle yellow
    ACTION_8: {
        TIME_BEGIN: 500,
        TIME: 500
    },
    //Idle white
    ACTION_10: {
        TIME_BEGIN: 500,
        TIME: 500
    },
    //Win Yellow
    ACTION_11: {
        TIME_BEGIN: 110,
        TIME: 40
    },
    //Win white
    ACTION_12: {
        TIME_BEGIN: 1050,
        TIME: 350
    },
    ACTION_9: {
        TIME_BEGIN: 1550,
        TIME: 350
    },
    ACTION_13: {
        TIME_BEGIN: 1400,
        TIME: 350
    },
    //Vang sut bong
    ACTION_14: {
        TIME_BEGIN: 335,
        TIME: 140,
    },
    //Trang sut bong
    ACTION_15: {
        TIME_BEGIN: 175,
        TIME: 150
    }
}

module.exports = FootBallConstant;