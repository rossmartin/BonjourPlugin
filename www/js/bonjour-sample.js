function setupBonjour() {
    console.log('Setting up bonjour');
    var root = this;

    bonjour = window.plugins.bonjour;

    if (bonjour !== null) {
        console.log('Setting up callback: didFindService');
        bonjour.didFindService = function(service) { 
            root.didFindService(service); 
        };
//        bonjour.browse();
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