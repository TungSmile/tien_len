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
        ROYAL_FLUSH : {
            value: 8,
            description: "Thùng phá sảnh",
            getValue() {
                return this.value;
            },
            toString() {
                return this.description;
            },
        },
        FOUR_OF_KIND : {
            value: 7,
            description: "Tứ quý",
            getValue() {
                return this.value;
            },
            toString() {
                return this.description;
            },
        }, //tu quy
        FULL_HOUSE : {
            value: 6,
            description: "Cù lũ",
            getValue() {
                return this.value;
            },
            toString() {
                return this.description;
            },
        }, //cu lu
        FLUSH : {
            value: 5,
            description: "Thùng",
            getValue() {
                return this.value;
            },
            toString() {
                return this.description;
            },
        }, //thung
        STRAIGHT : {
            value: 4,
            description: "Sảnh",
            getValue() {
                return this.value;
            },
            toString() {
                return this.description;
            },
        }, //sanh
        THREE_OF_KIND : {
            value: 3,
            description: "Xám",
            getValue() {
                return this.value;
            },
            toString() {
                return this.description;
            },
        }, //sam co
        TWO_OF_PAIR : {
            value: 2,
            description: "Thú",
            getValue() {
                return this.value;
            },
            toString() {
                return this.description;
            },
        }, //thu
        A_PAIR : {
            value: 1,
            description: "Đôi",
            getValue() {
                return this.value;
            },
            toString() {
                return this.description;
            },
        }, //doi
        HIGH_CARD : {
            value: 0,
            description: "Mậu thầu",
            getValue() {
                return this.value;
            },
            toString() {
                return this.description;
            },
        }, //mau thau
        THUNG_PHA_SANH_CHI_HAI : {
            value: 8,
            description: "Thùng p.sảnh chi 2",
            getValue() {
                return this.value;
            },
            toString() {
                return this.description;
            },
        },
        THUNG_PHA_SANH_CHI_BA : {
            value: 8,
            description: "Thùng p.sảnh chi 3",
            getValue() {
                return this.value;
            },
            toString() {
                return this.description;
            },
        },
        TU_QUY_CHI_HAI : {
            value: 7,
            description: "Tứ quý chi 2",
            getValue() {
                return this.value;
            },
            toString() {
                return this.description;
            },
        },
        SAM_CHI_BA : {
            value: 3,
            description: "Xám chi 3",
            getValue() {
                return this.value;
            },
            toString() {
                return this.description;
            },
        },
        CU_LU_CHI_HAI : {
            value: 6,
            description: "Cù lũ chi 2",
            getValue() {
                return this.value;
            },
            toString() {
                return this.description;
            },
        }
    },



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
});