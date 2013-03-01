function setupBonjour() {
    console.log('Setting up bonjour');
    var root = this;

    bonjour = window.plugins.bonjour;

    if (bonjour !== null) {
        console.log('Setting up callbacks');
        bonjour.didFindService = function(service) {
            root.didFindService(service);
        };
        bonjour.didRemoveService = function(service) {
            root.didRemoveService(service);
        };
        bonjour.serverSocketDidDisconnect = function(error) {
            root.serverSocketDidDisconnect(error);
        };
        bonjour.clientSocketDidDisconnect = function(error) {
            root.clientSocketDidDisconnect(error);
        };
        bonjour.didConnectToHost = function(address) {
            root.didConnectToHost(address);
        };
        bonjour.clientSocketDidConnect = function(address) {
            root.clientSocketDidDisconnect(address);
        };
        bonjour.clientReceivedData = function(address) {
            root.clientReceivedData(address);
        };
        bonjour.serverReceivedData = function(address) {
            root.serverReceivedData(address);
        };
//        bonjour.browse();
    }

}

function clientReceivedData(data) {
    console.log('BonjourSample.clientReceivedData: ' + data);
    window.plugins.bonjour.sendDataToServer('My Sample Data is here');
    window.plugins.bonjour.sendDataToServer(data);
}

function serverReceivedData(data) {
    console.log('BonjourSample.serverReceivedData: ' + data);
}

function clientSocketDidDisconnect(error) {
    console.log('BonjourSample.Client socket disconnected: ' + error);
}

function serverSocketDidDisconnect(error) {
    console.log('BonjourSample.Server socket disconnected: ' + error);
}

function clientSocketDidConnect(address) {
    console.log('BonjourSample.Client socket disconnected: ' + address);
}

function didConnectToHost(address) {
    console.log('BonjourSample.didConnectToHost: ' + address);
}

function didRemoveService(serviceNameEscaped) {
    console.log("BonjourSample.didRemoveService function is firing");
    console.log("jsonEscaped ====> " + serviceNameEscaped);
    var serviceName = decodeURIComponent(serviceNameEscaped);
    serviceName = serviceName.replace("&#39;","'");  // sometimes an html entity slips through, replace it with apostrophe
    console.log("serviceName ===> " + serviceName);

    // iterate the listview to find the right device to remove from it on the browser page
    var deviceCount = 0;
    $("#deviceListview #networkDevice").each(function(){
        if ( $(this).text() == serviceName ){
            $(this).parent().parent().parent().remove(); // remove the device from the listview
            $("#deviceListview").listview("refresh");
        }
        deviceCount++;
    });

    if (deviceCount == 1){ // if we only had 1 device to remove, empty & hide the device listview
        $("#deviceListview").empty().hide();
    }
}

function didFindService(jsonEscaped) {
    console.log("BonjourSample.didFindService function is firing");
    console.log("jsonEscaped ====> " + jsonEscaped);
    var deviceJSON = decodeURIComponent(jsonEscaped);
    //console.log("deviceJSON " + deviceJSON );
    var deviceJSONArray = JSON.parse(deviceJSON);
    //console.log("deviceJSONArray ===> " + deviceJSONArray);
    $("#deviceListview").empty();
    $("#deviceListview").append('<li data-role="list-divider">Choose a Device to Send JSON</li>')
    for (var i = 0; i < deviceJSONArray.length; i++){
        var devName = deviceJSONArray[i].replace("&#39;","'");  // sometimes an html entity slips through, replace it with apostrophe
        console.log("deviceJSONArray[i] ===> " + devName);
        $('#deviceListview').append('<li class="more"><a href="#" id="networkDevice">'+devName+'</a></li>');
    }
    $("#deviceListview").listview("refresh");
    $("#browserPage").trigger("create");
    $("#deviceListview").show("slow");
}