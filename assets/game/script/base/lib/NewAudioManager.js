var Global = require('Global');
var Linker = require('Linker');
var Utils = require('Utils');
var BiDaConstant = require('BiDaConstant');
var Constant = require('Constant');
var AudioManager = {
    initCommonSoundGame: function (data) {
        var gameName = data.gameName;
        var bundleName = data.bundleName;
        if (gameName && bundleName) {
            if (this.SOUND_GAME.hasOwnProperty(gameName)) {
                this.SOUND_GAME[gameName].AudioManager = this;
                if (bundleName) {
                    this.SOUND_GAME[gameName].getAudioClipByFilePath = function (filePath) {
                        if (this.SOUND_GAME[gameName].sounds) {
                            var _soundName = Utils.Malicious.sliceStringFromRight("/", filePath);
                            if (this.SOUND_GAME[gameName].sounds.hasOwnProperty(_soundName)) {
                                return this.SOUND_GAME[gameName].sounds[_soundName];
                            }
                        }
                        return null;
                    }.bind(this);
                    this.SOUND_GAME[gameName].playAudioClip = function (filePath, volume, loop, isBundle) {
                        var clip = this.SOUND_GAME[gameName].getAudioClipByFilePath(filePath);
                        if (clip) {
                            if (this.SOUND_GAME[gameName].hasOwnProperty("AudioManager")) {
                                this.SOUND_GAME[gameName].AudioManager.playClip(clip, volume, loop);
                            }
                        } else {
                            if (this.SOUND_GAME[gameName].hasOwnProperty("AudioManager")) {
                                this.SOUND_GAME[gameName].AudioManager.playAudioClipFX(filePath, volume, loop, isBundle, bundleName);
                            }
                        }
                    }.bind(this);
                }
                if (!this.SOUND_GAME[gameName].sounds) {
                    this.SOUND_GAME[gameName].sounds = {};
                    this.getBundleByName(bundleName, function (err, bundle) {
                        if (!err) {
                            //lưu ý tât cả file âm thanh chỉ để trong một thư mục sound, không tạo thêm các thư mục con trong sound
                            bundle.loadDir("sounds", cc.AudioClip, function (error, audioClips) {
                                if (!error) {
                                    cc.log("Load resource âm thanh thanh cong", audioClips);
                                    for (var i = 0; i < audioClips.length; i++) {
                                        var _audioClip = audioClips[i];
                                        var _audioClipName = _audioClip.name;
                                        if (_audioClipName.length > 0) {
                                            if (!this.SOUND_GAME[gameName].sounds.hasOwnProperty(_audioClipName)) {
                                                this.SOUND_GAME[gameName].sounds[_audioClipName] = {};
                                            }
                                            this.SOUND_GAME[gameName].sounds[_audioClipName] = _audioClip;
                                        }
                                    }
                                } else {
                                    // cc.Global.showMessage(error);
                                    cc.log("Lỗi không thể load được resource âm thanh...", audioClips);

                                }
                            }.bind(this))
                        }
                    }.bind(this));
                }
            }
        }
    },
    _isMute: false,
    _isMuteBG: false,
    audioIDBG: null,
    audiocClick: null,
    audioBiVaCham: null,
    audioBiRoiXuongLo: null,
    SOUND_GAME: {
        COMMON: {
            CLICK: "click",
            TOGGLE: "toggle",
            CHANGE_QUAN: "change_coin_quan",
            CHANGE_XU: "change_coin_xu",
            BACKGROUND: "sound/background_default",
            JOIN_ROOM: "sound/joinboard"
        },
        BIDA: {
            COMMON: {
                MONEY_FLY: "sound/money_fly.mp3",
                WIN_EFFECT: "sound/win.mp3",
                BACKGROUND: "sound/background"
            },
            VI: {

                ENTER_HOME: [
                    `sound/sound_vi/v1`,
                    `sound/sound_vi/v3`
                ],
                ENTER_LOBBY: `sound/sound_vi/v5`,
                START_GAME: `sound/sound_vi/v6`,
                FIRST_TURN: `sound/sound_vi/v10`,
                WIN: `sound/sound_vi/v12`,
                LOSE: `sound/sound_vi/v15`,
                SCRORED: `sound/sound_vi/v17`,
                NOT_SCORED: `sound/sound_vi/v20`,
                MY_TURN: `sound/sound_vi/v24`,
                GUILTY: `sound/sound_vi/v28`,
                TIME_OUT: `sound/sound_vi/v30`,
                SLIDE_POWER: "sound/sound_vi/v31",
                COFFER: `sound/sound_vi/v38`,
                OPEN_BUY_CUE: `sound/sound_vi/v39`,
                STRIPE_BALL: `sound/sound_vi/v42`,
                SOLID_BALL: `sound/sound_vi/v43`,
                TOPUP: `sound/sound_vi/v44`,
                GET_REWARD: "sound/sound_vi/v59",

            },
            EN: {
                ENTER_HOME: [
                    `sound/sound_en/v1`,
                    `sound/sound_en/v3`
                ],
                ENTER_LOBBY: `sound/sound_en/v5`,
                START_GAME: `sound/sound_en/v6`,
                FIRST_TURN: `sound/sound_en/v10`,
                WIN: `sound/sound_en/v12`,
                LOSE: `sound/sound_en/v15`,
                SCRORED: `sound/sound_en/v17`,
                NOT_SCORED: `sound/sound_en/v20`,
                MY_TURN: `sound/sound_en/v24`,
                GUILTY: `sound/sound_en/v28`,
                TIME_OUT: `sound/sound_en/v30`,
                SLIDE_POWER: "sound/sound_en/v31",
                COFFER: `sound/sound_en/v38`,
                OPEN_BUY_CUE: `sound/sound_en/v39`,
                STRIPE_BALL: `sound/sound_en/v42`,
                SOLID_BALL: `sound/sound_en/v43`,
                TOPUP: `sound/sound_en/v44`,
                GET_REWARD: "sound/sound_vi/v59",
            }
        },
        HEROES_BALL: {
            COMMON: {
                BACKGROUND: "sounds/background",
                JOIN_ROOM: "sound/joinboard"
            },
            VI: {
            },
            EN: {
            }
        },
        PHI_DAO: {
            COMMON: {
                BOSS: "Resource/Sound/boss",
                NEXTLEVEL: "Resource/Sound/nextLevel",
                WINLOSE: "Resource/Sound/thua",
                BIA_1: "Resource/Sound/trung_bia_1",
                BIA_2: "Resource/Sound/trung_bia_2",
                BIA_3: "Resource/Sound/trung_bia_3",
                TRUNG_DAO: "Resource/Sound/trung_dao",
                TRUNG_ITEM: "Resource/Sound/trung_item",
                VO_KHIEN: "Resource/Sound/vo_khien"
            }
        },
        SOCCER_GALAXY: {
            COMMON: {
                BACKGROUND: "sounds/background",
                CLICK_CHON_DOI_HINH: "sounds/sfx_chondoihinh",
                START_MATCH: "sounds/sfx_start_game",
                JOIN_ROOM: ["sounds/sfx_join_room_1", "sounds/sfx_join_room_2", "sounds/sfx_join_room_3", "sounds/sfx_join_room_4"],
                TIMER_TURN_COUNT: "sounds/sfx_timer_count",
                TIMER_TURN_FINAL_COUNT: "sounds/sfx_timer_final_count",
                TIMER_TURN_FINISH_COUNT: "sounds/sfx_timer_finish_count",
                BALL_HIT_TO_METAL_POLE: "sounds/sfx_ballhitmetal",
                PLAYER_HIT_TO_METAL_POLE: "sounds/sfx_playerhitmetal",
                KICK_BALL: "sounds/sfx_kick_ball",
                VAO: "sounds/sfx_goal",
                THONG_BAO_VAO: "sounds/sfx_thongbao_vao",
                THONG_BAO_VAO_ARR: ["sounds/sfx_thongbao_vao_1", "sounds/sfx_thongbao_vao_2", "sounds/sfx_thongbao_vao_3", "sounds/sfx_thongbao_vao_4", "sounds/sfx_thongbao_vao_5"],
                BI_VAO_ARR: ["sounds/sfx_bivao_1", "sounds/sfx_bivao_2", "sounds/sfx_bivao_3"],
                YOUR_TURN: "sounds/sfx_your_turn",
                OPPONENT_TURN: "sounds/sfx_opponent_turn",
                COI_KET_THUC_TRAN_DAU: "sounds/sfx_end_game",
                YOU_WIN: "sounds/sfx_you_win",
                YOU_LOSE: "sounds/sfx_you_lose",
                // PLAYER_HIT_PLAYER_ARR: ["sounds/sfx_player_hit_player_1", "sounds/sfx_player_hit_player_2", "sounds/sfx_player_hit_player_3"],
                PLAYER_HIT_PLAYER_ARR: ["sounds/sfx_player_hit_ball_1", "sounds/sfx_player_hit_ball_2", "sounds/sfx_player_hit_ball_3"],
                PLAYER_HIT_BALL_ARR: ["sounds/sfx_player_hit_ball_1", "sounds/sfx_player_hit_ball_2", "sounds/sfx_player_hit_ball_3"],
                NEW_MESSAGE_IN_GAME: "sounds/sfx_new_message"
            },
            VI: {

            },
            EN: {
            }
        },
        DRAGON_LEGEND: {
            COMMON: {
                BACKGROUND: "sounds/background",
                BACKGROUND2: "sounds/background2",
                AN_LINE_CO_WILD: "sounds/anlinecowild",
                AN_LINE_CO_FREE: "sounds/anlinefree",
                AN_LINE_THUONG: "sounds/anlinethuong",
                BACK_VQMM_RA_SLOT: "sounds/vqmmbackgame",
                AUDIO_2: "sounds/reelstop",
                REEL_STOP: "sounds/audio2",
                AUDIO_4: "sounds/audio4",
                AUDIO_5: "sounds/audio5",
                COLECT_BONUS_VQMM: "sounds/collectcoin",
                AUDIO_7: "sounds/audio7",
                BIG_WIN: "sounds/Bigwin",
                DRAGON_LEGEND1: "sounds/DragonLegend1",
                DRAGON_LEGEND2: "sounds/DragonLegend2",
                DRAGON_LEGEND3: "sounds/DragonLegend3",
                CA_CHEP_GO_CHUONG: "sounds/cachepgochuong",
                END_SPIN_SOUND: "sounds/endspinsound",
                CHUAN_BI_CO_VQMM: "sounds/chuanbicovqmm",
                REEL_BONUS: "sounds/reelbonus",
                SPIN: "sounds/Spin",
            },
            VI: {

            },
            EN: {
            }
        },
        HEAD_BALL: {
            COMMON: {
                BACKGROUND: "sounds/background"
            },
            VI: {
            },
            EN: {
            }
        },
        FOOT_BALL: {
            COMMON: {
                BACKGROUND: "sounds/background",
                COI: "sounds/coi1",
                CO_VU: "sounds/sfx_join_room_1",
                END_GAME: "sounds/sfx_end_game",
                KICK_BALL: "sounds/sfx_kick_ball",
                MISS: "sounds/miss",
                COLLISION: "sounds/dapkhungthanh",
                GOAL: "sounds/sfx_vao"
            },
            VI: {
            },
            EN: {
            }
        },
        TLMN: {
            COMMON: {
                MOT_2: "sounds/mot2",
                MOT_3: "sounds/mot3",
                MOT_4: "sounds/mot4",
                MOT_5: "sounds/mot5",
                MOT_6: "sounds/mot6",
                MOT_7: "sounds/mot7",
                MOT_8: "sounds/mot8",
                MOT_9: "sounds/mot9",
                MOT_10: "sounds/mot10",
                MOT_1: "sounds/motA",
                MOT_11: "sounds/motJ",
                MOT_12: "sounds/motQ",
                MOT_13: "sounds/motK",
                DOI_2: "sounds/doi2",
                DOI_3: "sounds/doi3",
                DOI_4: "sounds/doi4",
                DOI_5: "sounds/doi5",
                DOI_6: "sounds/doi6",
                DOI_7: "sounds/doi7",
                DOI_8: "sounds/doi8",
                DOI_9: "sounds/doi9",
                DOI_10: "sounds/doi10",
                DOI_1: "sounds/doiA",
                DOI_11: "sounds/doiJ",
                DOI_12: "sounds/doiQ",
                DOI_13: "sounds/doiK",
                BA_2: "sounds/ba2",
                BA_3: "sounds/ba3",
                BA_4: "sounds/ba4",
                BA_5: "sounds/ba5",
                BA_6: "sounds/ba6",
                BA_7: "sounds/ba7",
                BA_8: "sounds/ba8",
                BA_9: "sounds/ba9",
                BA_10: "sounds/ba10",
                BA_1: "sounds/baA",
                BA_11: "sounds/baJ",
                BA_12: "sounds/baQ",
                BA_13: "sounds/baK",
                BON_3: "sounds/bon3",
                BON_4: "sounds/bon4",
                BON_5: "sounds/bon5",
                BON_6: "sounds/bon6",
                BON_7: "sounds/bon7",
                BON_8: "sounds/bon8",
                BON_9: "sounds/bon9",
                BON_10: "sounds/bon10",
                BON_1: "sounds/bonA",
                BON_11: "sounds/bonJ",
                BON_12: "sounds/bonQ",
                BON_13: "sounds/bonK",
                BA_DOI_THONG: "sounds/BaDoiThong",
                BON_DOI_THONG: "sounds/BonDoiThong",
                BO_LUOT: "sounds/BoLuot",
                CHIA_BAI: "sounds/ChiaBai",
                DANH_BAI: "sounds/DanhBai",
                DANH_NE: "sounds/DanhNe",
                CHAO_CA_NHA: "sounds/ChaoCaNha",
                GAN_HET_THOI_GIAN: "sounds/GanHetThoiGian",
                MO_BAI: "sounds/MoBai",
                SANH: "sounds/Sanh",
                THANG: "sounds/Thang",
                THUA: "sounds/Thua",
                THOAT_BAN: "sounds/ThoatBan",
                TOI_TRANG: "sounds/ToiTrang"
            },
            VI: {
            },
            EN: {
            }
        },
        PHOM: {
            COMMON: {
                AN_BAI: "sounds/AnBai",
                CHIA_BAI: "sounds/ChiaBai",
                DANH_BAI: "sounds/DanhBai",
                CHAO_CA_NHA: "sounds/ChaoCaNha",
                GAN_HET_THOI_GIAN: "sounds/GanHetThoiGian",
                BOC_BAI: "sounds/BocBai",
                MO_BAI: "sounds/MoBai",
                THANG: "sounds/Thang",
                THUA: "sounds/Thua",
                
                AN_CAY_THU_2_1: "sounds/ancaythu2_1",
                AN_CAY_THU_2_2: "sounds/ancaythu2_2",
                AN_CAY_THU_2_3: "sounds/ancaythu2_3",
                AN_CAY_THU_2_4: "sounds/ancaythu2_4",
                AN_CAY_THU_2_5: "sounds/ancaythu2_5",
                BAT_DAU_1: "sounds/batdau_1",
                BAT_DAU_2: "sounds/batdau_2",
                BAT_DAU_3: "sounds/batdau_3",
                BAT_DAU_4: "sounds/batdau_4",
                BAT_DAU_5: "sounds/batdau_5",
                BET: "sounds/bet",
                NHAT_1: "sounds/nhat_1",
                NHAT_2: "sounds/nhat_2",
                VAO_BAN: "sounds/vaoban",
                DANH_BAI_1: "sounds/danhbai_1",
                DANH_BAI_2: "sounds/danhbai_2",
                DANH_BAI_3: "sounds/danhbai_3",
                DANH_BAI_4: "sounds/danhbai_4",
                DANH_BAI_5: "sounds/danhbai_5",
                DANH_BAI_6: "sounds/danhbai_6",
                DANH_BAI_7: "sounds/danhbai_7",
                DANH_CAY_CHOT_1: "sounds/danhcaychot_1",
                DANH_CAY_CHOT_2: "sounds/danhcaychot_2",
                DANH_CAY_CHOT_3: "sounds/danhcaychot_3",
                DANH_CAY_CHOT_4: "sounds/danhcaychot_4",
                MOM_1: "sounds/mom_1",
                MOM_2: "sounds/mom_2",
                MOM_3: "sounds/mom_3",
                AN_CHOT_1: "sounds/anchot_1",
                AN_CHOT_2: "sounds/anchot_2",
            },
            VI: {
            },
            EN: {
            }
        },
        MAUBINH: {
            COMMON: {
                CHAO_CA_NHA: "sounds/ChaoCaNha",
                THANG: "sounds/win_2",
                TOI_TRANG: "sounds/toitrang",
                GAN_HET_THOI_GIAN: "sounds/time_out",
                DANH_BAI: "sounds/danh",
                XEP_BAI: "sounds/pass",
                CHESS_WIN: "sounds/chess_win",
                CHIA_BAI: "sounds/chiabai",
                CHESS_LOSE: "sounds/chess_lose",
                CARD_SLIDE: "sounds/card_slide",
                BINH_LUNG: "sounds/binh_lung",
            },
            VI: {
            },
            EN: {
            }
        },
        VQMM: {
            COMMON: {
                SPIN: "sounds/spin"
            },
            VI: {
            },
            EN: {
            }
        },
        TRANG_CHU: {
            COMMON: {
                BONG_DA: "sounds/amthanh_bongda",
                COI_XE: "sounds/amthanh_coixebuyt",
                GIO: "sounds/amthanh_gio",
                PHI_DAO: "sounds/amthanh_phidao",
                TIENG_SUNG: "sounds/amthanh_tiengbansung",
                SONG_NUOC: "sounds/amthanh_tiengsongnuoc",
            },
            VI: {
            },
            EN: {
            }
        },
    },
    PlayWelcomeGame: function () {
        //zone bida
        if (Linker.ZONE == 84 || Linker.ZONE == 8 || Linker.ZONE == 86) {
            var indexSound = Utils.Malicious.getRandomIntInclusive(0, this.SOUND_GAME.BIDA.VI.ENTER_HOME.length - 1);
            this.PlayUrl(Linker.gameLanguage == "vi" ? this.SOUND_GAME.BIDA.VI.ENTER_HOME[indexSound] : this.SOUND_GAME.BIDA.EN.ENTER_HOME[indexSound]);
        }
    },
    stopAllSoundEffect: function () {
        cc.audioEngine.stopAll();
    },

    stopSoundBackground: function () {
        this.audioIDBG = null;
        this.audiocClick = null;
        cc.audioEngine.stopAll();
    },

    muteSound: function (isMuted) {
        this._isMute = isMuted;
    },

    muteMusic: function (isMuted) {
        this._isMuteBG = isMuted;
        if (isMuted) {
            this.stopSoundBackground();
        }
    },

    playCountDown: function (filePath) {
        if (!filePath) {
            return;
        }
        this.checkLocalStorageSound();
        if (this._isMute) return;
        this.stopSoundBackground();

        var url = cc.url.raw(filePath);
        cc.audioEngine.play(url, true, 0.8);
    },

    playEffect: function (filePath, isLoop) {
        if (!filePath) {
            return;
        }
        this.checkLocalStorageSound();
        if (this._isMute) return;

        if (isLoop == undefined) {
            isLoop = false;
        }

        var url = cc.url.raw(filePath);
        return cc.audioEngine.play(url, isLoop, 0.8);
    },
    getPathMusicByZone: function (zoneId) {
        zoneId = zoneId ? zoneId : Linker.ZONE ? Linker.ZONE : null;
        var data = {
            background: this.SOUND_GAME.COMMON.BACKGROUND,
            joinRoom: this.SOUND_GAME.COMMON.JOIN_ROOM,
            timeTurnCount: this.SOUND_GAME.COMMON.TIMER_TURN_COUNT,
            timeTurnFinalCount: this.SOUND_GAME.COMMON.TIMER_TURN_FINAL_COUNT,
            timeTurnFinishCount: this.SOUND_GAME.COMMON.TIMER_TURN_FINISH_COUNT,
        }
        if (!zoneId) {
            data.background = this.SOUND_GAME.COMMON.BACKGROUND;
            data.joinRoom = this.SOUND_GAME.COMMON.JOIN_ROOM;
            data.timeTurnCount = this.SOUND_GAME.COMMON.TIMER_TURN_COUNT;
            data.timeTurnFinalCount = this.SOUND_GAME.COMMON.TIMER_TURN_FINAL_COUNT;
            data.timeTurnFinishCount = this.SOUND_GAME.COMMON.TIMER_TURN_FINISH_COUNT;
        }
        if (zoneId == 8 || zoneId == 84 || zoneId == 86) {
            data.background = this.SOUND_GAME.BIDA.COMMON.BACKGROUND;
            data.joinRoom = this.SOUND_GAME.BIDA.COMMON.JOIN_ROOM;
            data.timeTurnCount = this.SOUND_GAME.BIDA.COMMON.TIMER_TURN_COUNT;
            data.timeTurnFinalCount = this.SOUND_GAME.BIDA.COMMON.TIMER_TURN_FINAL_COUNT;
            data.timeTurnFinishCount = this.SOUND_GAME.BIDA.COMMON.TIMER_TURN_FINISH_COUNT;
        } else if (zoneId == 44) {
            data.background = this.SOUND_GAME.FOOT_BALL.BACKGROUND;
            data.joinRoom = this.SOUND_GAME.FOOT_BALL.COMMON.JOIN_ROOM;
            data.timeTurnCount = this.SOUND_GAME.FOOT_BALL.COMMON.TIMER_TURN_COUNT;
            data.timeTurnFinalCount = this.SOUND_GAME.FOOT_BALL.COMMON.TIMER_TURN_FINAL_COUNT;
            data.timeTurnFinishCount = this.SOUND_GAME.FOOT_BALL.COMMON.TIMER_TURN_FINISH_COUNT;
        } else if (zoneId == 45) {
            data.background = this.SOUND_GAME.SOCCER_GALAXY.COMMON.BACKGROUND;
            data.joinRoom = this.SOUND_GAME.SOCCER_GALAXY.COMMON.JOIN_ROOM;
            data.timeTurnCount = this.SOUND_GAME.SOCCER_GALAXY.COMMON.TIMER_TURN_COUNT;
            data.timeTurnFinalCount = this.SOUND_GAME.SOCCER_GALAXY.COMMON.TIMER_TURN_FINAL_COUNT;
            data.timeTurnFinishCount = this.SOUND_GAME.SOCCER_GALAXY.COMMON.TIMER_TURN_FINISH_COUNT;
        } else if (zoneId == 46) {
            data.background = this.SOUND_GAME.HEAD_BALL.COMMON.BACKGROUND;
            data.joinRoom = this.SOUND_GAME.HEAD_BALL.COMMON.JOIN_ROOM;
            data.timeTurnCount = this.SOUND_GAME.HEAD_BALL.COMMON.TIMER_TURN_COUNT;
            data.timeTurnFinalCount = this.SOUND_GAME.HEAD_BALL.COMMON.TIMER_TURN_FINAL_COUNT;
            data.timeTurnFinishCount = this.SOUND_GAME.HEAD_BALL.COMMON.TIMER_TURN_FINISH_COUNT;
        }
        return data;
    },
    playAudioClip: function (filePath, volume, loop, isBundle, bundleName, cb) {
        if (bundleName) {
            this.getBundleByName(bundleName, function (err, bundle) {
                if (!err) {
                    //lưu ý tât cả file âm thanh chỉ để trong một thư mục sound, không tạo thêm các thư mục con trong sound
                    bundle.load(filePath, cc.AudioClip, function (error, audioClip) {
                        if (!error) {
                            cc.log("Load resource âm thanh thanh cong", audioClip);
                            var acl = cc.audioEngine.play(audioClip, loop, volume);
                            if (cb) {
                                cb(null, acl);
                            }

                        } else {
                            // cc.Global.showMessage(error);
                            cc.log("Lỗi không thể load được resource âm thanh...", audioClip);

                        }
                    })
                }
            });
        }
    },

    playAudioClipFX: function (filePath, volume, loop, isBundle, bundleName, cb) {
        if (!filePath) {
            return;
        }
        this.checkLocalStorageSound();
        if (this._isMute) return;
        if (bundleName) {
            this.getBundleByName(bundleName, function (err, bundle) {
                if (!err) {
                    //lưu ý tât cả file âm thanh chỉ để trong một thư mục sound, không tạo thêm các thư mục con trong sound
                    bundle.load(filePath, cc.AudioClip, function (error, audioClip) {
                        if (!error) {
                            cc.log("Load resource âm thanh thanh cong", audioClip);
                            var acl = cc.audioEngine.play(audioClip, loop, volume);
                            if (cb) {
                                cb(null, acl);
                            }

                        } else {
                            // cc.Global.showMessage(error);
                            cc.log("Lỗi không thể load được resource âm thanh...", audioClip);
                        }
                    })
                }
            });
        }
    },
    stopAudioClipFX: function (audioClip) {
        if (!audioClip) {
            return;
        }
        cc.audioEngine.stop(audioClip);
    },
    playBackground: function (filePath, volume, loop, isBundle) {
        // if (!filePath) {
        //     return;
        // }
        // this.checkLocalStorageSound();
        // if (this._isMuteBG) return;
        // loop = true;
        // volume = volume ? volume : 1;
        // var bundleName;
        // var bundleSceneNameObj = Utils.Malicious.getBundleNameAndSceneNameByZoneId(Linker.ZONE);
        // if (bundleSceneNameObj) {
        //     bundleName = bundleSceneNameObj.bundleName;
        // }
        // if (isBundle) {
        //     if (bundleName) {
        //         this.playAudioClip(filePath, volume, loop, isBundle, bundleName);
        //     }
        // } else {
        //     if (bundleName) {
        //         this.playAudioClip(filePath, volume, loop, isBundle, bundleName);
        //     } else {
        //         cc.resources.load(filePath, cc.AudioClip, function (error, audioClip) {
        //             if (!error) {
        //                 cc.audioEngine.play(audioClip, loop, volume);
        //                 cc.log("Load resource âm thanh thanh cong", audioClip);
        //             } else {
        //                 // cc.Global.showMessage(error);
        //                 cc.log("Lỗi không thể load được resource âm thanh...", error);
        //             }
        //         }.bind(this));
        //     }

        // }
    },
    playSoundFXJoinRoom: function () {
        this.checkLocalStorageSound();
        this.stopSoundBackground();
        if (this._isMuteBG) return;
        var loop = false;
        var volume = 1;
        var bundleName;
        var bundleSceneNameObj = Utils.Malicious.getBundleNameAndSceneNameByZoneId(Linker.ZONE);
        if (bundleSceneNameObj) {
            bundleName = bundleSceneNameObj.bundleName;
        }
        if (bundleName) {
            var filePathArray = this.getPathMusicByZone().joinRoom;
            var filePathIndex = Utils.Malicious.getRandomIntInclusive(0, filePathArray.length - 1);
            var filePath = filePathArray[filePathIndex];
            if (filePath) {
                this.playAudioClip(filePath, volume, loop, null, bundleName);
            }
        }
    },
    playSoundFX: function (path, ) {

    },
    playTurnTimerSoundFx: function (cb) {
        this.checkLocalStorageSound();
        this.stopSoundBackground();
        if (this._isMute) return;
        var loop = true;
        var volume = 1;
        var bundleName;
        var bundleSceneNameObj = Utils.Malicious.getBundleNameAndSceneNameByZoneId(Linker.ZONE);
        if (bundleSceneNameObj) {
            bundleName = bundleSceneNameObj.bundleName;
        }
        if (bundleName) {
            var filePath = this.getPathMusicByZone().timeTurnCount;
            if (filePath) {
                this.playAudioClip(filePath, volume, loop, null, bundleName, function (err, audioClip) {
                    if (!err) {
                        if (cb) {
                            cb(null, audioClip);
                        }
                    }
                });
            }
        }
    },
    playTurnTimerFinalSoundFx: function (cb) {
        this.checkLocalStorageSound();
        this.stopSoundBackground();
        if (this._isMute) return;
        var loop = false;
        var volume = 1;
        var bundleName;
        var bundleSceneNameObj = Utils.Malicious.getBundleNameAndSceneNameByZoneId(Linker.ZONE);
        if (bundleSceneNameObj) {
            bundleName = bundleSceneNameObj.bundleName;
        }
        if (bundleName) {
            var filePath = this.getPathMusicByZone().timeTurnFinalCount;
            if (filePath) {
                this.playAudioClip(filePath, volume, loop, null, bundleName, function (err, audioClip) {
                    if (!err) {
                        if (cb) {
                            cb(null, audioClip);
                        }
                    }
                });
            }
        }
    },
    playTurnTimerFinishSoundFx: function (cb) {
        this.checkLocalStorageSound();
        this.stopSoundBackground();
        if (this._isMute) return;
        var loop = false;
        var volume = 1;
        var bundleName;
        var bundleSceneNameObj = Utils.Malicious.getBundleNameAndSceneNameByZoneId(Linker.ZONE);
        if (bundleSceneNameObj) {
            bundleName = bundleSceneNameObj.bundleName;
        }
        if (bundleName) {
            var filePath = this.getPathMusicByZone().timeTurnFinishCount;
            if (filePath) {
                this.playAudioClip(filePath, volume, loop, null, bundleName, function (err, audioClip) {
                    if (!err) {
                        if (cb) {
                            cb(null, audioClip);
                        }
                    }
                });
            }
        }
    },
    playClickSoundFX: function (filePath, volume, loop, isBundle) {
        if (!filePath) {
            return;
        }
        this.checkLocalStorageSound();
        if (this._isMute) return;
        if (!this._isMuteBG) return;
        loop = false;
        volume = volume ? volume : 1;
        var bundleName;
        var bundleSceneNameObj = Utils.Malicious.getBundleNameAndSceneNameByZoneId(Linker.ZONE);
        if (bundleSceneNameObj) {
            bundleName = bundleSceneNameObj.bundleName;
        }
        if (isBundle) {
            if (bundleName) {
                this.playAudioClip(filePath, volume, loop, isBundle, bundleName);
            }
        } else {
            if (bundleName) {
                this.playAudioClip(filePath, volume, loop, isBundle, bundleName);
            } else {
                cc.resources.load(filePath, cc.AudioClip, function (error, audioClip) {
                    if (!error) {
                        cc.audioEngine.play(audioClip, loop, volume);
                        cc.log("Load resource âm thanh thanh cong", audioClip);
                    } else {
                        // cc.Global.showMessage(error);
                        cc.log("Lỗi không thể load được resource âm thanh...", error);
                    }
                }.bind(this));
            }

        }
    },
    setAudioSourceByBundleName: function (bundleName, nameAudio, cb) {
        this.getBundleByName(bundleName, function (err, bundle) {
            if (!err) {
                var path = "sounds/" + nameAudio;
                //lưu ý tât cả file âm thanh chỉ để trong một thư mục sound, không tạo thêm các thư mục con trong sound
                bundle.load(path, cc.AudioClip, function (error, audioClip) {
                    if (!error) {
                        cc.log("Load resource âm thanh thanh cong", audioClip);
                        if (cb) {
                            cb(null, audioClip);
                        }
                    } else {
                        // cc.Global.showMessage(error);
                        cc.log("Lỗi không thể load được resource âm thanh...", audioClip);
                        if (cb) {
                            cb(true, error);
                        }
                    }
                })
            }
        });
    },
    getAudioSourceByBundleName: function (bundleName, nameAudio) {
        if (nameAudio && nameAudio.toString().length > 0) {
            if (!Global.hasOwnProperty("GAME")) {
                Global.GAME = {};
            }
            if (!Global.GAME.hasOwnProperty("soundData")) {
                Global.GAME.soundData = {};
            }
            if (typeof Global.GAME.soundData.init != 'function') {
                Global.GAME.soundData.init = function () {
                    var AudioManager = Global.GAME.soundData.AudioManager;
                    if (!AudioManager || (AudioManager && !cc.isValid(AudioManager))) {
                        AudioManager = new cc.Node();
                        AudioManager.name = "AudioManager";
                        Global.GAME.soundData.AudioManager = AudioManager;
                        cc.game.addPersistRootNode(AudioManager);
                    }
                    return AudioManager;
                }
            }
            if (!Global.GAME.soundData.hasOwnProperty(bundleName)) {
                Global.GAME.soundData[bundleName] = {};
            }
            if (!Global.GAME.soundData[bundleName].hasOwnProperty(nameAudio)) {
                return null;
            }
            return (cc.isValid(Global.GAME.soundData[bundleName][nameAudio])) ? Global.GAME.soundData[bundleName][nameAudio] : null;
        } else {
            cc.error("Lỗi không thể set âm thanh global", name, audioSource);
        }
        return null;
    },
    getBundleByName: function (bundleName, cb) {
        if (bundleName) {
            Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                if (!err) {
                    if (cb) {
                        cb(null, gameLoaderBundle);
                    }
                } else {
                    cc.error(err);

                    if (cb) {
                        cb(err, null);
                    }
                }
            }.bind(this), bundleName);
        }
    },
    // playBackground: function (filePath) {
    //     if (!filePath) {
    //         return;
    //     }
    //     this.checkLocalStorageSound();
    //     if (this._isMute) {
    //         this.stopSoundBackground()
    //         return;
    //     } else {
    //         if (this.audioIDBG != null) {
    //             return;
    //             // đang chơi thì không chơi lại nữa

    //         }
    //         var url = cc.url.raw(filePath);
    //         this.audioIDBG = cc.audioEngine.play(url, true, 0.5);
    //     }
    // },

    playClick: function (name, volume, loop) {
        var nameAudio = this.SOUND_GAME.COMMON.CLICK;
        if (name) {
            nameAudio = name;
        }
        this.checkLocalStorageSound();
        if (this._isMute) return;
        var audioSource = this.getCommonAudioSourceSoundGameByName(nameAudio);
        if (audioSource) {
            if (!volume) {
                volume = 1.0;
            }
            loop = loop ? true : false;
            audioSource.play();
            audioSource.volume = volume;
            audioSource.loop = loop;
        }
    },
    playAudioSource: function (name, volume, loop) {
        if (name) {
            var nameAudio = name;
            this.checkLocalStorageSound();
            if (this._isMute) return;
            var audioSource = this.getCommonAudioSourceSoundGameByName(nameAudio);
            if (audioSource) {
                if (!volume) {
                    volume = 1.0;
                }
                loop = loop ? true : false;
                if (audioSource.isPlaying) {
                    return
                } else {
                    audioSource.play();
                    audioSource.volume = volume;
                    audioSource.loop = loop;
                }
            }
        }
    },
    playEffectADS: function (audioSource, volume, loop) {
        if (audioSource) {
            this.checkLocalStorageSound();
            if (this._isMute || audioSource.isPlaying || !audioSource) {
                return
            }
            if (!volume) {
                volume = 1;
            }
            loop = loop ? true : false;
            audioSource.play();
            audioSource.loop = loop;
            audioSource.volume = volume;
        }

    },
    playEffectBallHit: function (idBi, audioSource, volume, loop) {
        if (audioSource) {
            this.checkLocalStorageSound();
            if (this._isMute || audioSource.isPlaying || !audioSource) {
                return
            }
            if (!volume) {
                volume = 1;
            }
            loop = loop ? true : false;
            audioSource.play();
            audioSource.loop = loop;
            audioSource.volume = volume;
        }

    },
    LoadSound(languageCode) {
        var that = this;
        if (this.listSound) {
            this.listSound = [];
        }
        var sceneName = cc.Global.getSceneName();
        if (sceneName) {
            switch (sceneName) {
                case "BidaGame":
                    var path = `sound/sound_${languageCode}`;
                    var bidaBundle = Constant.BUNDLE.BIDA.name;
                    Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                        if (!err) {
                            gameLoaderBundle.loadDir(path, cc.AudioClip, (error, resourcesArr) => {
                                if (!error) {
                                    cc.log("Load resource âm thanh thanh cong", resourcesArr);
                                    that.listSound = resourcesArr;
                                    that.soundPointToBall = that.listSound.slice(0, 15);
                                    that.listSound = [];
                                } else {
                                    // cc.Global.showMessage(error);
                                    cc.log("Lỗi không thể load được resource âm thanh...", error);
                                }
                            })
                        } else {
                            cc.error(err);

                        }
                    }.bind(this), bidaBundle);
                    break;
                default:
                    break;
            }
        }
    },

    LoadCommonSoundGame() {
        var that = this;
        var path = `sound`;
        cc.resources.loadDir(path, cc.AudioClip, function (error, audioArr) {
            if (!error) {
                for (var i = 0; i < audioArr.length; i++) {
                    var name = audioArr[i].name;
                    var audioClip = audioArr[i];
                    this.setCommonSoundByName(name, audioClip);
                }
            } else {
                // cc.Global.showMessage(error);
                cc.error("Lỗi không thể load được resource âm thanh...", error);
            }
        }.bind(this))
    },
    setCommonSoundByName: function (name, audioClip) {
        if (name && name.toString().length > 0 && audioClip) {
            if (!Global.hasOwnProperty("GAME")) {
                Global.GAME = {};
            }

            if (!Global.GAME.hasOwnProperty("soundData")) {
                Global.GAME.soundData = {};
            }
            if (typeof Global.GAME.soundData.init != 'function') {
                Global.GAME.soundData.init = function () {
                    var AudioManager = Global.GAME.soundData.AudioManager;
                    if (!AudioManager || (AudioManager && !cc.isValid(AudioManager))) {
                        AudioManager = new cc.Node();
                        AudioManager.name = "AudioManager";
                        Global.GAME.soundData.AudioManager = AudioManager;
                        cc.game.addPersistRootNode(AudioManager);
                    }
                    return AudioManager;
                }
            }
            if (!Global.GAME.soundData.hasOwnProperty("COMMON")) {
                Global.GAME.soundData.COMMON = {};
            }
            if (!Global.GAME.soundData.COMMON.hasOwnProperty(name)) {
                Global.GAME.soundData.COMMON[name] = new cc.AudioSource();
            }
            var _AudioManager = Global.GAME.soundData.init();
            if (_AudioManager) {
                var audioSource = _AudioManager.addComponent(cc.AudioSource);
                audioSource.name = name;
                audioSource.clip = audioClip;
                Global.GAME.soundData.COMMON[name] = audioSource;
            }
        } else {
            cc.error("Lỗi không thể set âm thanh global", name, audioSource);
        }
    },
    getCommonAudioSourceSoundGameByName: function (name) {
        if (name && name.toString().length > 0) {
            if (!Global.hasOwnProperty("GAME")) {
                Global.GAME = {};
            }
            if (!Global.GAME.hasOwnProperty("soundData")) {
                Global.GAME.soundData = {};
            }
            if (!Global.GAME.soundData.hasOwnProperty("COMMON")) {
                Global.GAME.soundData.COMMON = {};
            }
            if (!Global.GAME.soundData.COMMON.hasOwnProperty(name)) {
                return null;
            }
            return (cc.isValid(Global.GAME.soundData.COMMON[name])) ? Global.GAME.soundData.COMMON[name] : null;
        } else {
            cc.error("Lỗi không thể set âm thanh global", name, audioSource);
        }
        return null;
    },

    PlaySoundPointToBall(idBi) {
        var sceneName = cc.Global.getSceneName();
        if (sceneName) {
            switch (sceneName) {
                case "BidaGame":
                    if (this.soundPointToBall) {
                        this.Play(this.soundPointToBall[idBi - 1]);
                    }
                    break;
                default:
                    break;
            }
        }
    },

    LoadOtherSound(languageCode) {

    },
    playClip: function (clip, volume, loop) {
        if (clip) {
            this.checkLocalStorageSound();
            if (this._isMute) return;
        }
        if (loop != true) {
            loop = false;
        };
        volume = volume ? volume : 1;
        cc.audioEngine.play(clip, loop, volume);
    },
    Play(clip) {
        this.checkLocalStorageSound();
        if (this._isMute) {
            return;
        }
        if (this.lastAudio) {
            cc.audioEngine.stop(this.lastAudio);
        }
        this.lastAudio = cc.audioEngine.play(clip, false, 0.5);
    },
    checkLocalStorageSound: function () {
        //setting mute
        var _userData = Linker.Local.readUserData();
        if (_userData) {
            var _isSound = _userData.isSound;
            var _isBG = _userData.isMusic;
            this._isMute = typeof (_isSound) !== 'undefined' && typeof (_isSound === 'boolean') ? !_isSound : false;
            this._isMuteBG = typeof (_isBG) !== 'undefined' && typeof (_isBG === 'boolean') ? !_isBG : false;

        } else {
            this._isMute = false;
            this._isMuteBG = false;
        }
    },
    PlayUrl(url) {
        this.checkLocalStorageSound();
        if (this._isMute) {
            return;
        }
        var that = this;
        if (this.lastPlayUrl) {
            cc.audioEngine.stop(this.lastPlayUrl);
        }
        if (url) {
            //phát sinh một số trường hợp chứa .mp3
            url = url.replace(/\.[^/.]+$/, "");
        }
        cc.resources.load(url, cc.AudioClip, (error, audio) => {
            if (!error) {
                that.lastPlayUrl = cc.audioEngine.play(audio, false, 0.5);
            } else {
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    var bidaBundle = Constant.BUNDLE.BIDA.name;
                    Utils.Malicious.getGameLoaderBundle(function (err, gameLoaderBundle) {
                        if (!err) {
                            gameLoaderBundle.load(url, cc.AudioClip, function (error, audio) {
                                if (!error) {
                                    this.lastPlayUrl = cc.audioEngine.play(audio, false, 0.5);
                                }
                            }.bind(this))
                        }
                    }.bind(this), bidaBundle);
                } else {
                    // cc.Global.showMessage(error);
                    cc.log("Lỗi không thể play được file âm thanh...", error);
                }

            }
        })
    }
};


module.exports = AudioManager;