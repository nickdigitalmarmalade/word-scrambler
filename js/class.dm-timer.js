/**
 The DM timer class
 **/

var DMTimer;

(function () {

    'use strict';

    /**
     * @constructor
     */
    DMTimer = function () {
        this.count = 0;
        this.status = 'pending';
        this.timer = null;
        this.callback = null;
    };
    DMTimer.prototype.constructor = DMTimer;

    DMTimer.prototype.start = function (seconds) {
        seconds = seconds === undefined ? this.count : seconds;

        this.set(seconds);
        this.startTimer();
        return this.count;
    };

    DMTimer.prototype.startTimer = function () {
        var self = this;
        if (self.status !== 'active') {
            self.timer = setInterval(
                function () {
                    self.count++;
                    if (self.callback !== null) {
                        self.callback(self.count);
                    }
                },
                1000
            );
            self.status = 'active';
        }
    };

    DMTimer.prototype.get = function () {
        return this.count;
    };

    DMTimer.prototype.set = function (seconds) {
        this.count = seconds;
        return this.count;
    };

    DMTimer.prototype.stop = function () {
        clearInterval(this.timer);
        this.status = 'stopped';
        return this.count;
    };

    DMTimer.prototype.restart = function () {
        this.start(0);
    };

    DMTimer.prototype.resume = function () {
        this.start();
    };

    DMTimer.prototype.pause = function () {
        clearInterval(this.timer);
        this.status = 'paused';
        return this.count;
    };

}());
