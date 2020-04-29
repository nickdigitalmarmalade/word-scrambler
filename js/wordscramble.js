var app = window.app || {};

(function () {

    'use strict';

    /**
     * Get the default answer state object
     * @return {object}
     */
    app.helpers.getDefaultUserState = function () {
        var grid = app.vue.data.source.grid;

        for (var w = 0; w < grid.length; w++) {
            for (var h = 0; h < grid[0].length; h++) {
                var id = (h * grid.length) + w;
                app.vue.data.user.answers['cell_' + id] = ' ';
                app.vue.data.user.notes['cell_' + id] = 0;
            }
        }

        app.vue.data.user.time = 0;

        return app.vue.data.user;
    };

    app.helpers.getFeedbackCorrectObject = function (archive) {

    };

    app.helpers.getFeedbackIncorrectObject = function (archive) {

        return {};
    };

    /**
     * Start puzzle
     */
    app.helpers.puzzleStart = function (vm) {
        app.timer.start(app.vue.data.user.time);
    };

    /**
     * Callback called from timer class
     */
    app.helpers.puzzleUpdate = function (count) {
        app.vue.data.user.time = count;
        app.helpers.saveUserTime();
    };

    /**
     * Reset any flags that indicate current game state
     */
    app.helpers.resetFlags = function () {
        
        app.vue.data.active = {};
        app.vue.data.feedback = {};
        app.vue.data.modals.visible = [];

        app.vue.data.current = {
            word: [],
            level: 0,
            score: 0
        };

        app.vue.data.show = {
            help: false,
            settings: false
        };
    };


    /**
     * Get the default answer state object
     * @return {object}
     */
    app.helpers.getDefaultUserPlayStatus = function () {
        return {
            first: (new Date()).getTime(),
            last: (new Date()).getTime(),
            started: (new Date()).getTime(),
            completed: null,
        };
    };


    /**
     * Initialise Analytics
     */
    app.helpers.initialiseAnalytics = function () {
        if (app.marmalytics.cfg === null) {
            console.log('Need analytics config to be set');
            return false;
        }
        app.marmalytics.setReference(app.storage.prefix);
        app.marmalytics.setData(app.json);
    };

}());