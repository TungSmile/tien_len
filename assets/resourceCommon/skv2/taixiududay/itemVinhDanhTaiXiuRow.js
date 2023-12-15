var Linker = require('Linker');
var Global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
        stt: cc.Label,
        textGiaiThuong: cc.Label,
        textDaNhanThuong: cc.Label,
        btnGiaiThuong: cc.Node,
        day: cc.Label,
        namePlayer: cc.Label,
        tongDat: cc.Label

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },
    setSTT(stt){
        this.stt.string = stt;
    },
    setName(name){
        this.namePlayer.string = name;
    },
    setDay(day){
        this.day.string = day;
    },
    setGiaiThuong(giaithuong){
        this.textGiaiThuong.string = giaithuong;
    },
    setTongDat(tongdat){
        this.tongDat.string = tongdat;
    },
    showBtnNhanQua: function(){
        this.btnGiaiThuong.active = true;
    },
    hideButtonNhanQua: function(){      
        this.btnGiaiThuong.active = false;
    },
    setDaNhanColor: function(){
        this.textDaNhanThuong.node.color = cc.color("#00FF0A");
    },
    setChoDuyenColor: function(){
        this.textDaNhanThuong.node.color = cc.color("#EBEAEA");
    },
    showTextDaNhan: function(msg){
        this.textDaNhanThuong.node.active = true;
        if(msg){
            this.textDaNhanThuong.string = msg;
        }
    },
    hideTextDaNhan: function(){
        this.textDaNhanThuong.node.active = false;
    },
    nhanThuong: function(){
        var self = this;
        if (Global.Announcement.AnnouncePrefab && Global.Announcement.GlobalNodePrefab) {
            var gNode = cc.instantiate(Global.Announcement.GlobalNodePrefab);
            var gNodeC = gNode.getComponent("GlobalNode");
            if (gNodeC) {
                Global.Announcement._addChild(gNode);
                gNodeC.alert("Bạn có muốn gửi yêu cầu xét duyệt để được nhận quà？", G.AT.OK_CANCEL, () => {
                    self.get(self.linkNhanQua, function(err, data){
                        if(!err){
                            self.hideButtonNhanQua();
                            self.hideTextDaNhan();
                            cc.Global.showMessage(data.msg);
                        }else{
                            cc.Global.showMessage(err);
                        }
                    });
                    Global.Announcement._removeAllChild();
                    Global.Announcement.AnnounceNode.active = false;
                    
                }, () => {
                    Global.Announcement._removeAllChild();
                    Global.Announcement.AnnounceNode.active = false;
                });
            }
        }
    },
    get(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('error', function () { })
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                var err = null;
                if (callback) {
                    callback(err,JSON.parse(response));
                }else{
                    var err = "Không thể lấy dữ liệu nhận quà, vui lòng thử lại ...";
                    callback(err,JSON.parse(response));
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    },
    setLinkRedirectNhanQua: function(url){
        this.linkNhanQua = url;
    }
    // update (dt) {},
});
