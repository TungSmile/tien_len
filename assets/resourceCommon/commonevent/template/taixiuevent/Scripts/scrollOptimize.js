cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node,
        mainScrollView: cc.ScrollView,
        contentNode: [cc.Node],
        mainContent: cc.Node
    },

    update(dt) {
        var viewRect = cc.rect(-this.mainScrollView._view.width * 0.5,
            -this.mainContent.y - this.mainScrollView._view.height,
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
                if (node.active == true) {
                    if (viewRect.intersects(node.getBoundingBox())) {
                        node.opacity = 255;
                    } else {
                        node.opacity = 0;
                    }
                }

            }
        }
    }
});
