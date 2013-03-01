//
//  NetServiceResolutionDelegate.m
//  PHR
//
//  Created by Ross Martin on 12/9/12.
//
//

#import "NetServiceResolutionDelegate.h"
#import <sys/socket.h>
#import <netinet/in.h>
#import "GCDAsyncSocket.h"
#import "AppDelegate.h"
#import "BonjourPlugin.h"
#import "SocketClientDelegate.h" // client socket delegate methods are in SocketClientDelegate
 
@implementation NetServiceResolutionDelegate
 
- (id)init
{
    self = [super init];
    if (self) {
        services = [[NSMutableArray alloc] init];
    }
    return self;
}
 
- (void)dealloc
{
    [services release];
    [super dealloc];
}
 
// Sent when addresses are resolved
- (void)netServiceDidResolveAddress:(NSNetService *)netService
{
    NSLog(@"netServiceDidResolveAddress method is executing");
    // Make sure [netService addresses] contains the
    // necessary connection information
    if ([self addressesComplete:[netService addresses]
            forServiceType:[netService type]]) {
        [services addObject:netService];
    }

    NSString *name = nil;
    NSString *hostName = nil;
    NSData *address = nil;
    name = [netService name];
    hostName = [netService hostName];
    address = [[netService addresses] objectAtIndex: 0];
    
    NSLog(@"address =====> %@", address); // prints out a pointer memory address.  mac, ip, & port can be given from this
    NSLog(@"name ====> %@", name);
    NSLog(@"hostName ===> %@", hostName);

    SocketClientDelegate *clientDelegate; // all the client socket delegate methods will be in SocketClientDelegate.m
    clientDelegate = [[SocketClientDelegate alloc] init];
    
    GCDAsyncSocket *socket;
    socket = [[GCDAsyncSocket alloc] initWithDelegate:clientDelegate delegateQueue:dispatch_get_main_queue()];
    NSError *err = nil;
    //if (![socket connectToHost:ipString onPort:port error:&err]) // Asynchronous!
    if (![socket connectToAddress:address error:&err]) // connect using raw address instead of ip, it is easier
    {
        // If there was an error, it's likely something like "already connected" or "no delegate set"
        NSLog(@"I goofed: %@", err);
    }

    NSLog(@"*********** CONNECTED ************");
}
 
// Sent if resolution fails
- (void)netService:(NSNetService *)netService
        didNotResolve:(NSDictionary *)errorDict
{
    //NSLog(@"netServiceDidNotResolve method is executing");
    //[self handleError:[errorDict objectForKey:NSNetServicesErrorCode]];
    AppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
    [appDelegate.viewController.webView stringByEvaluatingJavaScriptFromString:@"resetBrowserPage();"]; // resetBrowserPage call in case there is an error in resolution
    [services removeObject:netService];
}
 
// Verifies [netService addresses]
- (BOOL)addressesComplete:(NSArray *)addresses
        forServiceType:(NSString *)serviceType
{
    //NSLog(@"addressesComplete forServiceType method is executing");
    // Perform appropriate logic to ensure that [netService addresses]
    // contains the appropriate information to connect to the service
    return YES;
}
 
// Error handling code
- (void)handleError:(NSNumber *)error withService:(NSNetService *)service
{
    NSLog(@"An error occurred with service %@.%@.%@, error code = %@",
        [service name], [service type], [service domain], error);
    // Handle error here
}
 
@end