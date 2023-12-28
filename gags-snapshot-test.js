import findCombo from './gags.js';

const gagTracks = ['sound', 'throw', 'squirt', 'drop'];

let stunTrack = undefined;
let organicGags = {};
let isLured = false;

function main() {
  for (const gagTrack of gagTracks) {
    for (let cogLvl = 12; cogLvl >= 1; cogLvl--) {
      for (let numToons = 4; numToons >= 1; numToons--) {
        if (gagTrack === 'drop') {
          if (numToons == 1) continue;
          for (const stunTrack of ['sound', 'throw', 'squirt']) {
            const combo = findCombo({ numToons, cogLvl, gagTrack, stunTrack, organicGags, isLured });
            console.log(combo.toString());
          }
        } else {
          const combo = findCombo({ numToons, cogLvl, gagTrack, stunTrack, organicGags, isLured });
          console.log(combo.toString());
        }
      }
    }
  }
}

main();

