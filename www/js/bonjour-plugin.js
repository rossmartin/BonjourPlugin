/* MIT licensed */
// (c) 2013 Jeff Schwartz, SchwarTech Consulting, LLC
(function() {

    var cordovaRef = window.PhoneGap || window.Cordova || window.cordova; // old to new fallbacks

    function BonjourPlugin() {
    }

    // Native Callbacks
    BonjourPlugin._didFindService = function(service)
    {
        window.plugins.bonjour.didFindService(service);
    };

    BonjourPlugin._didRemoveService = function(service)
    {
        window.plugins.bonjour.didRemoveService(service);
    };

    BonjourPlugin._serverSocketDidDisconnect = function(error)
    {
        window.plugins.bonjour.serverSocketDidDisconnect(error);
    };

    BonjourPlugin._clientSocketDidDisconnect = function(error)
    {
        window.plugins.bonjour.clientSocketDidDisconnect(error);
    };

    BonjourPlugin._didConnectToHost = function(address)
    {
        window.plugins.bonjour.didConnectToHost(address);
    };

    BonjourPlugin._clientReceivedData = function(data)
    {
        window.plugins.bonjour.clientReceivedData(data);
    };

    BonjourPlugin._serverReceivedData = function(data)
    {
        window.plugins.bonjour.serverReceivedData(data);
    };

    /* The interface that you will use to access functionality */

    BonjourPlugin.prototype = {
        startBrowser: function(serviceType) {
            cordovaRef.exec('BonjourPlugin.startBrowser', serviceType);
        },
        publishService: function(serviceType) {
            cordovaRef.exec('BonjourPlugin.publishService', serviceType);
        },
        unpublishService: function() {
            cordovaRef.exec('BonjourPlugin.unpublishService');
        },
        selectService: function(deviceName) {
            cordovaRef.exec('BonjourPlugin.selectService', deviceName);
        },
        stopBrowser: function() {
            cordovaRef.exec('BonjourPlugin.stopBrowser');
        },
        sendDataToServer: function(data) {
            cordovaRef.exec('BonjourPlugin.sendDataToServer', data);
        },
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
