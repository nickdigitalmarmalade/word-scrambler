/**
 The base class for Tealium analytics.
 **/

var Tealium;

/**
 * @constructor
 */
(function () {

    'use strict';

    Tealium = function () {
        Marmalytics.call(this);
        this.utag = {};
        this.addSettings();
    };
    Tealium.prototype = new Marmalytics(true);
    Tealium.prototype.constructor = Tealium;

}());

/**
 * add Tealium settings
 */
Tealium.prototype.addSettings = function () {

    'use strict';

    this.settings.objectNames = this.settings.objectNames || {};
    this.settings.objectNames.type = 'call_type';
    this.settings.objectNames.action = 'event_engagement_action';
    this.settings.objectNames.name = 'event_engagement_name';
    this.settings.objectNames.method = 'event_engagement_browsing_method';
    this.settings.eventObject = this.settings.eventObject || {};
    this.settings.eventObject.sendOrientation = true;
    this.settings.eventObject.sendUtagData = false;

};

/**
 * set analytics type config object
 * @param {object} cfg
 */
Tealium.prototype.setConfig = function (cfg) {

    'use strict';

    this.cfg = cfg;
    this.utag.cfg = cfg;
};

/**
 * initialise analytics
 */
Tealium.prototype.initialise = function () {

    'use strict';

    this.settings.sendInitialPageLoad = false;

    if (this.settings.logLevel >= 2) {
        console.log('Tealium: initialise');
    }

    this.create();
};

/**
 * set up tagging objects
 */
Tealium.prototype.create = function () {

    'use strict';

    this.utag.initialMeta = window.utag_meta ? JSON.parse(JSON.stringify(window.utag_meta)) : {};
    this.utag.initialData = window.utag_data ? JSON.parse(JSON.stringify(window.utag_data)) : {};

    this.utag.meta = window.utag_meta || this.getDefaultUtagMetaObject();
    this.utag.data = window.utag_data || this.getDefaultUtagDataObject();

    window.utag_meta = this.utag.meta;
    window.utag_data = this.utag.data;

    this.createUtagMetaObject();
    this.createUtagDataObject();

    if (this.isLiveConfig()) {
        this.createScript();
        this.addAppScript();
    } else {
        if (this.settings.logLevel >= 1) {
            console.log('NOT LIVE', this.utag);
        }
    }

};

/**
 * check if we have active config
 * @returns {boolean}
 */
Tealium.prototype.isLiveConfig = function () {

    'use strict';

    if (typeof this.utag.cfg.account !== 'string' || this.utag.cfg.account.trim() === '' || this.utag.cfg.account.trim().substr(0, 4) === '<!--') {
        return false;
    }

    if (typeof this.utag.cfg.environment !== 'string' || this.utag.cfg.environment.trim() === '' || this.utag.cfg.environment.trim().substr(0, 4) === '<!--') {
        return false;
    }

    if (typeof this.utag.cfg.profile !== 'string' || this.utag.cfg.profile.trim() === '' || this.utag.cfg.profile.trim().substr(0, 4) === '<!--') {
        return false;
    }

    if (this.utag.cfg.environment.trim().toLowerCase() === 'local') {
        return false;
    }

    return true;
};

/**
 * set up tagging script
 * @returns {string} url
 */
Tealium.prototype.getScriptUrl = function () {

    'use strict';

    var url = '//tags.tiqcdn.com/utag/' + this.utag.cfg.account + '/' + this.utag.cfg.profile + '/' + this.utag.cfg.environment + '/utag.js';

    return url;

};

/**
 * set up tagging script
 */
Tealium.prototype.createScript = function () {

    'use strict';

    var self = this;

    if (this.utag.cfg.account && this.utag.cfg.environment && this.utag.cfg.profile) {
        (function (a, b, c, d) {
            a = self.getScriptUrl();
            b = document;
            c = 'script';
            d = b.createElement(c);
            d.src = a;
            d.type = 'text/java' + c;
            d.async = true;
            a = b.getElementsByTagName(c)[0];
            a.parentNode.insertBefore(d, a);
        })();
    }

};

/**
 * Set app as the channel if loaded from the app
 */
Tealium.prototype.addAppScript = function () {

    'use strict';

    function getCookie(t){
        for(var a=t+"=",n=document.cookie.split(";"),o=0;o<n.length;o++){for(var i=n[o];" "===i.charAt(0);)i=i.substring(1);if(0===i.indexOf(a))return i.substring(a.length,i.length)}
    }
    getCookie("app_display")&&(window.utag_data=window.utag_data||{},window.utag_data.net_platform="app");

};

/**
 * create utag data object
 * @returns {object}
 */
Tealium.prototype.createUtagDataObject = function () {

    'use strict';

    this.utag.data = this.utag.data || {};

    return this.utag.data;

};

/**
 * create utag meta object
 * @returns {object}
 */
Tealium.prototype.createUtagMetaObject = function () {

    'use strict';

    this.utag.meta = this.utag.meta || {};

    return this.utag.meta;

};

/**
 * return default utag data object
 * @returns {object}
 */
Tealium.prototype.getDefaultUtagDataObject = function () {

    'use strict';

    return {};

};

/**
 * return default utag meta object
 * @returns {object}
 */
Tealium.prototype.getDefaultUtagMetaObject = function () {

    'use strict';

    var obj = {};

    return obj;

};

/**
 * return default event object 
 * @returns {object} obj
 */
Tealium.prototype.getDefaultEventObject = function () {

    'use strict';

    var obj = this.settings.eventObject.sendUtagData ? this.utag.initialData : {};

    if (this.settings.eventObject.sendOrientation) {
        obj.orientation = $('body').width() > $('body').height() ? 'landscape' : 'portrait';
    }

    return obj;
};

/**
 * Process queue item
 * @param {object} item
 * @returns {promise}
 */
Tealium.prototype.processQueueItem = function (item) {

    'use strict';

    if (!this.isLiveConfig()) {
        return this.consoleAndRemoveItem(item);
    }

    if (window.utag === undefined) {
        return false;
    }

    this.queue[item.id].sent = 'pending';

    var self = this;

    var deferred = jQuery.Deferred();

    var event_object = this.getDefaultEventObject();

    if (this.settings.objectNames.type) {
        event_object[this.settings.objectNames.type] = 'event';
    }

    if (this.settings.objectNames.action) {
        event_object[this.settings.objectNames.action] = 'engagement';
    }

    if (this.settings.objectNames.name) {
        event_object[this.settings.objectNames.name] = item.data.item;
    }

    if (this.settings.objectNames.method) {
        event_object[this.settings.objectNames.method] = item.data.action;
    }

    if (window.utag.link(event_object)) {
        deferred.resolve(item);
    } else {
        deferred.reject(item, 'error');
    }

    return deferred.promise();

};

/**
 * console log class name
 */
Marmalytics.prototype.consoleClassName = function () {
    console.log('%c   Tealium', 'color:#08D;background:url(https://tealium.com/wp-content/uploads/2014/11/favicon.ico) no-repeat;');
};
