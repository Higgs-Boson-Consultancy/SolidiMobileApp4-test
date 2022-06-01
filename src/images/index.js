// Note: Need to import each image individually.
// - The function "require" can't accept a variable.
// Reason: Webpack can only bundle resources that it can identify at bundle time.

import solidi_logo_landscape_black_1924x493 from './solidi_logo_landscape_black_1924x493.png';
import trustpilot from './trustpilot.png';
import asset_icons from './asset_icons';

let { GBP, BTC, ETH } = asset_icons;


let ImageLookup = {
  solidi_logo_landscape_black_1924x493,
  trustpilot,
  GBP,
  BTC,
  ETH,
  asset_icons,
}

export default ImageLookup;
