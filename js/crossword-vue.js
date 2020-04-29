var app = window.app || {};

(function () {

    'use strict';

    /*  ---------------------------  */
    /*    Vue Computed Properties    */
    /*  ---------------------------  */

    app.vue.computed.activeClue = function () {
        return this.puzzle.clues[this.activeWord];
    };

    app.vue.computed.activeWord = function () {
        return this.puzzle.cells[this.active.cell][this.active.direction];
    };

    app.vue.computed.activeWordCompleted = function () {
        return this.isWordCompleted(this.activeWord);
    };

    app.vue.computed.activeWordCompletedCorrectly = function () {
        var cells = this.puzzle.words[this.activeWord].cells;
        var useranswers = this.user.answers;
        for (var i = 0; i < cells.length; i++) {
            if (cells[i].letter !== useranswers['cell_' + (cells[i].id - 1)]) {
                return false;
            }
        }
        return true;
    };

    app.vue.computed.showAnswerFormat = function () {
        return this.$root.puzzle.settings.type.toLowerCase() !== 'american';
    };

    app.vue.computed.wrapperClasses = function () {
        return [
            {'list-view': !this.modes.grid},
            {'check-mode': this.check.grid || this.check.letter || this.check.word},
            {'check-grid': this.check.grid},
            {'check-letter': this.check.letter},
            {'check-word': this.check.word},
            {'reveal-mode': this.reveal.grid},
            {'reveal-grid': this.reveal.grid},
            {'loading': this.status.loading},
            {'loaded': !this.status.loading},
            this.textSizeClass,
        ]
    };

    app.vue.created = function () {
        this.$root.$on('keyup-arrow', this.keyArrow);
        this.$root.$on('keyup-enter', this.keyEnter);
        if (this.active.mode) {
            this.modes.grid = this.active.mode === 'grid';
            app.helpers.scrollToClue(this.activeWord);
        }
    };

    /*  ------------  */
    /*    Vue Data    */
    /*  ------------  */

    app.vue.data.keyboard = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', {
            code: 8,
            display: '<svg class="icon-button__icon"><use xlink:href="#iconDelete"></use></svg>',
            event: 'delete',
        }]
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
            words: []
        };

        obj.copy.title = source.copy.title;
        obj.type = (source.copy.gridsize && source.copy.gridsize.type) ? source.copy.gridsize.type.toLowerCase() : 'standard';
        obj.competition = source.competition;

        var wordCellPositions = [];
        var grid = source.grid;
        for (var r = 0; r < grid.length; r++) {
            obj.grid[r] = [];
            for (var c = 0; c < grid[r].length; c++) {
                obj.grid[r][c] = app.helpers.getCellObject(grid[r][c]);
                obj.cells[grid[r][c].SquareID] = obj.grid[r][c];

                if (obj.grid[r][c].across) {
                    wordCellPositions[obj.grid[r][c].across] = wordCellPositions[obj.grid[r][c].across] || [];
                    wordCellPositions[obj.grid[r][c].across].push(obj.grid[r][c].id);
                }

                if (obj.grid[r][c].down) {
                    wordCellPositions[obj.grid[r][c].down] = wordCellPositions[obj.grid[r][c].down] || [];
                    wordCellPositions[obj.grid[r][c].down].push(obj.grid[r][c].id);
                }

                if (grid[r][c].WordAcrossID !== '') {
                    obj.words[grid[r][c].WordAcrossID] = obj.words[grid[r][c].WordAcrossID] || {
                        cells: []
                    };
                    obj.grid[r][c].acrossIdx = wordCellPositions[obj.grid[r][c].across].length;
                    obj.words[grid[r][c].WordAcrossID].cells.push(obj.grid[r][c]);
                }

                if (grid[r][c].WordDownID !== '') {
                    obj.words[grid[r][c].WordDownID] = obj.words[grid[r][c].WordDownID] || {
                        cells: []
                    };
                    obj.grid[r][c].downIdx = wordCellPositions[obj.grid[r][c].down].length;
                    obj.words[grid[r][c].WordDownID].cells.push(obj.grid[r][c]);
                }

                if (grid[r][c].style) {
                    obj.grid[r][c].style = grid[r][c].style;
                }

                if (obj.grid[r][c].isBlank) {
                    obj.counts.cells.blank++;
                } else {
                    obj.counts.cells.active++;
                }
                obj.counts.cells.total++;

            }
        }

        var clues = source.copy.clues;
        var cluesetname = '';
        var cluesetidx = 0;
        for (var i = 0; i < clues.length; i++) {
            if (cluesetname !== '' && cluesetname !== clues[i].name) {
                cluesetidx++;
            }
            obj.cluesets[cluesetidx] = obj.cluesets[cluesetidx] || {
                name: clues[i].name,
                directions: [],
            };
            obj.cluesets[cluesetidx].directions.push({
                name: clues[i].title,
                clues: app.helpers.getCluesArray(clues[i].clues, clues[i].title, cluesetidx),
            });
            for (var j = 0; j < clues[i].clues.length; j++) {
                obj.clues[clues[i].clues[j].word] = clues[i].clues[j];
            }
            cluesetname = clues[i].name;
        }

        return obj;

    };

    app.vue.methods.isWordCompleted = function (id) {
        if (this.$root.puzzle.words[id] === undefined) {
            return null;
        }
        var isCompleted = true;
        var cells = this.$root.puzzle.words[id].cells;
        for (var r = 0; r < cells.length; r++) {
            var id = cells[r].id;
            var answer = this.$root.user.answers['cell_' + (id - 1)];
            var isNote = this.$root.user.notes['cell_' + (id - 1)] !== 0;
            if (answer === ' ' || isNote) {
                isCompleted = false;
            }
        }
        return isCompleted;
    };

    app.vue.methods.keyArrow = function (event, code, direction) {
        switch (direction) {
            case 'down':
                app.helpers.setCellActiveDown(false);
                break;
            case 'left':
                app.helpers.setCellActiveLeft(false);
                break;
            case 'right':
                app.helpers.setCellActiveRight(false);
                break;
            case 'up':
                app.helpers.setCellActiveUp(false);
                break;
        }
    };

    app.vue.methods.keyEnter = function (event, code) {
        if (!event.shiftKey) {
            this.nextClue();
        } else {
            this.prevClue();
        }
    };

    app.vue.methods.manuallySetClueDirection = function (direction) {

        //  first we check to see if current cell also has selected direction
        var currentCell = app.vue.data.active.cell;
        if (this.puzzle.cells[currentCell][direction]) {
            app.vue.model.$set(app.vue.data.active, 'direction', direction);
            return true;
        }

        //  if not we set the last active cell in the selected direction
        var lastCell = app.vue.data.last['cell-' + direction];
        if (lastCell !== undefined) {
            app.vue.model.$set(app.vue.data.active, 'cell', app.vue.data.last['cell-' + direction]);
            app.vue.model.$set(app.vue.data.active, 'direction', direction);
            return true;
        }

        //  if they change direction immediately then show first clue of direction
        if (lastCell === undefined) {
            var cells = this.puzzle.cells;
            for (var i = 1; i <= cells.length; i++) {
                if (cells[i][direction]) {
                    app.vue.model.$set(app.vue.data.active, 'cell', i);
                    app.vue.model.$set(app.vue.data.active, 'direction', direction);
                    return true;
                }
            }
        }

    };

    app.vue.methods.nextClue = function () {

        var newClueId = app.vue.model.puzzle.words[this.activeWord + 1] ? this.activeWord + 1 : 1;

        if (!app.vue.data.user.settings.clueshidecompleted) {
            app.vue.model.setActiveClue(newClueId);
            return false;
        }

        if (newClueId > 1) {
            for (var i = newClueId; i < app.vue.model.puzzle.words.length; i++) {
                if (!this.isWordCompleted(i)) {
                    app.vue.model.setActiveClue(i);
                    return false;
                }
            }
        }
        for (var i = 1; i < newClueId; i++) {
            if (!this.isWordCompleted(i)) {
                app.vue.model.setActiveClue(i);
                return false;
            }
        }

        app.vue.model.setActiveClue(newClueId);

    };

    app.vue.methods.prevClue = function () {
        var newClueId = app.vue.model.puzzle.words[this.activeWord - 1] ? this.activeWord - 1 : app.vue.model.puzzle.words.length - 1;

        if (!app.vue.data.user.settings.clueshidecompleted) {
            app.vue.model.setActiveClue(newClueId);
            return false;
        }

        if (newClueId < app.vue.model.puzzle.words.length - 1) {
            for (var i = newClueId; i > 0; i--) {
                if (!this.isWordCompleted(i)) {
                    app.vue.model.setActiveClue(i);
                    return false;
                }
            }
        }
        for (var i = app.vue.model.puzzle.words.length - 1; i > newClueId; i--) {
            if (!this.isWordCompleted(i)) {
                app.vue.model.setActiveClue(i);
                return false;
            }
        }

        app.vue.model.setActiveClue(newClueId);
    };

    app.vue.methods.setActiveClue = function (id) {
        app.vue.model.active.cell = app.helpers.getFirstCellOfWord(id, true); //this.$root.puzzle.words[id].cells[0].id;
        app.vue.model.active.direction = app.vue.model.puzzle.clues[id].direction;
        app.helpers.moveGridToCurrentSelection();
        app.helpers.saveActiveState();
    };

    /*  -----------------------  */
    /*    Vue Global Watchers    */
    /*  -----------------------  */

    app.vue.watch.activeWord = function (word) {
        app.helpers.scrollToClue(word);
        app.vue.model.$set(app.vue.data.last, 'cell-' + this.active.direction, this.active.cell);
    };

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

    app.vue.watch['modes.grid'] = function (val) {
        app.vue.model.$set(app.vue.data.active, 'mode', val ? 'grid' : 'list');
        app.helpers.saveActiveState();
    };

    app.vue.watch.userSettings = function () {
        app.helpers.saveUserState();
    };

}());
