import findCombo, { findComboV2 } from './gags.js';

const gagTracks = ['sound', 'throw', 'squirt', 'drop'];

let stunTrack = undefined;
let organicGags = {};
let isLured = false;

function main() {
  for (const gagTrack of gagTracks) {
    for (let cogLvl = 12; cogLvl >= 1; cogLvl--) {
      for (let numToons = 4; numToons >= 1; numToons--) {
        if (gagTrack === 'drop') {
          if (numToons === 1) continue;
          for (const stunTrack of ['sound', 'throw', 'squirt']) {
            const combo = findComboV2({
              cogLvl,
              isLured,
              gags: {
                drop: numToons - 1,
                [stunTrack]: 1,
              },
              organicGags,
            });
            console.log(combo.toString());
          }
        } else {
          const combo = findComboV2({
            cogLvl,
            isLured,
            gags: {
              [gagTrack]: numToons,
            },
            organicGags,
          });
          console.log(combo.toString());
        }
      }
    }
  }
}

main();

