var ccSpawn = cc.spawn,
    ccSequence = cc.sequence;

function createWrapper(original) {
    return function (array) {
        if (!Array.isArray(array)) {
            array = Array.prototype.slice.call(arguments);
        }
        while (array.length < 2) {
            array.push(cc.callFunc(function () { }));
        }
        return original.call(null, array);
    };
}
cc.spawn = createWrapper(ccSpawn);
cc.sequence = createWrapper(ccSequence);
var Global = require('Global');
var BiDaConstant = require('BiDaConstant');
var Constant = require('Constant');
var soccerConstant = require('soccerConstant');
var TQUtil = require('TQUtil');
var i18n = require('i18n');
var Utils = {
    String: {
        CaseType: cc.Enum({
            NONE: 0,
            UPPER: 1,
            LOWER: 2,
            CAMEL: 3,
        }),

        changeCase: function (s, strCase) {
            switch (strCase) {
                case this.CaseType.NONE:
                    return s;
                case this.CaseType.UPPER:
                    return s.toUpperCase();
                case this.CaseType.LOWER:
                    return s.toLowerCase();
                case this.CaseType.CAMEL:
                    return s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase();
            }
        },

        param: function (abj) {
            var s = [],
                rbracket = /\[\]$/,
                isArray = function (obj) {
                    return Array.isArray(obj);
                },
                add = function (k, v) {
                    v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
                    s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
                },
                buildParams = function (prefix, obj) {
                    var i, len, key;

                    if (prefix) {
                        if (isArray(obj)) {
                            for (i = 0, len = obj.length; i < len; i += 1) {
                                if (rbracket.test(prefix)) {
                                    add(prefix, obj[i]);
                                }
                                else {
                                    buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i]);
                                }
                            }
                        }
                        else if (obj && String(obj) === '[object Object]') {
                            for (key in obj) {
                                buildParams(prefix + '[' + key + ']', obj[key]);
                            }
                        }
                        else {
                            add(prefix, obj);
                        }
                    }
                    else if (isArray(obj)) {
                        for (i = 0, len = obj.length; i < len; i += 1) {
                            add(obj[i].name, obj[i].value);
                        }
                    }
                    else {
                        for (key in obj) {
                            buildParams(key, obj[key]);
                        }
                    }
                    return s;
                };

            return buildParams('', abj).join('&').replace(/%20/g, '+');
        },

        deparam: function (query) {
            var pair,
                query_string = {},
                vars = query.split('̃&');
            for (var i = 0; i < vars.length; i += 1) {
                pair = vars[i].split('=');
                pair[0] = decodeURIComponent(pair[0]);
                pair[1] = decodeURIComponent(pair[1]);
                // If first entry with this name
                if (typeof query_string[pair[0]] === 'undefined') {
                    query_string[pair[0]] = pair[1];
                    // If second entry with this name
                }
                else if (typeof query_string[pair[0]] === 'string') {
                    var arr = [query_string[pair[0]], pair[1]];
                    query_string[pair[0]] = arr;
                    // If third or later entry with this name
                }
                else {
                    query_string[pair[0]].push(pair[1]);
                }
            }
            return query_string;
        },

        removeRichText: (function () {
            var REGEXES = [
                /<i>(.*)<\/i>/i,
                /<b>(.*)<\/b>/i,
                /<color(?:=[^>]*)*>(.+)<\/color>/i,
            ];
            return function (string) {
                var i;
                for (i = 0; i < REGEXES.length; i += 1) {
                    string = string.replace(REGEXES[i], '$1');
                }
                return string;
            };
        }()),

        escape: function (str) {
            return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    },

    Array: {
        removeRef: function (arr, elem) {
            var i = arr.indexOf(elem);
            if (i > -1) {
                arr.splice(i, 1);
            }
        },

        remove: function (arr, elem) {
            var i = Utils.Array.indexOf(arr, elem);
            if (i > -1) {
                arr.splice(i, 1);
            }
        },

        /**
         * Iterate an array and touch each its element, even if the array can be modified.
         *
         * @param  {Array} arr     array
         * @param  {Function} handler same as callback of ``Array.prototype.forEach()``
         */
        forEach: function (arr, handler) {
            arr.slice().forEach(handler);
        },

        trimLeft: function (arr, size) {
            while (arr.length > size) {
                arr.shift();
            }
        },

        trimRight: function (arr, size) {
            while (arr.length > size) {
                arr.pop();
            }
        },

        /**
         * Same as Array.prototype.indexOf() but deal with equality better.
         */
        indexOf: function (arr, val) {
            if (arr && Array.isArray(arr) && arr.length > 0 && val) {
                for (var i = 0; i < arr.length; i++) {
                    if (Utils.Object.isEqual(arr[i], val)) {
                        return i;
                    }
                }
            }
            return -1;
        },

        unique: function (arr) {
            var result = [],
                val,
                i;
            for (i = 0; i < arr.length; i += 1) {
                val = arr[i];
                if (result.indexOf(val) === -1) {
                    result.push(val);
                }
            }
            return result;
        },

        pushUnique: function (arr, val) {
            if (Utils.Array.indexOf(arr, val) === -1) {
                arr.push(val);
                return true;
            }
            return false;
        },

        createCircular: (function () {
            function Circular(array) {
                this._array = array;
                this._index = -1;
            }

            Circular.prototype.next = function () {
                this._index += 1;
                if (this._index >= this._array.length) {
                    this._index = 0;
                }
                return this._array[this._index];
            };

            Circular.prototype.prev = function () {
                this._index -= 1;
                if (this._index < 0) {
                    this._index = this._array.length - 1;
                }
                return this._array[this._index];
            };

            return function (array) {
                return new Circular(array);
            };
        }())
    },

    Set: {
        compare: function (set1, set2) {
            var same = [],
                diff12 = [],
                diff21 = [];

            if (set1 === set2) {
                same = set1.slice();
            }
            else {
                var i, j, v1, v2;
                diff12 = set1.slice();
                diff21 = set2.slice();
                for (i = 0; i < set1.length; i += 1) {
                    v1 = set1[i];
                    for (j = 0; j < set2.length; j += 1) {
                        v2 = set2[j];
                        if (Utils.Object.isEqual(v1, v2)) {
                            same.push(v1);
                            Utils.Array.remove(diff12, v1);
                            Utils.Array.remove(diff21, v1);
                            break;
                        }
                    }
                }
            }

            return {
                same: same,
                diff12: diff12,
                diff21: diff21
            };
        }
    },

    Object: {
        isEqual: function (o1, o2) {
            if (o1 === o2) {
                return true;
            }

            if (typeof o1 !== typeof o2) {
                return false;
            }

            if (o1 === undefined || o1 === null || (typeof o1 === 'number' && isNaN(o1) && isNaN(o2))) {
                return true;
            }

            var isDate1 = Utils.Type.isDate(o1),
                isDate2 = Utils.Type.isDate(o2);

            if ((isDate1 && !isDate2) || (!isDate1 && isDate2)) {
                return false;
            }
            if (isDate1 && isDate2) {
                return o1.getTime() === o2.getTime();
            }

            var isRegExp1 = Utils.Type.isRegExp(o1),
                isRegExp2 = Utils.Type.isRegExp(o2);

            if ((isRegExp1 && !isRegExp2) || (!isRegExp1 && isRegExp2)) {
                return false;
            }
            if (isRegExp1 && isRegExp2) {
                return o1.toString() === o2.toString();
            }

            if (Utils.Type.isObject(o1) && Utils.Type.isObject(o2)) {
                var o1Props = Object.getOwnPropertyNames(o1),
                    o2Props = Object.getOwnPropertyNames(o2),
                    i;

                if (o1Props.length !== o2Props.length) {
                    return false;
                }

                for (i = 0; i < o1Props.length; i += 1) {
                    if (!Utils.Object.isEqual(o1[o1Props[i]], o2[o2Props[i]])) {
                        return false;
                    }
                }

                return true;
            }
            else {
                return o1 === o2;
            }
        },

        /**
         * Find object inside parent object whose value of prop name is equality with specified value.
         *
         * @param  {Object} obj       parent object to find
         * @param  {String} propName  property name
         * @param  {*}      propValue property value
         * @return {Object}           found object or null
         */
        findObject: function (obj, propName, propValue) {
            var prop;
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    var val = obj[prop];
                    if (Utils.Type.isObject(val) && val[propName] === propValue) {
                        return val;
                    }
                }
            }
            return null;
        },

        replaceProperty: function (obj, oldProp, newProp) {
            var value = obj[oldProp];
            delete obj[oldProp];
            obj[newProp] = value;
        },

        isEmpty: function (obj) {
            return Object.getOwnPropertyNames(obj).length === 0;
        },

        /**
         * Return new object with same properties of original object, but all its props
         * are unchangable.
         *
         * @param  {Object} obj original object
         * @return {Object}     constant object
         */
        toConstant: function (obj) {
            var r = {},
                prop;
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    var val = obj[prop];
                    if (Utils.Type.isObject(val)) {
                        val = Utils.Object.toConstant(val);
                    }
                    Object.defineProperty(r, prop, {
                        value: val,
                        writable: false,
                        enumerable: true,
                        configurable: true
                    });
                }
            }
            return r;
        },

        values: function (obj) {
            if (Utils.Type.isFunction(Object.values)) {
                return Object.values(obj);
            }

            var values = [],
                prop;
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    values.push(obj[prop]);
                }
            }
            return values;
        },
    },

    Type: {
        isString: function (obj) {
            return typeof obj === 'string';
        },

        isNumber: function (obj) {
            return typeof obj === 'number' && !isNaN(obj);
        },

        isObject: function (obj) {
            return typeof obj === 'object' && obj !== null;
        },

        isFunction: function (obj) {
            return typeof obj === 'function';
        },

        isUndefined: function (obj) {
            return typeof obj === 'undefined';
        },

        isDefined: function (obj) {
            return !this.isUndefined(obj) && obj !== null;
        },

        isArray: function (obj) {
            return Array.isArray(obj);
        },

        isDate: function (obj) {
            return obj instanceof Date;
        },

        isRegExp: function (obj) {
            return obj instanceof RegExp;
        }
    },

    Number: {
        format: function (number) {
            var numberStr = Math.abs(number).toString(),
                intStrPartNew = '',
                parts, intStrPart, floatPart, i, j;
            numberStr = numberStr.replace('.', ',');
            parts = numberStr.split(',');
            intStrPart = parts[0];
            floatPart = parts[1];
            for (i = intStrPart.length - 1, j = 1; i >= 0; i -= 1, j += 1) {
                intStrPartNew = intStrPart[i] + intStrPartNew;
                if (j % 3 === 0 && i !== 0) {
                    intStrPartNew = '.' + intStrPartNew;
                }
            }
            return ((number < 0 ? '-' : '') + intStrPartNew + (floatPart ? (',' + floatPart) : ''));
        },

        abbreviate: function (number, decPlaces) {
            // 2 decimal places => 100, 3 => 1000, etc
            decPlaces = Math.pow(10, decPlaces || 2);

            // Enumerate number abbreviations
            var abbrev = ['K', 'M', 'B', 'T'],
                str = (number < 0) ? '-' : '',
                size;

            number = Math.abs(number);

            // Go through the array backwards, so we do the largest first
            for (var i = abbrev.length - 1; i >= 0; i -= 1) {
                // Convert array index to '1000', '1000000', etc
                size = Math.pow(10, (i + 1) * 3);
                // If the number is bigger or equal do the abbreviation
                if (size <= number) {
                    // Here, we multiply by decPlaces, round, and then divide by decPlaces.
                    // This gives us nice rounding to a particular decimal place.
                    number = Math.floor(number * decPlaces / size) / decPlaces;
                    // Handle special case where we round up to the next abbreviation
                    if ((number === 1000) && (i < abbrev.length - 1)) {
                        number = 1;
                        i += 1;
                    }
                    // Add the letter for the abbreviation
                    number += abbrev[i];
                    // We are done... stop
                    break;
                }
            }
            return str + number;
        },

        fillZero: function (number, maxSize) {
            var s = '' + number;
            while (s.length < maxSize) {
                s = '0' + s;
            }
            return s;
        },

        random: function (from, to) {
            var add = (from === 0 || to === 0) ? 1 : 0;
            return Math.floor((Math.random() * (to + add)) + from);
        }
    },

    Date: {
        currentTime: function () {
            var date = new Date();
            return Utils.Number.fillZero(date.getHours(), 2) + ':' +
                Utils.Number.fillZero(date.getMinutes(), 2) + ':' +
                Utils.Number.fillZero(date.getSeconds(), 2);
        },
        /**
         * Convert "2016-11-17 17:50:00" to Date(2016, 11, 17, 17, 50, 00)
         */
        fromString: function (s) {
            var year = s.slice(0, 4),
                month = s.slice(5, 7) - 1,
                day = s.slice(8, 10),
                hour = s.slice(11, 13),
                minute = s.slice(14, 16),
                second = s.slice(17, 19);
            return new Date(year, month, day, hour, minute, second);
        },
        /**
         * Convert 123456 second to (3 day, 15:04:15)
         */
        fromSecond: function (time) {
            var day = Math.floor(time / 24 / 60.0 / 60.0);
            var daySecond = day * 24 * 60 * 60;
            var hour = Math.floor((time - daySecond) / 60.0 / 60.0);
            var hourSecond = hour * 60 * 60;
            var minute = Math.floor((time - daySecond - hourSecond) / 60.0);
            var second = Math.floor(time - minute * 60 - daySecond - hourSecond);
            var timeFormat = ((hour < 10) ? ('0' + hour) : hour) + ':' + ((minute < 10) ? ('0' + minute) : minute) + ':' + ((second < 10) ? ('0' + second) : second);
            if (day > 0) {
                timeFormat = day + ' ngày, ' + timeFormat;
            }
            return timeFormat;
        },


        format: (function () {
            var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'|'[^']*'/g;
            var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
            var timezoneClip = /[^-+\dA-Z]/g;

            function getDayOfWeek(date) {
                var dow = date.getDay();
                if (dow === 0) {
                    dow = 7;
                }
                return dow;
            }

            function getWeek(date) {
                // Remove time components of date
                var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                // Change date to Thursday same week
                targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3);

                // Take January 4th as it is always in week 1 (see ISO 8601)
                var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

                // Change date to Thursday same week
                firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

                // Check if daylight-saving-time-switch occured and correct for it
                var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
                targetThursday.setHours(targetThursday.getHours() - ds);

                // Number of weeks between target Thursday and first Thursday
                var weekDiff = (targetThursday - firstThursday) / (86400000 * 7);
                return 1 + Math.floor(weekDiff);
            }

            // Regexes and supporting functions are cached through closure
            var dateFormat = function (date, mask, utc, gmt) {

                // You can't provide utc if you skip other args (use the 'UTC:' mask prefix)
                if (arguments.length === 1 && typeof date === 'string' === 'string' && !/\d/.test(date)) {
                    mask = date;
                    date = undefined;
                }

                date = date || new Date();

                if (!(date instanceof Date)) {
                    date = new Date(date);
                }

                if (isNaN(date)) {
                    throw TypeError('Invalid date');
                }

                mask = String(dateFormat.masks[mask] || mask || dateFormat.masks['default']);

                // Allow setting the utc/gmt argument via the mask
                var maskSlice = mask.slice(0, 4);
                if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
                    mask = mask.slice(4);
                    utc = true;
                    if (maskSlice === 'GMT:') {
                        gmt = true;
                    }
                }

                var pad = Utils.Number.fillZero;
                var _ = utc ? 'getUTC' : 'get';
                var d = date[_ + 'Date']();
                var D = date[_ + 'Day']();
                var m = date[_ + 'Month']();
                var y = date[_ + 'FullYear']();
                var H = date[_ + 'Hours']();
                var M = date[_ + 'Minutes']();
                var s = date[_ + 'Seconds']();
                var L = date[_ + 'Milliseconds']();
                var o = utc ? 0 : date.getTimezoneOffset();
                var W = getWeek(date);
                var N = getDayOfWeek(date);
                var flags = {
                    d: d,
                    dd: pad(d, 2),
                    ddd: dateFormat.i18n.dayNames[D],
                    dddd: dateFormat.i18n.dayNames[D + 7],
                    m: m + 1,
                    mm: pad(m + 1, 2),
                    mmm: dateFormat.i18n.monthNames[m],
                    mmmm: dateFormat.i18n.monthNames[m + 12],
                    yy: String(y).slice(2),
                    yyyy: y,
                    h: H % 12 || 12,
                    hh: pad(H % 12 || 12, 2),
                    H: H,
                    HH: pad(H, 2),
                    M: M,
                    MM: pad(M, 2),
                    s: s,
                    ss: pad(s, 2),
                    l: pad(L, 3),
                    L: pad(Math.round(L / 10), 2),
                    t: H < 12 ? 'a' : 'p',
                    tt: H < 12 ? 'am' : 'pm',
                    T: H < 12 ? 'A' : 'P',
                    TT: H < 12 ? 'AM' : 'PM',
                    Z: gmt ? 'GMT' : utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
                    o: (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S: ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10],
                    W: W,
                    N: N
                };

                return mask.replace(token, function (match) {
                    if (match in flags) {
                        return flags[match];
                    }
                    return match.slice(1, match.length - 1);
                });
            };

            dateFormat.masks = {
                'default': 'ddd mmm dd yyyy HH:MM:ss',
                'shortDate': 'm/d/yy',
                'mediumDate': 'mmm d, yyyy',
                'longDate': 'mmmm d, yyyy',
                'fullDate': 'dddd, mmmm d, yyyy',
                'shortTime': 'h:MM TT',
                'mediumTime': 'h:MM:ss TT',
                'longTime': 'h:MM:ss TT Z',
                'isoDate': 'yyyy-mm-dd',
                'isoTime': 'HH:MM:ss',
                'isoDateTime': 'yyyy-mm-dd\'T\'HH:MM:sso',
                'isoUtcDateTime': 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'',
                'expiresHeaderFormat': 'ddd, dd mmm yyyy HH:MM:ss Z'
            };

            // Internationalization strings
            dateFormat.i18n = {
                dayNames: [
                    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
                    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
                ],
                monthNames: [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
                ]
            };

            return dateFormat;
        })()
    },

    Cookie: {
        get: function (name) {
            var value,
                cookies,
                cookieItem;
            cookies = document.cookie.split('; ');
            for (var i = 0; i < cookies.length; i += 1) {
                cookieItem = cookies[i].split('=');
                if (cookieItem[0] === name) {
                    value = cookieItem[1];
                }
            }
            return value;
        },
        set: function (name, value, expires, path, domain, secure) {
            var cookieStr = name + '=' + value + '; ';
            if (expires) {
                expires = this._setExpiration(expires);
                cookieStr += 'expires=' + expires + '; ';
            }
            if (path) {
                cookieStr += 'path=' + path + '; ';
            }
            if (domain) {
                cookieStr += 'domain=' + domain + '; ';
            }
            if (secure) {
                cookieStr += 'secure; ';
            }
            document.cookie = cookieStr;
        },
        _setExpiration: function (cookieLife) {
            var today = new Date();
            var expr = new Date(today.getTime() + cookieLife * 24 * 60 * 60 * 1000);
            return expr.toGMTString();
        }
    },

    /**
     * Usage:
     *
     * var SuperClass = Utils.Class({
     *     $$constructor: function (param) {
     *         this.param = param;
     *     },
     *
     *     $$static: {
     *         STATIC_VAR: 100,
     *         staticMethod: function () {}
     *     },
     *
     *     someMethod: function (extraParam) {
     *         // use 'extraParam' and 'this.param'
     *     }
     * });
     *
     * var DerivedClass = Utils.Class({
     *     $$extends: SuperClass,
     *
     *     $$constructor: function (param, extraParam) {
     *         // call super constructor
     *         this.$super.constructor.call(this, param);
     *         this.extraParam = extraParam;
     *     },
     *
     *     someMethod: function (extraParam, extraExtraParam) {
     *         // call super method
     *         this.$super.someMethod.call(this, extraParam);
     *         // use 'extraExtraParam'
     *     },
     *
     *     otherMethod: function (extraParam) {
     *         // use 'extraParam', 'this.param' and 'this.extraParam'
     *     }
     * })
     *
     */
    Class: (function () {
        var RESERVED_KEYWORDS = ['$$constructor', '$$extends', '$$static'];

        return function (objSpec) {
            var F = objSpec.$$constructor || function () { },
                prop, value, staticProp;

            for (prop in objSpec) {
                if (objSpec.hasOwnProperty(prop)) {
                    value = objSpec[prop];
                    if (prop === '$$static') {
                        for (staticProp in value) {
                            if (value.hasOwnProperty(staticProp)) {
                                F[staticProp] = value[staticProp];
                            }
                        }
                    }
                    else if (prop === '$$extends') {
                        F.prototype = Object.create(value.prototype);
                        F.prototype.$super = Object.create(value.prototype);
                        F.prototype.constructor = F;
                    }
                    else if (RESERVED_KEYWORDS.indexOf(prop) === -1) {
                        F.prototype[prop] = value;
                    }
                }
            }

            return F;
        };
    }()),

    Node: {
        getChild: function (parentNode, dottedName) {
            var names = dottedName.split('.'),
                node = parentNode,
                i;
            for (i = 0; i < names.length; i += 1) {
                if (node === null) {
                    break;
                }
                node = node.getChildByName(names[i]);
            }
            return node;
        },

        stopPropagation: function (node) {
            function disableEventFn(event) {
                event.stopPropagation();
            }

            node.on(cc.Node.EventType.TOUCH_START, disableEventFn);
            node.on(cc.Node.EventType.TOUCH_END, disableEventFn);
            node.on(cc.Node.EventType.TOUCH_MOVE, disableEventFn);
            node.on(cc.Node.EventType.MOUSE_DOWN, disableEventFn);
            node.on(cc.Node.EventType.MOUSE_UP, disableEventFn);
            node.on(cc.Node.EventType.MOUSE_MOVE, disableEventFn);

            return function () {
                node.off(cc.Node.EventType.TOUCH_START, disableEventFn);
                node.off(cc.Node.EventType.TOUCH_END, disableEventFn);
                node.off(cc.Node.EventType.TOUCH_MOVE, disableEventFn);
                node.off(cc.Node.EventType.MOUSE_DOWN, disableEventFn);
                node.off(cc.Node.EventType.MOUSE_UP, disableEventFn);
                node.off(cc.Node.EventType.MOUSE_MOVE, disableEventFn);
            };
        },

        destroyAllChildrenInNode: function (node) {
            for (var i = node.childrenCount - 1; i >= 0; i -= 1) {
                node.children[i].destroy();
            }
        }
    },

    Director: (function () {
        var loadingScenes = [],
            currentSceneName,
            previousSceneName;

        return {
            loadScene: function (sceneName, onLaunched, onError) {
                if (currentSceneName) {
                    previousSceneName = currentSceneName;
                }
                currentSceneName = sceneName;

                var pushSuccess = Utils.Array.pushUnique(loadingScenes, {
                    sceneName: sceneName,
                    onLaunched: onLaunched,
                    onError: onError
                });
                if (pushSuccess) {
                    if (loadingScenes.length === 1) {
                        this._loadScene(sceneName, onLaunched, onError);
                    }
                }
            },

            getCurrentSceneName: function () {
                return currentSceneName;
            },

            getPreviousSceneName: function () {
                return previousSceneName;
            },

            preloadScene: function (sceneName, onLaunched, onError) {
                cc.director.preloadScene(sceneName, function (e) {
                    var success = !e;
                    if (success && Utils.Type.isFunction(onLaunched)) {
                        onLaunched();
                    }
                    if (!success && Utils.Type.isFunction(onError)) {
                        onError();
                    }
                });
            },

            _loadScene: function (sceneName, onLaunched, onError) {
                var self = this;
                self.preloadScene(sceneName, function () {
                    var success = cc.director.loadScene(sceneName, function (e) {
                        self._loadNextSceneFrom(sceneName, onLaunched, onError, !e);
                    });
                    if (!success) {
                        self._loadNextSceneFrom(sceneName, onLaunched, onError, false);
                    }
                }, function () {
                    self._loadNextSceneFrom(sceneName, onLaunched, onError, false);
                });
            },

            _loadNextSceneFrom: function (sceneName, onLaunched, onError, success) {
                Utils.Array.remove(loadingScenes, {
                    sceneName: sceneName,
                    onLaunched: onLaunched,
                    onError: onError
                });
                if (success && Utils.Type.isFunction(onLaunched)) {
                    onLaunched();
                }
                if (!success && Utils.Type.isFunction(onError)) {
                    onError();
                }
                if (loadingScenes.length > 0) {
                    var sceneConfigs = loadingScenes[0];
                    this._loadScene(sceneConfigs.sceneName, sceneConfigs.onLaunched, sceneConfigs.onError);
                }
            }
        };
    }()),

    Scheduler: {
        /**
         * Schedule function execution by interval.
         *
         * @param {Function}  func     function to execute
         * @param {Number}    interval interval in ms
         * @param {Boolean}   isEager  execute first time if true
         */
        setInterval: function (func, interval, isEager) {
            if (interval > 0 && Utils.Type.isFunction(func)) {
                if (isEager) {
                    func();
                }
                return setInterval(func, interval);
            }
            return null;
        },

        debounce: function (func, delayTime, fixedTimeToExecute) {
            var startTime = 0,
                timeoutId;

            return function () {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                if (fixedTimeToExecute > delayTime) {
                    var deltaTime = Date.now() - startTime;
                    if (deltaTime >= fixedTimeToExecute) {
                        func.apply(null, arguments);
                        startTime = Date.now();
                    }
                }

                timeoutId = setTimeout(function () {
                    func.apply(null, arguments);
                    startTime = Date.now();
                    timeoutId = null;
                }, delayTime);
            };
        }
    },

    Module: {
        get: function (moduleName) {
            if (Utils.Type.isString(moduleName)) {
                try {
                    return require(moduleName);
                }
                catch (e) {
                    return null;
                }
            }
            return null;
        }
    },

    Game: (function () {
        var isFocus = true;

        function onShow() {
            isFocus = true;
        }

        function onHide() {
            isFocus = false;
        }

        cc.game.on(cc.game.EVENT_SHOW, onShow, this);
        cc.game.on(cc.game.EVENT_HIDE, onHide, this);

        return {
            isFocus: function () {
                return isFocus;
            }
        };
    }()),

    Screen: (function () {
        var winSize = cc.winSize,
            ratio = winSize.width / winSize.height,
            ScreenRatioEnum = cc.Enum({
                '<= 4:3': 1,
                '<= 3:2': 2,
                '<= 16:10': 3,
                '<= 17:10': 4,
                '>= 16:10': 5,
                '>= 17:10': 6,
                '>= 16:9': 7,
            });

        return {
            ScreenRatioEnum: ScreenRatioEnum,

            isType: function (screenRatioType) {
                switch (screenRatioType) {
                    case 1:
                        return ratio <= 1.35;
                    case 2:
                        return ratio <= 1.5;
                    case 3:
                        return ratio <= 1.6;
                    case 4:
                        return ratio <= 1.7;
                    case 5:
                        return ratio >= 1.6;
                    case 6:
                        return ratio >= 1.7;
                    case 7:
                        return ratio >= 1.73;
                }
                return false;
            },

            getCenterPosition: function () {
                var v = new cc.Vec2(0, 0);
                try {
                    return cc.director.getScene().children[0].convertToWorldSpaceAR(v);
                }
                catch (e) {
                    return v;
                }
            }
        };
    }()),

    EventManager: {
        onKeyReleased: function (key, nodeOrPriority, callback) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased: function (keyCode) {
                    switch (keyCode) {
                        case key:
                            if (callback) {
                                callback();
                            }
                            break;
                    }
                }
            }, nodeOrPriority);
        }
    },
    Decoder: {
        /**
     * Decode utf-8 encoded string back into multi-byte Unicode characters
     *
     * @param {String} strUtf UTF-8 string to be decoded back to Unicode
     * @returns {String} decoded string
     */
        decode: function (strUtf) {
            // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
            var strUni = strUtf.replace(
                /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
                function (c) { // (note parentheses for precence)
                    var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                    return String.fromCharCode(cc);
                });
            strUni = strUni.replace(
                /[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
                function (c) { // (note parentheses for precence)
                    var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                    return String.fromCharCode(cc);
                });
            return strUni;
        }
    },
    Malicious: {
        toMoney: function (money, decimal, decimalSeparator, thousandSeparator) {
            decimal = decimal ? decimal : 2;
            decimalSeparator = decimalSeparator ? decimalSeparator : ".";
            thousandSeparator = thousandSeparator ? thousandSeparator : ",";
            var c = (isNaN(decimal)) ? 2 : Math.abs(decimal);
            var sign = money < 0 ? "-" : "";
            var i = parseInt(money = Math.abs(money).toFixed(c)) + '';
            var j = (j = i.length);
            j = j > 3 ? j % 3 : 0;
            var x = (j) ? i.substr(0, j) + thousandSeparator : '';
            var y = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousandSeparator);
            var z = c ? decimalSeparator + Math.abs(money - i).toFixed(c).slice(2) : '';
            cc.log("sign: " + sign + ", i: " + i + ", j: " + j + ", x: " + x + ", y: " + y + ", z: " + z);
            return sign + x + y + z;
        },
        setActiveLayer: function (_sceneTag) {
            // LOGIN,HOME,LOBBY,GAME,
            if (cc.Global.getSceneName() == 'BiDaHomeScene') {
                var BillardPortalHandler = cc.find("Canvas/BillardPortalHandler");
                if (BillardPortalHandler && cc.isValid(BillardPortalHandler)) {
                    var BillardPortalHandlerComponent = BillardPortalHandler.getComponent("BillardPortalHandler");
                    if (BillardPortalHandlerComponent && cc.isValid(BillardPortalHandlerComponent)) {
                        if (_sceneTag == Constant.TAG.scenes.LOGIN) {
                            BillardPortalHandlerComponent.showLoginLayer();
                        } else if (_sceneTag == Constant.TAG.scenes.HOME) {
                            BillardPortalHandlerComponent.showHomeLayer();
                        } else if (_sceneTag == Constant.TAG.scenes.LOBBY) {
                            BillardPortalHandlerComponent.showLobbyLayer();
                        } else if (_sceneTag == Constant.TAG.scenes.GAME) {
                            //bo, trong ban choi khong can config lai
                        }
                    }
                }

            }
        },
        addPhysicManagement: function () {
            var canvas = cc.find("Canvas");
            if (canvas) {
                var physicsManager = canvas.getComponent("PhysicsManager");
                if (!physicsManager) {
                    physicsManager = canvas.addComponent("PhysicsManager");
                    physicsManager.node = canvas;
                } else {
                    physicsManager.onEnable();
                }
            }
        },
        getNameGameByZone: function (zoneid) {
            if (zoneid) {
                switch (zoneid) {
                    case Constant.ZONE_ID.SOCCER_GALAXY_1VS1:
                        return "Soccer Fingers";
                    case Constant.ZONE_ID.HEAD_BALL_1VS1:
                        return "Head Kick";
                    case Constant.ZONE_ID.FOOTBALL_1VS1:
                        return "Football 3D";
                    case Constant.ZONE_ID.BIDA_1VS1:
                        return "Bida";
                    case Constant.ZONE_ID.BIDA_1VS4:
                        return "Bida";
                    case Constant.ZONE_ID.BIDA_PHOM:
                        return "Bida";
                    case Constant.ZONE_ID.MAU_BINH:
                        return "Mậu Binh";
                    case Constant.ZONE_ID.TLMN:
                        return "TLMN";
                    case Constant.ZONE_ID.PHOM:
                        return "Phỏm";
                    case Constant.ZONE_ID.SAM:
                        return "Sâm";
                    case Constant.ZONE_ID.XOCDIA:
                        return "Xóc Đĩa";
                    case Constant.ZONE_ID.BACAY:
                        return "Ba Cây";
                    case Constant.ZONE_ID.LIENG:
                        return "Liêng";
                    case Constant.ZONE_ID.POKER:
                        return "Poker";
                    case Constant.ZONE_ID.BAN_SUNG:
                        return "Jefir Survival";
                    case Constant.ZONE_ID.PHI_DAO:
                        return "Knife";
                    default:
                        return "Chưa xác định";
                }
            }
            return "Chưa xác định";
        },
        toTimestamp: function (strDate) {
            // var strDate = "2019-02-02";
            var datum = Date.parse(strDate);
            return datum / 1000;
        },
        createDefaultMyBallArr: function () {
            return this.flattern([this.createArrayRange(1, 7, 1), this.createArrayRange(9, 15, 1)]);
        },
        createArrayRange: function (start, end, step = 1) {
            const len = Math.floor((end - start) / step) + 1;
            return Array(len).fill().map(function (value, index) {
                return start + (index * step);
            })
        },
        setMouseJointTest: function (node) {
            this.removeNodeByNameFromParent("_MouseJoint", node);
            var mouseJointNode = new cc.Node();
            mouseJointNode.setContentSize(node.getContentSize());
            mouseJointNode.name = "_MouseJoint";
            node.addChild(mouseJointNode);
            mouseJointNode.zIndex = cc.macro.MAX_ZINDEX;
            //
            var mouseJointComponent = mouseJointNode.addComponent(cc.MouseJoint);
            mouseJointComponent.connectedBody = node;
            mouseJointComponent.mouseRegion = node;
            var _wiget = mouseJointNode.addComponent(cc.Widget);
            _wiget.isAlignTop = true;
            _wiget.isAlignBottom = true;
            _wiget.isAlignLeft = true;
            _wiget.isAlignRight = true;
            _wiget.top = 0;
            _wiget.bottom = 0;
            _wiget.right = 0;
            _wiget.left = 0;
        },
        removePlayerByIdInArray: function (players, id) {
            var _players = [];
            if (players && Array.isArray(players)) {
                for (var i = 0; i < players.length; i++) {
                    var _id = Number(players[i].userID);
                    if (id != _id) {
                        _players.push(players[i]);
                    }
                }
                return _players;
            }
            return players;
        },
        removeNotNumberElementInArray: function (arr) {
            if (arr && Array.isArray(arr) && arr.length > 0) {
                var _arr = [];
                for (var m = 0; m < arr.length; m++) {
                    var e = Number(arr[m]);
                    if (isNaN(e) == false) {
                        _arr.push(e);
                    }
                }
                return _arr;
            }
            return [];
        },
        createBallPosWithAngle: function (listIdBi) {
            if (this.isJsonString(listIdBi)) {
                listIdBi = JSON.parse(listIdBi);
            }
            if (listIdBi && Array.isArray(listIdBi)) {
                var _dataPos = [];
                for (var k = 0; k < listIdBi.length; k++) {
                    // [{num: 4, x: "43", y: "159", z: "81"}]
                    _dataPos.push(
                        {
                            num: listIdBi[k],
                            x: this.randomMinMax(0, 180),
                            y: this.randomMinMax(0, 180),
                            z: this.randomMinMax(0, 180),
                        }
                    )
                }
                return _dataPos;
            }
            return null;
        },
        addNewBlockInputEventNode: function (node) {
            if (node && cc.isValid(node)) {
                var existBlock = node.getChildByName("BLKINPUTEVENTNODE");
                if (existBlock && cc.isValid(existBlock)) {
                    this.setMaxZindex(node, existBlock);
                    // cc.error("Exist block input...");
                    return existBlock.getComponent(cc.BlockInputEvents);
                } else {
                    //add block input event
                    var blockInputEventNode = new cc.Node();
                    blockInputEventNode.name = "BLKINPUTEVENTNODE";
                    var blockInputEventComponent = blockInputEventNode.addComponent(cc.BlockInputEvents);
                    var blockInputEventWidgetComponent = blockInputEventNode.addComponent(cc.Widget);
                    blockInputEventWidgetComponent.isAlignTop = true;
                    blockInputEventWidgetComponent.isAlignBottom = true;
                    blockInputEventWidgetComponent.isAlignLeft = true;
                    blockInputEventWidgetComponent.isAlignRight = true;
                    blockInputEventWidgetComponent.top = 0;
                    blockInputEventWidgetComponent.bottom = 0;
                    blockInputEventWidgetComponent.right = 0;
                    blockInputEventWidgetComponent.left = 0;
                    node.addChild(blockInputEventNode, cc.macro.MAX_ZINDEX);
                    this.setMaxZindex(node, blockInputEventNode);
                }
            }
            return blockInputEventComponent;
        },
        destroyAllChildrenWithoutName: function (node, name) {
            if (node && cc.isValid(node)) {
                var childClear = [];
                for (var i = 0; i < node.children.length; i++) {
                    var c = node.children[i];
                    if (c && cc.isValid(c)) {
                        var currentName = c.name;
                        if (currentName.toString() != name.toString()) {
                            childClear.push(c);
                        } else if (name == "CueObj") {
                            //tam thoi an cue di cho van moi tiep tuc
                            c.position = cc.v2(99999, 99999);
                        }
                    }

                }
                for (var j = 0; j < childClear.length; j++) {
                    var c = childClear[j];
                    if (c && cc.isValid(c)) {
                        childClear[j].removeFromParent(true);
                        childClear[j].destroy();
                    }
                }
            }
        },
        isArraySameArray: function (array1, array2) {
            if (!Array.isArray(array1) || !Array.isArray(array2) || array1.length !== array2.length) {
                return false;
            }
            var _arr1 = array1.concat().sort();
            var _arr2 = array2.concat().sort();
            for (var i = 0; i < _arr1.length; i++) {
                if (_arr1[i] !== _arr2[i]) {
                    return false;
                }
            }
            return true;
        },
        distance2Vector: function (X1, Y1, X2, Y2) {
            return Math.sqrt((X1 - X2) * (X1 - X2) + (Y1 - Y2) * (Y1 - Y2));
        },

        formatNameData(name){
            if (name.length >= 15) {
                return name = name.substring(0, 14);
            }
           return name;
        },
        formatName(node, name, zone, self) {
            // if (name === "Player0" || name === "Player1" || name === "Player2" || name === "Player3" || name === "Player4")
            //     return;
            //Node chua component cc.Label
            var length = name.length;
            if (self.node.name === "User1" || zone === 8) {
                if (length >= 15) {
                    name = name.substring(0, 14);
                    node.getComponent(cc.Label).string = name + "...";
                }
                else
                    node.getComponent(cc.Label).string = name;

            }
            else {
                if (self.node.name !== "User1") {
                    if (name.length > 10) {
                        node.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    }
                    else {
                        node.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                    }
                }
                node.getComponent(cc.Label).string = name;
            }

        },
        getCards: function () {
            var _4types = ["c", "r", "t", "b"];
            var _allCards = {};
            for (let k = 1; k <= 13; k++) {
                _allCards[k] = [];
                for (let l = 0; l < _4types.length; l++) {
                    _allCards[k].push({
                        value: k,
                        cardType: k + _4types[l]
                    })
                }
            }
            for (var q in _allCards) {
                if (_allCards.hasOwnProperty(q)) {
                    var a = _allCards[q];
                    _allCards[q] = this.shuffleArray(a);
                }
            }
            return _allCards;
        },
        shuffleArray: function (arr) {
            var j;
            var x;
            var i;
            for (i = arr.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = arr[i];
                arr[i] = arr[j];
                arr[j] = x;
            }
            return arr;
        },
        formatMoney(money) {
            //Khong co dau . => nho hon 1000
            if (money.indexOf(".") === -1)
                return money;
            //Ham chi dung voi cac so duoi 1000 ty
            if (money.length < 12)
                return money;
            while (true) {
                // if (money.length > 7 && money.length < 11)
                // {
                //     var index = money.indexOf(".");
                //     return money.replace(".", "M").substring(0, index + 4);
                // }
                if (money.length > 10 && money.length < 14) {
                    var index = money.indexOf(".");
                    money = money.replace(".", "B").substring(0, index + 8);
                    index = money.indexOf(".");
                    return money.replace(".", "M");
                }
                if (money.length > 13) {
                    var index = money.indexOf(".");
                    money = money.replace(".", "B").substring(0, index + 8);
                    index = money.indexOf(".");
                    return money.replace(".", "M");
                }
            }

        },
        formatMoney2(money) {
            if (money.indexOf("-") === -1) {
                money = money.split("");
                for (var i = money.length - 3; i > 0; i = i - 3) {
                    money[i] = "." + money[i];
                }
                money = money.join("");
            }
            else    //So < 0
            {
                money = money.split("");
                money = money.splice(1, money.length);
                for (var i = money.length - 3; i > 0; i = i - 3) {
                    money[i] = "." + money[i];
                }
                money = money.join("");
                money = "-" + money;
            }
            return money;
        },

        convertMoney(money) {
            //1.000.000 => 1000000
            money = money.split("");
            while (true) {
                if (money.indexOf(".") === -1)
                    break;
                else
                    money.splice(money.indexOf("."), 1);
            }
            money = money.join("");
            return money;
        },
        addIconInvites: function (data, cb) {
            var btnParent = data.btnParent;
            if (btnParent && cc.isValid(btnParent)) {
                //new node
                cc.resources.load("friends/icons_friends", cc.SpriteAtlas, function (err, spriteAtlas) {
                    if (!err) {
                        var containerIcon = new cc.Node();
                        var icon = new cc.Node();
                        var iconSprite = icon.addComponent(cc.Sprite);
                        var frame = spriteAtlas.getSpriteFrame("icons_friends_01");
                        if (frame) {
                            containerIcon.addChild(icon);
                            iconSprite.spriteFrame = frame;
                            var labelFriendsNode = new cc.Node();
                            var labelFriends = labelFriendsNode.addComponent(cc.Label);
                            containerIcon.addChild(labelFriendsNode);
                            icon.setScale(0.75, 0.75);
                            labelFriends.string = "";
                            labelFriends.fontSize = 18;
                            labelFriends.verticalAlign = cc.Label.VerticalAlign.CENTER;
                            labelFriends.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                            containerIcon.name = "containerIcon";
                            btnParent.addChild(containerIcon);
                            //set zindex
                            icon.zIndex = 0;
                            labelFriendsNode.zIndex = 5;
                            //set position
                            var x = btnParent.width * 0.5;
                            var y = btnParent.height * 0.5;
                            if (data.position) {
                                x = data.position.x;
                                y = data.position.y;
                            }

                            containerIcon.position = cc.v2(x, y);
                            btnParent.labelFriendSended = labelFriends;
                            btnParent.iconInvite = containerIcon;
                            containerIcon.opacity = 0;
                            //add custom event
                            if (cb) {
                                cb(null, containerIcon);
                            }
                        } else {
                            if (cb) {
                                cb(true, null);
                            }
                        }
                    } else {
                        cc.log("Không thể khởi tạo icon số lời yêu cầu kết bạn...");
                        if (cb) {
                            cb(true, null);
                        }
                    }
                }.bind(this));
            }
        },
        runAnimationNumberFriendReq: function (btnFriendNode, containerIcon, num) {
            if (containerIcon && cc.isValid(containerIcon)) {
                containerIcon.stopAllActions();
                if (isNaN(num) == false) {
                    if (num <= 0) {
                        num = '';
                        containerIcon.opacity = 0;
                    } else {
                        containerIcon.opacity = 0;
                        num = num.toString();
                        containerIcon.runAction(
                            cc.sequence(
                                cc.fadeIn(0.2),
                                cc.callFunc(function () {
                                    this.runAction(
                                        cc.repeatForever(
                                            cc.sequence(
                                                cc.fadeOut(0.2),
                                                cc.fadeIn(0.5)
                                            )
                                        )
                                    )
                                }.bind(containerIcon))
                            )
                        )
                    }
                    btnFriendNode.labelFriendSended.string = num;
                } else {
                    containerIcon.opacity = 0;
                    btnFriendNode.labelFriendSended.string = "";
                }

            }
        },
        hideAllChildren: function (parent) {
            if (parent && cc.isValid(parent)) {
                for (var i = 0; i < parent.children.length; i++) {
                    var child = parent.children[i];
                    if (child && cc.isValid(child)) {
                        child.active = false;
                        child.scale = 1;
                    }
                }
            }
        },
        setMaxZindex: function (parent, child) {
            var maxZindex = 0;
            var stepZindex = 5;
            var parent = (parent) ? parent : cc.find("Canvas");
            if (parent) {
                parent.sortAllChildren();
                var start = 0;
                for (var j = 0; j < parent.children.length; j++) {
                    parent.children[j].zIndex = start;
                    start += 10;
                }

                for (var i = 0; i < parent.children.length; i++) {
                    var tmpZindex = i * stepZindex;
                    parent.children[i].zIndex = tmpZindex;

                    if (tmpZindex >= maxZindex) {
                        maxZindex = tmpZindex;
                        if (maxZindex == cc.macro.MAX_ZINDEX) {
                            parent.children[i].zIndex = cc.macro.MAX_ZINDEX - 1;
                            maxZindex = cc.macro.MAX_ZINDEX;
                        } else {
                            maxZindex++;
                        }
                    }
                }
                child.zIndex = maxZindex;
                parent.sortAllChildren();
            }
        },
        getMaxZindex: function (canvas) {
            var maxZindex = 0;
            var cvas = (canvas) ? canvas : cc.find("Canvas");
            if (cvas) {
                for (var i = 0; i < cvas.children.length; i++) {
                    var tmpZindex = cvas.children[i].zIndex;
                    if (tmpZindex >= maxZindex) {
                        maxZindex = tmpZindex;
                        if (maxZindex == cc.macro.MAX_ZINDEX) {
                            cvas.children[i].zIndex = cc.macro.MAX_ZINDEX - 1;
                            maxZindex = cc.macro.MAX_ZINDEX;
                        } else {
                            maxZindex++;
                        }
                    }
                }
            }
            return (maxZindex >= cc.macro.MAX_ZINDEX) ? cc.macro.MAX_ZINDEX : maxZindex + 1;
        },
        getIndexBeforeThisNodeByName: function (container, name) {
            for (var i = 0; i < container.children.length; i++) {
                if (container.children[i].name == name) {
                    if ((container.children[i].zIndex) == 0) {
                        container.children[i].zIndex = 1;
                        return container.children[i].zIndex - 1;
                    } else {
                        return container.children[i].zIndex - 1;
                    }
                }
            }
            return null;
        },
        moneyWithFormat: function (money, formatter) {
            if (!money) {
                return "";
            }
            return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, formatter)
        },
        isValidObj: function (obj) {
            for (var prop in obj) {
                if (!obj.hasOwnProperty(prop)) {
                    continue;
                }
                if (obj[prop] === null || obj[prop] === undefined || obj[prop] === "null" || obj[prop] === "undefined") {
                    return false;
                }
            }
            return true;
        },
        isNotUndefinedObj: function (obj) {
            for (var prop in obj) {
                if (!obj.hasOwnProperty(prop)) {
                    continue;
                }
                if (obj[prop] === undefined || obj[prop] === "undefined") {
                    return true;
                }
            }
            return false;
        },
        removeNodeByNameFromParent: function (name, parent) {
            var parentNode = cc.find("Canvas");
            if (parent) {
                parentNode = parent;
            }
            var childClear = [];
            for (var i = 0; i < parentNode.children.length; i++) {
                var node = parentNode.children[i];
                if (node.name == name) {
                    childClear.push(node);
                }
            }
            for (var j = 0; j < childClear.length; j++) {
                childClear[j].removeFromParent(true);
                childClear[j].destroy();
            }

        },
        getAngleBetWeenTwoPoint: function (p1, p2) {
            var deltaX = p2.x - p1.x;
            var deltaY = p2.y - p1.y;
            var angle = cc.misc.radiansToDegrees(Math.atan(deltaY / deltaX));
            while (angle < 0) {
                angle += 360.0;
            }
            return angle;
        },
        findNewPositionAroundPoint: function (currentPoint, exceptPoints) {
            //current point {position: cc.v2(x, y), radius: radius};
            //offset point 0.1 pixel
            var offset = 0.1;
            var isValid = false;
            var startLength = currentPoint.radius * 2 + offset;
            var startAngle = 0;
            var endAngle = 360;
            var counter = 0;
            var tmpPosition = currentPoint.position;
            while (!isValid) {
                var _validated = [];
                for (var i = 0; i < exceptPoints.length; i++) {
                    var point = { position: exceptPoints[i].position, radius: exceptPoints[i].radius };
                    if (!cc.Intersection.circleCircle(currentPoint, point) == true) {
                        isValid = true;
                        _validated.push(isValid);
                    } else {
                        isValid = false;
                    }
                }
                if (exceptPoints.length == _validated.length) {
                    isValid = true;
                } else {
                    isValid = false;
                }
                if (!isValid) {
                    if (startAngle > endAngle) {
                        startAngle = 0;
                        counter++;
                    }
                    startAngle++;
                }
                currentPoint.position = this.getApointWhenKnowAngleAndRadius(tmpPosition, startAngle, startLength * counter);
            }
            return currentPoint.position;
        },
        removeDuplicate: function (array) {
            if (array[0] === undefined)
                return array;
            if (!array[0].hasOwnProperty("userName"))
                return array;
            var newArray = [];
            newArray.push(array[0]);
            for (var i = 1; i < array.length; ++i) {
                var check = true;
                for (var j = 0; j < newArray.length; ++j) {
                    if (newArray[j].userName === array[i].userName)
                        check = false;
                }
                if (check) {
                    newArray.push(array[i]);
                }
            }
            return newArray;
        },
        flattern: function (array) {
            var _this = this;
            return this.removeDuplicate(array.reduce(function (flat, toFlatten) {
                return flat.concat(Array.isArray(toFlatten) ? _this.flattern(toFlatten) : toFlatten);
            }, []));
        },
        getLengthObj: function (obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    size++;
                }
            }
            return size;
        },
        getPortalGameName: function () {
            var sceneName = cc.Global.getSceneName();
            if (sceneName) {
                switch (sceneName) {
                    case "TrangChu":
                        return "HomePortal";
                    case "HeroesBall":
                        return "HeroesBallPortal";
                    default:
                        break;
                }
            }
            return null;
        },
        getTypeSoccerMapByString: function (str) {
            var _tmpType = "";
            var _tmpName = "";
            if (str) {
                var strArr = str.split("_");
                for (let i = 0; i < strArr.length; i++) {
                    var n = parseInt(strArr[i]);
                    if (isNaN(n) == false) {
                        _tmpType += strArr[i];
                    } else {
                        _tmpName += strArr[i];
                    }
                }
                var m = _tmpType.slice(0, 3);
                var s = _tmpType.slice(m.length, _tmpType.length);
                _tmpType = m + ((s.length > 0) ? "_" + s : "");
                return { type: _tmpType, name: _tmpName };
            }
            return null;
        },
        // getMapDataByPrefabs: function (mapPrefabs) {
        //     var mapData;
        //     if (mapPrefabs && Array.isArray(mapPrefabs)) {
        //         mapData = {};
        //         var processNode = new cc.Node();
        //         processNode.setContentSize(cc.size(1280, 720));
        //         var canvas = cc.find("Canvas");
        //         if (canvas) {
        //             processNode.active = false;
        //             canvas.addChild(processNode);
        //         }
        //         if (processNode) {
        //             for (var i = 0; i < mapPrefabs.length; i++) {
        //                 var map = cc.instantiate(mapPrefabs[i]);
        //                 if (map) {
        //                     processNode.addChild(map);
        //                     var s = "soccerMapPlayer1_";
        //                     var index1 = s.length;
        //                     var index2 = mapPrefabs[i].name.length;
        //                     var _type = mapPrefabs[i].name.slice(index1, index2);
        //                     var typeName = this.getTypeSoccerMapByString(_type);
        //                     if (typeName) {
        //                         var type = typeName.type;
        //                         var name = typeName.name;
        //                         var _positionsWorldLocal = map.getChildByName("Map");
        //                         if (_positionsWorldLocal) {
        //                             var _positionsNodeLocal = _positionsWorldLocal.getChildByName("Left");
        //                             var _positionLeftsLocal = [];
        //                             var _positionRightsLocal = [];
        //                             var _positionLeftsWorld = [];

        //                             for (var j = 0; j < _positionsNodeLocal.children.length; j++) {
        //                                 var _pos = _positionsNodeLocal.children[j];
        //                                 if (_pos) {

        //                                     //center custom
        //                                     var _localPosLeftCustom = cc.v2(_pos.position.x / _positionsNodeLocal.width, _pos.position.y / _positionsNodeLocal.height);
        //                                     var _localPosRightCustom = cc.v2(-_localPosLeftCustom.x, _localPosLeftCustom.y);

        //                                     var _worldPosLeft = _positionsWorldLocal.parent.convertToWorldSpaceAR(_positionsWorldLocal.convertToNodeSpaceAR(_positionsNodeLocal.convertToWorldSpaceAR(_pos.position)));
        //                                     _positionLeftsLocal.push(_localPosLeftCustom);
        //                                     _positionRightsLocal.push(_localPosRightCustom);
        //                                     _positionLeftsWorld.push(_worldPosLeft);

        //                                 }
        //                             }
        //                             if (_positionLeftsLocal.length > 0 && _positionRightsLocal.length > 0 && _positionLeftsLocal.length == _positionRightsLocal.length) {
        //                                 if (!mapData.hasOwnProperty(name)) {
        //                                     mapData[name] = [];
        //                                 }
        //                                 mapData[name].push({
        //                                     type: type,
        //                                     name: name,
        //                                     posLeftLocal: _positionLeftsLocal,
        //                                     posRightLocal: _positionRightsLocal,
        //                                     posLeftWorld: _positionLeftsWorld,
        //                                     id: i + 1,
        //                                     positions: this.createPositionServer(_positionLeftsWorld)
        //                                 }
        //                                 );
        //                             }
        //                         }
        //                     }

        //                     map.destroy();
        //                 }
        //             }
        //             //
        //             processNode.destroy();
        //             processNode.removeFromParent(true);
        //         }

        //     }
        //     return mapData;
        // },
        getMapDataByPrefabs: function (mapPrefabs) {
            var mapData;
            if (mapPrefabs && Array.isArray(mapPrefabs)) {
                mapData = {};
                var processNode = new cc.Node();
                processNode.setContentSize(cc.size(1280, 720));
                var canvas = cc.find("Canvas");
                if (canvas) {
                    processNode.active = false;
                    canvas.addChild(processNode);
                }
                if (processNode) {
                    for (var i = 0; i < mapPrefabs.length; i++) {
                        var map = cc.instantiate(mapPrefabs[i]);
                        if (map) {
                            processNode.addChild(map);
                            var s = "soccerMapPlayer1_";
                            var index1 = s.length;
                            var index2 = mapPrefabs[i].name.length;
                            var _type = mapPrefabs[i].name.slice(index1, index2);
                            var typeName = this.getTypeSoccerMapByString(_type);
                            if (typeName) {
                                var type = typeName.type;
                                var name = typeName.name;
                                var _positionsWorldLocal = map.getChildByName("Map");
                                if (_positionsWorldLocal) {
                                    var _positionsNodeLocal = _positionsWorldLocal.getChildByName("Left");
                                    var _positionLeftsLocal = [];
                                    var _positionRightsLocal = [];
                                    var _positionLeftsWorld = [];

                                    for (var j = 0; j < _positionsNodeLocal.children.length; j++) {
                                        var _pos = _positionsNodeLocal.children[j];
                                        if (_pos) {

                                            //center custom
                                            var _localPosLeftCustom = cc.v2(_pos.position.x / _positionsNodeLocal.width, _pos.position.y / _positionsNodeLocal.height);
                                            var _localPosRightCustom = cc.v2(-_localPosLeftCustom.x, _localPosLeftCustom.y);

                                            var _worldPosLeft = _pos.parent.convertToWorldSpaceAR(_pos.position);

                                            _positionLeftsLocal.push(_localPosLeftCustom);
                                            _positionRightsLocal.push(_localPosRightCustom);
                                            _positionLeftsWorld.push(_worldPosLeft);

                                        }
                                    }
                                    if (_positionLeftsLocal.length > 0 && _positionRightsLocal.length > 0 && _positionLeftsLocal.length == _positionRightsLocal.length) {
                                        if (!mapData.hasOwnProperty(name)) {
                                            mapData[name] = [];
                                        }
                                        mapData[name].push({
                                            type: type,
                                            name: name,
                                            posLeftLocal: _positionLeftsLocal,
                                            posRightLocal: _positionRightsLocal,
                                            posLeftWorld: _positionLeftsWorld,
                                            id: i + 1,
                                            positions: this.createPositionServer(_positionLeftsWorld)
                                        }
                                        );
                                    }
                                }
                            }

                            map.destroy();
                        }
                    }
                    //
                    processNode.destroy();
                    processNode.removeFromParent(true);
                }

            }
            return mapData;
        },
        createPositionServer: function (positions, parent) {
            var data = [];
            if (positions && Array.isArray(positions) && positions.length > 0) {
                for (var i = 0; i < positions.length; i++) {
                    data.push(
                        {
                            id: i + 1,
                            x: positions[i].x,
                            y: positions[i].y
                        }
                    )
                }
            }
            return data;
        },
        convertPosAsNode: function (pos, node) {
            var x = pos.x * (node.width);
            var y = pos.y * (node.height);
            return cc.v2(x, y);
        },
        getDataSynchronous: function (typeArr, cb) {
            if (typeArr) {
                var dataPosArr = [];
                for (var i = 0; i < typeArr.length; i++) {
                    dataPosArr.push(
                        {
                            id: 0,
                            type: typeArr[i].type,
                            name: typeArr[i].name,
                            positions: typeArr[i].positions
                        }
                    )
                }
                if (cb) {
                    cb(false, dataPosArr);
                }
            }
            if (cb) {
                cb(true, null);
            }

        },
        createDataServer: function (dataPos) {
            if (dataPos) {
                var dataPosArr = [];
                for (var key in dataPos) {
                    if (dataPos.hasOwnProperty(key)) {
                        var typeArr = dataPos[key];
                        var _this = this;
                        this.getDataSynchronous(typeArr, function (err, data) {
                            if (!err) {
                                dataPosArr.push(_this.flattern(data));
                            }
                        });
                    }
                }
                if (dataPosArr) {
                    dataPosArr = this.flattern(dataPosArr);
                    for (var j = 0; j < dataPosArr.length; j++) {
                        dataPosArr[j].id = j + 1;
                    }
                }
                return dataPosArr;
            }
            return null;
        },
        getDisplayName: function (_Linker) {
            if (_Linker) {
                if (_Linker.userData) {
                    if (_Linker.userData.hasOwnProperty("viewname") && _Linker.userData.viewname.toString().trim().length > 0) {
                        return _Linker.userData.viewname;
                    } else if (_Linker.userData.hasOwnProperty("displayName") && _Linker.userData.displayName.toString().trim().length > 0) {
                        return _Linker.userData.displayName;
                    }
                }
            }
            return null;
        },
        getCode: function (_Linker) {
            if (_Linker) {
                if (_Linker.userData && _Linker.userData.code) {
                    if (_Linker.userData.hasOwnProperty("code") && _Linker.userData.code.toString().trim().length > 0) {
                        return _Linker.userData.code;
                    }
                }
            }
            return null;
        },
        processConnect: function (_Linker, node) {
            if (_Linker.GameManager) {
                cc.error("Kết nói bị lỗi, Đang kết nối lại...");
                cc.Global.showMessage(i18n.t("Kết nói bị lỗi, Đang kết nối lại"));
                _Linker.GameManager.autoLoginByWhenPlayGameChan();
            } else {
                Utils.Malicious.removeGameManager();
                _Linker.Socket.close();
                _Linker.isLogin = false;
                if (_Linker.isFb) {
                    _Linker.MySdk.logoutFb();
                    _Linker.isFb = false;
                }
                var userData = _Linker.Local.readUserData();
                userData.autoLogin = false;
                _Linker.Local.saveUserData(userData);
                var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_BACK_TO_SPLASH, true);
                customEvent.isForced = true;
                if (node && cc.isValid(node)) {
                    node.dispatchEvent(customEvent);
                }
            }
        },
        parseNumberElementsIn: function (response) {
            if (response) {
                for (var key in response) {
                    if (response.hasOwnProperty(key)) {
                        var _n = parseInt(response[key]);
                        if (isNaN(_n) == false) {
                            response[key] = _n;
                        }
                    }
                }
                return response;
            }
        },
        getGameLoaderBundle: function (cb, name = Constant.BUNDLE.SOCCER_GALAXY.name, loadingLabel) {
            if (name && name.toString().replace(/\s/g, '').length > 0) {
                var loadGameBundle = cc.assetManager.getBundle(name);
                if (!loadGameBundle) {
                    cc.log("Global.configHost.listBundle", Global.configHost.listBundle);
                    if (cc.sys.isNative && Global.configHost.listBundle && Global.configHost.listBundle.includes(name)) {
                        this.bundleRemote(name, function (err, bundle) {
                            if (!err) {
                                if (cb) {
                                    cb(null, bundle);
                                }
                            } else {
                                cc.assetManager.loadBundle(name, function (err, bundle) {
                                    if (!err) {
                                        if (cb) {
                                            cb(null, bundle);
                                        }
                                    } else {
                                        if (cb) {
                                            cb(true, null);
                                        }
                                    }
                                });
                            }
                        });


                    } else {
                        cc.assetManager.loadBundle(name,
                            function (err, bundle) {
                                if (!err) {
                                    if (cb) {
                                        cb(null, bundle);
                                    }
                                } else {
                                    if (cb) {
                                        cb(true, null);
                                    }
                                }
                            });
                    }
                } else {
                    if (cb) {
                        cb(null, loadGameBundle);
                    }
                }
            } else {
                if (cb) {
                    cc.error("Không thể load bundle name, bundle name không hợp lệ...");
                    cb(true, null);
                }
            }
        },
        bundleRemote: function (bundleName, cb) {
            console.log("bundle:" + bundleName);
            var that = this;
            //cc.Global.showLoading();
            console.log("bundleRemote ");
            // cc.assetManager.loadBundle('http://tai.chanvuong.net/remote/'+bundleName, function (err, bundle) {
            var versionRemote = null;
            if (Global.configHost.versionBundleRemote && Global.configHost.versionBundleRemote.length > 0) {
                versionRemote = { version: Global.configHost.versionBundleRemote };
            }
            cc.assetManager.loadBundle((Global.configHost.ipRemoteBundle ? Global.configHost.ipRemoteBundle : "http://tai.sime.club/remote/") + bundleName, versionRemote, function (err, bundle) {
                console.log("err ", err);
                //cc.Global.hideLoading();
                if (err) {
                    return cc.error("aaa" + err);
                }
                console.log('load bundle successfully.');

                if (cb) {
                    console.log("load finish ");
                    cb(null, bundle);
                }

            });

        },
        setColorMoney: function (node) {
            if (node) {
                node.color = (Number(cc.Global.moneyType) == 1) ? cc.color("#FFF500") : cc.color("#00C2FF");
            }
        },
        removeGameManager: function () {
            var canvas = cc.find('Canvas');
            if (canvas) {
                var scene = canvas.parent;
                if (scene) {
                    for (var i = 0; i < scene.children.length; i++) {
                        var child = scene.children[i];
                        var childName = child.name;
                        if (childName == "GameManager") {
                            cc.game.removePersistRootNode(child);
                            child.destroy();
                            child.removeFromParent(true);
                        }
                    }
                }
            }
        },
        sliceStringFromRight: function (start, str) {
            //start "/";
            //string "audio/audio/result";
            //result -> exported
            if (str && start) {
                var slashs = [];
                for (var i = 0; i < str.length; i++) {
                    if (str[i] === start) {
                        slashs.push(i + 1);
                    }
                }
                if (slashs.length > 0) {
                    return str.substr(slashs[slashs.length - 1], str.length).trim();
                }
            }
            return str;
        },
        getBundleNameAndSceneNameByZoneId: function (zoneid) {
            if (zoneid) {
                var sceneNameLoad;
                var bundleName;
                var scriptName;
                var sceneNameLoad2;
                switch (Number(zoneid)) {
                    case Constant.ZONE_ID.BIDA_1VS1: {
                        sceneNameLoad = "BidaGame";
                        bundleName = Constant.BUNDLE.BIDA.name;
                        break;
                    }
                    case Constant.ZONE_ID.BIDA_1VS4: {
                        sceneNameLoad = "BidaGame";
                        bundleName = Constant.BUNDLE.BIDA.name;
                        break;
                    }
                    case Constant.ZONE_ID.FOOTBALL_1VS1: {
                        //football
                        sceneNameLoad = "FootBall";
                        bundleName = Constant.BUNDLE.FOOT_BALL.name;
                        break;
                    }
                    case Constant.ZONE_ID.SOCCER_GALAXY_1VS1: {
                        //soccer
                        bundleName = Constant.BUNDLE.SOCCER_GALAXY.name;
                        sceneNameLoad = "SoccerGalaxy";
                        break;
                    }
                    case Constant.ZONE_ID.HEAD_BALL_1VS1: {
                        // headball
                        sceneNameLoad = "HeadBallPlay";
                        bundleName = Constant.BUNDLE.HEAD_BAL.name;
                        break;
                    }
                    case Constant.ZONE_ID.BIDA_PHOM: {
                        sceneNameLoad = "BidaGame";
                        bundleName = Constant.BUNDLE.BIDA.name;
                        break;
                    }
                    case Constant.ZONE_ID.PHOM: {
                        bundleName = Constant.BUNDLE.PHOM.name;
                        sceneNameLoad = "Phom";
                        scriptName = "PhomController";
                        break;
                    }
                    case Constant.ZONE_ID.PHI_DAO: {
                        bundleName = Constant.BUNDLE.PHI_DAO.name;
                        sceneNameLoad = "PlayGameDagger";
                        sceneNameLoad2 = "PhiDaoGame";
                        break;
                    }
                    case Constant.ZONE_ID.TLMN: {
                        bundleName = Constant.BUNDLE.TLMN.name;
                        sceneNameLoad = "TLMN";
                        scriptName = "TLMNController";
                        break;
                    }
                    case Constant.ZONE_ID.MAU_BINH: {
                        bundleName = Constant.BUNDLE.MAUBINH.name;
                        sceneNameLoad = "MauBinh";
                        scriptName = "MauBinhController";
                        break;
                    }
                    case Constant.ZONE_ID.POKER: {
                        bundleName = Constant.BUNDLE.POKER.name;
                        sceneNameLoad = "Poker";
                        scriptName = "Poker";
                        break;
                    }
                    case Constant.ZONE_ID.BAN_SUNG: {
                        bundleName = "CongKichCuongBao";
                        sceneNameLoad = "CongKichCuongBaoScene";
                        sceneNameLoad2 = "GameSceneCKCB";
                        break;
                    }
                }
                if (sceneNameLoad && bundleName) {
                    return {
                        sceneNameLoad: sceneNameLoad,
                        bundleName: bundleName,
                        scriptName: scriptName,
                        sceneNameLoad2: sceneNameLoad2
                    }
                }
            }
            return null;
        },
        animateValue(label, start, end, duration) {
            if (start >= end) {
                return;
            }
            label.value = end;

            duration = duration * 1000;
            var range = end - start;
            // no timer shorter than 50ms (not really visible any way)
            var minTimer = 50;
            // calc step time to show all interediate values
            var stepTime = Math.abs(Math.floor(duration / range));

            // never go below minTimer
            stepTime = Math.max(stepTime, minTimer);

            // get current time and calculate desired end time
            var startTime = new Date().getTime();
            var endTime = startTime + duration;
            var timer;

            function run() {
                var sceneName;
                var _sceneInfos = cc.game._sceneInfos
                for (var i = 0; i < _sceneInfos.length; i++) {
                    if (_sceneInfos[i].uuid == cc.director._scene._id) {
                        sceneName = _sceneInfos[i].url
                        sceneName = sceneName.substring(sceneName.lastIndexOf('/') + 1).match(/[^\.]+/)[0]
                    }
                }
                var now = new Date().getTime();
                var remaining = Math.max((endTime - now) / duration, 0);
                var value = Math.round(end - (remaining * range));
                if (label) {
                    if (isNaN(value) || !label.node) {
                        clearInterval(timer);
                    } else {
                        label.string = TQUtil.addDot(value);
                    }
                } else {
                    clearInterval(timer);
                }
                if (Number(value) === Number(end)) {
                    clearInterval(timer);
                }
            }

            timer = setInterval(run, stepTime);
            run();
        },
        custom_textForm: function (str) {
            var text = '';
            var j = 0;
            for (var i = str.length - 1; i >= 0; i--) {
                j++;
                text = str[i] + text;
                if (j == 3 && i != 0) {
                    text = "." + text;
                    j = 0;
                }
            }
            return text;
        },
        getCoinFrame: function (target, cb) {
            if (!target) {
                target = {};
                cc.resources.loadDir("image/icon_money", cc.SpriteFrame, (err, spriteFrameArr, urlArr) => {
                    if (!err) {
                        if (spriteFrameArr && Array.isArray(spriteFrameArr) && spriteFrameArr.length > 0) {
                            for (var i = 0; i < spriteFrameArr.length; i++) {
                                var name = spriteFrameArr[i].name;
                                if (name == "icon_money_quan") {
                                    target.Quan = spriteFrameArr[i];
                                } else {
                                    target.Xu = spriteFrameArr[i];
                                }
                            }
                            if (target) {
                                if (cb) {
                                    cb(null, target);
                                }
                            }
                        } else {
                            if (cb) {
                                cb(true, null);
                            }
                        }
                    } else {
                        if (cb) {
                            cb(err, null);
                        }
                    }
                })
            } else {
                cb(null, target);
            }
        },
        loadSoccerMapsPositionResource: function (target, data, cb) {
            if (target && this.getLengthObj(target) > 0) {
                if (cb) {
                    cb(null, target);
                }
            } else {
                target = {};
                var soccerMaps = this.getSoccerMaps();
                if (soccerMaps) {
                    var mapTypes = soccerMaps.types;
                    var mapPaths = soccerMaps.paths;
                    if (mapPaths) {
                        this.getGameLoaderBundle(function (err, gameLoaderBundle) {
                            if (!err) {
                                gameLoaderBundle.load(mapPaths, cc.Prefab, function (err, maps) {
                                    if (!err) {
                                        var mapData = this.getMapDataByPrefabs(maps);
                                        if (mapData) {
                                            var _serverData = this.createDataServer(mapData);
                                            cc.error("NVM_SERVER_IN_CHARGE", _serverData);
                                            target = mapData;
                                            if (cb) {
                                                cb(false, target);
                                            }
                                        }
                                    } else {
                                        if (cb) {
                                            cb(true, err);
                                        }
                                    }
                                }.bind(this))
                            } else {
                                cc.error(err);

                            }
                        }.bind(this))
                    }
                }
            }
        },
        isThisSoundPlayed: function (sourcesound, name) {
            // var url = cc.Global.soundData.chanHome.hasOwnProperty(nameMp3) ? cc.Global.soundData.chanHome[nameMp3] : null;
            if (sourcesound.hasOwnProperty(name)) {
                return sourcesound[name].isPlaying;
            } else {
                return false;
            }
        },
        preloadScene: function (sceneName) {
            cc.director.preloadScene(sceneName, function (err, scene) {
                Global.ASSETMANAGE.SCENES[scene.name] = null;
                if (!err) {
                    cc.log(sceneName + " scene preloaded");
                    Global.ASSETMANAGE.SCENES[sceneName] = scene;
                } else {
                    cc.log("Can not pre load " + sceneName + "Scene");
                }
            });
        },
        getOccurrence: function (arr, val) {
            if (!Array.isArray(arr)) return 0;
            var c = 0;
            arr.forEach(function (value, index) {
                if (value === val) {
                    c++;
                }
            });
            return c;
        },
        get(url, callback) {
            var xhr = new XMLHttpRequest();
            var that = this;
            xhr.addEventListener('error', function () { })
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    if (callback && that.isJsonString(response)) {
                        callback(JSON.parse(response));
                    }
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
        },
        changeAngleTo0to360: function (angle) {
            if (angle < 0) {
                angle = angle + 360 * - (angle % 360) + 360;
            } else if (angle > 360) {
                angle = angle - 360 * (angle % 360);
            }
            return angle;
        },
        getCuePosByRotate: function (cueRotate, percent) {
            cueRotate = this.changeAngleTo0to360(cueRotate);
            if (cueRotate < 0) {
                cueRotate = cueRotate + 360 * -(cueRotate % 360) + 360;
            } else if (cueRotate > 360) {
                cueRotate = cueRotate - 360 * (cueRotate % 360);
            }
            var posX;
            var posY;

            if (cueRotate >= 0 && cueRotate < 90) {

                cueRotate = cueRotate / 180 * Math.PI;
                posX = - Math.cos(cueRotate) * percent;
                posY = Math.sin(cueRotate) * percent;

            } else if (cueRotate >= 90 && cueRotate < 180) {
                cueRotate = cueRotate / 180 * Math.PI;
                posX = Math.sin(cueRotate - Math.PI / 2) * percent;
                posY = Math.cos(cueRotate - Math.PI / 2) * percent;

            } else if (cueRotate >= 180 && cueRotate < 270) {
                cueRotate = cueRotate / 180 * Math.PI;
                posX = Math.cos(cueRotate - Math.PI) * percent;
                posY = - Math.sin(cueRotate - Math.PI) * percent;

            } else if (cueRotate >= 270 && cueRotate < 360) {
                cueRotate = cueRotate / 180 * Math.PI;
                posX = - Math.sin(cueRotate - Math.PI * 1.5) * percent;
                posY = - Math.cos(cueRotate - Math.PI * 1.5) * percent;
            }
            return cc.v2(posX, posY);
        },
        getNewRx_Ry: function (x1, y1, x2, y2, rotation) {
            //x1, y1 toa do cua rect
            //x2, y2 toa do cua bi muc tieu dang tro den
            var json = {};
            var distance = this.twoDistance(x1, y1, x2, y2);
            var newrot = this.rot(x1, y1, x2, y2) - rotation;
            var newRx = Math.cos(newrot / 180 * Math.PI) * distance
            var newRy = Math.sin(newrot / 180 * Math.PI) * distance;
            json.newRx = newRx;
            json.newRy = newRy;
            return json;
        },
        twoDistance: function (X1, Y1, X2, Y2) {
            var p1 = cc.v2(X1, Y1);
            var p2 = cc.v2(X2, Y2);
            // return p2.sub(p1).mag()
            return Math.pow((Math.pow((X1 - X2), 2) + Math.pow((Y1 - Y2), 2)), 0.5);
        },
        rot: function (x1, y1, x2, y2) {
            var value = (y1 - y2) / (x1 - x2);
            return Math.atan(value) * 180 / Math.PI;
        },
        computeCollision: function (w, h, r, newrx, newry) {
            var dx = Math.min(newrx, w * 0.5);
            var dx1 = Math.max(dx, -w * 0.5);
            var dy = Math.min(newry, h * 0.5);
            var dy1 = Math.max(dy, -h * 0.5);
            return (dx1 - newrx) * (dx1 - newrx) + (dy1 - newry) * (dy1 - newry) <= r * r - 1;
        },
        getApointWhenKnowAngleAndRadius: function (p, angle, radius) {
            var x = p.x + radius * Math.cos(angle * Math.PI / 180);
            var y = p.y + radius * Math.sin(angle * Math.PI / 180);
            return cc.v2(x, y);
        },
        getIntersect: function (p1, p2, p3, p4) {
            var a = p1.x;
            var b = p1.y;
            var c = p2.x;
            var d = p2.y;
            var p = p3.x;
            var q = p3.y;
            var r = p4.x;
            var s = p4.y;
            var det, gama, lamda;
            det = (c - a) * (s - q) - (r - p) * (d - b);
            if (det === 0) {
                return { result: false, position: null };
            } else {
                lamda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
                gama = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
                var result = (0 < lamda && lamda < 1) && (0 < gama && gama < 1);
                if (result == true) {
                    var i_v = p1;//vector xuat phat
                    var d_v = cc.v2(c - a, d - b);//vector chi huong

                    return { result: true, position: cc.v2(i_v.x + lamda * d_v.x, i_v.y + gama * d_v.y) }
                }
                return { result: false, position: null }
            }
        },
        checkCollisionPointBetweenLines: function (rotate, whitePos, radius, parent) {
            if (parent) {
                // whitePos.x = whitePos.x;
                // whitePos.y = whitePos.y;
                var rectangleBox = parent.getComponent(cc.BoxCollider);
                if (rectangleBox) {
                    var _tableWidth = rectangleBox.size.width;
                    var _tableHeight = rectangleBox.size.height;
                    var _table = parent;
                    var _tablePos = _table.parent.convertToWorldSpaceAR(_table.position);
                    var _tableX = _tablePos.x;
                    var _tableY = _tablePos.y;
                    var offset = cc.v2(_table.width - _tableWidth, _table.height - _tableHeight);
                    _tableY += offset.y * 0.5;
                    _tableX += offset.x * 0.5;
                    if (rotate <= 90) {
                        rotate = rotate / 180 * Math.PI
                        var _traH = Math.tan(rotate) * (_tableWidth + _tableX - whitePos.x)
                        if (_traH <= _tableHeight + _tableY - whitePos.y) {
                            return _traH / Math.sin(rotate) - radius / Math.cos(rotate);
                        }
                        return (_tableY + _tableHeight - whitePos.y) / Math.sin(rotate) - radius / Math.sin(rotate);
                    } else if (rotate <= 180) {
                        rotate = (180 - rotate) / 180 * Math.PI
                        var _traH = (whitePos.x - _tableX) * Math.tan(rotate)
                        if (_traH <= _tableHeight + _tableY - whitePos.y) {
                            return _traH / Math.sin(rotate) - radius / Math.cos(rotate);
                        }
                        return (_tableY + _tableHeight - whitePos.y) / Math.sin(rotate) - radius / Math.sin(rotate);
                    } else if (rotate <= 270) {
                        rotate = (rotate - 180) / 180 * Math.PI
                        var _traH = (whitePos.x - _tableX) * Math.tan(rotate)
                        if (_traH <= whitePos.y - _tableY) {
                            return _traH / Math.sin(rotate) - radius / Math.cos(rotate);
                        }
                        return (whitePos.y - _tableY) / Math.sin(rotate) - radius / Math.sin(rotate);
                    } else if (rotate <= 360) {
                        rotate = (360 - rotate) / 180 * Math.PI
                        var _traH = (_tableX + _tableWidth - whitePos.x) * Math.tan(rotate)
                        if (_traH <= whitePos.y - _tableY) {
                            return (_tableX + _tableWidth - whitePos.x) / Math.cos(rotate) - radius / Math.cos(rotate);
                        }
                        return (whitePos.y - _tableY) / Math.sin(rotate) - radius / Math.sin(rotate);
                    }
                } else {
                    cc.log("Không tìm thấy box collider...");
                }
            }
            return null;
        },
        getShortestDistanceBetweenPointAndLine: function (rotate, ballPos, whitePos, radius) {
            var data = this.getLineEquation(rotate / 180 * Math.PI, whitePos);
            var A = data.A;
            var B = data.B;
            var C = data.C;
            var _verticalLine = Math.abs(A * ballPos.x + B * ballPos.y + C) / Math.sqrt(A * A + B * B);

            if ((rotate >= 0 && rotate < 90) || (rotate >= 270 && rotate <= 360)) {
                if (A * ballPos.x + B * ballPos.y + C > 0) {
                    return { _value: Math.sqrt(Math.abs(4 * radius * radius - _verticalLine * _verticalLine)), _isUpOrDown: 1 };
                } else {
                    return { _value: Math.sqrt(Math.abs(4 * radius * radius - _verticalLine * _verticalLine)), _isUpOrDown: -1 };
                }
            } else {
                if (A * ballPos.x + B * ballPos.y + C > 0) {
                    return { _value: Math.sqrt(Math.abs(4 * radius * radius - _verticalLine * _verticalLine)), _isUpOrDown: -1 };
                } else {
                    return { _value: Math.sqrt(Math.abs(4 * radius * radius - _verticalLine * _verticalLine)), _isUpOrDown: 1 };
                }
            }
        },
        shuffle: function (array) {
            var currentIndex = array.length,
                temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        },
        getLineEquation: function (rotate, whitePos) {
            var A = -Math.tan(rotate);
            var B = 1;
            var C = Math.tan(rotate) * whitePos.x - whitePos.y;
            return { A: A, B: B, C: C }
        },
        toPositiveAngle: function (angle) {
            angle = angle % 360;
            while (angle < 0) {
                angle += 360.0;
            }
            return angle;
        },
        isJsonString: function (str) {
            try {
                var o = JSON.parse(str);
                if (o && typeof o === "object") {
                    return true;
                }
            } catch (e) {
                return false;
            }
            return false;
        },
        roundPositionFloat: function (obj, fixedNumber) {
            fixedNumber = parseInt(fixedNumber);
            if (obj && !isNaN(fixedNumber)) {
                if (obj.hasOwnProperty("listBallTableJson") && this.isJsonString(obj.listBallTableJson)) {
                    var listPosition = JSON.parse(obj.listBallTableJson);
                    var listPositionFixed = [];
                    if (Array.isArray(listPosition) && listPosition.length > 0) {
                        for (let i = 0; i < listPosition.length; i++) {
                            listPositionFixed.push(
                                {
                                    x: Number(listPosition[i].x).toFixed(fixedNumber),
                                    y: Number(listPosition[i].y).toFixed(fixedNumber),
                                    num: listPosition[i].num
                                }
                            )
                        }
                    }
                    obj.listBallTableJson = JSON.stringify(listPositionFixed);
                }
            }
            return obj;
        },
        roundUp: function (num, precision) {
            precision = Math.pow(10, precision);
            return Math.ceil(num * precision) / precision;
        },
        getSoccerMaps: function () {
            var types = [];
            var paths = [];
            var names = [];
            // var _soccerAllMapPath = soccerConstant.MAPPATH;
            var _soccerAllMapPath = soccerConstant.MATPPATH_FREE;
            if (_soccerAllMapPath && Array.isArray(_soccerAllMapPath)) {
                for (var i = 0; i < _soccerAllMapPath.length; i++) {
                    types.push(_soccerAllMapPath[i].type);
                    paths.push(_soccerAllMapPath[i].path);
                    names.push(_soccerAllMapPath[i].name);
                }
            }
            return { name: names, types: types, paths: paths };
        },
        getMaxLevelRanking: function () {
            return 30;
        },
        getLevelRankingByExp: function (exp) {
            var maxRank = this.getMaxLevelRanking();
            var userLevelRankLimit = [
                { min: 0, max: 30 },
                { min: 31, max: 45 },
                { min: 46, max: 60 },
                { min: 61, max: 75 },
                { min: 76, max: 90 },
                { min: 91, max: 105 },
                { min: 106, max: 120 },
                { min: 121, max: 150 },
                { min: 151, max: 180 },
                { min: 181, max: 210 },
                { min: 211, max: 240 },
                { min: 241, max: 270 },
                { min: 271, max: 330 },
                { min: 331, max: 390 },
                { min: 391, max: 450 },
                { min: 451, max: 510 },
                { min: 511, max: 600 },
                { min: 601, max: 690 },
                { min: 691, max: 780 },
                { min: 781, max: 900 },
                { min: 901, max: 1050 },
                { min: 1051, max: 1275 },
                { min: 1276, max: 1500 },
                { min: 1501, max: 1700 },
                { min: 1701, max: 2000 },
                { min: 2001, max: 2500 },
                { min: 2501, max: 3000 },
                { min: 3001, max: 3500 },
                { min: 3501, max: 4000 },
                { min: 4001, max: 10000 }
            ];
            var level = 0;
            for (let i = 0; i < userLevelRankLimit.length; i++) {
                if ((exp >= userLevelRankLimit[userLevelRankLimit.length - 1].min)) {
                    level = parseInt(userLevelRankLimit.length);
                    break;
                } else if ((exp >= userLevelRankLimit[i].min && exp <= userLevelRankLimit[i].max)) {
                    level = parseInt(i + 1);
                    break;
                }
            }
            if (level <= 0) {
                level = 1;
            }
            if (level > maxRank) {
                level = maxRank;
            }
            return { level: level, maxRank: maxRank };
        },
        isAllElementArrSame: function (value, array) {
            return array.every(
                function (e) {
                    return e === value;
                }
            )
        },
        transpose: function (array) {
            if (Array.isArray(array)) {
                var w = array.length || 0;
                var h = array[0] instanceof Array ? array[0].length : 0;
                if (h === 0 || w === 0) {
                    return [];
                }
                var i, j, t = [];
                for (i = 0; i < h; i++) {
                    t[i] = [];
                    for (j = 0; j < w; j++) {
                        t[i][j] = array[j][i];
                    }
                }
                return t;
            }
            return [];
        },
        convertNumberToIndividual: function (num) {
            var digits = [];
            while (num > 0) {
                digits.push(num % 10);
                num = parseInt(num / 10);
            }
            digits.reverse();
            return digits;
        },
        randomMinMax: function (min, max, isInt) {
            if (isInt) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            return Math.random() * (max - min) + min;
        },
        findIntersectLineToCircle: function (posCenterCircle, radiusCircle, posLineEndPoint) {
            var v = posLineEndPoint.subtract(posCenterCircle);
            var lineLength = this.length(v);
            if (lineLength === 0) {
                return cc.log("Length must be positive...");
            }
            v.normalizeSelf();
            return posCenterCircle.add(v.multiplyScalar(radiusCircle));
        },
        length: function (vector) {
            return Math.sqrt(vector.x * vector.x + vector.y * vector.y)
        },
        dot: function (vector) {

        },

        parseTypeCard(number) {
            number = (number - 1) / 13 + 1;
            switch (number) {
                case 1:
                    return "b";
                case 2:
                    return "t";
                case 3:
                    return "c";
                case 4:
                    return "r";
                default:
                    return "c";
            }
        },

        getRandomIntInclusive: function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        chunkTo: function (flatArr, length) {
            var chunks = [], i = 0, n = flatArr.length;
            while (i < n) {
                chunks.push(flatArr.slice(i, i += length));
            }
            return chunks;
        },

        getLevelByExp: function (exp) {
            var defaultExp = 10;
            var ratioArray = [2, 10, 30, 50, 100, 300, 500, 750, 1000, 1500];
            var expLevel = 0;
            var expArray = [];
            for (var i = 1; i <= 100; i++) {
                if (1 <= i && i < 6) {
                    expLevel += i * defaultExp;
                } else if (6 <= i && i < 10) {
                    expLevel += i * ratioArray[0] * defaultExp;
                } else if (10 <= i && i < 20) {
                    expLevel += i * ratioArray[1] * defaultExp;
                } else if (20 <= i && i < 30) {
                    expLevel += i * ratioArray[2] * defaultExp;
                } else if (30 <= i && i < 40) {
                    expLevel += i * ratioArray[3] * defaultExp;
                } else if (40 <= i && i < 50) {
                    expLevel += i * ratioArray[4] * defaultExp;
                } else if (50 <= i && i < 60) {
                    expLevel += i * ratioArray[5] * defaultExp;
                } else if (60 <= i && i < 70) {
                    expLevel += i * ratioArray[6] * defaultExp;
                } else if (70 <= i && i < 80) {
                    expLevel += i * ratioArray[7] * defaultExp;
                } else if (80 <= i && i < 90) {
                    expLevel += i * ratioArray[8] * defaultExp;
                } else if (90 <= i && i <= 99) {
                    expLevel += i * ratioArray[9] * defaultExp;
                } else if (i == 100) {
                    expLevel += i * 2000 * defaultExp;
                }
                expArray.push(expLevel);
            }
            for (var i = 0; i < expArray.length; i++) {
                if (exp < expArray[i]) {
                    return { level: i + 1, maxExp: expArray[i] };
                }
            }
            return { level: 1, maxExp: expArray[0] };
        }
    }
};

module.exports = Utils;
