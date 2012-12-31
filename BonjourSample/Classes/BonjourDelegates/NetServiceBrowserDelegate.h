//
//  NetServiceBrowserDelegate.h
//  PHR
//
//  Created by Ross Martin on 12/9/12.
//
//

#import <Foundation/Foundation.h>

 
@interface NetServiceBrowserDelegate : NSObject
{
    // Keeps track of available services
    NSMutableArray *services;
    
    NSMutableArray *serviceNameArray; // RDM
 
    // Keeps track of search status
    BOOL searching;    
}
 
// NSNetServiceBrowser delegate methods for service browsing
- (void)netServiceBrowserWillSearch:(NSNetServiceBrowser *)browser;
- (void)netServiceBrowserDidStopSearch:(NSNetServiceBrowser *)browser;
- (void)netServiceBrowser:(NSNetServiceBrowser *)browser
        didNotSearch:(NSDictionary *)errorDict;
- (void)netServiceBrowser:(NSNetServiceBrowser *)browser
        didFindService:(NSNetService *)aNetService
        moreComing:(BOOL)moreComing;
- (void)netServiceBrowser:(NSNetServiceBrowser *)browser
        didRemoveService:(NSNetService *)aNetService
        moreComing:(BOOL)moreComing;
 
// Other methods
- (void)handleError:(NSNumber *)error;
- (void)updateUI;

@end
