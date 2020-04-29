/**
 The base class for Tealium analytics in Crosswords.
 **/

var CrosswordTealium;

/**
 * @constructor
 */
(function () {

    'use strict';

    CrosswordTealium = function () {
        Tealium.call(this);
    };
    CrosswordTealium.prototype = new Tealium(true);
    CrosswordTealium.prototype.constructor = CrosswordTealium;

}());

/**
 * create utag data object
 * @returns {object}
 */
CrosswordTealium.prototype.createUtagDataObject = function () {

    'use strict';

    return this.utag.data;

};

/**
 * create utag meta object
 * @returns {object}
 */
CrosswordTealium.prototype.createUtagMetaObject = function () {

    'use strict';

    return this.utag.meta;

};

/**
 * return default utag data object
 * @returns {object}
 */
CrosswordTealium.prototype.getDefaultUtagDataObject = function () {

    'use strict';

    var data = {};

    data.net_pn = "Games";
    data.net_platform = "web";
    data.net_sec1 = "Puzzle";
    data.net_sec2 = "Daily";
    data.net_content_type = window.utag_data === undefined ? 'index' : ((window.utag_data.net_content_type ? window.utag_data.net_content_type + '+' : '') + 'index');
    data.disable_pageview = true;

    return data;

};

/**
 * set data object - use to pass anything from root application
 * @param {object} data
 */
CrosswordTealium.prototype.setData = function (data) {

    'use strict';

    this.data = data;

    utag_data.article_headline = data.headline;
};