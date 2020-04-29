var app = window.app || {};

(function () {

    'use strict';

    /**
     * Take supplied cell object and return a more helpful version
     * @param {object} cell
     * @retrun {object} obj
     */
    app.helpers.getCellObject = function (cell) {

        var obj = {
            isBlank: cell.Blank === 'blank',
            letter: cell.Letter,
            id: cell.SquareID,
        };

        if (cell.Number !== '') {
            obj.number = cell.Number;
        }

        if (cell.WordAcrossID !== '') {
            obj.across = cell.WordAcrossID;
        }

        if (cell.WordDownID !== '') {
            obj.down = cell.WordDownID;
        }

        return obj;
    };

    /**
     * Get an array of clues adding some helper info
     * @param {array} clues
     * @param {string} direction
     * @param {integer} cluesetidx
     * @retrun {array} arr
     */
    app.helpers.getCluesArray = function (clues, direction, cluesetidx) {

        var arr = [];

        for (var i = 0; i < clues.length; i++) {
            var obj = clues[i];
            obj.direction = direction.toLowerCase();
            obj.cluesetidx = cluesetidx;
            arr.push(obj);
        }

        return arr;
    };

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
     * Get the first cell of specified word using current settings
     * @param {integer} word
     * @param {boolean} skipFilled
     * @return {integer}
     */
    app.helpers.getFirstCellOfWord = function (word, skipFilled) {

    };

    app.helpers.getWordFromId = function (wordId) {

        var vm = app.vue.model,
            word = vm.puzzle.words[wordId],
            cells = word.cells,
            string = '';

        for (var i = 0; i < cells.length; i++) {
            string += cells[i].letter;
        }

        return string;

    };


    app.helpers.isWordCompletedCorrectly = function (wordId) {

        var vm = app.vue.model,
            word = vm.puzzle.words[wordId],
            cells = word.cells,
            answers = vm.user.answers;

        for (var i = 0; i < cells.length; i++) {
            var key = 'cell_' + (cells[i].id - 1);
            if (cells[i].letter !== answers[key]) {
                return false;
            }
        }

        return true;

    };

    app.helpers.getUserAnswerForWord = function (wordId) {

        var vm = app.vue.model,
            word = vm.puzzle.words[wordId],
            cells = word.cells,
            answers = vm.user.answers,
            string = '';

        for (var i = 0; i < cells.length; i++) {
            var key = 'cell_' + (cells[i].id - 1);
            string += answers[key];
        }

        return string;

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
        app.vue.data.check = {
            grid: false,
            letter: null,
            word: null,
        };
        app.vue.data.feedback = {};
        app.vue.data.modals.visible = [];
        app.vue.data.modes.pencil = false;
        app.vue.data.reveal.grid = false;

        app.vue.data.current = {
            word: [],
            level: 0,
            score: 0
        };

        app.vue.data.show = {
            help: false,
            settings: false,
            tooltip: 1,
            unused: false,
            video: null,
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