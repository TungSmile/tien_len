const { ccclass, property, requireComponent } = cc._decorator;
@ccclass
@requireComponent(cc.Widget)
export default class ComponentAdaptive extends cc.Component {
  onLoad() {
    cc.Canvas.instance.node.on("ON_CANVAS_ADAPTIVE", this.onCanvasResize, this);
    this.onCanvasResize();
  }
  onCanvasResize() {
    let sizeCanvas = cc.size(
      cc.Canvas.instance.node.width,
      cc.Canvas.instance.node.height
    );
    this.node.width = sizeCanvas.width;
    this.node.height = sizeCanvas.height;
  }
}
