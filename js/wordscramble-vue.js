var app = window.app || {};

(function () {

    'use strict';

    /*  ---------------------------  */
    /*    Vue Computed Properties    */
    /*  ---------------------------  */

    app.vue.computed.activeWordCompletedCorrectly = function () {

    };

    app.vue.computed.wrapperClasses = function () {
        return [
            {'loading': this.status.loading},
            {'loaded': !this.status.loading}
        ]
    };

    app.vue.computed.getCurrentWord = function () {
        function joinLetters(el){
            return el;
        }
        return this.puzzle.current.word.map(joinLetters).join('');
        
    };

    app.vue.created = function () {

    };

    /*  ------------  */
    /*    Vue Data    */
    /*  ------------  */

    app.vue.data.keyboard = [

    ];

    app.vue.data.modes.grid = true;

    /*  ----------------------  */
    /*    Vue Global Methods    */
    /*  ----------------------  */

    app.vue.methods.getPuzzleObject = function () {

        var source = app.vue.data.source;

        app.config.related = source.meta.related || 'Wordsearch';

        var obj = {
            cells: [],
            clues: [],
            cluesets: [],
            copy: {},
            counts: {
                cells: {
                    active: 0,
                    blank: 0,
                    total: 0,
                },
            },
            feedback: source.feedback || {},
            grid: [],
            settings: app.settings || {},
            words: [],
            current: {
                word: [],
                letters: [],
                level: 0,
                score: 0
            }
        };

        obj.copy.title = source.copy.title;
        obj.type = (source.copy.gridsize && source.copy.gridsize.type) ? source.copy.gridsize.type.toLowerCase() : 'standard';
        obj.competition = source.competition;

        obj.levels = source.copy.levels;

        var wordCellPositions = [];
        var grid = source.grid;
        
        var clues = source.copy.clues;
        var cluesetname = '';
        var cluesetidx = 0;

        return obj;
    };

    app.vue.methods.isWordCompleted = function (id) {

    };


    // app.vue.methods.setActiveClue = function (id) {
    //     app.vue.model.active.cell = app.helpers.getFirstCellOfWord(id, true); //this.$root.puzzle.words[id].cells[0].id;
    //     app.vue.model.active.direction = app.vue.model.puzzle.clues[id].direction;
    //     app.helpers.moveGridToCurrentSelection();
    //     app.helpers.saveActiveState();
    // };

    /*  -----------------------  */
    /*    Vue Global Watchers    */
    /*  -----------------------  */

    // app.vue.watch.activeWord = function (word) {
    //     app.helpers.scrollToClue(word);
    //     app.vue.model.$set(app.vue.data.last, 'cell-' + this.active.direction, this.active.cell);
    // };

    app.vue.watch.isCompleted = function (val) {
        if (val === true) {
            if (this.isCompletedWithoutErrors && app.status.completed === null) {
                app.status.completed = {
                    when: (new Date()).getTime(),
                    time: this.timerDisplay,
                    seconds: app.timer.get(),
                };
                app.helpers.saveUserPlayStatus();
            }
            if (this.isCompletedWithoutErrors) {
                app.vue.model.resetActions();
                app.vue.data.modals.visible.push('success');
                app.timer.stop();
            }
        }
    };

    app.vue.watch.isCompletedWithErrors = function (val) {
        if (val === true) {
            var obj = {
                'action': 'event',
                'category': 'completion',
                'item': 'negative',
                'value': this.timerDisplay,
            }
            app.vue.methods.marmalyticSend(obj);
        }
    };

    app.vue.watch.isCompletedWithoutErrors = function (val) {
        if (val === true) {
            if (app.timer) {
                app.timer.stop();
            }
            var obj = {
                'action': 'event',
                'category': 'completion',
                'item': 'positive',
                'value': this.timerDisplay,
            }
            app.vue.methods.marmalyticSend(obj);
        }
    };

    // app.vue.watch['modes.grid'] = function (val) {
    //     app.vue.model.$set(app.vue.data.active, 'mode', val ? 'grid' : 'list');
    //     app.helpers.saveActiveState();
    // };

    app.vue.watch.userSettings = function () {
        app.helpers.saveUserState();
    };

}());