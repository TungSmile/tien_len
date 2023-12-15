var NewAudioManager = require("NewAudioManager");
cc.Class({
    extends: cc.Component,

    properties: {
        nextButton: cc.Node,
        preButton: cc.Node,
        indexArray: [cc.Node],
        colorActiveIndex: {
            default: cc.color("#FFFFFF"),
            readOnly: true
        },
        colorInActiveIndex: {
            default: cc.color("#384F99"),
            readOnly: true
        }
    },
    addEventNode: function () {
        if (this.indexArray.length == 5) {
            for (let i = 0; i < this.indexArray.length; i++) {
                this.indexArray[i].on(cc.Node.EventType.TOUCH_START, this.pageIndexClick, this);
                var lbindex = this.indexArray[i].getChildByName("textIndex");
                if (lbindex) {
                    lbindex.getComponent(cc.Label).string = (i + 1);
                }
            }
        }
        this.nextButton.on(cc.Node.EventType.TOUCH_START, this.nextIndex, this);
        this.preButton.on(cc.Node.EventType.TOUCH_START, this.prevIndex, this);

    },
    prevIndex: function (event) {
        NewAudioManager.playClick();
        this.page += 1;
        this.reorderNumberDate();
        this.setActiveIndexButton();
        this.routeToPageContent();
    },
    nextIndex: function (event) {
        NewAudioManager.playClick();
        if (this.page > this.maxpage) {
            this.page -= 1;
        } else if (this.page < 1) {
            this.page = 1;
        }
        this.reorderNumberDate();
        this.setActiveIndexButton();
        this.routeToPageContent();
    },
    reorderNumberDate: function () {
        //o day phai set lai string hix
        if (this.page % 5 == 0) {
            var j = this.page;
            for (var i = 0, j; i < 5; i++) {
                var page = j.toString();
                this.indexArray[i].getChildByName("textIndex").getComponent(cc.Label).string = page;
                j++;
            }
        } else if (this.page < 5) {
            //khoang ban dau
            for (var i = 0; i < 5; i++) {
                var nameid = i + 1;
                var page = nameid.toString();
                this.indexArray[i].getChildByName("textIndex").getComponent(cc.Label).string = page;
            }
        } else if (this.page % 5 != 0) {
            var rangeValueData = this.getRangeValue();
            var indexArr = 0;
            for (var i = 0; i < rangeValueData.length; i++) {
                var page = rangeValueData[i].toString();
                this.indexArray[i].getChildByName("textIndex").getComponent(cc.Label).string = page;
                indexArr++;
            }

        }
    },
    getRangeValue: function () {
        var maxLimit = this.page + 10;
        var minLimit = this.page - 10;
        var range = {
            start: 0,
            end: 0
        };
        for (var i = this.page; i > minLimit; i--) {
            if (i % 5 == 0) {
                range.start = i;
                break;
            }
        };
        for (var j = this.page; j < maxLimit; j++) {
            if (j % 5 == 0) {
                range.end = j;
                break;
            }
        }
        var rangeVData = [];
        for (var k = range.start; k < range.end; k++) {
            rangeVData.push(k);
        }
        return rangeVData;
    },
    setPage: function (page) {
        this.page = isNaN(page) ? 1 : Number(page);
        this.reorderNumberDate();
        this.setActiveIndexButton();
    },
    setUserFinding: function (name) {
        this.userNameFinding = name;
    },
    init: function (data) {
        this.maxpage = 1;
        this.userNameFinding = null;
        this.page = data.page;
        this.node.name = data.name;
        this.componentContain = data.componentContain;
        this.addEventNode();
        this.pageIndexClick({ currentTarget: this.indexArray[0] })
    },
    pageIndexClick: function (event) {
        NewAudioManager.playClick();
        var ctarget = event.currentTarget;
        var name = ctarget.name;
        if (this.indexArray.length == 5) {
            switch (name) {
                case this.indexArray[0].name:
                    var page = Number(this.indexArray[0].getChildByName("textIndex").getComponent(cc.Label).string);
                    this.page = page;
                    break;
                case this.indexArray[1].name:
                    var page = Number(this.indexArray[1].getChildByName("textIndex").getComponent(cc.Label).string);
                    this.page = page;
                    break;
                case this.indexArray[2].name:
                    var page = Number(this.indexArray[2].getChildByName("textIndex").getComponent(cc.Label).string);
                    this.page = page;

                    break;
                case this.indexArray[3].name:
                    var page = Number(this.indexArray[3].getChildByName("textIndex").getComponent(cc.Label).string);
                    this.page = page;
                    break;
                case this.indexArray[4].name:
                    var page = Number(this.indexArray[4].getChildByName("textIndex").getComponent(cc.Label).string);
                    this.page = page;
                    break;
                default:
                    break;
            }
            this.setActiveIndexButton();
            this.routeToPageContent();
        }
    },
    routeToPageContent: function () {
        switch (this.node.name) {
            case "PageIndexFriendList":
                this.componentContain.requestListFriendByPage(this.page);
                // cc.log("Get list friend page.");
                break;
            case "PageIndexUserList":
                if (this.userNameFinding) {
                    this.componentContain.findFriendByNameAndPage(this.userNameFinding, this.page);
                }
                // cc.log("Get list user page.");
                break;
            case "PageIndexSendList":
                this.componentContain.requestSendFriendByPage(this.page);
            default: break;
        }
    },
    setActiveIndexButton: function () {
        for (var i = 0; i < this.indexArray.length; i++) {
            var stringNode = this.indexArray[i].getChildByName("textIndex");
            var stringValue = Number(stringNode.getComponent(cc.Label).string);
            if (stringValue == this.page) {
                stringNode.color = this.colorInActiveIndex;
            } else {
                stringNode.color = this.colorActiveIndex;
            }
        }
    },
    // update (dt) {},
});
