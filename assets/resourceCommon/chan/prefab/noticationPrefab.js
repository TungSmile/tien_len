var Linker = require('Linker');


cc.Class({
    extends:cc.Component,
    properties:{
        notifyContainer: cc.Node,
        textValue: cc.Label,
    },
    onLoad(){
    },
    start(){
    },
    update(dt) {
        this.notifyContainer.x = this.notifyContainer.x-2;
        if( this.notifyContainer.x < - (this.textValue.string.length+1750)){
           this.notifyContainer.x = 1750;
        }
    }
    
})