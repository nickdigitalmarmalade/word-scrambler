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

    app.vue.data.modes.grid = true;

    /*  ----------------------  */
    /*    Vue Global Methods    */
    /*  ----------------------  */

    app.vue.methods.getPuzzleObject = function () {

        var source = app.vue.data.source;

        app.config.related = source.meta.related || 'Wordsearch';

        var obj = {
            cells: [],
            copy: {},
            feedback: source.feedback || {},
            grid: [],
            settings: app.settings || {},
            words: [],
            current: {
                word: [],
                letters: [],
                level: 0,
                score: 0,
                found: []
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

    /*  -----------------------  */
    /*    Vue Global Watchers    */
    /*  -----------------------  */

    app.vue.watch.userSettings = function () {
        app.helpers.saveUserState();
    };

}());