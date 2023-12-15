export function formatNumber(number) {
    var numberStr = Math.abs(number).toString(),
        intStrPartNew = '',
        parts, intStrPart, floatPart, i, j;
    numberStr = numberStr.replace('.', ',');
    parts = numberStr.split(',');
    intStrPart = parts[0];
    floatPart = parts[1];
    for (i = intStrPart.length - 1, j = 1; i >= 0; i -= 1, j += 1) {
        intStrPartNew = intStrPart[i] + intStrPartNew;
        if (j % 3 === 0 && i !== 0) {
            intStrPartNew = '.' + intStrPartNew;
        }
    }
    return ((number < 0 ? '-' : '') + intStrPartNew + (floatPart ? (',' + floatPart) : ''));
};
export function getCountTimeStringByMillis(millis) {
    if (millis <= 0) return "00:00";
    var lsecs: any = Math.round(millis / 1000).toFixed(0);
    // var hour = (lsecs / 3600).toFixed(0);
    var hour = Math.floor(lsecs / 3600);
    lsecs %= 3600;
    // var min = (lsecs / 60).toFixed(0);
    var min = Math.floor(lsecs / 60);
    var test = lsecs / 60;

    var sec = lsecs % 60;
    var shour = (hour < 10 ? "0" : "") + hour;
    var smin = (min < 10 ? "0" : "") + min;
    var ssec = (sec < 10 ? "0" : "") + sec;
    return smin + ":" + ssec; //m:s
    // return shour + ":" + smin + ":" + ssec; //H:m:s
};

export const Util2s = {
    shuffleArray: function (arr) {
        var j;
        var x;
        var i;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = arr[i];
            arr[i] = arr[j];
            arr[j] = x;
        }
        return arr;
    },
    getRandomInt: function (min: number, max: number) {
        var r = Math.random();
        var rr = r * (max - min + 1) + min;
        return Number(Math.floor(rr));
    },
    getRandomFloat: function (min: number, max: number) {
        return Number((Math.random() * (max - min) + min).toFixed(4));
    },
    resizeNode(node: cc.Node) {
        if (node && cc.isValid(node)) {
            let size = cc.view.getCanvasSize();
            if (size.height / size.width <= 1.6) {
                node.scale = size.height / size.width;
            }
        }
    },
    numberWithCommas(x) {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      },
      getDeviveSize() {
        let canvas = cc.Canvas.instance;
        var dr = canvas.designResolution;
        var s = cc.view.getFrameSize();
        var rw = s.width;
        var rh = s.height;
        var finalW = rw;
        var finalH = rh;
        if (rw / rh > dr.width / dr.height) {
          finalH = dr.height;
          finalW = (finalH * rw) / rh;
        } else {
          finalW = dr.width;
          finalH = (rh / rw) * finalW;
        }
        return cc.size(finalW, finalH);
      },
      getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
        //The maximum is inclusive and the minimum is inclusive
      },
      loadUrlImage(url, object, cb) {
        cc.loader.load(url, function (err, texture) {
          var frame = new cc.SpriteFrame(
            texture.url,
            cc.rect(0, 0, texture.width, texture.height)
          );
          object.getComponent(cc.Sprite).spriteFrame = frame;
          object.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
          if (cb) cb();
        });
      },
}