import {registerBidder} from '../src/adapters/bidderFactory.js';
import {BANNER} from '../src/mediaTypes.js';
import {generateUUID} from '../src/utils.js';

// ------------------------------------
const BIDDER_CODE = 'cwire';
export const ENDPOINT_URL = 'https://embed.cwi.re/prebid/bid';
// ------------------------------------
export const CW_PAGE_VIEW_ID = generateUUID();

export const spec = {
  code: BIDDER_CODE,
  supportedMediaTypes: [BANNER],
  /**
   * Determines whether or not the given bid request is valid.
   *
   * @param {BidRequest} bid The bid params to validate.
   * @return boolean True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: function(bid) {
    return true;
  },

  /**
   * Make a server request from the list of BidRequests.
   *
   * @param {validBidRequests[]} - an array of bids
   * @return ServerRequest Info describing the request to the server.
   */
  buildRequests: function(validBidRequests) {
    const payload = {
      /*
      Use `bidderRequest.bids[]` to get bidder-dependent
      request info.

      If your bidder supports multiple currencies, use
      `config.getConfig(currency)` to find which one the ad
      server needs.

      Pull the requested transaction ID from
      `bidderRequest.bids[].transactionId`.
      */
    };
    const payloadString = JSON.stringify(payload);
    return {
      method: 'POST',
      url: ENDPOINT_URL,
      data: payloadString,
    };
  },
  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param {ServerResponse} serverResponse A successful response from the server.
   * @return {Bid[]} An array of bids which were nested inside the server.
   */
  interpretResponse: function(serverResponse, bidRequest) {
    const bidResponses = [];

    const bids = serverResponse.body?.bids || [];
    bids.forEach(bid => {
      const bidResponse = {
        requestId: bid.requestId,
        cpm: bid.cpm,
        bidderCode: BIDDER_CODE,
        width: '400',
        height: '750',
        creativeId: bid.creativeId,
        currency: bid.currency,
        netRevenue: bid.netRevenue,
        ttl: bid.ttl,
        meta: {
          advertiserDomains: bid.adomains ? bid.adomains : [],
        },
        ad: bid.html
      };

      bidResponses.push(bidResponse);
    });
    return bidResponses;
  },
}
registerBidder(spec);
