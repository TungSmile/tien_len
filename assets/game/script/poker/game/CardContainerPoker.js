
cc.Class({
    extends: cc.Component,

    properties: {
       doLech: false,
       
    },

    setDoLech(doLech = false){
        this.doLech=doLech;
    }
});
