var Linker = require('Linker');
var constantSukienDialog = require("constantSukienDialog");

cc.Class({
    extends: cc.Component,

    properties: {
        dropDownBg: {
            type: cc.Sprite,
            displayName: "dropDownBg",
            default: null
        },
        dropDownItemText: {
            type: cc.Label,
            displayName: "dropDownItemText",
            default: null
        },
        dropDownItemIcon: {
            type: cc.Node,
            displayName: "dropDownItemIcon",
            default: null
        },
        parrentNode: cc.Node

    },
    onLoad() {
        this.configDispatchEvent();
    },
    dispatchEvent: function(){
        if(this.iddispatch == constantSukienDialog.vinhdanhtabID){
            this.parrentNode.dispatchEvent(this.eventDispatchVinhDanhItemDropDown);

        }else if(this.iddispatch == constantSukienDialog.homquatabID){
            this.parrentNode.dispatchEvent(this.eventDispatchHomQuaItemDropDown);
        
        }
    },
    setCurrentText: function(txt){
        this.dropDownItemText.string = txt;

    },
    getCurrentText: function(txt){
        return this.dropDownItemText.string;

    },
    setUrl: function(url){
        this.url = url;
    },
    setUrlNhanQua: function(url){
        this.urlNhanQua = url;
    },
    getUrlNhaQua: function(url){
        return this.urlNhanQua;
    },
    getUrl: function(){
        return url;
    },
    setIdToDispatch: function(id){
        this.iddispatch = id;
    },
    getIdToDispatch: function(){
        return this.iddispatch;
    },
    configDispatchEvent: function () {
        //danh cho nhieu thu khac nua
        this.eventDispatchHomQuaItemDropDown = new cc.Event.EventCustom("EVENT_DROP_DOWN_HOMQUA_TAI_XIU_ITEM", true);
        this.eventDispatchVinhDanhItemDropDown = new cc.Event.EventCustom("EVENT_DROP_DOWN_VINHDANH_TAI_XIU_ITEM", true);

    }
});
