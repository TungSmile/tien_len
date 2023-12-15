var constantSukienDialog = require("constantSukienDialog");
var Linker = require('Linker');

cc.Class({
    extends: cc.Component,

    properties: {
        parrentNode: cc.Node,
        vinhdanhTaiXiuHeadingPrefab: cc.Prefab,
        homQuaTaiXiuHeadingPrefab: cc.Prefab,
        messagePopupHeadingPrefab: cc.Prefab,
        lichSuNoHuGameBaiHeadingPrefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.configDispatchEvent()
    },
    start () {

    },
    onVinhDanhTaiXiuSukienHeading: function(data){
        this.parrentNode.removeAllChildren(true);
        this.vinhdanhTaiXiuHeading = cc.instantiate(this.vinhdanhTaiXiuHeadingPrefab);
        this.parrentNode.addChild(this.vinhdanhTaiXiuHeading);
        var vinhdanhTaiXiuHeadings = this.vinhdanhTaiXiuHeading.getComponent("vinhdanhTaiXiuHeading");
        vinhdanhTaiXiuHeadings.addFilterCatalog(data);
        vinhdanhTaiXiuHeadings.configFilterCatalog(data);
        var self = this;
        vinhdanhTaiXiuHeadings.requestDisplayTodayDateContent(data, function(err, data){
            if(data){
                self.dispatchVinhDanhTaiXiuEvent();
            }else{
                //co loi xay ra, errr
            }
        });
    },
    onHomQuaTaiXiuSukienHeading: function(data){
        this.parrentNode.removeAllChildren(true);
        this.homQuaTaiXiuHeading = cc.instantiate(this.homQuaTaiXiuHeadingPrefab);
        this.parrentNode.addChild(this.homQuaTaiXiuHeading);
        var homQuaTaiXiuHeadingScript = this.homQuaTaiXiuHeading.getComponent("homquaTaiXiuHeading");
        homQuaTaiXiuHeadingScript.addFilterCatalog(data);
        homQuaTaiXiuHeadingScript.configFilterCatalog(data);
        var self = this;
        homQuaTaiXiuHeadingScript.requestDisplayTodayDateContent(data, function(err, data){
            if(data){
                self.dispatchHomQuaTaiXiuEvent();
            }else{
                //co loi xay ra, errr
            }
        });


    },

    onLichSuNoHuBaiSukienHeading: function(data){
        this.parrentNode.removeAllChildren(true);
        this.lichSuNoHuGameBaiHeading = cc.instantiate(this.lichSuNoHuGameBaiHeadingPrefab);
        this.parrentNode.addChild(this.lichSuNoHuGameBaiHeading);
        var lichSuNoHuGameBaiHeadingScript = this.lichSuNoHuGameBaiHeading.getChildByName("nohubaiHeadingContent").getComponent("nohubaiHeading");
        lichSuNoHuGameBaiHeadingScript.setTitleTab("Nổ Hũ Game Bài");

        var self = this;
        lichSuNoHuGameBaiHeadingScript.requestDisplayLichSuNoHuTodayDateContent(data, function(err, data){
            if(data){
                self.dispatchLichSuNoHuBaiEvent();
            }else{
                //co loi xay ra, errr
            }
        });
    },

    onThanhTichNoHuBaiSukienHeading: function(data){
        this.parrentNode.removeAllChildren(true);
        this.thanhtichNoHuGameBaiHeading = cc.instantiate(this.lichSuNoHuGameBaiHeadingPrefab);
        this.parrentNode.addChild(this.thanhtichNoHuGameBaiHeading);
        var thanhtichNoHuGameBaiHeadingScript = this.thanhtichNoHuGameBaiHeading.getChildByName("nohubaiHeadingContent").getComponent("nohubaiHeading");
        thanhtichNoHuGameBaiHeadingScript.setTitleTab("Thành Tích Game Bài");

        var self = this;
        thanhtichNoHuGameBaiHeadingScript.requestDisplayThanhTichNoHuTodayDateContent(data, function(err, data){
            if(data){
                self.dispatchThanhTichNoHuBaiEvent();
            }else{
                //co loi xay ra, errr
            }
        });
    },
    onMessagePopupSukienHeading: function(data){
        var mess = data.mess;        
        this.parrentNode.removeAllChildren(true);
        this.messagePopupHeading = cc.instantiate(this.messagePopupHeadingPrefab);
        this.parrentNode.addChild(this.messagePopupHeading);
        this.configMessagePopup(mess);
    },
    configHomQuaTaiXiuHeading: function(cb){

    },
    configVinhDanhTaiXiuHeading: function(cb){

    },
    configMessagePopup: function(mess){
        var tbhd = this.messagePopupHeading.getComponent("thongBaoHeading");
        tbhd.setMessage(mess);

    },
    dispatchHomQuaTaiXiuEvent: function(){
        this.parrentNode.dispatchEvent(this.eventDispatchHomQuaTaiXiu);
    },
    
    dispatchVinhDanhTaiXiuEvent: function(){
        this.parrentNode.dispatchEvent(this.eventDispatchVinhDanhTaiXiu);
    },
    dispatchLichSuNoHuBaiEvent: function(){
        this.parrentNode.dispatchEvent(this.eventDispatchLichSuNoHuBai);
    },
    dispatchThanhTichNoHuBaiEvent: function(){
        this.parrentNode.dispatchEvent(this.eventDispatchThanhTichNoHuBai);
    },
    configDispatchEvent: function () {
        this.eventDispatchHomQuaTaiXiu = new cc.Event.EventCustom("EVENT_ADD_HOMQUA_TAI_XIU_CONTENT", true);
        this.eventDispatchVinhDanhTaiXiu = new cc.Event.EventCustom("EVENT_ADD_VINHDANH_TAI_XIU_CONTENT", true);
        this.eventDispatchLichSuNoHuBai = new cc.Event.EventCustom("EVENT_ADD_LICH_SU_NO_HU_BAI_CONTENT", true);
        this.eventDispatchThanhTichNoHuBai = new cc.Event.EventCustom("EVENT_ADD_THANH_TICH_NO_HU_BAI_CONTENT", true);
    }
    // update (dt) {},
});
