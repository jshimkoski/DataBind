(function() {

    "use strict";

    var DataBind = window.DataBind = function(key, value) {
        this.set(key, value);
        this._listener();
    };

    DataBind.prototype = {
        get: function(key) {
            if (!key) {
                return this.model;
            }
            return this.model[key];
        },
        set: function(key, value) {
            this.model = this.model || {};
            if (!key || (typeof key === 'object' && Object.keys(key).length === 0)) {
                return;
            }
            if (typeof key !== 'object') {
                this.model[key] = value || "";
                this._changeHandler(key);
            } else {
                this.model = key;
                var k = Object.keys(key),
                    length = k.length;

                while (length--) {
                    this._changeHandler(k[length]);
                }
            }
        },
        _changeHandler: function(key) {
            var binded = document.querySelectorAll('[data-bind="' + key + '"]'),
                length = binded.length;

            while (length--) {
                var el = binded[length],
                    value = this.get(key);

                // # TODO: Check if value is array, if it is, cloneNode with separate values.

                if (this._isInput(el)) {
                    el.value = value;
                } else {
                    el.innerHTML = value;
                }
            }
        },
        _listener: function() {
            if (document.addEventListener) {
                document.addEventListener('change', this._listenerHandler(), false);
            } else { // IE8 Support
                document.attachEvent('onchange', this._listenerHandler());
            }
        },
        _listenerHandler: function() {
            var self = this;
            return function (e) {
                e = e || window.event;
                var target = e.target || e.srcElement,
                    key = target.getAttribute('data-bind'),
                    value = target.value;
                if (!key) {
                    return e;
                }

                self.set(key, value);
            };
        },
        _isInput: function(el) {
            var bool = (el.tagName && el.tagName.toLowerCase() === "input") ||
                (el.tagName && el.tagName.toLowerCase() === "textarea") ||
                (el.tagName && el.tagName.toLowerCase() === "select");
            return bool;
        }
    };

}());