function Toast(
  text = "",
  {
    gravity = "TOP",
    duration = 3,
    //bg_color = cc.Color.YELLOW
    bg_color = cc.color(75, 25, 2, 150)


  } = {}) 
  {
  //
  function getMaxzIndex(parrent) {
    var maxZindex = 0;
    if (parrent) {
      for (var i = 0; i < parrent.children.length; i++) {
        var tmpZindex = parrent.children[i].zIndex;
        if (tmpZindex > maxZindex) {
          maxZindex = tmpZindex;
          if (maxZindex == cc.macro.MAX_ZINDEX) {
            parrent.children[i].zIndex = cc.macro.MAX_ZINDEX - 1;
            maxZindex = cc.macro.MAX_ZINDEX;
          }
        }
      }
    }
    return (maxZindex >= cc.macro.MAX_ZINDEX) ? cc.macro.MAX_ZINDEX : maxZindex + 1;
  };
  // canvas
  var canvas = cc.director.getScene().getComponentInChildren(cc.Canvas);
  var width = canvas.node.width;
  var height = canvas.node.height;

  var bgNode = new cc.Node();

  // Lable文本格式设置
  var textNode = new cc.Node();
  var textLabel = textNode.addComponent(cc.Label);
  textLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
  textLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
  textLabel.fontSize = 22;
  textLabel.string = text;

  // 当文本宽度过长时，设置为自动换行格式
  if (text.length * textLabel.fontSize > (width * 4) / 5) {
    textNode.width = width;
    textLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
  } else {
    //textNode.width = text.length * textLabel.fontSize;
    textNode.width = width;
  }
  var lineCount =
    ~~((text.length * textLabel.fontSize) / ((width * 3) / 5)) + 1;
  textNode.height = textLabel.fontSize * lineCount;

  // 背景设置
  var ctx = bgNode.addComponent(cc.Graphics);
  ctx.width = width;
  ctx.arc(
    -textNode.width,
    0,
    textNode.height / 2 + 20,
    0.5 * Math.PI,
    1.5 * Math.PI,
    true
  );
  ctx.lineTo(textNode.width, -(textNode.height / 2 + 20));
  ctx.arc(
    textNode.width,
    0,
    textNode.height / 2 + 20,
    1.5 * Math.PI,
    0.5 * Math.PI,
    true
  );
  ctx.lineTo(-textNode.width, textNode.height / 2 + 20);
  ctx.fillColor = bg_color;
  ctx.fill();

  bgNode.addChild(textNode);
  bgNode.width = width;
  // gravity 设置Toast显示的位置
  if (gravity === "CENTER") {
    bgNode.y = 0;
    bgNode.x = 0;
  } else if (gravity === "TOP") {
    // bgNode.y = bgNode.y + (height / 5) * 2;
    bgNode.y = (height / 2) - 30;

  } else if (gravity === "BOTTOM") {
    bgNode.y = bgNode.y - (height / 5) * 2;
  }

  canvas.node.addChild(bgNode, getMaxzIndex(canvas.node));
  var finished = cc.callFunc(function () {
    bgNode.destroy();
  });
  var action = cc.sequence(
    cc.moveBy(duration, cc.v2(0, 0)),
    cc.fadeOut(0.4),
    finished
  );
  bgNode.runAction(action);
}

module.exports = Toast;
