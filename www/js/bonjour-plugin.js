/* MIT licensed */
// (c) 2013 Jeff Schwartz, SchwarTech Consulting, LLC
(function() {

    var cordovaRef = window.PhoneGap || window.Cordova || window.cordova; // old to new fallbacks

    function BonjourPlugin() {
        console.log('BonjourPlugin.constructor');
    }

    // Callback when a service is found.
    // Called from native
    BonjourPlugin._didFindService = function(service)
    {
        console.log('**** _didFindService ********');
        window.plugins.bonjour.didFindService(service);
    };

    /* The interface that you will use to access functionality */

    BonjourPlugin.prototype = {
        browse: function() {
            cordovaRef.exec('BonjourPlugin.browse');
//            cordova.exec(browseCB, browseFail, "BonjourPlugin", "browse", [""]); // starts bonjour service browser
        },
        publishService: function() {
            cordova.exec(publishServiceCB, publishServiceFail, "BonjourPlugin", "publishService", [""]); // publishes bonjour service
        },
        stopService: function() {
            cordova.exec(stopServiceBrowserCB, stopServiceBrowserFail, "BonjourPlugin", "stopServiceBrowser", [""]); // stops bonjour service browser
        },
        selectService: function(deviceNameToSendData) {
            cordova.exec(selectServiceCB, selectServiceFail, "BonjourPlugin", "selectService", [deviceNameToSendData]);
        },
        stopServiceBrowser: function(deviceNameToSendData) {
            cordova.exec(stopServiceBrowserCB, stopServiceBrowserFail, "BonjourPlugin", "stopServiceBrowser", [""]); // stops bonjour service browser
        }
    };

    // Note: this plugin does NOT install itself, call this method some time after deviceready to install it
    // it will be returned, and also available globally from window.plugins.bonjourPlugin
    BonjourPlugin.install = function()
    {
        console.log('BonjourPlugin.install');
        if (!window.plugins) {
            window.plugins = {};
        }
        if (!window.plugins.bonjour) {
            window.plugins.bonjour = new BonjourPlugin();
        }

    };

    if (cordovaRef && cordovaRef.addConstructor) {
        cordovaRef.addConstructor(BonjourPlugin.install);
    } else {
        console.log("BonjourPlugin Cordova Plugin could not be installed.");
        return null;
    }


})();









