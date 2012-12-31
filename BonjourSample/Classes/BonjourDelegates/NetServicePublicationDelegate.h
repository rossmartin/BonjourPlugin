//
//  NetServicePublicationDelegate.h
//  PHR
//
//  Created by Ross Martin on 12/9/12.
//
//

#import <Foundation/Foundation.h>
 
@interface NetServicePublicationDelegate : NSObject
{
    // Keeps track of active services or services about to be published
    NSMutableArray *services;
}
 
// NSNetService delegate methods for publication
- (void)netServiceWillPublish:(NSNetService *)netService;
- (void)netService:(NSNetService *)netService
        didNotPublish:(NSDictionary *)errorDict;
- (void)netServiceDidStop:(NSNetService *)netService;
 
// Other methods
- (void)handleError:(NSNumber *)error withService:(NSNetService *)service;
 
@end
