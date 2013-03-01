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

    // Called from native
    BonjourPlugin._serverSocketDidDisconnect = function(error)
    {
        window.plugins.bonjour.serverSocketDidDisconnect(error);
    };

    // Called from native
    BonjourPlugin._clientSocketDidDisconnect = function(error)
    {
        window.plugins.bonjour.clientSocketDidDisconnect(error);
    };

    /* The interface that you will use to access functionality */

    BonjourPlugin.prototype = {
        browse: function() {
            cordovaRef.exec('BonjourPlugin.browse');
        },
        publishService: function() {
            cordovaRef.exec('BonjourPlugin.publishService');
        },
        stopService: function() {
            cordovaRef.exec('BonjourPlugin.stopService');
        },
        selectService: function(deviceName) {
            cordovaRef.exec('BonjourPlugin.selectService', deviceName);
        },
        stopServiceBrowser: function() {
            cordovaRef.exec('BonjourPlugin.stopServiceBrowser');
        },
        sendClientData: function(data) {
            cordovaRef.exec('BonjourPlugin.sendClientData', data);
        },
        sendServerData: function(data) {
            cordovaRef.exec('BonjourPlugin.sendServerData', data);
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
