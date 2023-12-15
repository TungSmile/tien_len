//Extends Logic of Phom.
var kPhomLogic = {
    simpleArray(listCard){
        var result = [];
        if(Array.isArray(listCard)) {
            if(Array.isArray(listCard[0])){
                for( var i = 0; i < listCard.length; i++) {
                    for (var j = 0;j < listCard[i].length; j++) {
                        result.push(...listCard[i][j]);
                    }
                }
            } else {
                for ( var i = 0; i < listCard.length; i++) {
                    result.push(...listCard[i]);
                }
            }
        } else {
            result = [];
        }
        return  result;
    },
    
    kfilterCardByType(listCard) {
        var result = [[],[],[],[]];
        for (var i = 0; i < listCard.length; i++) {
            
        }
        return result;
    },
    kSortCardByType(listCard){
        var result = [];
        
        return result;
    },
    kfindPhomType(listCard, maxLength = 3) {
        var result = [];
        var listCardSimple = this.simpleArray(listCard);
        
    }
}
