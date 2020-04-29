var app = window.app || {};

(function () {

    'use strict';

    app.settings = {
        loadFromLocalStorage: false,
        type: 'standard',
    };

    app.config = {
        el: '#vue-container',
        id: null,
    };

    app.handlers = app.handlers || {};
    app.helpers = app.helpers || {};
    app.media = {
        supports: {
            audio: document.createElement('audio'),
            video: document.createElement('video'),
        },
    };

    app.device = {
        settings: {},
    };

    app.flags = {};

    //  is this a touch device or not - code does not pass lint but is most efficient cross-browser method (as used by modernizr)
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        app.device.settings.isTouch = true;
    } else {
        app.device.settings.isTouch = false;
    }

    /**
     * add event listeners to redict events to relevant handler
     */
    app.helpers.addEventListeners = function () {
        document.addEventListener('CellClick', function (e) {
            app.handlers.cellClick(e.detail.item, e);
        }, false);
        document.addEventListener('ClueClick', function (e) {
            app.handlers.clueClick(e.detail.item, e);
        }, false);
        document.addEventListener('LetterEntered', function (e) {
            app.handlers.letterEntered(e.detail.item, e);
        }, false);
        document.addEventListener('LetterDeleted', function (e) {
            app.handlers.letterDeleted(e.detail.item, e);
        }, false);
    };

    app.helpers.dispatchEvent = function (name, data) {
        document.dispatchEvent(new CustomEvent(app.config.variantSlug + '-' + name, {
            detail: data
        }));
    };

    /**
     * Get the location (row & col) of the specified (or active if not specifed) cell
     * @return {object}
     */
    app.helpers.getCellLocation = function (cell) {
        var dims = this.getGridDimensions();
        cell = cell || app.vue.data.active.cell;
        var obj = {
            row: Math.ceil(cell / dims.cols),
            col: cell - ((Math.ceil(cell / dims.cols) - 1) * dims.cols),
        };
        return obj;
    };

    /**
     * get the id of a cell at a specified col & row
     *
     * @param {int} col - column number
     * @param {int} row - row number
     * @returns {int} cellId
     */
    app.helpers.getCellIdFromColRow = function (col, row) {

        'use strict';

        var o = this,
            cellId = (row * app.vue.data.source.settings.colCount) + col;

        return cellId;

    };

    /**
     * get the ids of all cells in between specified cells
     *
     * @param {int} start - id of start cell
     * @param {int} end - id of end cell
     * @returns {array} list of cell ids
     */
    app.helpers.getCellIdsBetweenGivenIds = function (start, end, includeGivens) {

        'use strict';

        includeGivens = includeGivens !== false;

        var cells = [],
            cols = app.vue.data.source.settings.colCount,
            startRc = app.helpers.getColRowFromCellId(start),
            endRc = app.helpers.getColRowFromCellId(end);

        if (includeGivens) {
            cells.push(start);
        }

        var dr = startRc.row === endRc.row ? 0 : (startRc.row > endRc.row ? -1 : 1);
        var dc = startRc.col === endRc.col ? 0 : (startRc.col > endRc.col ? -1 : 1);

        var r = startRc.row;
        var c = startRc.col;

        for (var i = 0; i < cols; i++) {
            r += dr;
            c += dc;
            if (r === endRc.row && c === endRc.col) {
                break;
            }
            var thisId = app.helpers.getCellIdFromColRow(c, r);
            cells.push(thisId);
        }

        if (includeGivens) {
            cells.push(end);
        }

        return cells;

    };

    /**
     * get the row and col of a cell with a specified id
     *
     * @param {int} id - cell id
     * @returns {object}
     */
    app.helpers.getColRowFromCellId = function (id) {

        'use strict';

        var o = this,
            colRow = {};

        colRow.row = Math.floor(id / app.vue.data.source.settings.colCount);
        colRow.col = Math.floor(id - (colRow.row * app.vue.data.source.settings.colCount));

        return colRow;

    };

    app.helpers.getDate = function (format) {
        var parts = format.split('');
        var date = [];
        for (var i = 0; i < parts.length; i++) {
            var item = parts[i].match(/[a-z]/i) ? app.helpers.getDateItem(parts[i]) : parts[i];
            date.push(item);
        }
        return date.join('');
    };

    app.helpers.getDateItem = function (format, date) {
        date = date || new Date();

        switch (format) {
            case 'd':
                return '' + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate());
            case 'j':
                return '' + (date.getDate());
            case 'm':
                return '' + ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1));
            case 'n':
                return '' + ((date.getMonth() + 1));
            case 'Y':
                return '' + date.getFullYear();
        }
        return format;
    };

    /**
     * Get the default active state object
     * @return {object}
     */
    app.helpers.getDefaultActiveState = function () {
        return {}
    };

    /**
     * Get the default answer state object
     * @return {object}
     */
    app.helpers.getDefaultUserPlayStatus = function () {
        return {
            first: (new Date()).getTime(),
            last: (new Date()).getTime(),
            started: null,
            completed: null,
        };
    };

    /**
     * Get the default answer state object
     * @return {object}
     */
    app.helpers.getDefaultUserState = function () {
        return app.vue.data.user;
    };

    app.helpers.getFeedbackLinksObject = function (archive) {

        var obj = {
            positive: app.helpers.getFeedbackCorrectObject(archive),
            negative: app.helpers.getFeedbackIncorrectObject(archive),
        };

        return obj;
    };

    app.helpers.getFeedbackCorrectObject = function (archive) {

        var obj = {
            links: [],
            subtitle: 'You completed the ' + app.config.variant.toLowerCase() + ' in ',
            title: 'Well done!',
            view_all_url: '/mind-games/' + app.config.variant.toLowerCase() + '-homepage.html',
        };

        var item = app.helpers.getFeedbackLinkObject(app.config.variant, archive);
        if (item.title) {
            obj.links.push(item);
        }

        var item = app.helpers.getFeedbackLinkObject(app.config.related, archive);
        if (item.title) {
            obj.links.push(item);
        }

        return obj;
    };

    app.helpers.getFeedbackIncorrectObject = function (archive) {

        var obj = {
            links: [],
            subtitle: 'It\'s not quite right yet.',
            title: 'Keep Trying!',
            view_all_url: '/mind-games/' + app.config.variant.toLowerCase() + '-homepage.html',
        };

        var item = app.helpers.getFeedbackLinkObject(app.config.variant, archive);
        if (item.title) {
            obj.links.push(item);
        }

        var item = app.helpers.getFeedbackLinkObject(app.config.related, archive);
        if (item.title) {
            obj.links.push(item);
        }

        return obj;
    };

    app.helpers.getFeedbackDefaultCorrectObject = function () {

        var obj = {
            title: 'Well done',
            subtitle: 'You completed the ' + app.config.variant.toLowerCase() + '.',
            buttons: [
                {
                    label: 'Continue',
                    action: 'hideCompletionOverlay',
                },
            ],
            links: [],
        };

        return obj;
    };

    app.helpers.getFeedbackDefaultIncorrectObject = function () {

        var obj = {
            title: 'Keep Trying!',
            subtitle: 'It\'s not quite right yet.',
            buttons: [
                {
                    label: 'Keep Trying!',
                    action: 'hideCompletionOverlay',
                },
            ],
            links: [],
        };

        return obj;
    };

    app.helpers.getFeedbackLinkObject = function (variant, archive) {

        var id = (archive.today && variant !== app.config.variant) ? archive.today[variant] : undefined,
            puzObj = null,
            obj = {};

        if (id === undefined) {
            var puzzles = archive.variants[variant];
            if (puzzles !== undefined) {
                puzObj = archive.puzzles[puzzles[0]];
                for (var i = 0; i < puzzles.length; i++) {
                    if ((puzzles[i] === app.config.slug) && (puzzles.length > (i + 1))) {
                        puzObj = archive.puzzles[puzzles[i + 1]];
                        break;
                    }
                }
            }
        } else {
            puzObj = archive.puzzles[id];
        }

        if (puzObj !== null) {
            obj.title = puzObj.name;
            obj.url = puzObj.landingUrl || '../../../' + puzObj.tag + '-puzzle.html?id=' + puzObj.name.split(' ').join('-').toLowerCase();
            obj.link_text = puzObj.name;
            obj.image = app.helpers.getFeedbackLinkImagePath(puzObj.tag);
        }

        return obj;
    };

    app.helpers.getFeedbackLinkImagePath = function (slug) {
        return '/mind-games/public/img/' + slug + '-icon.svg';
    };

    /**
     * Get the dimensions (rows & cols) of the grid
     * @return {object}
     */
    app.helpers.getGridDimensions = function () {
        var obj = {
            rows: app.vue.model.puzzle.grid.length,
            cols: app.vue.model.puzzle.grid.length,
        };
        return obj;
    };
    /**
     * Get URL of most recent unplayed puzzle by type
     * @param {string} type
     * @return {string|null} url
     */
    app.helpers.getMostRecentUnplayedPuzzleOfType = function (type) {

        type = type || app.config.variant;

        var archive = app.vue.data.puzzle.archive;

        var puzzles = archive.puzzles,
            ids = archive.variants[type] || [];

        for (var i = 0; i < ids.length; i++) {
            if (parseInt(puzzles[ids[i]].id, 10) === parseInt(app.config.id, 10)) {
                continue;
            }
            var puzzle = puzzles[ids[i]];
            var storage = new DMStorage(type.toLowerCase() + '-' + puzzle.id);
            var status = storage.get('status');
            var completed = status !== null && status.completed !== undefined && status.completed !== null;
            if (completed) {
                continue;
            }
            return puzzle;
        }

        return null;
    };

    /**
     * Get default sharing object
     */
    app.helpers.getSharingDefaultObject = function () {

        var obj = {
            email: {
                subject: app.json.copy.title + ', ' + app.json.copy['date-publish-email'],
                body: '',
            },
            print: {
                url: '',
            },
        };

        return obj;

    };

    /**
     * Set sharing object
     */
    app.helpers.getSharingObject = function () {

        var obj = app.helpers.getSharingDefaultObject();

        if (app.json.sharing) {
            obj = $.extend(true, obj, app.json.sharing);
        }

        return obj;

    };

    /**
     * Get user's answers as a string
     * @return {string} string
     */
    app.helpers.getUserAnswerString = function () {
        var rows = app.vue.data.puzzle.grid.length,
            cols = app.vue.data.puzzle.grid.length,
            string = '';

        for (var i = 0; i < rows * cols; i++) {
            string += app.vue.data.user.answers['cell_' + i];
        }

        return string;
    };

    /**
     * Get puzzle status information by IDs
     * @param {array} ids
     * @return {object} obj
     */
    app.helpers.getPuzzleStatusesByIds = function (ids) {

        ids = typeof ids !== 'object' ? [ids] : ids;

        var obj = {};

        for (var i = 0; i < ids.length; i++) {
            var parts = String(ids[i]).split('-');
            if (parts.length < 2) {
                parts.unshift(app.config.type);
            }
            var id = parts.join('-');
            var storage = new DMStorage(id);
            obj[ids[i]] = storage.get('status');
        }

        return obj;
    };

    /**
     * Puzzle specific start up code
     */
    app.helpers.initPuzzle = function () {
        //  puzzle specific start up code here
    };

    /**
     * Load active state from storage
     * If not found then load default active state and save
     */
    app.helpers.loadActiveState = function () {
        var data = app.storage.get('active');
        if (data !== null) {
            app.vue.data.active = data;
        } else {
            app.vue.data.active = app.helpers.getDefaultActiveState();
            app.helpers.saveActiveState();
        }
        app.vue.data.last['cell-' + app.vue.data.active.direction] = app.vue.data.active.cell;
    };

    /**
     * Load specified puzzle inot local storage
     * @param {object} puzzle
     */
    app.helpers.loadArchivedPuzzleIntoStorage = function (puzzle) {

        var today = app.helpers.getDate('d.m.Y');
        var ls = app.archiveStorage.get(puzzle.id);

        //  do not continue if we have already pulled this puzzle today
        if (ls && ls.date && ls.date === today) {
            return false;
        }

        axios.get(puzzle.url).then(function (json) {
            if (json && json.data) {
                var obj = {
                    date: today,
                    url: puzzle.url,
                    json: json.data,
                };
                app.archiveStorage.set(puzzle.id, obj);
            }
        });
    };

    /**
     * Load puzzles into local storage
     */
    app.helpers.loadArchivedPuzzlesIntoStorage = function () {
        var archive = app.vue.data.puzzle.archive;
        for (var i in archive.puzzles) {
            app.helpers.loadArchivedPuzzleIntoStorage(archive.puzzles[i]);
        }
    };

    /**
     * Load specific puzzle from archive
     * @param {int} id
     * @return {promise} dfd
     */
    app.helpers.loadPuzzleFromArchive = function (id) {
        var dfd = $.Deferred();

        axios.get((app.settings.archiveRootPath || '') + 'archive.json')
            .then(function (response) {
                if (!response.data.puzzles) {
                    dfd.reject('could not find puzzles object in archive');
                }
                for (var i in response.data.puzzles) {
                    if (response.data.puzzles[i].id == id) {
                        axios.get(response.data.puzzles[i].url)
                            .then(function (response) {
                                console.log(response);
                                dfd.resolve(response);
                            }, function (error) {
                                console.log(error);
                                dfd.reject(error);
                            });
                        return dfd.promise();
                    }
                }
                dfd.reject('could not find puzzle ' + id + ' in archive');
            }, function (error) {
                dfd.reject(error);
            });

        return dfd.promise();
    };

    /**
     * Load puzzle state
     * Loads active and answer states from storage
     */
    app.helpers.loadPuzzleState = function () {
        app.helpers.loadActiveState();
        app.helpers.loadUserPlayStatus();
        app.helpers.loadUserState();
        app.helpers.loadUserTime();
    };

    /**
     * Load play status from storage
     * If not found then load default status and save
     */
    app.helpers.loadUserPlayStatus = function () {
        var data = app.storage.get('status');
        if (data !== null) {
            app.status = data;
        } else {
            app.status = app.helpers.getDefaultUserPlayStatus();
        }
        app.status.last = (new Date()).getTime();
        app.helpers.saveUserPlayStatus();
    };

    /**
     * Load answer state from storage
     * If not found then load default answer state and save
     */
    app.helpers.loadUserState = function () {
        var data = app.storage.get('user');
        if (data !== null) {
            app.vue.data.user = data;
        } else {
            app.flags.firstVisit = true;
            app.vue.data.user = app.helpers.getDefaultUserState();
            app.helpers.saveUserState();
        }
    };

    /**
     * Load time from storage
     */
    app.helpers.loadUserTime = function () {
        var data = app.storage.get('time');
        if (data !== null) {
            app.vue.data.user.time = data;
        } else {
            app.vue.data.user.time = 0;
            app.helpers.saveUserTime();
        }
    };

    app.helpers.clearAllCellsNeedingCorrection = function () {
        app.vue.model.$set(app.vue.data.status, 'needingCorrection', []);
    };

    app.helpers.clearCellNeedingCorrection = function (cell) {
        var cellsNeedingCorrection = app.vue.data.status.needingCorrection;
        if (cellsNeedingCorrection.indexOf(cell) > -1) {
            cellsNeedingCorrection.splice(cellsNeedingCorrection.indexOf(cell), 1);
            app.vue.model.$set(app.vue.data.status, 'needingCorrection', cellsNeedingCorrection);
        }
    };

    app.helpers.markCellsNeedingCorrection = function () {
        if (app.vue.model.activeCompetition) {
            return [];
        }
        var grid = app.vue.data.puzzle.grid;
        var cellsNeedingCorrection = [];
        for (var r in grid) {
            for (var c in grid[r]) {
                var cell = grid[r][c];
                if (!cell.isBlank) {
                    var id = grid[r][c].id;
                    var letter = grid[r][c].letter;
                    var uacell = 'cell_' + (id - 1);
                    var ua = app.vue.data.user.answers[uacell];
                    if (ua !== letter) {
                        cellsNeedingCorrection.push(id);
                    }
                }
            }
        }
        app.vue.model.$set(app.vue.data.status, 'needingCorrection', cellsNeedingCorrection);
    };

    /**
     * Mounted. Called when Vue has finished initialising
     */
    app.helpers.mounted = function (vm) {
        //console.log('mounted');
    };

    /**
     * Scroll the grid to show selection
     */
    app.helpers.moveGridToCurrentSelection = function (first, last) {
        //  puzzle type specific code here
    };

    /**
     * Called when hash in URL changes
     */
    app.helpers.onHashChange = function () {

        var currentHash = location.hashes.ls;
        app.helpers.parseHashParams();
        var newHash = location.hashes.ls;

        if (!newHash || newHash === currentHash) {
            return false;
        }
        app.xs = (new Date()).getTime();
        app.vue.model.$set(app.vue.data.status, 'loading', true);
        app.vue.model.$forceUpdate(); 
        setTimeout(
            function () {
                app.loadPuzzleJson().then(function (json) {
                    app.json = json;
                    app.initialise(app.json);
                    document.dispatchEvent(new CustomEvent('puzzleChanged', {detail: {json: app.json}}));
                });
            },
            100
        );
    };

    /**
     * Put URL hash parameters into an object
     * @return {Object}     The URL hash parameters
     */
    app.helpers.parseHashParams = function () {
        var hash = window.location.hash;
        var hashes = {};
        var query = hash.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            hashes[pair[0]] = decodeURIComponent(pair[1]);
        }
        location.hashes = hashes;
        return hashes;
    };

    /**
     * Put URL parameters into an object
     * source: https://css-tricks.com/snippets/javascript/get-url-variables/
     * @param  {String} url The URL
     * @return {Object}     The URL parameters
     */
    app.helpers.parseUrlParams = function (url) {
        url = url || window.location.href;
        var params = {};
        var parser = document.createElement('a');
        parser.href = url;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        location.params = params;
        return params;
    };

    /**
     * Custom logic run after archive loaded
     */
    app.helpers.processFeedback = function () {
        app.vue.model.$set(app.vue.model.puzzle, 'feedback', app.helpers.getFeedbackLinksObject(app.vue.data.puzzle.archive));
    };

    /**
     * Custom logic run after archive loaded
     */
    app.helpers.processArchive = function () {
        if (app.settings.loadFromLocalStorage) {
            app.helpers.loadArchivedPuzzlesIntoStorage();
        }
        app.helpers.processFeedback();
    };

    /**
     * Process settings.
     * Place them into correct objects
     * @return {object}
     */
    app.helpers.processSettings = function (settings) {
        for (var i in settings.user) {
            app.vue.data.user.settings[i] = settings.user[i].default;
        }
        for (var i in settings.puzzle) {
            app.vue.data.config[i] = settings.puzzle[i];
        }
    };

    /**
     * Reset any flags that indicate current game state
     */
    app.helpers.resetFlags = function () {

    };

    /**
     * Reset answer state to default
     */
    app.helpers.resetUserState = function () {
        app.vue.data.user = app.helpers.getDefaultUserState();
        app.helpers.saveUserState();
    };

    /**
     * Reveal the specified cell
     */
    app.helpers.revealCell = function (id) {
        app.vue.data.user.answers['cell_' + (id - 1)] = app.vue.model.puzzle.cells[id].letter;
        app.helpers.saveUserState();
    };

    /**
     * Save active state to storage
     */
    app.helpers.saveActiveState = function () {
        app.storage.set('active', app.vue.data.active);
    };

    /**
     * Save answer state to storage
     */
    app.helpers.saveUserPlayStatus = function () {
        app.storage.set('status', app.status);
    };

    /**
     * Save answer state to storage
     */
    app.helpers.saveUserState = function () {
        app.storage.set('user', app.vue.data.user);
    };

    /**
     * Save elapsed time to storage
     */
    app.helpers.saveUserTime = function () {
        app.storage.set('time', app.vue.data.user.time);
    };

    /**
     * Set analytics config object
     */
    app.helpers.setAnalyticsConfig = function (cfg) {
        app.analyticsConfig = cfg;
    };

    /**
     * Set puzzle config object
     */
    app.helpers.setPuzzleConfig = function (data) {
        app.config = app.config || {};
        app.config.id = data.meta.id;
        app.config.slug = data.meta.slug;
        app.config.type = data.type;
        app.config.variant = data.meta.variant;
        app.config.variantSlug = app.config.variant.split(' ').join('-').toLowerCase();
        app.config.related = data.meta.related || 'Number Crunch';
        app.config.home = '/mind-games';
        app.config.variantHome = app.config.home + '/' + app.config.variantSlug + '-homepage.html';
    };

    /**
     * Save timestamp for specified item
     * @param {string} item
     */
    app.helpers.tsSet = function (item) {
        app.vue.model.$set(app.vue.data.ts, item, (new Date()).getTime());
    };

    /**
     * Check timestamps for specified items to determine which came first
     * @param {string} whenA
     * @param {string} whenB
     * @return {boolean} whether first param timestamp is older than second
     * @return {integer} -1, 0 or 1 as detailed in comments
     */
    app.helpers.tsThisBeforeThat = function (whenA, whenB) {
        //  neither param defined; return 0
        if (app.vue.data.ts[whenA] === undefined && app.vue.data.ts[whenB] === undefined) {
            return 0;
        }
        //  param 2 not defined; return -1
        if (app.vue.data.ts[whenB] === undefined) {
            return -1;
        }
        //  param 1 not defined; return 1
        if (app.vue.data.ts[whenA] === undefined) {
            return 1;
        }
        //  return whether param 1 happened before param 2
        return app.vue.data.ts[whenB] - app.vue.data.ts[whenA] > 0;
    };

    /**
     * Core init method
     * @param {object} settings
     * @param {string} platform
     */
    app.init = function (settings, platform) {
        app.platform = platform ? platform.toLowerCase() : 'local';
        //  create settings object if not supplied
        settings = settings || {};
        app.helpers.processSettings(settings);
        //  helpers
        app.helpers.parseUrlParams();
        app.helpers.parseHashParams();
        //  archive storage
        app.archiveStorage = new DMStorage('puzzles');
        //  load puzzle
        app.loadPuzzleJson()
            .then(function (json) {
                app.json = json;
                app.initialise(app.json);
            }, function (error) {
                console.log(error);
            });
    };

    /**
     * Core puzzle init method
     * @param {object} settings
     */
    app.initialise = function (json) {
        app.helpers.resetFlags();
        app.vue.methods.setSource(json);
        if (!app.vue.model) {
            app.vue.init(app.config.el);
            app.helpers.addEventListeners();
        }
        if (app.vue.data.config.hasTimer) {
            if (app.timer) {
                app.timer.stop();
            }
            app.timer = new DMTimer();
            app.timer.callback = app.helpers.puzzleUpdate;
        }
        //app.helpers.initialiseAnalytics();
        if (!app.vue.model.isCompletedWithoutErrors) {
            app.helpers.puzzleStart();
        }
        app.helpers.processFeedback();
        //app.marmalytics.init();
        //app.marmalytics.settings.logLevel = app.platform === 'local' ? 1 : 0;
        //app.marmalytics.pageLoad();
    };

    /**
     * Load puzzle based on supplied params
     * @return {promise} dfd
     */
    app.loadPuzzleJson = function () {

        var dfd = $.Deferred();

        //  1. if we have a hash
        if (app.settings.loadFromLocalStorage && window.location.hashes.ls) {
            //  a. attempt to load from storage
            //  b. attempt to load from archive
            var json = app.archiveStorage.get(window.location.hashes.ls);
            if (json !== null) {
                dfd.resolve(json.json ? json.json : json);
            } else {
                app.helpers.loadPuzzleFromArchive(window.location.hashes.ls)
                    .then(function (response) {
                        dfd.resolve(response.data);
                    }, function (error) {
                        dfd.reject(error);
                    });
            }
            return dfd.promise();
        }

        //  2. if we have path to json use it
        if (location.params.json) {
            var dataUrl = 'json/' + location.params.json + '.json';
            axios.get(dataUrl)
                .then(function (response) {
                    dfd.resolve(response.data);
                }, function (error) {
                    dfd.reject('file not found: ' + dataUrl);
                });
            return dfd.promise();
        }

        //  3. load puzzle from archive
        if (app.settings.loadDeafultFromArchive === true) {
            axios.get((app.settings.archiveRootPath || '') + 'archive.json').then(function (json) {
                var slug;

                if (json.data.today && json.data.today[app.config.variant]) {
                    slug = json.data.today[app.config.variant][0];
                } else if (json.data.variants && json.data.variants[app.config.variant]) {
                    slug = json.data.variants[app.config.variant][0];
                }

                if (slug) {
                    if (json.data.puzzles && json.data.puzzles[slug]) {
                        var puzzle = json.data.puzzles[slug];
                        if (puzzle && puzzle.url) {
                            var dataUrl = puzzle.url;
                            axios.get(dataUrl)
                                .then(function (response) {
                                    dfd.resolve(response.data);
                                }, function (error) {
                                    dfd.reject('file not found: ' + dataUrl);
                                });
                        }
                    }
                }
            });
            return dfd.promise();
        }

        //  4. load puzzle from local json file
        var dataUrl = 'data.json';
        axios.get(dataUrl)
            .then(function (response) {
                dfd.resolve(response.data);
            }, function (error) {
                dfd.reject('file not found: ' + dataUrl);
            });


        return dfd.promise();
    };

}());
