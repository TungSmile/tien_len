cc.Class({
    extends: cc.Component,

    properties: {
        homeCameraNode: cc.Node,
        mapNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onHomeTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onHomeTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onHomeTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onHomeTouchCancle, this);
        // this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.onHomeMouseWheel, this);
        this.speedX = 0.8;
        this.speedY = 0.8;
        this.maxMapScaleX = 1;
        this.maxMapScaleY = 1;
        this.initMapScaleX = 1;
        this.initMapScaleY = 1;
        this.initMapPos = cc.v2(0, 0);
        this.minMapScaleX = this.homeCameraNode.width / this.mapNode.width;
        this.minMapScaleY = this.homeCameraNode.height / this.mapNode.height;

        // this.mapNode.scaleX = this.minMapScaleX;
        // this.mapNode.scaleY = this.minMapScaleY;
        this.mapNode.scaleX = this.initMapScaleX;
        this.mapNode.scaleY = this.initMapScaleY;
        // this.homeCameraNode.position = cc.v2(-256.218, 118.652);
        this.stepScrollScaleRateY = 0.05;

    },
    onHomeMouseWheel: function (event) {
        if (event) {
            var scrollYValue = event.getScrollY();
            var _scrollXScale = this.mapNode.scaleX;
            var _scrollYScale = this.mapNode.scaleY;
            if (scrollYValue >= 0) {
                _scrollXScale += this.stepScrollScaleRateY;
                _scrollYScale += this.stepScrollScaleRateY;
            } else {
                _scrollXScale -= this.stepScrollScaleRateY;
                _scrollYScale -= this.stepScrollScaleRateY;
            }
            if (_scrollXScale < this.minMapScaleX) {
                _scrollXScale = this.minMapScaleX;
            }
            if (_scrollXScale > this.maxMapScaleX) {
                _scrollXScale = this.maxMapScaleX;
            }
            if (_scrollYScale < this.minMapScaleY) {
                _scrollYScale = this.minMapScaleY;
            }
            if (_scrollYScale > this.maxMapScaleY) {
                _scrollYScale = this.maxMapScaleY;
            }
            if (this.isValidCameraMoving(this.homeCameraNode.position, { x: _scrollXScale, y: _scrollYScale })) {
                this.mapNode.setScale(_scrollXScale, _scrollYScale);
            }
        }
    },
    onHomeTouchStart: function (event) {
        if (event) {
            cc.error("On start...");
        }
    },
    onHomeTouchMove: function (event) {
        if (event) {
            cc.error("On moving...");
            var delta = event.getDelta();
            var cameraPos = this.homeCameraNode.position;
            var _newCameraPos = cc.v2(cameraPos.x - delta.x * this.speedX, cameraPos.y - delta.y * this.speedY);
            if (this.isValidCameraMoving(_newCameraPos)) {
                this.homeCameraNode.position = _newCameraPos;
            } else {
                // this.homeCameraNode.position = cc.v2(0, 0);
            }
        }
    },
    onMovingButtonMap: function (event) {
        if (event) {
            var _key = event._key;
            if (_key) {
                this.node.on(cc.Node.EventType.TOUCH_START, this.onHomeTouchStart, this);
                this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onHomeTouchMove, this);
                this.node.on(cc.Node.EventType.TOUCH_END, this.onHomeTouchEnd, this);
                this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onHomeTouchCancle, this);
                switch (_key) {
                    case cc.Node.EventType.TOUCH_START:
                        this.onHomeTouchStart(event);
                        break;
                    case cc.Node.EventType.TOUCH_MOVE:
                        this.onHomeTouchMove(event);
                        break;
                    case cc.Node.EventType.TOUCH_END:
                        this.onHomeTouchEnd(event);
                        break;
                    case cc.Node.EventType.TOUCH_CANCEL:
                        this.onHomeTouchCancle(event);

                        break;
                    default:
                        this.onHomeTouchCancle(event);
                        break;

                }
            }
        }
    },
    isValidCameraMoving: function (position, checkScale) {
        if (position) {
            checkScale = checkScale ? checkScale : { x: this.mapNode.scaleX, y: this.mapNode.scaleY };
            var offset = 0;//offset 10px
            var _scaleMapX;
            var _scaleMapY;
            var _scaleCameraX;
            var _scaleCameraY;
            var _scaleMap;
            var _scaleCamera;
            var _textureSpriteMap = this.mapNode.getComponent(cc.Sprite);
            var _textureSpriteCamera = this.homeCameraNode.getComponent(cc.Sprite);
            if (!_textureSpriteMap) {
                var BgNodeMap = this.mapNode.getChildByName("Bg");
                if (!BgNodeMap) {
                    BgNodeMap = this.mapNode.getChildByName("bg");
                }
                if (!BgNodeMap) {
                    BgNodeMap = this.mapNode.getChildByName("background");
                }
                if (BgNodeMap) {
                    _textureSpriteMap = BgNodeMap.getComponent(cc.Sprite);
                }
            }
            if (_textureSpriteMap && _textureSpriteCamera) {
                var _textureFrameMap = _textureSpriteMap.spriteFrame.getTexture();
                var _textureFrameCamera = _textureSpriteCamera.spriteFrame.getTexture();

                var _sizeMap = cc.size(_textureFrameMap.width, _textureFrameMap.height);
                var _sizeCamera = cc.size(_textureFrameCamera.width, _textureFrameCamera.height);

                var _dsize = cc.view.getFrameSize();

                _scaleMapX = Math.max(_sizeMap.width / _dsize.width);
                _scaleMapY = Math.max(_sizeMap.height / _dsize.height);
                _scaleCameraX = Math.max(_sizeCamera.width / _dsize.width);
                _scaleCameraY = Math.max(_sizeCamera.height / _dsize.height);

                _scaleMap = Math.max(_sizeMap.width / _dsize.width, _sizeMap.height / _dsize.height);
                _scaleCamera = Math.max(_sizeCamera.width / _dsize.width, _sizeCamera.height / _dsize.height);

                this.mapNode.width = _dsize.width * _scaleMapX;
                this.mapNode.height = _dsize.height * _scaleMapY;
                this.homeCameraNode.width = _dsize.width * _scaleCameraX;
                this.homeCameraNode.height = _dsize.height * _scaleCameraY;
            }
            var _mapNodeWidth = this.mapNode.width;
            var _mapNodeHeight = this.mapNode.height;
            var _cameraNodeWidth = this.homeCameraNode.width;
            var _cameraNodeHeight = this.homeCameraNode.height;
            var minX = -(_mapNodeWidth * checkScale.x * 0.5) + (_cameraNodeWidth * 0.5 + offset);
            var maxX = (_mapNodeWidth * checkScale.x * 0.5) - (_cameraNodeWidth * 0.5 + offset);
            var minY = -(_mapNodeHeight * checkScale.y * 0.5) + (_cameraNodeHeight * 0.5 + offset);
            var maxY = (_mapNodeHeight * checkScale.y * 0.5) - (_cameraNodeHeight * 0.5 + offset);
            if (position.x >= minX && position.x <= maxX && position.y >= minY && position.y <= maxY) {
                return true;
            } else {
                return false;
                //moving animation
            }

        }
        return false;
    },
    onHomeTouchEnd: function (event) {
        if (event) {
            cc.error("On end...");
            if (!this.isValidCameraMoving(this.homeCameraNode.position)) {
                this.homeCameraNode.position = cc.v2(0, 0);
            }
        }
    },
    onHomeTouchCancle: function (event) {
        if (event) {
            cc.error("On cancle...");
            this.onHomeTouchEnd(event);
        }
    }
    // update (dt) {},
});
