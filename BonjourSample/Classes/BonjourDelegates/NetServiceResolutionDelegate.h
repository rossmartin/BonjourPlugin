//
//  Header.h
//  PHR
//
//  Created by Ross Martin on 12/9/12.
//
//

#import <Foundation/Foundation.h>
#import "GCDAsyncSocket.h"

@interface NetServiceResolutionDelegate : NSObject
{
    // Keeps track of services handled by this delegate
    NSMutableArray *services;
    GCDAsyncSocket *socket;
}
 
// NSNetService delegate methods for publication
- (void)netServiceDidResolveAddress:(NSNetService *)netService;
- (void)netService:(NSNetService *)netService
        didNotResolve:(NSDictionary *)errorDict;
 
// Other methods
- (BOOL)addressesComplete:(NSArray *)addresses
        forServiceType:(NSString *)serviceType;
- (void)handleError:(NSNumber *)error withService:(NSNetService *)service;

- (GCDAsyncSocket *)socket;


@end
