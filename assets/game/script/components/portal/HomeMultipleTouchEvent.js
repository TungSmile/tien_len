cc.Class({
    extends: cc.Component,

    properties: {
        homeTouchEventNode: cc.Node,
        parentHomeTouchEventNode: cc.Node,
        targetScale: cc.Node
    },
    getHomeTouchEvent: function () {
        if (this.homeTouchEventNode && cc.isValid(this.homeTouchEventNode)) {
            var homeTouchEventScript = this.homeTouchEventNode.getComponent("HomeTouchEvent");
            if (homeTouchEventScript) {
                return homeTouchEventScript;
            }
        }
        return null;
    },
    getParentHomeTouchEvent: function () {
        if (this.parentHomeTouchEventNode && cc.isValid(this.parentHomeTouchEventNode)) {
            var parentHomeTouchEventScript = this.parentHomeTouchEventNode.getComponent("HomeMapDreamCity");
            if (parentHomeTouchEventScript) {
                return parentHomeTouchEventScript;
            }
        }
        return null;
    },
    pushTouchEventToHomeTouch: function (event) {
        if (event) {
            var homeTouchEventScript = this.getHomeTouchEvent();
            if (homeTouchEventScript && cc.isValid(homeTouchEventScript)) {
                cc.error("Push from multi touches...");
                homeTouchEventScript.onMovingButtonMap(event);
            }
        }
    },
    pushTouchEventToParentHomeTouch: function (event) {
        if (event) {
            var homeParentTouchEventScript = this.getParentHomeTouchEvent();
            if (homeParentTouchEventScript && cc.isValid(homeParentTouchEventScript)) {
                cc.error("Push from multi touches...");
                switch (event._key) {
                    case cc.Node.EventType.TOUCH_START:
                        homeParentTouchEventScript.onButtonMapStart(event);
                        break;
                    case cc.Node.EventType.TOUCH_MOVE:
                        homeParentTouchEventScript.onButtonMapMove(event);
                        break;
                    case cc.Node.EventType.TOUCH_END:
                        event._multipleTouch = true;
                        homeParentTouchEventScript.onButtonMapEnd(event);
                        break;
                    case cc.Node.EventType.TOUCH_CANCEL:
                        homeParentTouchEventScript.onButtonMapCancle(event);
                        break;
                    default:
                        break;

                }
            }
        }
    },
    stopEvent: function (event) {
        event.stopPropagationImmediate();
    },
    onLoad() {
        // this.addMultipleTouchEvent();
    },
    addMultipleTouchEvent: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchesStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchesMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchesEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchesCancle, this);
    },
    isMultipleTouches: function (event) {
        if (event) {
            var touches = event.getTouches();
            if (touches && touches.length >= 2) {
                return true;
            }
        }
        return false;
    },
    zoomIn: function (event) {
        if (event) {

        }
    },
    zoomOut: function (event) {
        if (event) {

        }
    },
    isZoomIn: function (event) {
        // nếu không phóng to thì là thu nhỏ
        if (event) {

        }
        return false;
    },
    onTouchesStart: function (event) {
        if (event) {
            //1. Kiểm tra xem người dùng có thực hiện một hành động multiple touches không.
            //2. Thay đổi anchor point của map.
            //3. Zoom in(phóng to) hoặc Zoom out(thu nhỏ) phải xem xét gusture của user.
            if (this.isMultipleTouches(event)) {
                //
            } else {
                event._key = cc.Node.EventType.TOUCH_START;
                this.pushTouchEventToParentHomeTouch(event);
                // this.stopEvent(event);
            }
        }
    },
    onTouchesMove: function (event) {
        if (event) {
            if (this.isMultipleTouches(event)) {
                var touches = event.getTouches();
                var touch1 = touches[0];
                var touch2 = touches[1];
                var delta1 = touch1.getDelta();
                var delta2 = touch2.getDelta();
                var parent = this.node;
                var self = this;
                // +++++++++++
                // +  A - B  +
                // +++++++++++
                var touchPoint1 = parent.convertToNodeSpaceAR(touch1.getLocation());
                var touchPoint2 = parent.convertToNodeSpaceAR(touch2.getLocation());
                var distance = touchPoint1.sub(touchPoint2);
                var delta = delta1.sub(delta2);
                var scale = 1;
                if (Math.abs(distance.x) > Math.abs(distance.y)) {
                    scale = (distance.x + delta.x) / distance.x * self.targetScale.scale;
                } else {
                    scale = (distance.y + delta.y) / distance.y * self.targetScale.scale;
                }
                let windowSize = cc.view.getVisibleSize();
                var minScale = 0.5;
                var maxScale = 1;
                if (scale < minScale) {
                    this.targetScale.scale = minScale;
                } else if (scale > maxScale) {
                    this.targetScale.scale = maxScale;
                } else {
                    this.targetScale.scale = scale;
                }
                this.goToBoundary(event);
            } else {
                event._key = cc.Node.EventType.TOUCH_MOVE;
                this.pushTouchEventToParentHomeTouch(event);
                // this.stopEvent(event);

            }
        }
    },
    goToBoundary: function(event){

    },
    onTouchesEnd: function (event) {
        if (event) {
            if (this.isMultipleTouches(event)) {

            } else {
                event._key = cc.Node.EventType.TOUCH_END;
                this.pushTouchEventToParentHomeTouch(event);
                // this.stopEvent(event);

            }
        }
    },
    onTouchesCancle: function (event) {
        if (event) {
            if (this.isMultipleTouches(event)) {

            } else {
                event._key = cc.Node.EventType.TOUCH_CANCEL;
                this.pushTouchEventToParentHomeTouch(event);
                // this.stopEvent(event);

            }
        }
    },
    start() {

    },

    // update (dt) {},
});
