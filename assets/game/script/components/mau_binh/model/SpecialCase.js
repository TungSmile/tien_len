// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {
    },
    statics: {
        SANH_RONG_DONG_HOA : {
            multi: 26,
            type: 2,
            description: "Rồng cuốn",
            getMulti() {
                return this.multi;
            },
            getType() {
                return this.type;
            },
            toString() {
                return this.description;
            }
        },
        SANH_RONG : {
            multi: 13,
            type: 3,
            description: "Sảnh rồng",
            getMulti() {
                return this.multi;
            },
            getType() {
                return this.type;
            },
            toString() {
                return this.description;
            }
        },
        NAM_DOI_MOT_SAM : {
            multi: 6,
            type: 4,
            description: "Năm đôi một xám",
            getMulti() {
                return this.multi;
            },
            getType() {
                return this.type;
            },
            toString() {
                return this.description;
            }
        },
        LUC_PHE_BON : {
            multi: 3,
            type: 5,
            description: "Lục phé bôn",
            getMulti() {
                return this.multi;
            },
            getType() {
                return this.type;
            },
            toString() {
                return this.description;
            }
        },
        BA_THUNG : {
            multi: 3,
            type: 6,
            description: "Ba cái thùng",
            getMulti() {
                return this.multi;
            },
            getType() {
                return this.type;
            },
            toString() {
                return this.description;
            }
        },
        BA_SANH : {
            multi: 3,
            type: 7,
            description: "Ba cái sảnh",
            getMulti() {
                return this.multi;
            },
            getType() {
                return this.type;
            },
            toString() {
                return this.description;
            }
        },
        BINH_LUNG : {
            multi: 0,
            type: 0,
            description: "Binh lủng",
            getMulti() {
                return this.multi;
            },
            getType() {
                return this.type;
            },
            toString() {
                return this.description;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
