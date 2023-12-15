var Linker = require('Linker');
var LobbySend = require('LobbySend');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        buttonPolygon: cc.Node,
        ZONE_ID: {
            type: new cc.Enum(Constant.ZONE_ID),
            default: Constant.ZONE_ID.UNDEFINED
        },
        loadingGameNode: cc.Node
    },
    setMapCameraNode: function (camera) {
        if (camera) {
            this.mapCameraNode = camera;
        } else {
            this.mapCameraNode = null;
        }
    },
    setMapNode: function (map) {
        if (map) {
            this.mapNode = map;
        } else {
            this.mapNode = null;
        }
    },
    getMapNode: function (map) {
        if (this.mapNode) {
            return this.mapNode;
        }
        return null;
    },
    getMapCameraNode: function () {
        if (this.mapCameraNode) {
            return this.mapCameraNode;
        }
        return null;
    },
    getMapCamera: function () {
        if (this.mapCameraNode) {
            return this.mapCameraNode.getComponent(cc.Camera);
        }
        return null;
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    requestGhepDoi: function () {
        var zoneId = this.ZONE_ID;
        var uid = Linker.userData.userId;
        var money = 1000;
        if (parseInt(zoneId) != 0 && parseInt(uid) != 0 && (isNaN(money) == false && Number(money) != 0)) {
            var data = LobbySend.requestGhepDoi(uid, zoneId, money);
            Linker.Socket.send(data);
        }
    },
    requestJoinGame: function () {
    },
    start() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMoveButtonGame, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClickButtonGame, this);
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },
    onMoveButtonGame: function (event) {
        if (event) {
            var customEvent = new cc.Event.EventCustom("ON_MOVING_MAP", true);
            customEvent._cevent = event;
            this.node.dispatchEvent(customEvent);
        }
    },
    onClickButtonGame: function (event) {
        if (event) {
            if (this.buttonPolygon && cc.isValid(this.buttonPolygon)) {
                var polygonColider = this.buttonPolygon.getComponent(cc.PolygonCollider);
                if (polygonColider) {
                    var points = polygonColider.points;
                    var offsetX = polygonColider.offset.x;
                    var offsetY = polygonColider.offset.y;
                    var wpoints = [];
                    for (var i = 0; i < points.length; i++) {
                        var pos = this.buttonPolygon.parent.convertToWorldSpaceAR(cc.v2(points[i].x + offsetX, points[i].y + offsetY));
                        wpoints.push(pos);
                    }
                    if (cc.Intersection.pointInPolygon(event.touch.getLocation(), wpoints)) {
                        cc.log("Request join game...");
                        //this.requestGhepDoi();
                        this.notifyButtonGameClick();
                    } else {
                        cc.log("Nope");
                    }
                }
            }
        }
    },
    offsetColider: function (dt) {
        if (this.buttonPolygon && cc.isValid(this.buttonPolygon)) {
            var polygonColider = this.buttonPolygon.getComponent(cc.PolygonCollider);
            if (polygonColider) {
                var cameraNode = this.getMapCameraNode();
                var mapNode = this.getMapNode();
                if (cameraNode && mapNode) {

                    // var mapScaleX = mapNode.scaleX;//0.5
                    // var mapScaleY = mapNode.scaleY;//0.5
                    // var _minMapScaleX = cameraNode.width / mapNode.width;
                    // var _minMapScaleY = cameraNode.height / mapNode.height;
                    // var gapX = Math.abs(1 - (mapScaleX / _minMapScaleX));
                    // var gapY = Math.abs(1 - (mapScaleY / _minMapScaleY));
                    // var mapScaleX = mapNode.scaleX;//0.5
                    // var mapScaleY = mapNode.scaleY;//0.5
                    //khi map scale x = 1;
                    //khi map scale y = 1;
                    //thi dung
                    polygonColider.offset.x = -cameraNode.x;
                    polygonColider.offset.y = -cameraNode.y;


                    // var scaleX = Math.abs(_minMapScaleX - gapX);
                    // var scaleY = Math.abs(_minMapScaleY - gapY);
                    // scaleX = scaleX / _minMapScaleX;
                    // scaleY = scaleY / _minMapScaleX;
                    // this.buttonPolygon.setScale(scaleX, scaleY);
                }

            }
        }
    },
    update(dt) {
        this.offsetColider(dt);
    },

    notifyButtonGameClick() {
        var event = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.ON_BUTTON_GAME_HALL_SCENE_CLICK, true);
        event.isButtonGameClick = true;
        event.data = event;
        event.loadingContainer = this.loadingGameNode;
        event.chooseZone = this.ZONE_ID;
        event.name = this.getGameNameByZoneId(this.ZONE_ID);
        this.node.dispatchEvent(event);
    },

    getGameNameByZoneId(zoneId) {
        switch(zoneId) {
            case 15: {
                return "btnPoker";
            }
        }
    }
});