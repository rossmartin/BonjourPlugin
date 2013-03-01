/* MIT licensed */
// (c) 2013 Jeff Schwartz, SchwarTech Consulting, LLC
(function() {

    var cordovaRef = window.PhoneGap || window.Cordova || window.cordova; // old to new fallbacks

    function BonjourPlugin() {
    }

    // Callback when a service is found.
    // Called from native
    BonjourPlugin._didFindService = function(service)
    {
        window.plugins.bonjour.didFindService(service);
    };

    // Callback when a service is removed.
    // Called from native
    BonjourPlugin._didRemoveService = function(service)
    {
        window.plugins.bonjour.didRemoveService(service);
    };

    /* The interface that you will use to access functionality */

    BonjourPlugin.prototype = {
        browse: function() {
            cordovaRef.exec('BonjourPlugin.browse');
        },
        publishService: function() {
            cordova.exec(publishServiceCB, publishServiceFail, "BonjourPlugin", "publishService", [""]); // publishes bonjour service
        },
        stopService: function() {
            cordova.exec(stopServiceBrowserCB, stopServiceBrowserFail, "BonjourPlugin", "stopServiceBrowser", [""]); // stops bonjour service browser
        },
        selectService: function(deviceNameToSendData) {
            cordovaRef.exec('BonjourPlugin.selectService', deviceNameToSendData);
        },
        stopServiceBrowser: function(deviceNameToSendData) {
            cordovaRef.exec('BonjourPlugin.stopServiceBrowser');
        }
    };

    // Note: this plugin does NOT install itself, call this method some time after deviceready to install it
    // it will be returned, and also available globally from window.plugins.bonjourPlugin
    BonjourPlugin.install = function()
    {
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
