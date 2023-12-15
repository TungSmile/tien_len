var Linker = require('Linker');
var ParseData = require('ParseData');
var CommonParse = require('CommonParse');
var LobbyParse = require('LobbyParse');

var GameManager1100 = {
    load: function (tempData) {
        cc.log("chay vao day", tempData);
        switch (Linker.ZONE) {
            case 4: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 5: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 37: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 10: {
                var response = XocDiaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 15: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 14: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 11: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 9: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 8: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                // SceneManager.loadScene('BiDaScene', function () { });
                break;
            }
            case 84: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                // SceneManager.loadScene('BiDaScene', function () { });
                break;
            }
            case 86: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                // SceneManager.loadScene('BiDaScene', function () { });
                break;
            }
            case 44: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                // SceneManager.loadScene('BiDaScene', function () { });
                break;
            }
            case 45: {
                //soccer galaxy
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);

                break;
            }

            case 46: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                // SceneManager.loadScene('HeadBallPlay', function () {});
                break;
            }
            case 47: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                // SceneManager.loadScene('HeadBallPlay', function () {});
                break;
            }
            case 48: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }

            default: {
                break;
            }
        }
    }
}
module.exports = GameManager1100;