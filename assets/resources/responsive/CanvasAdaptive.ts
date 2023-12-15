import { Util2s } from "./Utils2";

const { ccclass, property, disallowMultiple } = cc._decorator;
@ccclass
@disallowMultiple()

export default class CanvasAdaptive extends cc.Component {
  onLoad() {
    // if (cc.sys.isMobile) {
    //   window.addEventListener("resize", this.onResized.bind(this));
    // } else {
    //   cc.view.on("canvas-resize", this.onResized, this);
    // }
    this.onResized();
  }
  onResized() {
    let canvas = cc.Canvas.instance;
    let deviceSize = Util2s.getDeviveSize();
    var finalW = deviceSize.width;
    var finalH = deviceSize.height;
    canvas.designResolution = cc.size(finalW, finalH);
    canvas.node.width = finalW;
    canvas.node.height = finalH;
    canvas.node.emit("ON_CANVAS_ADAPTIVE");
  }
}
