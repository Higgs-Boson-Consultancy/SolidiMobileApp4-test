// Note: Need to import each image individually.
// - The function "require" can't accept a variable.
// Reason: Webpack can only bundle resources that it can identify at bundle time.

import solidi from './solidi.png';
import trustpilot from './trustpilot.png';
import asset_icons from './asset_icons';

let { GBP, BTC, ETH } = asset_icons;


let ImageLookup = {
  solidi,
  trustpilot,
  GBP,
  BTC,
  ETH,
  asset_icons,
}

export default ImageLookup;
