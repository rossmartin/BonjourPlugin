//
//  NetServiceBrowserDelegate.m
//  PHR
//
//  Created by Ross Martin on 12/9/12.
//
//

#import "NetServiceBrowserDelegate.h"
#import "NetServiceResolutionDelegate.h"
#import "AppDelegate.h"
#import <Foundation/NSJSONSerialization.h>
#import "BonjourPlugin.h"

@implementation NetServiceBrowserDelegate

- (id)init
{
    self = [super init];
    if (self) {
        services = [[NSMutableArray alloc] init];
        serviceNameArray = [[NSMutableArray alloc] init]; // class variable here
        servicesArray = [[NSMutableArray alloc] init]; // iVar made in AppDelegate
        searching = NO;
    }
    return self;
}
 
- (void)dealloc
{
    [services release];
    [super dealloc];
}
 
// Sent when browsing begins
- (void)netServiceBrowserWillSearch:(NSNetServiceBrowser *)browser
{
    NSLog(@"netServiceBrowserWillSearch method is being called");
    searching = YES;
    [self updateUI];
}
 
// Sent when browsing stops
- (void)netServiceBrowserDidStopSearch:(NSNetServiceBrowser *)browser
{
    NSLog(@"netServiceBrowserDidStopSearch method is being called");
    searching = NO;
    [self updateUI];
    [self dealloc];  // needed to completely remove ns browser instance
}
 
// Sent if browsing fails
- (void)netServiceBrowser:(NSNetServiceBrowser *)browser
        didNotSearch:(NSDictionary *)errorDict
{
    searching = NO;
    [self handleError:[errorDict objectForKey:NSNetServicesErrorCode]];
}
 
// Sent when a service appears
- (void)netServiceBrowser:(NSNetServiceBrowser *)browser
        didFindService:(NSNetService *)aNetService
        moreComing:(BOOL)moreComing
{
    NSLog(@"didFindService method is being called");
    [services addObject:aNetService]; // original
    [servicesArray addObject:aNetService]; // add this new net service object to servicesArray iVar
    NSLog(@"aNetService.name ====> %@", aNetService.name);
        
    if(!moreComing)
    {
        NSLog(@"didFindService method inside if(!moreComing) ");
        [serviceNameArray removeAllObjects]; // empty this if it has any indexes
        NSString *svcName; // var holds service name from array
        for (int i = 0; i < [services count]; i++){
            svcName = [[services objectAtIndex:i] name];
            svcName = [svcName stringByReplacingOccurrencesOfString:@"'" withString:@"&#39;"]; // replace apostrophe with html entity so json can be passed below
            //NSLog(@"svcName in for loop === > %@", svcName);
            [serviceNameArray addObject:svcName]; // add service to serviceNameArray
        }
        
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:serviceNameArray options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *jsonEscaped = [jsonString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]; // URL encode
        //NSLog(@"jsonEscaped ===> %@", jsonEscaped);
        
        AppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];

        NSLog(@"JSS: Calling _didFindService");
        NSString *jsCallBack = [[NSString alloc] initWithFormat:@"window.plugins.bonjour.didFindService('%@');", jsonEscaped];
        [appDelegate.viewController.webView stringByEvaluatingJavaScriptFromString:jsCallBack];
        
        [self updateUI];
    }
    //NSLog(@"didFindService method is done being called");
}
 
// Sent when a service disappears
- (void)netServiceBrowser:(NSNetServiceBrowser *)browser
        didRemoveService:(NSNetService *)aNetService
        moreComing:(BOOL)moreComing
{
    NSLog(@"didRemoveService method is being called");
    NSLog(@"inside didRemoveService NetServiceBrowserDelegate.m [aNetService name] ===> %@", [aNetService name]);
    [services removeObject:aNetService];
    [servicesArray removeObject:aNetService]; // remove from servicesArray iVar
 
    NSString *serviceNameEscaped;
    serviceNameEscaped = [[aNetService name] stringByReplacingOccurrencesOfString:@"'" withString:@"&#39;"]; // replace apostrophe with html entity so string can be passed below
    serviceNameEscaped = [serviceNameEscaped stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]; // URL encode
    AppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
    NSString *jsCallBack = [[NSString alloc] initWithFormat:@"removeNetworkDevice('%@');", serviceNameEscaped]; // removeNetworkDevice in bonjour.js
    //NSLog(@"jsCallBack ===> %@", jsCallBack);
    [appDelegate.viewController.webView stringByEvaluatingJavaScriptFromString:jsCallBack];
    
    if(!moreComing)
    {
        NSLog(@"didRemoveService if (!moreComing)");
        [self updateUI];
    }
}
 
// Error handling code
- (void)handleError:(NSNumber *)error
{
    NSLog(@"An error occurred. Error code = %d", [error intValue]);
    // Handle error here
}
 
// UI update code
- (void)updateUI
{
    NSLog(@"updateUI method is being called");
    if(searching)
    {
        // Update the user interface to indicate searching
        // Also update any UI that lists available services
        NSLog(@"updateUI - searching");
    }
    else
    {
        // Update the user interface to indicate not searching
        NSLog(@"updateUI - done searching");
    }
}

@end
