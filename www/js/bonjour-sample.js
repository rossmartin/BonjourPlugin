function setupBonjour() {
    console.log('Setting up bonjour');
    var root = this;

    bonjour = window.plugins.bonjour;

    if (bonjour !== null) {
        console.log('Setting up callback: didFindService');
        bonjour.didFindService = function(service) { 
//            console.log('bonjour.didFindService');
//            console.log(service);
            root.didFindService(service); 
        };
//        console.log('Calling browse.');
        bonjour.browse();
    }
    
}

function didFindService() {
    console.log("Sample.didFindService-> function");
}