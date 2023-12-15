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
        dropDownItemTaiXiu: cc.Prefab,
        filterScrollView: cc.Node,
        contentScrollViewDropDown: cc.Node,
        btnTextSlect: cc.Label,
        iconUp: cc.Node,
        iconDown: cc.Node,
        parrentNode: cc.Node
    },
    onLoad () {
        this.node.on("EVENT_DROP_DOWN_VINHDANH_TAI_XIU_ITEM", this.callEventSelectAnItem, this);        
        this.node.on("EVENT_DROP_DOWN_HOMQUA_TAI_XIU_ITEM", this.callEventSelectAnItem, this);        
    },

    start () {

    },
    callEventSelectAnItem: function(event){
        //thay doi noi dung cua button text
        this.showIconDown();
        this.hideScrollView();
        var targetScript = event.target.getComponent("drpDownTaiXiuItem");
        var currentText = targetScript.getCurrentText();
        this.setTextButtonSelect(currentText);
    },
    addDropDownItem: function(oData){
        var data = oData.data;
        var id = oData.id;
        this.contentScrollViewDropDown.removeAllChildren(true);
        for(var i = 0; i<data.length; i++){
            var dr = cc.instantiate(this.dropDownItemTaiXiu);
            var drs = dr.getComponent("drpDownTaiXiuItem");
            drs.setCurrentText(data[i].btnText);
            drs.setUrl(data[i].url);
            drs.setUrlNhanQua(data[i].urlNhanQua);
            drs.setIdToDispatch(id);
            this.contentScrollViewDropDown.addChild(dr);
        }
        //set current text for button
        this.showIconDown();
    },
    hideScrollView: function(){
        this.filterScrollView.active = false;
    },
    showScrollView: function(){
        this.filterScrollView.active = true;
    },
    setTextButtonSelect: function(ctx){
        this.btnTextSlect.string = ctx;
    },
    showIconUp: function(){
        this.iconUp.active = true;
        this.iconDown.active = false;
    },
    showIconDown: function(){
        this.iconUp.active = false;
        this.iconDown.active = true;
    },
    toggleScrollView: function(){
        if(this.filterScrollView.active){
            this.hideScrollView();
            this.showIconDown();
        }else{
            this.showScrollView();
            this.showIconUp();
        }
    }
    // update (dt) {},
});
