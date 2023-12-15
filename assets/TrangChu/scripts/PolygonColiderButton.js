// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
        mapNode: cc.Node
    },
    onLoad() { },

    start() {
        this.polygonColider = this.node.getComponent(cc.PolygonCollider);
    },
    updateCollider: function (points) {
        //phải giữ nguyên vị trí ban đầu, sau đấy tính độ lệch rồi mới apply vào child chứa node.
        //không lưu biến tạm, khó update.
        if (points) {
            var polygonName = "HQ_POLY";

            var polygon = this.node.getChildByName(polygonName);
            if (!polygon || (polygon && !cc.isValid(polygon))) {
                polygon = new cc.Node();
                polygon.addComponent(cc.PolygonCollider);
                polygon.name = polygonName;
                this.node.addChild(polygon);
            }
            if (polygon) {
                var polygonColider = polygon.getComponent(cc.PolygonCollider);
                if (polygonColider) {
                    polygonColider.points = [];
                    for (var i = 0; i < points.length; i++) {
                        var pos = polygon.convertToNodeSpaceAR(cc.v2(points[i].x, points[i].y));
                        polygonColider.points.push(pos);
                    }
                }
            }
        }
    },
    rePositionButton: function () {
        var points = this.polygonColider.points;
        var positionCamera = this.cameraNode.parent.convertToWorldSpaceAR(this.cameraNode.position);
        var cameraWidth = this.cameraNode.width;
        var camerHeight = this.cameraNode.height;
        var positionMap = this.mapNode.parent.convertToWorldSpaceAR(this.mapNode.position);
        var gapX = positionMap.x - positionCamera.x;
        var gapY = positionMap.y - positionCamera.y;
        var i = 0;
        var posX = 0;
        var posY = 0;
        var polyPositionW = cc.v2(0, 0);
        var newPosition = [];
        var polyPositionL = cc.v2(0, 0);
        for (i; i < points.length; i++) {
            polyPositionW = this.node.parent.convertToWorldSpaceAR(cc.v2(points[i].x, points[i].y));
            posX = polyPositionW.x + gapX;
            posY = polyPositionW.y + gapY;
            newPosition.push(cc.v2(posX, posY));
        }
        if (newPosition && newPosition.length > 0) {
            this.updateCollider(newPosition);
        }
    },
    update(dt) {
        if (this.polygonColider && this.cameraNode && this.mapNode && cc.isValid(this.polygonColider) && cc.isValid(this.cameraNode) && cc.isValid(this.mapNode)) {
            this.rePositionButton();
        }

    }
});
