// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onLoad () {
        this.fitNode();
    }
  
    fitNode() {
        let canvasSize = cc.view.getCanvasSize();
        let canvasScale = canvasSize.width / canvasSize.height;
        let designScale = 720 / 1280;
        this.bg.height = 1280 * (designScale / canvasScale);
    }

    // update (dt) {}
}
