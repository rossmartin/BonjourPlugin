//
//  NetServicePublicationDelegate.m
//  PHR
//
//  Created by Ross Martin on 12/9/12.
//
//

#import "NetServicePublicationDelegate.h"
#import "AppDelegate.h"
 
@implementation NetServicePublicationDelegate
 
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
 
// Sent when the service is about to publish
- (void)netServiceWillPublish:(NSNetService *)netService
{
    [services addObject:netService];
    // You may want to do something here, such as updating a user interface
    NSLog(@"netServiceWillPublish method is being called");
}
 
// Sent if publication fails
- (void)netService:(NSNetService *)netService
        didNotPublish:(NSDictionary *)errorDict
{
    NSLog(@"netServiceDidNotPublish method is being called");
    [self handleError:[errorDict objectForKey:NSNetServicesErrorCode] withService:netService];
    [services removeObject:netService];
}
 
// Sent when the service stops
- (void)netServiceDidStop:(NSNetService *)netService
{
    [services removeObject:netService];
    [servicesArray removeAllObjects]; // remove all indexes in servicesArray iVar
    // You may want to do something here, such as updating a user interface
    NSLog(@"netServiceDidStop method is done being called");
}
 
// Error handling code
- (void)handleError:(NSNumber *)error withService:(NSNetService *)service
{
    NSLog(@"An error occurred with service %@.%@.%@, error code = %@",
        [service name], [service type], [service domain], error);
    // Handle error here
}
 
@end
