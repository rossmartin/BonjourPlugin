function setupBonjour() {
    console.log('Setting up bonjour');
    var root = this;

    bonjour = window.plugins.bonjour;

    if (bonjour !== null) {
        console.log('Setting up callback: didFindService');
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
//        bonjour.browse();
    }
    
}

function clientSocketDidDisconnect(error) {
    console.log('Client socket disconnected: ' + error);
}

function serverSocketDidDisconnect(error) {
    console.log('Server socket disconnected: ' + error);
}

function clientSocketDidConnect(address) {
    console.log('Client socket disconnected: ' + address);
}

function didConnectToHost(address) {
    console.log('didConnectToHost: ' + address);
}

function didRemoveService(serviceNameEscaped) {
    console.log("didRemoveService function is firing");
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
    console.log("didFindService function is firing");
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