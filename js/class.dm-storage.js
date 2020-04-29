/**
 The wrapper class for local storage.
 **/

var DMStorage;

(function () {

    'use strict';

    /**
     * @constructor
     */
    DMStorage = function (prefix, type) {

        this.prefix = prefix || '';
        this.type = type || 'local';
        this.api = this.type === 'session' ? sessionStorage : localStorage;

    };
    DMStorage.prototype.constructor = DMStorage;

    DMStorage.prototype.set = function (key, value) {

        if (key === undefined || value === undefined) {
            return false;
        }

        this.api.setItem(this.getFullKey(key), JSON.stringify(value));

        return true;

    };

    DMStorage.prototype.get = function (key, convertToObject) {

        if (key === undefined) {
            return false;
        }

        var item = this.api.getItem(this.getFullKey(key));

        if (item === null) {
            return null;
        }

        if (convertToObject === true) {
            return typeof JSON.parse(item) === 'object' ? JSON.parse(item) : JSON.parse(JSON.parse(item));
        } else {
            return JSON.parse(item);
        }

    };

    DMStorage.prototype.delete = function (key) {

        if (key === undefined) {
            return false;
        }

        this.api.removeItem(this.getFullKey(key));

        return true;

    };

    DMStorage.prototype.getFullKey = function (key) {

        if (key === undefined) {
            return false;
        }

        return this.prefix + ':_' + key;

    };

    DMStorage.prototype.getAllKeys = function () {

        var keys = [];

        for (var i in this.api) {
            if (i.substr(0, this.prefix.length + 2) === this.prefix + ':_') {
                var key = i.substr(this.prefix.length + 2);
                keys.push(key);
            }
        }

        return keys;
    };

    DMStorage.prototype.list = function (log) {

        log = log !== false;

        var items = [];
        var totalSize = 0;
        var keys = this.getAllKeys();

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var val = JSON.stringify(this.get(key));
            var size = key.length + val.length;
            if (log) {
                console.log(key, size);
            }
            items.push({
                key: key,
                size: size,
            });
            totalSize += size;
        }
        if (log) {
            console.log('_total', totalSize);
        }
        items.push({
            key: '_total',
            size: totalSize,
        });

        return items;
    };

    DMStorage.prototype.destroy = function (confirmed) {

        confirmed = confirmed === true;

        if (!confirmed) {
            console.log('please confirm destroy action');
            return false;
        }

        if (this.prefix === '') {
            console.log('sorry cannot destroy object with a prefix');
            return false;
        }

        var keys = this.getAllKeys();

        for (var i = 0; i < keys.length; i++) {
            this.delete(keys[i]);
        }

    };

}());
