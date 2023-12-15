
var SocketConstant = require("SocketConstant");
var Linker = require("Linker");

var Utils = require('Utils');
var ChatBoxParse = {
    parse(message) {
        var tempData = message;
        switch (Number(tempData.messageId)) {
            case 260198: {
                return this.parse_260198_message(tempData.messageId, tempData.status, tempData.data);

            }
            case 270198: {
                return this.parse_270198_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 280198: {
                return this.parse_280198_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 290198: {
                return this.parse_290198_message(tempData.messageId, tempData.status, tempData.data);
            }

        }
    },

    parse_260198_message(messageId, status, obj) {
        var response = {
            messageId: JSON.parse(obj).mMsgId,
            status: JSON.parse(obj).status,
        };
        if (!status) {
            response.error = obj;
            return response;
        }
        response.data = JSON.parse(obj);
        return response;
    },
    parse_270198_message(messageId, status, obj) {
        var data = {};
        if (!status) {
            data.error = obj;
            return data;
        }
        
        data = JSON.parse(obj);
        
        return data;
    },
    parse_280198_message(messageId, status, obj) {
        var data = {};
        if (!status) {
            data.error = obj;
            return data;
        }
        
        data = JSON.parse(obj);
        
        return data;
    },
    parse_290198_message(messageId, status, obj) {
        var data = {};
        if (!status) {
            data.error = obj;
            return data;
        }
        
        data = JSON.parse(obj);
        
        return data;
    },


}

module.exports = ChatBoxParse;