cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node,
        mainScrollView: cc.ScrollView,
        contentNode: [cc.Node],
        mainContent: cc.Node
    },

    update(dt) {
        var viewRect = cc.rect(-this.mainScrollView._view.width * 0.2,
            -this.mainContent.y - (this.mainScrollView._view.height * 0.5),
            this.mainScrollView._view.width,
            this.mainScrollView._view.height);
        if (this.contentNode.length > 0) {
            for (var i = 0; i < this.contentNode.length; i++) {
                if (this.contentNode[i].active == true) {
                    this.setContent(this.contentNode[i], viewRect);
                }
            }
        } else {
            this.setContent(this.mainContent, viewRect);
        }

    },
    setContent: function (target, viewRect) {
        if (target) {
            for (let i = 0; i < target.children.length; i++) {
                const node = target.children[i];
                var _tmpBoundingBoxNode = {
                    x: 0,
                    y: 0,
                    width: node.width,
                    height: node.height
                }
                var _wNodePos = node.parent.convertToWorldSpaceAR(node.position);
                _tmpBoundingBoxNode.x = _wNodePos.x - node.width * 0.5;
                _tmpBoundingBoxNode.y = _wNodePos.y - node.height * 0.5;
                var _viewRectBoundingBox = {
                    x: 0,
                    y: 0,
                    width: this.mainScrollView.node.width,
                    height: this.mainScrollView.node.height
                }
                var _wParentPos = this.mainScrollView.node.parent.convertToWorldSpaceAR(this.mainScrollView.node.position);
                _viewRectBoundingBox.x = _wParentPos.x - this.mainScrollView.node.width * 0.5;
                _viewRectBoundingBox.y = _wParentPos.y - this.mainScrollView.node.height * 0.5;
                if (cc.Intersection.rectRect(_viewRectBoundingBox, _tmpBoundingBoxNode)) {
                    node.opacity = 255;
                } else {
                    node.opacity = 0;
                }
            }
        }
    }
});
